# Project Status

Last reconciled: 2026-09-29. Current Git/code/exact-SHA CI outrank these recovery notes.

## Completed Milestones
M00–M10 COMPLETE and integrated. M10 merge/main `54444d49761b7eb089c1c6a30a27fdfd115cdd9e`; post-merge CI #1084 GREEN.

## Current Milestone
M11 Enterprise Readiness — ACTIVE.
Active task: M11.4 safe organization branding — extend the existing organization settings flow with validated branding metadata and safe rendering. M11.3 repository deletion workflows are VERIFIED through full CI #1118; provider-side deletion or deployment-wide zero retention is not claimed.
Active branch: `feat/enterprise-readiness`.
Active PR: #13 OPEN / DRAFT; not merge eligible.
Main/base: `54444d49761b7eb089c1c6a30a27fdfd115cdd9e`.
M11.1 audit VERIFIED CI #1093. M11.2 retention VERIFIED CI #1099.
M11.3 first candidate-row GREEN `4050e110cd7845f371ebfe4027d75dacc8a2a166` CI #1106.
M11.3 artifact-chain RED `f3ec33f32f155b75cbfc996bcbee84d1b6eecbd1` CI #1107; expanded assessment-trigger RED `66fe1a7455915718c23846d363ddf6cf134afb14` CI #1109 (14/15 expected assertion failures).
M11.3 FK-ordered transactional deletion implementation `be3b96a3d277668ffa95c61027c8b0626a1bb077`: full exact-head CI #1110 / `36463309265` GREEN, including database, build, E2E and coverage.
M11.3 subsequent unexpected-FK atomic-rollback regression head `fdd2f54e8e286ed64cb1c38581457c9ef1c88203`: CI #1111 / `36464166029` was IN PROGRESS at reconciliation; recover its final outcome from GitHub, do not infer success.
CI status: full exact-head CI #1118 / run 36554834995 GREEN at `dabe4721675395d421f023a46ca4b73ae56a82da`, including lint, typecheck,  unit/component, framework, database boundary (including unexpected-FK rollback), build, E2E and PRD coverage. CI #1116 provided genuine RED for two Gemini session-resumption configuration tests; commits `3b419b8` and `dabe472` removed unused resumption from transport setup and ephemeral token constraints. Provider-side deletion and ZDR are not established.

## M11 Task State
- M11.1 immutable audit — VERIFIED.
- M11.2 retention configuration — VERIFIED.
- M11.3 deletion — VERIFIED; internal artifact chain, idempotency and unexpected-FK rollback are covered by full CI #1118; application-controlled Gemini Live session resumption removed. External provider settings remain deployment/operator evidence only.
- M11.4 organization branding — ACTIVE.
- M11.5 security hardening/rate limits/abuse — PLANNED.
- M11.6 observability/incident/SLA — PLANNED.
- M11.7 privileged support/access reviews — PLANNED.
- M11.8 SSO/SAML — CONDITIONAL DECISION GATE.

## Review / Safety
PR #13 had zero submitted reviews and zero unresolved inline threads at latest recovery. Independent review remains required for closeout. Preserve tenant RLS, immutable historical provenance up to explicit authorized erasure, minimum non-sensitive receipt/audit, privacy and sole human hiring authority. Do not merge incomplete M11.

## Known Issues
See `docs/progress/KNOWN-ISSUES.md`; real external Gemini browser smoke still depends on owner-supplied credentials and is not repository CI evidence.

Exact next work: establish M11.4 safe-branding RED for validated accent/logo/welcome metadata in the existing organization settings boundary, then implement the smallest GREEN without arbitrary CSS/HTML/script execution.
