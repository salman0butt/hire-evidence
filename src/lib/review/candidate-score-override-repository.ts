export type CandidateScoreOverrideScope = Readonly<{
  organizationId: string;
  jobId: string;
  candidateId: string;
  attemptId: string;
  assessmentGenerationId: string;
}>;

export type CandidateScoreOverrideInput = Readonly<{
  competencyId: string;
  humanScore: number | null;
  reason: string;
}>;

export type CandidateScoreOverride = Readonly<{
  id: string;
  organizationId: string;
  jobId: string;
  candidateId: string;
  attemptId: string;
  assessmentGenerationId: string;
  competencyId: string;
  humanScore: number | null;
  reason: string;
  reviewerUserId: string;
  createdAt: string;
}>;

type RpcResult = { data: unknown; error: unknown };
type RpcClient = {
  rpc: (name: string, args: Record<string, unknown>) => PromiseLike<RpcResult>;
};

type OverrideRow = {
  id: string;
  organization_id: string;
  job_id: string;
  candidate_id: string;
  attempt_id: string;
  assessment_generation_id: string;
  competency_id: string;
  human_score: number | null;
  reason: string;
  reviewer_user_id: string;
  created_at: string;
};

function isNonEmpty(value: unknown): value is string {
  return typeof value === "string" && value.trim().length > 0;
}

function validScore(value: unknown): value is number | null {
  return value === null || (Number.isInteger(value) && Number(value) >= 1 && Number(value) <= 5);
}

function isOverrideRow(value: unknown): value is OverrideRow {
  if (!value || typeof value !== "object" || Array.isArray(value)) return false;
  const row = value as Record<string, unknown>;
  return (
    isNonEmpty(row.id) &&
    isNonEmpty(row.organization_id) &&
    isNonEmpty(row.job_id) &&
    isNonEmpty(row.candidate_id) &&
    isNonEmpty(row.attempt_id) &&
    isNonEmpty(row.assessment_generation_id) &&
    isNonEmpty(row.competency_id) &&
    validScore(row.human_score) &&
    isNonEmpty(row.reason) &&
    row.reason.trim().length <= 1000 &&
    isNonEmpty(row.reviewer_user_id) &&
    isNonEmpty(row.created_at)
  );
}

function validateInput(input: CandidateScoreOverrideInput) {
  const reason = input.reason.trim();
  if (
    !isNonEmpty(input.competencyId) ||
    input.competencyId.trim().length > 200 ||
    !validScore(input.humanScore) ||
    reason.length < 1 ||
    reason.length > 1000
  ) {
    throw new Error("invalid human score override");
  }
  return { competencyId: input.competencyId.trim(), humanScore: input.humanScore, reason };
}

export function createCandidateScoreOverrideRepository(client: RpcClient) {
  return {
    async createScoreOverride(
      scope: CandidateScoreOverrideScope,
      input: CandidateScoreOverrideInput,
    ): Promise<CandidateScoreOverride> {
      const normalized = validateInput(input);
      const { data, error } = await client.rpc("create_candidate_review_score_override", {
        p_organization_id: scope.organizationId,
        p_job_id: scope.jobId,
        p_candidate_id: scope.candidateId,
        p_attempt_id: scope.attemptId,
        p_assessment_generation_id: scope.assessmentGenerationId,
        p_competency_id: normalized.competencyId,
        p_human_score: normalized.humanScore,
        p_reason: normalized.reason,
      });

      if (error || !isOverrideRow(data)) throw new Error("human score override unavailable");
      if (
        data.organization_id !== scope.organizationId ||
        data.job_id !== scope.jobId ||
        data.candidate_id !== scope.candidateId ||
        data.attempt_id !== scope.attemptId ||
        data.assessment_generation_id !== scope.assessmentGenerationId ||
        data.competency_id !== normalized.competencyId ||
        data.human_score !== normalized.humanScore ||
        data.reason !== normalized.reason
      ) {
        throw new Error("human score override unavailable");
      }

      return {
        id: data.id,
        organizationId: data.organization_id,
        jobId: data.job_id,
        candidateId: data.candidate_id,
        attemptId: data.attempt_id,
        assessmentGenerationId: data.assessment_generation_id,
        competencyId: data.competency_id,
        humanScore: data.human_score,
        reason: data.reason,
        reviewerUserId: data.reviewer_user_id,
        createdAt: data.created_at,
      };
    },
  };
}
