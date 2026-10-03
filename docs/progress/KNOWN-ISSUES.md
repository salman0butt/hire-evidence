# Known Issues

Reconciled 2026-09-30. Current Git/code/exact-SHA CI outrank historical notes.

## Current unresolved issues

### M11.3 external provider/deployment boundary
**Repository deletion workflow is verified; deployment-specific external retention remains an operator concern.** The internal SQL artifact chain, including consent, invitations, interview attempts/triggers, transcript, technical events, assessment/evidence/provenance, human overrides and reviewer notes, passed full CI #1110 at `be3b96a3d277668ffa95c61027c8b0626a1bb077`. The follow-up unexpected-FK fail-closed/rollback regression commit `fdd2f54e8e286ed64cb1c38581457c9ef1c88203` had CI #1111 cancelled, so #1111 is not standalone GREEN evidence. The same rollback coverage is present in the later implementation state verified by full CI #1118 at `dabe4721675395d421f023a46ca4b73ae56a82da`. Gemini Live session resumption was removed from application-controlled setup/token constraints before #1118. Do not claim deletion of provider-side data or deployment-wide zero retention without separate operator evidence.

### Durable status / documentation exact head
**Verified.** The current status reconciliation head `2d37c10c2b534fe48834de0cfacb77711e13dd41` passed exact-head CI #1119 / run `36608769171`.

### Runtime provider configuration / live deployment smoke
**Deployment configuration, not a repository implementation blocker.** Real Gemini browser smoke requires owner-supplied credentials; never claim external smoke without execution. Project/account-level provider logging or retention settings are deployment-owner responsibilities and should be verified operationally when required.

### External CI maintenance notices
**Informational.** Do not weaken required quality gates.

## Review and merge
PR #13 remains OPEN/DRAFT; 0 submitted reviews and 0 unresolved threads at latest recovery. M11.4–M11.7 remain incomplete. Milestone auto-merge is authorized only after all actual completion, safety, independent review, docs, concurrency, and exact-final-head CI gates are satisfied.
