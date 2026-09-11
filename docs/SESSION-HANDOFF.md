# Session Handoff

This compatibility handoff never outranks actual Git/code/current exact-SHA CI. Recover in this order: `CODEX-START-HERE.md` → `AGENTS.md` → `docs/AUTONOMOUS-DEVELOPMENT.md` → actual GitHub state → `docs/progress/STATUS.md` → known issues/current milestone → active requirements/spec/plan.

## Current repository state

- Repository: `salman0butt/hire-evidence`
- Default branch: `main`
- Current main SHA: `835d7d571a69cd13e3e802be4872e873ffdd34fe`; post-merge M02 CI #232 / `34624252208` passed.
- Active branch: `feat/jobs-interviewer-builder`
- Active PR: #5 — `Build jobs and interviewer configuration` — OPEN / DRAFT / unmerged.
- Latest verified M03.4 provider-backed head before this durable-state reconciliation: `c5a8688f62eb74bfe5964a203e92e520bc0a01d9`.
- CI for that head: #330 / `34657330228` — PASS across frozen install, lint, typecheck, unit/component tests, framework/source verification, local Supabase, production build, Chromium E2E, PRD coverage and teardown.
- User authorization: milestone PRs may auto-merge only after every explicit merge gate is satisfied. PR #5 remains draft because M03.5–M03.11 remain incomplete.

## Current milestone

Jobs + Interviewer Builder is ACTIVE.

- M03.1 Jobs + Requirements — verified slice.
- M03.2 Competencies — verified slice; `18504de66a11ea6f5944fae4cf2c2522ca5f7c88`, CI #292 / `34647354026`.
- M03.3 Observable 1–5 Rubrics — verified slice; provider-backed head `b6607a5a9ad72dea585ac2af4cf374e3d319883d`, CI #301 / `34649940346`.
- M03.4 Question Bank — verified slice. Route-bound creation, bounded validation, competency/job linkage, deterministic ordering, accessible authoring/read-only UI and provider-backed role/tenant isolation are present. Integrated head `48754524c55c183af5714dee149cd28ead852a5a` passed CI #329 / `34657019454`; provider-backed head `c5a8688f62eb74bfe5964a203e92e520bc0a01d9` passed CI #330 / `34657330228`.
- M03.5 Deterministic Interview Plan is next.

## TDD notes

- Question action RED: `7458e880cbd95ea44687b3223acf78c1dbceed21`, CI #322.
- Question editor valid RED: `8ffa9cebf156a0f27341f603863ec442e1beae0d`, CI #325. `dbe9d563c553b35d56d83018a768c01e3a7309ed` / CI #324 is NOT RED because typecheck failed before behavior ran.
- Job-page question wiring valid RED: `07b92bb0fa5dc5036b3700a3ee4cb2fbbe006fca`, CI #328. `679c93e24ff476ba91a2216b8dcd5588bbfc27ca` / CI #327 is NOT RED because the fixture failed typecheck first.
- Full integrated GREEN: `48754524c55c183af5714dee149cd28ead852a5a`, CI #329.
- Provider-backed verification: `c5a8688f62eb74bfe5964a203e92e520bc0a01d9`, CI #330.

## Review / blockers

- Latest inspection found no unresolved PR review threads.
- Current reviewed M03.1–M03.4 scope has 0 unresolved Critical and 0 unresolved Important findings.
- No AI-generated question suggestion workflow was added; therefore no suggestion can persist without human acceptance.
- No engineering blocker is known.
- M03 remains incomplete; do not merge PR #5.

## Exact next work

Use `docs/progress/STATUS.md` as canonical state. Begin M03.5 with genuine failing tests for deterministic ordered interview sections, bounded positive duration budgets, route/tenant/job-bound question ownership, total-duration consistency, and required question/competency coverage. Verify RED before production plan persistence.
