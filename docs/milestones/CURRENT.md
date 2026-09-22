# Current Milestone

Milestone: Billing + Usage (M09)

Status: **IMPLEMENTATION COMPLETE — MERGE PENDING**

Branch: `feat/billing-usage`
PR: #11 — `Build organization billing and usage` — OPEN / DRAFT / mergeable at latest recovery.
Base: `main` at M08 merge SHA `03be2d5857d04744af1b1e47c5351f08de0ae793`.
Verified closeout head before this durable reconciliation: `2fd33f1a57be3b7dbd5242536a46f43f2212a51f`; CI #1051 / run `35754819174` — GREEN.

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
8. M09.8 Server-side entitlement enforcement — VERIFIED.
9. M09.9 Billing security/idempotency E2E + closeout — VERIFIED by full CI #1051 on `2fd33f1a57be3b7dbd5242536a46f43f2212a51f`.

## Review state
Unresolved Critical: 0 known. Unresolved Important: 0 known. Unresolved PR review comments/threads: 0 at latest recovery.

## Constraints
Billing authority is server-side. Client-reported duration cannot create usage or grant capacity. Stripe webhooks require signature verification and idempotency. Organization billing data remains tenant-isolated and role-authorized. Billing must not alter hiring evidence or candidate scoring.

## Next action
Verify exact-head CI after the durable closeout reconciliation. If GREEN and the PR remains mergeable with no new blocking review or concurrent branch movement, mark PR #11 ready and squash-merge using expected-head protection. Verify post-merge `main`, activate M10 AI Quality, Guardrails & Evals, and continue.