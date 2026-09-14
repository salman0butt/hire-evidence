export const REALTIME_FOLLOW_UP_ABSOLUTE_LIMIT = 3;

const ALLOWED_INSTRUCTIONS = Object.freeze({
  clarification: "Ask a neutral clarification about the current job-related answer.",
  "concrete-example": "Ask for one concrete job-related example for the current question.",
  "missing-job-dimension":
    "Ask about one missing job-related dimension already covered by the current question.",
} as const);

export type RealtimeFollowUpDecision =
  | Readonly<{ status: "allowed"; instruction: string }>
  | Readonly<{
      status: "denied";
      reason: "category-not-allowed" | "follow-up-limit-reached" | "invalid-policy-state";
    }>;

export type RealtimeFollowUpPolicyInput = Readonly<{
  requestedCategory: string;
  configuredLimit: number;
  currentCount: number;
}>;

function isNonNegativeInteger(value: number): boolean {
  return Number.isInteger(value) && value >= 0;
}

export function decideRealtimeFollowUp(
  input: RealtimeFollowUpPolicyInput,
): RealtimeFollowUpDecision {
  if (!isNonNegativeInteger(input.configuredLimit) || !isNonNegativeInteger(input.currentCount)) {
    return Object.freeze({ status: "denied", reason: "invalid-policy-state" });
  }

  if (!Object.prototype.hasOwnProperty.call(ALLOWED_INSTRUCTIONS, input.requestedCategory)) {
    return Object.freeze({ status: "denied", reason: "category-not-allowed" });
  }

  const effectiveLimit = Math.min(input.configuredLimit, REALTIME_FOLLOW_UP_ABSOLUTE_LIMIT);
  if (input.currentCount >= effectiveLimit) {
    return Object.freeze({ status: "denied", reason: "follow-up-limit-reached" });
  }

  const category = input.requestedCategory as keyof typeof ALLOWED_INSTRUCTIONS;
  return Object.freeze({
    status: "allowed",
    instruction: ALLOWED_INSTRUCTIONS[category],
  });
}
