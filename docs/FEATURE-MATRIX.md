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
| Accessible dashboard list/filter/sort closeout | M08.9 | VERIFIED BEHAVIOR / CLOSEOUT ACTIVE | RED `f027b05c…` / #1021; final implementation/test head `a6320513…` / #1024 GREEN; no score/rank/recommendation sort. |
| Billing and usage | M09 | PLANNED | Server-authoritative usage/idempotency; activate after M08 merge. |
| AI quality/guardrails/evals | Later roadmap | PLANNED | Evals required where measurable AI behavior depends on them. |
| Enterprise/integrations/advanced formats | Later roadmap | PLANNED | Deferred to roadmap milestones. |
