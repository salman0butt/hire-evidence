export type RetentionPolicy = Readonly<{
  organizationId: string;
  transcriptDays: number;
  assessmentDays: number;
  evidenceDays: number;
  aiTraceDays: number;
}>;

export type RetentionPolicyInput = {
  organizationId: string;
  transcriptDays: number;
  assessmentDays: number;
  evidenceDays: number;
  aiTraceDays: number;
};

export type RetentionArtifact = "transcript" | "assessment" | "evidence" | "ai_trace";

const MIN_RETENTION_DAYS = 1;
const MAX_RETENTION_DAYS = 3650;

function isValidRetentionDays(value: unknown): value is number {
  return (
    typeof value === "number" &&
    Number.isInteger(value) &&
    value >= MIN_RETENTION_DAYS &&
    value <= MAX_RETENTION_DAYS
  );
}

export function createRetentionPolicy(input: RetentionPolicyInput): RetentionPolicy {
  if (
    typeof input.organizationId !== "string" ||
    input.organizationId.trim().length === 0 ||
    !isValidRetentionDays(input.transcriptDays) ||
    !isValidRetentionDays(input.assessmentDays) ||
    !isValidRetentionDays(input.evidenceDays) ||
    !isValidRetentionDays(input.aiTraceDays)
  ) {
    throw new Error("invalid retention policy");
  }

  return Object.freeze({
    organizationId: input.organizationId,
    transcriptDays: input.transcriptDays,
    assessmentDays: input.assessmentDays,
    evidenceDays: input.evidenceDays,
    aiTraceDays: input.aiTraceDays,
  });
}

export function getEffectiveRetentionDays(
  policy: RetentionPolicy,
  artifact: RetentionArtifact,
): number {
  switch (artifact) {
    case "transcript":
      return policy.transcriptDays;
    case "assessment":
      return policy.assessmentDays;
    case "evidence":
      return policy.evidenceDays;
    case "ai_trace":
      return policy.aiTraceDays;
  }
}
