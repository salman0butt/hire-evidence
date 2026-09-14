import type { InterviewPlanInput } from "./plan-runner";
import type { RealtimeResumeCheckpoint } from "./reconnect";
import type {
  DurableTranscriptTurn,
  ListFinalizedTurnsResult,
} from "./transcript-repository";

export type CandidateRealtimeSession =
  | Readonly<{ status: "unavailable" }>
  | Readonly<{
      status: "available";
      invitationId: string;
      candidateId: string;
      interviewerVersionId: string | null;
      durationSeconds: number;
      language: string;
      hasCurrentConsent: boolean;
      lifecycle: "sent" | "opened" | "started" | "completed";
      interviewPlan: InterviewPlanInput;
    }>;

export type RealtimeAttemptResult =
  | Readonly<{
      status: "ready";
      attemptId: string;
      resumeCheckpoint?: RealtimeResumeCheckpoint | undefined;
    }>
  | Readonly<{ status: "conflict" }>;

export type ProviderCredential = Readonly<{
  credential: string;
  expiresAt: string;
}>;

export type RealtimeSessionAuthorizationDeps = Readonly<{
  resolveCandidateSession: (
    rawToken: string,
  ) => Promise<CandidateRealtimeSession>;
  getOrCreateAttempt: (input: {
    rawToken: string;
    invitationId: string;
    candidateId: string;
    interviewerVersionId: string;
  }) => Promise<RealtimeAttemptResult>;
  listFinalizedTurns?: ((input: {
    rawToken: string;
    attemptId: string;
  }) => Promise<ListFinalizedTurnsResult>) | undefined;
  issueProviderCredential: (input: {
    attemptId: string;
    interviewerVersionId: string;
    durationSeconds: number;
    language: string;
  }) => Promise<ProviderCredential>;
}>;

export type RealtimeSessionAuthorization =
  | Readonly<{ status: "unavailable" }>
  | Readonly<{
      status: "authorized";
      attemptId: string;
      interviewerVersionId: string;
      durationSeconds: number;
      language: string;
      interviewPlan: InterviewPlanInput;
      providerCredential: ProviderCredential;
      resumeCheckpoint?: RealtimeResumeCheckpoint | undefined;
      transcriptTurns?: readonly DurableTranscriptTurn[] | undefined;
    }>;

const unavailable: RealtimeSessionAuthorization = { status: "unavailable" };

function isEligibleLifecycle(
  lifecycle: "sent" | "opened" | "started" | "completed",
): boolean {
  return (
    lifecycle === "sent" || lifecycle === "opened" || lifecycle === "started"
  );
}

export async function authorizeRealtimeSession(
  rawToken: string,
  deps: RealtimeSessionAuthorizationDeps,
): Promise<RealtimeSessionAuthorization> {
  if (!rawToken) return unavailable;

  const candidateSession = await deps.resolveCandidateSession(rawToken);
  if (candidateSession.status !== "available") return unavailable;

  if (
    !candidateSession.hasCurrentConsent ||
    !candidateSession.interviewerVersionId ||
    candidateSession.interviewPlan.versionId !== candidateSession.interviewerVersionId ||
    !isEligibleLifecycle(candidateSession.lifecycle)
  ) {
    return unavailable;
  }

  const attempt = await deps.getOrCreateAttempt({
    rawToken,
    invitationId: candidateSession.invitationId,
    candidateId: candidateSession.candidateId,
    interviewerVersionId: candidateSession.interviewerVersionId,
  });

  if (attempt.status !== "ready") return unavailable;

  let transcriptTurns: readonly DurableTranscriptTurn[] | undefined;
  if (candidateSession.lifecycle === "started") {
    if (!deps.listFinalizedTurns) return unavailable;

    const transcript = await deps.listFinalizedTurns({
      rawToken,
      attemptId: attempt.attemptId,
    });
    if (transcript.status !== "available") return unavailable;
    transcriptTurns = transcript.turns;
  }

  const providerCredential = await deps.issueProviderCredential({
    attemptId: attempt.attemptId,
    interviewerVersionId: candidateSession.interviewerVersionId,
    durationSeconds: candidateSession.durationSeconds,
    language: candidateSession.language,
  });

  return {
    status: "authorized",
    attemptId: attempt.attemptId,
    interviewerVersionId: candidateSession.interviewerVersionId,
    durationSeconds: candidateSession.durationSeconds,
    language: candidateSession.language,
    interviewPlan: candidateSession.interviewPlan,
    providerCredential,
    ...(attempt.resumeCheckpoint
      ? { resumeCheckpoint: attempt.resumeCheckpoint }
      : {}),
    ...(transcriptTurns ? { transcriptTurns } : {}),
  };
}
