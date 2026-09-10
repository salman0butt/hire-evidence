# Codex Prompt — Continue Current Iteration

Continue autonomous development of AI Interviewer from repository state.

Do NOT attempt the entire PRD.

## Recover state before changing code

1. Read `superpowers:using-superpowers` and applicable skills.
2. Read `AGENTS.md`.
3. Inspect Git status/current branch and fetch the latest remote.
4. Read `docs/product/PRD.md`.
5. Read `docs/milestones/README.md` and `docs/milestones/CURRENT.md`.
6. Read the active milestone file, active design spec and implementation plan.
7. Inspect the active PR, CI checks, reviews, unresolved threads and recent commits.
8. Reconcile docs with repository truth and update stale `CURRENT.md`.

## Execute only the current iteration

Use the active iteration and exact `Next Action` from `CURRENT.md`. If the iteration is still too large, split it into smaller dependency-ordered tasks without expanding milestone scope.

Use characterization tests/TDD, smallest-correct implementation, focused verification, refactoring only after green, then broad verification.

Review relevant correctness/security/tenancy/AI/realtime/React/accessibility/test concerns. Fix confirmed findings and re-run fresh verification.

Commit and push coherent changes. Update `CURRENT.md` with completed/current/remaining work, verification evidence, last verified commit and exact next action.

If the current iteration finishes, select the next iteration inside the SAME milestone. If all milestone acceptance criteria are met, perform full milestone verification and stop at the milestone boundary. Do not begin the next milestone unless explicitly authorized.
