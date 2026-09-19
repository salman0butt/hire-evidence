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
| Candidate records + secure invitations | PRD 42–57, 199 | Candidates + Invitations | VERIFIED | PR #6 integrated as `943e8a5…`. |
| Realtime AI interview | PRD 58+, 200 | Realtime AI Interview | VERIFIED | PR #7 integrated; provider-neutral runtime, bounded plan/follow-ups, recovery and technical-only diagnostics. |
| Real external Gemini deployment smoke | deployment acceptance | Realtime AI Interview | DEFERRED | Owner-supplied real provider credential smoke is tracked in `docs/LOCAL-REALTIME-ACCEPTANCE.md`; not fabricated as repository CI evidence. |
| Provider-neutral transcript normalization | PRD 58+ durable transcript requirements | Transcript + Durable Session | VERIFIED | M06.1; partial/final speaker-aware transport events. |
| Ephemeral partial vs finalized transcript state | PRD 58+ durable transcript requirements | Transcript + Durable Session | VERIFIED | M06.2; partial hypotheses remain browser-only. |
| Immutable attempt-scoped durable transcript | PRD 58+ durable transcript requirements | Transcript + Durable Session | VERIFIED | M06.3–M06.4; monotonic sequence, idempotent identity, speaker/order/immutability guards. |
| Idempotent interview attempt lifecycle + reconnect | PRD 58+ durable session requirements | Transcript + Durable Session | VERIFIED | M06.5–M06.6; replay-safe lifecycle and same-attempt durable restoration. |
| Separate non-evaluative technical interruption events | PRD 58+ evidence-integrity requirements | Transcript + Durable Session | VERIFIED | M06.7; failures persist separately from transcript/evaluation evidence. |
| Idempotent session finalization + assessment marker | PRD 58+ durable session requirements | Transcript + Durable Session | VERIFIED | M06.8; retry-safe sealing/completion/assessment trigger. |
| Durable transcript browser acceptance | PRD roadmap | Transcript + Durable Session | VERIFIED | M06.9 RED CI #863 → GREEN CI #864; PR #8 merged and post-merge CI #875 GREEN. |
| Runtime-validatable structured assessment | PRD 69–81, 202 | Evidence-Based Assessment | VERIFIED | M07.1 schema/parser; invalid scores/states/decision-like output fail closed. |
| Trusted immutable assessment input + prompt composition | PRD 69–81, 202 | Evidence-Based Assessment | VERIFIED | M07.2; authoritative immutable assessment inputs only. |
| Rubric-aligned competency scoring | PRD 69–81, 202 | Evidence-Based Assessment | VERIFIED | M07.3; configured competencies, exact rubric levels, `1..5 | null`. |
| Evidence citations + same-attempt validation | PRD 69–81, 202 | Evidence-Based Assessment | VERIFIED | M07.4–M07.5; bounded same-attempt candidate evidence validation. |
| Evidence sufficiency + question coverage | PRD 69–81, 202 | Evidence-Based Assessment | VERIFIED | M07.6; insufficient evidence explicit and technical interruptions non-evaluative. |
| Assessment prompt-injection/prohibited-output defense | PRD 69–81, 202 | Evidence-Based Assessment | VERIFIED | M07 guardrails preserve transcript as inert data and block decision/prohibited inference output. |
| Assessment provenance | PRD 69–81, 202 | Evidence-Based Assessment | VERIFIED | Application-owned immutable provenance. |
| Idempotent append-only assessment generation persistence | PRD 69–81, 202 | Evidence-Based Assessment | VERIFIED | Tenant/attempt-scoped lifecycle and validated-only completion. |
| Immutable assessment regeneration/history | PRD 69–81, 202 | Evidence-Based Assessment | VERIFIED | Monotonic generations preserve prior payload/provenance. |
| Integrated evidence-grounded assessment acceptance | PRD 69–81, 202 | Evidence-Based Assessment | VERIFIED | PR #9 merged; post-merge main CI #920 GREEN. |
| Tenant-scoped candidate result projection/page | PRD roadmap | Hiring Team Review | VERIFIED | M08.1 exact head `f36b520e…`, CI #930 / run `35206818423`. |
| Competency/evidence review cards | PRD roadmap | Hiring Team Review | VERIFIED | M08.2 exact behavioral head `6616fcc7…`, CI #941 / run `35215607658`; immutable competency identity, validated assessment summary/cards, fail-closed decision-like payload handling. |
| Authenticated transcript review viewer | PRD roadmap | Hiring Team Review | VERIFIED | M08.3 exact head `7cb2b507…`, CI #951; dedicated hiring-team authority, ordered speaker-separated searchable inert transcript, technical events excluded. |
| Evidence deep links | PRD roadmap | Hiring Team Review | ACTIVE | M08.4; fail-closed citation resolution plus exact cited turn/excerpt jump, focus and visible highlight. |
| Human overrides / notes / review status / disagreement | PRD roadmap | Hiring Team Review | PLANNED | M08.5–M08.7; preserve AI history and reviewer attribution. |
| Job candidate workflow dashboard | PRD roadmap | Hiring Team Review | PLANNED | M08.8; neutral workflow metadata, no AI ranking. |
| Billing and usage | PRD roadmap | Billing + Usage | PLANNED | Server-authoritative usage/idempotency. |
| AI quality, guardrails, and evals | PRD roadmap | AI Quality / Guardrails / Evals | PLANNED | Evals required for measurable AI behavior. |
| Enterprise readiness / integrations / advanced formats | PRD roadmap | Later milestones | PLANNED | Deferred to roadmap milestones. |
