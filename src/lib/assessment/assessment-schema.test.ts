import { describe, expect, it } from "vitest";

import { parseInterviewAssessment } from "./assessment-schema";

function competency(
  competencyId = "system-design",
  score: unknown = 4,
  evidenceSufficiency = "sufficient",
) {
  return {
    competencyId,
    score,
    rationale: "The answer covered asynchronous processing.",
    evidence: [
      {
        messageSequence: 4,
        excerpt: "I would put the work on a queue",
      },
    ],
    evidenceSufficiency,
  };
}

function questionCoverage(questionId = "architecture") {
  return {
    questionId,
    status: "answered",
    technicalInterruption: false,
  };
}

function assessment(
  competencies: readonly unknown[] = [competency()],
  questions: readonly unknown[] = [questionCoverage()],
) {
  return {
    summary: "Candidate explained a workable queue-based design.",
    competencies,
    strengths: [],
    concerns: [],
    unansweredAreas: [],
    questionCoverage: questions,
    evidenceSufficiency: "high",
  };
}

describe("parseInterviewAssessment", () => {
  it("accepts a valid structured assessment", () => {
    const value = assessment();

    expect(parseInterviewAssessment(value)).toEqual({ ok: true, value });
  });

  it.each([0, 6, 2.5])(
    "rejects invalid competency score %s",
    (score) => {
      expect(parseInterviewAssessment(assessment([competency("system-design", score)]))).toEqual({
        ok: false,
        message: "Competency score must be an integer from 1 to 5 or null.",
      });
    },
  );

  it("requires a null score when competency evidence is insufficient", () => {
    expect(
      parseInterviewAssessment(
        assessment([competency("system-design", 4, "insufficient")]),
      ),
    ).toEqual({
      ok: false,
      message: "Insufficient competency evidence cannot have a score.",
    });
  });

  it("rejects an empty competency id", () => {
    expect(parseInterviewAssessment(assessment([competency(" ")]))).toEqual({
      ok: false,
      message: "Competency ID must be a non-empty string.",
    });
  });

  it("rejects duplicate competency ids", () => {
    expect(
      parseInterviewAssessment(
        assessment([competency("system-design"), competency("system-design", 3)]),
      ),
    ).toEqual({
      ok: false,
      message: "Assessment cannot contain duplicate competency IDs.",
    });
  });

  it("rejects duplicate question ids", () => {
    expect(
      parseInterviewAssessment(
        assessment(
          [competency()],
          [questionCoverage("architecture"), questionCoverage("architecture")],
        ),
      ),
    ).toEqual({
      ok: false,
      message: "Assessment cannot contain duplicate question IDs.",
    });
  });

  it("rejects decision-like output fields", () => {
    expect(
      parseInterviewAssessment({
        ...assessment(),
        decision: "hire",
      }),
    ).toEqual({
      ok: false,
      message: "Assessment cannot include autonomous hiring decision fields.",
    });
  });
});
