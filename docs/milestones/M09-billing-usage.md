# M09 — Billing + Usage

Status: **NOT STARTED**

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
Organizations; stable interview lifecycle and usage events.

## In Scope
The authoritative definition plus every default iteration listed below.

## Out of Scope
Later milestones, speculative abstractions, and behavior not justified by the PRD.

## Architecture Notes
Stripe billing state is synchronized by verified idempotent webhooks. Server-authoritative interview seconds feed metering and entitlement checks; client-reported duration cannot grant capacity.

## Selected Design / Implementation Plan
- Not created yet. On activation, recover requirements, use Superpowers brainstorming/design, write an executable plan, and record the selected paths here.

## Acceptance Criteria
- PRD deliverables and exit criteria pass.
- All required iterations are complete or explicitly resolved.
- Relevant security/privacy/tenancy/accessibility/performance/AI-safety gates pass.
- 0 unresolved Critical or Important review findings.
- Traceability and feature state are reconciled.
- Exact-final-head CI is green.

## Tasks / Iterations
1. **NOT STARTED** — M09.1 — Plan configuration: simple organization plans/limits.
2. **NOT STARTED** — M09.2 — Subscription persistence: organization billing state.
3. **NOT STARTED** — M09.3 — Stripe customer + checkout: authorized organization roles only.
4. **NOT STARTED** — M09.4 — Webhook synchronization: signature validation and idempotent state updates.
5. **NOT STARTED** — M09.5 — Billing portal + cancellation/plan changes.
6. **NOT STARTED** — M09.6 — Server-authoritative usage: interview seconds as source unit.
7. **NOT STARTED** — M09.7 — Usage periods/meter: current allowance, remaining and renewal.
8. **NOT STARTED** — M09.8 — Server-side enforcement: limits/entitlements cannot be bypassed by client.
9. **NOT STARTED** — M09.9 — Billing security/idempotency E2E: duplicate finalization/webhooks and authorization.

## TDD Evidence
PENDING — milestone has not started. Never fabricate evidence.

## Integration Test Evidence
PENDING — milestone has not started. Never fabricate evidence.

## E2E / Visual Verification
PENDING — define milestone-specific browser/realtime/visual scenarios before closeout where applicable.

## Security Review
PENDING — cover auth/authz, tenant isolation, untrusted input, secrets, data exposure, injection and milestone-specific threats.

## Accessibility Review
PENDING where UI exists — keyboard, focus, semantics, labels, status/error states, responsive and assistive-technology paths.

## Performance Review
PENDING where relevant — bounded work, pagination, resource limits, retries and hot-path cost.

## AI / Eval Review
Model usage/cost may inform metering but never overrides billing authority or tenant entitlements.

## Code Review Findings
None yet; milestone has not started.

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
PENDING — milestone has not started.

## Commits / Files Changed
None yet.

## Known Limitations
Milestone is NOT STARTED; implementation-specific limitations are not yet known.

## Documentation Updated
This living ledger must be reconciled whenever milestone state/evidence changes.

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
