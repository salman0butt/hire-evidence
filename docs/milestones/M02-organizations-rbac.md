# M02 — Organizations + RBAC

Status: **CLOSEOUT COMPLETE / AWAITING EXPLICIT MERGE AUTHORIZATION**

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
3. **VERIFIED SLICE** — M02.3 onboarding. RED #165; build defect #167; fix #168 green.
4. **VERIFIED SLICE** — M02.4 tenant shell/navigation. RED #169 → GREEN #170.
5. **VERIFIED SLICE** — M02.5 membership management + owner invariants. Final `fa7a996d19d790e87fb7123cb0071910424ea3a9`, CI #190.
6. **VERIFIED SLICE** — M02.6 secure invitations. Final `5abee48be6236e5616941d9ced73515628199e38`, CI #215.
7. **VERIFIED SLICE** — M02.7 bounded settings. RED `8a080819ef387fbbdcfad34cd0a9802b2d9974ea` / #217 → GREEN `43b7c23122ec775253bbca0e38b701a694545205` / #218.
8. **CLOSEOUT VERIFIED** — provider-backed isolation verified at `3e0c35557a8cd21e9a223909753a6fdf412d2557`, CI #219; responsive/keyboard browser coverage fixed and fully green by exact reviewed head `fd8907cf20498466c2d62cb1b12abd29eb584686`, CI #224 / `34610615757`; whole-milestone review complete with 0 Critical and 0 Important findings.

## TDD Evidence
- Task 1 RED `6db6188d…` → GREEN `881f786c…`; CI #161.
- Task 2 RED `6c2719c9…` → GREEN `ed9b3d52…`; CI #163.
- Task 3 RED `955ea259…`; build root-cause fix `b817f49a…`; CI #168.
- Task 4 RED `6a47c0ee…` → GREEN `709993dd…`; CI #170.
- Task 5 RED `80506379…` / `35b83c95…`; final `fa7a996d…`; CI #190.
- Task 6 secure invitations culminated at `5abee48b…`; CI #215.
- Task 7 RED `8a080819…` / #217 reported missing settings production modules/export; GREEN `43b7c231…` / #218 passed all gates.
- Final browser closeout defect: CI #222 reproduced Playwright substring matching on `Team` vs `Invite teammate`; minimal exact-heading fix `62301204…` was verified green in CI #224.

## Integration Test Evidence
`e2e/organizations.spec.ts` uses independently authenticated users against the CI local Supabase instance and verifies owner A/B visibility boundaries, cross-tenant membership/invitation non-exposure, direct cross-tenant update denial, authorized owner settings update, recruiter settings/invite/role denial, cross-org membership RPC denial, and unauthenticated non-exposure. Exact isolation head `3e0c35557a8cd21e9a223909753a6fdf412d2557` passed CI `34608235065` / #219.

`e2e/organization-ui.spec.ts` provides the plan-specific desktop and 390×844 browser matrix for tenant navigation, team, invitation and settings surfaces, including no-horizontal-overflow assertions and keyboard progression. Reviewed head `fd8907cf20498466c2d62cb1b12abd29eb584686` passed CI #224 / `34610615757` including Chromium E2E.

## Security Review
Final whole-milestone review is recorded in `docs/superpowers/evidence/2026-09-11-m02-organizations-rbac-closeout.md`.

RLS and authenticated `SECURITY DEFINER` RPCs remain authoritative. Membership writes are narrow RPC operations; owner membership is immutable and owner cannot be assigned. Invitation raw tokens are never persisted and acceptance is verified-email-bound, expiring, revocable and replay-protected. Settings UPDATE is column-limited and owner/admin RLS protected. Local service-role credentials are used only by provider-backed E2E setup/inspection, never as browser authorization. No AI authorization, autonomous hire/reject behavior, sensitive-trait inference or fabricated evidence is introduced.

Review result: Critical 0 unresolved; Important 0 unresolved.

## Accessibility / Responsive Review
Unit/component coverage verifies semantic labels, guidance, status/alert messaging and read-only settings behavior. Dedicated desktop and 390×844 Playwright coverage verifies keyboard traversal and horizontal-overflow behavior for tenant navigation, team/invitation and settings surfaces. CI #224 passed.

## Performance / YAGNI Review
Organization reads are tenant-bounded, writes are narrow, and no speculative permission engine, ownership-transfer workflow, background worker, provider abstraction, email integration or service decomposition was introduced.

## Code Review Findings
Current skeptical self-review plus GitHub PR inspection: Critical 0 unresolved; Important 0 unresolved. PR #4 has no submitted reviews and no unresolved review threads at the closeout review.

## Fresh Verification Results
- Settings implementation `43b7c23122ec775253bbca0e38b701a694545205`: CI #218 PASS.
- Tenant isolation `3e0c35557a8cd21e9a223909753a6fdf412d2557`: CI #219 PASS.
- Responsive/keyboard reviewed head `fd8907cf20498466c2d62cb1b12abd29eb584686`: CI #224 / `34610615757` PASS across frozen install, lint, typecheck, unit/component tests, framework/source checks, local Supabase, production build, Chromium E2E, PRD coverage and teardown.
- Closeout documentation commits after `fd8907cf…` require a fresh exact-final-head CI before the PR is declared merge-ready.

## Durable Recovery Sources
Recover actual GitHub state first, then read `AGENTS.md`, `CODEX-START-HERE.md`, `docs/AUTONOMOUS-DEVELOPMENT.md`, `docs/progress/STATUS.md`, `docs/progress/KNOWN-ISSUES.md`, `docs/milestones/CURRENT.md`, this ledger, `docs/requirements/TRACEABILITY.md`, the M02 design/plan/closeout evidence, PR #4, exact-head CI, current source and tests. Actual Git graph/source/tests/exact-SHA CI outrank prose.

## Known Limitations
No known Critical/Important implementation issue remains. The milestone is intentionally not merged because repository policy requires explicit user authorization. M03 must not begin before that merge and green post-merge `main` CI.

## Completion Checklist
- [x] Design/spec and plan durable.
- [x] Organization/membership foundation verified.
- [x] Fixed RBAC and validation verified.
- [x] Onboarding and tenant shell verified.
- [x] Membership management and owner invariants verified.
- [x] Secure invitations verified.
- [x] Bounded organization settings verified.
- [x] Real Org A/Org B/unauthenticated isolation verified.
- [x] Dedicated responsive/keyboard browser matrix green on reviewed exact head.
- [x] Final whole-milestone skeptical review complete with 0 Critical / 0 Important.
- [x] Final traceability/feature closeout reconciled in this closeout series.
- [ ] Exact-final-head CI green after the documentation closeout series.
- [x] PR remains unmerged until explicit user authorization.

## Next Milestone
M03 — Jobs + Interviewer Builder, only after explicit merge authorization, PR #4 merge, and green post-merge `main` CI.