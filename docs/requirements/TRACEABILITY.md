# Requirements Traceability

This matrix tracks durable framework requirements plus the active product capability. Expand product mappings incrementally from the canonical PRD; never reconstruct missing scope from chat memory.

| Requirement | Milestone | Spec / Plan | Implementation | Tests | Verification | Status |
|---|---|---|---|---|---|---|
| AUTO-001 — Git/GitHub is durable execution memory | Product Foundation | autonomy framework spec | `AGENTS.md`, `docs/AUTONOMOUS-DEVELOPMENT.md` | framework verifier tests | integrated `main` SHA `64ebeb4…`, CI #57 | VERIFIED |
| AUTO-002 — Mandatory fresh recovery before writes | Product Foundation | autonomy framework spec | recovery/control-plane docs | framework verifier tests | post-merge `main` CI green | VERIFIED |
| AUTO-003 — Evidence-based recovery precedence | Product Foundation | autonomy framework spec | autonomy/status docs | framework verifier tests | post-merge `main` CI green | VERIFIED |
| AUTO-004 — Highest-priority unfinished work first | Product Foundation | autonomy framework spec | policy + recovery loop | framework verifier tests | draft PR #3 continued; no duplicate PR | VERIFIED |
| AUTO-005 — Genuine RED → GREEN for meaningful behavior | Product Foundation / active capabilities | autonomy framework + M01 plan | test-first commits + implementations | capability tests | M01.4 security RED `ee8fd9b…`; GREEN `b048782…`, CI #121 | VERIFIED |
| AUTO-006 — Critical/Important review findings block completion | Product Foundation | autonomy framework | policy + review workflow | framework tests + skeptical review | M01.4 has 0 unresolved Critical/Important | VERIFIED |
| AUTO-007 — Completion requires fresh exact-SHA CI | Product Foundation | autonomy framework | CI + recovery docs | framework tests | M01.4 reviewed head `b048782…`, CI #121 | VERIFIED |
| AUTO-008 — PRs default open/unmerged | Product Foundation | autonomy framework | GitHub workflow policy | framework tests | draft PR #3 remains open/unmerged | VERIFIED |
| AUTO-009 — Durable end-of-run recovery state | Product Foundation | autonomy framework | status/milestone/traceability/evidence docs | framework tests | reconciled after M01.4 verification | IMPLEMENTED |
| AUTO-010 — Avoid duplicate concurrent work | Product Foundation | autonomy framework | recovery + active PR reuse | review/manual recovery | existing PR #3 continued | VERIFIED |
| PRD-195 — Product Foundation | Product Foundation | foundation/autonomy designs | application foundation + requirements/control plane | repository full suite | merged `main` SHA `64ebeb4…`, CI #57 | VERIFIED |
| REQ-DURABILITY — Preserve owner requirements source | Product Foundation | foundation closeout | durable source tree + manifest | PRD/source verifiers | post-merge CI #57 | VERIFIED |
| DEP-REPRO — Reproducible dependency graph | Product Foundation | foundation closeout | `pnpm-lock.yaml`, frozen CI | install/full quality job | post-merge CI #57; frozen installs continue through CI #121 | VERIFIED |
| PRD-015/016/017/196 — Public SaaS positioning, auth/profile foundations, M01 deliverables | SaaS Shell + Auth | M01 design + implementation plan | M01.1 marketing; M01.2 session; M01.3 core auth; M01.4 recovery; shell/profile remain | marketing/config/env/redirect/auth/recovery tests + smoke E2E | M01.1 #64; M01.2 #83; M01.3 #103; M01.4 #121 | ACTIVE |
| SESSION-001 — Cookie-backed Supabase SSR/session boundary and internal redirect safety (PRD 16, 196) | SaaS Shell + Auth | M01 design; Task 2 plan | env, Supabase clients/proxy, safe redirect helper | env + safe-redirect tests | `c1a1120…`, CI #83 | VERIFIED |
| AUTH-001 — Email/password signup, login, logout, bounded errors and email verification route (PRD 16, 196) | SaaS Shell + Auth | M01 design; Task 3 plan | validation/state/forms/actions/pages/confirm route | validation/form/action tests | `32326d4…`, CI #103 | VERIFIED |
| AUTH-002 — Forgot/reset password with account-enumeration-safe request state, trusted recovery session and configured-origin confirmation redirects (PRD 16, 196) | SaaS Shell + Auth | M01 design; Task 4 plan | recovery forms/pages/actions + `/auth/confirm` recovery branch | recovery form/action/confirmation-route tests | `b048782e0644213727f16fdf376d87f6bebb1d1e`, CI #121 | VERIFIED |

## Active requirement interpretation

M01.1–M01.4 are verified provider-independent slices. The broader PRD-015/016/017/196 group remains ACTIVE because authenticated shell, profile/RLS, provider-backed auth/recovery E2E, and final accessibility/security closeout remain unfinished.

`SESSION-001`, `AUTH-001`, and `AUTH-002` are capability-specific execution identifiers derived from PRD sections 16 and 196; they do not introduce product scope beyond the canonical PRD.

## Expansion rule

As each next M01 slice becomes active, add/refine only the atomic auth/session/profile requirements needed for implementation and verification, each anchored back to source PRD sections.
