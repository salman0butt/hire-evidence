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
2. M05.2 — Session authorization/provider boundary — **IMPLEMENTED / ACTIVE VERIFICATION**. Authoritative attempt binding, consent/version gating, short-lived credential constraints, Gemini Live ephemeral credential issuance, and the production realtime-session endpoint are implemented. Long-lived `GEMINI_API_KEY` remains server-only and missing configuration fails closed.
3. M05.3 — Browser compatibility + microphone diagnostics — **VERIFIED**.
4. M05.4 — Deterministic Web Audio capture — **VERIFIED**.
5. M05.5 — Provider-neutral realtime transport — **IMPLEMENTED / ACTIVE VERIFICATION**. The provider-neutral boundary is verified and a Gemini Live adapter exists behind it.
6. M05.6 — AI audio playback — **VERIFIED**.
7. M05.7 — Connection state machine + accessible controls — **VERIFIED**.
8. M05.8 — Deterministic interview-plan execution — **VERIFIED**.
9. M05.9 — Pacing/time budget — **VERIFIED**.
10. M05.10 — Bounded follow-ups — **VERIFIED**.
11. M05.11 — Realtime orchestration — **ACTIVE / PARTIALLY VERIFIED**. Provider-neutral multi-turn progression, barge-in, stale-callback rejection, safe candidate projection, and provider-neutral presentation are verified. Production candidate-page composition is not yet wired to the Gemini session/transport.
12. M05.12 — Timeout/error handling — **VERIFIED (provider-neutral scope)**.
13. M05.13 — Same-attempt reconnect — **VERIFIED (provider-neutral scope)**. Server-authoritative checkpoints, idempotent processed event IDs, capability-bound progress RPCs, immutable-plan restoration, stale-generation rejection, and persistence gating are verified. Gemini-backed browser reconnect still requires production composition/E2E.
14. M05.14 — Full realtime E2E and closeout — **ACTIVE / PARTIALLY VERIFIED**. Existing browser coverage proves readiness/accessibility/safe endpoint behavior. Stable Gemini-backed multi-turn completion, interruption/recovery, mute/end, barge-in, timeout, and reconnect acceptance remain open.

## Latest Verification

M04 PR #6 was squash-merged to `main` as `943e8a5c1dd45dc1652453ddf8ebc4ae31951925`; post-merge CI #517 / `34692492691` passed the complete repository gate.

Historical production integration checkpoint `56c78425f7052b2e54ac9cfea410a57c53aef805` passed CI #713 / `34832502815`.

Current exact PR head `ce161fbaa34450839ac8f323f6fcc3a33cdc4863` passed CI #728 / `34834823096` with conclusion `success`. That head adds the capability-bound realtime progress route after the server-authoritative progress/reconnect work.

## Review State

- Unresolved Critical findings: **0** at latest recovery.
- Unresolved Important findings: **0** at latest recovery.
- PR #7 has no unresolved review threads at latest recovery.
- PR remains draft because live browser composition and provider-backed browser acceptance are incomplete.

## Constraints

- `GEMINI_API_KEY` is required at runtime for provider-backed sessions; absence must fail closed without leaking configuration details.
- Candidate-page production orchestration is not yet connected to the realtime-session endpoint + Gemini transport adapter.
- Stable provider-backed multi-turn browser acceptance is incomplete; do not claim M05 complete or merge PR #7 until live composition, interruption/recovery/reconnect, accessibility, safety review, durable closeout, and exact-final-head CI are verified.
- Do not weaken consent, attempt continuity, tenant/capability binding, evidence integrity, or human-review boundaries to accelerate closeout.

## Next Action

TDD the production candidate-page composition that obtains an authorized realtime session, instantiates Gemini transport behind the provider-neutral boundary, connects capture/playback/orchestrator controls, and preserves consent/readiness/attempt-continuity safety. Then add provider-backed browser coverage for successful multi-turn completion and recovery paths. Keep PR #7 draft and unmerged until the full M05 closeout gates pass.
