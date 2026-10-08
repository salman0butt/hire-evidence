# Known Issues

Reconciled 2026-10-08. Current Git/code/exact-SHA CI outrank historical notes.

## Current unresolved issues

### M11.3 external provider/deployment boundary
**Repository deletion workflow is verified; deployment-specific external retention remains an operator concern.** Internal candidate-linked erasure/rollback/provider-session-resumption boundaries passed full CI #1118. Do not claim deletion of provider-side data or deployment-wide zero retention without separate operator evidence.

### Runtime provider configuration / live deployment smoke
**Deployment configuration, not a repository implementation blocker.** Real Gemini browser smoke requires owner-supplied credentials; never claim external smoke without execution. Project/account-level provider logging or retention settings are deployment-owner responsibilities and should be verified operationally when required.

### M11.6 contractual SLA target
**No contractual customer SLA percentage is specified by the PRD; M11.6 repository work is VERIFIED.** Service-level measurement intentionally reports observed counts/rates without inventing a business commitment. A future explicit product/runtime target may be added only from durable requirements evidence.

### M11.7 historical domain RED evidence gap
**Evidence-history limitation, not a current functional failure.** CI #1193–#1195 failed TypeScript before the intended domain behavior ran; #1196 was GREEN. Do not claim those attempts as genuine RED. Persisted support-access and lifetime enforcement have genuine database RED→GREEN evidence (#1197, #1204 → #1202/#1205/#1206). Continue new M11.7 behavior with strict genuine RED→GREEN.

### External CI maintenance notices
**Informational.** Do not weaken required quality gates.

## Review and merge
PR #13 remains OPEN/DRAFT. M11.1–M11.6 are VERIFIED. M11.7 is ACTIVE: least-privilege domain/persistence/lifetime safeguards are verified through exact-head CI #1206 at `32d54c5f5b4067b3fb2de5d9c717997d01f404b5`; audited grant/revoke lifecycle and access-review projection remain. 0 known Critical findings and 0 known Important findings at that verified head. M11.8 remains a conditional decision gate. Milestone auto-merge is authorized only after all actual completion, safety, independent review, docs, concurrency and exact-final-head CI gates are satisfied.