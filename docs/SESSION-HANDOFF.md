# Session Handoff

This compatibility handoff never outranks actual Git/code/current exact-SHA CI. Recover in this order: `CODEX-START-HERE.md` → `AGENTS.md` → `docs/AUTONOMOUS-DEVELOPMENT.md` → actual GitHub state → `docs/progress/STATUS.md` → known issues/current milestone → active requirements/spec/plan.

## Current repository state

- Repository: `salman0butt/hire-evidence`
- Default branch: `main`
- Current main SHA: `835d7d571a69cd13e3e802be4872e873ffdd34fe` (Organizations + RBAC merged); post-merge CI #232 / `34624252208` passed.
- Active branch: `feat/jobs-interviewer-builder`
- Active PR: #5 — `Build jobs and interviewer configuration` — OPEN / DRAFT / unmerged.
- Current verified M03.1 implementation head before this documentation reconciliation: `5db7708f1aecc5122b4a4883f7875b9e02df3fe5`.
- CI for that head: GitHub Actions #273 / `34642360290` — PASS across frozen install, lint, typecheck, 161 unit/component tests, framework/source checks, local Supabase, build, Chromium E2E, PRD coverage and teardown.
- User authorization: milestone PRs may auto-merge only after all explicit merge gates in the autonomous task are satisfied. PR #5 is nowhere near that gate yet because M03.2–M03.11 remain incomplete.

## Current milestone

Jobs + Interviewer Builder is ACTIVE. M03.1 Jobs + Requirements has tenant-scoped CRUD, must-have/nice-to-have requirements, role-gated RPC mutation, route-bound UI/actions, and provider-backed tenant isolation.

A skeptical review identified an Important deterministic-ordering defect: the database used `unique (job_id, kind, position)`, allowing duplicate positions across kinds. Strict TDD resolved it:

- RED `268afaaca87e3bf3dffa0a552a66e1dfab1f2ca9`, CI #272 / `34642095960`: 160 unrelated tests passed; the new ordering assertion alone failed for the intended missing invariant.
- GREEN `5db7708f1aecc5122b4a4883f7875b9e02df3fe5`, CI #273 / `34642360290`: minimal schema change to `unique (job_id, position)`; full quality gate passed.

## Review / blockers

- PR #5 has no submitted reviews and no unresolved review threads at latest inspection.
- Current reviewed M03.1 scope has 0 unresolved Critical and 0 unresolved Important findings.
- No engineering blocker is known.
- M03 milestone remains incomplete; do not merge PR #5.

## Exact next work

Use `docs/progress/STATUS.md` as canonical state. Begin M03.2 by writing the smallest genuine failing tests for tenant-scoped competency schema/validation/authorization: explicit job ownership, bounded text and weight, deterministic order, and fixed-role mutation permissions. Verify RED before implementing production competency code.
