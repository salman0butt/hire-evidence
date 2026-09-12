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
3. M05.3 — Browser compatibility + microphone diagnostics — **ACTIVE**; capability/network/permission/input diagnostics, accessible UI, page integration, explicit acquisition/cleanup, offline handling, and selected-device acquisition exist. Candidate device-selection UX, usable input-level readiness, and browser keyboard/narrow-viewport closeout remain.
4. M05.4 — Web Audio capture — **NOT STARTED**.
5. M05.5 — Realtime transport — **NOT STARTED**.
6. M05.6 — AI audio playback — **NOT STARTED**.
7. M05.7 — Connection state machine — **NOT STARTED**.
8. M05.8 — Interview-plan execution — **NOT STARTED**.
9. M05.9 — Pacing/time budget — **NOT STARTED**.
10. M05.10 — Bounded follow-ups — **NOT STARTED**.
11. M05.11 — Barge-in — **NOT STARTED**.
12. M05.12 — Timeout/error handling — **NOT STARTED**.
13. M05.13 — Reconnect — **NOT STARTED**.
14. M05.14 — Full realtime E2E — **NOT STARTED**.

## Latest Verification

M04 PR #6 was squash-merged to `main` as `943e8a5c1dd45dc1652453ddf8ebc4ae31951925`; post-merge CI #517 / `34692492691` passed the complete repository gate.

For M05.3, selected-device behavior reached exact behavioral head `2708322cd406eb3e2877295bfe25f495cff422c5`; CI #563 / `34701331592` passed frozen install, lint, typecheck, unit/component tests, repository verifiers, local Supabase reset, build, Chromium E2E, PRD coverage, and cleanup. Documentation reconciliation after that head requires fresh exact-head CI before a later readiness claim.

## Review State

- Unresolved Critical findings: **0** for implemented M05 slices.
- Unresolved Important findings: **0** for implemented M05 slices.
- PR #7 currently has no submitted reviews or unresolved review threads.
- M05 preserves invitation/consent/version authorization, server-only long-lived provider secrets, same-attempt reconnect, immutable plan authority, and the rule that technical failures never become negative candidate evidence.

## Current Evidence

- Network integration regression exposed at `5630cb89d69bf379bfc77dd77157c0b32405ef24`, CI #560 / `34700605728`.
- Network integration fix `019ac11a6a3575d11af96b579964ec206a6f7da0`, CI #561 / `34700935235` — GREEN.
- Selected-input RED `1ac380e3b1a32b30cb6623ed13f74297b6865a02`, CI #562 / `34701284392` — intended TS2554.
- Selected-input GREEN `2708322cd406eb3e2877295bfe25f495cff422c5`, CI #563 / `34701331592` — full repository gate GREEN.

## Next Action

Continue M05.3 with strict TDD: after explicit microphone access, enumerate only audio input devices, expose an accessible candidate-selected microphone control, and re-run readiness against the selected device without persisting audio or requesting microphone access implicitly. Then add usable input-level readiness and browser keyboard/narrow-viewport verification.
