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
- Evidence: `docs/superpowers/evidence/2026-09-11-m02-organization-onboarding-tenant-shell.md`.
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
1. **VERIFIED SLICE** — M02.1 — Organization schema + memberships. CI #161 passed migration/full-suite verification.
2. **VERIFIED SLICE** — M02.2 — Explicit RBAC + organization input validation. RED CI #162 → GREEN CI #163.
3. **VERIFIED SLICE** — M02.3 — Organization onboarding. RED CI #165; CI #167 exposed and localized a Next.js server-action export defect; fix `b817f49a…` passed full CI #168.
4. **VERIFIED SLICE** — M02.4 — Tenant-aware shell/navigation. RED CI #169 → GREEN CI #170. Membership context is RLS-backed; route IDs are never authorization state.
5. **NEXT** — M02.5 — Membership management with owner-preservation invariants.
6. **PLANNED** — M02.6 — Secure team invitations.
7. **PLANNED** — M02.7 — Bounded organization settings and adversarial Org A/Org B/unauthenticated verification.

## TDD Evidence
- Task 1 RED: `6db6188df85a0cfa1b71a5a403accc8fe8896312`; GREEN: `881f786ccb6560bc902c1d16cac53906ba15a58a`, assertion tightening `0e24fcfc02c6df809ad1555f6fb5a7e5a5963737`; CI #161 passed.
- Task 2 RED: `6c2719c9502a4a23c59023322eeed247e362eb21`; CI #162 failed because `./rbac` and `./validation` were absent. GREEN `ed9b3d52db6674fb15bb91c366f18940544e31ae`; CI #163 passed.
- Task 3 RED: `955ea25927e0fa5ee2195f319d3d036be956c8b0`; CI #165 failed because onboarding repository/action/form modules were absent. Implementation `753e73dcea531b420bc51d8b670f88343ae04abf`; verification `bdaef58838f0fa7c749e9d00b3f8626642c2ddf1`. CI #167 then found a real production-build boundary violation from re-exporting a non-function in a `"use server"` module. Root-cause fix `b817f49ac5beaa8a07bbbf0b32d4e798dcff8484` passed CI #168.
- Task 4 RED: `6a47c0ee42f2a95fe8bdc2a8e07024db7bf9f09f`; CI #169 failed typecheck because `require-membership` and `tenant-navigation` were absent. GREEN `709993dd37fe60cb8db7647c9c8251b6011fc977`; CI #170 passed.

## Integration Test Evidence
Task 1 migration executes successfully in the real CI local Supabase stack. Task 3's onboarding build and unauthenticated route protection are verified in CI #168. Task 4's RLS-backed membership boundary is covered by focused tests, production build and existing browser suite in CI #170. Full two-organization provider-backed read/write isolation remains a milestone completion gate and is not being claimed early.

## E2E / Visual Verification
CI #168 verifies unauthenticated `/app/organizations/new` protection plus existing auth/accessibility behavior. CI #170 verifies the tenant-shell production build and browser suite. Provider-backed signed-in forged-tenant navigation and the complete two-organization matrix remain required during M02 closeout.

## Security Review
Implemented foundation uses RLS, authenticated-only RPC execution, `auth.uid()` authority, private `SECURITY DEFINER` policy helpers with empty search paths, and no direct membership writes. Organization onboarding derives identity from the authenticated session/RPC and ignores forged creator/organization form fields. Tenant layout resolves membership under the authenticated RLS session; malformed, missing, inaccessible, errored or unexpected-role records fail through a uniform `notFound()` boundary. TypeScript capability checks only control affordances. Current implemented slices have 0 unresolved Critical/Important findings. Full membership mutation invariants, invite abuse tests and Org A/Org B read/write denial remain mandatory.

## Accessibility Review
Organization onboarding fields have associated labels, bounded help text and error alert semantics. Tenant navigation uses a semantic labeled `nav`, text role labels and capability-driven links. Existing mobile/keyboard E2E remains green. Full M02 UI accessibility verification continues as team/settings surfaces are added.

## Performance Review
Organization list ordering is deterministic and initial tenant lists are bounded by the current MVP scale. Membership lookup uses indexed keys and a single RLS-backed query. No cache/background-worker/speculative abstraction was introduced.

## AI / Eval Review
No AI authorization or hiring-decision behavior is introduced. Humans remain hiring decision makers; tenancy/RBAC cannot be overridden by AI or organization-authored text.

## Code Review Findings
Skeptical review of M02.1–M02.4: Critical 0 unresolved; Important 0 unresolved. PR #4 has no submitted reviews and no unresolved review threads as of this reconciliation.

## Fixes / Re-review
Task 1 test assertion was scoped in `0e24fcfc…`. Task 3 CI #167 production-build failure was investigated with systematic debugging and fixed at the server-module export boundary in `b817f49a…`; CI #168 passed. Task 4 required no post-GREEN Critical/Important fix after diff review.

## Fresh Verification Commands
Repository CI executes frozen install, lint, typecheck, tests, framework/source verifiers, local Supabase startup/reset/migrations, build, Chromium E2E, PRD coverage and teardown.

## Fresh Verification Results
Task 3 exact fix head `b817f49ac5beaa8a07bbbf0b32d4e798dcff8484` passed GitHub Actions `34591943413` / #168. Task 4 exact implementation head `709993dd37fe60cb8db7647c9c8251b6011fc977` passed GitHub Actions `34592533041` / #170 across every required step. This documentation reconciliation creates a newer head and therefore requires fresh exact-head CI before serving as final run evidence.

## Commits / Files Changed
M02 now includes design/plan/recovery docs, organization/membership migration foundation, RBAC/validation helpers, RLS-backed organization repository, onboarding server action/form/page, organization list, membership boundary, tenant navigation, and `/app/o/[organizationId]` layout/overview tests and implementation.

## Known Limitations
Membership-management mutation RPCs/UI, invitation lifecycle, organization settings, and final adversarial two-organization/unauthenticated verification are not implemented yet. M02 is not merge-ready.

## Documentation Updated
This ledger, current/status recovery state, milestone index, feature matrix, traceability, known issues and Task 3–4 engineering evidence are reconciled with repository/CI evidence.

## Durable Recovery Sources
`AGENTS.md` → `docs/AUTONOMOUS-DEVELOPMENT.md` → actual Git/PR/exact-head CI → `docs/progress/STATUS.md` → known issues → this ledger → canonical PRD → M02 spec/plan/evidence → source/tests.

## Completion Checklist
- [x] M02 design/spec and executable plan durable.
- [x] Organization/membership database foundation implemented and verified as a slice.
- [x] Fixed M02 role/capability and input-validation slice implemented and verified.
- [x] Organization onboarding and tenant-aware shell implemented and verified as slices.
- [ ] Membership management and owner invariants verified.
- [ ] Secure invitation lifecycle verified.
- [ ] Organization settings verified.
- [ ] Real two-organization/unauthenticated isolation verified.
- [ ] Required UI accessibility/responsiveness evidence complete for all M02 surfaces.
- [ ] Full milestone skeptical review: 0 Critical / 0 Important.
- [ ] Traceability/feature matrix final closeout reconciled.
- [ ] Exact-final-head CI green.
- [ ] PR merged and post-merge `main` CI verified.

## Next Milestone
M03 — Jobs + Interviewer Builder, only after M02 completion, authorized auto-merge gates, and green post-merge `main` CI.
