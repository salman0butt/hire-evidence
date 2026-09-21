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
| M08-CLOSEOUT — accessible neutral list/filter/sort and final gate | M08.9 | M08 design/plan | filter by review status; sort by candidate name/review status only; no score/rank/recommendation | RED `f027b05c…` / #1021 plus implementation/test head | `a6320513…` / CI #1024; docs head pending re-verification | ACTIVE — final docs/merge gate |
| Hiring-AI human agency | M08 | M08 design/plan | immutable AI history, attributable human judgment, no autonomous hire/reject/ranking | M08 safety/adversarial coverage | verified through latest exact-head implementation CI | VERIFIED |
| Billing and usage | M09 | M09 ledger / PRD | activate after M08 merge/post-merge verification | pending | pending | PLANNED |

## Active interpretation
M00–M07 are integrated on `main`. M08 is in closeout on PR #10. M08.1–M08.8 are VERIFIED; M08.9's Important dashboard accessibility/list/filter/sort gap is fixed and `a6320513…` passed CI #1024. CI #1025 on the documentation-reconciliation head failed only at the autonomous-framework verifier because this traceability table had collapsed the verifier-required `Spec`, `Tests`, and `Verification` columns; lint, typecheck, unit/component tests, framework verifier tests, and requirements-source verifier tests had already passed. This commit restores the required traceability schema without changing product behavior. Remaining work is exact-head verification, final merge-gate recheck, authorized merge, and post-merge `main` verification before M09 activation.
