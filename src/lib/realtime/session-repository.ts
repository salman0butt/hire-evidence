import { hashInvitationToken } from "@/lib/candidates/invitation-token";

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

function isNonEmptyString(value: unknown): value is string {
  return typeof value === "string" && value.trim().length > 0;
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

export function createRealtimeSessionRepository(rpc: Rpc): Pick<
  RealtimeSessionAuthorizationDeps,
  "resolveCandidateSession" | "getOrCreateAttempt"
> {
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

      if (error || !isNonEmptyString(data)) return { status: "conflict" };

      return { status: "ready", attemptId: data };
    },
  };
}
