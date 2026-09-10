# Codex Prompt — Complete Current Milestone

Recover repository/branch/PR/CI/review state and read all authoritative docs.

Do not start a new milestone.

Audit the current milestone against:

- every item in its authoritative PRD milestone definition
- its exit condition
- all iterations/acceptance criteria
- security/fairness invariants
- tests/E2E/visual/eval/realtime/database verification applicable to the milestone
- documentation and migration/manual setup requirements
- unresolved PR reviews and CI

Close any real gaps with tests and minimal implementation. Run fresh final verification on the exact final commit. Ensure CI is green and all review blockers are resolved.

Update `CURRENT.md` to READY_FOR_REVIEW or COMPLETE only when evidence supports it, with the last verified commit and verification results.

STOP. Do not implement the next milestone unless explicitly authorized.
