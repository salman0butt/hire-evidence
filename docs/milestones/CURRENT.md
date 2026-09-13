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
2. M05.2 — Session authorization/provider boundary — **ACTIVE / PARTIALLY VERIFIED**. Provider-neutral authorization/persistence/token-lifetime boundaries plus the real production realtime-session endpoint are verified. Until a provider is authoritative, the endpoint intentionally returns constant-safe `503 { status: "unavailable" }`; provider-specific credential issuance remains blocked.
3. M05.3 — Browser compatibility + microphone diagnostics — **VERIFIED**.
4. M05.4 — Deterministic Web Audio capture — **VERIFIED**.
5. M05.5 — Provider-neutral realtime transport — **VERIFIED (provider-neutral scope)**; provider adapter remains blocked until provider selection is authoritative.
6. M05.6 — AI audio playback — **VERIFIED**.
7. M05.7 — Connection state machine + accessible controls — **VERIFIED**.
8. M05.8 — Deterministic interview-plan execution — **VERIFIED**.
9. M05.9 — Pacing/time budget — **VERIFIED**.
10. M05.10 — Bounded follow-ups — **VERIFIED**.
11. M05.11 — Realtime orchestration — **ACTIVE / PARTIALLY VERIFIED**; provider-neutral controller/presentation behavior is verified, live provider/page composition remains blocked.
12. M05.12 — Timeout/error handling — **VERIFIED (provider-neutral scope)**.
13. M05.13 — Same-attempt reconnect — **VERIFIED (provider-neutral scope)**. Authoritative resume/persistence state and runtime persistence gating are implemented; malformed/conflicting persistence fails closed. Provider-backed reconnect remains blocked by provider selection.
14. M05.14 — Full realtime E2E and closeout — **ACTIVE / PARTIALLY VERIFIED**. Candidate-page browser coverage proves microphone denial/retry recovery, keyboard focus, input enumeration/selection, mobile no-overflow, no recording during readiness checks, and the production realtime endpoint's fail-closed/no-secret behavior. Stable live multi-turn provider-backed completion remains blocked.

## Latest Verification

M04 PR #6 was squash-merged to `main` as `943e8a5c1dd45dc1652453ddf8ebc4ae31951925`; post-merge CI #517 / `34692492691` passed the complete repository gate.

Latest verified M05 behavioral/browser head `db86e81fa19af2daf2c830c0b5cb0082fd118fd9` passed CI #689 / `34765662964`: frozen dependencies, lint, typecheck, unit/component tests, framework/source verification, local Supabase, production build, Chromium E2E, PRD coverage, and cleanup all GREEN.

Latest route evidence:
- RED `e5a38034fbb35203e47a97fa2491cca5142b116b`, CI #687 / `34765320016` — intended TypeScript failure because `./route` did not exist.
- GREEN `cf37ffadcea1bab410e32d89060df22138af4324`, CI #688 / `34765378818` — minimal production fail-closed route; full repository gate GREEN.
- browser/API integration GREEN `db86e81fa19af2daf2c830c0b5cb0082fd118fd9`, CI #689 / `34765662964` — real candidate capability receives constant-safe provider-unavailable response and no raw token/credential leakage; complete repository gate GREEN.

Earlier browser readiness GREEN `1c4635618aa1d3471284ca30cfb8658981afdd94`, CI #682 / `34734661625`, and persistence reviewed GREEN `5e9328d2f945cd10eaecea312896f29fbc93b10e`, CI #674 / `34733465242`, remain valid historical evidence.

## Review State

- Unresolved Critical findings: **0** for implemented M05 slices.
- Unresolved Important findings: **0** for verified provider-neutral slices through the production-route/browser integration checkpoint.
- PR #7 has no unresolved review threads at the latest recovery check.
- Review of the new endpoint confirms it performs no authorization while provider configuration is absent, returns only constant-safe unavailability, and exposes no capability or provider credential.

## Blocker

No authoritative realtime provider SDK/configuration or production credential-minting contract has been selected. Do not invent one. This blocks provider credential issuance, provider adapter composition, live interview page/transport wiring, provider-backed reconnect/interruption recovery, and the final stable live multi-turn browser exit criterion.

All currently legitimate provider-neutral closeout work is covered: invitation lifecycle safety is already browser-tested, and mute/end, barge-in, timeout/error recovery, and bounded reconnect semantics are covered below the provider-integration boundary. Fake live composition would misrepresent production evidence.

## Next Action

When authoritative provider configuration becomes available, wire short-lived production credential issuance, implement the provider adapter and live candidate-page composition, verify provider-backed reconnect/interruption/error behavior, and complete stable multi-turn browser E2E. Keep PR #7 draft and unmerged until those gates pass.
