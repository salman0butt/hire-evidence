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
| Realtime authorization + authoritative attempt binding | PRD 58+, 200 | Realtime AI Interview | IMPLEMENTED | Consent/version gates, authoritative attempt persistence, production realtime-session, and capability-bound progress boundary are implemented; live-provider closeout remains. |
| Short-lived Gemini realtime credential issuance | PRD 58+, 200 | Realtime AI Interview | IMPLEMENTED | `GEMINI_API_KEY` remains server-only; authorized browser sessions receive constrained ephemeral credentials. Live provider acceptance remains open. |
| Browser/network/microphone diagnostics | PRD 58+, 200 | Realtime AI Interview | VERIFIED | Secure-context/media/getUserMedia/AudioContext/AudioWorklet/permission/device/input/network diagnostics with deterministic browser coverage. |
| Accessible candidate technical-check UI | PRD 58+, 200 | Realtime AI Interview | VERIFIED | Semantic status/recovery UI, keyboard focus, device selection, denial/retry recovery, and mobile no-overflow covered by browser E2E. |
| Selected microphone acquisition | PRD 58+, 200 | Realtime AI Interview | VERIFIED | Selected device is used transiently; tracks are released safely; later full gates green. |
| Candidate microphone enumeration/selection UX | PRD 58+, 200 | Realtime AI Interview | VERIFIED | Accessible selection after explicit access and re-check behavior are implemented and browser-covered. |
| Usable input-level readiness | PRD 58+, 200 | Realtime AI Interview | VERIFIED | Readiness stays technical-only and cannot become candidate performance evidence. |
| Deterministic Web Audio capture | PRD 58+, 200 | Realtime AI Interview | VERIFIED | Mono worklet capture, mute, stale-generation rejection, and cleanup are covered. |
| Provider-neutral realtime transport + Gemini adapter | PRD 58+, 200 | Realtime AI Interview | IMPLEMENTED | App-owned transport boundary with provider schema isolated in Gemini adapter; production browser composition is present. |
| AI audio playback + barge-in | PRD 58+, 200 | Realtime AI Interview | VERIFIED | Serialized playback and stale-callback protection; candidate speech and provider interruption stop obsolete playback. RED CI #772 → GREEN CI #773. |
| Explicit realtime connection/recovery state | PRD 58+, 200 | Realtime AI Interview | VERIFIED | App-owned state machine, accessible controls, generation-scoped recovery, and bounded technical recovery verified in provider-neutral scope. |
| Immutable interview-plan execution | PRD 58+, 200 | Realtime AI Interview | VERIFIED | Immutable server-derived plan, exact cursor, current-question-only authority, replay/out-of-order rejection. |
| Realtime pacing/time budget | PRD 58+, 200 | Realtime AI Interview | VERIFIED | Monotonic active-time accounting with technical downtime separated from candidate evidence. |
| Bounded neutral job-related follow-ups | PRD 58+, 200 | Realtime AI Interview | VERIFIED | Configured + absolute bounds with prohibited inference rejection. |
| Production realtime launcher/runtime composition | PRD 58+, 200 | Realtime AI Interview | IMPLEMENTED | Candidate page authorizes session, creates capture/playback/Gemini transport behind app-owned interfaces, renders authoritative snapshots, and exposes mute/end controls. |
| Same-authoritative-attempt reconnect | PRD 58+, 200 | Realtime AI Interview | IMPLEMENTED | Capability-bound checkpoints, idempotent processed events, persistence gating, immutable-plan restoration, stale-generation rejection, and deterministic disconnect→reauthorize browser E2E. |
| Timeout/error recovery | PRD 58+, 200 | Realtime AI Interview | VERIFIED | Provider-neutral bounded retry vs terminal-safe decisions; live Gemini timeout/recovery acceptance remains part of milestone closeout. |
| Deterministic production browser acceptance | PRD 58+, 200 | Realtime AI Interview | VERIFIED | Production launcher/runtime wiring, credential non-display, same-attempt reconnect, mute/end, readiness, accessibility/mobile, and safe unavailable-provider behavior pass through behavioral CI #773. |
| Stable live Gemini multi-turn realtime interview | PRD 58+, 200 | Realtime AI Interview | BLOCKED | Milestone exit still requires controlled live Gemini completion plus interruption/barge-in, timeout/error recovery, and bounded reconnect using server `GEMINI_API_KEY`. |
| Durable transcript/session continuity | PRD roadmap | Transcript + Durable Session | PLANNED | Finalized immutable chronological turns. |
| Evidence-grounded assessment | PRD roadmap | Evidence-Based Assessment | PLANNED | Runtime schema/evidence validation + provenance. |
| Hiring-team review | PRD roadmap | Hiring Team Review | PLANNED | Humans remain decision makers. |
| Billing and usage | PRD roadmap | Billing + Usage | PLANNED | Server-authoritative usage/idempotency. |
| AI quality, guardrails, and evals | PRD roadmap | AI Quality / Guardrails / Evals | PLANNED | Evals required for measurable AI behavior. |
| Enterprise readiness / integrations / advanced formats | PRD roadmap | Later milestones | PLANNED | Deferred to roadmap milestones. |
