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
4. **VERIFIED SLICE** — M03.4 Question Bank. Integrated UI head `48754524c55c183af5714dee149cd28ead852a5a`, CI #329 / `34657019454`; provider-backed security head `c5a8688f62eb74bfe5964a203e92e520bc0a01d9`, CI #330 / `34657330228`.
5. **ACTIVE / PARTIALLY VERIFIED** — M03.5 Deterministic Interview Plan. Deterministic validation, tenant/job-bound plan persistence, ordered sections/links, member-read RLS, fixed-role atomic save RPC, and typed application repository boundary are implemented. Route-bound action/editor and provider-backed plan isolation verification remain unfinished.
6. **NOT STARTED** — M03.6 Interviewer Configuration.
7. **NOT STARTED** — M03.7 Guardrail Validation.
8. **NOT STARTED** — M03.8 Draft / Publish.
9. **NOT STARTED** — M03.9 Immutable Versioning.
10. **NOT STARTED** — M03.10 Preview.
11. **NOT STARTED** — M03.11 Builder E2E closeout.

## TDD Evidence

### M03.4 retained evidence

- Route-bound action RED: `7458e880cbd95ea44687b3223acf78c1dbceed21`, CI #322 / `34656371935`.
- Editor RED: `8ffa9cebf156a0f27341f603863ec442e1beae0d`, CI #325 / `34656625620`.
- Page-wiring RED: `07b92bb0fa5dc5036b3700a3ee4cb2fbbe006fca`, CI #328 / `34656918637`.
- Integrated GREEN: `48754524c55c183af5714dee149cd28ead852a5a`, CI #329 / `34657019454`.
- Provider/security verification: `c5a8688f62eb74bfe5964a203e92e520bc0a01d9`, CI #330 / `34657330228`.

### M03.5 deterministic plan evidence

- Existing validation tests prove positive bounded duration, deterministic contiguous ordering, total-duration equality, allowed tenant/job question and competency ownership, and required question/competency coverage.
- Save-authority RED: `a93c5db7c733c6b9082c23e2478eb404a180e3b4`, CI #338 / `34661090957`. Install/lint/typecheck passed; 216 unrelated tests passed; the new save-authority migration assertion alone failed because `save_interview_plan` was absent.
- Save-boundary GREEN: `166412f5294ff77336dec278648cc7f08e4cdf05`, CI #339 / `34661205052`. Atomic fixed-role security-definer RPC landed and exact-head CI passed.
- Repository-boundary RED: `ed743bd9f53f778748897b2f264ba2a628769cd3`, CI #340 / `34661710164`. Install/lint/typecheck passed; 217 unrelated tests passed; only the two new repository tests failed because `src/lib/interviewer/interview-plans.ts` was intentionally absent.
- Repository-boundary GREEN: `c3d5081e22f389e88788c8f302187504b14ad303`, CI #341 / `34661832340`. Minimal typed `saveInterviewPlan` repository landed and the full repository quality gate passed.

## Integration / E2E Evidence

- `e2e/jobs.spec.ts` proves real local-Supabase job tenant and role boundaries.
- `e2e/competencies.spec.ts` proves competency tenant and fixed-role authority.
- `e2e/rubrics.spec.ts` proves rubric tenant and mutation authority.
- `e2e/questions.spec.ts` proves question fixed-role, tenant, job and competency boundaries.
- M03.5 provider-backed interview-plan authorization/isolation verification is still pending. A direct connector create-file attempt was rejected before reaching GitHub; no repository state changed from that rejected request and lower-level Git writes remain available.

## Integration Test Evidence

M03.1–M03.4 retain provider-backed local-Supabase evidence. M03.5 currently has migration contract coverage plus exact-head full-suite verification at `c3d5081e22f389e88788c8f302187504b14ad303`, CI #341 / `34661832340`; dedicated provider-backed interview-plan role/tenant/job abuse coverage is still required before M03.5 closeout.

## Security Review

Implemented M03.5 persistence is organization-owned. Plan sections and linked questions/competencies carry organization/job identifiers with composite foreign keys, read access is RLS member-scoped, and mutation is through a fixed-role authenticated security-definer RPC. Required coverage and duration consistency are rechecked transactionally. Critical: 0 unresolved. Important: 0 unresolved in the currently reviewed persistence/repository scope. Provider-backed abuse verification remains required before M03.5 closeout.

## Accessibility Review

M03.1–M03.4 authoring surfaces are labelled and component-tested. The M03.5 editor does not exist yet, so M03.5 accessibility/browser claims are not made.

## Performance Review

Current M03 persistence is bounded and indexed without an identified material performance blocker. Milestone-wide performance review remains pending.

## AI / Eval Review

No model-generated hiring criteria or questions become authoritative. Organization-authored configuration remains untrusted. Later guardrail work must reject protected-trait, appearance, emotion, accent, deception, medical/family/political/religious and autonomous hire/reject criteria.

## Code Review Findings

- Resolved prior M03.1 Important finding: requirement ordering uniqueness.
- Current M03.5 persistence/repository inspection has 0 unresolved Critical and 0 unresolved Important findings.
- Do not mark M03.5 verified until route-bound action/editor behavior and provider-backed authorization/isolation are proven.

## Fresh Verification Results

- M03.4 provider-backed isolation: `c5a8688f62eb74bfe5964a203e92e520bc0a01d9`, CI #330 / `34657330228` PASS.
- M03.5 save RPC GREEN: `166412f5294ff77336dec278648cc7f08e4cdf05`, CI #339 / `34661205052` PASS.
- M03.5 repository GREEN: `c3d5081e22f389e88788c8f302187504b14ad303`, CI #341 / `34661832340` PASS across the complete repository quality gate.
- Documentation reconciliation commits after `c3d5081…` require their own exact-head CI before being called current verified head.

## Known Limitations

M03.5 action/editor/provider-backed E2E and M03.6–M03.11 remain incomplete. PR #5 must remain draft/unmerged. Full milestone accessibility/performance/security/AI-safety review and immutable publish/preview closeout remain pending.

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

Recover newest branch/CI state after this documentation reconciliation. Then continue M03.5 with a genuine RED for the route-bound interview-plan action/editor, using server-derived questions and competencies as the authoritative allowed/required coverage context. After GREEN, add provider-backed plan role/tenant/job isolation verification and reconcile traceability before marking M03.5 verified.

## Next Milestone
M04 — Candidates + Invitations, only after M03 is genuinely complete and merged with post-merge `main` verification.
