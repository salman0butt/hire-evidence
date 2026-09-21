# Requirements Traceability

Canonical PRD remains product truth; Git/code/current exact-SHA CI outrank stale prose. Earlier milestone detail is preserved in Git history and milestone ledgers.

| Requirement / capability | Milestone | Implementation / evidence | Status |
|---|---|---|---|
| Product foundation through organizations/jobs/candidates/realtime/transcript | M00–M06 | PRs #2–#8 and post-merge CI | VERIFIED |
| PRD 69–81, 202 — evidence-based assessment | M07 | structured schema, immutable input/prompt, rubric scoring, same-attempt evidence validation, sufficiency, guardrails, provenance, append-only generations/history; PR #9 / post-merge CI #920 | VERIFIED |
| M08-RESULT — tenant-scoped candidate result | M08.1 | candidate result repository/RPC/page; `f36b520e…` / CI #930 | VERIFIED |
| M08-CARDS — competency/evidence review | M08.2 | immutable completed-assessment projection + runtime validation + accessible cards; `6616fcc7…` / CI #941 | VERIFIED |
| M08-TRANSCRIPT — authenticated transcript review | M08.3 | exact-scope transcript RPC/repository/searchable inert viewer; `7cb2b507…` / CI #951 | VERIFIED |
| M08-EVIDENCE-LINKS — exact evidence navigation | M08.4 | fail-closed citation resolution and validated focus/highlight; `d0ed1467…` / CI #970 | VERIFIED |
| M08-OVERRIDES — human competency score overrides | M08.5 | append/audit-safe tenant-scoped overrides preserving immutable AI generation and requiring reviewer reason/attribution | VERIFIED |
| M08-REVIEW-LIFECYCLE — reviewer notes/status | M08.6 | attributable notes plus awaiting/in-review/reviewed lifecycle | VERIFIED |
| M08-DISAGREEMENT — AI/human disagreement | M08.7 | deterministic comparison over preserved AI/human values; `071b894c…` / CI #1010 | VERIFIED |
| M08-DASHBOARD — job candidate review workflow | M08.8 | tenant/job-scoped neutral workflow projection + direct review links; `0d871017…` / CI #1019 | VERIFIED |
| M08-CLOSEOUT — accessible neutral list/filter/sort and final gate | M08.9 | filter by review status; sort by candidate name/review status only; no score/rank/recommendation; RED `f027b05c…` / #1021 → exact verified implementation/test head `a6320513…` / #1024 | ACTIVE — final docs/merge gate |
| Hiring-AI human agency | M08 | immutable AI history, attributable human judgment, no autonomous hire/reject/ranking | VERIFIED through latest exact-head CI |
| Billing and usage | M09 | activate after M08 merge/post-merge verification | PLANNED |

## Active interpretation
M00–M07 are integrated on `main`. M08 is in closeout on PR #10. M08.1–M08.8 are VERIFIED; M08.9's Important dashboard accessibility/list/filter/sort gap is fixed and `a6320513…` passed CI #1024. Remaining work is exact-head verification of this documentation reconciliation, final merge-gate recheck, authorized merge, and post-merge `main` verification before M09 activation.
