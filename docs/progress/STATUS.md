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
Latest verified behavioral head: `576d5dbad4138b85876eeac22ddfe8e7247381ce`.
CI status: CI #669 / `34732650018` passed the complete repository gate on `576d5dbad4138b85876eeac22ddfe8e7247381ce`: frozen install, lint, typecheck, unit/component tests, framework/source verifiers, local Supabase migration/startup, production build, Chromium E2E, PRD coverage, and cleanup.

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
- M05.9 Pacing/time budget — **VERIFIED**. Monotonic active-time accounting, backwards-clock resistance, infrastructure-downtime separation, optional-follow-up suppression near deadline, and graceful completion are implemented and exact-head verified.
- M05.10 Bounded follow-ups — **VERIFIED**. Only neutral job-related clarification/example/missing-dimension categories are allowed, configured limits are capped by an absolute ceiling, invalid/prohibited categories are denied, and candidate text cannot widen policy.
- M05.11 Realtime interview orchestration — **ACTIVE / PARTIALLY VERIFIED**. Provider-neutral deterministic multi-turn progression, app-owned turn completion, playback/barge-in routing, generation-scoped stale callback rejection, candidate-safe snapshot projection, and candidate-facing current-question/completion presentation are implemented. Production page/transport composition remains dependent on the provider-specific authorization/adapter blocker.
- M05.12 Timeout/error recovery — **VERIFIED (provider-neutral scope)**. Typed technical failures are classified into bounded retry or terminal candidate-safe outcomes; invitation/consent/authorization failures do not blindly retry; microphone/provider/timeout failures never mutate candidate evaluation.
- M05.13 Same-attempt reconnect — **ACTIVE / PARTIALLY VERIFIED**. Immutable-plan checkpoint restoration rejects version mismatch, impossible cursors, inflated follow-up state, and invented/future question state. The authoritative attempt now stores bounded resume state and idempotent processed event IDs. Capability-bound RPCs resume the same attempt and advance only the current published question. The progress RPC returns the server-authoritative interviewer version and the repository fails closed on malformed/conflicting state. Runtime-to-server progress persistence wiring remains the next provider-neutral unit.
- M05.14 Full realtime E2E / milestone closeout — **NOT STARTED**.

## TDD / Verification Evidence

Earlier M05.2–M05.11 evidence remains in `docs/milestones/M05-realtime-ai-interview.md` and Git history.

- M05.9 RED: `26d81a7377050dd1f2d37b211c3712c583c987c1`, CI #629 / `34722836765` — pacing contract tests failed before the pacing module existed.
- M05.9 GREEN: `b0449897d484e7fe0b7a3a463d956d8c6ab1aeed`, CI #630 / `34722921808` — complete repository gate GREEN.
- M05.10 RED: `e7bff68b96bd493a2e93f5be32b74c000ea7aa49`, CI #631 / `34723178316` — bounded follow-up contract failed before policy implementation.
- M05.10 GREEN: `3dc9844f812db0b830f0e86d522eb7825e26779c`, CI #632 / `34723229777` — complete repository gate GREEN.
- M05.11 orchestration RED: `a49e2bc113f70caca58d5c44ddeaed66c2e67ad6`, CI #633 / `34723516805`.
- M05.11 orchestration GREEN: `b5364a9e72175e80a75bc63e200b8a38ccfdd7f2`, CI #634 / `34723587460`.
- M05.11 stale-completion RED: `9bf0423351dec74d8a4ffb32397116647b0c5809`, CI #635 / `34723861306`.
- M05.11 stale-completion GREEN: `d50275653d3e64532bdda22aafddfcd02db53504`, CI #636 / `34723913764`.
- M05.11 presentation RED: `ba1378e27954ca25c5d3895955d8128284d02d14`, CI #637 / `34724213415` — typecheck failed on the intentionally missing realtime interview presentation component.
- M05.11 invalid NOT GREEN: `2f32c3e53efa1748493129694b11e8b0c0e67c28`, CI #638 / `34724353167` — exact optional prop typing failed before behavioral verification.
- M05.11 invalid NOT GREEN: `c86300d4b13fed47d4cbd21d8f99950eab543600`, CI #639 / `34724392853` — unit verification exposed competing completion/end live-status announcements.
- M05.11 reviewed GREEN: `db5d814321d869f53b57af3238941cc19cda0afe`, CI #640 / `34724476662` — full repository gate GREEN after terminal completion was reduced to one authoritative announcement and obsolete controls were removed.
- M05.13 authoritative progress repository RED: `87406dc5d0186d5f28f3b8d5cdd5f19c9f50b2b1`, CI #665 / `34732181229` — typecheck failed because the progress persistence repository boundary did not exist.
- M05.13 initial progress GREEN: `41d35ab89d24ef8b093c37c47a1dc8261f3285d1`, CI #666 / `34732252665` — complete repository gate GREEN for capability-bound authoritative progress persistence.
- M05.13 review RED: `a2cf5eb633751d58cfcf3e3fb0b2e657504cc00a`, CI #667 / `34732505070` — regression test proved the repository incorrectly trusted a caller-supplied interviewer version instead of the authoritative attempt version.
- M05.13 reviewed GREEN: `576d5dbad4138b85876eeac22ddfe8e7247381ce`, CI #669 / `34732650018` — the progress RPC returns the attempt's authoritative interviewer version and the repository uses it; the complete repository gate passed.

## Review State

Critical findings: **0 unresolved** for implemented M05 slices.
Important findings: **0 unresolved** for the verified provider-neutral slices at `576d5dba…`.
PR #7 had no unresolved review threads at the latest recovery.

Latest Important finding resolved: progress checkpoint authority must come from the persisted attempt rather than browser/session input. Exact RED `a2cf5eb…` reproduced the trust-boundary defect; reviewed GREEN `576d5dba…` fixes it in the database RPC and repository boundary.

## Blockers / Constraints

- Provider-specific production credential issuance, provider adapter composition, and final live page wiring remain blocked until an authoritative realtime provider is selected/configured.
- This does not block provider-neutral same-attempt persistence wiring, reconnect handling, or deterministic E2E scaffolding.

## Durable Recovery

Recover actual Git/PR/CI first, then read `AGENTS.md`, `CODEX-START-HERE.md`, `docs/AUTONOMOUS-DEVELOPMENT.md`, this file, `docs/progress/KNOWN-ISSUES.md`, `docs/milestones/CURRENT.md`, `docs/milestones/M05-realtime-ai-interview.md`, `docs/SESSION-HANDOFF.md`, requirements/traceability, and the selected M05 design/plan. Git/code/current exact-SHA CI outrank stale Markdown.

Exact next work: continue M05.13 with strict RED-first coverage that wires successful in-memory turn advancement to the capability-bound authoritative progress persistence boundary, preserves idempotent event identity, consumes the returned server checkpoint, and fails closed on persistence conflicts without fabricating candidate evidence.
