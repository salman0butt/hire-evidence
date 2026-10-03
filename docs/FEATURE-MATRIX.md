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
| Tenant-scoped candidate result projection/page | M08.1 | VERIFIED | `f36b520e…`, CI #930. |
| Competency/evidence review cards | M08.2 | VERIFIED | `6616fcc7…`, CI #941. |
| Authenticated transcript review viewer | M08.3 | VERIFIED | `7cb2b507…`, CI #951. |
| Exact evidence deep links | M08.4 | VERIFIED | `d0ed1467…`, CI #970. |
| Human score overrides preserving AI history | M08.5 | VERIFIED | Append/audit-safe, tenant-scoped, attributable reason. |
| Reviewer notes/status lifecycle | M08.6 | VERIFIED | Attributable notes + awaiting/in-review/reviewed workflow. |
| AI/human disagreement data | M08.7 | VERIFIED | `071b894c…`, CI #1010; deterministic, non-mutating comparison. |
| Job candidate workflow dashboard | M08.8 | VERIFIED | `0d871017…`, CI #1019; neutral metadata and direct human-review links only. |
| Accessible dashboard list/filter/sort closeout | M08.9 | VERIFIED | RED `f027b05c…` / #1021; final M08 PR #10 integrated into main; no score/rank/recommendation sort. |
| Billing and usage | M09 | VERIFIED | Integrated PR #11; immutable subscription and server-authoritative usage/entitlement boundaries. |
| AI quality/guardrails/evals | M10 | VERIFIED | Integrated M10 merge `54444d49761b7eb089c1c6a30a27fdfd115cdd9e`; post-merge CI #1084. |
| Enterprise immutable audit | M11.1 | VERIFIED | CI #1093; append-only tenant scope. |
| Enterprise retention configuration | M11.2 | VERIFIED | CI #1099; explicit bounded policy and audit. |
| Candidate data deletion | M11.3 | VERIFIED | Artifact-chain RED `66fe1a7...` / #1109; internal SQL erasure GREEN `be3b96a...` / #1110; rollback plus provider-session-resumption boundary verified by full #1118 at `dabe472...`. Provider-side deletion is not claimed. |
| Enterprise organization branding | M11.4 | ACTIVE | Extend existing organization settings with bounded logo/accent/welcome metadata and safe inert rendering; no arbitrary CSS/HTML/script. |
| Enterprise security/observability/access reviews | M11.5–M11.7 | PLANNED | Begin after M11.4 verification. |
| SSO/SAML | M11.8 | DEFERRED | Conditional product-evidence decision gate. |
| Integrations/advanced formats/compliance | M12–M15 | PLANNED | Deferred to roadmap dependency order. |
