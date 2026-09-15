import { describe, expect, it } from "vitest";

import type { CompetencyAssessment } from "./assessment-schema";
import {
  calculateStructuredRubricScore,
  validateRubricScores,
} from "./rubric-scoring";

const configuredCompetencies = [
  {
    id: "system-design",
    weight: 2,
    rubric: [1, 2, 3, 4, 5].map((score) => ({ score, description: `Level ${score}` })),
  },
  {
    id: "communication",
    weight: 1,
    rubric: [1, 2, 3, 4, 5].map((score) => ({ score, description: `Level ${score}` })),
  },
] as const;

function assessment(
  competencyId: string,
  score: CompetencyAssessment["score"],
  evidenceSufficiency: CompetencyAssessment["evidenceSufficiency"] = "sufficient",
): CompetencyAssessment {
  return {
    competencyId,
    score,
    rationale: "Grounded rationale.",
    evidence: [],
    evidenceSufficiency,
  };
}

describe("rubric-aligned competency scoring", () => {
  it("rejects unknown and missing configured competency IDs", () => {
    expect(
      validateRubricScores(
        [assessment("system-design", 4), assessment("unknown", 3)],
        configuredCompetencies,
      ),
    ).toEqual({ ok: false, message: "Assessment contains an unknown competency ID." });

    expect(validateRubricScores([assessment("system-design", 4)], configuredCompetencies)).toEqual({
      ok: false,
      message: "Assessment is missing a configured competency.",
    });
  });

  it("rejects a score that has no corresponding configured rubric level", () => {
    const incompleteRubric = [
      { ...configuredCompetencies[0], rubric: configuredCompetencies[0].rubric.slice(0, 3) },
    ] as const;

    expect(validateRubricScores([assessment("system-design", 4)], incompleteRubric)).toEqual({
      ok: false,
      message: "Competency score does not have a configured rubric level.",
    });
  });

  it("requires null for insufficient evidence and accepts explicit unavailable scoring", () => {
    expect(
      validateRubricScores(
        [assessment("system-design", 4, "insufficient"), assessment("communication", 3)],
        configuredCompetencies,
      ),
    ).toEqual({ ok: false, message: "Insufficient evidence cannot produce a competency score." });

    const assessments = [
      assessment("system-design", null, "insufficient"),
      assessment("communication", null, "insufficient"),
    ];
    expect(validateRubricScores(assessments, configuredCompetencies).ok).toBe(true);
    expect(calculateStructuredRubricScore(assessments, configuredCompetencies)).toEqual({
      available: false,
      score: null,
    });
  });

  it("calculates a deterministic weighted rubric score without producing a hiring probability", () => {
    const result = calculateStructuredRubricScore(
      [assessment("system-design", 5), assessment("communication", 2)],
      configuredCompetencies,
    );

    expect(result).toEqual({ available: true, score: 4 });
    expect(result).not.toHaveProperty("probability");
    expect(result).not.toHaveProperty("decision");
  });
});
