# Known Issues

Only unresolved or materially relevant issues belong here. Actual Git/code/current exact-SHA CI outrank stale historical text.

## Current unresolved issues

### Runtime provider configuration / local live smoke

Classification: **Deployment configuration and acceptance requirement; not an M05 repository merge blocker**.

Provider-backed sessions require server-side `GEMINI_API_KEY`. Absence must continue to fail closed with a constant-safe response and must not expose configuration details, raw invitation capabilities, or provider credentials.

On 2026-09-14 the repository owner explicitly chose to provide the real Gemini credential locally and instructed autonomous development to complete repository-side M05 without waiting for an external live-provider run. Therefore the real Gemini browser smoke is documented in `docs/LOCAL-REALTIME-ACCEPTANCE.md` and is a local/deployment acceptance check.

The smoke has **not** been executed by repository CI and must never be described as executed evidence. If it later fails, treat that as a real defect and fix it before relying on that deployment for candidate interviews.

### External CI maintenance notices

Classification: **Informational / external maintenance**.

GitHub-hosted CI reports Node runtime deprecation notices from third-party actions and some transitive packages. These notices are not an application correctness blocker. Address them only through normal dependency/action maintenance without weakening gates.

## Resolved M05 issues

- Realtime provider selection / credential issuance — **resolved**. Gemini Live credential issuance is server-side and constrained.
- Provider adapter — **resolved**. Gemini Live protocol stays behind the app-owned provider-neutral transport boundary.
- Production Gemini session composition — **resolved**.
- Production realtime route provider wiring — **resolved**.
- Production candidate-page composition — **resolved**. Browser runtime + launcher composition obtains authorized session data, instantiates provider transport behind the app-owned boundary, wires capture/playback/runtime controls, forwards authoritative snapshots, and renders current interview state.
- Capability-bound realtime progress persistence — **resolved**. Progress remains tied to the authoritative invitation/attempt and database state.
- Deterministic production-browser reconnect — **resolved in repository acceptance**. Browser E2E proves disconnect causes reauthorization while preserving same-attempt state without displaying the ephemeral credential.
- Provider-interruption playback cancellation — **resolved**. RED `6d22bdf5e1b36a105f151cc6f8698c433854957b`, CI #772, proved `interrupted` did not stop playback; GREEN `d191b0d6414190c90956b8a964dbc0fbc26f330d`, CI #773, routes provider interruption through playback interruption.
- Browser compatibility/microphone diagnostics — **resolved** with deterministic browser coverage for offline behavior, selected-device handling, usable input readiness, accessibility, and candidate-page integration.
- Runtime question progression persistence authority — **resolved**. Progression waits for authoritative persistence and validates returned checkpoints; malformed/conflicting checkpoints fail closed.
- M05 live-provider merge blocker — **resolved by explicit owner acceptance decision**. Real-provider execution remains a local/deployment smoke and no fake live evidence is claimed.

## Review blockers

No unresolved Critical or Important review finding is currently known for M05 at latest recovery. PR #7 had no unresolved review threads at latest recovery.

## Merge gate

PR #7 may merge only after the current closeout head has exact-final-head GREEN CI, durable closeout/traceability is current, remote head has not changed unexpectedly, no blocking reviews exist, concurrency is safe, and GitHub reports the PR mergeable under repository policy.

The deferred real Gemini smoke does not satisfy or replace any of those repository gates and does not weaken safety, privacy, evidence-integrity, authorization, or human-review requirements.