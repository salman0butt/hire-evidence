# Requirements Traceability

This matrix tracks durable framework requirements plus active product capabilities. Expand mappings incrementally from the canonical PRD; never reconstruct missing scope from chat memory.

| Requirement | Milestone | Spec / Plan | Implementation | Tests | Verification | Status |
|---|---|---|---|---|---|---|
| AUTO-001 — Git/GitHub is durable execution memory | Product Foundation | autonomy framework | recovery/control plane | framework tests | `main` CI #57 and later | VERIFIED |
| AUTO-002 — Fresh recovery before writes | Active capabilities | autonomy framework | recovery policy | framework tests | current run recovered Git/PR/review/CI/docs before writes | VERIFIED |
| AUTO-003 — Evidence precedence | Active capabilities | autonomy framework | policy/docs | framework tests | stale M01/M02 durable state reconciled against Git/CI | VERIFIED |
| AUTO-004 — Highest-priority unfinished work first | Active capabilities | autonomy framework | active PR continuation | recovery evidence | existing draft PR #4 reused; no duplicate PR | VERIFIED |
| AUTO-005 — Genuine RED → GREEN / root-cause debugging | Active capabilities | active milestone plans | test-first commits + CI logs | capability tests | M02 Task 2 RED `6c2719c…` CI #162 → GREEN `ed9b3d52…` CI #163 | VERIFIED |
| AUTO-006 — Critical/Important findings block completion | Active capabilities | autonomy framework | review workflow | skeptical review | M02.1–M02.2: 0 unresolved Critical/Important | VERIFIED |
| AUTO-007 — Fresh exact-SHA CI | Active capabilities | autonomy framework | GitHub Actions | full quality job | implementation head `ed9b3d52…`, CI #163; reconciliation head requires fresh CI | ACTIVE |
| AUTO-008 — Explicit merge authorization required | Product Foundation | autonomy framework | GitHub policy | recovery | owner has standing `AUTO_MERGE=true` only after completion gates; M02 is incomplete and remains draft | VERIFIED |
| AUTO-009 — Durable recovery state | Active capabilities | autonomy framework | status/milestone/evidence docs | framework verifier | current reconciliation updates M02 execution state | ACTIVE |
| AUTO-010 — Avoid duplicate concurrent work | Product Foundation | autonomy framework | PR reuse | recovery | one active product PR, #4 | VERIFIED |
| PRD-195 — Product Foundation | Product Foundation | foundation designs | foundation + requirements control plane | full suite | `main` CI #57 | VERIFIED |
| REQ-DURABILITY — Preserve owner requirements | Product Foundation | foundation closeout | source tree + manifest | source/PRD verifiers | CI #57 and later | VERIFIED |
| DEP-REPRO — Reproducible dependency graph | Product Foundation | foundation closeout | lockfile/frozen installs | CI install | current CI #163 | VERIFIED |
| PRD-015/016/017/196 — SaaS positioning, auth/profile foundations, M01 deliverables | SaaS Shell + Auth | M01 design + plan | M01.1–M01.7 | unit/component/provider E2E | PR #3 merged; post-merge CI #157 | VERIFIED |
| SESSION-001 — Cookie-backed Supabase SSR/session boundary and safe redirects | SaaS Shell + Auth | M01 Task 2 | env/clients/proxy/safe redirect | env/redirect tests + E2E | M01 closeout/post-merge #157 | VERIFIED |
| AUTH-001 — Signup/login/logout/email verification | SaaS Shell + Auth | M01 Task 3 | auth forms/actions/confirm | auth tests + provider E2E | M01 provider closeout + post-merge #157 | VERIFIED |
| AUTH-002 — Password recovery and trusted confirmation redirects | SaaS Shell + Auth | M01 Task 4 | recovery forms/actions/confirm | recovery tests + provider E2E | M01 provider closeout + post-merge #157 | VERIFIED |
| AUTH-003 — Server-authoritative authenticated application entry | SaaS Shell + Auth | M01 Task 5 | app guard/navigation | tests + browser E2E | post-merge CI #157 | VERIFIED |
| PROFILE-001 — Own-user profile persistence with `auth.uid()` RLS | SaaS Shell + Auth | M01 Task 6 | profile migration/repository/action/UI | tests + real two-user E2E | post-merge CI #157 | VERIFIED |
| A11Y-001 — Responsive, keyboard-accessible public/auth entry | SaaS Shell + Auth | M01 Task 7 | semantic/focus/responsive UI | browser coverage | post-merge CI #157 | VERIFIED |
| ORG-001 — Organization and membership bootstrap with database-enforced membership boundary (PRD 8–14, 18–19, 197) | Organizations + RBAC | M02 design / Task 1 | `20260911_create_organizations.sql` + migration contract | `src/lib/organization/migration.test.ts` + local Supabase migration | exact head `0e24fcfc…` CI #161; retained green in #163 | VERIFIED |
| RBAC-001 — Fixed `owner/admin/recruiter/hiring_manager/reviewer` capability model (PRD 8–14, 18–19, 197) | Organizations + RBAC | M02 design / Task 2 | `src/lib/organization/rbac.ts` | `rbac.test.ts` | RED #162 → GREEN #163 at `ed9b3d52…` | VERIFIED |
| ORG-INPUT-001 — Bounded normalized organization onboarding/settings text (PRD 8–14, 18–19, 197) | Organizations + RBAC | M02 Task 2 | `src/lib/organization/validation.ts` | `validation.test.ts` | RED #162 → GREEN #163 | VERIFIED |
| ORG-ONBOARD-001 — Authenticated organization onboarding | Organizations + RBAC | M02 Task 3 | not yet implemented | planned action/component/browser tests | pending | ACTIVE |
| TENANT-ISO-001 — Aggressive Org A / Org B / unauthenticated isolation | Organizations + RBAC | M02 Task 7 | RLS/RPCs + tenant flows | real local-Supabase adversarial tests | mandatory before M02 completion | ACTIVE |

## Active requirement interpretation

M00 and M01 are integrated and verified. M02 is the sole active product milestone in draft PR #4. The organization/membership database foundation and fixed RBAC/input-validation slices are individually verified, but milestone completion is not claimed: onboarding, tenant navigation, membership management/owner invariants, invitation lifecycle, settings, and real two-organization adversarial isolation remain. AI has no authority in tenancy decisions; humans remain hiring decision makers.

## Expansion rule

Add capability-specific atomic IDs only as needed and anchor them to canonical PRD sections. Do not introduce scope unsupported by the PRD.