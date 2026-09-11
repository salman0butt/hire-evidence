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
3. **VERIFIED SLICE** — M02.3 onboarding. RED #165; build defect #167; fix #168 green.
4. **VERIFIED SLICE** — M02.4 tenant shell/navigation. RED #169 → GREEN #170.
5. **VERIFIED SLICE** — M02.5 membership management + owner invariants. Final `fa7a996d19d790e87fb7123cb0071910424ea3a9`, CI #190.
6. **VERIFIED SLICE** — M02.6 secure invitations. Final `5abee48be6236e5616941d9ced73515628199e38`, CI #215.
7. **VERIFIED SLICE** — M02.7 bounded settings. RED `8a080819ef387fbbdcfad34cd0a9802b2d9974ea` / #217 → GREEN `43b7c23122ec775253bbca0e38b701a694545205` / #218.
8. **CLOSEOUT ACTIVE** — provider-backed isolation verified at `3e0c35557a8cd21e9a223909753a6fdf412d2557`, CI #219. Responsive/keyboard E2E is now present at `e2e/organization-ui.spec.ts` and awaits full CI after framework-ledger repair.

## TDD Evidence
- Task 1 RED `6db6188d…` → GREEN `881f786c…`; CI #161.
- Task 2 RED `6c2719c9…` → GREEN `ed9b3d52…`; CI #163.
- Task 3 RED `955ea259…`; build root-cause fix `b817f49a…`; CI #168.
- Task 4 RED `6a47c0ee…` → GREEN `709993dd…`; CI #170.
- Task 5 RED `80506379…` / `35b83c95…`; final `fa7a996d…`; CI #190.
- Task 6 secure invitations culminated at `5abee48b…`; CI #215.
- Task 7 RED `8a080819…` / #217 reported missing settings production modules/export; GREEN `43b7c231…` / #218 passed all gates.

## Integration Test Evidence
`e2e/organizations.spec.ts` uses independently authenticated users against the CI local Supabase instance and verifies owner A/B visibility boundaries, cross-tenant membership/invitation non-exposure, direct cross-tenant update denial, authorized owner settings update, recruiter settings/invite/role denial, cross-org membership RPC denial, and unauthenticated non-exposure. Exact isolation head `3e0c35557a8cd21e9a223909753a6fdf412d2557` passed CI `34608235065` / #219.

`e2e/organization-ui.spec.ts` adds the plan-specific desktop and 390×844 browser matrix for tenant navigation, team, invitation and settings surfaces. It verifies no horizontal overflow plus keyboard progression through tenant links, invitation controls and settings controls. CI #221 did not reach browser execution because the autonomous-framework verifier correctly rejected missing required ledger headings introduced by the prior documentation rewrite; this document restores those framework contracts without weakening verification.

## Security Review
RLS and authenticated `SECURITY DEFINER` RPCs remain authoritative. Membership writes are narrow RPC operations; owner membership is immutable and owner cannot be assigned. Invitation raw tokens are never persisted and acceptance is email-bound/expiring/revocable/replay-protected. Settings UPDATE is column-limited and owner/admin RLS protected. No service-role browser path, AI authorization, autonomous hire/reject behavior, sensitive-trait inference, or fabricated evidence is introduced.

## Accessibility / Responsive Review
Unit/component coverage verifies semantic labels, guidance, status/alert messaging and read-only settings behavior. The dedicated browser matrix in `e2e/organization-ui.spec.ts` is awaiting a full exact-head run after the framework-ledger heading repair.

## Performance / YAGNI Review
Organization reads are tenant-bounded, writes are narrow, and no speculative permission engine/background worker/provider abstraction was introduced.

## Code Review Findings
Current self-review plus GitHub PR state: Critical 0 unresolved; Important 0 unresolved for implemented M02.1–M02.7 and provider-backed isolation. PR #4 has no submitted reviews and no unresolved review threads. Final whole-milestone skeptical review remains a closeout gate until the browser matrix is green.

## Fresh Verification Results
- Settings implementation `43b7c23122ec775253bbca0e38b701a694545205`: CI #218 PASS.
- Tenant isolation `3e0c35557a8cd21e9a223909753a6fdf412d2557`: CI `34608235065` / #219 PASS across frozen install, lint, typecheck, unit/component tests, framework/source verification, local Supabase, build, Chromium E2E, PRD coverage and teardown.
- UI-browser head `04ea40eab7ea0fa141149d22f32aeaf04ccc1d8d`: CI #221 stopped at the autonomous-framework verifier because the preceding documentation reconciliation omitted three mandatory ledger headings; lint/typecheck/unit tests and verifier unit tests had already passed. This is a documentation-contract failure, not browser evidence.
- The heading repair creates a newer head and requires fresh exact-head CI.

## Durable Recovery Sources
Recover actual GitHub state first, then read `AGENTS.md`, `CODEX-START-HERE.md`, `docs/AUTONOMOUS-DEVELOPMENT.md`, `docs/progress/STATUS.md`, `docs/progress/KNOWN-ISSUES.md`, `docs/milestones/CURRENT.md`, this ledger, `docs/requirements/TRACEABILITY.md`, the M02 design/plan, PR #4, exact-head CI, current source and tests. Actual Git graph/source/tests/exact-SHA CI outrank prose.

## Known Limitations
The dedicated responsive/keyboard browser matrix must pass a complete exact-head run, followed by final whole-milestone review, final durable reconciliation and exact-final-head CI. M02 is not yet complete or merge-ready.

## Completion Checklist
- [x] Design/spec and plan durable.
- [x] Organization/membership foundation verified.
- [x] Fixed RBAC and validation verified.
- [x] Onboarding and tenant shell verified.
- [x] Membership management and owner invariants verified.
- [x] Secure invitations verified.
- [x] Bounded organization settings verified.
- [x] Real Org A/Org B/unauthenticated isolation verified.
- [ ] Dedicated responsive/keyboard browser matrix green on exact head.
- [ ] Final whole-milestone skeptical review complete with 0 Critical / 0 Important.
- [ ] Final traceability/feature closeout reconciled.
- [ ] Exact-final-head CI green.
- [ ] PR remains unmerged until explicit user authorization.

## Next Milestone
M03 — Jobs + Interviewer Builder, only after M02 completion and explicit merge authorization followed by green post-merge `main` CI.
