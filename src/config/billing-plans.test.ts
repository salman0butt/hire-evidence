import { describe, expect, it } from "vitest";

import { billingPlans, getBillingPlan } from "./billing-plans";

describe("organization billing plans", () => {
  it("defines stable plans with authoritative interview-second limits", () => {
    expect(billingPlans.map((plan) => plan.id)).toEqual(["starter", "growth"]);

    for (const plan of billingPlans) {
      expect(plan.name.trim()).not.toBe("");
      expect(plan.monthlyInterviewSeconds).toBeGreaterThan(0);
      expect(Number.isInteger(plan.monthlyInterviewSeconds)).toBe(true);
    }

    expect(getBillingPlan("starter")).toEqual(billingPlans[0]);
  });

  it("fails closed for an unknown plan id", () => {
    expect(() => getBillingPlan("enterprise-unconfigured")).toThrow(
      /unknown billing plan/i,
    );
  });
});
