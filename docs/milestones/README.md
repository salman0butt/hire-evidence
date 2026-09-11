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
| [M01](./M01-saas-shell-auth.md) | SaaS Shell + Auth | **COMPLETE** |
| [M02](./M02-organizations-rbac.md) | Organizations + RBAC | **IMPLEMENTING** |
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
M00 is integrated at `64ebeb4f7b2a39fc0557685ef34035650211aad9`, post-merge CI #57 green. M01 is COMPLETE: PR #3 final head `b8844130118453e56009284b9498c8357429f1af` passed CI #156, squash-merged as `ed10e1b55bb62cf202585c8c50e6487014e83c29`, and post-merge CI #157 passed including local Supabase provider E2E.

M02 is active in draft PR #4 on `feat/organizations-rbac`. M02.1 organization/membership tenancy foundation passed full CI #161. M02.2 fixed RBAC and bounded organization input validation used RED #162 → GREEN #163. M02.3 authenticated organization onboarding used RED #165, systematic production-build debugging in #167, and exact fix-head GREEN #168. M02.4 RLS-backed tenant membership/navigation used RED #169 → GREEN #170. Membership management with owner invariants is next. M02 remains incomplete and must not merge until invitation/settings/security/two-organization evidence gates pass.

## Recovery
Start from actual Git/GitHub + exact-head CI, then autonomy docs, compact status, known issues, current/active milestone ledgers, PRD/traceability, Superpowers artifacts, PR/reviews, source/tests.
