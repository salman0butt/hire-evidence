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
- Evidence: `docs/superpowers/evidence/2026-09-11-m02-organization-onboarding-tenant-shell.md` and `docs/superpowers/evidence/2026-09-11-m02-membership-management.md`.
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
5. **VERIFIED SLICE** — M02.5 — Membership management with owner-preservation invariants. Test-first work began at `80506379…` / `35b83c95…`; secure RPCs, team list/actions/UI and regression fixes culminated at `fa7a996d…`, CI #190 green.
6. **NEXT** — M02.6 — Secure team invitations.
7. **PLANNED** — M02.7 — Bounded organization settings and adversarial Org A/Org B/unauthenticated verification.

## TDD Evidence
- Task 1 RED: `6db6188df85a0cfa1b71a5a403accc8fe8896312`; GREEN: `881f786ccb6560bc902c1d16cac53906ba15a58a`, assertion tightening `0e24fcfc02c6df809ad1555f6fb5a7e5a5963737`; CI #161 passed.
- Task 2 RED: `6c2719c9502a4a23c59023322eeed247e362eb21`; CI #162 failed because `./rbac` and `./validation` were absent. GREEN `ed9b3d52db6674fb15bb91c366f18940544e31ae`; CI #163 passed.
- Task 3 RED: `955ea25927e0fa5ee2195f319d3d036be956c8b0`; CI #165 failed because onboarding production modules were absent. CI #167 then found a real production-build boundary violation; root-cause fix `b817f49ac5beaa8a07bbbf0b32d4e798dcff8484` passed CI #168.
- Task 4 RED: `6a47c0ee42f2a95fe8bdc2a8e07024db7bf9f09f`; CI #169 failed typecheck because membership/navigation production modules were absent. GREEN `709993dd37fe60cb8db7647c9c8251b6011fc977`; CI #170 passed.
- Task 5 RED: migration contract `80506379e3a98c91086fa3031b1ceb0496b779e2` and action boundary `35b83c953e860ec26dfc5fe6631ff30723dccd0d`. Subsequent implementation/regression cycle addressed unique Supabase migration ordering, client/server module boundaries, pure role validation, and post-mutation team revalidation. Final Task 5 implementation head `fa7a996d19d790e87fb7123cb0071910424ea3a9` passed CI #190.

## Integration Test Evidence
M02 migrations execute successfully in the real CI local Supabase stack. Task 5's migration verifies authenticated security-definer membership management RPCs, no broad direct membership writes, owner/admin authorization, rejection of owner assignment, and immutable owner membership. Full two-organization provider-backed read/write isolation remains a milestone completion gate and is not being claimed early.

## E2E / Visual Verification
Existing authenticated/unauthenticated browser and accessibility coverage remains green through CI #190. Team actions revalidate the route-bound team page after successful role/removal mutation. Complete invitation and two-organization abuse matrices remain required during M02 closeout.

## Security Review
Implemented foundation uses RLS, authenticated-only RPC execution, `auth.uid()` authority, private `SECURITY DEFINER` policy helpers with empty search paths, and no broad direct membership writes. Membership mutations execute only through `public.update_organization_member_role` and `public.remove_organization_member`; both require owner/admin authorization, bind target membership to the requested organization, prohibit assigning `owner`, and prohibit changing/removing an existing owner. Route-bound server actions ignore attacker-selected organization fields and return bounded errors. Current implemented M02.1–M02.5 slices have 0 unresolved Critical/Important findings. Invite abuse tests and final Org A/Org B read/write denial remain mandatory.

## Accessibility Review
Organization onboarding and tenant navigation remain covered. Team-management UI exposes owner membership as immutable and only renders management controls for callers with `team:manage_roles`. Full M02 UI accessibility verification continues as invitation/settings surfaces are added.

## Performance Review
Organization/membership reads are bounded to a tenant and deterministically ordered. Membership mutations are narrow single-row RPCs. No cache/background-worker/speculative abstraction was introduced.

## AI / Eval Review
No AI authorization or hiring-decision behavior is introduced. Humans remain hiring decision makers; tenancy/RBAC cannot be overridden by AI or organization-authored text.

## Code Review Findings
Skeptical review of M02.1–M02.5: Critical 0 unresolved; Important 0 unresolved. PR #4 has no submitted reviews and no unresolved review threads as of this reconciliation.

## Fixes / Re-review
Task 5 review/debugging fixes included unique migration versioning, preserving client-safe role metadata, isolating Supabase persistence from client imports, pure RBAC validation, scoped component assertions, and route revalidation after successful team mutations. Exact implementation head `fa7a996d…` passed the complete suite in CI #190.

## Fresh Verification Commands
Repository CI executes frozen install, lint, typecheck, tests, framework/source verifiers, local Supabase startup/reset/migrations, build, Chromium E2E, PRD coverage and teardown.

## Fresh Verification Results
Task 5 exact implementation head `fa7a996d19d790e87fb7123cb0071910424ea3a9` passed GitHub Actions `34594961808` / #190 across every required step. This documentation reconciliation creates a newer head and therefore requires fresh exact-head CI before serving as final run evidence.

## Commits / Files Changed
M02 now includes organization/membership schema and policies, fixed RBAC/input validation, onboarding, RLS-backed tenant shell/navigation, authenticated membership mutation RPCs, member repository, route-bound team server actions, team page/component tests, and route revalidation after mutations.

## Known Limitations
Invitation lifecycle, organization settings, and final adversarial two-organization/unauthenticated verification are not implemented yet. M02 is not merge-ready.

## Documentation Updated
This ledger, current/status recovery state, feature matrix, traceability, known issues and Task 5 engineering evidence are reconciled with repository/CI evidence.

## Durable Recovery Sources
`AGENTS.md` → `docs/AUTONOMOUS-DEVELOPMENT.md` → actual Git/PR/exact-head CI → `docs/progress/STATUS.md` → known issues → this ledger → canonical PRD → M02 spec/plan/evidence → source/tests.

## Completion Checklist
- [x] M02 design/spec and executable plan durable.
- [x] Organization/membership database foundation implemented and verified as a slice.
- [x] Fixed M02 role/capability and input-validation slice implemented and verified.
- [x] Organization onboarding and tenant-aware shell implemented and verified as slices.
- [x] Membership management and owner invariants verified as a slice.
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
