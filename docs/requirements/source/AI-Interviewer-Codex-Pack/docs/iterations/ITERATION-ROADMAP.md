# Iteration Roadmap

This is the default decomposition. Codex may refine iteration boundaries based on repository evidence, but must preserve milestone scope and PRD requirements.

## M00 — Product Foundation

- **M00.1 — Repository bootstrap:** Next.js, TypeScript, package manager, lint/format, environment validation.
- **M00.2 — Testing foundation:** unit/component/E2E test runners and conventions.
- **M00.3 — CI foundation:** lint, typecheck, tests, build, smoke E2E.
- **M00.4 — Governance docs:** README, AGENTS, PRD, architecture, security, AI docs.
- **M00.5 — Milestone recovery:** CURRENT.md, templates, scripts, verified fresh-session recovery.

## M01 — SaaS Shell + Auth

- **M01.1 — Marketing shell:** premium homepage, responsive layout, SEO baseline.
- **M01.2 — Supabase auth infrastructure:** clients, cookies/session boundaries, env/config.
- **M01.3 — Core auth flows:** signup, login, logout, verification.
- **M01.4 — Recovery flows:** forgot/reset password and error states.
- **M01.5 — Authenticated app shell:** protected routing/navigation.
- **M01.6 — Basic profile:** minimum profile persistence/settings.
- **M01.7 — Accessibility + E2E:** keyboard, mobile, visual/auth scenarios.

## M02 — Organizations + RBAC

- **M02.1 — Organization schema:** organizations + memberships.
- **M02.2 — Explicit RBAC:** owner/admin/recruiter/hiring-manager/reviewer capabilities.
- **M02.3 — RLS policies:** tenant-owned read/write isolation.
- **M02.4 — Organization UI/navigation:** onboarding and tenant-aware shell.
- **M02.5 — Team invitations:** secure invitation lifecycle/roles/expiry.
- **M02.6 — Organization settings:** bounded MVP settings.
- **M02.7 — Adversarial tenancy verification:** Org A vs Org B vs unauthenticated direct API attempts.

## M03 — Jobs + Interviewer Builder

- **M03.1 — Jobs:** CRUD, description, requirements, seniority and role metadata.
- **M03.2 — Competencies:** explicit job-related competency model.
- **M03.3 — Rubrics:** 1–5 observable evidence definitions, weights and validation.
- **M03.4 — Question bank:** questions, competency links, difficulty, expected areas, limits.
- **M03.5 — Interview plan:** deterministic sections, duration budgets, question coverage.
- **M03.6 — Interviewer configuration:** persona, language, type, guidelines and follow-up policy.
- **M03.7 — Guardrail validation:** reject prohibited/discriminatory configuration.
- **M03.8 — Draft/publish:** state transitions and validation.
- **M03.9 — Immutable versioning:** interviewer/rubric/prompt snapshots.
- **M03.10 — Preview:** simulated/non-billable preview workflow.
- **M03.11 — Builder E2E:** create job → configure → validate → publish immutable version.

## M04 — Candidates + Invitations

- **M04.1 — Candidate records:** minimal candidate identity + job relation.
- **M04.2 — Secure token service:** opaque random tokens, hash-at-rest, expiry/revocation.
- **M04.3 — Invitation lifecycle:** draft/sent/opened/started/completed/expired/revoked.
- **M04.4 — Public candidate route:** narrowly scoped server lookup/authorization.
- **M04.5 — Pre-interview experience:** company/role/duration/format/technical requirements.
- **M04.6 — Disclosure + consent:** AI/transcription/data/retention events.
- **M04.7 — Accommodation/support path:** alternative-process information.
- **M04.8 — Security E2E:** enumeration/replay/expiry/revocation/completed-token cases.

## M05 — Realtime AI Interview

- **M05.1 — Reference characterization:** inspect Talk Tutor patterns; document what to reuse vs not copy.
- **M05.2 — Session authorization/provider boundary:** server-authorized realtime session setup.
- **M05.3 — Browser compatibility + microphone diagnostics:** feature detection, permission/input/level/network readiness.
- **M05.4 — Web Audio capture:** deterministic audio capture lifecycle.
- **M05.5 — Realtime transport:** provider connect/send/receive lifecycle.
- **M05.6 — AI audio playback:** output queue and clean teardown.
- **M05.7 — Connection state machine:** explicit idle/connecting/connected/recovering/ended/error states.
- **M05.8 — Interview-plan execution:** deterministic sections/questions and phase transitions.
- **M05.9 — Pacing/time budget:** remaining time and graceful section/interview completion.
- **M05.10 — Bounded follow-ups:** neutral clarification/example/missing-dimension rules.
- **M05.11 — Barge-in:** stop AI playback when candidate interrupts without corrupting state.
- **M05.12 — Timeout/error handling:** browser/provider/microphone failures.
- **M05.13 — Reconnect:** bounded recovery into the same authoritative attempt.
- **M05.14 — Full realtime E2E:** stable multi-turn voice interview across failure scenarios.

## M06 — Transcript + Durable Session

- **M06.1 — Provider event normalization:** single internal event vocabulary.
- **M06.2 — Transcript state:** partial UI text vs finalized immutable turns.
- **M06.3 — Durable messages:** sequence, speaker, timestamps and persistence.
- **M06.4 — Correctness guards:** no duplication, order/speaker invariants.
- **M06.5 — Idempotent attempt lifecycle:** authoritative start/end and retry safety.
- **M06.6 — Reconnect persistence:** resume without cross-session transcript leakage.
- **M06.7 — Technical interruption events:** separate platform failures from candidate behavior.
- **M06.8 — Session finalization:** seal transcript, duration, state and assessment trigger exactly once.
- **M06.9 — Durability E2E:** refresh/disconnect/reconnect/finalize scenarios.

## M07 — Evidence-Based Assessment Engine

- **M07.1 — Assessment domain/schema:** runtime-validatable structures and states.
- **M07.2 — Trusted prompt composition:** immutable rubric/job/questions + delimited transcript.
- **M07.3 — Competency scoring:** rubric-aligned 1–5/null behavior.
- **M07.4 — Evidence citations:** candidate message sequences/excerpts.
- **M07.5 — Evidence validator:** sequence/speaker/excerpt existence and fabricated-citation rejection.
- **M07.6 — Evidence sufficiency + question coverage:** insufficient/partial/sufficient and asked/answered/skipped.
- **M07.7 — Prompt-injection defense:** transcript treated strictly as data.
- **M07.8 — Provenance:** model/prompt/rubric/interviewer/guardrail version capture.
- **M07.9 — Idempotent generation:** pending/processing/completed/failed atomic claim.
- **M07.10 — Regeneration/history:** preserve prior assessment versions.
- **M07.11 — Golden fixtures:** deterministic and model-based assessment test cases.

## M08 — Hiring Team Review Experience

- **M08.1 — Candidate result page:** identity/job/interview/status summary.
- **M08.2 — Competency/evidence cards:** score, rationale, sufficiency.
- **M08.3 — Transcript viewer:** speaker separation, search, markers.
- **M08.4 — Evidence deep links:** score → exact transcript turn/highlight.
- **M08.5 — Human overrides:** preserve AI score + human score + reason.
- **M08.6 — Reviewer notes + states:** awaiting review/reviewed and notes.
- **M08.7 — AI/human disagreement data:** durable comparison for evals.
- **M08.8 — Job candidate dashboard:** workflow status without AI "best candidate" ranking.
- **M08.9 — Visual/accessibility/E2E QA:** desktop/mobile and independent-review flow.

## M09 — Billing + Usage

- **M09.1 — Plan configuration:** simple organization plans/limits.
- **M09.2 — Subscription persistence:** organization billing state.
- **M09.3 — Stripe customer + checkout:** authorized organization roles only.
- **M09.4 — Webhook synchronization:** signature validation and idempotent state updates.
- **M09.5 — Billing portal + cancellation/plan changes.**
- **M09.6 — Server-authoritative usage:** interview seconds as source unit.
- **M09.7 — Usage periods/meter:** current allowance, remaining and renewal.
- **M09.8 — Server-side enforcement:** limits/entitlements cannot be bypassed by client.
- **M09.9 — Billing security/idempotency E2E:** duplicate finalization/webhooks and authorization.

## M10 — AI Quality, Guardrails & Evals

- **M10.1 — Eval harness:** interviewer/assessment/guardrails/fairness/adversarial/realtime structure.
- **M10.2 — Golden interview dataset.**
- **M10.3 — Golden assessment dataset + human calibration.**
- **M10.4 — Interviewer behavior evals.**
- **M10.5 — Assessment grounding/schema/consistency evals.**
- **M10.6 — Adversarial prompt-injection evals.**
- **M10.7 — Fairness paired evals.**
- **M10.8 — Prompt/guardrail version regression comparisons.**
- **M10.9 — AI tracing + cost/quality metadata.**
- **M10.10 — Human override/disagreement analytics.**
- **M10.11 — CI regression gates:** deterministic first, bounded live-model checks where required.

## M11 — Enterprise Readiness

- **M11.1 — Advanced immutable audit trail.**
- **M11.2 — Retention configuration.**
- **M11.3 — Complete deletion workflows:** transcript/assessment/evidence/audio/traces as applicable.
- **M11.4 — Organization branding:** safe logo/name/accent/welcome text; no CSS injection.
- **M11.5 — Security hardening + rate limits + abuse controls.**
- **M11.6 — Platform observability + incident/SLA tooling.**
- **M11.7 — Access reviews/support privileged-access controls.**
- **M11.8 — SSO/SAML only when market evidence requires it.**

## M12 — Integrations

- **M12.1 — Stable integration boundary:** outbound webhooks/public API contracts only if core domain is ready.
- **M12.2 — CSV import:** bounded candidate import if prioritized.
- **M12.3+ — ATS integrations one at a time:** Greenhouse, Lever, Ashby, Workable according to customer demand.
- For each integration: auth, mapping, idempotency, sync errors, tenant scope, audit, tests and docs before beginning the next integration.

## M13 — Coding Interview

- **M13.1 — Security/threat model:** isolated execution requirements before coding.
- **M13.2 — Editor experience:** Monaco and prompt/context model.
- **M13.3 — Sandboxed execution service:** strict isolation, quotas, network/filesystem policy.
- **M13.4 — Test execution/results.**
- **M13.5 — Code snapshots/versioning.**
- **M13.6 — AI interview follow-ups around code without leaking solutions.**
- **M13.7 — Evidence-based coding assessment.**
- **M13.8 — Adversarial sandbox/security/E2E verification.**

## M14 — Advanced Interview Formats

- Implement **one format at a time** only after core adoption.
- Candidate iterations: case study → presentation → system-design canvas → take-home review.
- Each format requires its own domain model, evidence model, accessibility path, security review, evals and E2E acceptance criteria before the next format begins.

## M15 — Enterprise Compliance Program

- **M15.1 — Current jurisdiction research:** identify target-market obligations at implementation time; PRD is not legal advice.
- **M15.2 — Candidate notices/disclosures.**
- **M15.3 — Bias-audit support and controlled evidence.**
- **M15.4 — AI-system documentation/provenance.**
- **M15.5 — Human oversight + risk-management controls.**
- **M15.6 — Data-governance and access controls.**
- **M15.7 — Accessibility/accommodation controls.**
- **M15.8 — Retention disclosures and audit exports.**
- **M15.9 — Compliance verification with legal/security review evidence.**
