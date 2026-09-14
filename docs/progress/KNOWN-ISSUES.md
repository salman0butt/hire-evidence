# Known Issues

Only unresolved or materially relevant issues belong here. Actual Git/code/current exact-SHA CI outrank stale historical text.

## Current unresolved issues

### M05 production candidate-page realtime composition

Classification: **Active milestone integration work / not a provider-selection blocker**.

Gemini Live is now the implemented production provider boundary. The branch contains constrained Gemini Live ephemeral credential issuance, a provider-isolated Gemini transport adapter, production session composition, and a production realtime-session route. Exact branch head `56c78425f7052b2e54ac9cfea410a57c53aef805` passed CI #713 / `34832502815` before the latest documentation reconciliation.

The remaining integration gap is candidate-browser composition: the public interview page still renders readiness and consent but does not yet start the authorized realtime session, create the Gemini transport behind the app-owned transport interface, or connect capture/playback/orchestrator controls.

This blocks provider-backed multi-turn browser completion, interruption/recovery/reconnect acceptance, and final M05 closeout. Implementation must preserve consent gating, authoritative attempt continuity, raw-capability secrecy, server-only long-lived provider credentials, and deterministic plan authority.

### M05 full live realtime E2E closeout

Classification: **Incomplete milestone acceptance work**.

M05.14 requires a stable multi-turn live voice interview plus browser coverage for microphone denial/recovery, mute/end controls, barge-in, provider interruption, timeout, bounded reconnect, mobile/no-overflow, keyboard/status semantics, and unavailable/revoked/completed invitation safety.

Existing browser coverage already verifies candidate-page microphone denial/recovery, keyboard focus, microphone selection, mobile no-overflow, no recording during readiness checks, and safe production endpoint behavior. Provider-neutral unit/component coverage already covers mute/end controls, barge-in, timeout/error handling, reconnect bounds, deterministic plan progression, and persistence.

Do not treat provider-neutral coverage as proof of live Gemini browser integration. PR #7 remains draft/unmerged until production browser composition and the required stable live-provider exit criterion are genuinely verified.

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
- Production realtime route provider wiring — **resolved in implementation** through `791b192fbe39a526ee478996ac16b69eaa295f84` → `a0934f76ed5583059c1976766eec1b8a99191b7b` with follow-up schema/adapter fixes through exact-head GREEN `56c78425f7052b2e54ac9cfea410a57c53aef805`, CI #713 / `34832502815`.
- Browser compatibility/microphone diagnostics are verified, including offline behavior, selected-device handling, usable input readiness, accessibility, and candidate-page integration.
- Progress checkpoint authority comes from the persisted attempt rather than caller-supplied interviewer-version input. Reviewed GREEN: `576d5dbad4138b85876eeac22ddfe8e7247381ce`, CI #669 / `34732650018`.
- Runtime question progression waits for authoritative persistence and consumes the returned checkpoint. RED: `f3b01a0e1f3f9ca17cf5058aea73816f6e639d49`, CI #671 / `34732962547`.
- Malformed authoritative checkpoints fail closed without rejecting the session or advancing local plan state. Review RED: `a0fcda2590020b4bd574dcd342a3aec308e34300`, CI #673 / `34733342412`; reviewed GREEN: `5e9328d2f945cd10eaecea312896f29fbc93b10e`, CI #674 / `34733465242`.

## Review blockers

No unresolved Critical or Important review finding is currently known for the implemented M05 slices. PR #7 had no unresolved review threads at the latest recovery.

## Merge gate

PR #7 remains OPEN / DRAFT and must not merge while production candidate-page realtime composition and stable provider-backed multi-turn M05 acceptance remain incomplete. Merge only after all M05 acceptance criteria, live provider/browser E2E, reviews, durable traceability, exact-final-head CI, concurrency checks, and repository protection requirements satisfy the owner's authorized auto-merge gates.
