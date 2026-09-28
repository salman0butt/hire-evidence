# Known Issues

Reconciled 2026-09-28. Current Git/code/exact-SHA CI outrank historical notes.

## Current unresolved issues

### M11.3 complete candidate erasure / external artifacts
**Milestone blocker; ACTIVE.** The internal SQL artifact chain, including consent, invitations, interview attempts/triggers, transcript, technical events, assessment/evidence/provenance, human overrides and reviewer notes, passed full CI #1110 at `be3b96a3d277668ffa95c61027c8b0626a1bb077`. A follow-up unexpected-FK fail-closed/rollback regression was added at `fdd2f54e8e286ed64cb1c38581457c9ef1c88203`, CI #1111 pending at reconciliation. Verify it and inspect applicability of any externally stored audio or provider/model traces; do not imply external deletion without evidence. Resolve retention or product-required integrity conflicts explicitly and fail closed.

### Durable status / documentation exact head
**Verification pending.** Historical CI #1103 marker failure was fixed by exact-head CI #1104. The present reconciliation replaces stale M08/M09/M11 status; verify its own exact-head CI.

### Runtime provider configuration / live deployment smoke
**Deployment configuration, not current M11 repository blocker.** Real Gemini browser smoke needs owner-supplied `GEMINI_API_KEY`; never claim external smoke without execution.

### External CI maintenance notices
**Informational.** Do not weaken required quality gates.

## Review and merge
PR #13 remains OPEN/DRAFT; 0 submitted reviews and 0 unresolved threads at recent recovery. M11.3–M11.7 remain incomplete. Milestone auto-merge is authorized only after all actual completion, safety, independent review, docs, concurrency, and exact-final-head CI gates are satisfied.
