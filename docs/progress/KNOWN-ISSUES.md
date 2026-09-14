# Known Issues

Only unresolved or materially relevant issues belong here. Actual Git/code/current exact-SHA CI outrank stale historical text.

## Current unresolved issues

### M05 live-provider browser acceptance

Classification: **Incomplete milestone acceptance work**.

Production candidate-page realtime composition is implemented. The branch now contains constrained Gemini Live ephemeral credential issuance, a provider-isolated Gemini transport adapter, the production realtime-session and progress routes, browser runtime composition, and the candidate-facing launcher that authorizes the capability, starts the runtime, renders authoritative snapshots, and exposes candidate mute/end controls.

Exact behavioral head `95106d791b42220a53788bc058327182902cc99a` passed CI #745 / `34839902037` before the current documentation reconciliation.

The remaining gap is genuine live-provider browser acceptance: stable Gemini-backed multi-turn completion plus interruption/recovery, barge-in, timeout, and bounded same-attempt reconnect behavior. These paths must be verified without exposing long-lived credentials, raw invitation capabilities, or provider-specific internal details.

### M05 full live realtime E2E closeout

Classification: **Incomplete milestone acceptance work**.

M05.14 requires a stable multi-turn live voice interview plus browser coverage for microphone denial/recovery, mute/end controls, barge-in, provider interruption, timeout, bounded reconnect, mobile/no-overflow, keyboard/status semantics, and unavailable/revoked/completed invitation safety.

Existing browser coverage verifies candidate-page microphone denial/recovery, keyboard focus, microphone selection, mobile no-overflow, no recording during readiness checks, and constant-safe unavailable-provider behavior when `GEMINI_API_KEY` is absent. Unit/component/provider-neutral coverage covers mute/end controls, barge-in, timeout/error handling, reconnect bounds, deterministic plan progression, persistence, and production launcher composition.

Do not treat those layers as proof of successful live Gemini browser integration. PR #7 remains draft/unmerged until the required stable live-provider exit criterion, full review, durable closeout, and exact-final-head CI are genuinely satisfied.

### Runtime provider configuration

Classification: **Deployment configuration requirement**.

Provider-backed sessions require server-side `GEMINI_API_KEY`. Absence must continue to fail closed with a constant-safe response and must not expose configuration or raw invitation capability values. This is not a reason to invent client-side secrets or weaken authorization.

### External CI maintenance notices

Classification: **Informational / external maintenance**.

GitHub-hosted CI reports Node runtime deprecation notices from third-party actions and some transitive packages. Current required CI passes; these notices are not an application correctness blocker. Address them only through normal dependency/action maintenance without weakening gates.

## Recently resolved M05 issues

- Realtime provider selection / credential issuance — **resolved in implementation**. Gemini Live credential issuance was defined at `3c34ac746b3d075bb604c72f873ef03cf6cd0773` and implemented at `d1346253e3ad2f42f89c67b624b9452fd0a7b9f6`.
- Provider adapter — **resolved in implementation**. Gemini Live protocol RED was characterized in `8a381b3799724342da8a588af536c2c24d2b85b0` / `34e16c098ad409058c525f2052718e7e6a73497b`; adapter GREEN landed at `0b612411cb30eaf6a3130e6373cbc9ac213eebe7`.
- Production Gemini session composition — **resolved in implementation**. RED `7f9b2f6beb195c48a03595fceb191d0adc83aa3f` → GREEN `409a899ce000674b441bd0da2ff8a01d4efc62db`.
- Production realtime route provider wiring — **resolved in implementation** through `791b192fbe39a526ee478996ac16b69eaa295f84` → `a0934f76ed5583059c1976766eec1b8a99191b7b` with follow-up schema/adapter fixes through `56c78425f7052b2e54ac9cfea410a57c53aef805`.
- Production candidate-page composition — **resolved in implementation**. Browser runtime + launcher composition now obtains authorized session data, instantiates Gemini transport behind the provider-neutral boundary, wires capture/playback/runtime controls, forwards authoritative snapshots, and renders current interview state. Latest pre-doc exact-head GREEN: `95106d791b42220a53788bc058327182902cc99a`, CI #745 / `34839902037`.
- Capability-bound realtime progress persistence — **resolved in implementation** through the realtime progress route and server-authoritative attempt checkpoint semantics; checkpoint `ce161fbaa34450839ac8f323f6fcc3a33cdc4863` passed CI #728 / `34834823096`.
- Browser compatibility/microphone diagnostics are verified, including offline behavior, selected-device handling, usable input readiness, accessibility, and candidate-page integration.
- Runtime question progression waits for authoritative persistence and consumes the returned checkpoint; malformed/conflicting checkpoints fail closed rather than advancing local state.

## Review blockers

No unresolved Critical or Important review finding is currently known for the implemented M05 slices. PR #7 had no unresolved review threads at the latest recovery.

## Merge gate

PR #7 remains OPEN / DRAFT and must not merge while stable live-provider multi-turn browser acceptance and final M05 closeout remain incomplete. Merge only after all M05 acceptance criteria, live provider/browser E2E, reviews, durable traceability, exact-final-head CI, concurrency checks, and repository protection requirements satisfy the owner's authorized auto-merge gates.