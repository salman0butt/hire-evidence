# M02 — Organizations + RBAC

Status: **IMPLEMENTING / CLOSEOUT**

## Goal
Deliver organization creation, memberships, fixed role-based access, secure invitations, bounded settings, tenant-aware navigation and database-enforced tenant isolation as a reviewable, evidence-backed capability.

## Authoritative PRD Milestone Definition

PRD milestone 197 requires organization creation, memberships, owner/admin/recruiter/reviewer roles, team invitations, organization settings, tenant-aware navigation and RLS, with two organizations tested aggressively and tenant isolation verified. The durable design also includes the explicit `hiring_manager` role.

## Dependencies
SaaS Shell + Auth — COMPLETE on `main` at `ed10e1b55bb62cf202585c8c50e6487014e83c29`, post-merge CI #157 green.

## In Scope
PRD sections 8–14, 18–19 and 197; organization bootstrap, memberships, five fixed roles, authoritative RLS/RPCs, onboarding, tenant shell, bounded membership management, hash-at-rest invitations, organization settings, and real two-organization adversarial verification.

## Out of Scope
Ownership transfer, arbitrary permission editors, service-role browser authorization, billing/branding/retention, email-provider integration solely for invitations, and later product milestones.

## Selected Design / Plan
- Design: `docs/superpowers/specs/2026-09-11-organizations-rbac-design.md`.
- Plan: `docs/superpowers/plans/2026-09-11-organizations-rbac.md`.
- PostgreSQL RLS/RPC authority is security-critical; TypeScript capabilities are UX/preflight only.
- Tenant context is URL-scoped under `/app/o/[organizationId]` and route IDs never grant authorization.

## Acceptance Criteria
- PRD deliverables and exit criteria pass.
- Org A vs Org B vs unauthenticated isolation is proven against real local Supabase.
- Fixed role restrictions and owner-preservation invariants are verified.
- Invitation abuse cases are verified and raw tokens are not persisted.
- Relevant security/accessibility/performance gates pass.
- 0 unresolved Critical or Important review findings.
- Traceability and feature state are reconciled.
- Exact-final-head CI is green before any completion claim or merge.

## Tasks / Iterations
1. **VERIFIED SLICE** — M02.1 organization schema + memberships. CI #161.
2. **VERIFIED SLICE** — M02.2 fixed RBAC + validation. RED #162 → GREEN #163.
3. **VERIFIED SLICE** — M02.3 organization onboarding. RED #165; production-build defect #167; fix #168 green.
4. **VERIFIED SLICE** — M02.4 tenant shell/navigation. RED #169 → GREEN #170.
5. **VERIFIED SLICE** — M02.5 membership management + owner invariants. Test-first work began at `80506379…` / `35b83c95…`; final implementation `fa7a996d19d790e87fb7123cb0071910424ea3a9`, CI #190 green.
6. **VERIFIED SLICE** — M02.6 secure invitations. Hash-at-rest 32-byte URL-safe tokens, owner/admin create/revoke, owner-role denial, verified-email binding, expiry/revocation/replay denial and atomic acceptance through `5abee48be6236e5616941d9ced73515628199e38`; CI #215 green.
7. **VERIFIED SLICE** — M02.7 bounded organization settings. RED `8a080819ef387fbbdcfad34cd0a9802b2d9974ea` / CI #217 failed because settings production modules/export did not exist. GREEN `43b7c23122ec775253bbca0e38b701a694545205` / CI #218 passed the complete suite. Settings accept only validated `name`, `company_size`, `hiring_use_case`; immutable/attacker-selected fields are ignored; owner/admin capability is checked before persistence and database RLS remains authoritative.
8. **CLOSEOUT ACTIVE** — provider-backed two-organization/unauthenticated isolation is verified at `3e0c35557a8cd21e9a223909753a6fdf412d2557`, CI `34608235065` / #219. Remaining: responsive/keyboard browser coverage across tenant navigation/team/invitation/settings plus final whole-milestone skeptical review and exact-final-head CI.

## TDD Evidence
- Task 1 RED `6db6188d…` → GREEN `881f786c…`, tightened `0e24fcfc…`; CI #161.
- Task 2 RED `6c2719c9…` → GREEN `ed9b3d52…`; CI #163.
- Task 3 RED `955ea259…`; production-build root-cause fix `b817f49a…`; CI #168.
- Task 4 RED `6a47c0ee…` → GREEN `709993dd…`; CI #170.
- Task 5 RED migration/action commits `80506379…` / `35b83c95…`; GREEN/fixes through `fa7a996d…`; CI #190.
- Task 6 invitation implementation culminated at `5abee48b…`; CI #215 exercised token and abuse cases against local Supabase.
- Task 7 RED `8a080819…` / CI #217 reported missing `updateOrganizationSettings`, `./actions`, and `organization-settings-form`; GREEN `43b7c231…` / CI #218 passed all gates.

## Provider-Backed Tenant Isolation Evidence
`e2e/organizations.spec.ts` runs with independently authenticated users against the CI local Supabase instance and verifies:
- Owner A can read/update Org A but cannot read/update Org B.
- Owner B can read Org B but not Org A.
- Cross-tenant membership and invitation reads return no rows.
- A forged direct PostgREST Org B update changes no row and Org B remains unchanged.
- An Org A recruiter accepted through the real invitation RPC cannot update organization settings, create invitations, or mutate member roles.
- Owner A cannot use the membership RPC against Org B.
- Unauthenticated clients receive no tenant-owned organization or membership data.
- Authorized owner settings update succeeds and remains intact after denied attempts.

Exact isolation head `3e0c35557a8cd21e9a223909753a6fdf412d2557` passed CI `34608235065` / #219, including local Supabase startup/migrations, production build, Chromium E2E, PRD coverage and teardown.

## Security Review
RLS and authenticated `SECURITY DEFINER` RPCs remain authoritative. Membership writes are narrow RPC operations; owner membership is immutable and owner cannot be assigned. Invitation raw tokens are never persisted, and acceptance is email-bound/expiring/revocable/replay-protected. Settings direct UPDATE is column-limited and owner/admin RLS protected. No service-role browser path, AI authorization, autonomous hire/reject behavior, sensitive-trait inference, or fabricated evidence is introduced.

## Accessibility / Responsive Review
Unit/component coverage verifies semantic labels, guidance, status/alert messaging and read-only settings behavior. Existing browser accessibility coverage remains green. The plan-specific final desktop + 390×844 responsive/keyboard pass for tenant navigation/team/invitation/settings is still required before M02 completion.

## Performance / YAGNI Review
Organization reads are tenant-bounded, writes are narrow, and no speculative permission engine/background worker/provider abstraction was introduced.

## Code Review Findings
Current self-review plus GitHub PR state: Critical 0 unresolved; Important 0 unresolved for implemented M02.1–M02.7 and provider-backed isolation. PR #4 has no submitted reviews and no unresolved review threads. Final whole-milestone skeptical review remains a closeout gate.

## Fresh Verification
CI #219 at `3e0c35557a8cd21e9a223909753a6fdf412d2557` passed frozen install, lint, typecheck, unit/component tests, framework/source verification, local Supabase, build, Chromium E2E, PRD coverage and teardown. This documentation reconciliation produces a newer head and must receive fresh exact-head CI before it can serve as final evidence.

## Known Limitations
Only the planned final responsive/keyboard browser matrix and whole-milestone closeout review remain. M02 is not yet complete or merge-ready.

## Completion Checklist
- [x] M02 design/spec and executable plan durable.
- [x] Organization/membership database foundation verified.
- [x] Fixed role/capability and input validation verified.
- [x] Organization onboarding and tenant-aware shell verified.
- [x] Membership management and owner invariants verified.
- [x] Secure invitation lifecycle verified.
- [x] Organization settings verified.
- [x] Real two-organization/unauthenticated isolation verified.
- [ ] Final responsive/keyboard UI evidence complete for all M02 surfaces.
- [ ] Full milestone skeptical review complete with 0 Critical / 0 Important.
- [ ] Traceability/feature matrix final closeout reconciled.
- [ ] Exact-final-head CI green.
- [ ] PR remains unmerged until explicit user authorization.

## Next Milestone
M03 — Jobs + Interviewer Builder, only after M02 completion and explicit merge authorization followed by green post-merge `main` CI.
