# Current Milestone

Milestone:
Jobs + Interviewer Builder

Legacy roadmap identifier:
M03

Current capability:
M03.1–M03.5 remain verified slices. Actual branch code/tests now also contain M03.6 interviewer configuration, M03.7 non-overridable guardrails, M03.8 draft/publish, M03.9 immutable versioning, and M03.10 non-billable preview. M03.11 milestone-wide builder closeout is ACTIVE.

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
- Published interviewer versions are immutable/reproducible artifacts.
- Humans remain hiring decision makers.

## Iterations

1. M03.1 — Jobs + requirements — **VERIFIED SLICE**.
2. M03.2 — Competency model — **VERIFIED SLICE**.
3. M03.3 — Observable 1–5 rubrics — **VERIFIED SLICE**.
4. M03.4 — Question bank — **VERIFIED SLICE**.
5. M03.5 — Deterministic interview plan — **VERIFIED SLICE**.
6. M03.6 — Interviewer configuration — **IMPLEMENTED / EXACT-HEAD GREEN**. Validation, tenant/job/plan-bound persistence, typed repository, route-bound actions/editor/page wiring and dedicated provider-backed isolation E2E are present.
7. M03.7 — Non-overridable guardrail validation — **IMPLEMENTED / EXACT-HEAD GREEN**. Pure validator plus authoritative database enforcement and provider-backed adversarial coverage are present.
8. M03.8 — Draft/publish state machine — **IMPLEMENTED / EXACT-HEAD GREEN**. Publish-state migration and route-bound publication action are present.
9. M03.9 — Immutable versioning — **IMPLEMENTED / EXACT-HEAD GREEN**. Published interviewer-version migration/repository/tests are present.
10. M03.10 — Non-billable preview — **IMPLEMENTED / EXACT-HEAD GREEN**. Preview migration/domain/action/UI/tests are present.
11. M03.11 — Builder E2E closeout — **ACTIVE**. Complete builder journey, abuse matrix, desktop/mobile accessibility, skeptical milestone-wide review, traceability/doc reconciliation and final exact-SHA CI are the remaining closeout work.

## Verification state

The previous code head `adfbf30f0f27a3e06c156c3d8a8a16ecf872cef2` passed CI #413 / `34673845119`. That head was 45 commits ahead of the old M03.6 repository checkpoint `706822e7103fe16bdbe034bcc27e3dff96130f93` and contained the M03.6–M03.10 implementation/test expansion described above. Documentation reconciliation now produces a newer head, so fresh exact-head CI is required before closeout or merge.

## Review state

Latest GitHub inspection found no unresolved review threads. No merge is authorized until M03.11 proves all milestone acceptance, security/accessibility/performance/AI-safety, documentation, concurrency and exact-final-head CI gates.

## Next Action

Execute M03.11 closeout: verify the full provider-backed builder flow and Org A/Org B/anonymous abuse matrix through configuration → guardrails → publish → immutable version → preview; verify desktop and 390×844 keyboard/focus/overflow behavior; perform skeptical milestone-wide review; fix every Critical/Important finding; reconcile milestone/traceability/feature/PR documentation; then require fresh exact-final-head CI before auto-merge.
