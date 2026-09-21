# Current Milestone

Milestone: Billing + Usage (M09)

Status: **ACTIVE — M09.1 PLAN CONFIGURATION**

Branch: `feat/billing-usage`
PR: not yet created; create after the first coherent durable branch state.
Base: `main` at M08 merge SHA `03be2d5857d04744af1b1e47c5351f08de0ae793`.
Post-merge verification: CI #1029 / run `35651665555` — GREEN on exact `main` SHA `03be2d5857d04744af1b1e47c5351f08de0ae793`.

Design: `docs/superpowers/specs/2026-09-22-billing-usage-design.md`
Plan: `docs/superpowers/plans/2026-09-22-billing-usage.md`

## Iterations
1. M09.1 Plan configuration — ACTIVE.
2. M09.2 Subscription persistence — NOT STARTED.
3. M09.3 Stripe customer + checkout — NOT STARTED.
4. M09.4 Webhook synchronization — NOT STARTED.
5. M09.5 Billing portal + cancellation/plan changes — NOT STARTED.
6. M09.6 Server-authoritative interview-second usage — NOT STARTED.
7. M09.7 Usage periods/meter — NOT STARTED.
8. M09.8 Server-side entitlement enforcement — NOT STARTED.
9. M09.9 Billing security/idempotency E2E + closeout — NOT STARTED.

## Review state
Unresolved Critical: 0 known. Unresolved Important: 0 known at activation.

## Constraints
Billing authority is server-side. Client-reported duration cannot create usage or grant capacity. Stripe webhooks require signature verification and idempotency. Organization billing data remains tenant-isolated and role-authorized. Billing must not alter hiring evidence or candidate scoring.

## Next action
Execute M09.1 under strict TDD: inspect existing domain/config/test conventions, add the smallest behavioral test for stable typed plan IDs and interview-second limits with fail-closed unknown-plan lookup, verify genuine RED, then implement the minimal catalog.