# Known Issues

Only unresolved or materially relevant issues belong here. Actual Git/code/current exact-SHA CI outrank stale historical text.

## Current unresolved issues

### M05 realtime provider selection

Classification: **External product/integration dependency / not a correctness defect**.

Provider-neutral session authorization, authoritative attempt persistence, diagnostics, capture/playback, transport interfaces, deterministic orchestration, pacing, follow-up policy, recovery, same-attempt reconnect state, and a real production realtime-session endpoint are implemented and verified. The production endpoint intentionally fails closed with constant-safe provider unavailability while no provider is configured.

The repository still contains no authoritative realtime provider selection, provider SDK/configuration, or production credential-minting contract. Do not invent a vendor merely to mark M05 complete.

This blocks provider-specific production credential issuance, provider adapter composition, live interview-page transport wiring, provider-backed reconnect/interruption integration, and the M05 live stable multi-turn browser exit criterion.

### M05 full live realtime E2E closeout

Classification: **Blocked milestone acceptance work**.

M05.14 requires a candidate to complete a stable multi-turn live voice interview and browser coverage around provider interruption/recovery. Current provider-neutral browser coverage verifies candidate-page microphone denial/recovery, keyboard focus, microphone selection, mobile no-overflow, no recording during readiness checks, and the production endpoint's constant-safe/no-secret behavior. Candidate invitation browser E2E already covers invalid, expired, revoked, and completed invitation safety.

Unit/component/provider-neutral tests already cover mute/end controls, barge-in, timeout/error handling, reconnect bounds, deterministic plan progression, and persistence. Creating a fake production transport/page merely to exercise those states in browser tests would fabricate live integration evidence. PR #7 must remain draft/unmerged while the stable live-provider exit criterion is open.

### External CI maintenance notices

Classification: **Informational / external maintenance**.

GitHub-hosted CI reports Node runtime deprecation notices from third-party actions and some transitive packages. Current required CI passes; these notices are not an application correctness blocker. Address them only through normal dependency/action maintenance without weakening gates.

## Recently resolved M05 issues

- Missing production realtime-session route — **resolved in provider-neutral scope**. RED `e5a38034fbb35203e47a97fa2491cca5142b116b`, CI #687 / `34765320016`, failed because `./route` did not exist. GREEN `cf37ffadcea1bab410e32d89060df22138af4324`, CI #688 / `34765378818`, added the minimal fail-closed endpoint. Browser/API integration `db86e81fa19af2daf2c830c0b5cb0082fd118fd9`, CI #689 / `34765662964`, verifies constant-safe `503`, no raw capability echo, and no credential exposure.
- Browser compatibility/microphone diagnostics are verified, including offline behavior, selected-device handling, usable input readiness, accessibility, and candidate-page integration.
- Progress checkpoint authority comes from the persisted attempt rather than caller-supplied interviewer-version input. Reviewed GREEN: `576d5dbad4138b85876eeac22ddfe8e7247381ce`, CI #669 / `34732650018`.
- Runtime question progression waits for authoritative persistence and consumes the returned checkpoint. RED: `f3b01a0e1f3f9ca17cf5058aea73816f6e639d49`, CI #671 / `34732962547`.
- Malformed authoritative checkpoints fail closed without rejecting the session or advancing local plan state. Review RED: `a0fcda2590020b4bd574dcd342a3aec308e34300`, CI #673 / `34733342412`; reviewed GREEN: `5e9328d2f945cd10eaecea312896f29fbc93b10e`, CI #674 / `34733465242`.

## Review blockers

No unresolved Critical or Important review finding is currently known for the implemented provider-neutral M05 slices through behavioral/browser head `db86e81f…`. PR #7 had no unresolved review threads at the latest recovery.

## Merge gate

PR #7 remains OPEN / DRAFT and must not merge while the authoritative provider dependency and live stable multi-turn M05 exit criterion remain unresolved. Merge only after all M05 acceptance criteria, provider/browser E2E, reviews, durable traceability, exact-final-head CI, concurrency checks, and repository protection requirements satisfy the owner's authorized auto-merge gates.
