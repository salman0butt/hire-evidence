# Project Status

Last reconciled: 2026-10-08. Current Git/code/exact-SHA CI outrank these recovery notes.

## Completed Milestones
M00–M10 COMPLETE and integrated. M10 merge/main `54444d49761b7eb089c1c6a30a27fdfd115cdd9e`; post-merge CI #1084 GREEN.

## Current Milestone
M11 Enterprise Readiness — ACTIVE.
Active task: M11.7 privileged support / access reviews.
Active branch: `feat/enterprise-readiness`.
Active PR: #13 OPEN / DRAFT; not merge eligible while M11 remains incomplete.
Main/base: `54444d49761b7eb089c1c6a30a27fdfd115cdd9e`.

## M11 Task State
- M11.1 immutable audit — VERIFIED, CI #1093.
- M11.2 retention configuration — VERIFIED, CI #1099.
- M11.3 deletion — VERIFIED through full CI #1118. Internal artifact erasure, rollback/idempotency, and removal of application-controlled Gemini Live session resumption are covered. Provider-side deletion or deployment-wide zero retention is not claimed.
- M11.4 organization branding — VERIFIED; RED #1138 → full exact-head GREEN #1139 at `0c63e11f711114fbd7975cb66ade947077e2e61a`.
- M11.5 security hardening/rate limits/abuse — VERIFIED through full exact-head CI #1169 at `da95e4acc65624ed5ae02bf783e819430280d557`.
- M11.6 observability/incident/SLA — VERIFIED through full exact-head CI #1191 at `84c311e1a2a85ff291251f0ccdb8cb0d05f49bb8`.
- M11.7 privileged support/access reviews — ACTIVE. Least-privilege domain and persistence constraints are verified; audited grant/revoke lifecycle and access-review projection remain.
- M11.8 SSO/SAML — CONDITIONAL DECISION GATE.

## M11.7 Evidence
### Least-privilege domain contract
- `e6c3ea882f9ee8c596a754ddccceb1a49d8c7ccd` / CI #1193, `09068fee01c728ac3afe3caeedba83b0425b7bbf` / CI #1194, and `45d4f71734a955d6f9714662eafd2ab66201f16c` / CI #1195 are INVALID NOT RED because TypeScript failed before the intended support-access behavior executed. Do not relabel them as behavioral RED.
- `fafb99074f026cdbad917e8a2c9b3a9832b5714f` / CI #1196 GREEN established the immutable attributable domain grant, fixed `read_incident_health` scope, positive <=1-hour lifetime, and fail-closed tenant/scope/time use checks. This historical domain slice does not have valid pre-implementation RED evidence.

### Persisted least-privilege boundary
- `9f6e3bdc12f7c0b9d50842840e010ff9e14ac561` / CI #1197 genuine database RED: the required `support_access_grants` persistence boundary was absent while earlier quality stages passed.
- By `8732fe7041515ec25170bedd9848880380ebe086` / CI #1202 full exact-head GREEN, persistence was RLS-protected from anon/authenticated direct access, scope was constrained to `read_incident_health`, and blank reasons were rejected.

### Database lifetime enforcement
- `42376df4e06c321739cefed2d5060155fe7c677f` / CI #1203 INVALID NOT RED: malformed pgTAP dollar quoting caused SQL syntax failure before lifetime behavior ran.
- `85933a3a0075227637ffb61d54d7a1fd5d418890` / CI #1204 genuine RED: all earlier gates passed and only the two intended assertions failed because PostgreSQL accepted zero-duration and >1-hour grants.
- `48287ffe823ae7aaf5847967afe0ecac7bbfc613` / CI #1205 full exact-head GREEN after adding the database lifetime check.
- Skeptical review found one Important boundary-coverage gap: exactly one hour was not positively proven. `32d54c5f5b4067b3fb2de5d9c717997d01f404b5` / CI #1206 full exact-head GREEN added the exact-one-hour `lives_ok` regression and resolved that finding.

Review at `32d54c5…`: 0 known Critical findings, 0 known Important findings, 0 submitted PR reviews, and 0 unresolved inline review threads. Support access remains operational-only and cannot mutate candidate evidence, scores, rankings, recommendations, or hiring decisions.

## Known Issues
See `docs/progress/KNOWN-ISSUES.md`. Real external Gemini browser smoke and deployment/provider retention settings remain operator concerns, not repository CI evidence. The M11.7 domain slice has a historical RED-evidence gap recorded above; subsequent persistence/lifetime work has genuine RED→GREEN evidence.

CI status: M11.7 lifetime/review head `32d54c5f5b4067b3fb2de5d9c717997d01f404b5`; full exact-head CI #1206 GREEN. M11 remains ACTIVE.

Exact next work: add the smallest audited support-grant lifecycle boundary with server-authoritative grant time, fixed least-privilege scope, owner/admin same-tenant authorization, immutable audit evidence, and fail-closed cross-tenant denial; prove it with genuine database RED→GREEN before adding revocation and the access-review projection.