import { describe, expect, it } from "vitest";

import { validateCompetencyInput } from "./competency-validation";

describe("validateCompetencyInput", () => {
  it("normalizes bounded competency fields", () => {
    expect(
      validateCompetencyInput({
        name: "  Systems design  ",
        description: "  Designs reliable job-relevant systems.  ",
        weight: 40,
        position: 2,
      }),
    ).toEqual({
      ok: true,
      value: {
        name: "Systems design",
        description: "Designs reliable job-relevant systems.",
        weight: 40,
        position: 2,
      },
    });
  });

  it("requires a non-empty competency name no longer than 160 characters", () => {
    expect(
      validateCompetencyInput({
        name: "   ",
        description: null,
        weight: 25,
        position: 0,
      }),
    ).toEqual({ ok: false, message: "Competency name is required." });

    expect(
      validateCompetencyInput({
        name: "x".repeat(161),
        description: null,
        weight: 25,
        position: 0,
      }),
    ).toEqual({
      ok: false,
      message: "Competency name must be 160 characters or fewer.",
    });
  });

  it("normalizes blank descriptions and rejects descriptions over 2000 characters", () => {
    expect(
      validateCompetencyInput({
        name: "Communication",
        description: "   ",
        weight: 25,
        position: 0,
      }),
    ).toEqual({
      ok: true,
      value: {
        name: "Communication",
        description: null,
        weight: 25,
        position: 0,
      },
    });

    expect(
      validateCompetencyInput({
        name: "Communication",
        description: "x".repeat(2001),
        weight: 25,
        position: 0,
      }),
    ).toEqual({
      ok: false,
      message: "Competency description must be 2000 characters or fewer.",
    });
  });

  it("requires a finite weight greater than zero and at most 100", () => {
    for (const weight of [0, -1, 101, Number.NaN, Number.POSITIVE_INFINITY]) {
      expect(
        validateCompetencyInput({
          name: "Execution",
          description: null,
          weight,
          position: 0,
        }),
      ).toEqual({
        ok: false,
        message: "Competency weight must be greater than 0 and at most 100.",
      });
    }
  });

  it("requires a non-negative integer position", () => {
    for (const position of [-1, 1.5, Number.NaN]) {
      expect(
        validateCompetencyInput({
          name: "Execution",
          description: null,
          weight: 25,
          position,
        }),
      ).toEqual({
        ok: false,
        message: "Competency position must be a non-negative integer.",
      });
    }
  });
});
