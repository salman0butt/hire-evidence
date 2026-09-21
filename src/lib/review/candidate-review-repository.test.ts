import { describe, expect, it, vi } from "vitest";

import { createCandidateReviewRepository } from "./candidate-review-repository";

const scope = {
  organizationId: "org-1",
  jobId: "job-1",
  candidateId: "candidate-1",
  attemptId: "attempt-1",
  assessmentGenerationId: "generation-1",
};

const persistedReview = {
  organization_id: "org-1",
  job_id: "job-1",
  candidate_id: "candidate-1",
  attempt_id: "attempt-1",
  assessment_generation_id: "generation-1",
  status: "in_review",
  reviewer_notes: "Reviewed the cited evidence independently.",
  reviewer_user_id: "reviewer-1",
  updated_at: "2026-09-21T00:00:00.000Z",
};

describe("candidate review repository", () => {
  it("persists reviewer notes and lifecycle status through the exact audited scope", async () => {
    const rpc = vi.fn().mockResolvedValue({ data: persistedReview, error: null });
    const repository = createCandidateReviewRepository({ rpc });

    const review = await repository.saveReview(scope, {
      status: "in_review",
      reviewerNotes: "Reviewed the cited evidence independently.",
    });

    expect(rpc).toHaveBeenCalledWith("save_candidate_review", {
      p_organization_id: "org-1",
      p_job_id: "job-1",
      p_candidate_id: "candidate-1",
      p_attempt_id: "attempt-1",
      p_assessment_generation_id: "generation-1",
      p_status: "in_review",
      p_reviewer_notes: "Reviewed the cited evidence independently.",
    });
    expect(review).toEqual({
      organizationId: "org-1",
      jobId: "job-1",
      candidateId: "candidate-1",
      attemptId: "attempt-1",
      assessmentGenerationId: "generation-1",
      status: "in_review",
      reviewerNotes: "Reviewed the cited evidence independently.",
      reviewerUserId: "reviewer-1",
      updatedAt: "2026-09-21T00:00:00.000Z",
    });
  });
});
