# Architecture

This is the durable architecture index for fresh autonomous workers. `docs/architecture/overview.md` remains the detailed product architecture guide. When architecture documentation conflicts with the authoritative PRD, the PRD wins; when status text conflicts with actual code/tests/current CI, repository evidence wins.

## Current implemented architecture

The current codebase is intentionally small: a single Next.js App Router application with strict TypeScript, a thin health API route, environment validation, Vitest/Testing Library, Playwright smoke testing, Tailwind, ESLint, and GitHub Actions CI.

Do not add speculative services or infrastructure simply because later capabilities may need them.

## Planned product boundaries

The PRD currently points toward these logical subsystems, implemented incrementally only when their owning milestone becomes active:

- **Web/SaaS boundary:** public site, auth, organization/admin/reviewer UI.
- **Tenant domain:** organization-owned jobs, interviewer versions, candidates, attempts, reviews, subscription/usage state.
- **Candidate public boundary:** opaque invitation token with narrow server authorization and no organization-member session.
- **Realtime boundary:** browser Web Audio plus provider-specific realtime transport with explicit connection/session state.
- **Transcript boundary:** provider-event normalization, partial UI-only streaming, finalized immutable chronological turns.
- **Assessment boundary:** trusted platform policy + immutable rubric + delimited untrusted transcript → model → runtime schema/evidence validation → persistence.
- **Billing boundary:** organization-owned billing identity with server-authoritative usage and idempotent finalization.

## Primary domain chain

```text
User
→ Organization Membership
→ Organization
  → Jobs
  → Interview Agents / Immutable Versions
  → Candidates
  → Invitations
  → Interview Attempts
  → Finalized Messages
  → Assessments / Evidence
  → Human Reviews
  → Subscription / Usage
```

## Data and security boundaries

Tenant-owned data requires explicit organization isolation and, where Supabase/Postgres is introduced, RLS with cross-organization tests. Candidate access must use narrowly scoped, expiring/revocable opaque tokens and never inherit hiring-team membership privileges.

Transcripts and organization-authored text are untrusted input. AI assessment inputs must preserve immutable rubric/interviewer/prompt/guardrail provenance, validate structured outputs at runtime, and validate evidence against actual finalized transcript messages.

## Async/realtime boundaries

Do not introduce queues, background workers, or service decomposition until a concrete milestone requires asynchronous execution. Realtime work must explicitly model disconnect/reconnect, provider failures, microphone failures, timeouts, turn-taking, barge-in, transcript correctness, and attempt continuity.

## Deployment and observability

The current deployment boundary is a single web application plus CI. Add platform-specific deployment, database, billing, realtime-provider, logging, tracing, metrics, and alerting details only as their requirements become active. Every new external dependency must have failure/timeout/observability behavior defined in its capability spec.

## Architecture constraints

Use KISS and YAGNI. Prefer server state/server components where appropriate and focused client state for realtime interaction. Avoid microservices, CQRS, event sourcing, Kafka, generic workflow/agent frameworks, RAG/vector databases, or generic provider layers until requirements justify them.

Significant architectural deviations or irreversible choices belong in `docs/DECISIONS.md` or a dedicated ADR.
