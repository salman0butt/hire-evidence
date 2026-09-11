# Feature Matrix

Status meanings: `PLANNED`, `ACTIVE`, `IMPLEMENTED`, `VERIFIED`, `BLOCKED`, `DEFERRED`.

`IMPLEMENTED` means code/artifacts exist. `VERIFIED` additionally requires applicable acceptance criteria, review, and exact-state verification evidence.

| Capability | PRD ownership | Milestone | Status | Evidence / note |
|---|---|---|---|---|
| Repository/application foundation | Foundation | Product Foundation | VERIFIED | PR #2 integrated to `main`; `64ebeb4…`, CI #57. |
| Durable autonomous-development control plane | Owner framework + PRD autonomy | Product Foundation | VERIFIED | Framework/source/PRD gates enforced in CI. |
| Complete PRD/requirements corpus in Git | PRD 1–242 | Product Foundation | VERIFIED | Durable source + manifest + coverage verifier. |
| Reproducible dependency graph | Product Foundation | Product Foundation | VERIFIED | `pnpm-lock.yaml` + frozen CI installs. |
| Premium marketing shell + pricing + SEO | PRD 15–17, 196 | SaaS Shell + Auth | VERIFIED | M01 integrated via PR #3; post-merge CI #157. |
| Supabase SSR/session infrastructure | PRD 16, 196 | SaaS Shell + Auth | VERIFIED | Real provider-backed M01 closeout; post-merge CI #157. |
| Signup/login/logout/email verification | PRD 16, 196 | SaaS Shell + Auth | VERIFIED | Real provider lifecycle and post-merge verification. |
| Password recovery | PRD 16, 196 | SaaS Shell + Auth | VERIFIED | Real recovery flow verified before M01 merge. |
| Protected authenticated application shell | PRD 16, 196 | SaaS Shell + Auth | VERIFIED | Server-authoritative guard/navigation + browser evidence. |
| Basic own-user profile + RLS | PRD 17, 196 | SaaS Shell + Auth | VERIFIED | Own-row persistence and mutual cross-user denial verified. |
| M01 accessibility/browser closeout | PRD 15–17, 196 | SaaS Shell + Auth | VERIFIED | Public/authenticated browser evidence. |
| Organization + membership database foundation | PRD 8–14, 18–19, 197 | Organizations + RBAC | VERIFIED | Fixed role enum, organizations/memberships, private auth helpers, RLS, authenticated atomic organization bootstrap; CI #161 and later. |
| Fixed organization RBAC + input validation | PRD 8–14, 18–19, 197 | Organizations + RBAC | VERIFIED | RED `6c2719c…` CI #162 → GREEN `ed9b3d52…` CI #163. |
| Organization onboarding | PRD 8–14, 18–19, 197 | Organizations + RBAC | VERIFIED | RED `955ea259…` CI #165; build defect isolated in CI #167; fix `b817f49a…` passed full CI #168. |
| Tenant-aware organization shell/navigation | PRD 8–14, 18–19, 197 | Organizations + RBAC | VERIFIED | RED `6a47c0ee…` CI #169 → GREEN `709993dd…` CI #170; membership context is authenticated/RLS-backed. |
| Organizations and RBAC milestone | PRD 8–14, 18–19, 197 | Organizations + RBAC | ACTIVE | Draft PR #4. Membership-management owner invariants, invitations, settings and final Org A/Org B/unauthenticated isolation remain mandatory. |
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
