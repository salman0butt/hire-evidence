const BILLING_MANAGER_ROLES = new Set(["owner", "admin"]);
const APPLICATION_ORIGIN = "https://app.example.com";

interface BillingPortalRequest {
  organizationId: string;
  customerId: string;
  returnUrl: string;
}

interface BillingPortalProvider {
  createPortalSession(input: {
    organizationId: string;
    customerId: string;
    returnUrl: string;
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

export async function createBillingPortal(
  request: BillingPortalRequest,
  role: string,
  provider: BillingPortalProvider,
): Promise<{ url: string }> {
  if (!BILLING_MANAGER_ROLES.has(role)) {
    throw new Error("Not authorized to manage billing");
  }

  assertApplicationRedirect(request.returnUrl);

  return provider.createPortalSession({
    organizationId: request.organizationId,
    customerId: request.customerId,
    returnUrl: request.returnUrl,
  });
}
