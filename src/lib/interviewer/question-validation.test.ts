import { describe, expect, it } from "vitest";

async function validationModule() {
  const modulePath = "./question-validation";
  return import(/* @vite-ignore */ modulePath) as Promise<{
    validateQuestionInput: (input: {
      questionText: string;
      difficulty: string;
      expectedAreas: string[];
      followUpHints: string[];
      maxDurationSeconds: number;
      isRequired: boolean;
      position: number;
    }) => unknown;
  }>;
}

describe("validateQuestionInput", () => {
  it("normalizes bounded question-bank fields", async () => {
    const { validateQuestionInput } = await validationModule();

    expect(
      validateQuestionInput({
        questionText: "  Describe a production incident you owned.  ",
        difficulty: " HARD ",
        expectedAreas: ["  diagnosis  ", " remediation "],
        followUpHints: ["  Ask about verification.  "],
        maxDurationSeconds: 600,
        isRequired: true,
        position: 2,
      }),
    ).toEqual({
      ok: true,
      value: {
        questionText: "Describe a production incident you owned.",
        difficulty: "hard",
        expectedAreas: ["diagnosis", "remediation"],
        followUpHints: ["Ask about verification."],
        maxDurationSeconds: 600,
        isRequired: true,
        position: 2,
      },
    });
  });

  it("requires non-empty question text no longer than 4000 characters", async () => {
    const { validateQuestionInput } = await validationModule();
    const base = {
      difficulty: "medium",
      expectedAreas: [],
      followUpHints: [],
      maxDurationSeconds: 300,
      isRequired: true,
      position: 0,
    };

    expect(validateQuestionInput({ ...base, questionText: "   " })).toEqual({
      ok: false,
      message: "Question text is required.",
    });
    expect(
      validateQuestionInput({ ...base, questionText: "x".repeat(4001) }),
    ).toEqual({
      ok: false,
      message: "Question text must be 4000 characters or fewer.",
    });
  });

  it("accepts only easy, medium, or hard difficulty", async () => {
    const { validateQuestionInput } = await validationModule();

    expect(
      validateQuestionInput({
        questionText: "Tell me about a tradeoff.",
        difficulty: "expert",
        expectedAreas: [],
        followUpHints: [],
        maxDurationSeconds: 300,
        isRequired: true,
        position: 0,
      }),
    ).toEqual({
      ok: false,
      message: "Question difficulty must be easy, medium, or hard.",
    });
  });

  it("bounds and normalizes expected areas and follow-up hints", async () => {
    const { validateQuestionInput } = await validationModule();
    const base = {
      questionText: "Tell me about a tradeoff.",
      difficulty: "medium",
      maxDurationSeconds: 300,
      isRequired: true,
      position: 0,
    };

    expect(
      validateQuestionInput({
        ...base,
        expectedAreas: Array.from({ length: 21 }, () => "area"),
        followUpHints: [],
      }),
    ).toEqual({
      ok: false,
      message: "Expected areas cannot contain more than 20 items.",
    });

    expect(
      validateQuestionInput({
        ...base,
        expectedAreas: ["   "],
        followUpHints: [],
      }),
    ).toEqual({
      ok: false,
      message: "Each expected area must be between 1 and 500 characters.",
    });

    expect(
      validateQuestionInput({
        ...base,
        expectedAreas: [],
        followUpHints: ["x".repeat(501)],
      }),
    ).toEqual({
      ok: false,
      message: "Each follow-up hint must be between 1 and 500 characters.",
    });
  });

  it("requires bounded integer duration and non-negative integer ordering", async () => {
    const { validateQuestionInput } = await validationModule();
    const base = {
      questionText: "Tell me about a tradeoff.",
      difficulty: "medium",
      expectedAreas: [],
      followUpHints: [],
      isRequired: false,
    };

    for (const maxDurationSeconds of [0, 3601, 1.5, Number.NaN]) {
      expect(
        validateQuestionInput({ ...base, maxDurationSeconds, position: 0 }),
      ).toEqual({
        ok: false,
        message: "Question duration must be an integer between 1 and 3600 seconds.",
      });
    }

    for (const position of [-1, 1.5, Number.NaN]) {
      expect(
        validateQuestionInput({ ...base, maxDurationSeconds: 300, position }),
      ).toEqual({
        ok: false,
        message: "Question position must be a non-negative integer.",
      });
    }
  });
});
