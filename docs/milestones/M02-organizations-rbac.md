# M02 — Organizations + RBAC

Status: **IMPLEMENTING**

## Goal
Deliver organization creation, memberships, fixed role-based access, secure invitations, settings, tenant-aware navigation and database-enforced tenant isolation as a reviewable, evidence-backed capability.

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

The durable PRD/design also accounts for the explicit `hiring_manager` fixed role.

## Dependencies
SaaS Shell + Auth — COMPLETE on `main` at `ed10e1b55bb62cf202585c8c50e6487014e83c29`, post-merge CI #157 green.

## In Scope
PRD sections 8–14, 18–19 and milestone 197; organization bootstrap, memberships, five fixed roles, authoritative RLS/RPCs, onboarding, tenant shell, bounded membership management, hash-at-rest invitations, organization settings, and real two-organization adversarial verification.

## Out of Scope
Ownership transfer, arbitrary permission editors, service-role browser authorization, billing/branding/retention, email-provider integration solely for invitations, and later product milestones.

## Selected Design / Implementation Plan
- Design: `docs/superpowers/specs/2026-09-11-organizations-rbac-design.md`.
- Plan: `docs/superpowers/plans/2026-09-11-organizations-rbac.md`.
- URL-scoped organization context with PostgreSQL RLS/RPC authority.
- TypeScript capabilities are UX/preflight only and cannot grant database access.

## Acceptance Criteria
- PRD deliverables and exit criteria pass.
- Org A vs Org B vs unauthenticated isolation is proven against real local Supabase.
- Fixed role restrictions and owner-preservation invariants are verified.
- Invitation token abuse cases are verified and raw tokens are not persisted.
- Relevant security/accessibility/performance gates pass.
- 0 unresolved Critical or Important review findings.
- Traceability and feature state are reconciled.
- Exact-final-head CI is green before merge.

## Tasks / Iterations
1. **VERIFIED SLICE** — M02.1 — Organization schema + memberships. `organizations`, `organization_memberships`, fixed enum, private authorization helpers, RLS, and atomic authenticated `create_organization` RPC are implemented. CI #161 passed migration/full-suite verification.
2. **VERIFIED SLICE** — M02.2 — Explicit RBAC + organization input validation. Owner/admin receive all current M02 capabilities; recruiter/hiring_manager/reviewer are view-only. RED CI #162 → GREEN CI #163.
3. **ACTIVE FOUNDATION** — M02.3 — RLS policies. Read/update bootstrap policies exist; later mutation RPCs and adversarial isolation remain required.
4. **NEXT** — M02.4 — Organization onboarding and tenant-aware shell/navigation. Task 3 onboarding is next.
5. **PLANNED** — M02.5 — Team invitations and membership management with owner invariants.
6. **PLANNED** — M02.6 — Bounded organization settings.
7. **PLANNED** — M02.7 — Adversarial tenancy verification: Org A vs Org B vs unauthenticated direct API attempts.

## TDD Evidence
- Task 1 RED: `6db6188df85a0cfa1b71a5a403accc8fe8896312` introduced the migration contract before the migration existed.
- Task 1 GREEN: `881f786ccb6560bc902c1d16cac53906ba15a58a` implemented the secure organization/membership foundation; `0e24fcfc02c6df809ad1555f6fb5a7e5a5963737` tightened a test assertion. Exact-head CI #161 passed.
- Task 2 RED: `6c2719c9502a4a23c59023322eeed247e362eb21`; CI `34586195185` / #162 failed typecheck exactly because `./rbac` and `./validation` were absent.
- Task 2 GREEN: `ed9b3d52db6674fb15bb91c366f18940544e31ae`; CI `34586305688` / #163 passed the complete suite.

## Integration Test Evidence
Task 1 migration executed successfully in the CI local Supabase stack. Task 2 is pure deterministic domain behavior covered by unit tests and the complete CI suite. Full two-organization provider-backed integration remains a milestone completion gate.

## E2E / Visual Verification
Existing application E2E remained green in CI #163. M02 onboarding/tenant UI browser evidence is pending because those screens are not implemented yet.

## Security Review
Implemented foundation uses RLS, authenticated-only RPC execution, `auth.uid()` authority, private `SECURITY DEFINER` policy helpers with empty search paths, and no direct membership writes. TypeScript capability checks do not replace RLS. Current implemented slices have 0 unresolved Critical/Important findings. Full Org A/Org B write/read denial, membership mutation invariants, invite abuse tests and forged-route checks remain mandatory before milestone completion.

## Accessibility Review
Pending for M02 UI work. Task 2 has no UI surface.

## Performance Review
No material performance issue found in current bounded helpers/schema. Membership user lookup has an index; broader query behavior will be reviewed with tenant UI/data flows.

## AI / Eval Review
No AI authorization or hiring-decision behavior is introduced. Humans remain hiring decision makers; tenancy/RBAC cannot be overridden by AI or organization-authored text.

## Code Review Findings
Skeptical review of M02.1–M02.2: Critical 0 unresolved; Important 0 unresolved. PR #4 has no submitted reviews and no unresolved review threads as of this reconciliation.

## Fixes / Re-review
Task 1 test assertion was scoped in `0e24fcfc…` to avoid an overbroad grant regex; CI #161 passed. Task 2 required no post-GREEN Critical/Important fix after diff review.

## Fresh Verification Commands
Repository CI executes frozen install, lint, typecheck, tests, framework/source verifiers, local Supabase startup/migrations, build, Chromium E2E, PRD coverage and teardown.

## Fresh Verification Results
Implementation head `ed9b3d52db6674fb15bb91c366f18940544e31ae` passed GitHub Actions `34586305688` / #163 across every required step. This documentation reconciliation creates a newer head and therefore requires fresh exact-head CI before serving as final evidence.

## Commits / Files Changed
M02 currently includes design/plan/recovery docs, `src/lib/organization/migration.test.ts`, `supabase/migrations/20260911_create_organizations.sql`, `src/lib/organization/rbac.ts`, `rbac.test.ts`, `validation.ts`, and `validation.test.ts`.

## Known Limitations
Organization onboarding, tenant navigation, membership-management mutation RPCs/UI, invitations, settings, and final adversarial two-organization verification are not implemented yet. M02 is not merge-ready.

## Documentation Updated
This ledger, current/status recovery state, milestone index, feature matrix, traceability, known issues and engineering evidence are reconciled with Task 1–2 repository/CI evidence.

## Durable Recovery Sources
`AGENTS.md` → `docs/AUTONOMOUS-DEVELOPMENT.md` → actual Git/PR/exact-head CI → `docs/progress/STATUS.md` → known issues → this ledger → canonical PRD → M02 spec/plan/evidence → source/tests.

## Completion Checklist
- [x] M02 design/spec and executable plan durable.
- [x] Organization/membership database foundation implemented and verified as a slice.
- [x] Fixed M02 role/capability and input-validation slice implemented and verified.
- [ ] Organization onboarding and tenant-aware shell complete.
- [ ] Membership management and owner invariants verified.
- [ ] Secure invitation lifecycle verified.
- [ ] Organization settings verified.
- [ ] Real two-organization/unauthenticated isolation verified.
- [ ] Required UI accessibility/responsiveness evidence complete.
- [ ] Full milestone skeptical review: 0 Critical / 0 Important.
- [ ] Traceability/feature matrix final closeout reconciled.
- [ ] Exact-final-head CI green.
- [ ] PR merged and post-merge `main` CI verified.

## Next Milestone
M03 — Jobs + Interviewer Builder, only after M02 completion, authorized merge, and green post-merge `main` CI.