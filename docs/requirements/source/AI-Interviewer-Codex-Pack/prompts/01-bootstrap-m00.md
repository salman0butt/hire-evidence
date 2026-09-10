# Codex Prompt — Bootstrap M00

You are starting implementation of the new AI Interviewer product.

Do NOT implement the whole PRD and do NOT advance beyond M00.

## Recover/establish truth first

1. Read the installed `superpowers:using-superpowers` skill and use applicable Superpowers skills.
2. Read `AGENTS.md`, `docs/product/PRD.md`, `docs/milestones/README.md`, `docs/milestones/CURRENT.md`, and `docs/milestones/M00-product-foundation.md`.
3. Inspect the actual repository, Git status/history/branches/remotes, issues, PRs, CI and existing files.
4. Inspect the Talk Tutor reference repository only for reusable architectural patterns identified by the PRD; do not copy its domain logic blindly.
5. Reconcile this documentation pack with actual repository state.
6. If the new product repository is empty, bootstrap it according to M00. If it already contains work, recover and characterize it instead of overwriting blindly.

## M00 only

Design and implement M00 through its small iterations:

- M00.1 repository bootstrap
- M00.2 testing foundation
- M00.3 CI foundation
- M00.4 governance docs
- M00.5 milestone recovery

Use TDD where behavior exists; use verification-first setup checks for scaffolding/configuration.

Create/update Superpowers design and implementation-plan docs as required.

## Verification

Run all applicable lint, typecheck, tests, build and smoke E2E. Inspect CI. Review the diff using correctness, architecture, security, TypeScript, test and maintainability lenses. Fix confirmed findings and verify again.

Persist actual state in `docs/milestones/CURRENT.md` after meaningful transitions.

Create/push the M00 branch and PR when M00 is reviewable. Do not merge unless explicitly authorized.

STOP at the M00 boundary. Do not begin M01.
