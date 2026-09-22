# Billing + Usage Implementation Plan

Date: 2026-09-22
Milestone: M09
Design: `docs/superpowers/specs/2026-09-22-billing-usage-design.md`
Status: AUTO-APPROVED after self-review

## Execution rules
Use strict RED → GREEN for behavioral changes. Push durable RED evidence when repository policy requires it. After each unit run focused tests, broader relevant tests, skeptical security/tenancy review, then exact-head CI before classifying the unit VERIFIED. Never accept client-reported duration as usage authority.

## M09.1 — Plan configuration
1. Inspect existing domain/config/test conventions and package layout.
2. Add the smallest test defining stable organization plan IDs, explicit limits in interview seconds, presentation metadata, and fail-closed lookup for unknown plan IDs.
3. Verify genuine RED.
4. Implement the minimal typed server-owned plan catalog and lookup boundary.
5. Verify focused GREEN, then repository quality gates.
6. Review for accidental Stripe coupling, mutable runtime authority, or ambiguous units.
7. Reconcile milestone/status/traceability and exact-head CI.

## M09.2 — Subscription persistence
1. RED database contract for organization billing state, valid plan/status constraints and tenant-safe foreign keys/RLS.
2. Implement migration and repository projection.
3. Verify Org A/Org B/unauthenticated access and update authorization.
4. Record exact migration/database evidence.

## M09.3 — Stripe customer + checkout
1. RED adapter/route tests for authorized billing roles, server-only secrets, controlled redirect URLs and organization-bound customer creation.
2. Implement narrow Stripe adapter and checkout action.
3. Verify unauthorized roles/cross-tenant input fail closed.

## M09.4 — Webhook synchronization
1. RED tests for raw-body signature verification, supported event mapping and duplicate event IDs.
2. Implement verified idempotent webhook processing and persistence.
3. Verify malformed/forged/duplicate/out-of-order relevant events do not grant invalid entitlement.

## M09.5 — Portal and plan lifecycle
1. RED authorized portal/cancellation/plan-change behavior.
2. Implement customer-bound portal/session path and synchronized lifecycle presentation.
3. Verify role, tenant and redirect boundaries.

## M09.6 — Server-authoritative usage
1. RED tests proving usage is derived from authoritative finalized attempt timing/duration and duplicate finalization is idempotent.
2. Implement interview-second usage records keyed to authoritative attempt/finalization identity.
3. Add database isolation and replay tests.

## M09.7 — Usage period/meter
1. RED period projection tests for allowance, consumed, remaining and renewal bounds.
2. Implement bounded period aggregation and accessible organization billing view.
3. Verify empty/loading/error/over-limit states and keyboard/semantic behavior.

## M09.8 — Server-side enforcement
1. RED tests proving protected billable operations cannot proceed when subscription/allowance is invalid or exhausted, regardless of client state.
2. Implement entitlement service and integrate at the earliest authoritative server boundary.
3. Verify fail-closed provider/state uncertainty and tenant isolation.

## M09.9 — Security/idempotency E2E and closeout
1. Browser/API/database scenarios: authorized checkout/portal, forbidden roles, cross-tenant attempts, duplicate webhook, forged webhook, duplicate interview finalization, usage exhaustion and renewal-period behavior.
2. Full security, performance and accessibility review.
3. Run frozen install/format if configured/lint/typecheck/unit/integration/database/build/E2E/framework/PRD coverage gates.
4. Resolve all Critical/Important findings.
5. Reconcile feature matrix, traceability, milestone ledger, known issues, status and handoff.
6. Verify exact final head CI, then merge only if every authorized gate passes.

## Self-review
The sequence follows dependency order: internal plan identity before persistence, persistence before Stripe synchronization, synchronized state plus authoritative usage before enforcement. It deliberately postpones UI polish until the underlying server projection exists. No task depends on client authority, and no speculative generic billing framework is introduced.