# Feature Matrix

Status meanings: `PLANNED`, `ACTIVE`, `IMPLEMENTED`, `VERIFIED`, `BLOCKED`, `DEFERRED`.

| Capability | PRD ownership | Milestone | Status | Evidence / note |
|---|---|---|---|---|
| Repository/application foundation | Foundation | Product Foundation | VERIFIED | PR #2 integrated to `main`; CI #57. |
| Durable autonomous-development control plane | Owner framework + PRD autonomy | Product Foundation | VERIFIED | Framework/source/PRD gates enforced in CI. |
| Complete PRD/requirements corpus in Git | PRD 1–242 | Product Foundation | VERIFIED | Durable source + manifest + coverage verifier. |
| Reproducible dependency graph | Product Foundation | Product Foundation | VERIFIED | `pnpm-lock.yaml` + frozen CI installs. |
| SaaS shell + auth/profile foundation | PRD 15–17, 196 | SaaS Shell + Auth | VERIFIED | PR #3 integrated; post-merge CI #157. |
| Organizations + RBAC / tenant isolation | PRD 8–14, 18–19, 197 | Organizations + RBAC | VERIFIED | PR #4 integrated; post-merge CI #232. |
| Tenant-scoped jobs + requirements | PRD 20–41, 198 | Jobs + Interviewer Builder | VERIFIED | Normalized persistence, validation, role/RLS boundaries, UI and provider-backed E2E. |
| Competencies + deterministic weighting/order | PRD 20–41, 198 | Jobs + Interviewer Builder | VERIFIED | Provider-backed role/tenant/job coverage. |
| Observable 1–5 rubrics | PRD 20–41, 198 | Jobs + Interviewer Builder | VERIFIED | Complete score-level persistence/editor and provider-backed isolation. |
| Question bank | PRD 20–41, 198 | Jobs + Interviewer Builder | VERIFIED | Job/competency-bound deterministic questions with fixed-role authorization. |
| Deterministic interview plans | PRD 20–41, 198 | Jobs + Interviewer Builder | VERIFIED | Ordered sections/questions/competencies, duration consistency, tenant isolation. |
| Interviewer configuration | PRD 20–41, 198 | Jobs + Interviewer Builder | VERIFIED | Bounded config, route-bound UI/actions, fixed-role persistence, provider-backed abuse matrix. |
| Non-overridable hiring guardrails | PRD 20–41, 198 | Jobs + Interviewer Builder | VERIFIED | Application validator plus authoritative DB save/publish enforcement and adversarial E2E. |
| Draft/publish interviewer state | PRD 20–41, 198 | Jobs + Interviewer Builder | VERIFIED | Role-gated atomic publish with completeness/duration checks and idempotent repeat behavior. |
| Immutable interviewer versions | PRD 20–41, 198 | Jobs + Interviewer Builder | VERIFIED | Snapshot/version provenance, member-only RLS, update/delete denial. |
| Non-billable interviewer preview | PRD 20–41, 198 | Jobs + Interviewer Builder | VERIFIED | `billable=false`, `persisted=false`, tenant/authz denial, no extra version created. |
| M03 responsive/keyboard/provider closeout | PRD 20–41, 198 | Jobs + Interviewer Builder | VERIFIED | `interviewer-builder-ui.spec.ts` + provider abuse E2E; implementation head CI #430 passed. |
| Jobs + Interviewer Builder milestone | PRD 20–41, 198 | Jobs + Interviewer Builder | ACTIVE | Engineering/review complete; final documentation-head CI and merge/post-merge verification pending. |
| Candidates and invitations | PRD roadmap | Candidates + Invitations | PLANNED | Narrow invitation-scoped authorization. |
| Realtime AI interview | PRD roadmap | Realtime AI Interview | PLANNED | Realtime failure/continuity scenarios required. |
| Durable transcript/session continuity | PRD roadmap | Transcript + Durable Session | PLANNED | Finalized immutable chronological turns. |
| Evidence-grounded assessment | PRD roadmap | Evidence-Based Assessment | PLANNED | Runtime schema/evidence validation + provenance. |
| Hiring-team review | PRD roadmap | Hiring Team Review | PLANNED | Humans remain decision makers. |
| Billing and usage | PRD roadmap | Billing + Usage | PLANNED | Server-authoritative usage/idempotency. |
| AI quality, guardrails, and evals | PRD roadmap | AI Quality / Guardrails / Evals | PLANNED | Evals required for measurable AI behavior. |
| Enterprise readiness / integrations / advanced formats | PRD roadmap | Later milestones | PLANNED | Deferred to roadmap milestones. |
