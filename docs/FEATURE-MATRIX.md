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
| Jobs + requirements / competencies / rubrics / question bank | PRD 20–41, 198 | Jobs + Interviewer Builder | VERIFIED | PR #5 integrated; provider-backed role/tenant coverage. |
| Deterministic interview plan + interviewer configuration | PRD 20–41, 198 | Jobs + Interviewer Builder | VERIFIED | Ordered bounded plan/config with UI/provider tests. |
| Non-overridable hiring guardrails + immutable published versions | PRD 20–41, 198 | Jobs + Interviewer Builder | VERIFIED | DB + application enforcement, version provenance, adversarial E2E. |
| Non-billable interviewer preview + accessible builder closeout | PRD 20–41, 198 | Jobs + Interviewer Builder | VERIFIED | PR #5 integrated; post-merge CI #432. |
| Candidate records + secure invitations | PRD 42–57, 199 | Candidates + Invitations | VERIFIED | PR #6 integrated as `943e8a5…`; post-merge CI #517. |
| Invitation lifecycle, public projection, consent, support path | PRD 42–57, 199 | Candidates + Invitations | VERIFIED | Provider/browser/security closeout complete on merged M04. |
| Realtime authorization + authoritative attempt binding | PRD 58+, 200 | Realtime AI Interview | ACTIVE | Provider-neutral authorization/persistence boundaries verified; provider-specific production issuance still unresolved. |
| Short-lived realtime provider credential issuance | PRD 58+, 200 | Realtime AI Interview | BLOCKED | Lifetime/injected boundary exists, but no authoritative realtime provider SDK/configuration exists. Do not guess a vendor. |
| Browser/network/microphone diagnostics | PRD 58+, 200 | Realtime AI Interview | ACTIVE | Secure context/media/getUserMedia/AudioContext/AudioWorklet/permission/input/network diagnostics; CI #545/#561. |
| Accessible candidate technical-check UI | PRD 58+, 200 | Realtime AI Interview | ACTIVE | Semantic status/recovery UI integrated before consent; candidate device-selection/accessibility closeout remains. |
| Selected microphone acquisition | PRD 58+, 200 | Realtime AI Interview | IMPLEMENTED | RED CI #562 → full-gate GREEN CI #563 at `2708322…`; selected `deviceId` is used transiently and tracks are immediately released. |
| Candidate microphone enumeration/selection UX | PRD 58+, 200 | Realtime AI Interview | ACTIVE | Next M05.3 unit: enumerate audio inputs only after explicit access, allow accessible selection, then re-check selected device. |
| Usable input-level readiness | PRD 58+, 200 | Realtime AI Interview | PLANNED | Required by M05 design; must not become candidate performance evidence. |
| Deterministic Web Audio capture | PRD 58+, 200 | Realtime AI Interview | PLANNED | M05.4. |
| Provider-neutral realtime transport | PRD 58+, 200 | Realtime AI Interview | PLANNED | M05.5; selected provider adapter only when authoritative. |
| AI audio playback + barge-in | PRD 58+, 200 | Realtime AI Interview | PLANNED | M05.6/M05.11. |
| Explicit realtime connection/recovery state | PRD 58+, 200 | Realtime AI Interview | PLANNED | M05.7/M05.12/M05.13. |
| Immutable interview-plan execution | PRD 58+, 200 | Realtime AI Interview | PLANNED | M05.8; model/candidate content cannot rewrite plan. |
| Realtime pacing/time budget | PRD 58+, 200 | Realtime AI Interview | PLANNED | M05.9; technical downtime kept separate from candidate evidence. |
| Bounded neutral job-related follow-ups | PRD 58+, 200 | Realtime AI Interview | PLANNED | M05.10; configured bound + absolute safety ceiling. |
| Stable multi-turn realtime interview | PRD 58+, 200 | Realtime AI Interview | ACTIVE | Milestone exit; full deterministic browser E2E and all M05 tasks remain incomplete. |
| Durable transcript/session continuity | PRD roadmap | Transcript + Durable Session | PLANNED | Finalized immutable chronological turns. |
| Evidence-grounded assessment | PRD roadmap | Evidence-Based Assessment | PLANNED | Runtime schema/evidence validation + provenance. |
| Hiring-team review | PRD roadmap | Hiring Team Review | PLANNED | Humans remain decision makers. |
| Billing and usage | PRD roadmap | Billing + Usage | PLANNED | Server-authoritative usage/idempotency. |
| AI quality, guardrails, and evals | PRD roadmap | AI Quality / Guardrails / Evals | PLANNED | Evals required for measurable AI behavior. |
| Enterprise readiness / integrations / advanced formats | PRD roadmap | Later milestones | PLANNED | Deferred to roadmap milestones. |
