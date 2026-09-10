# M02 — Organizations + RBAC

Status: **NOT STARTED**

## Goal
Deliver the authoritative PRD milestone below as a reviewable, evidence-backed capability.

## Authoritative PRD Milestone Definition

# 197. MILESTONE 02 — ORGANIZATIONS + RBAC

Deliver:

```text
organization creation
memberships
owner/admin/recruiter/reviewer roles
team invitations
organization settings
tenant-aware navigation
RLS
```

Test two organizations aggressively.

Exit:

tenant isolation verified.

## Dependencies
SaaS Shell + Auth.

## In Scope
The authoritative definition plus every default iteration listed below.

## Out of Scope
Later milestones, speculative abstractions, and behavior not justified by the PRD.

## Architecture Notes
Tenant-owned data is organization-scoped. Authorization combines explicit role/capability checks with database RLS; tests must prove Org A cannot read or mutate Org B.

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
1. **NOT STARTED** — M02.1 — Organization schema: organizations + memberships.
2. **NOT STARTED** — M02.2 — Explicit RBAC: owner/admin/recruiter/hiring-manager/reviewer capabilities.
3. **NOT STARTED** — M02.3 — RLS policies: tenant-owned read/write isolation.
4. **NOT STARTED** — M02.4 — Organization UI/navigation: onboarding and tenant-aware shell.
5. **NOT STARTED** — M02.5 — Team invitations: secure invitation lifecycle/roles/expiry.
6. **NOT STARTED** — M02.6 — Organization settings: bounded MVP settings.
7. **NOT STARTED** — M02.7 — Adversarial tenancy verification: Org A vs Org B vs unauthenticated direct API attempts.

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
AI has no authority to bypass tenancy or role policies.

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
M03 — Jobs + Interviewer Builder.
