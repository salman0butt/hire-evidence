# Current Milestone

Milestone:
Realtime AI Interview

Legacy roadmap identifier:
M05

Status:
ACTIVE

Branch:
`feat/realtime-ai-interview`

Base:
`main` at verified M04 merge SHA `943e8a5c1dd45dc1652453ddf8ebc4ae31951925`

PR:
#7 — `Build realtime AI interview` — OPEN / DRAFT / unmerged. Reuse this PR for M05; do not create a duplicate.

Canonical compact recovery state:
`docs/progress/STATUS.md`

## Iterations

1. M05.1 — Reference characterization — **VERIFIED**.
2. M05.2 — Session authorization/provider boundary — **ACTIVE / PARTIALLY VERIFIED**; provider-neutral authorization/persistence/token lifetime boundaries exist, while provider-specific credential issuance remains blocked on authoritative provider selection.
3. M05.3 — Browser compatibility + microphone diagnostics — **VERIFIED**. Capability/network/permission/input diagnostics, explicit acquisition/cleanup, privacy-preserving audio-input enumeration and selection, usable input-level readiness, accessible recovery UI, candidate-page integration, keyboard-focus semantics, and narrow-viewport/no-overflow browser coverage are present.
4. M05.4 — Deterministic Web Audio capture — **VERIFIED**. Selected mono input acquisition, AudioWorklet PCM flow, mute, generation-scoped stale callback rejection, idempotent cleanup, one-time resource release, and input-level reset are covered.
5. M05.5 — Provider-neutral realtime transport — **ACTIVE / NEXT**. Implement the app-owned transport interface and deterministic fake transport first. Provider adapter creation remains blocked until authoritative provider requirements exist.
6. M05.6 — AI audio playback — **NOT STARTED**.
7. M05.7 — Connection state machine — **NOT STARTED**.
8. M05.8 — Interview-plan execution — **NOT STARTED**.
9. M05.9 — Pacing/time budget — **NOT STARTED**.
10. M05.10 — Bounded follow-ups — **NOT STARTED**.
11. M05.11 — Barge-in/orchestration — **NOT STARTED**.
12. M05.12 — Timeout/error handling — **NOT STARTED**.
13. M05.13 — Same-attempt reconnect — **NOT STARTED**.
14. M05.14 — Full realtime E2E and closeout — **NOT STARTED**.

## Latest Verification

M04 PR #6 was squash-merged to `main` as `943e8a5c1dd45dc1652453ddf8ebc4ae31951925`; post-merge CI #517 / `34692492691` passed the complete repository gate.

M05 behavioral head `9982d75f02fb6911162d60cec98581441ecf704b` passed CI #603 / `34710723994`: frozen dependencies, lint, typecheck, unit/component tests, framework/source verifiers, local Supabase reset/migrations, production build, Chromium E2E, PRD coverage, and cleanup all GREEN.

Task 4 cleanup RED was `7b39f6be82982bc6b1e9f677d8b1c640ef06058e`, CI #600 / `34710078998`; it failed on the intended input-level reset assertion after lint/typecheck passed. The earlier `cae05ed76eca9547863087aa0ee9e4721c0a59c4`, CI #599 / `34710015886`, was NOT RED because a test-harness typing error prevented the behavioral assertion from running. GREEN implementation reached `4b5260bc1dfd4b4e726784d306562e60b12b814c`, CI #601 / `34710176595`, then coverage/keyboard closeout reached `9982d75…`, CI #603 GREEN.

## Review State

- Unresolved Critical findings: **0** for implemented M05 slices.
- Unresolved Important findings: **0** for implemented M05 slices.
- PR #7 had no unresolved review threads at the latest recovery check.
- Review of the Task 4 delta found no safety/evidence-boundary regression: stale callbacks are generation-gated, muted capture does not emit PCM, cleanup remains idempotent, and technical failures remain technical rather than candidate evidence.

## Current Evidence

- M05.3 selected-input GREEN: `2708322cd406eb3e2877295bfe25f495cff422c5`, CI #563 / `34701331592`.
- M05.3 current device-selection/input-level/keyboard behavior is present at `9982d75f02fb6911162d60cec98581441ecf704b`, CI #603 / `34710723994` GREEN; existing candidate E2E verifies 390px no-horizontal-overflow behavior.
- M05.4 invalid NOT RED: `cae05ed76eca9547863087aa0ee9e4721c0a59c4`, CI #599 / `34710015886` — test type mismatch.
- M05.4 RED: `7b39f6be82982bc6b1e9f677d8b1c640ef06058e`, CI #600 / `34710078998` — intended level-reset assertion failure.
- M05.4 GREEN: `4b5260bc1dfd4b4e726784d306562e60b12b814c`, CI #601 / `34710176595` — complete repository gate GREEN.
- M05.4 regression coverage: `3cb6776411e345bb1f7bf8ccc078f23cac6ea389`, CI #602 / `34710451680` — mute/stale/idempotent cleanup coverage, complete repository gate GREEN.
- M05.3 keyboard closeout: `9982d75f02fb6911162d60cec98581441ecf704b`, CI #603 / `34710723994` — complete repository gate GREEN.

## Next Action

Begin M05.5 with strict TDD for the provider-neutral transport lifecycle: define normalized events and technical errors, prove send-before-open/send-after-close rejection, stale callback rejection, safe/idempotent disconnect, and a deterministic fake transport for later orchestration tests. Do not invent a provider adapter until authoritative provider selection/configuration exists.
