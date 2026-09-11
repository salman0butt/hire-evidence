# M03 — Jobs + Interviewer Builder

Status: **ACTIVE**

## Goal
Deliver tenant-scoped jobs and an interviewer-builder domain that allows an organization to publish an immutable, safety-validated interviewer version.

## Authoritative PRD Milestone Definition

Deliver: jobs, job criteria, competencies, rubrics, interview agent builder, persona, guidelines, question bank, interview sections, duration, draft/publish, versioning, preview, plus global guardrail validation.

Exit: organization can publish immutable interviewer version.

## In Scope

Tenant-scoped jobs and requirements; job competencies and observable rubrics; question bank; deterministic interview plan; interviewer configuration; non-overridable safety validation; draft/publish state; immutable published versions; non-billable preview; provider-backed tenant/security checks; responsive accessible builder flows.

## Out of Scope

Candidate records/invitations, realtime interview execution, voice/session infrastructure, candidate assessment/scoring, and autonomous hire/reject decisions. Those belong to later milestones.

## Dependencies
Organizations + RBAC — **COMPLETE** on `main` at `835d7d571a69cd13e3e802be4872e873ffdd34fe`; post-merge CI #232 passed.

## Selected Design / Implementation Plan

- Design: `docs/superpowers/specs/2026-09-11-jobs-interviewer-builder-design.md`
- Plan: `docs/superpowers/plans/2026-09-11-jobs-interviewer-builder.md`
- Active branch: `feat/jobs-interviewer-builder`
- Active PR: #5 — `Build jobs and interviewer configuration` — OPEN / DRAFT.

## Acceptance Criteria

- PRD deliverables and exit criteria pass.
- All required iterations are complete or explicitly resolved.
- Relevant security/privacy/tenancy/accessibility/performance/AI-safety gates pass.
- 0 unresolved Critical or Important review findings.
- Traceability and feature state are reconciled.
- Exact-final-head CI is green.

## Tasks / Iterations

1. **VERIFIED SLICE / CLOSEOUT RECONCILED** — M03.1 — Jobs: tenant CRUD, description/metadata, explicit must-have/nice-to-have requirements, route-bound actions/UI, role-gated mutation and real tenant isolation. Deterministic requirement ordering review issue resolved by RED `268afaaca87e3bf3dffa0a552a66e1dfab1f2ca9` / CI #272 → GREEN `5db7708f1aecc5122b4a4883f7875b9e02df3fe5` / CI #273.
2. **IN PROGRESS** — M03.2 — Competencies: explicit job-related competency model. Migration-contract RED `1ebd8c391fd79f592560c20b9c8c7752159fe4b7` / CI #275 failed for the intended missing migration; production foundation `6ebbba58a401a09418283c3fec88695ddff30375` made all 163 unit tests green, but CI #276 exposed only this ledger-framework regression before provider/build/E2E stages.
3. **NOT STARTED** — M03.3 — Rubrics: 1–5 observable evidence definitions, weights and validation.
4. **NOT STARTED** — M03.4 — Question bank: questions, competency links, difficulty, expected areas, limits.
5. **NOT STARTED** — M03.5 — Interview plan: deterministic sections, duration budgets, question coverage.
6. **NOT STARTED** — M03.6 — Interviewer configuration: persona, language, type, guidelines and follow-up policy.
7. **NOT STARTED** — M03.7 — Guardrail validation: reject prohibited/discriminatory configuration.
8. **NOT STARTED** — M03.8 — Draft/publish: state transitions and validation.
9. **NOT STARTED** — M03.9 — Immutable versioning: interviewer/rubric/prompt snapshots.
10. **NOT STARTED** — M03.10 — Preview: simulated/non-billable preview workflow.
11. **NOT STARTED** — M03.11 — Builder E2E: create job → configure → validate → publish immutable version.

## TDD Evidence

M03.1 contains multiple existing RED→GREEN cycles. Most recent skeptical-review cycle:

- RED: `268afaaca87e3bf3dffa0a552a66e1dfab1f2ca9`, CI #272 / `34642095960`. Frozen install, lint and typecheck passed. Unit suite reached 161 tests; 160 unrelated tests passed and only `keeps requirement positions unique per job for deterministic ordering` failed because the migration allowed `unique (job_id, kind, position)`.
- GREEN: `5db7708f1aecc5122b4a4883f7875b9e02df3fe5`, CI #273 / `34642360290`. Database invariant changed minimally to `unique (job_id, position)`.

M03.2 migration foundation:

- RED: `1ebd8c391fd79f592560c20b9c8c7752159fe4b7`, CI #275 / `34642942181`. Install/lint/typecheck passed; 161 existing tests passed and only the two new competency migration tests failed because `202609120001_create_competencies.sql` was absent.
- GREEN candidate: `6ebbba58a401a09418283c3fec88695ddff30375`. All 163 unit/component tests and source/framework unit verifiers passed in CI #276; the run then failed the autonomous framework verifier because this ledger rewrite had dropped mandatory headings. That is an invalid full-GREEN checkpoint, not a competency implementation failure.

## Integration / E2E Evidence

`e2e/jobs.spec.ts` exercises real local Supabase tenant and role boundaries: authorized owner/recruiter/hiring-manager job mutation; reviewer denial; Org B cross-tenant read/update denial; unauthenticated read/mutation denial; requirement persistence/order; update and delete. CI #273 passed local Supabase, production build and Chromium E2E.

## Integration Test Evidence

M03.1 provider-backed evidence is green in CI #273. M03.2 provider-backed competency evidence is still pending because CI #276 stopped at the framework verifier before local Supabase. The immediate gate is fresh exact-head CI after restoring the ledger contract, followed by provider-backed competency authorization/isolation tests before M03.2 closeout.

## Security Review

M03.1 database mutation authority is confined to authenticated security-definer RPCs with fixed organization roles; direct authenticated writes are not granted. Composite tenant foreign keys prevent cross-organization job/requirement relations. Org A/Org B/anonymous abuse coverage is provider-backed. Critical: 0 unresolved. Important: 0 unresolved for reviewed M03.1 scope.

M03.2 foundation follows the same authority model: organization/job composite ownership, member-readable RLS, no direct authenticated writes, and an authenticated fixed-role security-definer create RPC. Provider-backed abuse verification remains pending.

## Accessibility Review

Job list/create/edit component and browser coverage exist. Milestone-wide accessibility review remains pending until the remaining builder UI is implemented.

## Performance Review

No material M03.1 performance blocker found. Queries and persisted requirement arrays are bounded by validation. Milestone-wide review remains pending.

## AI / Eval Review

No model-generated authority is introduced by M03.1/M03.2. Organization-authored interview instructions remain untrusted. Later builder guardrails must continue to reject protected-trait, appearance, emotion, accent, personality, deception, medical/family, and autonomous hire/reject criteria.

## Code Review Findings

Resolved Important finding: requirement ordering was not uniquely constrained across requirement kinds. Fixed through genuine RED→GREEN evidence above.

Resolved documentation regression from CI #276: the M03 ledger must preserve framework-required `In Scope`, `Out of Scope`, `Integration Test Evidence`, and `Durable Recovery Sources` headings.

## Fresh Verification Results

CI #273 / `34642360290` passed on M03.1 implementation head `5db7708f1aecc5122b4a4883f7875b9e02df3fe5`: frozen install, lint, typecheck, 161 unit/component tests, framework/source verification, local Supabase, production build, Chromium E2E, PRD coverage, teardown.

CI #276 / `34643102036` on M03.2 foundation head `6ebbba58a401a09418283c3fec88695ddff30375` passed install, lint, typecheck, all 163 unit/component tests, framework/source unit tests, then failed only the autonomous framework script for missing ledger headings. It is recorded as **NOT FULL GREEN**.

## Known Limitations

M03.2 still needs provider-backed authorization/isolation verification and domain/repository/UI work. M03.3–M03.11 remain incomplete. PR #5 must remain draft/unmerged until every milestone merge gate is satisfied.

## Durable Recovery Sources

Recover actual GitHub state first, then read `AGENTS.md`, `CODEX-START-HERE.md`, `docs/AUTONOMOUS-DEVELOPMENT.md`, `docs/progress/STATUS.md`, `docs/progress/KNOWN-ISSUES.md`, `docs/milestones/CURRENT.md`, this ledger, `docs/SESSION-HANDOFF.md`, requirements/traceability, and the active M03 design/plan before writing.

## Completion Checklist

- [ ] Requirements and all M03 iterations accounted for.
- [ ] Milestone acceptance criteria verified.
- [ ] Required TDD/integration/E2E evidence complete.
- [ ] Security/accessibility/performance/AI-safety reviews complete.
- [ ] 0 Critical / 0 Important findings milestone-wide.
- [ ] Traceability/feature matrix reconciled.
- [ ] Exact-final-head CI green.
- [ ] Durable closeout state current.

## Exact Next Work

Re-run exact-head CI with the restored ledger contract. If green, add provider-backed competency tenant/role tests before expanding M03.2 repository/UI behavior.

## Next Milestone
M04 — Candidates + Invitations, only after M03 is genuinely complete and merged with post-merge `main` verification.
