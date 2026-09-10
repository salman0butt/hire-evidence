# M00 — Product Foundation

Status: **IMPLEMENTING**

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
Single Next.js App Router application with strict TypeScript, minimal product shell, deterministic environment validation, health endpoint, Vitest/Testing Library, Playwright smoke coverage, and GitHub Actions. The repository itself is the durable execution memory.

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
3. **COMPLETE** — M00.3 — CI foundation: lint, typecheck, tests, build, smoke E2E.
4. **IN PROGRESS** — M00.4 — Governance docs: README, AGENTS, PRD, architecture, security, AI docs.
5. **IN PROGRESS** — M00.5 — Milestone recovery: CURRENT.md, templates, scripts, verified fresh-session recovery.

## TDD Evidence
Foundation implementation used RED→GREEN and has historical app-level CI evidence, but exact-head closeout is still pending. See PR #2 and `docs/progress/STATUS.md`.

## Integration Test Evidence
Foundation implementation used RED→GREEN and has historical app-level CI evidence, but exact-head closeout is still pending. See PR #2 and `docs/progress/STATUS.md`.

## E2E / Visual Verification
Foundation implementation used RED→GREEN and has historical app-level CI evidence, but exact-head closeout is still pending. See PR #2 and `docs/progress/STATUS.md`.

## Security Review
Core safety/security policy exists; final milestone-level review remains pending.

## Accessibility Review
PENDING exact-head closeout for the minimal foundation UI.

## Performance Review
No performance-critical product path is introduced; final closeout review remains pending.

## AI / Eval Review
AI product behavior is not implemented in this milestone. Safety/evaluation policy documents are governance inputs only.

## Code Review Findings
Final milestone-level review is pending after requirements and reproducibility blockers are resolved.

## Fixes / Re-review
PENDING when evidence-backed findings exist.

## Fresh Verification Commands
Run repository-wide verification plus milestone-specific tests. Baseline:

```bash
pnpm lint
pnpm typecheck
pnpm test
pnpm build
pnpm e2e
python3 scripts/verify_autonomous_framework.py
python3 scripts/verify_prd_coverage.py
```

## Fresh Verification Results
PENDING for the exact final PR head; older green steps are not proof for newer commits.

## Commits / Files Changed
Recover exact current state from PR #2/GitHub; do not hard-code stale head truth.

## Known Limitations
Requirements corpus durability, `pnpm-lock.yaml`, and exact-head closeout remain unresolved. See `docs/progress/KNOWN-ISSUES.md`.

## Documentation Updated
This living ledger must be reconciled whenever milestone state/evidence changes.

## Durable Recovery Sources
`AGENTS.md` → `docs/AUTONOMOUS-DEVELOPMENT.md` → `docs/progress/STATUS.md` → known issues → this ledger → relevant PRD → selected spec/plan → active PR/reviews/exact-head CI → source/tests.

## Completion Checklist
- [ ] Requirements and iterations accounted for.
- [ ] Acceptance criteria verified.
- [ ] Required TDD/integration/E2E evidence recorded.
- [ ] Security/accessibility/performance/AI-eval reviews complete where relevant.
- [ ] 0 Critical / 0 Important findings.
- [ ] Traceability/feature matrix reconciled.
- [ ] Exact-final-head CI green.
- [ ] Durable status/closeout state current.

## Next Milestone
M01 — SaaS Shell + Auth.
