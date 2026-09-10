# Requirements Traceability

This matrix tracks durable framework requirements plus the active product capability. Expand product mappings incrementally from the canonical PRD; never reconstruct missing scope from chat memory.

| Requirement | Milestone | Spec / Plan | Implementation | Tests | Verification | Status |
|---|---|---|---|---|---|---|
| AUTO-001 — Git/GitHub is durable execution memory | Product Foundation | autonomy framework | recovery/control plane | framework tests | `main` CI #57 | VERIFIED |
| AUTO-002 — Fresh recovery before writes | Product Foundation | autonomy framework | recovery policy | framework tests | current run recovered PR/Git/CI before writes | VERIFIED |
| AUTO-003 — Evidence precedence | Product Foundation | autonomy framework | policy/docs | framework tests | verifier green through CI #126 | VERIFIED |
| AUTO-004 — Highest-priority unfinished work first | Product Foundation | autonomy framework | existing PR continuation | recovery evidence | PR #3 reused | VERIFIED |
| AUTO-005 — Genuine RED → GREEN | Active capabilities | M01 plan | test-first commits | capability tests | M01.5 RED `0d3aa49…`; GREEN/E2E `d5ee32a…`, CI #126 | VERIFIED |
| AUTO-006 — Critical/Important findings block completion | Product Foundation | autonomy framework | review workflow | skeptical review | 0 unresolved after M01.5 | VERIFIED |
| AUTO-007 — Fresh exact-SHA CI | Product Foundation | autonomy framework | CI | full quality job | `d5ee32a…`, CI #126 | VERIFIED |
| AUTO-008 — PRs default open/unmerged | Product Foundation | autonomy framework | GitHub policy | recovery | PR #3 remains draft/open | VERIFIED |
| AUTO-009 — Durable recovery state | Product Foundation | autonomy framework | status/milestone/evidence docs | framework tests | current reconciliation requires fresh exact-head CI | IMPLEMENTED |
| AUTO-010 — Avoid duplicate concurrent work | Product Foundation | autonomy framework | active PR reuse | recovery | no duplicate PR | VERIFIED |
| PRD-195 — Product Foundation | Product Foundation | foundation designs | foundation + requirements control plane | full suite | `main` CI #57 | VERIFIED |
| REQ-DURABILITY — Preserve owner requirements | Product Foundation | foundation closeout | source tree + manifest | source/PRD verifiers | CI #57 and later | VERIFIED |
| DEP-REPRO — Reproducible dependency graph | Product Foundation | foundation closeout | lockfile/frozen installs | CI install | green through CI #126 | VERIFIED |
| PRD-015/016/017/196 — Public SaaS positioning, auth/profile foundations, M01 deliverables | SaaS Shell + Auth | M01 design + plan | M01.1–M01.5 implemented; profile/closeout remain | marketing/auth/recovery/protection tests + smoke E2E | #64/#83/#103/#121/#126 | ACTIVE |
| SESSION-001 — Cookie-backed Supabase SSR/session boundary and safe redirects | SaaS Shell + Auth | M01 Task 2 | env/clients/proxy/safe redirect | env/redirect tests | `c1a1120…`, CI #83 | VERIFIED |
| AUTH-001 — Signup/login/logout/email verification | SaaS Shell + Auth | M01 Task 3 | auth forms/actions/confirm | auth tests | `32326d4…`, CI #103 | VERIFIED |
| AUTH-002 — Password recovery and trusted confirmation redirects | SaaS Shell + Auth | M01 Task 4 | recovery forms/actions/confirm | recovery/route tests | `b048782…`, CI #121 | VERIFIED |
| AUTH-003 — Server-authoritative authenticated application entry (PRD 16, 196) | SaaS Shell + Auth | M01 Task 5 | `require-user.ts`, app layout/navigation/page | guard/navigation tests + browser smoke | `d5ee32a4ceab57df9ea8108a0e7600a1244c070c`, CI #126 | VERIFIED |

## Active requirement interpretation

M01.1–M01.5 are verified provider-independent slices. The broader PRD group remains ACTIVE because profile/RLS, provider-backed auth/recovery/app entry, and final accessibility/security closeout remain unfinished.

## Expansion rule

Add capability-specific atomic IDs only as needed and anchor them to canonical PRD sections. Do not introduce scope unsupported by the PRD.
