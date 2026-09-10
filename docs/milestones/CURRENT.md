# Current Milestone

Milestone:
Product Foundation

Legacy roadmap identifier:
M00

Current capability:
Durable autonomous-development framework + requirements persistence + verification closeout

Status:
BLOCKED_ON_REQUIREMENTS_IMPORT

Branch:
`feat/product-foundation-requirements`

Base:
`main`

PR:
#2 — open draft, `Persist product requirements and recovery state`

Canonical compact recovery state:
`docs/progress/STATUS.md`

Detailed known issues:
`docs/progress/KNOWN-ISSUES.md`

## Completed

- Repository/application foundation implemented with TDD and merged through PR #1.
- Next.js/TypeScript app shell, environment validation, `/api/health`, unit/component harness, Playwright smoke harness, and CI are present on `main`.
- Previous application CI passed dependency install, lint, typecheck, unit/component tests, production build, Chromium install, and smoke E2E before failing the missing-PRD coverage gate.
- Original requirements source archive independently verified locally at 121574 bytes with SHA-256 `900353885ef4911b9ebb7a656f9e0771227df008db773919a632aedefa4596ba`.
- Draft PR #2 exists for requirements/governance persistence.
- Autonomous long-project framework design and executable implementation plan are persisted under `docs/superpowers/`.
- Canonical autonomy, product, architecture, decisions, feature matrix, requirements, traceability, project status, and known-issues documents are on PR #2.
- Machine-checkable autonomous-framework verifier and focused unit tests are on PR #2 with genuine local RED→GREEN evidence.
- Root `AGENTS.md` and `CODEX-START-HERE.md` now enforce fresh-session recovery, work-selection priority, exact-SHA verification, concurrency safety, durable handoff, and manual merge policy.
- Known-invalid 20,000-byte requirements transport ZIPs, marker files, and obsolete one-time importer workflow were removed from the active branch.

## In progress

- Review the framework-upgrade diff and inspect exact-head CI evidence.
- Persist the complete verified requirements source corpus through a transport path that does not truncate the original data.

## Remaining

- Import every missing source-of-truth requirement file from the verified original archive using direct filesystem/Git access.
- Run `python3 scripts/verify_prd_coverage.py` successfully across the complete corpus.
- Run full exact-head CI and inspect the exact final SHA.
- Perform independent review; fix all Critical/Important findings.
- Update status/traceability/feature matrix with proven final state.
- Keep PR #2 open unless explicit merge authorization is given.

## Blocker

The connected GitHub transport used for the ZIP truncated/altered large binary payloads. The source archive itself is valid; the complete corpus is not yet present in GitHub. Direct filesystem/Git import of the verified original archive is required.

## Verification state

- application install/lint/typecheck/tests/build/smoke E2E: passed on an older application head;
- autonomous framework verifier: local RED→GREEN evidence exists; exact-head CI inspection pending;
- invalid temporary transport artifacts: removed and confirmed absent from the branch tree;
- PRD coverage: BLOCKED/FAIL until full requirements corpus exists;
- final exact-head milestone verification: PENDING.

## Next Action

Follow `docs/progress/STATUS.md` `Exact next work:`. Import the original verified requirements pack through direct filesystem/Git access, then run PRD coverage, review, and full exact-head verification before starting the next product milestone.
