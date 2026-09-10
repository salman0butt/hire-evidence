# Milestone Program

This repository uses **M00–M15** as durable PRD milestone identifiers. Codes belong in documentation/traceability, not as meaningless commit or PR prefixes.

## Lifecycle
`NOT STARTED -> DESIGN -> PLANNED -> IMPLEMENTING -> VERIFYING -> REVIEW -> COMPLETE`

`BLOCKED` is allowed only with evidence and an exact unblock action. Git/code/tests/current CI outrank stale status text.

## Completion Rule
No milestone is COMPLETE without requirements/iterations accounted for, acceptance criteria verified, genuine TDD evidence where practical, applicable E2E/security/accessibility/performance/AI-eval evidence, skeptical review with 0 unresolved Critical/Important findings, reconciled traceability/feature state, exact-final-head CI, and durable closeout evidence.

## Program Status
| Milestone | Capability | Status |
|---|---|---|
| [M00](./M00-product-foundation.md) | Product Foundation | **COMPLETE** |
| [M01](./M01-saas-shell-auth.md) | SaaS Shell + Auth | **IMPLEMENTING** |
| [M02](./M02-organizations-rbac.md) | Organizations + RBAC | **NOT STARTED** |
| [M03](./M03-jobs-interviewer-builder.md) | Jobs + Interviewer Builder | **NOT STARTED** |
| [M04](./M04-candidates-invitations.md) | Candidates + Invitations | **NOT STARTED** |
| [M05](./M05-realtime-ai-interview.md) | Realtime AI Interview | **NOT STARTED** |
| [M06](./M06-transcript-durable-session.md) | Transcript + Durable Session | **NOT STARTED** |
| [M07](./M07-evidence-assessment-engine.md) | Evidence Assessment | **NOT STARTED** |
| [M08](./M08-hiring-team-review.md) | Hiring Team Review | **NOT STARTED** |
| [M09](./M09-billing-usage.md) | Billing + Usage | **NOT STARTED** |
| [M10](./M10-ai-quality-guardrails-evals.md) | AI Quality / Guardrails / Evals | **NOT STARTED** |
| [M11](./M11-enterprise-readiness.md) | Enterprise Readiness | **NOT STARTED** |
| [M12](./M12-integrations.md) | Integrations | **NOT STARTED** |
| [M13](./M13-coding-interview.md) | Coding Interview | **NOT STARTED** |
| [M14](./M14-advanced-interview-formats.md) | Advanced Interview Formats | **NOT STARTED** |
| [M15](./M15-enterprise-compliance.md) | Enterprise Compliance | **NOT STARTED** |

## Current evidence
M00 is integrated on `main` at `64ebeb4…`, CI #57. M01 draft PR #3 remains open/unmerged. M01.1–M01.5 are provider-independently verified. M01.6 profile/RLS is implemented and reviewed at `e9c2ad64…`, CI #130, but remains short of VERIFIED until real Supabase cross-user isolation is executed. M01.7 provider-independent browser coverage is verified at `061762ec…`, CI #134. Focused Vitest configuration maintenance is verified at `85ff107…`, CI #141, with the prior ESM-in-CommonJS loader warning removed. Connected-account discovery on 2026-09-11 found only unrelated existing Supabase projects, so provider-backed auth/profile E2E and RLS isolation remain evidence blockers and M01 remains IMPLEMENTING.

## Recovery
Start from actual Git/GitHub + exact-head CI, then autonomy docs, compact status, known issues, current/active milestone ledgers, PRD/traceability, Superpowers artifacts, PR/reviews, source/tests.
