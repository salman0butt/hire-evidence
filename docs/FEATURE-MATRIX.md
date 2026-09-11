# Feature Matrix

Status meanings: `PLANNED`, `ACTIVE`, `IMPLEMENTED`, `VERIFIED`, `BLOCKED`, `DEFERRED`.

`IMPLEMENTED` means code/artifacts exist. `VERIFIED` additionally requires applicable acceptance criteria, review, and exact-state verification evidence.

| Capability | PRD ownership | Milestone | Status | Evidence / note |
|---|---|---|---|---|
| Repository/application foundation | Foundation | Product Foundation | VERIFIED | PR #2 integrated to `main`; `64ebeb4…`, CI #57. |
| Durable autonomous-development control plane | Owner framework + PRD autonomy | Product Foundation | VERIFIED | Framework/source/PRD gates enforced in CI. |
| Complete PRD/requirements corpus in Git | PRD 1–242 | Product Foundation | VERIFIED | Durable source + manifest + coverage verifier. |
| Reproducible dependency graph | Product Foundation | Product Foundation | VERIFIED | `pnpm-lock.yaml` + frozen CI installs. |
| M01.1 premium marketing shell + pricing + SEO | PRD 15–17, 196 | SaaS Shell + Auth | VERIFIED | `6107253…`, CI #64. |
| Supabase SSR/session infrastructure | PRD 16, 196 | SaaS Shell + Auth | VERIFIED | `c1a1120…`, CI #83. |
| Core signup/login/logout/verification | PRD 16, 196 | SaaS Shell + Auth | VERIFIED | Unit/integration evidence plus real provider lifecycle in CI #148. |
| Password recovery | PRD 16, 196 | SaaS Shell + Auth | VERIFIED | Unit/integration evidence plus real recovery email/reset/login in CI #148. |
| Protected authenticated application shell | PRD 16, 196 | SaaS Shell + Auth | VERIFIED | Server-authoritative guard/navigation and authenticated `/app` entry verified in CI #148. |
| Basic own-user profile + RLS | PRD 17, 196 | SaaS Shell + Auth | VERIFIED | Real local Supabase migration + own-row persistence + User A/User B mutual cross-profile SELECT/UPDATE denial; `7348526…`, CI #148. |
| M01 accessibility/browser closeout | PRD 15–17, 196 | SaaS Shell + Auth | VERIFIED | Public/unauthenticated coverage plus authenticated 390×844 profile no-overflow and keyboard focus in CI #148. |
| Vitest ESM configuration maintenance | Engineering quality | SaaS Shell + Auth | VERIFIED | `85ff107…`, CI #141; prior loader warning removed. |
| M01 provider-backed auth/profile E2E | PRD 16–17, 196 | SaaS Shell + Auth | VERIFIED | Local Supabase Auth/PostgREST/Mailpit + production app; full auth lifecycle, profile persistence, RLS isolation, replayed-token safety; 8/8 Playwright, CI #148. |
| Organizations and RBAC | PRD roadmap | Organizations + RBAC | PLANNED | Starts only after M01 merge + post-merge main verification. |
| Jobs and interviewer builder | PRD roadmap | Jobs + Interviewer Builder | PLANNED | Immutable published configuration/versioning. |
| Candidates and invitations | PRD roadmap | Candidates + Invitations | PLANNED | Narrow invitation-scoped authorization. |
| Realtime AI interview | PRD roadmap | Realtime AI Interview | PLANNED | Realtime failure/continuity scenarios required. |
| Durable transcript/session continuity | PRD roadmap | Transcript + Durable Session | PLANNED | Finalized immutable chronological turns. |
| Evidence-grounded assessment | PRD roadmap | Evidence-Based Assessment | PLANNED | Runtime schema/evidence validation + provenance. |
| Hiring-team review | PRD roadmap | Hiring Team Review | PLANNED | Humans remain decision makers. |
| Billing and usage | PRD roadmap | Billing + Usage | PLANNED | Server-authoritative usage/idempotency. |
| AI quality, guardrails, and evals | PRD roadmap | AI Quality / Guardrails / Evals | PLANNED | Evals required for measurable AI behavior. |
| Enterprise readiness | PRD roadmap | Enterprise Readiness | PLANNED | Later milestone. |
| Integrations | PRD roadmap | Integrations | PLANNED | Later milestone. |
| Coding interviews | PRD roadmap | Coding Interview | PLANNED | Later milestone. |
| Advanced interview formats | PRD roadmap | Advanced Interview Formats | PLANNED | Later milestone. |
| Enterprise compliance program | PRD roadmap | Enterprise Compliance | PLANNED | Current legal research required when active. |