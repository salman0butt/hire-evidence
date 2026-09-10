# Milestone System

This repository uses **M00–M15** as product milestones/epics. A milestone is not a single Codex task. Each milestone is decomposed into small iterations listed in its file and in `docs/iterations/ITERATION-ROADMAP.md`.

## States

`NOT_STARTED → RECOVERING → ANALYZING → DESIGNING → PLANNING → IMPLEMENTING → TESTING → REVIEWING → VERIFYING → READY_FOR_REVIEW → COMPLETE`

`BLOCKED` may be used with an explicit blocker and next unblock action.

## Completion rule

Code written is not completion. A milestone requires implementation, tests, review, fresh verification, CI and documentation. Only one milestone should normally be active.

## Branching

Default: one milestone branch/PR when reviewable. Split very large/risky milestones (especially realtime, assessment, billing or sandbox work) into 2–3 review-boundary PRs while keeping one logical milestone active.

## State recovery

Every session starts from repository truth and `CURRENT.md`, never chat memory. See `AGENTS.md` and `prompts/02-continue-current-iteration.md`.
