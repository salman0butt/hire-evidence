# Feature Matrix

Status meanings: `PLANNED`, `ACTIVE`, `IMPLEMENTED`, `VERIFIED`, `BLOCKED`, `DEFERRED`.

`IMPLEMENTED` means code/artifacts exist. `VERIFIED` additionally requires applicable acceptance criteria, review, and exact-state verification evidence.

| Capability | PRD ownership | Milestone | Status | Evidence / note |
|---|---|---|---|---|
| Repository/application foundation | Foundation sections / milestone ledger | Product Foundation | VERIFIED | PR #2 integrated to `main`; `64ebeb4…` passed CI #57. |
| Durable autonomous-development control plane | Owner framework + PRD autonomy sections | Product Foundation | VERIFIED | Integrated on `main`; framework/source/PRD gates pass. |
| Complete PRD/requirements corpus in Git | PRD coverage and autonomous-development requirements | Product Foundation | VERIFIED | Durable source + manifest; sections 1–242 coverage enforced in CI. |
| Reproducible dependency graph | Product Foundation build/CI requirements | Product Foundation | VERIFIED | Generated `pnpm-lock.yaml` + frozen installation enforced and passing. |
| M01.1 premium marketing shell + pricing + SEO | PRD 15–17, 196 | SaaS Shell + Auth | VERIFIED | `6107253…`, CI #64. |
| Supabase SSR/session infrastructure | PRD 16, 196 | SaaS Shell + Auth | VERIFIED | Env validation, generated Supabase deps, browser/server factories, request proxy, safe redirects; `c1a1120…`, CI #83. |
| Core signup/login/logout/verification | PRD 16, 196 | SaaS Shell + Auth | VERIFIED | Provider-independent; `32326d4…`, CI #103. Provider-backed E2E remains M01.7. |
| Password recovery | PRD 16, 196 | SaaS Shell + Auth | VERIFIED | Forgot/reset UI/actions, recovery confirmation, generic request state, expired-link handling, configured-origin redirects; `b048782…`, CI #121. Provider-backed recovery remains M01.7. |
| Protected authenticated application shell | PRD 16, 196 | SaaS Shell + Auth | PLANNED | M01.5 — exact next capability. |
| Basic own-user profile + RLS | PRD 17, 196 | SaaS Shell + Auth | PLANNED | M01.6; cross-user denial evidence required. |
| Organizations and RBAC | PRD milestone roadmap | Organizations + RBAC | PLANNED | Requires complete M01. |
| Jobs and interviewer builder | PRD milestone roadmap | Jobs + Interviewer Builder | PLANNED | Includes immutable published configuration/versioning. |
| Candidates and invitations | PRD milestone roadmap | Candidates + Invitations | PLANNED | Candidate authorization narrow and invitation-scoped. |
| Realtime AI interview | PRD milestone roadmap | Realtime AI Interview | PLANNED | Permissions/audio/turn-taking/disconnect/reconnect/provider failure required. |
| Durable transcript/session continuity | PRD milestone roadmap | Transcript + Durable Session | PLANNED | Finalized immutable chronological turns; partial stream UI-only. |
| Evidence-grounded assessment | PRD milestone roadmap | Evidence-Based Assessment | PLANNED | Runtime schema + transcript evidence validation + provenance. |
| Hiring-team review | PRD milestone roadmap | Hiring Team Review | PLANNED | Humans remain decision makers. |
| Billing and usage | PRD milestone roadmap | Billing + Usage | PLANNED | Server-authoritative usage and idempotent finalization. |
| AI quality, guardrails, and evals | PRD milestone roadmap | AI Quality / Guardrails / Evals | PLANNED | Evals required for measurable AI behavior. |
| Enterprise readiness | PRD milestone roadmap | Enterprise Readiness | PLANNED | Retained for later execution. |
| Integrations | PRD milestone roadmap | Integrations | PLANNED | Retained for later execution. |
| Coding interviews | PRD milestone roadmap | Coding Interview | PLANNED | Retained for later execution. |
| Advanced interview formats | PRD milestone roadmap | Advanced Interview Formats | PLANNED | Retained for later execution. |
| Enterprise compliance program | PRD milestone roadmap | Enterprise Compliance | PLANNED | Retained for later execution/current legal research. |
