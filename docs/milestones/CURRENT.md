# Current Milestone

Milestone:
Jobs + Interviewer Builder

Legacy roadmap identifier:
M03

Current capability:
Tenant-scoped Jobs + Requirements, Competencies, Observable 1–5 Rubrics, and the bounded Question Bank are verified slices on draft PR #5. M03.5 Deterministic Interview Plan now has validated deterministic plan rules, tenant/job-bound relational persistence, an atomic fixed-role save RPC, and a typed application repository boundary. The route-bound editor/action and provider-backed plan isolation verification remain unfinished before M03.5 can be called a verified slice.

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
- Humans remain hiring decision makers.

## Iterations

1. M03.1 — Jobs + requirements — **VERIFIED SLICE**.
2. M03.2 — Competency model — **VERIFIED SLICE**. Exact implementation head `18504de66a11ea6f5944fae4cf2c2522ca5f7c88`, CI #292 / `34647354026`.
3. M03.3 — Observable 1–5 rubrics — **VERIFIED SLICE**. Provider-backed head `b6607a5a9ad72dea585ac2af4cf374e3d319883d`, CI #301 / `34649940346`.
4. M03.4 — Question bank — **VERIFIED SLICE**. Provider-backed isolation head `c5a8688f62eb74bfe5964a203e92e520bc0a01d9`, CI #330 / `34657330228`.
5. M03.5 — Deterministic interview plan — **ACTIVE**. Validation/schema/save-RPC/repository boundary implemented. Save-authority RED `a93c5db7c733c6b9082c23e2478eb404a180e3b4`, CI #338 → GREEN `166412f5294ff77336dec278648cc7f08e4cdf05`, CI #339. Repository-boundary RED `ed743bd9f53f778748897b2f264ba2a628769cd3`, CI #340 → GREEN `c3d5081e22f389e88788c8f302187504b14ad303`, CI #341 full quality gate PASS.
6. M03.6 — Interviewer configuration — NOT STARTED.
7. M03.7 — Non-overridable guardrail validation — NOT STARTED.
8. M03.8 — Draft/publish state machine — NOT STARTED.
9. M03.9 — Immutable versioning — NOT STARTED.
10. M03.10 — Non-billable preview — NOT STARTED.
11. M03.11 — Builder E2E closeout — NOT STARTED.

## Verification state

Exact head `c3d5081e22f389e88788c8f302187504b14ad303` passed CI #341 / `34661832340` across frozen install, lint, typecheck, unit/component tests, framework/source verification, local Supabase, production build, Chromium E2E, PRD coverage and teardown. This proves the current M03.5 validation/schema/RPC/repository state, not the still-missing editor/action/provider-backed plan E2E.

## Review state

No unresolved Critical or Important finding is known in the implemented M03.5 persistence/repository scope. PR #5 remains draft because M03.5 UI/action/provider verification plus M03.6–M03.11 are incomplete.

## Next Action

Continue M03.5 with the smallest genuine RED for the route-bound interview-plan action/editor, using server-derived job questions/competencies for allowed/required coverage. Then add provider-backed plan role/tenant/job isolation verification, reconcile durable docs, and only then mark M03.5 verified.
