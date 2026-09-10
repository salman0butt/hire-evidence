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
| Core signup/login/logout/verification | PRD 16, 196 | SaaS Shell + Auth | VERIFIED | Provider-independent; `32326d4…`, CI #103. |
| Password recovery | PRD 16, 196 | SaaS Shell + Auth | VERIFIED | Provider-independent; `b048782…`, CI #121. |
| Protected authenticated application shell | PRD 16, 196 | SaaS Shell + Auth | VERIFIED | Server-authoritative guard/navigation + unauthenticated browser redirect; `f912da9…`, CI #127. |
| Basic own-user profile + RLS | PRD 17, 196 | SaaS Shell + Auth | IMPLEMENTED | Migration, own-user repository/action, validation/UI and ownership-policy tests at `e9c2ad64…`, CI #130. Real Supabase User A/User B denial still required before VERIFIED. |
| M01 provider-independent accessibility/browser closeout | PRD 15–17, 196 | SaaS Shell + Auth | VERIFIED | Mobile no-overflow, keyboard auth focus, labeled auth controls, mobile protected-route redirect; `061762ec…`, CI #134. Provider-backed accessibility/auth evidence remains separate. |
| M01 provider-backed auth/profile E2E | PRD 16–17, 196 | SaaS Shell + Auth | BLOCKED | Requires configured Supabase test project and real test identities; placeholder CI credentials/mocks do not count. |
| Organizations and RBAC | PRD roadmap | Organizations + RBAC | PLANNED | Requires complete M01. |
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
