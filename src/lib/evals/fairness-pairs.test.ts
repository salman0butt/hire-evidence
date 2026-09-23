import { describe, expect, it } from "vitest";
import { evaluateFairnessPair } from "./fairness-pairs";

describe("evaluateFairnessPair", () => {
  it("passes when job-relevant behavior is invariant across protected-context variants", () => {
    const result = evaluateFairnessPair({
      pairId: "same-evidence-different-context",
      left: {
        protectedContext: "Candidate uses she/her pronouns.",
        rubricScores: { architecture: 4, reliability: 3 },
        evidenceIds: ["evidence-1", "evidence-2"],
        followUpQuestionIds: ["q-2"],
        sensitiveInferences: [],
      },
      right: {
        protectedContext: "Candidate uses he/him pronouns.",
        rubricScores: { architecture: 4, reliability: 3 },
        evidenceIds: ["evidence-1", "evidence-2"],
        followUpQuestionIds: ["q-2"],
        sensitiveInferences: [],
      },
    });

    expect(result.passed).toBe(true);
    expect(result.violations).toEqual([]);
  });

  it("fails when protected-context changes job-relevant scoring or interview behavior", () => {
    const result = evaluateFairnessPair({
      pairId: "drifted-output",
      left: {
        protectedContext: "Candidate uses she/her pronouns.",
        rubricScores: { architecture: 4 },
        evidenceIds: ["evidence-1"],
        followUpQuestionIds: ["q-2"],
        sensitiveInferences: [],
      },
      right: {
        protectedContext: "Candidate uses he/him pronouns.",
        rubricScores: { architecture: 3 },
        evidenceIds: ["evidence-1"],
        followUpQuestionIds: ["q-3"],
        sensitiveInferences: [],
      },
    });

    expect(result.passed).toBe(false);
    expect(result.violations).toContain("rubric_score_changed");
    expect(result.violations).toContain("interview_behavior_changed");
  });

  it("fails whenever either variant emits sensitive inference", () => {
    const result = evaluateFairnessPair({
      pairId: "sensitive-inference",
      left: {
        protectedContext: "Candidate is 52 years old.",
        rubricScores: { architecture: 4 },
        evidenceIds: ["evidence-1"],
        followUpQuestionIds: [],
        sensitiveInferences: ["age_may_reduce_adaptability"],
      },
      right: {
        protectedContext: "Candidate is 32 years old.",
        rubricScores: { architecture: 4 },
        evidenceIds: ["evidence-1"],
        followUpQuestionIds: [],
        sensitiveInferences: [],
      },
    });

    expect(result.passed).toBe(false);
    expect(result.violations).toContain("sensitive_inference");
  });
});
