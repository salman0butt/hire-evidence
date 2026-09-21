export type JobCandidateDashboardItem = Readonly<{
  candidateId: string;
  candidateName: string;
  attemptId: string;
  interviewStatus: "completed";
  assessmentGenerationId: string;
  generationNumber: number;
  reviewStatus: "awaiting_review" | "in_review" | "reviewed";
  reviewUpdatedAt: string | null;
}>;

type RpcResult = Readonly<{
  data: unknown;
  error: unknown;
}>;

type RpcClient = Readonly<{
  rpc: (name: string, args: Record<string, unknown>) => PromiseLike<RpcResult>;
}>;

function isNonEmptyString(value: unknown): value is string {
  return typeof value === "string" && value.trim().length > 0;
}

function parseRow(value: unknown): JobCandidateDashboardItem | null {
  if (!value || typeof value !== "object" || Array.isArray(value)) return null;
  const row = value as Record<string, unknown>;

  if (
    !isNonEmptyString(row.candidate_id) ||
    !isNonEmptyString(row.candidate_name) ||
    !isNonEmptyString(row.attempt_id) ||
    row.interview_status !== "completed" ||
    !isNonEmptyString(row.assessment_generation_id) ||
    !Number.isInteger(row.generation_number) ||
    (row.review_status !== "awaiting_review" &&
      row.review_status !== "in_review" &&
      row.review_status !== "reviewed") ||
    (row.review_updated_at !== null && typeof row.review_updated_at !== "string")
  ) {
    return null;
  }

  return {
    candidateId: row.candidate_id,
    candidateName: row.candidate_name,
    attemptId: row.attempt_id,
    interviewStatus: row.interview_status,
    assessmentGenerationId: row.assessment_generation_id,
    generationNumber: row.generation_number as number,
    reviewStatus: row.review_status,
    reviewUpdatedAt: row.review_updated_at,
  };
}

export function createJobCandidateDashboardRepository(client: RpcClient) {
  return {
    async getJobCandidateDashboard(
      organizationId: string,
      jobId: string,
    ): Promise<readonly JobCandidateDashboardItem[]> {
      const { data, error } = await client.rpc("get_job_candidate_review_dashboard", {
        p_organization_id: organizationId,
        p_job_id: jobId,
      });

      if (error || !Array.isArray(data)) {
        throw new Error("job candidate dashboard unavailable");
      }

      const items: JobCandidateDashboardItem[] = [];
      for (const value of data) {
        const item = parseRow(value);
        if (!item) {
          throw new Error("job candidate dashboard unavailable");
        }
        items.push(item);
      }

      return items;
    },
  };
}
