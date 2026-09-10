# CODEX — START HERE

You are working on **Hire Evidence / AI Interviewer**.

Do not implement the complete product in one run.

## Authoritative sources

Read in this order:

1. Actual Git/repository state
2. `AGENTS.md`
3. `docs/SESSION-HANDOFF.md` when present — this is the live cross-session recovery record
4. `docs/milestones/CURRENT.md`
5. `docs/product/PRD.md` once the complete requirements pack has been persisted
6. Active milestone file
7. Active design spec
8. Active implementation plan
9. Conversation context

## Current recovery rule

Before implementing anything new, read `docs/SESSION-HANDOFF.md` and recover the exact branch/PR/CI state. The current continuation work is requirements/governance persistence and final foundation verification. Do not advance into later product functionality until the completion gates in that handoff are green.

## Prompt entry points

For a clean bootstrap use the appropriate bootstrap prompt from `prompts/` once the requirements pack is available.

For continuation use `prompts/02-continue-current-iteration.md` after recovering actual repository state.

## Git history naming

Use descriptive commit and PR titles. Do not include milestone identifiers such as `M00`, `M01`, and similar codes in new commit titles or PR titles.

## Merge rule

Keep continuation PRs open unless the user explicitly asks to merge.

## Key rule

Only one milestone should normally be active. Inside that milestone, implement one small dependency-ordered iteration at a time. Do not start the next milestone until the current milestone passes its exit criteria, review, CI, documentation, and fresh verification.
