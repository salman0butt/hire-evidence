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

1. **VERIFIED SLICE** — M03.1 Jobs + Requirements.
2. **VERIFIED SLICE** — M03.2 Competency Model. Exact implementation head `18504de66a11ea6f5944fae4cf2c2522ca5f7c88`, CI #292 / `34647354026`.
3. **VERIFIED SLICE** — M03.3 Observable 1–5 Rubrics. Provider-backed head `b6607a5a9ad72dea585ac2af4cf374e3d319883d`, CI #301 / `34649940346`.
4. **VERIFIED SLICE** — M03.4 Question Bank. Provider-backed security head `c5a8688f62eb74bfe5964a203e92e520bc0a01d9`, CI #330 / `34657330228`.
5. **VERIFIED SLICE** — M03.5 Deterministic Interview Plan. Validation, tenant/job-bound persistence, atomic fixed-role save authority, typed repository, route-bound action/editor, and provider-backed role/tenant/job isolation are present. Exact fully verified head `332caa332b1a6b978860f54f15227ce4d82b385d`, CI #358 / `34665349746`.
6. **ACTIVE / PARTIALLY VERIFIED** — M03.6 Interviewer Configuration. Bounded configuration validation plus tenant/job/plan-bound draft persistence, member-read RLS, and fixed-role save authority are implemented. Typed repository/action/editor/provider-backed isolation remain.
7. **NOT STARTED** — M03.7 Guardrail Validation.
8. **NOT STARTED** — M03.8 Draft / Publish.
9. **NOT STARTED** — M03.9 Immutable Versioning.
10. **NOT STARTED** — M03.10 Preview.
11. **NOT STARTED** — M03.11 Builder E2E closeout.

## TDD Evidence

### M03.5 deterministic plan closeout

- Fully verified implementation/provider-backed head: `332caa332b1a6b978860f54f15227ce4d82b385d`, CI #358 / `34665349746` PASS across the complete repository quality gate.
- The verified slice includes route-bound save action, accessible ordered editor, page wiring, fixed-role mutation, member reads, and provider-backed cross-tenant/cross-job/anonymous isolation.

### M03.6 interviewer configuration validation

- RED: `2e8a88fc452d80bfa4ea59bbbc1f2cb1eb89829a`, CI #359 / `34666412220`. Install/lint/typecheck passed; 229 unrelated tests passed; only four new configuration-validation tests failed with `ERR_MODULE_NOT_FOUND` because the implementation was intentionally absent.
- GREEN: `7ae46568e458f5efb3447707602ee1c77e750c04`, CI #360 / `34666523775`. Bounded interviewer type/persona/language/duration/difficulty/question strategy/guidelines/candidate-instructions/follow-up validation landed and the full repository quality gate passed.

### M03.6 interviewer configuration persistence

- RED: `73063d7029038924468dc9e27fc994a53abb5fdd`, CI #361 / `34666780326`. Install/lint/typecheck passed; 233 unrelated tests passed; only four migration-contract tests failed because `supabase/migrations/202609120005_create_interviewer_configs.sql` was intentionally absent.
- GREEN: `dce42df18176a00e5c33f910332c276245de5ac5`, CI #362 / `34666866674`. Tenant/job/plan-bound configuration persistence, database bounds, member-read RLS and fixed-role `save_interviewer_config` security-definer mutation landed. Full repository quality gate passed including real local-Supabase migration application, build and Chromium E2E.

## Integration / E2E Evidence

- `e2e/jobs.spec.ts` proves real local-Supabase job tenant and role boundaries.
- `e2e/competencies.spec.ts` proves competency tenant and fixed-role authority.
- `e2e/rubrics.spec.ts` proves rubric tenant and mutation authority.
- `e2e/questions.spec.ts` proves question fixed-role, tenant, job and competency boundaries.
- `e2e/interview-plans.spec.ts` proves deterministic-plan fixed-role mutation, member read, tenant/job isolation and anonymous denial.
- Dedicated provider-backed interviewer-configuration role/tenant/job/plan abuse coverage remains required before M03.6 closeout.

## Security Review

M03.6 configuration rows are organization-owned and constrained to the same job and deterministic plan through composite foreign keys. Authenticated members receive read-only RLS access; direct authenticated mutation is not granted. Draft mutation is exposed only through a fixed-role authenticated security-definer RPC for owner/admin/recruiter/hiring-manager. Organization-authored guidelines remain untrusted and M03.7 must enforce global non-overridable policy. Critical: 0 unresolved. Important: 0 unresolved in the currently reviewed M03.6 validation/persistence scope.

## Accessibility Review

M03.1–M03.5 authoring surfaces are labelled/component-tested. M03.6 editor does not exist yet, so no M03.6 accessibility/browser claim is made beyond existing regression E2E.

## Performance Review

Current M03 persistence remains bounded and indexed without an identified material performance blocker. Milestone-wide performance review remains pending.

## AI / Eval Review

No model-generated hiring criteria or questions become authoritative. Organization-authored configuration remains untrusted. M03.7 must reject protected-trait, appearance, emotion, accent, deception, medical/family/political/religious and autonomous hire/reject criteria, with platform policy outranking organization text.

## Code Review Findings

- Resolved prior M03.1 Important finding: requirement ordering uniqueness.
- M03.5 verified scope has 0 known unresolved Critical and 0 known unresolved Important findings.
- Current M03.6 validation/persistence inspection has 0 known unresolved Critical and 0 known unresolved Important findings.
- Do not mark M03.6 verified until typed application repository/action/editor behavior and provider-backed authorization/isolation are proven.

## Fresh Verification Results

- M03.5 final verified slice: `332caa332b1a6b978860f54f15227ce4d82b385d`, CI #358 / `34665349746` PASS.
- M03.6 validation GREEN: `7ae46568e458f5efb3447707602ee1c77e750c04`, CI #360 / `34666523775` PASS.
- M03.6 persistence GREEN: `dce42df18176a00e5c33f910332c276245de5ac5`, CI #362 / `34666866674` PASS across the complete repository quality gate.
- Documentation reconciliation commits after `dce42df…` require fresh exact-head CI before the documentation head itself is called verified.

## Known Limitations

M03.6 typed repository/action/editor/provider-backed E2E and M03.7–M03.11 remain incomplete. PR #5 must remain draft/unmerged. Full milestone accessibility/performance/security/AI-safety review and immutable publish/preview closeout remain pending.

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

Recover newest branch/CI state after this documentation reconciliation. Then continue M03.6 with a genuine RED for the typed interviewer-configuration application repository boundary. After GREEN, implement route-bound action/editor behavior and provider-backed role/tenant/job/plan isolation before marking M03.6 verified.

## Next Milestone
M04 — Candidates + Invitations, only after M03 is genuinely complete and merged with post-merge `main` verification.
