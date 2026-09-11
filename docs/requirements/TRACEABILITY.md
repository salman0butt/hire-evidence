# Requirements Traceability

This matrix tracks durable framework requirements plus the active product capability. Expand product mappings incrementally from the canonical PRD; never reconstruct missing scope from chat memory.

| Requirement | Milestone | Spec / Plan | Implementation | Tests | Verification | Status |
|---|---|---|---|---|---|---|
| AUTO-001 — Git/GitHub is durable execution memory | Product Foundation | autonomy framework | recovery/control plane | framework tests | `main` CI #57 | VERIFIED |
| AUTO-002 — Fresh recovery before writes | Product Foundation | autonomy framework | recovery policy | framework tests | current run recovered PR/Git/CI before closeout writes | VERIFIED |
| AUTO-003 — Evidence precedence | Product Foundation | autonomy framework | policy/docs | framework tests | stale provider blocker was corrected from actual source + CI #148 evidence | VERIFIED |
| AUTO-004 — Highest-priority unfinished work first | Active capabilities | autonomy framework | existing PR continuation | recovery evidence | PR #3 reused; M01 provider closeout completed before M02 | VERIFIED |
| AUTO-005 — Genuine RED → GREEN / root-cause debugging | Active capabilities | M01 plan | test-first/verification commits + focused debugging | capability tests/CI logs | M01 browser RED #133 → fix #134; provider CI failure semantics hardened at `a30c4f…`; reset locator fixed at `7348526…`; CI #148 green | VERIFIED |
| AUTO-006 — Critical/Important findings block completion | Product Foundation | autonomy framework | review workflow | skeptical review | complete M01 boundary + provider slice: 0 unresolved Critical/Important | VERIFIED |
| AUTO-007 — Fresh exact-SHA CI | Product Foundation | autonomy framework | CI | full quality job | provider implementation `7348526cb466a66b907e4c92148b7c6d68daf674`, CI #148; final documentation head requires fresh CI before merge | ACTIVE |
| AUTO-008 — PRs default open/unmerged until authorized | Product Foundation | autonomy framework | GitHub policy | recovery | PR #3 remains draft/open during closeout; owner has standing auto-merge authorization once all gates pass | VERIFIED |
| AUTO-009 — Durable recovery state | Product Foundation | autonomy framework | status/milestone/evidence docs | framework tests | provider closeout evidence and durable ledgers reconciled; final head awaits exact-SHA CI | ACTIVE |
| AUTO-010 — Avoid duplicate concurrent work | Product Foundation | autonomy framework | active PR reuse | recovery | no duplicate PR; branch head rechecked during closeout | VERIFIED |
| PRD-195 — Product Foundation | Product Foundation | foundation designs | foundation + requirements control plane | full suite | `main` CI #57 | VERIFIED |
| REQ-DURABILITY — Preserve owner requirements | Product Foundation | foundation closeout | source tree + manifest | source/PRD verifiers | CI #57 and later | VERIFIED |
| DEP-REPRO — Reproducible dependency graph | Product Foundation | foundation closeout | lockfile/frozen installs | CI install | provider implementation CI #148 | VERIFIED |
| PRD-015/016/017/196 — Public SaaS positioning, auth/profile foundations, M01 deliverables | SaaS Shell + Auth | M01 design + plan | M01.1–M01.7 implemented including provider-backed closeout | marketing/auth/recovery/protection/profile tests + browser/provider E2E | #64/#83/#103/#121/#127/#130/#134/#148 | VERIFIED |
| SESSION-001 — Cookie-backed Supabase SSR/session boundary and safe redirects | SaaS Shell + Auth | M01 Task 2 | env/clients/proxy/safe redirect | env/redirect tests | `c1a1120…`, CI #83; real provider lifecycle CI #148 | VERIFIED |
| AUTH-001 — Signup/login/logout/email verification | SaaS Shell + Auth | M01 Task 3 | auth forms/actions/confirm | auth tests + provider E2E | real signup/confirmation/login/logout in CI #148 | VERIFIED |
| AUTH-002 — Password recovery and trusted confirmation redirects | SaaS Shell + Auth | M01 Task 4 | recovery forms/actions/confirm | recovery/route tests + provider E2E | real recovery email/reset/login in CI #148 | VERIFIED |
| AUTH-003 — Server-authoritative authenticated application entry | SaaS Shell + Auth | M01 Task 5 | `require-user.ts`, app layout/navigation/page | guard/navigation tests + browser/provider E2E | authenticated `/app` entry in CI #148 | VERIFIED |
| PROFILE-001 — Own-user profile persistence with `auth.uid()` RLS (PRD 17, 196) | SaaS Shell + Auth | M01 Task 6 | profiles migration + validation + repository + server action + profile UI | validation/component/action/migration-policy tests + real two-user E2E | local Supabase migration, own-row persistence, mutual cross-user SELECT/UPDATE denial; `7348526…`, CI #148 | VERIFIED |
| A11Y-001 — Responsive, keyboard-accessible public/auth entry (PRD 15–17, 196) | SaaS Shell + Auth | M01 Task 7 | semantic/focus/responsive UI | public + authenticated Playwright coverage | provider-independent #134 plus authenticated narrow-mobile/keyboard evidence in CI #148 | VERIFIED |
| ENG-CONFIG-001 — Test runner config has explicit ESM semantics | SaaS Shell + Auth | provider-independent closeout | `vitest.config.mts` | full CI quality suite | `85ff107…`, CI #141; prior Vite loader warning absent | VERIFIED |
| AUTH-E2E-001 — Provider-backed M01 auth/profile end-to-end evidence | SaaS Shell + Auth | M01 Task 7 | local Supabase config/templates + production auth/profile flows | `e2e/auth.spec.ts` | Supabase Auth/PostgREST/Mailpit + production app; 8/8 Playwright, CI #148 | VERIFIED |

## Active requirement interpretation

All M01 product requirements and provider-backed evidence gates are satisfied on implementation head `7348526cb466a66b907e4c92148b7c6d68daf674`, CI #148. The local Supabase stack is real provider/database execution: the profile migration ran against PostgreSQL, auth email flows used Supabase Auth + Mailpit, and independently authenticated users proved mutual cross-profile denial through PostgREST/RLS. M01 is in integration closeout only: the reconciled documentation head must pass fresh exact-SHA CI, PR review/mergeability must be rechecked, then PR #3 may be auto-merged under the owner's standing authorization and post-merge `main` must be verified before M02 begins.

## Expansion rule

Add capability-specific atomic IDs only as needed and anchor them to canonical PRD sections. Do not introduce scope unsupported by the PRD.