# Requirements Traceability

Canonical PRD remains product truth; Git/code/current exact-SHA CI outrank stale prose. Earlier milestone detail is preserved in Git history and milestone ledgers.

| Requirement | Milestone | Spec | Implementation | Tests | Verification | Status |
|---|---|---|---|---|---|---|
| Product foundation through organizations/jobs/candidates/realtime/transcript | M00–M06 | milestone ledgers/specs | PRs #2–#8 | milestone test suites | post-merge CI | VERIFIED |
| PRD 69–81, 202 — evidence-based assessment | M07 | M07 design/plan | structured schema, immutable input/prompt, rubric scoring, same-attempt evidence validation, sufficiency, guardrails, provenance, append-only generations/history | M07 unit/integration/database/E2E coverage | PR #9 / post-merge CI #920 | VERIFIED |
| M08-RESULT — tenant-scoped candidate result | M08.1 | M08 design/plan | candidate result repository/RPC/page | M08.1 tests | `f36b520e…` / CI #930 | VERIFIED |
| M08-CARDS — competency/evidence review | M08.2 | M08 design/plan | immutable completed-assessment projection + runtime validation + accessible cards | M08.2 tests | `6616fcc7…` / CI #941 | VERIFIED |
| M08-TRANSCRIPT — authenticated transcript review | M08.3 | M08 design/plan | exact-scope transcript RPC/repository/searchable inert viewer | M08.3 tests | `7cb2b507…` / CI #951 | VERIFIED |
| M08-EVIDENCE-LINKS — exact evidence navigation | M08.4 | M08 design/plan | fail-closed citation resolution and validated focus/highlight | M08.4 tests | `d0ed1467…` / CI #970 | VERIFIED |
| M08-OVERRIDES — human competency score overrides | M08.5 | M08 design/plan | append/audit-safe tenant-scoped overrides preserving immutable AI generation and requiring reviewer reason/attribution | M08.5 tests | exact-head M08 CI evidence | VERIFIED |
| M08-REVIEW-LIFECYCLE — reviewer notes/status | M08.6 | M08 design/plan | attributable notes plus awaiting/in-review/reviewed lifecycle | M08.6 tests | exact-head M08 CI evidence | VERIFIED |
| M08-DISAGREEMENT — AI/human disagreement | M08.7 | M08 design/plan | deterministic comparison over preserved AI/human values | M08.7 tests | `071b894c…` / CI #1010 | VERIFIED |
| M08-DASHBOARD — job candidate review workflow | M08.8 | M08 design/plan | tenant/job-scoped neutral workflow projection + direct review links | M08.8 tests | `0d871017…` / CI #1019 | VERIFIED |
| M08-CLOSEOUT — accessible neutral list/filter/sort and final gate | M08.9 | M08 design/plan | filter by review status; sort by candidate name/review status only; no score/rank/recommendation | RED `f027b05c…` / #1021 plus implementation/test head | `a6320513…` / CI #1024; docs head pending re-verification | VERIFIED — PR #10 merged |
| Hiring-AI human agency | M08 | M08 design/plan | immutable AI history, attributable human judgment, no autonomous hire/reject/ranking | M08 safety/adversarial coverage | verified through latest exact-head implementation CI | VERIFIED |
| Billing and usage | M09 | M09 ledger / PRD | activate after M08 merge/post-merge verification | pending | pending | PLANNED |

| Billing and usage | M09 | M09 ledger / PRD | integrated PR #11, subscriptions, webhook, server usage and entitlements | billing tests and CI | merged to main before M10 | VERIFIED |
| Measurable AI evals and regression gate | M10 | M10 ledger / PRD | golden data, behavior evaluators, fairness/adversarial/regression CI | deterministic eval tests | main `54444d49761b7eb089c1c6a30a27fdfd115cdd9e`, post-merge #1084 | VERIFIED |
| Enterprise audit | M11.1 | M11 design/plan | immutable safe audit event and tenant-scoped persistence | audit tests/pgTAP | #1093 | VERIFIED |
| Explicit retention policy | M11.2 | M11 design/plan | tenant-authorized policy/audit/effective calculation | retention tests/pgTAP | #1099 | VERIFIED |
| Candidate-linked internal erasure | M11.3 | M11 design/plan | candidate deletion RPC + receipt, FK-ordered artifact migration, removal of application-controlled Gemini Live session resumption | `candidate_deletion_test.sql`, `candidate_deletion_artifacts_test.sql`, realtime provider tests | RED #1109; SQL GREEN #1110; full rollback/provider GREEN #1118 | VERIFIED — provider-side deletion not claimed |
| Safe organization branding | M11.4 | M11 design/plan | existing organization settings boundary selected for bounded branding extension | branding tests pending | RED/GREEN pending | ACTIVE |
| Security/observability/access reviews | M11.5–M11.7 | M11 design/plan | not started | pending | pending | PLANNED |
| Conditional SSO/SAML | M11.8 | M11 design/plan | require durable product/market decision | decision gate pending | pending | DEFERRED |

## Active interpretation
M00–M10 are integrated into `main` through M10 merge `54444d49761b7eb089c1c6a30a27fdfd115cdd9e`, post-merge CI #1084 GREEN. M11 branch `feat/enterprise-readiness`, PR #13 DRAFT. M11.1 and M11.2 verified. M11.3 internal deletion plus rollback/provider-boundary coverage is verified through full CI #1118 at `dabe472...`; CI #1111 was cancelled and is not used as standalone evidence. M11.4 safe branding is now ACTIVE. Provider-side deletion or deployment-wide zero retention is not claimed. This documentation update requires fresh exact-head CI; M11 as a whole remains incomplete and not merge-ready.
