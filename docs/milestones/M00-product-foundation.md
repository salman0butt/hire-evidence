# M00 — Product Foundation

Status: **VERIFYING**

## Goal
Deliver the authoritative PRD milestone below as a reviewable, evidence-backed capability.

## Authoritative PRD Milestone Definition

# 195. MILESTONE 00 — PRODUCT FOUNDATION

## Goal

Bootstrap repository and persistent project-management structure.

Deliver:

```text
Next.js project
TypeScript
lint
tests
CI
README
AGENTS.md
PRD
milestone system
architecture skeleton
env template
```

No major product UI yet.

Exit:

```text
repo builds
CI green
milestone recovery works
```

## Dependencies
None.

## In Scope
The authoritative definition plus every default iteration listed below.

## Out of Scope
Later milestones, speculative abstractions, and behavior not justified by the PRD.

## Architecture Notes
Single Next.js App Router application with strict TypeScript, minimal product shell, deterministic environment validation, health endpoint, Vitest/Testing Library, Playwright smoke coverage, Tailwind, ESLint, and GitHub Actions. The repository itself is the durable execution memory.

## Selected Design / Implementation Plan
- Design: `docs/superpowers/specs/2026-09-10-autonomous-long-project-framework-design.md` and `docs/superpowers/specs/2026-09-10-durable-milestone-ledger-design.md`
- Plan: `docs/superpowers/plans/2026-09-10-autonomous-long-project-framework.md` and `docs/superpowers/plans/2026-09-10-durable-milestone-ledger-migration.md`
- Both are pre-authorized under repository autonomous mode.

## Acceptance Criteria
- PRD deliverables and exit criteria pass.
- All required iterations are complete or explicitly resolved.
- Relevant security/privacy/tenancy/accessibility/performance/AI-safety gates pass.
- 0 unresolved Critical or Important review findings.
- Traceability and feature state are reconciled.
- Exact-final-head CI is green.

## Tasks / Iterations
1. **COMPLETE** — M00.1 — Repository bootstrap: Next.js, TypeScript, package manager, lint/format, environment validation.
2. **COMPLETE** — M00.2 — Testing foundation: unit/component/E2E test runners and conventions.
3. **COMPLETE** — M00.3 — CI foundation: frozen install, lint, typecheck, tests, build, smoke E2E.
4. **COMPLETE** — M00.4 — Governance docs: README, AGENTS, durable PRD/requirements source, architecture, security, AI docs.
5. **COMPLETE** — M00.5 — Milestone recovery: CURRENT.md, living milestone ledgers, autonomous framework, verification scripts, fresh-session recovery.

## TDD Evidence
Foundation implementation used RED→GREEN during PR #1. The autonomous framework verifier also records genuine RED→GREEN evidence and its focused test suite passes in exact-head CI run `34473131246` on `dcf54ace909345194b873b51a44e94dce825d9db`.

## Integration Test Evidence
The current CI quality job passed unit/component tests, autonomous-framework verification, build, smoke E2E, and PRD coverage together on exact head `dcf54ace909345194b873b51a44e94dce825d9db`.

## E2E / Visual Verification
Playwright smoke E2E passed in CI run `34473131246`. No substantial product UI is introduced by this milestone, so separate visual regression evidence is not required for foundation closeout.

## Security Review
The current milestone introduces governance, source requirements, build/test infrastructure, and a minimal application shell. No tenant persistence, candidate authorization, billing, realtime, or AI assessment execution is introduced here. The non-negotiable hiring-AI safety boundaries remain enforced in `AGENTS.md` and the preserved source requirements.

## Accessibility Review
The foundation UI remains minimal and existing component/smoke coverage passed. No new user-facing product workflow is added by PR #2.

## Performance Review
No performance-critical product path is introduced. PR #2 primarily adds requirements/governance/recovery artifacts and verification tooling.

## AI / Eval Review
AI product behavior is not implemented in this milestone. Safety/evaluation documents are governance inputs only; later AI milestones require their own eval evidence.

## Code Review Findings
At the latest recovery check PR #2 had no submitted reviews and no unresolved review threads. Final skeptical review of the reconciled head is still required before formal completion.

## Fixes / Re-review
Former Important blockers—requirements durability, PRD coverage, dependency lockfile reproducibility, and exact-head CI—have been resolved. Reconciliation updates stale status documents to match repository evidence.

## Fresh Verification Commands
Baseline required by repository policy:

```bash
pnpm install --frozen-lockfile
pnpm lint
pnpm typecheck
pnpm test
python3 -m unittest tests/python/test_verify_autonomous_framework.py
python3 scripts/verify_autonomous_framework.py
pnpm build
pnpm e2e
python3 scripts/verify_prd_coverage.py
```

## Fresh Verification Results
Exact head `dcf54ace909345194b873b51a44e94dce825d9db`: GitHub Actions CI run `34473131246` — PASS. All quality steps above passed. The durable-state reconciliation commit creates a newer head and therefore requires its own fresh exact-head CI before M00 can be marked COMPLETE.

## Commits / Files Changed
Recover exact current state from PR #2/GitHub. Do not hard-code a final head beyond the evidence recorded for the specific verification run.

## Known Limitations
PR #2 remains a draft/open integration boundary and must not be merged without explicit owner authorization. Later product milestones remain intentionally unimplemented.

## Documentation Updated
Requirements README/traceability, feature matrix, project status, known issues, current milestone, and this ledger are reconciled against current branch and CI evidence.

## Durable Recovery Sources
`AGENTS.md` → `docs/AUTONOMOUS-DEVELOPMENT.md` → `docs/progress/STATUS.md` → known issues → this ledger → relevant PRD → selected spec/plan → active PR/reviews/exact-head CI → source/tests.

## Completion Checklist
- [x] Requirements and iterations accounted for.
- [x] Acceptance criteria implemented for the foundation scope.
- [x] Required TDD/integration/E2E evidence recorded.
- [x] Security/accessibility/performance/AI-eval review scope documented.
- [ ] 0 Critical / 0 Important findings confirmed on final reconciled head.
- [x] Traceability/feature matrix reconciled.
- [ ] Exact-final-head CI green after durable-state reconciliation.
- [x] Durable status/closeout state current for the reconciliation commit.

## Next Milestone
M01 — SaaS Shell + Auth, but do not begin it until M00 closeout is formally COMPLETE. PR #2 still remains subject to explicit owner-controlled merge authorization.
