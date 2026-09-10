# Codex Prompt — Fix Review Findings

Recover the current branch, PR, CI, review threads, `AGENTS.md`, PRD, `CURRENT.md`, milestone and plan.

For every unresolved review finding:

1. Reproduce/validate it against current HEAD.
2. Classify severity and whether it is in scope.
3. Fix confirmed in-scope problems with regression tests.
4. Do not make unrelated refactors.
5. Re-run focused verification after each logical fix.
6. After all fixes, run the full milestone/PR verification suite from the final commit.
7. Re-review the final diff for regressions.
8. Update `CURRENT.md`, push, and ensure CI reflects the final head.

Do not dismiss findings without evidence. Do not merge unless explicitly authorized.
