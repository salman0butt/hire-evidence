# Product

## What this is

AI Interviewer is a new B2B SaaS for structured AI-assisted interviewing and evidence-based candidate assessment. It is not a fork or rename of Talk Tutor; that project is only a technical reference for selected realtime, SaaS, database, AI, and reliability patterns.

## Primary users

- organization owners/admins configuring jobs and interviewers;
- hiring-team members reviewing candidates and evidence;
- candidates completing invitation-scoped interviews;
- internal platform operators responsible for safety, reliability, billing, and compliance.

## Major planned capabilities

- SaaS shell, authentication, organizations, memberships, and RBAC;
- jobs, interviewer configuration, rubrics, questions, and immutable published versions;
- candidates and narrow, opaque invitation links;
- realtime AI interviewing with browser audio and robust connection/session handling;
- durable finalized transcripts and reconnect-safe attempt continuity;
- evidence-grounded structured assessment with provenance and guardrails;
- human hiring-team review and audit/version history;
- organization billing and server-authoritative usage;
- AI quality evals, safety/fairness guardrails, observability, enterprise readiness, integrations, coding interviews, advanced formats, and compliance capabilities defined by later PRD milestones.

## Product boundaries

AI assists structured evidence review; humans make hiring decisions. The product must not add autonomous hire/reject decisions, protected-trait inference, emotion/appearance/eye-contact scoring, accent or vocal-confidence scoring, personality inference from voice, deception detection, fabricated evidence, or cross-tenant authorization bypasses.

Candidate public authorization is invitation-scoped and must not become organization-member access. Historical interviewer/rubric/prompt/guardrail/assessment provenance must remain durable rather than silently mutating.

## Current implementation state

Implemented in `main`:

- Next.js/TypeScript application foundation;
- environment validation;
- `/api/health`;
- minimal foundation page;
- unit/component and Playwright smoke harnesses;
- GitHub Actions CI;
- core product-specific architecture/security/AI governance docs.

This foundation is **implemented but not currently considered fully VERIFIED as a milestone**, because the complete requirements corpus is not yet persisted in GitHub and the PRD coverage gate remains blocked/failing.

## Planned versus deferred

All later product capabilities remain PLANNED unless actual code/tests/CI prove otherwise. Nothing in this document upgrades a planned feature to implemented or verified state.

Future/deferred capabilities remain governed by the authoritative PRD and milestone ledgers; they must not be silently dropped.
