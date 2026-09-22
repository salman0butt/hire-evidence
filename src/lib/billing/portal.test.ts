import { describe, expect, it, vi } from "vitest";

import { createBillingPortal } from "./portal";

const request = {
  organizationId: "org-123",
  customerId: "cus_123",
  returnUrl: "https://app.example.com/settings/billing",
};

describe("billing portal", () => {
  it.each(["owner", "admin"] as const)(
    "allows %s to create a customer-bound portal session",
    async (role) => {
      const createPortalSession = vi
        .fn()
        .mockResolvedValue({ url: "https://billing.stripe.test/session" });

      await expect(
        createBillingPortal(request, role, { createPortalSession }),
      ).resolves.toEqual({ url: "https://billing.stripe.test/session" });

      expect(createPortalSession).toHaveBeenCalledWith({
        organizationId: "org-123",
        customerId: "cus_123",
        returnUrl: request.returnUrl,
      });
    },
  );

  it.each(["recruiter", "hiring_manager", "reviewer"] as const)(
    "rejects %s before touching the billing provider",
    async (role) => {
      const createPortalSession = vi.fn();

      await expect(
        createBillingPortal(request, role, { createPortalSession }),
      ).rejects.toThrow("Not authorized to manage billing");

      expect(createPortalSession).not.toHaveBeenCalled();
    },
  );

  it("rejects portal redirects outside the application origin", async () => {
    const createPortalSession = vi.fn();

    await expect(
      createBillingPortal(
        { ...request, returnUrl: "https://attacker.example/steal" },
        "owner",
        { createPortalSession },
      ),
    ).rejects.toThrow("Invalid billing redirect URL");

    expect(createPortalSession).not.toHaveBeenCalled();
  });
});
