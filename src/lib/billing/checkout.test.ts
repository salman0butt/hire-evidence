import { describe, expect, it, vi } from "vitest";

import { createBillingCheckout } from "./checkout";

const baseRequest = {
  organizationId: "org-123",
  planId: "growth" as const,
  successUrl: "https://app.example.com/settings/billing?checkout=success",
  cancelUrl: "https://app.example.com/settings/billing?checkout=cancelled",
};

describe("billing checkout", () => {
  it.each(["owner", "admin"] as const)(
    "allows %s to create an organization-bound checkout session",
    async (role) => {
      const ensureCustomer = vi.fn().mockResolvedValue("cus_123");
      const createCheckoutSession = vi
        .fn()
        .mockResolvedValue({ url: "https://checkout.stripe.test/session" });

      await expect(
        createBillingCheckout(baseRequest, role, {
          ensureCustomer,
          createCheckoutSession,
        }),
      ).resolves.toEqual({ url: "https://checkout.stripe.test/session" });

      expect(ensureCustomer).toHaveBeenCalledWith("org-123");
      expect(createCheckoutSession).toHaveBeenCalledWith({
        organizationId: "org-123",
        customerId: "cus_123",
        planId: "growth",
        successUrl: baseRequest.successUrl,
        cancelUrl: baseRequest.cancelUrl,
      });
    },
  );

  it.each(["recruiter", "hiring_manager", "reviewer"] as const)(
    "rejects %s before touching the billing provider",
    async (role) => {
      const ensureCustomer = vi.fn();
      const createCheckoutSession = vi.fn();

      await expect(
        createBillingCheckout(baseRequest, role, {
          ensureCustomer,
          createCheckoutSession,
        }),
      ).rejects.toThrow("Not authorized to manage billing");

      expect(ensureCustomer).not.toHaveBeenCalled();
      expect(createCheckoutSession).not.toHaveBeenCalled();
    },
  );

  it("rejects checkout redirects outside the application origin", async () => {
    const ensureCustomer = vi.fn();
    const createCheckoutSession = vi.fn();

    await expect(
      createBillingCheckout(
        {
          ...baseRequest,
          successUrl: "https://attacker.example/steal",
        },
        "owner",
        { ensureCustomer, createCheckoutSession },
      ),
    ).rejects.toThrow("Invalid billing redirect URL");

    expect(ensureCustomer).not.toHaveBeenCalled();
    expect(createCheckoutSession).not.toHaveBeenCalled();
  });
});
