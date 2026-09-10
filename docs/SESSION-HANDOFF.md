# Session Handoff

This file is retained as a compatibility handoff for workers that were started before the upgraded autonomous framework existed.

For all new sessions, recover in this order:

1. `CODEX-START-HERE.md`
2. `AGENTS.md`
3. `docs/AUTONOMOUS-DEVELOPMENT.md`
4. actual GitHub branches/PRs/reviews/CI
5. `docs/progress/STATUS.md`
6. `docs/progress/KNOWN-ISSUES.md`
7. `docs/milestones/CURRENT.md`
8. relevant requirements/traceability/spec/plan

Actual Git/code/current exact-SHA CI always outranks stale prose in this file.

## Repository state at framework upgrade

- Repository: `salman0butt/hire-evidence`
- Base branch: `main`
- Base SHA for the active continuation: `2f64d4aa10aef2b328f2a6fa64d5008dc82253c6`
- Active continuation branch: `feat/product-foundation-requirements`
- Active PR: #2 — draft, `Persist product requirements and recovery state`
- PR #1 (`Bootstrap product foundation`) was merged into `main` on 2026-09-10.
- Do not merge PR #2 unless the owner explicitly authorizes it.

## What is already implemented

The application foundation on `main` includes the Next.js/TypeScript shell, environment validation, `/api/health`, unit/component testing, Playwright smoke testing, and GitHub Actions CI.

Previous application CI reached the following result before requirements persistence became the blocker:

- dependency install: PASS
- lint: PASS
- typecheck: PASS
- unit/component tests: PASS
- production build: PASS
- Chromium install: PASS
- smoke E2E: PASS
- PRD coverage: FAIL because the complete requirements corpus was not yet present

That older run is historical evidence only; it is not exact-head proof for newer commits.

## Upgraded autonomous framework

PR #2 now contains:

- `docs/AUTONOMOUS-DEVELOPMENT.md`
- `docs/PRODUCT.md`
- `docs/ARCHITECTURE.md`
- `docs/DECISIONS.md`
- `docs/FEATURE-MATRIX.md`
- `docs/requirements/README.md`
- `docs/requirements/TRACEABILITY.md`
- `docs/progress/STATUS.md`
- `docs/progress/KNOWN-ISSUES.md`
- Superpowers framework design + executable plan
- `scripts/verify_autonomous_framework.py`
- focused Python verifier tests
- CI integration for the framework verifier
- upgraded `AGENTS.md` and `CODEX-START-HERE.md`

The framework verifier was developed with a genuine local RED→GREEN cycle: tests first failed because the verifier module was absent, then 4/4 focused tests passed after implementation.

Known-invalid 20,000-byte ZIP transport copies, marker files, and the obsolete one-time requirements importer were removed from the active branch.

## Requirements source of truth

Original uploaded archive:

- filename: `AI-Interviewer-Codex-Pack(1).zip`
- size: `121574` bytes
- SHA-256: `900353885ef4911b9ebb7a656f9e0771227df008db773919a632aedefa4596ba`
- expected master PRD coverage: numbered sections 1–242

Do not trust any reconstructed source archive unless its SHA-256 matches exactly.

## Current blocker

The complete requirements corpus is still not durably persisted in GitHub. Prior connector-based large binary transfer attempts truncated/altered the archive, so the safe continuation path is direct filesystem/Git access to the original uploaded ZIP.

## Exact next work

Use `docs/progress/STATUS.md` as the canonical next-action source. At this handoff, the legitimate next work is to recover and verify the original ZIP, import every missing source-of-truth file using direct filesystem/Git tooling, run PRD coverage, review the complete PR diff, fix Critical/Important findings, and run full CI against the exact final PR head.
