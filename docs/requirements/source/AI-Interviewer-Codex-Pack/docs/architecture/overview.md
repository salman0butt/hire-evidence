# Architecture Overview

> Derived implementation guide. When it conflicts with `docs/product/PRD.md`, the PRD wins.

## Product shape

A simple organization-first Next.js SaaS with Supabase Auth/Postgres/RLS, a realtime interview subsystem, durable transcript/session persistence, an offline evidence-grounded assessment pipeline, human review, and organization billing.

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

## Boundaries

- **Web/SaaS:** homepage, auth, organization/admin/reviewer UI.
- **Tenant domain:** organization-owned jobs, interviewer configuration, candidates, attempts and reviews.
- **Candidate public boundary:** opaque invite token with narrow server authorization; no organization-member session.
- **Realtime boundary:** browser Web Audio + provider-specific realtime transport, explicit connection/session state, deterministic interview plan and bounded AI follow-ups.
- **Transcript boundary:** normalize provider events, keep partial streaming UI-only, persist finalized immutable turns in chronological order.
- **Assessment boundary:** trusted policy + immutable rubric + delimited untrusted transcript → model → runtime schema validation → evidence validation → persistence.
- **Billing boundary:** organization-owned Stripe customer; server-authoritative interview seconds and idempotent finalization.

## Architecture principles

KISS and YAGNI are hard requirements. Prefer server state/server components where appropriate; use focused client state only for realtime interaction. Do not make the entire product a global client store.

No microservices, CQRS, event sourcing, Kafka, generic workflow engine, RAG, or generic agent framework in the initial architecture unless concrete evidence later demands them.

## Versioning and provenance

Published interviewer configuration is immutable. Attempts reference exact interviewer, rubric, prompt and guardrail versions. Assessments store model/prompt/rubric/interviewer/guardrail provenance. Regeneration must preserve history.

## Source sections

Key PRD sections: 13–14, 29–41, 52–68, 73–76, 95–100, 124–129, 154–182.
