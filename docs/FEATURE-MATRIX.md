# Feature Matrix

Status meanings: `PLANNED`, `ACTIVE`, `IMPLEMENTED`, `VERIFIED`, `BLOCKED`, `DEFERRED`.

`IMPLEMENTED` means code/artifacts exist. `VERIFIED` additionally requires applicable acceptance criteria, review, and exact-head verification gates.

| Capability | PRD ownership | Milestone | Status | Evidence / note |
|---|---|---|---|---|
| Repository/application foundation | Foundation sections / milestone ledger | Product Foundation | IMPLEMENTED | Merged through PR #1; final M00 closeout is verifying the reconciled PR #2 head. |
| Durable autonomous-development control plane | Owner framework upgrade + PRD autonomous-development sections | Product Foundation | IMPLEMENTED | Framework and verifier are present; all framework CI checks passed on `dcf54ace…`; final reconciliation-head review/CI pending. |
| Complete PRD/requirements corpus in Git | PRD coverage and autonomous-development requirements | Product Foundation | VERIFIED | Verified source persisted with manifest; PRD sections 1–242 coverage passed in CI run `34473131246`. |
| Reproducible dependency graph | Product Foundation build/CI requirements | Product Foundation | VERIFIED | `pnpm-lock.yaml` committed; frozen install passed in CI run `34473131246`. |
| SaaS shell and authentication | PRD milestone roadmap | SaaS Shell + Auth | PLANNED | Do not start until Product Foundation closeout is objectively complete. |
| Organizations and RBAC | PRD milestone roadmap | Organizations + RBAC | PLANNED | Requires auth/persistence foundations. |
| Jobs and interviewer builder | PRD milestone roadmap | Jobs + Interviewer Builder | PLANNED | Includes immutable published configuration/versioning requirements. |
| Candidates and invitations | PRD milestone roadmap | Candidates + Invitations | PLANNED | Candidate authorization must be narrow and invitation-scoped. |
| Realtime AI interview | PRD milestone roadmap | Realtime AI Interview | PLANNED | Must cover permissions/audio/turn-taking/disconnect/reconnect/provider failure. |
| Durable transcript/session continuity | PRD milestone roadmap | Transcript + Durable Session | PLANNED | Finalized immutable chronological turns; partial stream remains UI-only. |
| Evidence-grounded assessment | PRD milestone roadmap | Evidence-Based Assessment | PLANNED | Runtime schema + transcript evidence validation + provenance required. |
| Hiring-team review | PRD milestone roadmap | Hiring Team Review | PLANNED | Humans remain decision makers. |
| Billing and usage | PRD milestone roadmap | Billing + Usage | PLANNED | Server-authoritative usage and idempotent finalization. |
| AI quality, guardrails, and evals | PRD milestone roadmap | AI Quality / Guardrails / Evals | PLANNED | Evals required for measurable AI behavior. |
| Enterprise readiness | PRD milestone roadmap | Enterprise Readiness | PLANNED | Requirements retained for later execution. |
| Integrations | PRD milestone roadmap | Integrations | PLANNED | Requirements retained for later execution. |
| Coding interviews | PRD milestone roadmap | Coding Interview | PLANNED | Requirements retained for later execution. |
| Advanced interview formats | PRD milestone roadmap | Advanced Interview Formats | PLANNED | Requirements retained for later execution. |
| Enterprise compliance program | PRD milestone roadmap | Enterprise Compliance | PLANNED | Requirements retained for later execution. |
