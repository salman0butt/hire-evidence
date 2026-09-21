# Known Issues

Actual Git/code/current exact-SHA CI outrank stale historical text.

## Current unresolved issues

### Runtime provider configuration / live deployment smoke
Classification: **Deployment configuration; not an M08 repository blocker**.
Real Gemini browser smoke requires owner-supplied `GEMINI_API_KEY` and remains tracked in `docs/LOCAL-REALTIME-ACCEPTANCE.md`. Repository CI must not claim this external smoke was executed.

### External CI maintenance notices
Classification: **Informational**.
Third-party GitHub Actions/package runtime deprecation notices may appear and should be handled through normal maintenance without weakening quality gates.

## M08 review blockers
No unresolved Critical or Important finding is known at the latest recovery. The M08.9 dashboard list/filter/sort acceptance gap was resolved under TDD: genuine RED `f027b05c…` / CI #1021; implementation `4ba2e1c9…`; assertion-scoping fix `a6320513…` passed CI #1024 / run `35626271990`.

## Merge gate
PR #10 remains draft/unmerged until the documentation-reconciliation head is exact-SHA GREEN and the final remote head, review/thread state, mergeability and safety gates are rechecked. The user has explicitly authorized autonomous milestone merge only when every gate is satisfied.
