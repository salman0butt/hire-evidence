import type { PlanId } from "./plans";

export type BillingSubscription = {
  id: string;
  customerId: string;
  status: string;
  planId: PlanId;
  currentPeriodStart: string;
  currentPeriodEnd: string;
};

type BillingWebhookEvent = {
  id: string;
  type: string;
  subscription?: BillingSubscription;
};

type ProcessBillingWebhookInput = {
  rawBody: string;
  signature: string;
  verifyEvent: (rawBody: string, signature: string) => BillingWebhookEvent;
  hasProcessedEvent: (eventId: string) => Promise<boolean>;
  applySubscription: (subscription: BillingSubscription) => Promise<void>;
  markEventProcessed: (eventId: string) => Promise<void>;
};

const SUPPORTED_SUBSCRIPTION_EVENTS = new Set([
  "customer.subscription.created",
  "customer.subscription.updated",
  "customer.subscription.deleted",
]);

export async function processBillingWebhook(input: ProcessBillingWebhookInput): Promise<void> {
  const event = input.verifyEvent(input.rawBody, input.signature);

  if (await input.hasProcessedEvent(event.id)) {
    return;
  }

  if (!SUPPORTED_SUBSCRIPTION_EVENTS.has(event.type) || !event.subscription) {
    return;
  }

  await input.applySubscription(event.subscription);
  await input.markEventProcessed(event.id);
}
