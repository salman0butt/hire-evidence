# Feature Matrix

Status meanings: `PLANNED`, `ACTIVE`, `IMPLEMENTED`, `VERIFIED`, `BLOCKED`, `DEFERRED`.

| Capability | Milestone | Status | Evidence / note |
|---|---|---|---|
| Repository/application foundation + durable autonomous control plane | M00 | VERIFIED | PR #2; CI framework/source/PRD gates. |
| SaaS shell/auth/profile | M01 | VERIFIED | PR #3; post-merge CI #157. |
| Organizations/RBAC/tenant isolation | M02 | VERIFIED | PR #4; post-merge CI #232. |
| Jobs/interviewer builder/immutable guardrails | M03 | VERIFIED | PR #5. |
| Candidate records + secure invitations | M04 | VERIFIED | PR #6. |
| Realtime AI interview | M05 | VERIFIED | PR #7; provider-neutral bounded runtime/recovery. |
| Real external Gemini deployment smoke | M05 deployment | DEFERRED | Owner-supplied credential acceptance; not repository CI. |
| Durable transcript/session continuity | M06 | VERIFIED | PR #8; post-merge CI #875. |
| Evidence-grounded structured assessment + provenance/history | M07 | VERIFIED | PR #9; post-merge CI #920. |
| Hiring-team review experience | M08 | VERIFIED | PR #10; tenant-scoped evidence review with attributable human judgment and neutral accessible workflow. |
| Billing and usage | M09 | VERIFIED | Integrated PR #11; immutable subscription and server-authoritative usage/entitlement boundaries. |
| AI quality/guardrails/evals | M10 | VERIFIED | M10 merge `54444d49761b7eb089c1c6a30a27fdfd115cdd9e`; post-merge CI #1084. |
| Enterprise immutable audit | M11.1 | VERIFIED | CI #1093; append-only tenant scope. |
| Enterprise retention configuration | M11.2 | VERIFIED | CI #1099; explicit bounded policy and audit. |
| Candidate data deletion | M11.3 | VERIFIED | Internal erasure/rollback/provider-session-resumption boundary verified by #1118; provider-side deletion not claimed. |
| Enterprise organization branding | M11.4 | VERIFIED | Candidate-facing safe inert rendering RED #1138 → full GREEN #1139. |
| Provider credential mint rate limit | M11.5 | VERIFIED | Genuine DB RED #1154 → full GREEN #1155. |
| Technical-event ingestion abuse control | M11.5 | VERIFIED | Genuine DB RED #1164 → full GREEN #1166; server-time accounting. |
| Realtime finalization retry hardening | M11.5 | VERIFIED | #1167 invalid target RED; #1168 genuine retry RED; full #1169 GREEN makes completed retries read-only. |
| Remaining exposed-route security hardening | M11.5 | VERIFIED | Finite immutable progress plan + idempotent event IDs; no speculative throttle. M11.5 closeout 0 Critical/Important. |
| Privacy-safe operational signal contract | M11.6 | VERIFIED | Genuine behavioral RED #1175 → full GREEN #1176. |
| Bounded operational-signal persistence | M11.6 | VERIFIED | DB RED #1177; #1178 exposed client RPC privilege; explicit lock-down → full GREEN #1179. |
| Incident-oriented health projection | M11.6 | VERIFIED | #1181 attempt 1 INVALID NOT RED; attempt 2 genuine RED; full GREEN #1182. Aggregate-only, no identifiers/candidate evidence. |
| SLA monitoring / M11.6 closeout | M11.6 | VERIFIED | Genuine RED #1189; #1190 NOT GREEN; full GREEN #1191. Observed rates only; no invented contractual target. |
| Privileged support least-privilege foundation | M11.7 | VERIFIED | Domain #1196 GREEN with historical RED gap; persistence RED #1197 → #1202 GREEN; lifetime #1203 INVALID, #1204 RED → #1205/#1206 GREEN. |
| Audited support grant lifecycle | M11.7 | VERIFIED | Genuine DB RED `9a113f85...` / #1214 → full exact-head GREEN `ef8b8430...` / #1215; owner/admin same-tenant, server-time bounded, immutable grant audit. |
| Audited support revocation | M11.7 | VERIFIED | Genuine DB RED `51fa2dba...` / #1217 → full exact-head GREEN `845d8e55...` / #1218; idempotent audited revoke with cross-tenant denial. |
| Support access-review projection | M11.7 | VERIFIED | #1220 INVALID NOT RED; #1221 no RED evidence; genuine RED `2cffabf3...` / #1222 → full exact-head GREEN `7d0ec19b...` / #1223. Bounded same-tenant owner/admin lifecycle review only. |
| SSO/SAML | M11.8 | DEFERRED | Decision resolved: source milestone makes it conditional “if required”; no durable current evidence requires implementation. Reopen only on product/market evidence. |
| Integrations/advanced formats/compliance | M12–M15 | PLANNED | Continue in roadmap dependency order after M11 merge and post-merge main verification. |