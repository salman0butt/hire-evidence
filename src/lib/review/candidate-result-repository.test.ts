import { describe, expect, it, vi } from "vitest";

import { createCandidateResultRepository } from "./candidate-result-repository";

const completedResult = {
  organization_id: "org-1",
  job_id: "job-1",
  candidate_id: "candidate-1",
  attempt_id: "attempt-1",
  candidate_name: "Candidate One",
  job_title: "Senior Engineer",
  interview_status: "completed",
  review_status: "awaiting_review",
  generation_number: 1,
  assessment_status: "completed",
};

describe("candidate review result repository", () => {
  it("uses a tenant/job/candidate-scoped authoritative result boundary", async () => {
    const rpc = vi.fn().mockResolvedValue({ data: completedResult, error: null });
    const repository = createCandidateResultRepository({ rpc });

    await expect(
      repository.getCandidateResult("org-1", "job-1", "candidate-1"),
    ).resolves.toEqual(completedResult);

    expect(rpc).toHaveBeenCalledWith("get_candidate_review_result", {
      p_organization_id: "org-1",
      p_job_id: "job-1",
      p_candidate_id: "candidate-1",
    });
  });

  it("fails closed when authorization or authoritative result lookup fails", async () => {
    const rpc = vi.fn().mockResolvedValue({ data: null, error: { message: "denied" } });
    const repository = createCandidateResultRepository({ rpc });

    await expect(
      repository.getCandidateResult("org-1", "job-1", "candidate-1"),
    ).rejects.toThrow("candidate result unavailable");
  });

  it("rejects results that are not backed by a completed assessment generation", async () => {
    const rpc = vi.fn().mockResolvedValue({
      data: { ...completedResult, assessment_status: "processing" },
      error: null,
    });
    const repository = createCandidateResultRepository({ rpc });

    await expect(
      repository.getCandidateResult("org-1", "job-1", "candidate-1"),
    ).rejects.toThrow("completed assessment required");
  });
});
