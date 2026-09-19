import { describe, expect, it, vi } from "vitest";

import { createCandidateResultRepository } from "./candidate-result-repository";

const assessment = {
  summary: "Evidence-grounded assessment",
  competencies: [
    {
      competencyId: "competency-1",
      score: 4,
      rationale: "The candidate explained concrete trade-offs.",
      evidence: [
        {
          messageSequence: 7,
          excerpt: "I would partition by tenant and keep writes idempotent.",
        },
      ],
      evidenceSufficiency: "sufficient",
    },
  ],
  strengths: [],
  concerns: [],
  unansweredAreas: [],
  questionCoverage: [],
  evidenceSufficiency: "high",
};

const competencyCatalog = [
  { id: "competency-1", name: "System Design" },
];

const completedResult = {
  organization_id: "org-1",
  job_id: "job-1",
  candidate_id: "candidate-1",
  attempt_id: "attempt-1",
  assessment_generation_id: "generation-1",
  candidate_name: "Candidate One",
  job_title: "Senior Engineer",
  interview_status: "completed",
  review_status: "awaiting_review",
  generation_number: 1,
  assessment_status: "completed",
  assessment,
  competency_catalog: competencyCatalog,
};

describe("candidate review result repository", () => {
  it("uses a tenant/job/candidate-scoped authoritative result boundary", async () => {
    const rpc = vi.fn().mockResolvedValue({ data: completedResult, error: null });
    const repository = createCandidateResultRepository({ rpc });

    await expect(
      repository.getCandidateResult("org-1", "job-1", "candidate-1"),
    ).resolves.toMatchObject(completedResult);

    expect(rpc).toHaveBeenCalledWith("get_candidate_review_result", {
      p_organization_id: "org-1",
      p_job_id: "job-1",
      p_candidate_id: "candidate-1",
    });
  });

  it("requires the immutable completed assessment generation identity needed for human review writes", async () => {
    const { assessment_generation_id: _missing, ...withoutGenerationId } = completedResult;
    const rpc = vi.fn().mockResolvedValue({ data: withoutGenerationId, error: null });
    const repository = createCandidateResultRepository({ rpc });

    await expect(
      repository.getCandidateResult("org-1", "job-1", "candidate-1"),
    ).rejects.toThrow("candidate result unavailable");
  });

  it("enriches validated assessment competencies with immutable configured names", async () => {
    const rpc = vi.fn().mockResolvedValue({ data: completedResult, error: null });
    const repository = createCandidateResultRepository({ rpc });

    const result = (await repository.getCandidateResult(
      "org-1",
      "job-1",
      "candidate-1",
    )) as unknown as {
      assessment: unknown;
      review_competencies: unknown;
    };

    expect(result.assessment).toEqual(assessment);
    expect(result.review_competencies).toEqual([
      {
        competencyId: "competency-1",
        name: "System Design",
        score: 4,
        rationale: "The candidate explained concrete trade-offs.",
        evidence: [
          {
            messageSequence: 7,
            excerpt: "I would partition by tenant and keep writes idempotent.",
          },
        ],
        evidenceSufficiency: "sufficient",
      },
    ]);
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

  it("fails closed when a completed assessment payload is not review-safe", async () => {
    const rpc = vi.fn().mockResolvedValue({
      data: {
        ...completedResult,
        assessment: {
          ...assessment,
          recommendation: "hire",
        },
      },
      error: null,
    });
    const repository = createCandidateResultRepository({ rpc });

    await expect(
      repository.getCandidateResult("org-1", "job-1", "candidate-1"),
    ).rejects.toThrow("candidate assessment unavailable");
  });

  it("fails closed when immutable configured identity cannot resolve an assessed competency", async () => {
    const rpc = vi.fn().mockResolvedValue({
      data: {
        ...completedResult,
        competency_catalog: [
          { id: "competency-other", name: "Different Competency" },
        ],
      },
      error: null,
    });
    const repository = createCandidateResultRepository({ rpc });

    await expect(
      repository.getCandidateResult("org-1", "job-1", "candidate-1"),
    ).rejects.toThrow("candidate competency unavailable");
  });
});
