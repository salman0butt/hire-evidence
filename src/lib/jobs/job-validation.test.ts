import { describe, expect, it } from "vitest";

import { validateJobInput } from "./job-validation";

describe("validateJobInput", () => {
  it("normalizes bounded job fields and preserves explicit requirement kinds", () => {
    expect(
      validateJobInput({
        title: "  Senior Platform Engineer  ",
        department: " Engineering ",
        description: " Build reliable systems. ",
        responsibilities: " Own platform reliability. ",
        seniority: " Senior ",
        employmentType: " Full-time ",
        location: " Remote ",
        salaryRange: " 80k-100k ",
        interviewInstructions: " Focus on job-related evidence. ",
        requirements: [
          { kind: "must_have", requirement: " TypeScript " },
          { kind: "nice_to_have", requirement: " Kubernetes " },
        ],
      }),
    ).toEqual({
      ok: true,
      value: {
        title: "Senior Platform Engineer",
        department: "Engineering",
        description: "Build reliable systems.",
        responsibilities: "Own platform reliability.",
        seniority: "Senior",
        employmentType: "Full-time",
        location: "Remote",
        salaryRange: "80k-100k",
        interviewInstructions: "Focus on job-related evidence.",
        requirements: [
          { kind: "must_have", requirement: "TypeScript" },
          { kind: "nice_to_have", requirement: "Kubernetes" },
        ],
      },
    });
  });

  it("requires a non-empty bounded title", () => {
    expect(validateJobInput({ title: "   ", requirements: [] })).toEqual({
      ok: false,
      message: "Job title is required.",
    });

    expect(
      validateJobInput({ title: "x".repeat(161), requirements: [] }),
    ).toEqual({
      ok: false,
      message: "Job title must be 160 characters or fewer.",
    });
  });

  it("rejects malformed or unsupported requirements", () => {
    expect(
      validateJobInput({
        title: "Engineer",
        requirements: [{ kind: "required", requirement: "TypeScript" }],
      }),
    ).toEqual({
      ok: false,
      message: "Job requirement kind must be must_have or nice_to_have.",
    });

    expect(
      validateJobInput({
        title: "Engineer",
        requirements: [{ kind: "must_have", requirement: "   " }],
      }),
    ).toEqual({
      ok: false,
      message: "Job requirement is required.",
    });

    expect(
      validateJobInput({
        title: "Engineer",
        requirements: "TypeScript",
      }),
    ).toEqual({
      ok: false,
      message: "Job requirements must be a list.",
    });
  });

  it("enforces the persisted field bounds before the database RPC", () => {
    expect(
      validateJobInput({
        title: "Engineer",
        department: "x".repeat(121),
        requirements: [],
      }),
    ).toEqual({
      ok: false,
      message: "Department must be 120 characters or fewer.",
    });

    expect(
      validateJobInput({
        title: "Engineer",
        interviewInstructions: "x".repeat(5001),
        requirements: [],
      }),
    ).toEqual({
      ok: false,
      message: "Interview instructions must be 5000 characters or fewer.",
    });

    expect(
      validateJobInput({
        title: "Engineer",
        requirements: [
          { kind: "must_have", requirement: "x".repeat(501) },
        ],
      }),
    ).toEqual({
      ok: false,
      message: "Job requirement must be 500 characters or fewer.",
    });
  });
});
