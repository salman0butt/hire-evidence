# Requirements Traceability

This matrix tracks durable framework requirements plus active product capabilities. Expand mappings incrementally from the canonical PRD; never reconstruct missing scope from chat memory.

| Requirement | Milestone | Spec / Plan | Implementation | Tests | Verification | Status |
|---|---|---|---|---|---|---|
| AUTO-001 — Git/GitHub is durable execution memory | Product Foundation | autonomy framework | recovery/control plane | framework tests | `main` CI #57 and later | VERIFIED |
| AUTO-002 — Fresh recovery before writes | Active capabilities | autonomy framework | recovery policy | framework tests | current run recovered Git/PR/review/CI/docs before writes | VERIFIED |
| AUTO-003 — Evidence precedence | Active capabilities | autonomy framework | policy/docs | framework tests | stale M02 durable state reconciled against Git/source/CI | VERIFIED |
| AUTO-004 — Highest-priority unfinished work first | Active capabilities | autonomy framework | active PR continuation | recovery evidence | existing draft PR #4 reused; no duplicate PR | VERIFIED |
| AUTO-005 — Genuine RED → GREEN / root-cause debugging | Active capabilities | active milestone plans | test-first commits + CI logs | capability tests | settings RED #217 → GREEN #218; final browser defect CI #222 → exact-locator fix → CI #224 | VERIFIED |
| AUTO-006 — Critical/Important findings block completion | Active capabilities | autonomy framework | review workflow | skeptical review | final M02 review: 0 unresolved Critical / 0 unresolved Important | VERIFIED |
| AUTO-007 — Fresh exact-SHA CI | Active capabilities | autonomy framework | GitHub Actions | full quality job | reviewed head `fd8907cf…` passed CI #224; closeout docs require one fresh exact-final-head run | ACTIVE |
| AUTO-008 — Explicit merge authorization required | Product Foundation | autonomy framework | GitHub policy | recovery | `AUTO_MERGE=false`; PR #4 remains draft/unmerged | VERIFIED |
| AUTO-009 — Durable recovery state | Active capabilities | autonomy framework | status/milestone/evidence docs | framework verifier | M02 closeout evidence/status/milestone/feature/traceability reconciled | VERIFIED |
| AUTO-010 — Avoid duplicate concurrent work | Product Foundation | autonomy framework | PR reuse/concurrency recovery | recovery | one active product PR; current head checked before continuation | VERIFIED |
| PRD-195 — Product Foundation | Product Foundation | foundation designs | foundation + requirements control plane | full suite | `main` CI #57 | VERIFIED |
| REQ-DURABILITY — Preserve owner requirements | Product Foundation | foundation closeout | source tree + manifest | source/PRD verifiers | CI #57 and later | VERIFIED |
| DEP-REPRO — Reproducible dependency graph | Product Foundation | foundation closeout | lockfile/frozen installs | CI install | CI #224 and later | VERIFIED |
| PRD-015/016/017/196 — SaaS positioning, auth/profile foundations, M01 deliverables | SaaS Shell + Auth | M01 design + plan | M01.1–M01.7 | unit/component/provider E2E | PR #3 merged; post-merge CI #157 | VERIFIED |
| SESSION-001 — Cookie-backed Supabase SSR/session boundary and safe redirects | SaaS Shell + Auth | M01 Task 2 | env/clients/proxy/safe redirect | env/redirect tests + E2E | M01 closeout/post-merge #157 | VERIFIED |
| AUTH-001 — Signup/login/logout/email verification | SaaS Shell + Auth | M01 Task 3 | auth forms/actions/confirm | auth tests + provider E2E | M01 closeout/post-merge #157 | VERIFIED |
| AUTH-002 — Password recovery and trusted confirmation redirects | SaaS Shell + Auth | M01 Task 4 | recovery forms/actions/confirm | recovery tests + provider E2E | M01 closeout/post-merge #157 | VERIFIED |
| AUTH-003 — Server-authoritative authenticated application entry | SaaS Shell + Auth | M01 Task 5 | app guard/navigation | tests + browser E2E | post-merge CI #157 | VERIFIED |
| PROFILE-001 — Own-user profile persistence with `auth.uid()` RLS | SaaS Shell + Auth | M01 Task 6 | profile migration/repository/action/UI | tests + real two-user E2E | post-merge CI #157 | VERIFIED |
| A11Y-001 — Responsive, keyboard-accessible public/auth entry | SaaS Shell + Auth | M01 Task 7 | semantic/focus/responsive UI | browser coverage | post-merge CI #157 | VERIFIED |
| ORG-001 — Organization/membership bootstrap with database-enforced membership boundary | Organizations + RBAC | M02 Task 1 | organization migration + RLS/RPC bootstrap | migration contract + local Supabase | CI #161 and retained green later | VERIFIED |
| RBAC-001 — Fixed `owner/admin/recruiter/hiring_manager/reviewer` model | Organizations + RBAC | M02 Task 2 | `rbac.ts` | `rbac.test.ts` | RED #162 → GREEN #163 | VERIFIED |
| ORG-INPUT-001 — Bounded normalized organization onboarding/settings text | Organizations + RBAC | M02 Task 2 | organization validation | validation tests | RED #162 → GREEN #163, reused by settings #218 | VERIFIED |
| ORG-ONBOARD-001 — Authenticated organization onboarding | Organizations + RBAC | M02 Task 3 | repository + create RPC action/form/page | action/component/browser tests | RED #165; build fix #167; CI #168 | VERIFIED |
| TENANT-SHELL-001 — Tenant-aware application membership boundary and navigation | Organizations + RBAC | M02 Task 4 | membership boundary + tenant layout/navigation | focused tests + build/E2E | RED #169 → GREEN #170 | VERIFIED |
| MEMBER-MGMT-001 — Owner/admin membership mutations preserve owner invariants | Organizations + RBAC | M02 Task 5 | membership RPCs/repository/actions/UI | migration/action/component tests | final `fa7a996d…`, CI #190 | VERIFIED |
| INVITE-001 — Hash-at-rest, expiring, email-bound organization invitations | Organizations + RBAC | M02 Task 6 | invitation migration/RPCs/token helper/actions/UI | token/action/provider abuse tests | final `5abee48b…`, CI #215 | VERIFIED |
| ORG-SETTINGS-001 — Role-bounded organization settings | Organizations + RBAC | M02 Task 7 | settings repository/action/page/form over owner/admin RLS | action/component/provider tests | RED `8a080819…` / #217 → GREEN `43b7c231…` / #218 | VERIFIED |
| TENANT-ISO-001 — Aggressive Org A / Org B / unauthenticated isolation | Organizations + RBAC | M02 Task 8 | authoritative RLS/RPCs + tenant flows | `e2e/organizations.spec.ts` plus invitation abuse E2E | `3e0c3555…`, CI #219 | VERIFIED |
| M02-A11Y-001 — Responsive/keyboard tenant closeout | Organizations + RBAC | M02 Task 8 | tenant/team/invitation/settings UI | desktop + 390×844 browser matrix | reviewed head `fd8907cf…`, CI #224 / `34610615757` | VERIFIED |
| M02-REVIEW-001 — Whole-milestone skeptical closeout review | Organizations + RBAC | M02 Task 8 | closeout evidence | full diff/security/accessibility/YAGNI review | `docs/superpowers/evidence/2026-09-11-m02-organizations-rbac-closeout.md`; 0 Critical / 0 Important | VERIFIED |

## Active requirement interpretation

M00 and M01 are integrated and verified. M02 implementation and engineering closeout are verified in draft PR #4: organization/membership foundation, fixed RBAC/input validation, onboarding, tenant shell, membership management, secure invitations, bounded settings, real provider-backed Org A/Org B/unauthenticated isolation, responsive/keyboard browser coverage, and final skeptical review are complete. PostgreSQL RLS/RPCs remain authoritative; AI has no authority in tenancy decisions and humans remain hiring decision makers.

The only remaining M02 gates are exact-final-head CI for the closeout-documentation head and the explicit user merge authorization required by repository policy. M03 must not start until PR #4 is merged under that authorization and post-merge `main` CI is green.

## Expansion rule

Add capability-specific atomic IDs only as needed and anchor them to canonical PRD sections. Do not introduce scope unsupported by the PRD.
