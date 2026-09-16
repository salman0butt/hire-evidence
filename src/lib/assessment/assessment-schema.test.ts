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

  it("rejects blank assessment and rationale text", () => {
    expect(parseInterviewAssessment({ ...assessment(), summary: "  " })).toEqual({
      ok: false,
      message: "Assessment summary must be a non-empty string.",
    });

    expect(
      parseInterviewAssessment(
        assessment([{ ...competency(), rationale: "\t" }]),
      ),
    ).toEqual({
      ok: false,
      message: "Competency rationale must be a non-empty string.",
    });
  });

  it("rejects unsupported evidence sufficiency values", () => {
    expect(
      parseInterviewAssessment(
        assessment([competency("system-design", 4, "certain")]),
      ),
    ).toEqual({
      ok: false,
      message: "Competency evidence sufficiency is invalid.",
    });

    expect(
      parseInterviewAssessment({ ...assessment(), evidenceSufficiency: "certain" }),
    ).toEqual({
      ok: false,
      message: "Overall evidence sufficiency is invalid.",
    });
  });

  it("rejects malformed question coverage states", () => {
    expect(
      parseInterviewAssessment(
        assessment([competency()], [{ ...questionCoverage(), status: "unknown" }]),
      ),
    ).toEqual({
      ok: false,
      message: "Question coverage status is invalid.",
    });

    expect(
      parseInterviewAssessment(
        assessment(
          [competency()],
          [{ ...questionCoverage(), technicalInterruption: "no" }],
        ),
      ),
    ).toEqual({
      ok: false,
      message: "Question technical interruption flag must be boolean.",
    });
  });

  it.each([0, -1, 1.5, "4"])("rejects invalid evidence sequence %s", (messageSequence) => {
    expect(
      parseInterviewAssessment(
        assessment([{ ...competency(), evidence: [{ messageSequence, excerpt: "queue" }] }]),
      ),
    ).toEqual({ ok: false, message: "Assessment evidence sequence must be a positive integer." });
  });

  it("rejects blank and oversized evidence excerpts", () => {
    expect(
      parseInterviewAssessment(
        assessment([{ ...competency(), evidence: [{ messageSequence: 4, excerpt: "  " }] }]),
      ),
    ).toEqual({ ok: false, message: "Assessment evidence excerpt must be non-empty and bounded." });

    expect(
      parseInterviewAssessment(
        assessment([{ ...competency(), evidence: [{ messageSequence: 4, excerpt: "x".repeat(1001) }] }]),
      ),
    ).toEqual({ ok: false, message: "Assessment evidence excerpt must be non-empty and bounded." });
  });

  it("rejects duplicate exact citations", () => {
    const citation = { messageSequence: 4, excerpt: "I would put the work on a queue" };
    expect(
      parseInterviewAssessment(
        assessment([{ ...competency(), evidence: [citation, { ...citation }] }]),
      ),
    ).toEqual({ ok: false, message: "Assessment evidence citations must be unique." });
  });

  it("requires evidence for a scored competency with sufficient evidence", () => {
    expect(parseInterviewAssessment(assessment([{ ...competency(), evidence: [] }]))).toEqual({
      ok: false,
      message: "A scored competency with sufficient evidence must cite evidence.",
    });
  });
});
