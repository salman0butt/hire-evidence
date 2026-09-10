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
Single Next.js App Router application with strict TypeScript, minimal product shell, deterministic environment validation, health endpoint, Vitest/Testing Library, Playwright smoke coverage, Tailwind, ESLint, and GitHub Actions. The repository itself is durable execution memory.

## Selected Design / Implementation Plan
- Design: `docs/superpowers/specs/2026-09-10-autonomous-long-project-framework-design.md` and `docs/superpowers/specs/2026-09-10-durable-milestone-ledger-design.md`
- Plan: `docs/superpowers/plans/2026-09-10-autonomous-long-project-framework.md` and `docs/superpowers/plans/2026-09-10-durable-milestone-ledger-migration.md`
- Routine decisions are pre-authorized under repository autonomous mode.

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
Foundation behavior used genuine RED→GREEN work. The requirements-source hardening also has direct CI evidence: run `34474152336` failed because the new verifier script was absent; after implementation run `34474310301` passed all five focused source-integrity tests; run `34474528983` passed those tests plus the real verifier.

## Integration Test Evidence
CI run `34474528983` on exact head `4ea1eed4c822c3667d575a13c6b735e5148c69df` passed frozen install, lint, typecheck, application tests, autonomous-framework tests/verifier, requirements-source tests/verifier, build, smoke E2E, and PRD coverage together.

## E2E / Visual Verification
Playwright smoke E2E passed in CI run `34474528983`. PR #2 adds no substantial user-facing product workflow, so separate visual-regression evidence is not required for this foundation slice.

## Security Review
No tenant persistence, candidate authorization, billing, realtime interview execution, or AI assessment execution is introduced in this PR. Requirements-source verification rejects unsafe traversal-like manifest paths and checks exact source file identities. Non-negotiable hiring-AI safety boundaries remain in `AGENTS.md` and the preserved requirements.

## Accessibility Review
No new substantive user-facing workflow is added by PR #2. Existing foundation UI smoke/component coverage remains green.

## Performance Review
No performance-critical product path is introduced. The source-integrity verifier operates over the small committed requirements corpus during verification and is not a runtime product path.

## AI / Eval Review
AI product behavior is not implemented in this milestone. Safety/evaluation documents are governance inputs only; later AI milestones require dedicated eval evidence.

## Code Review Findings
Skeptical review covered PRD compliance, correctness, architecture/YAGNI, testing, security, and hiring-AI safety.

- Critical: 0.
- Important: 3 found — continuous requirements-source integrity missing; required `CI status:` recovery marker dropped during reconciliation; unified local `pnpm verify` omitted source-integrity verification.
- Important fixes: source-integrity verifier/tests/CI gate added; recovery marker restored; unified verification command aligned with requirements checks.
- Minor: Vitest/Vite warns that `vitest.config.ts` uses ESM syntax while loaded as CommonJS. Tests pass; defer until module/config maintenance rather than broaden foundation scope.
- Remaining Critical/Important: 0 known, subject to final exact-head CI.

## Fixes / Re-review
The Important findings above were corrected without weakening existing checks. Re-review found no remaining Critical/Important implementation issue. A final exact-head CI run is required because this review-evidence/config commit creates a newer head.

## Fresh Verification Commands
Baseline:

```bash
pnpm install --frozen-lockfile
pnpm lint
pnpm typecheck
pnpm test
python3 -m unittest tests/python/test_verify_autonomous_framework.py
python3 -m unittest tests/python/test_verify_requirements_source.py
python3 scripts/verify_autonomous_framework.py
python3 scripts/verify_requirements_source.py
pnpm build
pnpm e2e
python3 scripts/verify_prd_coverage.py
```

The unified local command `pnpm verify` now includes framework and requirements verification.

## Fresh Verification Results
Reviewed pre-closeout head `4ea1eed4c822c3667d575a13c6b735e5148c69df`: GitHub Actions CI run `34474528983` — PASS for every required step. This final durable review-evidence/config commit requires fresh exact-head CI before the run can claim final-head green.

## Commits / Files Changed
Recover exact current state from PR #2/GitHub; do not treat historical SHA text as stronger than current Git state.

## Known Limitations
PR #2 remains draft/open and must not be merged without explicit owner authorization. Later product milestones remain intentionally unimplemented. The Vitest/Vite module-loader warning is Minor technical debt.

## Documentation Updated
Requirements/progress state, known issues, feature matrix, current milestone, and this living ledger have been reconciled against repository/CI evidence.

## Durable Recovery Sources
`AGENTS.md` → `docs/AUTONOMOUS-DEVELOPMENT.md` → `docs/progress/STATUS.md` → known issues → this ledger → relevant PRD → selected spec/plan → active PR/reviews/exact-head CI → source/tests.

## Completion Checklist
- [x] Requirements and iterations accounted for.
- [x] Acceptance criteria implemented for foundation scope.
- [x] Required TDD/integration/E2E evidence recorded.
- [x] Security/accessibility/performance/AI-eval review scope documented.
- [x] 0 known Critical / 0 known Important findings after fixes/re-review.
- [x] Traceability/feature matrix reconciled.
- [ ] Exact-final-head CI green after this final review-evidence/config commit.
- [x] Durable status/review evidence current at commit creation time.

## Next Milestone
M01 — SaaS Shell + Auth, but do not begin it until M00 closeout is objectively complete. PR #2 remains subject to explicit owner-controlled merge authorization.
