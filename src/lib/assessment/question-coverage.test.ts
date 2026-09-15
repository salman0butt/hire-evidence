import { describe, expect, it } from "vitest";

import { deriveQuestionCoverage } from "./question-coverage";

describe("deriveQuestionCoverage", () => {
  const questions = [
    { questionId: "architecture", competencyId: "system-design" },
    { questionId: "reliability", competencyId: "system-design" },
    { questionId: "tradeoffs", competencyId: "system-design" },
  ] as const;

  it("derives answered, partially answered, and skipped states from authoritative progress", () => {
    expect(
      deriveQuestionCoverage(questions, [
        { questionId: "architecture", progress: "answered" },
        { questionId: "reliability", progress: "partially_answered" },
      ]),
    ).toEqual([
      { questionId: "architecture", status: "answered", technicalInterruption: false },
      { questionId: "reliability", status: "partially_answered", technicalInterruption: false },
      { questionId: "tradeoffs", status: "skipped", technicalInterruption: false },
    ]);
  });

  it("marks technical interruption as context without changing answer status", () => {
    expect(
      deriveQuestionCoverage(
        questions,
        [{ questionId: "architecture", progress: "partially_answered" }],
        [{ questionId: "architecture" }],
      )[0],
    ).toEqual({
      questionId: "architecture",
      status: "partially_answered",
      technicalInterruption: true,
    });
  });

  it("rejects progress for a question outside the published plan", () => {
    expect(() =>
      deriveQuestionCoverage(questions, [{ questionId: "invented", progress: "answered" }]),
    ).toThrow("Question progress references an unknown published question.");
  });

  it("rejects duplicate progress because coverage would be ambiguous", () => {
    expect(() =>
      deriveQuestionCoverage(questions, [
        { questionId: "architecture", progress: "answered" },
        { questionId: "architecture", progress: "partially_answered" },
      ]),
    ).toThrow("Question progress cannot contain duplicate question IDs.");
  });
});
