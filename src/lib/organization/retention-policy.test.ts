import { describe, expect, it } from "vitest";

import { createRetentionPolicy } from "./retention-policy";

describe("organization retention policy", () => {
  it("requires explicit bounded retention windows and returns an immutable policy", () => {
    const policy = createRetentionPolicy({
      organizationId: "org-1",
      transcriptDays: 90,
      assessmentDays: 180,
      evidenceDays: 365,
      aiTraceDays: 30,
    });

    expect(policy).toEqual({
      organizationId: "org-1",
      transcriptDays: 90,
      assessmentDays: 180,
      evidenceDays: 365,
      aiTraceDays: 30,
    });
    expect(Object.isFrozen(policy)).toBe(true);
  });

  it("rejects missing, fractional, zero, negative, or unbounded retention values", () => {
    expect(() =>
      createRetentionPolicy({
        organizationId: "org-1",
        transcriptDays: 0,
        assessmentDays: 180,
        evidenceDays: 365,
        aiTraceDays: 30,
      }),
    ).toThrow("invalid retention policy");

    expect(() =>
      createRetentionPolicy({
        organizationId: "org-1",
        transcriptDays: 90.5,
        assessmentDays: 180,
        evidenceDays: 365,
        aiTraceDays: 30,
      }),
    ).toThrow("invalid retention policy");

    expect(() =>
      createRetentionPolicy({
        organizationId: "org-1",
        transcriptDays: 90,
        assessmentDays: 180,
        evidenceDays: 3651,
        aiTraceDays: 30,
      }),
    ).toThrow("invalid retention policy");
  });

  it("rejects empty organization identity rather than inventing a default policy", () => {
    expect(() =>
      createRetentionPolicy({
        organizationId: " ",
        transcriptDays: 90,
        assessmentDays: 180,
        evidenceDays: 365,
        aiTraceDays: 30,
      }),
    ).toThrow("invalid retention policy");
  });
});
