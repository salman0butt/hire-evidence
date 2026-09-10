# Requirements Traceability

This matrix begins with the autonomous-development framework requirements introduced by the owner and the current foundation state. Product requirement mappings expand incrementally as the complete PRD corpus is persisted and each capability becomes active.

| Requirement | Milestone | Spec | Implementation | Tests | Verification | Status |
|---|---|---|---|---|---|---|
| AUTO-001 — Git/GitHub is durable execution memory; do not rely on chat | Product Foundation | `docs/superpowers/specs/2026-09-10-autonomous-long-project-framework-design.md` | `AGENTS.md`, `docs/AUTONOMOUS-DEVELOPMENT.md` | framework verifier tests | exact-head CI pending | ACTIVE |
| AUTO-002 — Every fresh run performs mandatory recovery before writes | Product Foundation | same framework spec | `AGENTS.md`, `docs/AUTONOMOUS-DEVELOPMENT.md`, `CODEX-START-HERE.md` | framework verifier tests | exact-head CI pending | ACTIVE |
| AUTO-003 — Use evidence-based recovery precedence | Product Foundation | same framework spec | `docs/AUTONOMOUS-DEVELOPMENT.md`, `docs/progress/STATUS.md` | framework verifier tests | exact-head CI pending | ACTIVE |
| AUTO-004 — Continue highest-priority unfinished active work before new work | Product Foundation | same framework spec | `AGENTS.md`, `docs/AUTONOMOUS-DEVELOPMENT.md` | framework verifier tests | exact-head CI pending | ACTIVE |
| AUTO-005 — Meaningful behavior changes use genuine RED → GREEN → refactor | Product Foundation | same framework spec | `AGENTS.md`, `docs/AUTONOMOUS-DEVELOPMENT.md` | framework verifier tests + capability tests | exact-head CI pending | ACTIVE |
| AUTO-006 — Critical/Important review findings block completion | Product Foundation | same framework spec | `docs/AUTONOMOUS-DEVELOPMENT.md` | framework verifier tests | exact-head CI pending | ACTIVE |
| AUTO-007 — Completion requires fresh exact-SHA CI | Product Foundation | same framework spec | `AGENTS.md`, `docs/AUTONOMOUS-DEVELOPMENT.md`, CI | framework verifier tests | exact-head CI pending | ACTIVE |
| AUTO-008 — Default PR policy creates/updates PRs but does not auto-merge | Product Foundation | same framework spec | `AGENTS.md`, `docs/AUTONOMOUS-DEVELOPMENT.md` | framework verifier tests | PR #2 remains draft/open | ACTIVE |
| AUTO-009 — End every meaningful run with durable status and exact next work | Product Foundation | same framework spec | `docs/progress/STATUS.md`, milestone ledger | framework verifier tests | exact-head CI pending | ACTIVE |
| AUTO-010 — Detect/avoid duplicate concurrent work | Product Foundation | same framework spec | `docs/AUTONOMOUS-DEVELOPMENT.md`, status/PR recovery | review/manual recovery evidence | exact-head CI pending | ACTIVE |
| PRD-195 — Product foundation milestone | Product Foundation | existing foundation design + milestone ledger | application shell/config/CI/docs on `main` | Vitest, Testing Library, Playwright smoke | app checks passed previously; PRD coverage blocked | IMPLEMENTED |

## Expansion rule

When a product capability becomes active, add or refine traceability entries before declaring its milestone complete. A fresh worker should be able to navigate from every active/verified requirement to its owning spec/plan, code, tests, and verification evidence.
