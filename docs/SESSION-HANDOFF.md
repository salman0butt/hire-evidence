# Session Handoff

This compatibility handoff never outranks actual Git/code/current exact-SHA CI. Recover in this order: `CODEX-START-HERE.md` → `AGENTS.md` → `docs/AUTONOMOUS-DEVELOPMENT.md` → actual GitHub state → `docs/progress/STATUS.md` → known issues/current milestone → active requirements/spec/plan.

## Current repository state

- Repository: `salman0butt/hire-evidence`
- Default branch: `main`
- Current main SHA: `835d7d571a69cd13e3e802be4872e873ffdd34fe`; post-merge M02 CI #232 / `34624252208` passed.
- Active branch: `feat/jobs-interviewer-builder`
- Active PR: #5 — `Build jobs and interviewer configuration` — OPEN / DRAFT / unmerged.
- Latest fully verified behavioral head before this documentation reconciliation: `dce42df18176a00e5c33f910332c276245de5ac5`.
- CI #362 / `34666866674` for that head passed frozen install, lint, typecheck, unit/component tests, framework/source verification, local Supabase migration application, production build, Chromium E2E, PRD coverage and teardown.
- Documentation reconciliation continues after that SHA and requires fresh exact-head CI before the documentation head itself is called verified.
- User authorization: milestone PRs may auto-merge only after every explicit merge gate is satisfied. PR #5 remains draft because M03.6–M03.11 remain incomplete.

## Current milestone

Jobs + Interviewer Builder is ACTIVE.

- M03.1 Jobs + Requirements — verified slice.
- M03.2 Competencies — verified slice; `18504de66a11ea6f5944fae4cf2c2522ca5f7c88`, CI #292 / `34647354026`.
- M03.3 Observable 1–5 Rubrics — verified slice; provider-backed head `b6607a5a9ad72dea585ac2af4cf374e3d319883d`, CI #301 / `34649940346`.
- M03.4 Question Bank — verified slice; provider-backed head `c5a8688f62eb74bfe5964a203e92e520bc0a01d9`, CI #330 / `34657330228`.
- M03.5 Deterministic Interview Plan — verified slice; route-bound editor/action and provider-backed role/tenant/job isolation are present. Exact fully verified head `332caa332b1a6b978860f54f15227ce4d82b385d`, CI #358 / `34665349746`.
- M03.6 Interviewer Configuration — active/partially verified. Bounded validation and tenant/job/plan-bound draft persistence with member-read RLS and fixed-role save authority are GREEN; typed repository/action/editor/provider-backed isolation remain.

## M03.6 TDD evidence

- Validation RED: `2e8a88fc452d80bfa4ea59bbbc1f2cb1eb89829a`, CI #359 / `34666412220`; lint/typecheck passed, 229 unrelated tests passed, and the four new tests failed only because `interviewer-config-validation` was absent.
- Validation GREEN: `7ae46568e458f5efb3447707602ee1c77e750c04`, CI #360 / `34666523775` PASS across the full repository quality gate.
- Persistence RED: `73063d7029038924468dc9e27fc994a53abb5fdd`, CI #361 / `34666780326`; lint/typecheck passed, 233 unrelated tests passed, and only the four migration-contract tests failed because `202609120005_create_interviewer_configs.sql` was absent.
- Persistence GREEN: `dce42df18176a00e5c33f910332c276245de5ac5`, CI #362 / `34666866674` PASS across the full repository quality gate including actual local-Supabase migration application.

## Review / blockers

- Latest inspection found no unresolved PR review threads.
- Implemented M03.6 validation/persistence scope has 0 known unresolved Critical and 0 known unresolved Important findings.
- No current engineering blocker is known.
- M03 remains incomplete; do not merge PR #5 until all merge gates are genuinely satisfied.

## Exact next work

Use `docs/progress/STATUS.md` as canonical state. Recover the newest branch/CI state after this documentation reconciliation. Then write the smallest genuine RED for the typed interviewer-configuration repository boundary. After GREEN, add route-bound action/editor behavior and provider-backed role/tenant/job/plan isolation before marking M03.6 verified.
