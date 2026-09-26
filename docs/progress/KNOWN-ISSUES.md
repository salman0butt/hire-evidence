# Known Issues

Actual Git/code/current exact-SHA CI override stale historical status. Reconciled 2026-09-26.

## Current unresolved issues

### M11.3 candidate deletion persistence
**Required scope / milestone blocker.** Current TypeScript lifecycle at `b388936674db6d8f5dbeb945d93da37a6b5ba8db` does not erase persisted candidate data. Inventory candidate-linked rows and external artifacts; implement and test tenant-safe deletion, RLS, idempotence, retries, partial failure and integrity-preserving minimal audit tombstones. Do not claim domain-level state is actual erasure.

### CI #1103 recovery marker
**CI blocker under repair.** At head `b388936674db6d8f5dbeb945d93da37a6b5ba8db`, 753 unit/component tests passed but `scripts/verify_autonomous_framework.py` failed because STATUS lacked literal `CI status:`. This reconciliation fixes the missing marker; downstream database/build/E2E gates did not run. The new exact head needs full verification.

### Runtime provider configuration / live deployment smoke
**Deployment configuration, not current M11 repository blocker.** Real Gemini browser smoke needs owner-supplied `GEMINI_API_KEY`. Never claim external smoke passed without executing it.

### External CI maintenance notices
**Informational.** Treat package/Actions deprecation normally; do not weaken required quality gates.

## Review and merge
PR #13 remains OPEN/DRAFT; 0 review submissions and 0 unresolved threads at recovery. M11.3–M11.7 are incomplete. The owner permits milestone auto-merge only after all review, safety, documentation, concurrency and exact-final-head CI gates pass. Do not merge now.
