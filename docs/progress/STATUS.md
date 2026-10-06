# Project Status

Last reconciled: 2026-10-06. Current Git/code/exact-SHA CI outrank these recovery notes.

## Completed Milestones
M00–M10 COMPLETE and integrated. M10 merge/main `54444d49761b7eb089c1c6a30a27fdfd115cdd9e`; post-merge CI #1084 GREEN.

## Current Milestone
M11 Enterprise Readiness — ACTIVE.
Active task: M11.6 observability / incident / SLA tooling.
Active branch: `feat/enterprise-readiness`.
Active PR: #13 OPEN / DRAFT; not merge eligible while M11 remains incomplete.
Main/base: `54444d49761b7eb089c1c6a30a27fdfd115cdd9e`.

## M11 Task State
- M11.1 immutable audit — VERIFIED, CI #1093.
- M11.2 retention configuration — VERIFIED, CI #1099.
- M11.3 deletion — VERIFIED through full CI #1118. Internal artifact erasure, rollback/idempotency, and removal of application-controlled Gemini Live session resumption are covered. Provider-side deletion or deployment-wide zero retention is not claimed.
- M11.4 organization branding — VERIFIED; RED #1138 → full exact-head GREEN #1139 at `0c63e11f711114fbd7975cb66ade947077e2e61a`.
- M11.5 security hardening/rate limits/abuse — VERIFIED through full exact-head CI #1169 at `da95e4acc65624ed5ae02bf783e819430280d557`.
- M11.6 observability/incident/SLA — ACTIVE; privacy-safe signal contract, bounded persistence and deterministic incident-health projection are VERIFIED.
- M11.7 privileged support/access reviews — PLANNED.
- M11.8 SSO/SAML — CONDITIONAL DECISION GATE.

## M11.6 Evidence
### Structured operational-signal contract
- `0f3b7721a5fa06c8a910c4be9cad7820b4535d85` / CI #1175 genuine behavioral RED: unsafe free-form fields and invalid identity/status/latency/error-code shapes were accepted.
- `07166058183daa1fa021b870ea640903d23f721c` / CI #1176 full exact-head GREEN: strict allow-list schema, bounded request/correlation/service/status/latency/error-code fields, immutable normalized output, and rejection of shadow candidate/transcript/resume/free-form payloads.

### Bounded persistence and authorization
- `7ee4bdf616169570e254b1d07aceac84138d1699` / CI #1177 genuine database RED: `operational_signals`, server-only ingestion and retention cleanup were missing.
- `46a649d3d69bd05c573f127238c9e6f9c3d73401` / CI #1178 NOT GREEN: persistence existed but Supabase client roles still had RPC execution.
- `0e1c8dee4191fe62e7a0c6d12f939f2a9dc8b6fb` / CI #1179 full exact-head GREEN: client-role RPC execution revoked, RLS/direct table access remain fail-closed, service-role ingestion/purge retained, and signals expire after 30 days.

### Incident-health projection
- CI #1181 attempt 1 INVALID NOT RED: runner job was cancelled before tests executed.
- `bf45d9b21026c55b2246749501606216281c92f0` / CI #1181 attempt 2 genuine behavioral RED: 770 existing tests passed and only the two new incident-health projection assertions failed against the deliberate zero-value seam.
- `bb1f803fb98cb489fe170322b52f45999d215627` / CI #1182 full exact-head GREEN: deterministic health projection reports aggregate total/error/degraded counts, maximum latency and unique sorted machine-readable error codes without request/correlation/candidate identifiers. Full gate included database, build, Chromium E2E and PRD coverage.

Review at `bb1f803f…`: 0 known Critical findings, 0 known Important findings, 0 submitted PR reviews, 0 unresolved inline review threads. Projection is O(n), privacy-minimized and remains operational only; it cannot affect candidate evidence, scoring, ranking, recommendation or hiring decisions.

## Known Issues
See `docs/progress/KNOWN-ISSUES.md`. Real external Gemini browser smoke and deployment/provider retention settings remain operator concerns, not repository CI evidence.

CI status: M11.6 latest verified implementation head `bb1f803fb98cb489fe170322b52f45999d215627`; full exact-head CI #1182 GREEN. M11 remains ACTIVE.

Exact next work: define the smallest non-contractual SLA-monitoring projection over privacy-safe operational health data (no hard-coded customer SLA promise), verify a genuine RED, implement minimal deterministic GREEN, run full exact-head CI, review, reconcile durable evidence, then continue M11.6 closeout or the next unmet incident/SLA acceptance boundary.