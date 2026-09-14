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
| Realtime authorization + authoritative attempt binding | PRD 58+, 200 | Realtime AI Interview | VERIFIED | M05 merged in PR #7; consent/version gates, attempt persistence and capability-bound progress are integrated. |
| Short-lived Gemini realtime credential issuance | PRD 58+, 200 | Realtime AI Interview | VERIFIED | Server-only provider key boundary and constrained browser credential issuance are repository-verified. |
| Browser/network/microphone diagnostics | PRD 58+, 200 | Realtime AI Interview | VERIFIED | Secure-context/media/getUserMedia/AudioContext/AudioWorklet/permission/device/input/network diagnostics with browser coverage. |
| Accessible candidate technical-check UI | PRD 58+, 200 | Realtime AI Interview | VERIFIED | Semantic status/recovery UI, keyboard focus, device selection, denial/retry recovery and mobile coverage. |
| Deterministic Web Audio capture | PRD 58+, 200 | Realtime AI Interview | VERIFIED | Mono worklet capture, mute, stale-generation rejection and cleanup are covered. |
| Provider-neutral realtime transport + Gemini adapter | PRD 58+, 200 | Realtime AI Interview | VERIFIED | App-owned transport boundary; provider schema isolated in Gemini adapter; production browser composition present. |
| AI audio playback + barge-in | PRD 58+, 200 | Realtime AI Interview | VERIFIED | Serialized playback and stale-callback protection; RED CI #772 → GREEN CI #773. |
| Immutable interview-plan execution | PRD 58+, 200 | Realtime AI Interview | VERIFIED | Immutable server-derived plan, exact cursor, replay/out-of-order rejection. |
| Bounded neutral job-related follow-ups | PRD 58+, 200 | Realtime AI Interview | VERIFIED | Configured + absolute bounds with prohibited inference rejection. |
| Production realtime launcher/runtime composition | PRD 58+, 200 | Realtime AI Interview | VERIFIED | M05 repository acceptance integrated on `main`. |
| Same-authoritative-attempt reconnect | PRD 58+, 200 | Realtime AI Interview | VERIFIED | Capability-bound checkpoints, persistence gating, stale-generation rejection and browser reconnect coverage. |
| Timeout/error recovery | PRD 58+, 200 | Realtime AI Interview | VERIFIED | Provider-neutral bounded retry vs terminal-safe decisions with failures excluded from candidate evaluation. |
| Real external Gemini deployment smoke | deployment acceptance | Realtime AI Interview | DEFERRED | Owner-supplied real provider credential smoke is tracked separately in `docs/LOCAL-REALTIME-ACCEPTANCE.md`; not fabricated as repository CI evidence. |
| Provider-neutral transcript normalization | PRD 58+ durable transcript requirements | Transcript + Durable Session | VERIFIED | M06.1; partial/final speaker-aware transport events. |
| Ephemeral partial vs finalized transcript state | PRD 58+ durable transcript requirements | Transcript + Durable Session | VERIFIED | M06.2; partial hypotheses remain browser-only. |
| Immutable attempt-scoped durable transcript | PRD 58+ durable transcript requirements | Transcript + Durable Session | VERIFIED | M06.3–M06.4; monotonic sequence, idempotent identity, speaker/order/immutability guards. |
| Idempotent interview attempt lifecycle | PRD 58+ durable session requirements | Transcript + Durable Session | VERIFIED | M06.5 retry-safe lifecycle behavior. |
| Same-attempt durable transcript reconnect | PRD 58+ durable session requirements | Transcript + Durable Session | VERIFIED | M06.6 durable bootstrap/hydration with cross-attempt isolation. |
| Separate non-evaluative technical interruption events | PRD 58+ evidence-integrity requirements | Transcript + Durable Session | VERIFIED | M06.7; provider/browser/microphone/reconnect failures persist separately from transcript/evaluation evidence. |
| Idempotent session finalization + assessment marker | PRD 58+ durable session requirements | Transcript + Durable Session | VERIFIED | M06.8; retry-safe sealing/completion/assessment trigger. |
| Durable transcript browser acceptance | PRD roadmap | Transcript + Durable Session | VERIFIED | M06.9 RED CI #863 → GREEN CI #864; reconnect-restored finalized turn visible as accessible text while disconnect remains separate technical event. |
| Evidence-grounded assessment | PRD roadmap | Evidence-Based Assessment | PLANNED | Runtime schema/evidence validation + provenance. |
| Hiring-team review | PRD roadmap | Hiring Team Review | PLANNED | Humans remain decision makers. |
| Billing and usage | PRD roadmap | Billing + Usage | PLANNED | Server-authoritative usage/idempotency. |
| AI quality, guardrails, and evals | PRD roadmap | AI Quality / Guardrails / Evals | PLANNED | Evals required for measurable AI behavior. |
| Enterprise readiness / integrations / advanced formats | PRD roadmap | Later milestones | PLANNED | Deferred to roadmap milestones. |
