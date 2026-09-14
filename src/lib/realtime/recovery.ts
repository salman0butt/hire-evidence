export type RealtimeFailureKind =
  | "microphone-lost"
  | "browser-unsupported"
  | "provider-closed"
  | "provider-error"
  | "credential-expired"
  | "send-failed"
  | "decode-failed"
  | "interview-timeout"
  | "authorization-denied"
  | "consent-missing"
  | "invitation-unavailable";

export type RealtimeTechnicalFailure = Readonly<{
  kind: RealtimeFailureKind;
  detail?: string;
}>;

export type RealtimeRecoveryInput = Readonly<{
  failure: RealtimeTechnicalFailure;
  retryCount: number;
  maxRetries: number;
  attemptStatus: "active" | "completed";
}>;

export type RealtimeRecoveryDecision = Readonly<{
  action: "retry" | "recover-input" | "end-safe";
  reason: string;
  affectsEvaluation: false;
}>;

const RETRYABLE_FAILURES = new Set<RealtimeFailureKind>([
  "provider-closed",
  "provider-error",
  "credential-expired",
  "send-failed",
  "decode-failed",
]);

const TECHNICAL_END_REASON = "The interview cannot continue because of a technical issue.";

export function decideRealtimeRecovery(
  input: RealtimeRecoveryInput,
): RealtimeRecoveryDecision {
  if (input.attemptStatus === "completed") {
    return {
      action: "end-safe",
      reason: TECHNICAL_END_REASON,
      affectsEvaluation: false,
    };
  }

  if (input.failure.kind === "microphone-lost") {
    return {
      action: "recover-input",
      reason: "Microphone access was interrupted. Check your microphone and try again.",
      affectsEvaluation: false,
    };
  }

  if (
    RETRYABLE_FAILURES.has(input.failure.kind) &&
    Number.isInteger(input.retryCount) &&
    Number.isInteger(input.maxRetries) &&
    input.retryCount >= 0 &&
    input.maxRetries >= 0 &&
    input.retryCount < input.maxRetries
  ) {
    return {
      action: "retry",
      reason: "The interview connection was interrupted. We will try to reconnect.",
      affectsEvaluation: false,
    };
  }

  return {
    action: "end-safe",
    reason: TECHNICAL_END_REASON,
    affectsEvaluation: false,
  };
}
