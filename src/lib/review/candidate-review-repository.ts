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

type RpcResult = { data: unknown; error: unknown };
type RpcClient = { rpc: (name: string, args: Record<string, unknown>) => PromiseLike<RpcResult> };

export function createCandidateReviewRepository(_client: RpcClient) {
  return {
    async saveReview(_scope: CandidateReviewScope, _input: CandidateReviewInput): Promise<never> {
      throw new Error("candidate review unavailable");
    },
  };
}
