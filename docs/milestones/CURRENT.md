# Current Milestone

Milestone: Billing + Usage (M09)

Status: **ACTIVE — M09.9 CLOSEOUT**

Branch: `feat/billing-usage`
PR: #11 — `Build organization billing and usage` — OPEN / DRAFT / mergeable at latest recovery.
Base: `main` at M08 merge SHA `03be2d5857d04744af1b1e47c5351f08de0ae793`.
Latest verified implementation: `41370c3fee0521bd70ee3aae51c7208245a91749`; CI #1047 / run `35734237183` — GREEN.

Design: `docs/superpowers/specs/2026-09-22-billing-usage-design.md`
Plan: `docs/superpowers/plans/2026-09-22-billing-usage.md`

## Iterations
1. M09.1 Plan configuration — VERIFIED.
2. M09.2 Subscription persistence — VERIFIED.
3. M09.3 Stripe customer + checkout — VERIFIED.
4. M09.4 Webhook synchronization — VERIFIED.
5. M09.5 Billing portal + cancellation/plan changes — VERIFIED.
6. M09.6 Server-authoritative interview-second usage — VERIFIED.
7. M09.7 Usage periods/meter — VERIFIED.
8. M09.8 Server-side entitlement enforcement — VERIFIED at `41370c3f…`, CI #1047.
9. M09.9 Billing security/idempotency E2E + closeout — ACTIVE.

## Review state
Unresolved Critical: 0 known. Unresolved Important: 0 known. Unresolved PR review threads: 0 at latest recovery.

## Constraints
Billing authority is server-side. Client-reported duration cannot create usage or grant capacity. Stripe webhooks require signature verification and idempotency. Organization billing data remains tenant-isolated and role-authorized. Billing must not alter hiring evidence or candidate scoring.

## Next action
Complete M09.9 integrated security/idempotency verification and full repository gates, reconcile milestone/traceability/feature state, verify exact-final-head CI, then if every authorized merge gate remains satisfied mark PR #11 ready and squash-merge with expected-head protection. Verify post-merge `main`, activate M10, and continue.