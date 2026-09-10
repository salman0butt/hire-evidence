# CODEX — START HERE

This repository is designed for long-running autonomous development across completely fresh sessions.

## Mandatory startup

1. Invoke/read installed Superpowers `using-superpowers` **before engineering actions**.
2. Read root `AGENTS.md`.
3. Read `docs/AUTONOMOUS-DEVELOPMENT.md`.
4. Recover actual GitHub state: default branch, latest SHAs, recent commits, active branches, open/draft PRs, reviews/threads, and CI for the exact active head.
5. Read `docs/progress/STATUS.md` and `docs/progress/KNOWN-ISSUES.md`.
6. Read `docs/milestones/CURRENT.md` and the active milestone ledger.
7. Read relevant PRD/requirements/traceability entries.
8. Read the active Superpowers spec and implementation plan.
9. Compare docs with actual Git/code/tests/PR/CI; repair stale docs when evidence proves them stale.
10. Continue the highest-priority unfinished active work before starting new work.

## Source precedence

```text
Git graph / actual repository state
> source + tests at relevant SHA
> fresh exact-SHA CI/artifacts
> current PR/review state
> progress/milestone docs
> older handoffs
> chat memory
```

## Current recovery index

Canonical compact state: `docs/progress/STATUS.md`.

Detailed unresolved issues: `docs/progress/KNOWN-ISSUES.md`.

Legacy/detailed session history may exist in `docs/SESSION-HANDOFF.md`, but it never outranks current Git/code/CI or `STATUS.md` reconciled against them.

## Working rules

Use repository-defined pre-approval for routine design/spec/plan gates while preserving Superpowers rigor. Use strict TDD for meaningful behavior, independent review, verification-before-completion, exact-SHA CI, durable traceability, and concurrency safety.

Do not use milestone codes as meaningless commit/PR titles.

Do not merge unless explicitly authorized.
