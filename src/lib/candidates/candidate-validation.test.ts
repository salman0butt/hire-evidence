import { describe, expect, it } from "vitest";

import { validateCandidateInput } from "./candidate-validation";

describe("validateCandidateInput", () => {
  it("normalizes bounded candidate identity fields", () => {
    expect(
      validateCandidateInput({
        fullName: "  Ada Lovelace  ",
        email: "  ADA@EXAMPLE.COM  ",
      }),
    ).toEqual({
      ok: true,
      value: {
        fullName: "Ada Lovelace",
        email: "ada@example.com",
      },
    });
  });

  it("requires a non-empty bounded full name", () => {
    expect(
      validateCandidateInput({ fullName: "   ", email: "ada@example.com" }),
    ).toEqual({
      ok: false,
      message: "Candidate name is required.",
    });

    expect(
      validateCandidateInput({
        fullName: "x".repeat(201),
        email: "ada@example.com",
      }),
    ).toEqual({
      ok: false,
      message: "Candidate name must be 200 characters or fewer.",
    });
  });

  it("requires a normalized bounded email-like value", () => {
    expect(validateCandidateInput({ fullName: "Ada", email: "   " })).toEqual({
      ok: false,
      message: "Candidate email is required.",
    });

    expect(
      validateCandidateInput({ fullName: "Ada", email: "not-an-email" }),
    ).toEqual({
      ok: false,
      message: "Candidate email must be valid.",
    });

    expect(
      validateCandidateInput({
        fullName: "Ada",
        email: `${"a".repeat(309)}@example.com`,
      }),
    ).toEqual({
      ok: false,
      message: "Candidate email must be 320 characters or fewer.",
    });
  });
});
