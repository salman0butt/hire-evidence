import { describe, expect, it, vi } from "vitest";

import { createCandidateScoreOverrideRepository } from "./candidate-score-override-repository";

const scope = {
  organizationId: "org-1",
  jobId: "job-1",
  candidateId: "candidate-1",
  attemptId: "attempt-1",
  assessmentGenerationId: "generation-1",
};

describe("candidate score override repository", () => {
  it("appends a reviewer-authored score without mutating the AI assessment", async () => {
    const rpc = vi.fn().mockResolvedValue({
      data: {
        id: "override-1",
        organization_id: "org-1",
        job_id: "job-1",
        candidate_id: "candidate-1",
        attempt_id: "attempt-1",
        assessment_generation_id: "generation-1",
        competency_id: "competency-1",
        human_score: 3,
        reason: "The transcript supports a lower score after independent review.",
        reviewer_user_id: "reviewer-1",
        created_at: "2026-09-20T09:00:00.000Z",
      },
      error: null,
    });
    const repository = createCandidateScoreOverrideRepository({ rpc });

    await expect(
      repository.createScoreOverride(scope, {
        competencyId: "competency-1",
        humanScore: 3,
        reason: "The transcript supports a lower score after independent review.",
      }),
    ).resolves.toMatchObject({
      humanScore: 3,
      reviewerUserId: "reviewer-1",
      assessmentGenerationId: "generation-1",
    });

    expect(rpc).toHaveBeenCalledWith("create_candidate_review_score_override", {
      p_organization_id: "org-1",
      p_job_id: "job-1",
      p_candidate_id: "candidate-1",
      p_attempt_id: "attempt-1",
      p_assessment_generation_id: "generation-1",
      p_competency_id: "competency-1",
      p_human_score: 3,
      p_reason: "The transcript supports a lower score after independent review.",
    });
  });

  it.each([0, 6])("rejects out-of-range human score %s before the RPC", async (humanScore) => {
    const rpc = vi.fn();
    const repository = createCandidateScoreOverrideRepository({ rpc });

    await expect(
      repository.createScoreOverride(scope, {
        competencyId: "competency-1",
        humanScore,
        reason: "Independent review reason.",
      }),
    ).rejects.toThrow("invalid human score override");
    expect(rpc).not.toHaveBeenCalled();
  });

  it("accepts null only as an explicit insufficient-evidence human score", async () => {
    const rpc = vi.fn().mockResolvedValue({
      data: {
        id: "override-2",
        organization_id: "org-1",
        job_id: "job-1",
        candidate_id: "candidate-1",
        attempt_id: "attempt-1",
        assessment_generation_id: "generation-1",
        competency_id: "competency-1",
        human_score: null,
        reason: "The cited evidence is insufficient for an independent human score.",
        reviewer_user_id: "reviewer-1",
        created_at: "2026-09-20T09:01:00.000Z",
      },
      error: null,
    });
    const repository = createCandidateScoreOverrideRepository({ rpc });

    await expect(
      repository.createScoreOverride(scope, {
        competencyId: "competency-1",
        humanScore: null,
        reason: "The cited evidence is insufficient for an independent human score.",
      }),
    ).resolves.toMatchObject({ humanScore: null });
  });

  it.each(["", "   ", "x".repeat(1001)])("rejects an invalid bounded reviewer reason", async (reason) => {
    const rpc = vi.fn();
    const repository = createCandidateScoreOverrideRepository({ rpc });

    await expect(
      repository.createScoreOverride(scope, {
        competencyId: "competency-1",
        humanScore: 4,
        reason,
      }),
    ).rejects.toThrow("invalid human score override");
    expect(rpc).not.toHaveBeenCalled();
  });

  it("fails closed on malformed or mismatched authoritative RPC output", async () => {
    const rpc = vi.fn().mockResolvedValue({
      data: {
        id: "override-3",
        organization_id: "org-1",
        job_id: "job-1",
        candidate_id: "candidate-1",
        attempt_id: "attempt-1",
        assessment_generation_id: "different-generation",
        competency_id: "competency-1",
        human_score: 4,
        reason: "Independent review reason.",
        reviewer_user_id: "reviewer-1",
        created_at: "2026-09-20T09:02:00.000Z",
      },
      error: null,
    });
    const repository = createCandidateScoreOverrideRepository({ rpc });

    await expect(
      repository.createScoreOverride(scope, {
        competencyId: "competency-1",
        humanScore: 4,
        reason: "Independent review reason.",
      }),
    ).rejects.toThrow("human score override unavailable");
  });
});
