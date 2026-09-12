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
    }>;

export type RealtimeAttemptResult =
  | Readonly<{ status: "ready"; attemptId: string }>
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
    invitationId: string;
    candidateId: string;
    interviewerVersionId: string;
  }) => Promise<RealtimeAttemptResult>;
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
      providerCredential: ProviderCredential;
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
    !isEligibleLifecycle(candidateSession.lifecycle)
  ) {
    return unavailable;
  }

  const attempt = await deps.getOrCreateAttempt({
    invitationId: candidateSession.invitationId,
    candidateId: candidateSession.candidateId,
    interviewerVersionId: candidateSession.interviewerVersionId,
  });

  if (attempt.status !== "ready") return unavailable;

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
    providerCredential,
  };
}
