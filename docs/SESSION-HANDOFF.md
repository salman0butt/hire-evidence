# Session Handoff

This compatibility handoff never outranks actual Git/code/current exact-SHA CI. Recover in this order: `CODEX-START-HERE.md` → `AGENTS.md` → `docs/AUTONOMOUS-DEVELOPMENT.md` → actual GitHub state → `docs/progress/STATUS.md` → known issues/current milestone → active requirements/spec/plan.

## Current repository state

- Repository: `salman0butt/hire-evidence`
- Default branch: `main`
- Current main SHA: `835d7d571a69cd13e3e802be4872e873ffdd34fe`; post-merge M02 CI #232 / `34624252208` passed.
- Active branch: `feat/jobs-interviewer-builder`
- Active PR: #5 — `Build jobs and interviewer configuration` — OPEN / DRAFT / unmerged.
- Previous exact implementation head `adfbf30f0f27a3e06c156c3d8a8a16ecf872cef2` passed CI #413 / `34673845119`.
- Durable-state reconciliation now creates a newer head and therefore requires fresh exact-head CI before any closeout/merge claim.
- User authorization: milestone PRs may auto-merge only after every explicit merge gate is satisfied. PR #5 remains draft because M03.11 closeout remains incomplete.

## Current milestone

Jobs + Interviewer Builder is ACTIVE.

- M03.1 Jobs + Requirements — verified slice.
- M03.2 Competencies — verified slice.
- M03.3 Observable 1–5 Rubrics — verified slice.
- M03.4 Question Bank — verified slice.
- M03.5 Deterministic Interview Plan — verified slice.
- M03.6 Interviewer Configuration — implemented on the current branch with validation, persistence, typed repository, route-bound actions/editor and dedicated provider-backed isolation coverage.
- M03.7 Non-overridable Guardrails — implemented with pure validation, authoritative database enforcement and provider-backed adversarial coverage.
- M03.8 Draft / Publish — implemented with publication state and route-bound publish action.
- M03.9 Immutable Versioning — implemented with immutable interviewer-version persistence/repository/tests.
- M03.10 Non-billable Preview — implemented with preview migration/domain/action/UI/tests.
- M03.11 Builder E2E Closeout — ACTIVE.

## Recovery evidence

Compared with old M03.6 repository checkpoint `706822e7103fe16bdbe034bcc27e3dff96130f93`, implementation head `adfbf30f0f27a3e06c156c3d8a8a16ecf872cef2` was 45 commits ahead. Those commits add configuration action/editor/E2E, guardrail validator/database enforcement/E2E, publish state/action, immutable versions, and non-billable preview. CI #413 passed on that exact implementation head. Actual Git/code/tests therefore supersede the older durable text that still described M03.6 as partially implemented.

## Review / blockers

- Latest GitHub inspection found no unresolved PR review threads.
- PR #5 is currently mergeable but intentionally remains draft.
- No current engineering blocker is known.
- Milestone-wide closeout review and final exact-SHA verification remain mandatory before merge.

## Exact next work

Use `docs/progress/STATUS.md` as canonical state. Execute M03.11 closeout against the newest branch head: verify the complete provider-backed builder flow and Org A/Org B/anonymous abuse matrix through configuration, guardrails, publication, immutable version and preview; verify desktop + 390×844 keyboard/focus/overflow behavior; perform skeptical security/accessibility/performance/AI-safety/YAGNI review; fix any Critical/Important findings through TDD; reconcile traceability/feature/ledger/PR docs; then require fresh exact-final-head CI before auto-merge.
