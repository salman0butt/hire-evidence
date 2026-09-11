# Current Milestone

Milestone:
Jobs + Interviewer Builder

Legacy roadmap identifier:
M03

Current capability:
Tenant-scoped Jobs + Requirements, Competencies, Observable 1–5 Rubrics, and the bounded Question Bank are implemented and verified slices on draft PR #5. Work advances next into the deterministic interview plan, then interviewer configuration, guardrails, publish/versioning, preview, and end-to-end closeout.

Status:
ACTIVE

Branch:
`feat/jobs-interviewer-builder`

Base:
`main` at verified M02 merge SHA `835d7d571a69cd13e3e802be4872e873ffdd34fe`

PR:
#5 — `Build jobs and interviewer configuration` — OPEN / DRAFT / unmerged.

Canonical compact recovery state:
`docs/progress/STATUS.md`

Detailed known issues:
`docs/progress/KNOWN-ISSUES.md`

## Dependency closeout

- Product Foundation: COMPLETE.
- SaaS Shell + Auth: COMPLETE.
- Organizations + RBAC: COMPLETE. PR #4 squash-merged as `835d7d571a69cd13e3e802be4872e873ffdd34fe`; post-merge CI #232 / `34624252208` passed.

## Selected M03 Architecture

- Design: `docs/superpowers/specs/2026-09-11-jobs-interviewer-builder-design.md`.
- Plan: `docs/superpowers/plans/2026-09-11-jobs-interviewer-builder.md`.
- Persistence remains organization-owned with PostgreSQL RLS/RPC authority.
- Route-bound organization/job identifiers are authoritative over form-body values.
- Organization-authored configuration is untrusted and cannot override platform safety/fairness policy.
- Published interviewer versions must be immutable and reproducible.
- AI suggestions may not silently become authoritative criteria/questions.
- Humans remain hiring decision makers.

## Iterations

1. M03.1 — Jobs + requirements — **VERIFIED SLICE**.
2. M03.2 — Competency model — **VERIFIED SLICE**. Exact implementation head `18504de66a11ea6f5944fae4cf2c2522ca5f7c88`, CI #292 / `34647354026`.
3. M03.3 — Observable 1–5 rubrics — **VERIFIED SLICE**. Provider-backed head `b6607a5a9ad72dea585ac2af4cf374e3d319883d`, CI #301 / `34649940346`.
4. M03.4 — Question bank — **VERIFIED SLICE**. Integrated UI head `48754524c55c183af5714dee149cd28ead852a5a`, CI #329 / `34657019454`; provider-backed isolation head `c5a8688f62eb74bfe5964a203e92e520bc0a01d9`, CI #330 / `34657330228`.
5. M03.5 — Deterministic interview plan — **NEXT / NOT STARTED**.
6. M03.6 — Interviewer configuration — NOT STARTED.
7. M03.7 — Non-overridable guardrail validation — NOT STARTED.
8. M03.8 — Draft/publish state machine — NOT STARTED.
9. M03.9 — Immutable versioning — NOT STARTED.
10. M03.10 — Non-billable preview — NOT STARTED.
11. M03.11 — Builder E2E closeout — NOT STARTED.

## Verification state

Question-bank route/action/editor integration is fully green at `48754524c55c183af5714dee149cd28ead852a5a`, CI #329 / `34657019454`. Provider-backed question tenant/role/job/competency isolation is fully green at `c5a8688f62eb74bfe5964a203e92e520bc0a01d9`, CI #330 / `34657330228`. Both passed the complete repository quality gate. Invalid pre-RED harness commits are recorded in `docs/progress/STATUS.md` and must not be represented as behavioral RED evidence.

## Review state

0 unresolved Critical findings and 0 unresolved Important findings in the currently reviewed M03.1–M03.4 scope. PR #5 had no unresolved review threads at latest inspection. Milestone-wide skeptical review remains pending while M03.5–M03.11 are incomplete.

## Next Action

Begin M03.5 with the smallest genuine RED tests for positive bounded section duration, deterministic ordering, tenant/job-bound question ownership, total-duration consistency, and required question/competency coverage. Verify the RED reaches intended behavioral failures before adding production interview-plan persistence.
