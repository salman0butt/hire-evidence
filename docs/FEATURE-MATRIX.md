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
| AI quality/guardrails/evals | M10 | VERIFIED | Integrated M10 merge `54444d49761b7eb089c1c6a30a27fdfd115cdd9e`; post-merge CI #1084. |
| Enterprise immutable audit | M11.1 | VERIFIED | CI #1093; append-only tenant scope. |
| Enterprise retention configuration | M11.2 | VERIFIED | CI #1099; explicit bounded policy and audit. |
| Candidate data deletion | M11.3 | VERIFIED | Internal erasure/rollback/provider-session-resumption boundary verified by full #1118; provider-side deletion not claimed. |
| Enterprise organization branding | M11.4 | VERIFIED | Candidate-facing safe inert rendering RED #1138 → full exact-head GREEN #1139. |
| Provider credential mint rate limit | M11.5 | VERIFIED | Genuine DB RED #1154 → full exact-head GREEN #1155. |
| Technical-event ingestion abuse control | M11.5 | VERIFIED | Genuine DB RED #1164 → full exact-head GREEN #1166; server-time accounting. |
| Realtime finalization retry hardening | M11.5 | VERIFIED | #1167 invalid target RED; #1168 genuine retry RED; full #1169 GREEN makes completed retries read-only. |
| Remaining exposed-route security hardening | M11.5 | VERIFIED | Finite immutable progress plan + idempotent event IDs; no speculative throttle. M11.5 closeout 0 Critical/Important. |
| Privacy-safe operational signal contract | M11.6 | VERIFIED | Genuine behavioral RED #1175 → full exact-head GREEN #1176 at `07166058183daa1fa021b870ea640903d23f721c`. |
| Bounded operational-signal persistence | M11.6 | VERIFIED | DB RED #1177; #1178 exposed client RPC privilege; explicit lock-down → full exact-head GREEN #1179 at `0e1c8dee...`. |
| Incident-oriented health projection | M11.6 | VERIFIED | #1181 attempt 1 INVALID NOT RED; attempt 2 genuine RED at `bf45d9b...`; full exact-head GREEN #1182 at `bb1f803f...`. Aggregate-only, no identifiers/candidate evidence. |
| SLA monitoring / M11.6 closeout | M11.6 | ACTIVE | Next: measurable privacy-safe operational service-level projection; no invented contractual target. |
| Privileged support/access reviews | M11.7 | PLANNED | Least privilege, attributable access, reason/expiry where applicable. |
| SSO/SAML | M11.8 | DEFERRED | Conditional product-evidence decision gate. |
| Integrations/advanced formats/compliance | M12–M15 | PLANNED | Deferred to roadmap dependency order. |