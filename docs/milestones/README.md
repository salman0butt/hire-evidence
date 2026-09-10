# Milestone Program

This repository uses **M00–M15** as durable PRD milestone identifiers. Codes belong in documentation/traceability, not as meaningless commit or PR prefixes.

## Lifecycle

`NOT STARTED -> DESIGN -> PLANNED -> IMPLEMENTING -> VERIFYING -> REVIEW -> COMPLETE`

`BLOCKED` is allowed only with evidence and an exact unblock action. Git/code/tests/current CI outrank stale status text.

## Completion Rule

No milestone is COMPLETE without requirements/iterations accounted for, acceptance criteria verified, genuine TDD evidence where practical, applicable E2E/security/accessibility/performance/AI-eval evidence, skeptical review with 0 unresolved Critical/Important findings, reconciled traceability/feature state, exact-final-head CI, and durable closeout evidence.

Only one milestone should normally be active.

## Dependency-Aware Roadmap

```text
Product Foundation
    |
SaaS Shell + Auth
    |
Organizations + RBAC
    |
Jobs + Interviewer Builder
    |
Candidates + Invitations
    |
Realtime AI Interview
    |
Transcript + Durable Session
    |
Evidence Assessment
    |
Hiring Team Review
   / \
Billing  AI Quality/Evals
   \ /
Enterprise Readiness
    |
Integrations / Coding Interview / Advanced Formats
    |
Enterprise Compliance
```

## Program Status

| Milestone | Capability | Status | Primary dependencies |
| --- | --- | --- | --- |
| [M00 — Product Foundation](./M00-product-foundation.md) | Product Foundation | **COMPLETE** | None |
| [M01 — SaaS Shell + Auth](./M01-saas-shell-auth.md) | SaaS Shell + Auth | **IMPLEMENTING** | M00 |
| [M02 — Organizations + RBAC](./M02-organizations-rbac.md) | Organizations + RBAC | **NOT STARTED** | M01 |
| [M03 — Jobs + Interviewer Builder](./M03-jobs-interviewer-builder.md) | Jobs + Interviewer Builder | **NOT STARTED** | M02 |
| [M04 — Candidates + Invitations](./M04-candidates-invitations.md) | Candidates + Invitations | **NOT STARTED** | M02, M03 |
| [M05 — Realtime AI Interview](./M05-realtime-ai-interview.md) | Realtime AI Interview | **NOT STARTED** | M04, M03 |
| [M06 — Transcript + Durable Session](./M06-transcript-durable-session.md) | Transcript + Durable Session | **NOT STARTED** | M05 |
| [M07 — Evidence-Based Assessment Engine](./M07-evidence-assessment-engine.md) | Evidence-Based Assessment Engine | **NOT STARTED** | M06, M03 |
| [M08 — Hiring Team Review Experience](./M08-hiring-team-review.md) | Hiring Team Review Experience | **NOT STARTED** | M07 |
| [M09 — Billing + Usage](./M09-billing-usage.md) | Billing + Usage | **NOT STARTED** | M02, M05 |
| [M10 — AI Quality, Guardrails & Evals](./M10-ai-quality-guardrails-evals.md) | AI Quality, Guardrails & Evals | **NOT STARTED** | M05–M08 |
| [M11 — Enterprise Readiness](./M11-enterprise-readiness.md) | Enterprise Readiness | **NOT STARTED** | M02–M10 as relevant |
| [M12 — Integrations](./M12-integrations.md) | Integrations | **NOT STARTED** | Stable core + M11 security boundaries |
| [M13 — Coding Interview](./M13-coding-interview.md) | Coding Interview | **NOT STARTED** | M04, M07, M08, M11 |
| [M14 — Advanced Interview Formats](./M14-advanced-interview-formats.md) | Advanced Interview Formats | **NOT STARTED** | Core adoption + M05–M08 |
| [M15 — Enterprise Compliance Program](./M15-enterprise-compliance.md) | Enterprise Compliance Program | **NOT STARTED** | Current product + current legal research |

## Current evidence

M00 integrated through PR #2; exact post-merge `main` SHA `64ebeb4f7b2a39fc0557685ef34035650211aad9` passed CI run `34486610200` / #57. M01 is active in draft PR #3 on `feat/saas-shell-auth`; M01.1 reviewed code head `6107253fdde1639097a6e6a6d8fd3777f242e5a4` passed CI run `34492022676` / #64.

## Recovery

Start from actual Git/GitHub + exact-head CI, then `AGENTS.md`, `docs/AUTONOMOUS-DEVELOPMENT.md`, `docs/progress/STATUS.md`, known issues, `CURRENT.md`, active milestone ledger, relevant PRD/traceability, active Superpowers spec/plan, PR/reviews, source/tests.
