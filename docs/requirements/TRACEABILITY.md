# Requirements Traceability

This matrix tracks durable framework requirements plus the currently active product capability. Expand product mappings incrementally from the canonical PRD; never reconstruct missing scope from chat memory.

| Requirement | Milestone | Spec / Plan | Implementation | Tests | Verification | Status |
|---|---|---|---|---|---|---|
| AUTO-001 — Git/GitHub is durable execution memory | Product Foundation | autonomy framework spec | `AGENTS.md`, `docs/AUTONOMOUS-DEVELOPMENT.md` | framework verifier tests | integrated `main` SHA `64ebeb4…`, CI `34486610200` | VERIFIED |
| AUTO-002 — Mandatory fresh recovery before writes | Product Foundation | autonomy framework spec | recovery/control-plane docs | framework verifier tests | post-merge `main` CI green | VERIFIED |
| AUTO-003 — Evidence-based recovery precedence | Product Foundation | autonomy framework spec | autonomy/status docs | framework verifier tests | post-merge `main` CI green | VERIFIED |
| AUTO-004 — Highest-priority unfinished work first | Product Foundation | autonomy framework spec | `AGENTS.md`, autonomy docs | framework verifier tests | applied to failed PR #3 CI in this run | VERIFIED |
| AUTO-005 — Genuine RED → GREEN for meaningful behavior | Product Foundation / active capabilities | autonomy framework + capability plan | test-first commits + implementation | capability tests | M01.1 RED `32571d4…`, GREEN `1279843…`, final CI `34492022676` | VERIFIED |
| AUTO-006 — Critical/Important review findings block completion | Product Foundation | autonomy framework | policy + review workflow | framework tests + skeptical review | M01.1 review has 0 unresolved Critical/Important | VERIFIED |
| AUTO-007 — Completion requires fresh exact-SHA CI | Product Foundation | autonomy framework | CI + recovery docs | framework tests | `main` `64ebeb4…` CI #57; M01.1 code `6107253…` CI #64 | VERIFIED |
| AUTO-008 — PRs default open/unmerged | Product Foundation | autonomy framework | GitHub workflow policy | framework tests | draft PR #3 remains open/unmerged | VERIFIED |
| AUTO-009 — Durable end-of-run recovery state | Product Foundation | autonomy framework | status/milestone/traceability docs | framework tests | reconciled for active PR #3; reconciliation-head CI pending | IMPLEMENTED |
| AUTO-010 — Avoid duplicate concurrent work | Product Foundation | autonomy framework | recovery + active PR reuse | review/manual recovery | existing PR #3 continued; no duplicate PR | VERIFIED |
| PRD-195 — Product Foundation | Product Foundation | foundation/autonomy designs | application foundation + requirements/control plane | repository full suite | merged `main` SHA `64ebeb4…`, CI `34486610200` | VERIFIED |
| REQ-DURABILITY — Preserve owner requirements source | Product Foundation | foundation closeout | durable source tree + manifest | PRD/source verifiers | post-merge CI #57 | VERIFIED |
| DEP-REPRO — Reproducible dependency graph | Product Foundation | foundation closeout | `pnpm-lock.yaml`, frozen CI | install/full quality job | post-merge CI #57 | VERIFIED |
| PRD-015/016/017/196 — Public SaaS positioning, auth/profile foundations, M01 deliverables | SaaS Shell + Auth | `docs/superpowers/specs/2026-09-10-saas-shell-auth-design.md`; `docs/superpowers/plans/2026-09-10-saas-shell-auth.md` | M01.1: `src/app/page.tsx`, `src/app/layout.tsx`, `src/app/globals.css`, `src/config/pricing.ts`; later auth/profile slices pending | `src/app/page.test.tsx`, `src/config/pricing.test.ts`, `e2e/smoke.spec.ts` | M01.1 reviewed code head `6107253…`, CI `34492022676` | ACTIVE |

## Active requirement interpretation

M01.1 verifies only the public marketing/pricing/SEO/accessibility baseline. The broader PRD-015/016/017/196 group remains ACTIVE because signup/login/verification/recovery, secure sessions, authenticated shell, profile/RLS, provider-backed E2E, and final accessibility/security closeout are not yet implemented. Do not mark the grouped requirement VERIFIED until those remaining acceptance criteria pass.

## Expansion rule

When the next M01 slice becomes active, refine this row into atomic auth/session/profile requirements as needed, each pointing back to the source PRD sections. A fresh worker must be able to navigate from every active/verified requirement to design/plan, code, tests, and verification evidence.
