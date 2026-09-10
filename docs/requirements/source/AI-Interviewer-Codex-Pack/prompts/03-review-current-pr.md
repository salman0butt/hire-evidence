# Codex Prompt — Review Current PR

Recover the repository and current PR state first. Read `AGENTS.md`, the PRD, `CURRENT.md`, active milestone/design/plan, PR diff, CI and all review threads.

Perform a multi-lens review of the current PR. Use specialist/subagent reviewers where useful, but independently validate findings before changing code.

At minimum review:

- correctness and edge cases
- architecture/KISS/YAGNI
- TypeScript/runtime validation
- security/auth/token handling
- multi-tenancy/RLS/cross-tenant references
- database migrations/indexes/constraints
- AI safety/prompt trust/evidence grounding if relevant
- realtime/audio/race/reconnect/transcript behavior if relevant
- billing authorization/idempotency if relevant
- React/Next.js state/lifecycle/accessibility
- tests, missing negative cases and flaky behavior

Treat P0 areas from the PRD as release blockers.

Produce concrete findings with file/line evidence and severity. Fix confirmed in-scope findings, add regression tests, run fresh verification on the final head, update `CURRENT.md`, and push. Do not merge unless explicitly authorized.
