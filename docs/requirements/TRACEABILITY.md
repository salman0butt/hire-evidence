# Requirements Traceability

This matrix tracks durable framework requirements and product capabilities. The canonical PRD remains the product source of truth; Git/code/current exact-SHA CI outrank stale prose.

| Requirement | Milestone | Spec | Implementation | Tests / evidence | Status |
|---|---|---|---|---|---|
| AUTO-001 — Git/GitHub durable execution memory | Product Foundation | autonomous framework | recovery/control plane + durable status/handoff/ledgers | framework verifier/CI | VERIFIED |
| AUTO-002 — Fresh recovery before writes | Active capabilities | autonomous policy | Git/PR/CI/docs recovered before work | current autonomous recovery | VERIFIED |
| AUTO-003 — Evidence precedence | Active capabilities | autonomous policy | stale docs reconciled to Git/code/current CI | framework verifier | VERIFIED |
| AUTO-005 — Genuine RED→GREEN / root-cause debugging | Active capabilities | TDD/debugging policy | intended RED checkpoints followed by minimal GREEN | M07.11 RED `82a65ab8…` CI #909 → integrated GREEN `121bfdf3…` CI #911 | VERIFIED |
| AUTO-006 — Critical/Important findings block completion | Active capabilities | review policy | skeptical security/architecture/AI-safety review | M07 rationale guardrail Important fixed at `121bfdf3…`; 0 known unresolved Critical/Important | VERIFIED |
| AUTO-007 — Fresh exact-SHA CI | Active capabilities | verification policy | GitHub Actions exact-head gate | implementation head `121bfdf3…` CI #911 GREEN; closeout docs final head pending fresh CI | ACTIVE |
| AUTO-010 — Avoid duplicate concurrent work | Active capabilities | concurrency policy | active PR reused and remote head checked before writes | PR #9 reused; remote head checked during closeout | VERIFIED |
| PRD-195 — Product Foundation | Product Foundation | foundation requirements | foundation + requirements control plane | PR #2 / CI #57 | VERIFIED |
| PRD-015/016/017/196 — SaaS shell/auth/profile | SaaS Shell + Auth | M01 spec/plan | auth/profile shell | PR #3; post-merge CI #157 | VERIFIED |
| PRD 8–14, 18–19, 197 — Organizations/RBAC | Organizations + RBAC | M02 spec/plan | fixed roles, tenant RLS/RPCs, onboarding/team/invites/settings | PR #4; post-merge CI #232 | VERIFIED |
| PRD 20–41, 198 — Jobs + Interviewer Builder | Jobs + Interviewer Builder | M03 spec/plan | jobs, competencies, rubrics, questions, deterministic plan, config, guardrails, publish/version, preview | PR #5; post-merge CI #432 | VERIFIED |
| PRD 42–57, 199 — Candidates + Invitations | Candidates + Invitations | M04 design/plan | candidate records, secure invitations, lifecycle, public projection, consent, support path | PR #6; post-merge CI #517 | VERIFIED |
| PRD 58+, 200 — Realtime AI Interview | Realtime AI Interview | M05 design/plan | authoritative attempt, provider-neutral runtime, immutable plan, bounded follow-ups, recovery | PR #7 / post-merge main | VERIFIED |
| M05-LIVE-SMOKE — Real Gemini external-provider acceptance | Realtime AI Interview deployment | `docs/LOCAL-REALTIME-ACCEPTANCE.md` | deployment-only owner-supplied credential smoke | manual smoke; never claimed as repository CI | DEFERRED TO DEPLOYMENT |
| PRD roadmap — Durable transcript/session continuity | Transcript + Durable Session | M06 design/plan | normalized/finalized durable transcript, attempt lifecycle/reconnect, technical events, finalization | PR #8; post-merge CI #875 | VERIFIED |
| M07-SCHEMA — Structured runtime-validatable assessment | Evidence-Based Assessment | M07 design/plan | `assessment-schema.ts` | schema tests + branch CI | VERIFIED |
| M07-PROMPT — Trusted immutable assessment prompt | Evidence-Based Assessment | M07 design/plan | `assessment-input.ts`, `assessment-prompt.ts` | prompt/adversarial tests + branch CI | VERIFIED |
| M07-RUBRIC — Configured rubric-aligned 1–5/null scoring | Evidence-Based Assessment | M07 design/plan | `rubric-scoring.ts` | scoring tests + branch CI | VERIFIED |
| M07-EVIDENCE — Evidence citations and same-attempt validation | Evidence-Based Assessment | M07 design/plan | schema citations + `evidence-validator.ts` | fabricated/sequence/speaker/excerpt tests + branch CI | VERIFIED |
| M07-SUFFICIENCY — Evidence sufficiency and question coverage | Evidence-Based Assessment | M07 design/plan | `question-coverage.ts` | coverage/technical-interruption tests + branch CI | VERIFIED |
| M07-SAFETY — Prompt injection and prohibited-output defense | Evidence-Based Assessment | M07 design/plan | `assessment-guardrails.ts` + fixed prompt policy | adversarial tests; rationale review fix `121bfdf3…`; CI #911 | VERIFIED |
| M07-PROVENANCE — Application-owned assessment provenance | Evidence-Based Assessment | M07 design/plan | `assessment-provenance.ts` | provenance override/blank-version tests + branch CI | VERIFIED |
| M07-PERSIST — Idempotent tenant-safe assessment generation | Evidence-Based Assessment | M07 design/plan | assessment migration + repository/RPC boundary | migration/repository tests + local Supabase CI | VERIFIED |
| M07-HISTORY — Append-only regeneration/history | Evidence-Based Assessment | M07 design/plan | list/regeneration RPC/repository boundary | history tests; `86afd017…` CI #908 | VERIFIED |
| PRD 69–81, 202 — Evidence-Based Assessment Engine | Evidence-Based Assessment | M07 design/plan | integrated schema→rubric→evidence→guardrail→score pipeline plus provenance/history | RED `82a65ab8…` CI #909 → GREEN `121bfdf3…` CI #911 | CLOSEOUT / MERGE GATE |
| PRD roadmap — Hiring-team review | Hiring Team Review | M08 | pending activation after M07 merge | pending | PLANNED |

## Active requirement interpretation

M00–M06 are integrated on `main`. M07 implementation is complete on PR #9. The latest fully verified implementation head is `121bfdf3452fc4ef1e02ce5f39a1feb8f8cb99fe`, which passed CI #911 / run `35049947377`.

M07 preserves the hiring-AI evidence boundary: only configured job-related competencies may be assessed; insufficient evidence stays explicit; every scored claim is validated against same-attempt candidate transcript evidence; transcript content remains inert untrusted data; model-authored evaluative rationale is screened for decision-like/prohibited inference; technical interruptions remain non-evaluative; provenance is application-owned; and assessment generations/history are append-only, tenant/attempt scoped and validation-gated.

Closeout documentation commits after `121bfdf3…` require fresh exact-final-head CI before PR #9 may merge. After a successful authorized merge, post-merge `main` CI must pass before M08 is treated as safely activated.