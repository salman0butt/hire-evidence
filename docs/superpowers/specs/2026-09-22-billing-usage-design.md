# Billing + Usage Design

Date: 2026-09-22
Milestone: M09 — Billing + Usage
Status: AUTO-APPROVED after repository/PRD recovery and self-review

## Context
M08 is merged into `main` as `03be2d5857d04744af1b1e47c5351f08de0ae793`; post-merge CI #1029 is GREEN. M09 is therefore the next dependency-valid milestone.

The PRD requires organization subscriptions, Stripe, plans, interview-minute usage, server-side enforcement, usage meter, checkout, portal, cancellation and webhooks. The repository safety invariant is stronger than UI convenience: client-reported duration must never create billing authority or grant capacity.

## Design goals
- Keep billing organization-scoped and tenant-isolated.
- Keep plan configuration deterministic and application-owned.
- Treat Stripe as payment/subscription synchronization, not authorization truth for request scope.
- Synchronize external billing state through verified, idempotent webhook handling.
- Meter server-authoritative interview seconds only.
- Enforce entitlements on the server before protected/billable actions.
- Make duplicate finalization and duplicate webhook delivery safe.
- Avoid speculative billing abstractions beyond the PRD.

## Selected architecture

### Plan catalog
Define a small typed server-owned plan catalog with stable plan IDs and explicit limits. Limits are expressed in authoritative units (interview seconds for usage), while presentation may convert to minutes. Plan lookup is fail-closed for unknown IDs. Stripe price IDs are configuration bindings, not plan identity.

### Subscription persistence
Persist one organization billing projection containing organization ID, internal plan ID, Stripe customer/subscription identifiers where applicable, subscription status, current period bounds and cancellation state. Tenant authorization continues through existing organization membership/RBAC and RLS patterns.

### Stripe boundary
Create a narrow Stripe adapter for customer, checkout and billing portal operations. Only authorized organization roles may initiate billing mutations. Secrets stay server-only. Redirect URLs are application-controlled/validated.

### Webhook synchronization
Verify Stripe signatures before parsing trusted events. Map supported event types to idempotent organization billing transitions. Store/process Stripe event IDs so retries cannot duplicate state changes. Unknown/unneeded event types are acknowledged without granting entitlement.

### Usage accounting
Interview completion/finalization emits or records usage from server-owned attempt timing/duration. Store seconds as the canonical unit with an idempotency key tied to the authoritative attempt/finalization identity. Client duration is never accepted as billable truth.

### Entitlement enforcement
A server-side entitlement service combines plan limits, synchronized subscription state and current usage period. Protected/billable operations call this service before proceeding. UI meters are informational views of the same server projection, never the enforcement mechanism.

### Failure behavior
Billing/provider uncertainty fails closed for paid entitlement grants while preserving safe read paths. Duplicate webhook/finalization delivery is idempotent. Provider outages do not mutate usage from client claims. Historical usage/subscription evidence remains auditable.

## Alternatives considered
1. **Stripe state directly as application authorization.** Rejected: couples request authorization to external object shape and weakens tenant/application invariants.
2. **Client-side minute counters.** Rejected: violates the explicit server-authoritative billing requirement and is trivially bypassable.
3. **Generic metering/event platform now.** Rejected by YAGNI; M09 needs interview-second usage and bounded subscription billing only.
4. **Database-defined arbitrary plans.** Deferred; the MVP can use an application-owned typed catalog, reducing unsafe runtime configuration and simplifying enforcement.

## Security review
- Stripe secret/webhook secret are server-only.
- Verify webhook signature over the raw request body before trusting event data.
- Resolve organization ownership server-side; never accept arbitrary client organization/customer binding.
- Restrict checkout/portal/plan changes to explicit billing-capable organization roles.
- RLS protects organization billing and usage records.
- Idempotency keys prevent duplicate charges/state/usage accounting.
- Never trust client-authoritative interview duration.
- No billing behavior may alter hiring evidence or candidate scoring.

## Accessibility/UI notes
Billing UI must expose semantic labels, keyboard-accessible actions, clear current plan/usage/renewal state, and explicit loading/error states. Usage presentation should not hide the authoritative unit/renewal semantics.

## Performance notes
Plan lookup is constant/bounded. Usage aggregation must be period-scoped and indexed rather than unbounded history scans. Webhook work should remain bounded and idempotent; external retries are expected.

## Iteration mapping
- M09.1 typed plan catalog and fail-closed lookup.
- M09.2 organization subscription persistence/RLS.
- M09.3 authorized Stripe customer + checkout.
- M09.4 verified idempotent webhook synchronization.
- M09.5 portal/cancellation/plan-change path.
- M09.6 server-authoritative interview-second usage.
- M09.7 usage-period projection/meter.
- M09.8 server-side entitlement enforcement.
- M09.9 adversarial/idempotency/security E2E and closeout.

## Self-review
The design preserves existing tenant/RBAC boundaries, keeps billing authority server-side, does not introduce a generic event system, and directly maps every M09 roadmap item. No Critical or Important design finding remains at activation.