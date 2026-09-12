# Current Milestone

Milestone:
Jobs + Interviewer Builder

Legacy roadmap identifier:
M03

Current capability:
Tenant-scoped Jobs + Requirements, Competencies, Observable 1–5 Rubrics, Question Bank, and Deterministic Interview Plan are verified slices on draft PR #5. M03.6 Interviewer Configuration is ACTIVE: bounded configuration validation plus tenant/job/plan-bound draft persistence, member-read RLS, and a fixed-role save RPC are implemented and fully verified. Route-bound application repository/action/editor/provider-backed isolation work remains.

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
5. M03.5 — Deterministic interview plan — **VERIFIED SLICE**. Route-bound action/editor and provider-backed tenant/role/job isolation are present; exact fully verified head `332caa332b1a6b978860f54f15227ce4d82b385d`, CI #358 / `34665349746`.
6. M03.6 — Interviewer configuration — **ACTIVE / PARTIALLY VERIFIED**. Validation RED `2e8a88fc452d80bfa4ea59bbbc1f2cb1eb89829a`, CI #359 / `34666412220` → validation GREEN `7ae46568e458f5efb3447707602ee1c77e750c04`, CI #360 / `34666523775`. Persistence RED `73063d7029038924468dc9e27fc994a53abb5fdd`, CI #361 / `34666780326` → persistence GREEN `dce42df18176a00e5c33f910332c276245de5ac5`, CI #362 / `34666866674`.
7. M03.7 — Non-overridable guardrail validation — NOT STARTED.
8. M03.8 — Draft/publish state machine — NOT STARTED.
9. M03.9 — Immutable versioning — NOT STARTED.
10. M03.10 — Non-billable preview — NOT STARTED.
11. M03.11 — Builder E2E closeout — NOT STARTED.

## Verification state

Exact behavioral head `dce42df18176a00e5c33f910332c276245de5ac5` passed CI #362 / `34666866674` across frozen install, lint, typecheck, unit/component tests, framework/source verification, local Supabase migration application, production build, Chromium E2E, PRD coverage and teardown. This proves current M03.6 validation and persistence; repository/action/editor/provider-backed configuration isolation still remain.

## Review state

No unresolved Critical or Important finding is known in the implemented M03.6 validation/persistence scope. PR #5 remains draft because M03.6 application behavior plus M03.7–M03.11 are incomplete.

## Next Action

Continue M03.6 with the smallest genuine RED for the typed interviewer-configuration application repository boundary. Then add route-bound action/editor behavior and provider-backed role/tenant/job/plan isolation before marking M03.6 verified.
