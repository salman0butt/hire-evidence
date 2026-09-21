import { describe, expect, it, vi } from "vitest";

import { createJobCandidateDashboardRepository } from "./job-candidate-dashboard-repository";

describe("job candidate review dashboard repository", () => {
  it("returns only validated neutral workflow metadata in provider order", async () => {
    const rpc = vi.fn().mockResolvedValue({
      data: [
        {
          candidate_id: "candidate-b",
          candidate_name: "Beta Candidate",
          attempt_id: "attempt-b",
          interview_status: "completed",
          assessment_generation_id: "generation-b",
          generation_number: 2,
          review_status: "reviewed",
          review_updated_at: "2026-09-21T08:00:00.000Z",
        },
        {
          candidate_id: "candidate-a",
          candidate_name: "Alpha Candidate",
          attempt_id: "attempt-a",
          interview_status: "completed",
          assessment_generation_id: "generation-a",
          generation_number: 1,
          review_status: "awaiting_review",
          review_updated_at: null,
        },
      ],
      error: null,
    });

    const repository = createJobCandidateDashboardRepository({ rpc });
    const result = await repository.getJobCandidateDashboard("org-1", "job-1");

    expect(rpc).toHaveBeenCalledWith("get_job_candidate_review_dashboard", {
      p_organization_id: "org-1",
      p_job_id: "job-1",
    });
    expect(result).toEqual([
      {
        candidateId: "candidate-b",
        candidateName: "Beta Candidate",
        attemptId: "attempt-b",
        interviewStatus: "completed",
        assessmentGenerationId: "generation-b",
        generationNumber: 2,
        reviewStatus: "reviewed",
        reviewUpdatedAt: "2026-09-21T08:00:00.000Z",
      },
      {
        candidateId: "candidate-a",
        candidateName: "Alpha Candidate",
        attemptId: "attempt-a",
        interviewStatus: "completed",
        assessmentGenerationId: "generation-a",
        generationNumber: 1,
        reviewStatus: "awaiting_review",
        reviewUpdatedAt: null,
      },
    ]);
    expect(result[0]).not.toHaveProperty("score");
    expect(result[0]).not.toHaveProperty("rank");
    expect(result[0]).not.toHaveProperty("recommendation");
  });

  it("fails closed on malformed provider data", async () => {
    const rpc = vi.fn().mockResolvedValue({
      data: [{ candidate_id: "candidate-a", candidate_name: "Alpha Candidate" }],
      error: null,
    });

    const repository = createJobCandidateDashboardRepository({ rpc });

    await expect(
      repository.getJobCandidateDashboard("org-1", "job-1"),
    ).rejects.toThrow("job candidate dashboard unavailable");
  });
});
