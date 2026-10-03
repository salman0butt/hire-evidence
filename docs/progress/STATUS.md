# Project Status

Last reconciled: 2026-10-04. Current Git/code/exact-SHA CI outrank these recovery notes.

## Completed Milestones
M00–M10 COMPLETE and integrated. M10 merge/main `54444d49761b7eb089c1c6a30a27fdfd115cdd9e`; post-merge CI #1084 GREEN.

## Current Milestone
M11 Enterprise Readiness — ACTIVE.
Active task: M11.5 security hardening / rate limits / abuse controls — threat-model exposed routes and add the smallest server-authoritative bounded control with adversarial coverage. M11.4 safe organization branding is VERIFIED through full exact-head CI #1139 at `0c63e11f711114fbd7975cb66ade947077e2e61a`.
Active branch: `feat/enterprise-readiness`.
Active PR: #13 OPEN / DRAFT; not merge eligible.
Main/base: `54444d49761b7eb089c1c6a30a27fdfd115cdd9e`.
M11.1 audit VERIFIED CI #1093. M11.2 retention VERIFIED CI #1099.
M11.3 first candidate-row GREEN `4050e110cd7845f371ebfe4027d75dacc8a2a166` CI #1106.
M11.3 artifact-chain RED `f3ec33f32f155b75cbfc996bcbee84d1b6eecbd1` CI #1107; expanded assessment-trigger RED `66fe1a7455915718c23846d363ddf6cf134afb14` CI #1109 (14/15 expected assertion failures).
M11.3 FK-ordered transactional deletion implementation `be3b96a3d277668ffa95c61027c8b0626a1bb077`: full exact-head CI #1110 / `36463309265` GREEN, including database, build, E2E and coverage.
M11.3 subsequent unexpected-FK atomic-rollback regression head `fdd2f54e8e286ed64cb1c38581457c9ef1c88203`: CI #1111 / `36464166029` was IN PROGRESS at reconciliation; recover its final outcome from GitHub, do not infer success.
CI status: full exact-head CI #1139 / run 37155417198 GREEN at `0c63e11f711114fbd7975cb66ade947077e2e61a`, including the M11.4 candidate-facing safe branding rendering after genuine RED CI #1138 at `b361b81a8bf6e6c76021369a3065b817451ccce9`. M11.3 remains verified through #1118; provider-side deletion and deployment-wide ZDR are not established.

## M11 Task State
- M11.1 immutable audit — VERIFIED.
- M11.2 retention configuration — VERIFIED.
- M11.3 deletion — VERIFIED; internal artifact chain, idempotency and unexpected-FK rollback are covered by full CI #1118; application-controlled Gemini Live session resumption removed. External provider settings remain deployment/operator evidence only.
- M11.4 organization branding — VERIFIED; validated persistence/authorization/tenancy plus accessible inert candidate rendering, RED #1138 → GREEN #1139.
- M11.5 security hardening/rate limits/abuse — ACTIVE.
- M11.6 observability/incident/SLA — PLANNED.
- M11.7 privileged support/access reviews — PLANNED.
- M11.8 SSO/SAML — CONDITIONAL DECISION GATE.

## Review / Safety
PR #13 had zero submitted reviews and zero unresolved inline threads at latest recovery. Independent review remains required for closeout. Preserve tenant RLS, immutable historical provenance up to explicit authorized erasure, minimum non-sensitive receipt/audit, privacy and sole human hiring authority. Do not merge incomplete M11.

## Known Issues
See `docs/progress/KNOWN-ISSUES.md`; real external Gemini browser smoke still depends on owner-supplied credentials and is not repository CI evidence.

Exact next work: threat-model the existing exposed/public routes for M11.5, select the highest-risk missing bounded server-authoritative abuse control, and establish a genuine adversarial RED before implementation.
