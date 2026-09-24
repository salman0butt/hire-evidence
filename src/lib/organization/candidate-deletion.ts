export type CandidateDeletionCounts = Readonly<{
  transcripts: number;
  assessments: number;
  evidence: number;
  audio: number;
  aiTraces: number;
}>;

type CandidateDeletionIdentity = Readonly<{
  organizationId: string;
  candidateId: string;
  requestedBy: string;
  requestedAt: string;
}>;

export type PendingCandidateDeletion = CandidateDeletionIdentity &
  Readonly<{ status: "pending" }>;

export type CompletedCandidateDeletion = CandidateDeletionIdentity &
  Readonly<{
    status: "completed";
    completedAt: string;
    deleted: CandidateDeletionCounts;
  }>;

export type FailedCandidateDeletion = CandidateDeletionIdentity &
  Readonly<{
    status: "failed";
    failedAt: string;
    code: "artifact_delete_failed";
  }>;

export type CandidateDeletion =
  | PendingCandidateDeletion
  | CompletedCandidateDeletion
  | FailedCandidateDeletion;

function requireNonEmpty(value: string, field: string): string {
  const normalized = value.trim();
  if (!normalized) {
    throw new Error(`${field} is required`);
  }
  return normalized;
}

function requireTimestamp(value: string, field: string): string {
  const normalized = requireNonEmpty(value, field);
  if (!Number.isFinite(Date.parse(normalized))) {
    throw new Error(`${field} must be a valid timestamp`);
  }
  return normalized;
}

function freezeCounts(counts: CandidateDeletionCounts): CandidateDeletionCounts {
  const entries = Object.entries(counts);
  for (const [artifact, count] of entries) {
    if (!Number.isSafeInteger(count) || count < 0) {
      throw new Error(`${artifact} deletion count must be a non-negative safe integer`);
    }
  }
  return Object.freeze({ ...counts });
}

export function beginCandidateDeletion(
  input: CandidateDeletionIdentity,
): PendingCandidateDeletion {
  return Object.freeze({
    organizationId: requireNonEmpty(input.organizationId, "organizationId"),
    candidateId: requireNonEmpty(input.candidateId, "candidateId"),
    requestedBy: requireNonEmpty(input.requestedBy, "requestedBy"),
    requestedAt: requireTimestamp(input.requestedAt, "requestedAt"),
    status: "pending" as const,
  });
}

export function completeCandidateDeletion(
  deletion: CandidateDeletion,
  result: Readonly<{
    completedAt: string;
    deleted: CandidateDeletionCounts;
  }>,
): CompletedCandidateDeletion {
  if (deletion.status === "completed") {
    return deletion;
  }
  if (deletion.status !== "pending") {
    throw new Error("only a pending deletion can be completed");
  }

  return Object.freeze({
    ...deletion,
    status: "completed" as const,
    completedAt: requireTimestamp(result.completedAt, "completedAt"),
    deleted: freezeCounts(result.deleted),
  });
}

export function recordDeletionFailure(
  deletion: CandidateDeletion,
  failure: Readonly<{
    failedAt: string;
    code: "artifact_delete_failed";
  }>,
): FailedCandidateDeletion {
  if (deletion.status !== "pending") {
    throw new Error("only a pending deletion can fail");
  }

  return Object.freeze({
    ...deletion,
    status: "failed" as const,
    failedAt: requireTimestamp(failure.failedAt, "failedAt"),
    code: failure.code,
  });
}
