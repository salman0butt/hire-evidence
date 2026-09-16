export type CandidateReviewResultRow = {
  organization_id: string;
  job_id: string;
  candidate_id: string;
  attempt_id: string;
  candidate_name: string;
  job_title: string;
  interview_status: string;
  review_status: string;
  generation_number: number;
  assessment_status: string;
};

type RpcResult = {
  data: unknown;
  error: unknown;
};

type RpcClient = {
  rpc: (name: string, args: Record<string, unknown>) => Promise<RpcResult>;
};

function isCandidateReviewResultRow(value: unknown): value is CandidateReviewResultRow {
  if (!value || typeof value !== "object") return false;
  const row = value as Record<string, unknown>;
  return (
    typeof row.organization_id === "string" &&
    typeof row.job_id === "string" &&
    typeof row.candidate_id === "string" &&
    typeof row.attempt_id === "string" &&
    typeof row.candidate_name === "string" &&
    typeof row.job_title === "string" &&
    typeof row.interview_status === "string" &&
    typeof row.review_status === "string" &&
    Number.isInteger(row.generation_number) &&
    typeof row.assessment_status === "string"
  );
}

export function createCandidateResultRepository(client: RpcClient) {
  return {
    async getCandidateResult(
      organizationId: string,
      jobId: string,
      candidateId: string,
    ): Promise<CandidateReviewResultRow> {
      const { data, error } = await client.rpc("get_candidate_review_result", {
        p_organization_id: organizationId,
        p_job_id: jobId,
        p_candidate_id: candidateId,
      });

      if (error || !isCandidateReviewResultRow(data)) {
        throw new Error("candidate result unavailable");
      }

      if (data.assessment_status !== "completed") {
        throw new Error("completed assessment required");
      }

      return data;
    },
  };
}
