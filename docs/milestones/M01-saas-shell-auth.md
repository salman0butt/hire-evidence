# M01 — SaaS Shell + Auth

Status: **NOT STARTED**

## Goal
Deliver the authoritative PRD milestone below as a reviewable, evidence-backed capability.

## Authoritative PRD Milestone Definition

# 196. MILESTONE 01 — SAAS SHELL + AUTH

Deliver:

```text
premium homepage
pricing placeholder/config
signup
login
verification
forgot/reset password
authenticated shell
secure sessions
basic profile
```

Also:

```text
SEO
responsive design
accessibility
```

Exit:

authenticated user can enter SaaS app.

## Dependencies
Product Foundation.

## In Scope
The authoritative definition plus every default iteration listed below.

## Out of Scope
Later milestones, speculative abstractions, and behavior not justified by the PRD.

## Architecture Notes
Next.js App Router UI with Supabase auth/session boundaries. Server-side session authority, secure cookie handling, and protected routing precede authenticated product features.

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
1. **NOT STARTED** — M01.1 — Marketing shell: premium homepage, responsive layout, SEO baseline.
2. **NOT STARTED** — M01.2 — Supabase auth infrastructure: clients, cookies/session boundaries, env/config.
3. **NOT STARTED** — M01.3 — Core auth flows: signup, login, logout, verification.
4. **NOT STARTED** — M01.4 — Recovery flows: forgot/reset password and error states.
5. **NOT STARTED** — M01.5 — Authenticated app shell: protected routing/navigation.
6. **NOT STARTED** — M01.6 — Basic profile: minimum profile persistence/settings.
7. **NOT STARTED** — M01.7 — Accessibility + E2E: keyboard, mobile, visual/auth scenarios.

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
No assessment AI is required. Any marketing copy or helper AI must not become an authorization source.

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
M02 — Organizations + RBAC.
