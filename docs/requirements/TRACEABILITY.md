# Requirements Traceability

This matrix tracks durable framework requirements plus active product capabilities. The canonical PRD remains the product source of truth.

| Requirement | Milestone | Implementation / evidence | Verification | Status |
|---|---|---|---|---|
| AUTO-001 — Git/GitHub durable execution memory | Product Foundation | recovery/control plane | framework CI | VERIFIED |
| AUTO-002 — Fresh recovery before writes | Active capabilities | autonomous policy | current run recovered Git/PR/review/CI/docs | VERIFIED |
| AUTO-003 — Evidence precedence | Active capabilities | stale docs reconciled to code/current CI | framework verifier | VERIFIED |
| AUTO-005 — Genuine RED→GREEN / root-cause debugging | Active capabilities | test-first capability history; closeout Playwright failures diagnosed from artifacts | CI #428/#429 failures → fixes → #430 PASS | VERIFIED |
| AUTO-006 — Critical/Important findings block completion | Active capabilities | skeptical milestone reviews | M03 closeout: 0 Critical / 0 Important | VERIFIED |
| AUTO-007 — Fresh exact-SHA CI | Active capabilities | GitHub Actions | implementation head `6b3526aa…` CI #430 PASS; documentation head pending | ACTIVE |
| AUTO-010 — Avoid duplicate concurrent work | Active capabilities | active PR reused and head rechecked before writes | no competing head observed before closeout commit | VERIFIED |
| PRD-195 — Product Foundation | Product Foundation | foundation + requirements control plane | PR #2 / CI #57 | VERIFIED |
| PRD-015/016/017/196 — SaaS shell/auth/profile | SaaS Shell + Auth | M01 implementation | PR #3; post-merge CI #157 | VERIFIED |
| PRD 8–14, 18–19, 197 — Organizations/RBAC | Organizations + RBAC | fixed roles, tenant RLS/RPCs, onboarding/team/invites/settings | PR #4; post-merge CI #232 | VERIFIED |
| M03-JOBS — Tenant-scoped jobs and must/nice requirements | Jobs + Interviewer Builder | jobs migration/validation/repository/actions/UI | unit/component + `e2e/jobs.spec.ts` | VERIFIED |
| M03-COMP — Job competencies | Jobs + Interviewer Builder | competencies migration/domain/UI | unit + provider E2E | VERIFIED |
| M03-RUBRIC — Observable 1–5 rubrics | Jobs + Interviewer Builder | rubric persistence/editor | migration/unit/provider E2E | VERIFIED |
| M03-QUESTIONS — Question bank | Jobs + Interviewer Builder | bounded job/competency questions | unit/provider E2E | VERIFIED |
| M03-PLAN — Deterministic interview plan | Jobs + Interviewer Builder | ordered plan/sections/question/competency links | unit/provider E2E | VERIFIED |
| M03-CONFIG — Interviewer configuration | Jobs + Interviewer Builder | bounded config migration/repository/actions/editor | unit/component + `e2e/interviewer-configs.spec.ts` | VERIFIED |
| M03-GUARDRAIL — Non-overridable platform hiring safeguards | Jobs + Interviewer Builder | pure validator + DB save/publish enforcement | guardrail unit/migration + adversarial provider E2E | VERIFIED |
| M03-PUBLISH — Draft/publish state machine | Jobs + Interviewer Builder | role-gated publish RPC/action/UI | unit/migration + publishing E2E | VERIFIED |
| M03-VERSION — Immutable published interviewer version | Jobs + Interviewer Builder | version snapshot table/repository, immutable RLS, prompt/guardrail provenance | version tests + publishing E2E update/delete denial | VERIFIED |
| M03-PREVIEW — Non-billable preview | Jobs + Interviewer Builder | preview domain/RPC/action/UI | preview tests + provider E2E proves non-billable/non-persisting | VERIFIED |
| M03-CLOSEOUT — Complete accessible provider-backed builder journey | Jobs + Interviewer Builder | `e2e/interviewer-builder-ui.spec.ts` + direct abuse suites + closeout evidence | exact implementation head CI #430 / `34677201542` PASS | VERIFIED |
| PRD 20–41, 198 — Jobs + Interviewer Builder milestone | Jobs + Interviewer Builder | M03.1–M03.11 | engineering/review complete; final doc-head CI + merge/post-merge pending | ACTIVE |

## Active requirement interpretation

M00–M02 are integrated on `main`. M03 implementation, provider-backed verification, safety/tenancy review, responsive/keyboard closeout, and skeptical engineering review are complete on PR #5. The implementation head `6b3526aacfe8d5f0df33b699012bd11e521228bc` passed CI #430 / `34677201542`. The only remaining pre-merge requirement is fresh exact-final-head CI after durable-document reconciliation plus final head/review/concurrency verification. M04 must begin only after M03 merges and post-merge `main` is verified.
