# Known Issues

Reconciled 2026-10-06. Current Git/code/exact-SHA CI outrank historical notes.

## Current unresolved issues

### M11.3 external provider/deployment boundary
**Repository deletion workflow is verified; deployment-specific external retention remains an operator concern.** Internal candidate-linked erasure/rollback/provider-session-resumption boundaries passed full CI #1118. Do not claim deletion of provider-side data or deployment-wide zero retention without separate operator evidence.

### Runtime provider configuration / live deployment smoke
**Deployment configuration, not a repository implementation blocker.** Real Gemini browser smoke requires owner-supplied credentials; never claim external smoke without execution. Project/account-level provider logging or retention settings are deployment-owner responsibilities and should be verified operationally when required.

### M11.6 contractual SLA target
**No contractual customer SLA percentage is specified by the PRD.** M11.6 must implement measurable service-level/incident monitoring without fabricating a business commitment. A threshold/target may be supplied as explicit runtime/product configuration in future work, but repository code must not present an invented percentage as an agreed SLA.

### External CI maintenance notices
**Informational.** Do not weaken required quality gates.

## Review and merge
PR #13 remains OPEN/DRAFT. M11.1–M11.5 are VERIFIED. M11.6 has verified privacy-safe signal validation (#1176), bounded persistence/authorization (#1179), and incident-health projection (#1182), but SLA monitoring/closeout remains active. M11.7 is still planned and M11.8 remains a conditional decision gate. Milestone auto-merge is authorized only after all actual completion, safety, independent review, docs, concurrency and exact-final-head CI gates are satisfied.