# Current Milestone

Milestone:
Realtime AI Interview

Legacy roadmap identifier:
M05

Status:
CLOSEOUT / MERGE GATE

Branch:
`feat/realtime-ai-interview`

Base:
`main` at verified M04 merge SHA `943e8a5c1dd45dc1652453ddf8ebc4ae31951925`

PR:
#7 — `Build realtime AI interview` — OPEN / DRAFT until the final exact-head closeout gate is green. Reuse this PR; do not create a duplicate.

Canonical compact recovery state:
`docs/progress/STATUS.md`

## Iterations

1. M05.1 — Reference characterization — **VERIFIED**.
2. M05.2 — Session authorization/provider boundary — **VERIFIED**. Authoritative attempt binding, consent/version gating, constrained Gemini Live ephemeral credential issuance, production realtime-session endpoint, and capability-bound realtime-progress endpoint are implemented. Long-lived `GEMINI_API_KEY` remains server-only and missing configuration fails closed.
3. M05.3 — Browser compatibility + microphone diagnostics — **VERIFIED**.
4. M05.4 — Deterministic Web Audio capture — **VERIFIED**.
5. M05.5 — Provider-neutral realtime transport — **VERIFIED (REPOSITORY SCOPE)**. The provider-neutral boundary and Gemini Live adapter are isolated behind the app-owned transport interface.
6. M05.6 — AI audio playback — **VERIFIED**. Provider interruption and candidate-speech barge-in both interrupt obsolete playback.
7. M05.7 — Connection state machine + accessible controls — **VERIFIED**.
8. M05.8 — Deterministic interview-plan execution — **VERIFIED**.
9. M05.9 — Pacing/time budget — **VERIFIED**.
10. M05.10 — Bounded follow-ups — **VERIFIED**.
11. M05.11 — Realtime orchestration — **VERIFIED (REPOSITORY SCOPE)**. Production browser runtime composition, capability authorization, authoritative snapshots, capture/playback/Gemini transport, mute/end controls, and interruption handling are covered by deterministic repository tests.
12. M05.12 — Timeout/error handling — **VERIFIED**.
13. M05.13 — Same-attempt reconnect — **VERIFIED**. Server-authoritative checkpoints, idempotent processed event IDs, capability-bound progress persistence, immutable-plan restoration, stale-generation rejection, persistence gating, and deterministic production-browser disconnect→reauthorize reconnect are covered.
14. M05.14 — Full realtime E2E and closeout — **REPOSITORY ACCEPTANCE COMPLETE / FINAL CI PENDING**. Deterministic browser acceptance covers production launcher/runtime composition, short-lived credential non-display, same-attempt reconnect, mute/end controls, readiness/accessibility, mobile layout, safe unavailable-provider behavior, and relevant realtime failure paths.

## Owner-Approved Live Provider Deferral

On 2026-09-14 the repository owner explicitly chose to provide real Gemini credentials locally and instructed autonomous development to complete the repository without blocking on that external credential.

This changes the acceptance classification, not the facts:

- no live Gemini-backed browser run is claimed;
- deterministic repository acceptance remains the M05 merge gate;
- the real-provider smoke is a local/deployment acceptance check documented in `docs/LOCAL-REALTIME-ACCEPTANCE.md`;
- any failure found by that future smoke is a real defect and must be fixed before relying on that deployment;
- long-lived provider secrets remain server-only and all safety/privacy/evidence-integrity boundaries remain unchanged.

## Latest Verification

M04 PR #6 was squash-merged to `main` as `943e8a5c1dd45dc1652453ddf8ebc4ae31951925`; post-merge CI #517 / `34692492691` passed the complete repository gate.

Provider-interruption TDD RED: `6d22bdf5e1b36a105f151cc6f8698c433854957b`, CI #772 / `34857082289` — expected failure because provider `interrupted` did not stop obsolete playback.

Provider-interruption GREEN: `d191b0d6414190c90956b8a964dbc0fbc26f330d`, CI #773 / `34857361292` — complete repository gate GREEN after the minimal interruption fix.

Pre-closeout documentation head `5c8710559ab1c40073843cb9a7909e626d8a0dc3` passed CI #781 / `34860464517` — complete repository gate GREEN.

The current closeout documentation head must receive fresh exact-head CI before PR #7 can merge.

## Review State

- Unresolved Critical findings: **0** at latest recovery.
- Unresolved Important findings: **0** at latest recovery.
- PR #7 has no known unresolved blocking review threads at latest recovery.
- Final merge still requires exact-final-head CI, concurrency/head recheck, mergeability, and repository protection checks.

## Constraints

- `GEMINI_API_KEY` is required at runtime for provider-backed sessions; absence must continue to fail closed without leaking configuration details.
- Do not regress capability authorization, provider isolation, authoritative attempt continuity, cleanup, consent, safety, privacy, evidence integrity, or human-review boundaries.
- Do not describe the deferred local live-provider smoke as executed evidence.

## Next Action

Reconcile M05 ledger/status/known issues/traceability/handoff to the owner-approved acceptance decision, perform final skeptical review, verify the exact final PR head with the complete CI gate, then execute the authorized M05 auto-merge if every remaining gate passes. After merge, verify `main`, activate M06, and continue.