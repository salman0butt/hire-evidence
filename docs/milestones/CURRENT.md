# Current Milestone

Milestone: Hiring Team Review Experience (M08)

Status: **IMPLEMENTING — M08.8 JOB CANDIDATE DASHBOARD**

Branch: `feat/hiring-team-review`
PR: #10 — `Build hiring team review experience` — OPEN / DRAFT.
Base: `main` at M07 merge SHA `d85883f4177e2ec122a695092d5c6ac846afbe72`.
Canonical recovery state: `docs/progress/STATUS.md`.

Design: `docs/superpowers/specs/2026-09-16-hiring-team-review-design.md`
Plan: `docs/superpowers/plans/2026-09-16-hiring-team-review.md`

## Iterations
1. M08.1 — Candidate result projection/page — **VERIFIED**.
2. M08.2 — Competency/evidence cards — **VERIFIED**.
3. M08.3 — Transcript viewer — **VERIFIED**.
4. M08.4 — Evidence deep links — **VERIFIED**.
5. M08.5 — Human score overrides — **VERIFIED**.
6. M08.6 — Reviewer notes/status lifecycle — **VERIFIED**.
7. M08.7 — AI/human disagreement — **VERIFIED** at `071b894c440b3c63bf8126e948593ce1750acf2d`, CI #1010 / run `35568824247` GREEN. The projection derives comparison from immutable AI scores plus latest durable human overrides without mutating either source; invalid/orphaned override data fails closed.
8. M08.8 — Job candidate dashboard — **ACTIVE**. Build job-scoped candidate/review workflow state with neutral filter/sort metadata and no AI best-candidate ranking.
9. M08.9 — Visual/accessibility/E2E closeout — **NOT STARTED**.

## Latest Verification
Exact head `071b894c440b3c63bf8126e948593ce1750acf2d` passed CI #1010 / run `35568824247`. The immediately preceding M08.7 implementation checkpoint failed only because its test fixture claimed sufficient evidence with no citation; that checkpoint is NOT GREEN evidence. The corrected fixture passed the complete repository gate at #1010.

## Review State
- Unresolved Critical findings: **0 known**.
- Unresolved Important findings: **0 known**.
- PR #10 unresolved inline review threads: **0** at latest recovery.

## Constraints
- Humans remain hiring decision makers; no autonomous hire/reject/ranking.
- AI assessment/provenance/history remains immutable.
- Human overrides preserve AI score and require attributable reason.
- Tenant/job/candidate/attempt/assessment authorization is server-authoritative.
- Transcript/model/reviewer text remains inert data.

## Next Action
Execute M08.8 under strict TDD: first prove the job detail workflow lacks the required candidate review dashboard, then implement a tenant/job-scoped neutral candidate list with review/interview workflow metadata and explicit absence of AI ranking/recommendation behavior.