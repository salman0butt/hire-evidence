# Known Issues

Only unresolved or materially relevant issues belong here. Actual Git/code/current exact-SHA CI outrank stale historical text.

## Current unresolved issues

### M05 realtime provider selection

Classification: **External product/integration dependency / not a correctness defect**.

M05.2 has provider-neutral authorization, authoritative attempt persistence, constant-safe route-handler behavior, and short-lived provider-token lifetime enforcement, but the repository currently contains no authoritative realtime provider selection, provider SDK/configuration, or production credential-minting contract. Do not invent a vendor merely to mark M05.2 complete. This blocks provider-specific production issuance/adapter composition but does not block independent browser diagnostics or provider-neutral realtime domain work explicitly permitted by the M05 plan.

### M05.3 diagnostics acceptance still incomplete

Classification: **Active milestone work**.

Browser/network/capability diagnostics, explicit microphone acquisition/cleanup, accessible recovery UI, candidate-page integration, offline fail-closed behavior, and selected-device acquisition support are implemented. Candidate-facing microphone enumeration/selection UX, usable input-level readiness, and browser keyboard/narrow-viewport closeout remain before M05.3 can be verified.

### External CI maintenance notices

Classification: **Informational / external maintenance**.

GitHub-hosted CI reports Node runtime deprecation notices from third-party actions and some transitive packages. Current required CI passes; these notices are not an application correctness blocker. Address them only through normal dependency/action maintenance without weakening gates.

## Recently resolved M05 issues

- `5630cb89d69bf379bfc77dd77157c0b32405ef24` / CI #560 (`34700605728`) failed typecheck because the newly added offline diagnostic reason had not been integrated into candidate UI copy and `collectRealtimeBrowserCapabilities` was called without `isOnline`. Root cause was stale UI integration, not test infrastructure.
- `019ac11a6a3575d11af96b579964ec206a6f7da0` / CI #561 (`34700935235`) added actionable offline copy plus `navigator.onLine`; the complete repository gate passed.
- `1ac380e3b1a32b30cb6623ed13f74297b6865a02` / CI #562 (`34701284392`) is a valid selected-device RED: typecheck failed exactly because `verifyRealtimeMicrophoneAccess` accepted only one argument.
- `2708322cd406eb3e2877295bfe25f495cff422c5` / CI #563 (`34701331592`) added the minimal selected-device constraint and passed the complete repository gate.

## Review blockers

No unresolved Critical or Important review finding is currently known for the implemented M05 slices. PR #7 had no submitted reviews or unresolved review threads at the last reconciliation.

## Merge gate

PR #7 remains OPEN / DRAFT because M05 is far from milestone-complete. Do not merge until all M05 acceptance criteria, tasks, required tests/E2E, reviews, durable traceability, exact-final-head CI, concurrency checks, and repository protection requirements satisfy the owner's authorized auto-merge gates.
