# Project Status

Last reconciled: 2026-09-17

## Completed Milestones

M00 Product Foundation, M01 SaaS Shell + Auth, M02 Organizations + RBAC, M03 Jobs + Interviewer Builder, M04 Candidates + Invitations, M05 Realtime AI Interview, M06 Transcript + Durable Session, and M07 Evidence-Based Assessment Engine are **COMPLETE**.

M07 PR #9 squash-merged as `d85883f4177e2ec122a695092d5c6ac846afbe72`. Post-merge main CI #920 / run `35054705165` passed the complete repository gate.

## Current Milestone

Hiring Team Review Experience (M08) — **IMPLEMENTING M08.2**.

Active branch: `feat/hiring-team-review`.
Active PR: #10 — `Build hiring team review experience` — OPEN / DRAFT.
Verified base/main: `d85883f4177e2ec122a695092d5c6ac846afbe72`.
CI status: M08.1 final verified head `f36b520eacee26069ee7da8047bbae50ebe1f727` passed exact-head CI #930 / run `35206818423` including provider-backed database tests, build and Chromium E2E.

Selected design: `docs/superpowers/specs/2026-09-16-hiring-team-review-design.md`.
Selected plan: `docs/superpowers/plans/2026-09-16-hiring-team-review.md`.
Milestone ledger: `docs/milestones/M08-hiring-team-review.md`.

## M08 Task State
- M08.1 Candidate result projection/page — **VERIFIED**. Fail-closed tenant/job/candidate repository + security-definer RPC + result page are covered by unit, provider-backed database and browser gates.
- M08.2 Competency/evidence cards — **ACTIVE**. Use the completed assessment plus competency identity from the immutable interviewer-version snapshot; do not read mutable live competency names as historical truth.
- M08.3 Transcript viewer — **NOT STARTED**.
- M08.4 Evidence deep links — **NOT STARTED**.
- M08.5 Human score overrides — **NOT STARTED**.
- M08.6 Reviewer notes/status — **NOT STARTED**.
- M08.7 AI/human disagreement — **NOT STARTED**.
- M08.8 Job candidate dashboard — **NOT STARTED**.
- M08.9 Visual/accessibility/E2E closeout — **NOT STARTED**.

## Review / Safety State
Critical findings: **0 known**.
Important findings: **0 known** after M08.1 provider-backed scope hardening.
PR #10 has no unresolved inline review threads at latest recovery. Humans remain decision makers. AI assessment/provenance/history is immutable. Human overrides must preserve AI score and require attributable reason. Tenant/job/candidate/attempt/assessment authorization is server-authoritative. Transcript/model/reviewer text remains inert data. No autonomous hire/reject/ranking or candidate-success probability.

## Latest Verification Evidence
- Repository RED `2f1f7dcc260e401a42392d717bd2957daafd0a3c` / CI #921 run `35055211285` failed for the intended missing candidate-result repository; GREEN `7125b5c2424cd2a919dd65776c4d34d57b726710` / CI #922 run `35055274842`.
- RPC RED `d8518c2673ed3042e78cf1971d4916fafddf4dd4` / CI #925 run `35200668092`; RPC GREEN `7185d2e2daec6fb965715274eb35c8cb3296ce0c` / CI #926 run `35201308470`.
- Page RED `301be2ad7215f95de28d5772b1d613cb6292273b` / CI #927 run `35201856962`. Initial implementation `a74d724007a0551c4b5cb096dde08ad36d0ca49b` / CI #928 was NOT GREEN because the RPC client type was too narrow. Root-cause fix `1207c07b48e8028a138b8292a91d9c7507119c03` passed CI #929 run `35204953237`.
- Verification hardening `f36b520eacee26069ee7da8047bbae50ebe1f727` passed CI #930 run `35206818423`; this commit adds successful safe projection, cross-tenant denial, same-tenant wrong-job, missing-candidate and uncompleted-assessment provider coverage and is not represented as a new RED.

Exact next work: start M08.2 under strict TDD by adding a provider-backed RED that requires the review projection to expose the validated completed assessment and immutable competency identity from `interviewer_versions.snapshot`, verify the intended RED, then implement the minimum safe projection before repository/card UI work.
