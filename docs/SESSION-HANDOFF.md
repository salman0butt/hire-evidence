# Session Handoff

This compatibility handoff never outranks actual Git/code/current exact-SHA CI. Recover in this order: `CODEX-START-HERE.md` → `AGENTS.md` → `docs/AUTONOMOUS-DEVELOPMENT.md` → actual GitHub state → `docs/progress/STATUS.md` → known issues/current milestone → active requirements/spec/plan.

## Current repository state

- Repository: `salman0butt/hire-evidence`
- Default branch: `main`
- Current main SHA: `835d7d571a69cd13e3e802be4872e873ffdd34fe` (Organizations + RBAC merged); post-merge CI #232 / `34624252208` passed.
- Active branch: `feat/jobs-interviewer-builder`
- Active PR: #5 — `Build jobs and interviewer configuration` — OPEN / DRAFT / unmerged.
- Latest fully verified M03 implementation head before documentation reconciliation: `18504de66a11ea6f5944fae4cf2c2522ca5f7c88`.
- CI for that head: GitHub Actions #292 / `34647354026` — PASS across the repository quality gate.
- User authorization: milestone PRs may auto-merge only after all explicit merge gates in the autonomous task are satisfied. PR #5 remains draft because M03.3–M03.11 remain incomplete.

## Current milestone

Jobs + Interviewer Builder is ACTIVE.

- M03.1 Jobs + Requirements is a verified slice with tenant-scoped CRUD, explicit must-have/nice-to-have criteria, fixed-role mutation, route-bound UI/actions and provider-backed tenant isolation.
- M03.2 Competencies is a verified slice with organization/job-bound persistence, bounded validation, deterministic ordering, fixed-role create authority, provider-backed Org A/Org B/anonymous isolation, route-bound server action/UI integration and an explicit publication-time weight-total policy.
- The attempted weight-total RED commit `76093b65d745c4e48c427f541026df947de94b00` / CI #291 failed at typecheck before tests, so it must not be represented as valid behavioral RED evidence.

## Review / blockers

- PR #5 has no unresolved review threads at latest inspection.
- Reviewed M03.1/M03.2 scope has 0 unresolved Critical and 0 unresolved Important findings.
- No engineering blocker is known.
- M03 milestone remains incomplete; do not merge PR #5.

## Exact next work

Use `docs/progress/STATUS.md` as canonical state. Start M03.3 by adding a genuine failing migration/domain test for observable per-competency rubric levels 1–5 with tenant-bound competency ownership and fixed-role mutation authority; verify RED before production rubric code.
