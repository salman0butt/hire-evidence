# Requirements Traceability

This matrix tracks durable framework requirements and product capabilities. The canonical PRD remains the product source of truth; Git/code/current exact-SHA CI outrank stale prose.

| Requirement | Milestone | Spec | Implementation | Tests / Verification | Status |
|---|---|---|---|---|---|
| AUTO-001 — Git/GitHub durable execution memory | Product Foundation | autonomous framework | recovery/control plane + durable status/handoff/ledgers | framework verifier/CI | VERIFIED |
| AUTO-002 — Fresh recovery before writes | Active capabilities | autonomous policy | Git/PR/CI/docs recovered before work | current autonomous recovery | VERIFIED |
| AUTO-003 — Evidence precedence | Active capabilities | autonomous policy | stale docs reconciled to Git/code/current CI | framework verifier | VERIFIED |
| AUTO-005 — Genuine RED→GREEN / root-cause debugging | Active capabilities | TDD/debugging policy | intended RED checkpoints followed by minimal GREEN | M08.1 + M08.2 RED→GREEN chains; typecheck-only harness failures explicitly not counted as behavioral RED | VERIFIED |
| AUTO-006 — Critical/Important findings block completion | Active capabilities | review policy | skeptical security/architecture/AI-safety review | M08.2 summary gap fixed; validation hardened; 0 known unresolved Critical/Important | VERIFIED |
| AUTO-007 — Fresh exact-SHA CI | Active capabilities | verification policy | GitHub Actions exact-head gate | M08.2 `6616fcc7…` CI #941 / run `35215607658` GREEN | VERIFIED |
| AUTO-010 — Avoid duplicate concurrent work | Active capabilities | concurrency policy | active PR reused and remote head checked before writes | PR #10 reused; head rechecked before writes | VERIFIED |
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
| M07-SAFETY — Prompt injection and prohibited-output defense | Evidence-Based Assessment | M07 design/plan | `assessment-guardrails.ts` + fixed prompt policy | adversarial tests + M07 closeout | VERIFIED |
| M07-PROVENANCE — Application-owned assessment provenance | Evidence-Based Assessment | M07 design/plan | `assessment-provenance.ts` | provenance tests | VERIFIED |
| M07-PERSIST — Idempotent tenant-safe assessment generation | Evidence-Based Assessment | M07 design/plan | assessment migration + repository/RPC boundary | migration/repository tests + local Supabase CI | VERIFIED |
| M07-HISTORY — Append-only regeneration/history | Evidence-Based Assessment | M07 design/plan | list/regeneration RPC/repository boundary | history tests + M07 CI | VERIFIED |
| PRD 69–81, 202 — Evidence-Based Assessment Engine | Evidence-Based Assessment | M07 design/plan | integrated validated evidence-grounded assessment + provenance/history | PR #9; post-merge main CI #920 | VERIFIED |
| M08-RESULT — Tenant-scoped candidate result projection/page | Hiring Team Review | M08 design/plan | candidate-result repository, `get_candidate_review_result`, result route | exact verified `f36b520e…` CI #930 | VERIFIED |
| M08-CARDS — Competency/evidence review cards | Hiring Team Review | M08 design/plan | immutable completed-assessment projection, runtime validation/enrichment, summary + accessible cards | RED CI #932/#937/#939; GREEN through `6616fcc7…` CI #941 | VERIFIED |
| M08-TRANSCRIPT — Authenticated transcript review viewer | Hiring Team Review | M08 design/plan | tenant/job/candidate/attempt transcript boundary + ordered/searchable speaker-separated viewer | TDD pending | ACTIVE |
| PRD roadmap — Hiring-team review remaining scope | Hiring Team Review | M08 design/plan | evidence deep links/human overrides/notes/disagreement/dashboard/closeout | milestone plan | PLANNED |

## Active requirement interpretation

M00–M07 are integrated on `main`. M08 is active on draft PR #10. M08.1 is verified at `f36b520e…` / CI #930. M08.2 is verified at `6616fcc735df5ee06616f3e6e2cb7146469cea7c`, CI #941 / run `35215607658`. M08.3 authenticated transcript review is the active unit.

The M08 review boundary preserves human agency and historical evidence integrity. AI assessment is immutable review input, historical competency identity comes from the immutable published interviewer-version snapshot, and hiring-team transcript access must be independently authenticated and exact-scope authorized. Candidate invitation tokens are not hiring-review authority. Technical interruption events remain separate from evaluative transcript turns.
