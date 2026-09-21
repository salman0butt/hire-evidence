export type CandidateReviewStatus = "awaiting_review" | "in_review" | "reviewed";

export type CandidateReviewScope = Readonly<{
  organizationId: string;
  jobId: string;
  candidateId: string;
  attemptId: string;
  assessmentGenerationId: string;
}>;

export type CandidateReviewInput = Readonly<{
  status: CandidateReviewStatus;
  reviewerNotes: string | null;
}>;

export type CandidateReview = Readonly<{
  organizationId: string;
  jobId: string;
  candidateId: string;
  attemptId: string;
  assessmentGenerationId: string;
  status: CandidateReviewStatus;
  reviewerNotes: string | null;
  reviewerUserId: string;
  updatedAt: string;
}>;

type RpcResult = { data: unknown; error: unknown };
type RpcClient = { rpc: (name: string, args: Record<string, unknown>) => PromiseLike<RpcResult> };

type CandidateReviewRow = {
  organization_id: string;
  job_id: string;
  candidate_id: string;
  attempt_id: string;
  assessment_generation_id: string;
  status: CandidateReviewStatus;
  reviewer_notes: string | null;
  reviewer_user_id: string;
  updated_at: string;
};

function isNonEmpty(value: unknown): value is string {
  return typeof value === "string" && value.trim().length > 0;
}

function isStatus(value: unknown): value is CandidateReviewStatus {
  return value === "awaiting_review" || value === "in_review" || value === "reviewed";
}

function isReviewRow(value: unknown): value is CandidateReviewRow {
  if (!value || typeof value !== "object" || Array.isArray(value)) return false;
  const row = value as Record<string, unknown>;
  return (
    isNonEmpty(row.organization_id) &&
    isNonEmpty(row.job_id) &&
    isNonEmpty(row.candidate_id) &&
    isNonEmpty(row.attempt_id) &&
    isNonEmpty(row.assessment_generation_id) &&
    isStatus(row.status) &&
    (row.reviewer_notes === null ||
      (typeof row.reviewer_notes === "string" && row.reviewer_notes.length <= 4000)) &&
    isNonEmpty(row.reviewer_user_id) &&
    isNonEmpty(row.updated_at)
  );
}

function validateInput(input: CandidateReviewInput): CandidateReviewInput {
  if (!isStatus(input.status)) throw new Error("invalid candidate review");
  if (input.reviewerNotes !== null && input.reviewerNotes.length > 4000) {
    throw new Error("invalid candidate review");
  }
  return input;
}

export function createCandidateReviewRepository(client: RpcClient) {
  return {
    async saveReview(scope: CandidateReviewScope, input: CandidateReviewInput): Promise<CandidateReview> {
      const normalized = validateInput(input);
      const { data, error } = await client.rpc("save_candidate_review", {
        p_organization_id: scope.organizationId,
        p_job_id: scope.jobId,
        p_candidate_id: scope.candidateId,
        p_attempt_id: scope.attemptId,
        p_assessment_generation_id: scope.assessmentGenerationId,
        p_status: normalized.status,
        p_reviewer_notes: normalized.reviewerNotes,
      });

      if (error || !isReviewRow(data)) throw new Error("candidate review unavailable");
      if (
        data.organization_id !== scope.organizationId ||
        data.job_id !== scope.jobId ||
        data.candidate_id !== scope.candidateId ||
        data.attempt_id !== scope.attemptId ||
        data.assessment_generation_id !== scope.assessmentGenerationId ||
        data.status !== normalized.status ||
        data.reviewer_notes !== normalized.reviewerNotes
      ) {
        throw new Error("candidate review unavailable");
      }

      return {
        organizationId: data.organization_id,
        jobId: data.job_id,
        candidateId: data.candidate_id,
        attemptId: data.attempt_id,
        assessmentGenerationId: data.assessment_generation_id,
        status: data.status,
        reviewerNotes: data.reviewer_notes,
        reviewerUserId: data.reviewer_user_id,
        updatedAt: data.updated_at,
      };
    },
  };
}
