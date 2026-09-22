# M09 — Billing + Usage

Status: **ACTIVE — M09.1 PLAN CONFIGURATION**

## Goal
Deliver the authoritative PRD milestone below as a reviewable, evidence-backed capability.

## Authoritative PRD Milestone Definition

# 204. MILESTONE 09 — BILLING + USAGE

Deliver:

```text
organization subscription
Stripe
plans
interview-minute usage
server-side enforcement
usage meter
checkout
portal
cancellation
webhooks
```

Exit:

organizations pay and limits are enforceable server-side.

## Dependencies
Organizations; stable interview lifecycle and usage events. M08 merged as `03be2d5857d04744af1b1e47c5351f08de0ae793`; post-merge CI #1029 is GREEN.

## In Scope
The authoritative definition plus every default iteration listed below.

## Out of Scope
Later milestones, speculative generic metering/event frameworks, arbitrary runtime-defined plans, and behavior not justified by the PRD.

## Architecture Notes
Stripe billing state is synchronized by verified idempotent webhooks. Server-authoritative interview seconds feed metering and entitlement checks; client-reported duration cannot grant capacity. Internal stable plan IDs remain separate from Stripe price IDs.

## Selected Design / Implementation Plan
- Design: `docs/superpowers/specs/2026-09-22-billing-usage-design.md`.
- Plan: `docs/superpowers/plans/2026-09-22-billing-usage.md`.
- Selected approach: typed application-owned plan catalog; organization-scoped subscription projection; narrow Stripe adapter; signature-verified idempotent webhook sync; authoritative attempt-derived usage seconds; server-side entitlement service.

## Acceptance Criteria
- PRD deliverables and exit criteria pass.
- All required iterations are complete or explicitly resolved.
- Relevant security/privacy/tenancy/accessibility/performance/AI-safety gates pass.
- Client duration never becomes billing authority.
- Duplicate finalization/webhook delivery is idempotent.
- 0 unresolved Critical or Important review findings.
- Traceability and feature state are reconciled.
- Exact-final-head CI is green.

## Tasks / Iterations
1. **ACTIVE** — M09.1 — Plan configuration: simple organization plans/limits.
2. **NOT STARTED** — M09.2 — Subscription persistence: organization billing state.
3. **NOT STARTED** — M09.3 — Stripe customer + checkout: authorized organization roles only.
4. **NOT STARTED** — M09.4 — Webhook synchronization: signature validation and idempotent state updates.
5. **NOT STARTED** — M09.5 — Billing portal + cancellation/plan changes.
6. **NOT STARTED** — M09.6 — Server-authoritative usage: interview seconds as source unit.
7. **NOT STARTED** — M09.7 — Usage periods/meter: current allowance, remaining and renewal.
8. **NOT STARTED** — M09.8 — Server-side enforcement: limits/entitlements cannot be bypassed by client.
9. **NOT STARTED** — M09.9 — Billing security/idempotency E2E: duplicate finalization/webhooks and authorization.

## TDD Evidence
M09.1 behavioral RED not yet created. Never fabricate evidence.

## Integration Test Evidence
PENDING — milestone implementation has not reached persistence/provider integration.

## E2E / Visual Verification
PENDING — M09.9 will cover authorized checkout/portal, forbidden roles, cross-tenant attempts, duplicate webhook/finalization, usage exhaustion and renewal behavior.

## Security Review
Activation design requires server-only Stripe secrets, raw-body webhook signature verification, organization/RBAC authorization, RLS for billing/usage data, controlled redirects, idempotency, and rejection of client-authoritative duration.

## Accessibility Review
PENDING where billing UI exists — keyboard, focus, semantics, labels, status/error states, responsive and assistive-technology paths.

## Performance Review
Plan lookup is bounded. Usage aggregation must be period-scoped/indexed. Webhook processing must remain bounded and safe under retries.

## AI / Eval Review
Model usage/cost may inform later analytics but never overrides billing authority or tenant entitlements. Billing cannot alter assessment evidence or candidate scoring.

## Code Review Findings
No Critical or Important finding known at activation.

## Fixes / Re-review
PENDING when evidence-backed findings exist.

## Fresh Verification Commands
Run repository-wide verification plus milestone-specific tests. Baseline:

```bash
pnpm lint
pnpm typecheck
pnpm test
pnpm build
pnpm e2e
python3 scripts/verify_autonomous_framework.py
python3 scripts/verify_prd_coverage.py
```

## Fresh Verification Results
Post-M08-merge baseline: `main` SHA `03be2d58…`, CI #1029 / run `35651665555` GREEN. M09 branch exact-head verification pending after first implementation unit.

## Commits / Files Changed
Activation branch `feat/billing-usage`; design/plan and durable activation docs added/updated.

## Known Limitations
No billing behavior is implemented yet. M09.1 is the first active unit.

## Documentation Updated
Design, implementation plan, `CURRENT.md`, project status and this ledger activated on 2026-09-22.

## Durable Recovery Sources
`AGENTS.md` → `docs/AUTONOMOUS-DEVELOPMENT.md` → `docs/progress/STATUS.md` → known issues → this ledger → relevant PRD → selected spec/plan → active PR/reviews/exact-head CI → source/tests.

## Completion Checklist
- [ ] Requirements and iterations accounted for.
- [ ] Acceptance criteria verified.
- [ ] Required TDD/integration/E2E evidence recorded.
- [ ] Security/accessibility/performance/AI-eval reviews complete where relevant.
- [ ] 0 Critical / 0 Important findings.
- [ ] Traceability/feature matrix reconciled.
- [ ] Exact-final-head CI green.
- [ ] Durable status/closeout state current.

## Next Milestone
M10 — AI Quality, Guardrails & Evals.