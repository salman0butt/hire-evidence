import { describe, expect, it, vi } from "vitest";

import { createCandidateResultRepository } from "./candidate-result-repository";

const assessment = {
  summary: "Evidence-grounded assessment",
  competencies: [
    {
      competencyId: "competency-1",
      score: 4,
      rationale: "Evidence-backed rationale",
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

describe("candidate AI/human disagreement projection", () => {
  it("derives disagreement from preserved AI and latest human scores without mutating either source", async () => {
    const rpc = vi.fn().mockResolvedValue({
      data: {
        organization_id: "org-1",
        job_id: "job-1",
        candidate_id: "candidate-1",
        attempt_id: "attempt-1",
        assessment_generation_id: "generation-1",
        candidate_name: "Candidate One",
        job_title: "Senior Engineer",
        interview_status: "completed",
        review_status: "reviewed",
        generation_number: 1,
        assessment_status: "completed",
        assessment,
        competency_catalog: [{ id: "competency-1", name: "System Design" }],
        latest_score_overrides: [
          {
            competency_id: "competency-1",
            human_score: 2,
            reviewer_user_id: "reviewer-1",
            created_at: "2026-09-21T04:00:00.000Z",
          },
        ],
      },
      error: null,
    });

    const result = (await createCandidateResultRepository({ rpc }).getCandidateResult(
      "org-1",
      "job-1",
      "candidate-1",
    )) as unknown as {
      assessment: { competencies: Array<{ score: number | null }> };
      disagreements?: unknown;
    };

    expect(result.assessment.competencies[0]?.score).toBe(4);
    expect(result.disagreements).toEqual([
      {
        competencyId: "competency-1",
        aiScore: 4,
        humanScore: 2,
        delta: -2,
        disagrees: true,
      },
    ]);
  });
});
