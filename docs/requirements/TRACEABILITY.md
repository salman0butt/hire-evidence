# Requirements Traceability

This matrix tracks the autonomous-development framework requirements and the current product-foundation state. Product requirement mappings expand incrementally as each capability becomes active. The complete source corpus is durably persisted; future milestones must refine traceability from the canonical PRD rather than reconstructing scope from chat memory.

| Requirement | Milestone | Spec | Implementation | Tests | Verification | Status |
|---|---|---|---|---|---|---|
| AUTO-001 — Git/GitHub is durable execution memory; do not rely on chat | Product Foundation | `docs/superpowers/specs/2026-09-10-autonomous-long-project-framework-design.md` | `AGENTS.md`, `docs/AUTONOMOUS-DEVELOPMENT.md` | framework verifier tests | CI run `34473131246` on `dcf54ace…` | VERIFIED |
| AUTO-002 — Every fresh run performs mandatory recovery before writes | Product Foundation | same framework spec | `AGENTS.md`, `docs/AUTONOMOUS-DEVELOPMENT.md`, `CODEX-START-HERE.md` | framework verifier tests | CI run `34473131246` on `dcf54ace…` | VERIFIED |
| AUTO-003 — Use evidence-based recovery precedence | Product Foundation | same framework spec | `docs/AUTONOMOUS-DEVELOPMENT.md`, `docs/progress/STATUS.md` | framework verifier tests | CI run `34473131246` on `dcf54ace…` | VERIFIED |
| AUTO-004 — Continue highest-priority unfinished active work before new work | Product Foundation | same framework spec | `AGENTS.md`, `docs/AUTONOMOUS-DEVELOPMENT.md` | framework verifier tests | CI run `34473131246` on `dcf54ace…` | VERIFIED |
| AUTO-005 — Meaningful behavior changes use genuine RED → GREEN → refactor | Product Foundation | same framework spec | `AGENTS.md`, `docs/AUTONOMOUS-DEVELOPMENT.md` | framework verifier tests + capability tests | framework verifier history + CI run `34473131246` | VERIFIED |
| AUTO-006 — Critical/Important review findings block completion | Product Foundation | same framework spec | `docs/AUTONOMOUS-DEVELOPMENT.md` | framework verifier tests | policy machine-checks passed; final PR closeout review pending | IMPLEMENTED |
| AUTO-007 — Completion requires fresh exact-SHA CI | Product Foundation | same framework spec | `AGENTS.md`, `docs/AUTONOMOUS-DEVELOPMENT.md`, CI | framework verifier tests | exact pre-reconciliation SHA `dcf54ace…` green; final reconciliation SHA pending | IMPLEMENTED |
| AUTO-008 — Default PR policy creates/updates PRs but does not auto-merge | Product Foundation | same framework spec | `AGENTS.md`, `docs/AUTONOMOUS-DEVELOPMENT.md` | framework verifier tests | PR #2 remains draft/open and unmerged | VERIFIED |
| AUTO-009 — End every meaningful run with durable status and exact next work | Product Foundation | same framework spec | `docs/progress/STATUS.md`, milestone ledger | framework verifier tests | CI run `34473131246`; current reconciliation updates durable state | IMPLEMENTED |
| AUTO-010 — Detect/avoid duplicate concurrent work | Product Foundation | same framework spec | `docs/AUTONOMOUS-DEVELOPMENT.md`, status/PR recovery | review/manual recovery evidence | recovery performed against active PR #2 without duplicate PR | VERIFIED |
| PRD-195 — Product foundation milestone | Product Foundation | foundation + autonomy/milestone designs | application shell/config/CI/docs, durable PRD, lockfile, milestone system | Vitest, Testing Library, Playwright smoke, framework verifier, PRD coverage verifier | all required CI steps passed on `dcf54ace…`; final reconciled-head review/CI pending | IMPLEMENTED |
| REQ-DURABILITY — Preserve complete owner requirements source in Git | Product Foundation | milestone-ledger/autonomy designs | `docs/requirements/source/AI-Interviewer-Codex-Pack/`, `SOURCE-MANIFEST.json`, `docs/product/`, `docs/iterations/` | `scripts/verify_prd_coverage.py` | PRD coverage PASS in CI run `34473131246` | VERIFIED |
| DEP-REPRO — Dependency graph is reproducible | Product Foundation | foundation closeout | `pnpm-lock.yaml`, frozen CI install | CI install + full quality job | frozen install PASS in CI run `34473131246` | VERIFIED |

## Expansion rule

When a product capability becomes active, add or refine traceability entries before declaring its milestone complete. A fresh worker should be able to navigate from every active/verified requirement to its owning spec/plan, code, tests, and verification evidence.
