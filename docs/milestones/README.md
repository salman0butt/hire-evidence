# Milestone Program

This repository uses **M00–M15** as durable PRD milestone identifiers. They are useful in documentation, filenames, traceability, and requirement references. Do **not** use milestone codes as meaningless commit or PR title prefixes; Git history should describe the behavior or evidence being changed.

## Lifecycle

Every milestone is a living execution ledger and uses:

`NOT STARTED -> DESIGN -> PLANNED -> IMPLEMENTING -> VERIFYING -> REVIEW -> COMPLETE`

`BLOCKED` is allowed when an evidence-backed blocker prevents legitimate progress. A blocked ledger must record the blocker, its impact, and the exact unblock action.

A milestone may move backward when fresh evidence invalidates an earlier state. Git/code/tests/current CI outrank stale status text.

## Completion Rule

No milestone may be marked COMPLETE without:

- all authoritative PRD requirements and iterations accounted for;
- acceptance criteria verified;
- genuine TDD evidence where practical;
- required integration/E2E/security/accessibility/performance/AI-eval evidence;
- independent review and fixes/re-review;
- 0 unresolved Critical findings;
- 0 unresolved Important findings;
- traceability/feature state reconciled;
- exact-final-head CI green;
- durable closeout/recovery evidence.

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

The PRD ordering remains authoritative. A future worker may refine technical dependency edges when repository evidence requires it, but must document material deviations rather than silently reordering scope.

## Program Status

| Milestone | Capability | Status | Primary dependencies |
| --- | --- | --- | --- |
| [M00 — Product Foundation](./M00-product-foundation.md) | Product Foundation | **VERIFYING** | None |
| [M01 — SaaS Shell + Auth](./M01-saas-shell-auth.md) | SaaS Shell + Auth | **NOT STARTED** | M00 |
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

## Recovery

Start from:

1. actual Git/GitHub graph and exact-head CI;
2. `AGENTS.md`;
3. `docs/AUTONOMOUS-DEVELOPMENT.md`;
4. `docs/progress/STATUS.md`;
5. `docs/progress/KNOWN-ISSUES.md`;
6. the current milestone ledger;
7. relevant PRD requirements;
8. selected Superpowers spec/plan;
9. active PR, reviews, source and tests.

`docs/progress/STATUS.md` is the compact global index. Milestone ledgers carry detailed scope/evidence. Task or milestone closeout files under `docs/progress/` should be created only when they preserve real evidence; do not pre-create empty bureaucracy.
