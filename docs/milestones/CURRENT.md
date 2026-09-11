# Current Milestone

Milestone:
Jobs + Interviewer Builder

Legacy roadmap identifier:
M03

Current capability:
Tenant-scoped Jobs + Requirements are implemented and verified on draft PR #5. Work is advancing next into the competency model, then rubrics, question bank, deterministic interview plan, interviewer configuration, guardrails, publish/versioning, preview, and end-to-end closeout.

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
- All persistence is organization-owned and PostgreSQL RLS/RPC authority remains authoritative.
- Organization-authored configuration is untrusted and cannot override platform safety/fairness policy.
- Published interviewer versions must be immutable and reproducible.
- AI suggestions may not silently become authoritative criteria/questions.
- Humans remain hiring decision makers.

## Iterations

1. M03.1 — Jobs + requirements — IMPLEMENTED / VERIFIED SLICE. Tenant CRUD, requirements, route-bound UI/actions and provider-backed authorization/isolation are present. Review found a deterministic-ordering invariant gap; RED `268afaaca87e3bf3dffa0a552a66e1dfab1f2ca9` / CI #272 proved it, and GREEN `5db7708f1aecc5122b4a4883f7875b9e02df3fe5` / CI #273 fixed it with full quality-gate success.
2. M03.2 — Competency model — NOT STARTED.
3. M03.3 — Observable 1–5 rubrics — NOT STARTED.
4. M03.4 — Question bank — NOT STARTED.
5. M03.5 — Deterministic interview plan — NOT STARTED.
6. M03.6 — Interviewer configuration — NOT STARTED.
7. M03.7 — Non-overridable guardrail validation — NOT STARTED.
8. M03.8 — Draft/publish state machine — NOT STARTED.
9. M03.9 — Immutable versioning — NOT STARTED.
10. M03.10 — Non-billable preview — NOT STARTED.
11. M03.11 — Builder E2E closeout — NOT STARTED.

## Verification state

Exact implementation head `5db7708f1aecc5122b4a4883f7875b9e02df3fe5` passed CI #273 / `34642360290` across frozen install, lint, typecheck, unit/component tests, framework/source verification, local Supabase, production build, Chromium E2E, PRD coverage and teardown. Documentation reconciliation after that head requires fresh exact-head CI before later integration claims.

## Review state

0 unresolved Critical findings and 0 unresolved Important findings for the reviewed M03.1 deterministic-ordering issue. PR #5 currently has no submitted reviews or unresolved review threads. Milestone-wide skeptical review remains pending until later M03 iterations are implemented.

## Next Action

Follow `docs/progress/STATUS.md` `Exact next work:`: begin M03.2 with genuine RED tests for tenant-scoped competencies, then implement the minimum schema/domain behavior only after RED is verified.
