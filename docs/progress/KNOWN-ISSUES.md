# Known Issues

Reconciled 2026-10-09. Current Git/code/exact-SHA CI outrank historical notes.

## Current unresolved issues

### M11.3 external provider/deployment boundary
**Repository deletion workflow is verified; deployment-specific external retention remains an operator concern.** Internal candidate-linked erasure/rollback/provider-session-resumption boundaries passed full CI #1118. Do not claim deletion of provider-side data or deployment-wide zero retention without separate operator evidence.

### Runtime provider configuration / live deployment smoke
**Deployment configuration, not a repository implementation blocker.** Real Gemini browser smoke requires owner-supplied credentials; never claim external smoke without execution. Project/account-level provider logging or retention settings are deployment-owner responsibilities and should be verified operationally when required.

### M11.6 contractual SLA target
**No contractual customer SLA percentage is specified by the PRD; M11.6 repository work is VERIFIED.** Service-level measurement reports observed counts/rates without inventing a business commitment.

### M11.7 historical domain RED evidence gap
**Evidence-history limitation, not a functional failure.** CI #1193–#1195 failed TypeScript before intended domain behavior; #1196 was GREEN. Do not claim those attempts as genuine RED. Subsequent persistence, lifetime, grant, revoke and access-review work has genuine database RED→GREEN evidence, with invalid/superseded checkpoints explicitly recorded.

### External CI maintenance notices
**Informational.** Existing Node/action deprecation and upstream Supabase CLI notices do not justify weakening required quality gates.

## M11.8 conditional SSO/SAML decision
**Resolved DEFERRED, not blocked.** The authoritative M11 source says SSO/SAML is a potential conditional enterprise item “if required.” No durable repository/customer requirement currently requires it, so speculative implementation would violate YAGNI and the milestone plan. Reopen only when durable product/market evidence requires it.

## Review and merge
M11.1–M11.7 are VERIFIED; M11.8 is resolved DEFERRED. Verified M11.7 implementation head `7d0ec19b81a3ba897e0df03ffe3b01ebbff6c13e` passed full exact-head CI #1223 with 0 known Critical/Important findings, 0 submitted PR reviews and 0 unresolved inline review threads at recovery. PR #13 remains subject to the live final-head CI, concurrency, review/thread, mergeability and safety gates before authorized merge.