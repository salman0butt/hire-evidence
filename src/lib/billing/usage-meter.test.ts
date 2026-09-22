import { describe, expect, it } from "vitest";

import { projectBillingUsagePeriod } from "./usage-meter";

describe("billing usage period meter", () => {
  it("projects allowance, consumed, remaining, and renewal bounds", () => {
    expect(
      projectBillingUsagePeriod({
        planId: "starter",
        consumedInterviewSeconds: 900,
        periodStartsAt: "2026-09-01T00:00:00.000Z",
        periodEndsAt: "2026-10-01T00:00:00.000Z",
      }),
    ).toEqual({
      allowanceInterviewSeconds: 3_600,
      consumedInterviewSeconds: 900,
      remainingInterviewSeconds: 2_700,
      periodStartsAt: "2026-09-01T00:00:00.000Z",
      periodEndsAt: "2026-10-01T00:00:00.000Z",
      exhausted: false,
    });
  });

  it("clamps remaining usage at zero once the allowance is exhausted", () => {
    expect(
      projectBillingUsagePeriod({
        planId: "starter",
        consumedInterviewSeconds: 3_601,
        periodStartsAt: "2026-09-01T00:00:00.000Z",
        periodEndsAt: "2026-10-01T00:00:00.000Z",
      }),
    ).toMatchObject({
      allowanceInterviewSeconds: 3_600,
      consumedInterviewSeconds: 3_601,
      remainingInterviewSeconds: 0,
      exhausted: true,
    });
  });

  it("fails closed for invalid period bounds or usage", () => {
    expect(() =>
      projectBillingUsagePeriod({
        planId: "starter",
        consumedInterviewSeconds: -1,
        periodStartsAt: "2026-09-01T00:00:00.000Z",
        periodEndsAt: "2026-10-01T00:00:00.000Z",
      }),
    ).toThrow("Invalid billing usage period");

    expect(() =>
      projectBillingUsagePeriod({
        planId: "starter",
        consumedInterviewSeconds: 0,
        periodStartsAt: "2026-10-01T00:00:00.000Z",
        periodEndsAt: "2026-09-01T00:00:00.000Z",
      }),
    ).toThrow("Invalid billing usage period");
  });
});
