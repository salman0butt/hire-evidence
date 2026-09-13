import { hashInvitationToken } from "@/lib/candidates/invitation-token";

import type { RealtimeResumeCheckpoint } from "./reconnect";
import type {
  CandidateRealtimeSession,
  RealtimeAttemptResult,
  RealtimeSessionAuthorizationDeps,
} from "./session-authorization";

type RpcResult = Readonly<{
  data: unknown;
  error: unknown;
}>;

type Rpc = (
  name: string,
  args: Readonly<Record<string, unknown>>,
) => Promise<RpcResult>;

type CandidateSessionRow = Readonly<{
  invitation_id: string;
  candidate_id: string;
  interviewer_version_id: string;
  duration_seconds: number;
  language: string;
  lifecycle: "sent" | "opened" | "started";
  has_current_consent: boolean;
}>;

type RealtimeAttemptRow = Readonly<{
  attempt_id: string;
  interviewer_version_id: string;
  resume_section_index: number;
  resume_question_index: number;
  resume_follow_ups_used: Readonly<Record<string, number>>;
  processed_event_ids: readonly string[];
}>;

type RealtimeProgressRow = Readonly<{
  attempt_state: "active" | "completed";
  resume_section_index: number;
  resume_question_index: number;
  resume_follow_ups_used: Readonly<Record<string, number>>;
  processed_event_ids: readonly string[];
}>;

export type RealtimeAttemptProgressResult =
  | Readonly<{
      status: "active";
      checkpoint: RealtimeResumeCheckpoint;
    }>
  | Readonly<{ status: "completed" }>
  | Readonly<{ status: "conflict" }>;

export type RealtimeSessionRepository = Pick<
  RealtimeSessionAuthorizationDeps,
  "resolveCandidateSession" | "getOrCreateAttempt"
> &
  Readonly<{
    advanceAttemptProgress(input: Readonly<{
      rawToken: string;
      attemptId: string;
      eventId: string;
      questionId: string;
      interviewerVersionId: string;
    }>): Promise<RealtimeAttemptProgressResult>;
  }>;

function isNonEmptyString(value: unknown): value is string {
  return typeof value === "string" && value.trim().length > 0;
}

function isNonNegativeInteger(value: unknown): value is number {
  return typeof value === "number" && Number.isInteger(value) && value >= 0;
}

function isFollowUpsUsed(value: unknown): value is Readonly<Record<string, number>> {
  if (!value || typeof value !== "object" || Array.isArray(value)) return false;

  return Object.entries(value).every(
    ([questionId, used]) => isNonEmptyString(questionId) && isNonNegativeInteger(used),
  );
}

function isProcessedEventIds(value: unknown): value is readonly string[] {
  return (
    Array.isArray(value) &&
    value.every(isNonEmptyString) &&
    new Set(value).size === value.length
  );
}

function isCandidateSessionRow(value: unknown): value is CandidateSessionRow {
  if (!value || typeof value !== "object") return false;

  const row = value as Record<string, unknown>;
  return (
    isNonEmptyString(row.invitation_id) &&
    isNonEmptyString(row.candidate_id) &&
    isNonEmptyString(row.interviewer_version_id) &&
    typeof row.duration_seconds === "number" &&
    Number.isInteger(row.duration_seconds) &&
    row.duration_seconds > 0 &&
    isNonEmptyString(row.language) &&
    (row.lifecycle === "sent" ||
      row.lifecycle === "opened" ||
      row.lifecycle === "started") &&
    typeof row.has_current_consent === "boolean"
  );
}

function isRealtimeAttemptRow(value: unknown): value is RealtimeAttemptRow {
  if (!value || typeof value !== "object") return false;

  const row = value as Record<string, unknown>;
  return (
    isNonEmptyString(row.attempt_id) &&
    isNonEmptyString(row.interviewer_version_id) &&
    isNonNegativeInteger(row.resume_section_index) &&
    isNonNegativeInteger(row.resume_question_index) &&
    isFollowUpsUsed(row.resume_follow_ups_used) &&
    isProcessedEventIds(row.processed_event_ids)
  );
}

function isRealtimeProgressRow(value: unknown): value is RealtimeProgressRow {
  if (!value || typeof value !== "object") return false;

  const row = value as Record<string, unknown>;
  return (
    (row.attempt_state === "active" || row.attempt_state === "completed") &&
    isNonNegativeInteger(row.resume_section_index) &&
    isNonNegativeInteger(row.resume_question_index) &&
    isFollowUpsUsed(row.resume_follow_ups_used) &&
    isProcessedEventIds(row.processed_event_ids)
  );
}

function toResumeCheckpoint(row: RealtimeAttemptRow): RealtimeResumeCheckpoint {
  return Object.freeze({
    interviewerVersionId: row.interviewer_version_id,
    sectionIndex: row.resume_section_index,
    questionIndex: row.resume_question_index,
    followUpsUsed: Object.freeze({ ...row.resume_follow_ups_used }),
    processedEventIds: Object.freeze([...row.processed_event_ids]),
  });
}

export function createRealtimeSessionRepository(rpc: Rpc): RealtimeSessionRepository {
  return {
    async resolveCandidateSession(rawToken): Promise<CandidateRealtimeSession> {
      if (!rawToken) return { status: "unavailable" };

      const { data, error } = await rpc("resolve_realtime_candidate_session", {
        p_token_hash: hashInvitationToken(rawToken),
      });

      if (error || !Array.isArray(data) || data.length !== 1) {
        return { status: "unavailable" };
      }

      const row = data[0];
      if (!isCandidateSessionRow(row)) return { status: "unavailable" };

      return {
        status: "available",
        invitationId: row.invitation_id,
        candidateId: row.candidate_id,
        interviewerVersionId: row.interviewer_version_id,
        durationSeconds: row.duration_seconds,
        language: row.language,
        lifecycle: row.lifecycle,
        hasCurrentConsent: row.has_current_consent,
      };
    },

    async getOrCreateAttempt(input): Promise<RealtimeAttemptResult> {
      if (!input.rawToken) return { status: "conflict" };

      const { data, error } = await rpc("authorize_realtime_interview_session", {
        p_token_hash: hashInvitationToken(input.rawToken),
      });

      if (error) return { status: "conflict" };

      if (isNonEmptyString(data)) {
        return { status: "ready", attemptId: data };
      }

      if (!Array.isArray(data) || data.length !== 1 || !isRealtimeAttemptRow(data[0])) {
        return { status: "conflict" };
      }

      const row = data[0];
      return {
        status: "ready",
        attemptId: row.attempt_id,
        resumeCheckpoint: toResumeCheckpoint(row),
      };
    },

    async advanceAttemptProgress(input): Promise<RealtimeAttemptProgressResult> {
      if (
        !input.rawToken ||
        !input.attemptId ||
        !input.eventId ||
        !input.questionId ||
        !input.interviewerVersionId
      ) {
        return { status: "conflict" };
      }

      const { data, error } = await rpc("advance_realtime_interview_session", {
        p_token_hash: hashInvitationToken(input.rawToken),
        p_attempt_id: input.attemptId,
        p_event_id: input.eventId,
        p_question_id: input.questionId,
      });

      if (error || !Array.isArray(data) || data.length !== 1 || !isRealtimeProgressRow(data[0])) {
        return { status: "conflict" };
      }

      const row = data[0];
      if (row.attempt_state === "completed") {
        return { status: "completed" };
      }

      return {
        status: "active",
        checkpoint: Object.freeze({
          interviewerVersionId: input.interviewerVersionId,
          sectionIndex: row.resume_section_index,
          questionIndex: row.resume_question_index,
          followUpsUsed: Object.freeze({ ...row.resume_follow_ups_used }),
          processedEventIds: Object.freeze([...row.processed_event_ids]),
        }),
      };
    },
  };
}
