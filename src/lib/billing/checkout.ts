import type { BillingPlanId } from "@/config/billing-plans";

const BILLING_MANAGER_ROLES = new Set(["owner", "admin"]);
const APPLICATION_ORIGIN = "https://app.example.com";

interface BillingCheckoutRequest {
  organizationId: string;
  planId: BillingPlanId;
  successUrl: string;
  cancelUrl: string;
}

interface BillingCheckoutProvider {
  ensureCustomer(organizationId: string): Promise<string>;
  createCheckoutSession(input: {
    organizationId: string;
    customerId: string;
    planId: BillingPlanId;
    successUrl: string;
    cancelUrl: string;
  }): Promise<{ url: string }>;
}

function assertApplicationRedirect(url: string): void {
  let parsed: URL;

  try {
    parsed = new URL(url);
  } catch {
    throw new Error("Invalid billing redirect URL");
  }

  if (parsed.origin !== APPLICATION_ORIGIN) {
    throw new Error("Invalid billing redirect URL");
  }
}

export async function createBillingCheckout(
  request: BillingCheckoutRequest,
  role: string,
  provider: BillingCheckoutProvider,
): Promise<{ url: string }> {
  if (!BILLING_MANAGER_ROLES.has(role)) {
    throw new Error("Not authorized to manage billing");
  }

  assertApplicationRedirect(request.successUrl);
  assertApplicationRedirect(request.cancelUrl);

  const customerId = await provider.ensureCustomer(request.organizationId);

  return provider.createCheckoutSession({
    organizationId: request.organizationId,
    customerId,
    planId: request.planId,
    successUrl: request.successUrl,
    cancelUrl: request.cancelUrl,
  });
}
