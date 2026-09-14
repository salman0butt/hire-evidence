import { describe, expect, it } from "vitest";

import { parseInterviewAssessment } from "./assessment-schema";

function assessmentWithScore(score: unknown) {
  return {
    summary: "Candidate explained a workable queue-based design.",
    competencies: [
      {
        competencyId: "system-design",
        score,
        rationale: "The answer covered asynchronous processing.",
        evidence: [
          {
            messageSequence: 4,
            excerpt: "I would put the work on a queue",
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
}

describe("parseInterviewAssessment", () => {
  it("rejects competency scores outside the configured 1-5 range", () => {
    expect(parseInterviewAssessment(assessmentWithScore(6))).toEqual({
      ok: false,
      message: "Competency score must be an integer from 1 to 5 or null.",
    });
  });
});
