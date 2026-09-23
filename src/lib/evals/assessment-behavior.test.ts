import { describe, expect, it } from "vitest";

import { evaluateAssessmentBehavior } from "./assessment-behavior";

describe("evaluateAssessmentBehavior", () => {
  const rubric = [
    { id: "communication", maxScore: 4 },
    { id: "systems", maxScore: 5 },
  ];

  it("passes grounded rubric-aligned outcomes with valid evidence citations", () => {
    const result = evaluateAssessmentBehavior({
      rubric,
      evidence: [
        { id: "e1", rubricId: "systems", text: "Explained queue backpressure and retries." },
      ],
      evidenceSufficiency: "sufficient",
      outcomes: [{ rubricId: "systems", score: 4, evidenceIds: ["e1"] }],
      technicalFailure: false,
    });

    expect(result.passed).toBe(true);
    expect(result.violations).toEqual([]);
  });

  it("rejects unknown rubric criteria, out-of-range scores, and invalid citations", () => {
    const result = evaluateAssessmentBehavior({
      rubric,
      evidence: [{ id: "e1", rubricId: "systems", text: "Evidence" }],
      evidenceSufficiency: "sufficient",
      outcomes: [
        { rubricId: "systems", score: 9, evidenceIds: ["missing"] },
        { rubricId: "unknown", score: 1, evidenceIds: [] },
      ],
      technicalFailure: false,
    });

    expect(result.passed).toBe(false);
    expect(result.violations).toEqual(
      expect.arrayContaining(["score_out_of_bounds", "invalid_evidence_citation", "unknown_rubric"]),
    );
  });

  it("requires insufficient evidence to remain unscored", () => {
    const result = evaluateAssessmentBehavior({
      rubric,
      evidence: [],
      evidenceSufficiency: "insufficient",
      outcomes: [{ rubricId: "communication", score: 2, evidenceIds: [] }],
      technicalFailure: false,
    });

    expect(result.passed).toBe(false);
    expect(result.violations).toContain("insufficient_evidence_scored");
  });

  it("keeps technical failure separate from candidate assessment", () => {
    const result = evaluateAssessmentBehavior({
      rubric,
      evidence: [],
      evidenceSufficiency: "insufficient",
      outcomes: [{ rubricId: "systems", score: null, evidenceIds: [] }],
      technicalFailure: true,
    });

    expect(result.passed).toBe(true);
    expect(result.technicalFailure).toBe(true);
    expect(result.violations).toEqual([]);
  });
});
