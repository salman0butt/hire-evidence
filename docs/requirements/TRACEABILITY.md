# Requirements Traceability

This matrix tracks durable framework requirements plus the active product capability. Expand product mappings incrementally from the canonical PRD; never reconstruct missing scope from chat memory.

| Requirement | Milestone | Spec / Plan | Implementation | Tests | Verification | Status |
|---|---|---|---|---|---|---|
| AUTO-001 — Git/GitHub is durable execution memory | Product Foundation | autonomy framework | recovery/control plane | framework tests | `main` CI #57 | VERIFIED |
| AUTO-002 — Fresh recovery before writes | Product Foundation | autonomy framework | recovery policy | framework tests | current run recovered PR/Git/CI before writes | VERIFIED |
| AUTO-003 — Evidence precedence | Product Foundation | autonomy framework | policy/docs | framework tests | verifier green through config head `85ff107…`, CI #141 | VERIFIED |
| AUTO-004 — Highest-priority unfinished work first | Active capabilities | autonomy framework | existing PR continuation | recovery evidence | PR #3 reused; provider blocker respected; M02 not started | VERIFIED |
| AUTO-005 — Genuine RED → GREEN / root-cause debugging | Active capabilities | M01 plan | test-first/verification commits + focused config debugging | capability tests/CI logs | M01.7 RED `caa82b59…` → fix `061762ec…`; config warning root cause resolved at `85ff107…`, CI #141 | VERIFIED |
| AUTO-006 — Critical/Important findings block completion | Product Foundation | autonomy framework | review workflow | skeptical review | current focused change and complete active boundary: 0 unresolved Critical/Important | VERIFIED |
| AUTO-007 — Fresh exact-SHA CI | Product Foundation | autonomy framework | CI | full quality job | `85ff10741875892e2787631b106cfc48bfad0d5c`, CI `34528888577` / #141 | VERIFIED |
| AUTO-008 — PRs default open/unmerged | Product Foundation | autonomy framework | GitHub policy | recovery | PR #3 remains draft/open/unmerged | VERIFIED |
| AUTO-009 — Durable recovery state | Product Foundation | autonomy framework | status/milestone/evidence docs | framework tests | config-maintenance/recovery evidence reconciled; this docs commit requires fresh exact-head CI | IMPLEMENTED |
| AUTO-010 — Avoid duplicate concurrent work | Product Foundation | autonomy framework | active PR reuse | recovery | no duplicate PR; branch head rechecked immediately before write | VERIFIED |
| PRD-195 — Product Foundation | Product Foundation | foundation designs | foundation + requirements control plane | full suite | `main` CI #57 | VERIFIED |
| REQ-DURABILITY — Preserve owner requirements | Product Foundation | foundation closeout | source tree + manifest | source/PRD verifiers | CI #57 and later | VERIFIED |
| DEP-REPRO — Reproducible dependency graph | Product Foundation | foundation closeout | lockfile/frozen installs | CI install | `85ff107…`, CI #141 | VERIFIED |
| PRD-015/016/017/196 — Public SaaS positioning, auth/profile foundations, M01 deliverables | SaaS Shell + Auth | M01 design + plan | M01.1–M01.6 implemented; M01.7 provider-independent accessibility verified; provider closeout remains | marketing/auth/recovery/protection/profile tests + browser E2E | #64/#83/#103/#121/#127/#130/#134; full config head #141 | ACTIVE |
| SESSION-001 — Cookie-backed Supabase SSR/session boundary and safe redirects | SaaS Shell + Auth | M01 Task 2 | env/clients/proxy/safe redirect | env/redirect tests | `c1a1120…`, CI #83 | VERIFIED |
| AUTH-001 — Signup/login/logout/email verification | SaaS Shell + Auth | M01 Task 3 | auth forms/actions/confirm | auth tests | `32326d4…`, CI #103 | VERIFIED |
| AUTH-002 — Password recovery and trusted confirmation redirects | SaaS Shell + Auth | M01 Task 4 | recovery forms/actions/confirm | recovery/route tests | `b048782…`, CI #121 | VERIFIED |
| AUTH-003 — Server-authoritative authenticated application entry | SaaS Shell + Auth | M01 Task 5 | `require-user.ts`, app layout/navigation/page | guard/navigation tests + browser smoke | `f912da9…`, CI #127 | VERIFIED |
| PROFILE-001 — Own-user profile persistence with `auth.uid()` RLS (PRD 17, 196) | SaaS Shell + Auth | M01 Task 6 | profiles migration + validation + repository + server action + profile UI | validation/component/action/migration-policy tests | `e9c2ad64…`, CI #130; real cross-user Supabase execution pending | IMPLEMENTED |
| A11Y-001 — Responsive, keyboard-accessible public/auth entry (PRD 15–17, 196) | SaaS Shell + Auth | M01 Task 7 | existing semantic/focus/responsive UI | `e2e/accessibility.spec.ts` | `061762ec…`, CI #134 | VERIFIED |
| ENG-CONFIG-001 — Test runner config has explicit ESM semantics | SaaS Shell + Auth | provider-independent closeout | `vitest.config.mts` | full CI quality suite | `85ff107…`, CI #141; prior Vite loader warning absent | VERIFIED |
| AUTH-E2E-001 — Provider-backed M01 auth/profile end-to-end evidence | SaaS Shell + Auth | M01 Task 7 | provider flows already implemented | real Supabase browser/RLS scenarios required | 2026-09-11 discovery found only unrelated existing projects; blocked pending safe configured environment | BLOCKED |

## Active requirement interpretation

M01.1–M01.5 are verified provider-independent slices. M01.6 is implemented and code-reviewed with full CI, but not VERIFIED because a configured Supabase project has not yet provided real User A/User B RLS-denial evidence. The M01.7 provider-independent accessibility/browser slice is VERIFIED. Focused test-runner configuration maintenance is also VERIFIED at CI #141. The broader M01 group remains ACTIVE pending real provider-backed auth/profile E2E, RLS isolation, and final closeout. Connected-account access does not authorize reusing unrelated projects as test infrastructure.

## Expansion rule

Add capability-specific atomic IDs only as needed and anchor them to canonical PRD sections. Do not introduce scope unsupported by the PRD.
