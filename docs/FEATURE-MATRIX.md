# Feature Matrix

Status meanings: `PLANNED`, `ACTIVE`, `IMPLEMENTED`, `VERIFIED`, `BLOCKED`, `DEFERRED`.

| Capability | PRD ownership | Milestone | Status | Evidence / note |
|---|---|---|---|---|
| Repository/application foundation | Foundation | Product Foundation | VERIFIED | PR #2 integrated; CI #57. |
| Durable autonomous-development control plane | Owner framework + PRD autonomy | Product Foundation | VERIFIED | Framework/source/PRD gates enforced in CI. |
| Complete PRD/requirements corpus in Git | PRD 1–242 | Product Foundation | VERIFIED | Durable source + manifest + coverage verifier. |
| Reproducible dependency graph | Product Foundation | Product Foundation | VERIFIED | `pnpm-lock.yaml` + frozen CI installs. |
| SaaS shell + auth/profile foundation | PRD 15–17, 196 | SaaS Shell + Auth | VERIFIED | PR #3 integrated; post-merge CI #157. |
| Organizations + RBAC / tenant isolation | PRD 8–14, 18–19, 197 | Organizations + RBAC | VERIFIED | PR #4 integrated; post-merge CI #232. |
| Jobs + requirements / competencies / rubrics / question bank | PRD 20–41, 198 | Jobs + Interviewer Builder | VERIFIED | PR #5; provider-backed role/tenant coverage. |
| Deterministic interview plan + interviewer configuration | PRD 20–41, 198 | Jobs + Interviewer Builder | VERIFIED | Ordered bounded plan/config with UI/provider tests. |
| Non-overridable hiring guardrails + immutable published versions | PRD 20–41, 198 | Jobs + Interviewer Builder | VERIFIED | DB + application enforcement, version provenance, adversarial E2E. |
| Non-billable interviewer preview + accessible builder closeout | PRD 20–41, 198 | Jobs + Interviewer Builder | VERIFIED | PR #5 integrated; post-merge CI #432. |
| Candidate records | PRD 42–57, 199 | Candidates + Invitations | VERIFIED | Tenant/job-bound normalized candidate persistence and provider isolation. |
| Opaque expiring/revocable invitation tokens | PRD 42–57, 199 | Candidates + Invitations | VERIFIED | 32 random bytes, base64url, SHA-256 hash-only storage, RLS and binding constraints. |
| Invitation lifecycle and replay protection | PRD 42–57, 199 | Candidates + Invitations | VERIFIED | Authoritative monotonic RPC, timestamps, terminal fail-closed behavior. |
| Narrow public candidate invitation access | PRD 42–57, 199 | Candidates + Invitations | VERIFIED | Server-side token hashing + bounded safe public projection. |
| Candidate pre-interview experience | PRD 42–57, 199 | Candidates + Invitations | VERIFIED | Company/role/duration/format/technical/privacy/prerequisite UI. |
| AI/privacy disclosure + explicit consent evidence | PRD 42–57, 199 | Candidates + Invitations | VERIFIED | Versioned append-only consent for AI/transcription/data/retention; start gated. |
| Accommodation/support path | PRD 42–57, 199 | Candidates + Invitations | VERIFIED | Owner/admin-configured support contacts exposed safely to candidate. |
| Candidate security/accessibility/browser closeout | PRD 42–57, 199 | Candidates + Invitations | VERIFIED | `candidate-invitation-ui.spec.ts`; implementation head CI #507 / `34691558117`. |
| Candidates + Invitations milestone | PRD 42–57, 199 | Candidates + Invitations | ACTIVE | Implementation/review complete; final documentation-head CI + merge/post-merge verification pending. |
| Realtime AI interview | PRD roadmap | Realtime AI Interview | PLANNED | Next milestone after M04 integration; realtime failure/continuity scenarios required. |
| Durable transcript/session continuity | PRD roadmap | Transcript + Durable Session | PLANNED | Finalized immutable chronological turns. |
| Evidence-grounded assessment | PRD roadmap | Evidence-Based Assessment | PLANNED | Runtime schema/evidence validation + provenance. |
| Hiring-team review | PRD roadmap | Hiring Team Review | PLANNED | Humans remain decision makers. |
| Billing and usage | PRD roadmap | Billing + Usage | PLANNED | Server-authoritative usage/idempotency. |
| AI quality, guardrails, and evals | PRD roadmap | AI Quality / Guardrails / Evals | PLANNED | Evals required for measurable AI behavior. |
| Enterprise readiness / integrations / advanced formats | PRD roadmap | Later milestones | PLANNED | Deferred to roadmap milestones. |
