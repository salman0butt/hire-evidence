import { describe, expect, it } from "vitest";

import { pricingPlans } from "./pricing";

describe("pricingPlans", () => {
  it("keeps the milestone pricing offer explicit and non-billing", () => {
    expect(pricingPlans).toHaveLength(1);
    expect(pricingPlans[0]).toMatchObject({
      name: "Starter",
      status: "placeholder",
      ctaHref: "/auth/signup",
    });
    expect(pricingPlans[0]?.ctaLabel.trim()).not.toBe("");
    expect(pricingPlans[0]?.priceLabel).toMatch(/coming soon/i);
  });
});
