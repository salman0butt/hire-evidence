# Known Issues

Only unresolved or materially relevant issues belong here. Actual Git/code/current exact-SHA CI outrank stale historical text.

## Current unresolved issues

### M05 realtime provider selection

Classification: **External product/integration dependency / not a correctness defect**.

Provider-neutral session authorization, authoritative attempt persistence, diagnostics, capture/playback, transport interfaces, deterministic orchestration, pacing, follow-up policy, recovery, and same-attempt reconnect state are implemented and verified. The repository still contains no authoritative realtime provider selection, provider SDK/configuration, or production credential-minting contract. Do not invent a vendor merely to mark M05 complete.

This blocks provider-specific production credential issuance, provider adapter composition, live interview-page wiring, provider-backed reconnect/integration tests, and the M05 live stable multi-turn browser exit criterion. It does not block deterministic provider-neutral verification or documentation/traceability work.

### M05 full live realtime E2E closeout

Classification: **Blocked milestone acceptance work**.

M05.14 requires a candidate to complete a stable multi-turn live voice interview and requires browser scenarios around provider interruption/recovery. Existing repository E2E remains green, but the live realtime flow cannot be honestly wired or verified until the provider dependency above is resolved. PR #7 must remain draft/unmerged while this exit criterion is open.

### External CI maintenance notices

Classification: **Informational / external maintenance**.

GitHub-hosted CI reports Node runtime deprecation notices from third-party actions and some transitive packages. Current required CI passes; these notices are not an application correctness blocker. Address them only through normal dependency/action maintenance without weakening gates.

## Recently resolved M05 issues

- Browser compatibility/microphone diagnostics are now verified, including offline behavior, selected-device handling, usable input readiness, accessibility, and candidate-page integration. The older M05.3 incomplete-diagnostics entry was stale and has been removed.
- Progress checkpoint authority now comes from the persisted attempt rather than caller-supplied interviewer-version input. Reviewed GREEN: `576d5dbad4138b85876eeac22ddfe8e7247381ce`, CI #669 / `34732650018`.
- Runtime question progression now waits for authoritative persistence and consumes the returned checkpoint. RED: `f3b01a0e1f3f9ca17cf5058aea73816f6e639d49`, CI #671 / `34732962547`.
- Malformed authoritative checkpoints now fail closed without rejecting the session or advancing local plan state. Review RED: `a0fcda2590020b4bd574dcd342a3aec308e34300`, CI #673 / `34733342412`; reviewed GREEN: `5e9328d2f945cd10eaecea312896f29fbc93b10e`, CI #674 / `34733465242`.

## Review blockers

No unresolved Critical or Important review finding is currently known for the implemented provider-neutral M05 slices through `5e9328d2…`. PR #7 had no unresolved review threads at the latest recovery.

## Merge gate

PR #7 remains OPEN / DRAFT and must not merge while the authoritative provider dependency and live stable multi-turn M05 exit criterion remain unresolved. Merge only after all M05 acceptance criteria, tests/E2E, reviews, durable traceability, exact-final-head CI, concurrency checks, and repository protection requirements satisfy the owner's authorized auto-merge gates.
