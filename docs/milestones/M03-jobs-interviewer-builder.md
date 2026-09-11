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

1. **VERIFIED SLICE** — M03.1 Jobs + Requirements. Tenant CRUD, explicit must-have/nice-to-have requirements, route-bound actions/UI and provider-backed authorization/isolation are present.
2. **VERIFIED SLICE** — M03.2 Competency Model. Tenant/job-bound persistence, bounded validation, deterministic ordering, fixed-role authority, route-bound UI/actions and provider-backed isolation are present. Exact implementation head `18504de66a11ea6f5944fae4cf2c2522ca5f7c88`, CI #292 / `34647354026`.
3. **VERIFIED SLICE** — M03.3 Observable 1–5 Rubrics. Complete five-level observable definitions, atomic persistence/editor and provider-backed tenant/role isolation are present. Provider-backed head `b6607a5a9ad72dea585ac2af4cf374e3d319883d`, CI #301 / `34649940346`.
4. **VERIFIED SLICE** — M03.4 Question Bank. Bounded questions with competency link, difficulty, expected areas, follow-up hints, max duration, required/optional state and deterministic ordering are implemented. Route-bound authoring and reviewer read-only UI are integrated. Exact integrated head `48754524c55c183af5714dee149cd28ead852a5a`, CI #329 / `34657019454`; provider-backed security head `c5a8688f62eb74bfe5964a203e92e520bc0a01d9`, CI #330 / `34657330228`.
5. **NEXT / NOT STARTED** — M03.5 Deterministic Interview Plan: ordered sections, duration budgets, question ownership and required coverage.
6. **NOT STARTED** — M03.6 Interviewer Configuration.
7. **NOT STARTED** — M03.7 Guardrail Validation.
8. **NOT STARTED** — M03.8 Draft / Publish.
9. **NOT STARTED** — M03.9 Immutable Versioning.
10. **NOT STARTED** — M03.10 Preview.
11. **NOT STARTED** — M03.11 Builder E2E closeout.

## TDD Evidence

M03.1 and M03.2 evidence is preserved in earlier branch history and CI. Most recent M03.4 evidence:

- Route-bound action RED: `7458e880cbd95ea44687b3223acf78c1dbceed21`, CI #322 / `34656371935`. Install/lint/typecheck passed and the five new tests failed only because the action module was absent.
- Route-bound action GREEN implementation: `9886566c20ff4b7c39a607e4bb770d6efb5fffbc`; subsequent exact integrated heads retain passing action tests.
- Editor attempt `dbe9d563c553b35d56d83018a768c01e3a7309ed`, CI #324 is **NOT RED** because typecheck failed on an unavailable test dependency before behavior ran.
- Editor RED: `8ffa9cebf156a0f27341f603863ec442e1beae0d`, CI #325 / `34656625620`. Lint/typecheck passed; only the three new question editor tests failed because the component did not exist.
- Editor GREEN implementation: `49782ba3ce1c4e9bd07c79857191a95533cb41b2`; subsequent integrated heads retain passing tests.
- Page-wiring attempt `679c93e24ff476ba91a2216b8dcd5588bbfc27ca`, CI #327 is **NOT RED** because the test fixture failed typecheck first.
- Page-wiring RED: `07b92bb0fa5dc5036b3700a3ee4cb2fbbe006fca`, CI #328 / `34656918637`. Lint/typecheck passed; 205 unrelated tests passed and only the two new page tests failed because question loading/wiring was absent.
- Integrated GREEN: `48754524c55c183af5714dee149cd28ead852a5a`, CI #329 / `34657019454`, full quality gate PASS.
- Provider/security verification: `c5a8688f62eb74bfe5964a203e92e520bc0a01d9`, CI #330 / `34657330228`, full quality gate PASS.

## Integration / E2E Evidence

- `e2e/jobs.spec.ts` proves real local-Supabase job tenant and role boundaries.
- `e2e/competencies.spec.ts` proves competency tenant and fixed-role authority.
- `e2e/rubrics.spec.ts` proves rubric tenant and mutation authority; CI #301 passed.
- `e2e/questions.spec.ts` proves authorized owner/recruiter/hiring-manager question creation; reviewer denial; Org B cross-tenant write/read denial; anonymous read denial; competency/job ownership; and deterministic persisted order. CI #330 passed.

## Integration Test Evidence

M03.1–M03.4 have provider-backed local-Supabase evidence on the active branch. CI #330 / `34657330228` passed frozen install, lint, typecheck, unit/component tests, framework/source verification, real local Supabase startup, production build, Chromium E2E, PRD coverage and teardown at exact head `c5a8688f62eb74bfe5964a203e92e520bc0a01d9`.

## Security Review

M03.1–M03.4 persistence remains organization-owned with member-read RLS and narrow authenticated security-definer mutation RPCs for fixed authorized roles. Server actions bind tenant/job identity from routes instead of trusting form-body organization/job values. Questions additionally require the competency to belong to the same organization and job. Provider-backed Org A/Org B/anonymous abuse coverage exists. Critical: 0 unresolved. Important: 0 unresolved in currently reviewed M03.1–M03.4 scope.

## Accessibility Review

Job, competency, rubric and question authoring surfaces are labelled and component-tested. Question authoring is hidden for read-only users and clearly blocks authoring until a competency exists. Milestone-wide browser/mobile accessibility closeout remains pending for M03.5–M03.11.

## Performance Review

Current M03 data is bounded and ordered with targeted indexes/constraints. No material blocker found in reviewed M03.1–M03.4 scope. Milestone-wide performance review remains pending.

## AI / Eval Review

No model-generated question suggestions were added in M03.4, so no generated suggestion can silently become authoritative. Organization-authored content remains untrusted. Later guardrail work must reject protected-trait, appearance, emotion, accent, deception, medical/family/political/religious and autonomous hire/reject criteria.

## Code Review Findings

- Resolved prior M03.1 Important finding: requirement ordering uniqueness.
- M03.4 review found no unresolved Critical/Important correctness, tenancy, accessibility or AI-authority issue in the implemented scope.
- Minor/deferred product capability: question editing/deletion/reordering UI is not introduced by this slice; the current PRD/plan requires a bounded question bank/editor and deterministic persisted position, while broader management can be added only if later acceptance flow requires it. Do not expand speculatively.

## Fresh Verification Results

- M03.3 provider-backed head `b6607a5a9ad72dea585ac2af4cf374e3d319883d`: CI #301 / `34649940346` PASS.
- M03.4 integrated UI head `48754524c55c183af5714dee149cd28ead852a5a`: CI #329 / `34657019454` PASS across complete quality gate.
- M03.4 provider-backed isolation head `c5a8688f62eb74bfe5964a203e92e520bc0a01d9`: CI #330 / `34657330228` PASS across complete quality gate.
- This durable reconciliation creates a newer documentation-only head and therefore does not replace the implementation evidence above; any subsequent behavioral integration claim requires exact-head verification for its own SHA.

## Known Limitations

M03.5–M03.11 remain incomplete. PR #5 must remain draft/unmerged. Full milestone accessibility/performance/security/AI-safety review and immutable publish/preview closeout remain pending.

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

Begin M03.5 with genuine RED tests for positive bounded duration, deterministic section ordering, route/tenant/job-bound question ownership, total-duration consistency and required-question/competency coverage. Verify intended behavioral RED before production interview-plan schema/domain/editor code.

## Next Milestone
M04 — Candidates + Invitations, only after M03 is genuinely complete and merged with post-merge `main` verification.
