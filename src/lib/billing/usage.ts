export type AuthoritativeInterviewUsageInput = {
  organizationId: string;
  attemptId: string;
  finalizedDurationSeconds: number;
};

type UsageRecordResult = { status: "recorded" | "duplicate" };

type AuthoritativeInterviewUsageDependencies = {
  recordUsage(input: {
    organizationId: string;
    attemptId: string;
    interviewSeconds: number;
  }): Promise<UsageRecordResult>;
};

export async function recordAuthoritativeInterviewUsage(
  input: AuthoritativeInterviewUsageInput,
  dependencies: AuthoritativeInterviewUsageDependencies,
): Promise<UsageRecordResult> {
  if (!Number.isSafeInteger(input.finalizedDurationSeconds) || input.finalizedDurationSeconds <= 0) {
    throw new Error("Invalid authoritative interview duration");
  }

  return dependencies.recordUsage({
    organizationId: input.organizationId,
    attemptId: input.attemptId,
    interviewSeconds: input.finalizedDurationSeconds,
  });
}
