# Project Status

Last reconciled: 2026-09-13

## Completed Milestones

- Product Foundation — **COMPLETE**. PR #2 merged as `64ebeb4f7b2a39fc0557685ef34035650211aad9`.
- SaaS Shell + Auth — **COMPLETE**. PR #3 merged as `ed10e1b55bb62cf202585c8c50e6487014e83c29`.
- Organizations + RBAC — **COMPLETE**. PR #4 merged as `835d7d571a69cd13e3e802be4872e873ffdd34fe`.
- Jobs + Interviewer Builder — **COMPLETE**. PR #5 merged as `729474ffb03075c93dfa2564f0004f1590533753`.
- Candidates + Invitations — **COMPLETE**. PR #6 merged as `943e8a5c1dd45dc1652453ddf8ebc4ae31951925`; post-merge CI #517 / `34692492691` passed the full repository gate.

## Current Milestone

Realtime AI Interview — **ACTIVE**.

Active branch: `feat/realtime-ai-interview`
Active PR: #7 — `Build realtime AI interview` — OPEN / DRAFT / unmerged.
Verified base/main: `943e8a5c1dd45dc1652453ddf8ebc4ae31951925`.
Latest verified behavioral head: `a184da9ec54aa317fa42c600591be422676797d1`.
CI status: CI #623 / `34722042401` passed the complete repository gate on `a184da9ec54aa317fa42c600591be422676797d1`: frozen install, lint, typecheck, unit/component tests, framework/source verifiers, local Supabase, production build, Chromium E2E, PRD coverage, and cleanup.

Selected design: `docs/superpowers/specs/2026-09-12-realtime-ai-interview-design.md`.
Selected plan: `docs/superpowers/plans/2026-09-12-realtime-ai-interview.md`.

## Current Task State

- M05.1 Reference characterization — **VERIFIED**.
- M05.2 Session authorization/provider boundary — **ACTIVE / PARTIALLY VERIFIED**. Provider-neutral authorization and attempt boundaries are verified; provider-specific production credential issuance remains blocked because no authoritative realtime provider is selected.
- M05.3 Browser compatibility + microphone diagnostics — **VERIFIED**.
- M05.4 Deterministic Web Audio capture — **VERIFIED**.
- M05.5 Provider-neutral realtime transport — **VERIFIED (provider-neutral scope)**. App-owned normalized lifecycle, open-only audio send, stale callback rejection, idempotent disconnect, normalized technical errors, and deterministic fake adapter are implemented and exact-head verified. Provider-specific adapter work remains blocked pending authoritative provider selection.
- M05.6 AI audio playback — **VERIFIED**. Serialized PCM playback, per-source cleanup, output-level reset, interruption epoch/queue invalidation, stale ended-callback rejection, copied PCM ownership, and idempotent one-time teardown are implemented and exact-head verified.
- M05.7 Explicit connection state machine — **VERIFIED**. Application-owned lifecycle, generation-scoped stale-event rejection, bounded recovery entry/retry semantics, terminal authorization handling, subordinate listening/thinking/speaking state, and accessible mute/end/retry controls are implemented and exact-head verified.
- M05.8 Deterministic interview-plan runner — **VERIFIED**. Runtime snapshots the immutable published plan, advances only in exact section/question order, rejects replay/out-of-order progression, bounds follow-up consumption, and authorizes only the current published question rather than future or model-invented questions.
- M05.9 Pacing/time budget — **NEXT**.
- M05.10–M05.14 — **NOT STARTED**.

## TDD / Verification Evidence

Earlier M05.2–M05.4 evidence remains in `docs/milestones/M05-realtime-ai-interview.md`.

- M05.5 RED: `2e1569cdac314884d5f56af837360dd300e57bd7`, CI #608 / `34711135700` — typecheck failed because the transport contract test imported the intentionally missing `./transport` module.
- M05.5 exact verified head: `fb960c72136246fb2ba1a236971db948fb7ee95e`, CI #610 / `34718812471` — complete repository gate GREEN.
- M05.6 RED: `0bd355a996f1d2ceec18b985bd1b533ff1a992c9`, CI #612 / `34719132103` — typecheck failed because the playback contract imported the intentionally missing `./audio-playback` module.
- M05.6 invalid NOT GREEN: `6c97808ae14fd6e69a951617ef22dfc0fa3fcf27`, CI #613 / `34719250355` — test-harness typing failed before behavioral verification.
- M05.6 GREEN: `d3e4edf01001f893f3f913f45011233096744a67`, CI #614 / `34719329747` — complete repository gate GREEN.
- M05.7 state-machine RED: `15f887e62d628965a01b7f58363fb63d50b339e0`, CI #616 / `34719618954` — required connection-machine behavior was absent. Implementation `ef4718a28d0a88dcdcdb59098c3630a3a028df3e` started CI #617 / `34719712700`, which was cancelled by the next head and is not final GREEN evidence.
- M05.7 accessible-controls RED: `2faa12fca7d0f39a5b411259286f54a11176d5d1`, CI #618 / `34719805392` — typecheck failed on the intentionally missing realtime-controls component.
- M05.7 GREEN: `6a440ccd0233b2083c47f3ec9991b897487dbad6`, CI #619 / `34720013611` — complete repository gate GREEN.
- M05.8 initial RED: `1ef658fabd7ca8b8c29921661c9e2f42001a0c16`, CI #620 / `34721584894` — typecheck failed on the intentionally missing deterministic plan-runner module.
- M05.8 initial GREEN: `0fab34a4a61dd4d8c91c1ca80e1055905bf2e6f9`, CI #621 / `34721656385` — complete repository gate GREEN.
- M05.8 review RED: `a3224b943c5b4613c58b54e0ca3953d97285975f`, CI #622 / `34721926133` — unit tests proved the initial question-authority helper incorrectly allowed future planned questions.
- M05.8 reviewed GREEN: `a184da9ec54aa317fa42c600591be422676797d1`, CI #623 / `34722042401` — current-question-only authority fix passed the complete repository gate.

## Review State

Critical findings: **0 unresolved** for implemented M05 slices.
Important findings: **0 unresolved** for implemented M05 slices.
PR #7 has no unresolved review threads at the latest recovery.

M05.8 review found one Important issue: authorizing any question present anywhere in the plan could allow a future question out of order. The regression test at `a3224b9…` proved the issue; `a184da9…` restricts authorization to the current deterministic cursor and passed the full gate. The runner copies published plan data, ignores untrusted extra event fields, never derives candidate quality, and cannot mutate hiring evidence.

## Blockers / Constraints

- Provider-specific production issuance and provider adapter composition remain blocked until an authoritative realtime provider is selected/configured.
- This does not block later provider-neutral M05 domain work.

## Durable Recovery

Recover actual Git/PR/CI first, then read `AGENTS.md`, `CODEX-START-HERE.md`, `docs/AUTONOMOUS-DEVELOPMENT.md`, this file, `docs/progress/KNOWN-ISSUES.md`, `docs/milestones/CURRENT.md`, `docs/milestones/M05-realtime-ai-interview.md`, `docs/SESSION-HANDOFF.md`, requirements/traceability, and the selected M05 design/plan. Git/code/current exact-SHA CI outrank stale Markdown.

Exact next work: begin M05.9 with strict RED-first tests for pure pacing/time-budget behavior: monotonic elapsed-time handling, resistance to backwards/discontinuous wall-clock input, suppression of optional follow-ups near the deadline, graceful completion, and explicit separation of infrastructure downtime from candidate speaking time where authoritative state permits.
