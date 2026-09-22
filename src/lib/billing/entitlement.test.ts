import { describe, expect, it } from "vitest";

import { assertInterviewEntitlement } from "./entitlement";

const activeStarter = {
  organizationId: "org-a",
  planId: "starter" as const,
  subscriptionStatus: "active" as const,
  consumedInterviewSeconds: 900,
  periodStartsAt: "2026-09-01T00:00:00.000Z",
  periodEndsAt: "2026-10-01T00:00:00.000Z",
};

describe("server-side interview entitlement", () => {
  it("allows an active organization with remaining authoritative allowance", () => {
    expect(assertInterviewEntitlement(activeStarter)).toMatchObject({
      organizationId: "org-a",
      planId: "starter",
      remainingInterviewSeconds: 2_700,
    });
  });

  it.each(["incomplete", "past_due", "canceled", "unpaid"] as const)(
    "fails closed for %s subscription state",
    (subscriptionStatus) => {
      expect(() =>
        assertInterviewEntitlement({ ...activeStarter, subscriptionStatus }),
      ).toThrow("Interview entitlement unavailable");
    },
  );

  it("rejects exhausted authoritative usage regardless of client state", () => {
    expect(() =>
      assertInterviewEntitlement({
        ...activeStarter,
        consumedInterviewSeconds: 3_600,
      }),
    ).toThrow("Interview entitlement exhausted");
  });

  it("fails closed when subscription or usage state is malformed", () => {
    expect(() =>
      assertInterviewEntitlement({
        ...activeStarter,
        consumedInterviewSeconds: Number.NaN,
      }),
    ).toThrow("Invalid billing usage period");
  });
});
