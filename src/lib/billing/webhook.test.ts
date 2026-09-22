import { describe, expect, it, vi } from "vitest";

import { processBillingWebhook } from "./webhook";

describe("processBillingWebhook", () => {
  it("verifies the raw signed payload before applying subscription state", async () => {
    const verifyEvent = vi.fn().mockReturnValue({
      id: "evt_1",
      type: "customer.subscription.updated",
      subscription: {
        id: "sub_1",
        customerId: "cus_1",
        status: "active",
        planId: "growth",
        currentPeriodStart: "2026-09-22T00:00:00.000Z",
        currentPeriodEnd: "2026-10-22T00:00:00.000Z",
      },
    });
    const hasProcessedEvent = vi.fn().mockResolvedValue(false);
    const applySubscription = vi.fn().mockResolvedValue(undefined);
    const markEventProcessed = vi.fn().mockResolvedValue(undefined);

    await processBillingWebhook({
      rawBody: "raw-payload",
      signature: "valid-signature",
      verifyEvent,
      hasProcessedEvent,
      applySubscription,
      markEventProcessed,
    });

    expect(verifyEvent).toHaveBeenCalledWith("raw-payload", "valid-signature");
    expect(applySubscription).toHaveBeenCalledWith(
      expect.objectContaining({ id: "sub_1", customerId: "cus_1", planId: "growth" }),
    );
    expect(markEventProcessed).toHaveBeenCalledWith("evt_1");
  });

  it("does not apply a duplicate event", async () => {
    const applySubscription = vi.fn();
    const markEventProcessed = vi.fn();

    await processBillingWebhook({
      rawBody: "raw-payload",
      signature: "valid-signature",
      verifyEvent: vi.fn().mockReturnValue({ id: "evt_duplicate", type: "customer.subscription.updated" }),
      hasProcessedEvent: vi.fn().mockResolvedValue(true),
      applySubscription,
      markEventProcessed,
    });

    expect(applySubscription).not.toHaveBeenCalled();
    expect(markEventProcessed).not.toHaveBeenCalled();
  });
});
