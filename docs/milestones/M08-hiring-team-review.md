# M08 — Hiring Team Review Experience

Status: **IMPLEMENTING — M08.3 ACTIVE**

## Goal
Enable an authorized human hiring-team member to independently review AI assessment and transcript evidence, record human judgment and preserve disagreement/audit history.

## Authoritative PRD Milestone Definition
Deliver candidate results, assessment dashboard, transcript viewer, evidence deep links, human score override, reviewer notes, review status, AI/human disagreement and job candidate dashboard. Exit: human can independently review AI assessment.

## Dependencies
M07 Evidence-Based Assessment Engine squash-merged as `d85883f4177e2ec122a695092d5c6ac846afbe72`. Post-merge main CI #920 / run `35054705165` passed the complete repository gate before M08 activation.

## In Scope
M08.1–M08.9: result page, competency/evidence cards, transcript viewer, evidence deep links, human overrides, reviewer notes/status, disagreement data, job candidate dashboard and visual/accessibility/E2E closeout.

## Out of Scope
Autonomous hire/reject/strong-hire, candidate success probability, AI best-candidate ranking, destructive rewriting of AI assessment history, later billing/usage/eval milestones and unrelated provider changes.

## Architecture Notes
Human-review-first experience over immutable M07 assessment generations and M06 durable transcript. Review state and human judgment stay separate from AI output. Overrides preserve AI score and require reason/reviewer attribution. Tenant/job/candidate/attempt relationships remain server-authoritative. Historical competency identity is resolved from the immutable published `interviewer_versions.snapshot`. Hiring-team transcript reads use authenticated scoped authority and do not depend on candidate invitation tokens. Transcript/model/reviewer text is inert data; technical events stay separate from evaluative transcript evidence.

## Selected Design / Implementation Plan
- Design: `docs/superpowers/specs/2026-09-16-hiring-team-review-design.md`.
- Plan: `docs/superpowers/plans/2026-09-16-hiring-team-review.md`.

## Acceptance Criteria
- Human can independently review AI assessment and exact supporting transcript evidence.
- Human overrides preserve original AI score and require attributable reason.
- No AI best-candidate ranking or autonomous hire/reject behavior.
- Tenant/job/candidate/attempt/assessment authorization fails closed.
- Relevant security/privacy/accessibility/performance/AI-safety gates pass.
- 0 unresolved Critical/Important findings; traceability/docs current; exact-final-head CI green.

## Tasks / Iterations
1. **VERIFIED** — M08.1 candidate result projection/page.
2. **VERIFIED** — M08.2 competency/evidence cards.
3. **ACTIVE** — M08.3 transcript viewer.
4. **NOT STARTED** — M08.4 evidence deep links.
5. **NOT STARTED** — M08.5 human score overrides.
6. **NOT STARTED** — M08.6 reviewer notes/status lifecycle.
7. **NOT STARTED** — M08.7 AI/human disagreement data.
8. **NOT STARTED** — M08.8 job candidate dashboard without AI ranking.
9. **NOT STARTED** — M08.9 visual/accessibility/E2E closeout.

## TDD Evidence
M08.1 repository RED `2f1f7dcc260e401a42392d717bd2957daafd0a3c` / CI #921 → repository GREEN `7125b5c2424cd2a919dd65776c4d34d57b726710` / CI #922. Database RPC RED `d8518c2673ed3042e78cf1971d4916fafddf4dd4` / CI #925 → GREEN `7185d2e2daec6fb965715274eb35c8cb3296ce0c` / CI #926. Page RED `301be2ad7215f95de28d5772b1d613cb6292273b` / CI #927; initial `a74d7240…` / CI #928 was NOT GREEN due an RPC adapter type mismatch; root-cause fix `1207c07b48e8028a138b8292a91d9c7507119c03` passed CI #929. Provider hardening `f36b520eacee26069ee7da8047bbae50ebe1f727` passed CI #930.

M08.2 provider projection RED `b129d5d67bb12beb6a4105070f021d1c77778aa3` / CI #932 run `35207711737` → GREEN `3ead20de07382d06a8d49ac1dfee7af6b48bb6ef` / CI #933 run `35208233526`. Repository genuine RED `7d0b86e98c83bfaae605c9891b95d7eee5b41342` failed on missing `review_competencies` → GREEN `fd50c8a1f7c9bc286b5f2a3eddb588e13d04b9f7` / CI #936. `90b39865…` is explicitly not counted as behavioral RED because it stopped at test typing. Card UI RED `82749fa7615df25c906c7afa7ce827155bcdc18d` / CI #937 → GREEN `803ca803c5e60d1b0baa9bf761ad88ee55fa994b` / CI #938. Assessment-summary RED `e46a68c79299f7cd4a53cffb672f0ff22cdd84c7` / CI #939 → GREEN `afc3b79ccc66faed15f7c7831fcd6f4f9d827873` / CI #940. Test-only fail-closed hardening `6616fcc735df5ee06616f3e6e2cb7146469cea7c` passed CI #941 / run `35215607658` and is not represented as a new RED.

## Integration Test Evidence
`supabase/tests/get_candidate_review_result_test.sql` verifies authenticated execution, anonymous denial, unauthenticated failure, real cross-tenant denial, exact tenant/job/candidate result selection, latest completed assessment generation, immutable competency identity from the published interviewer-version snapshot, same-tenant wrong-job rejection, missing candidate and absent completed assessment. M08.2 exact-head CI #941 passed the local Supabase boundary stage.

## E2E / Visual Verification
CI #941 passed the existing Chromium E2E suite on the exact M08.2 behavioral head. Dedicated transcript/evidence-navigation visual acceptance remains owned by M08.3–M08.4 and final responsive/accessibility closeout by M08.9.

## Security Review
M08.2 review data remains behind the M08.1 authenticated organization/job/candidate boundary. Completed assessment payloads are re-parsed with the M07 runtime schema before rendering. Decision-like payload fields fail closed, and assessed competency IDs must resolve against immutable published-version identity. No Critical/Important security finding remains. M08.3 must add a hiring-team-specific authenticated transcript read boundary rather than reuse the candidate-facing token RPC.

## Accessibility Review
The result page now exposes semantic assessment-summary and competency-review sections, configured competency headings, explicit AI score or insufficient-evidence state, rationale, evidence sufficiency and supporting turn/excerpt text. Evidence references are intentionally inert until M08.4 adds focus/deep-link behavior. Keyboard/focus/search/mobile transcript verification remains required in M08.3–M08.4/M08.9.

## Performance Review
M08.2 extends the bounded candidate-result projection with the completed assessment and immutable competency catalog in one server-authoritative query, then enriches in memory; no N+1 live-competency lookups were introduced. Transcript review must remain attempt-scoped and ordered.

## AI / Eval Review
Humans remain decision makers. M08.2 exposes AI assessment as review input, labels scores as AI assessment, represents insufficient evidence explicitly, and shows no hire/reject/recommendation/ranking output. Original assessment payload/history remains immutable. A regression test proves a decision-like `recommendation` payload fails closed before review rendering.

## Code Review Findings
- M08.1 Important: provider test depth initially proved denial but not successful/missing/uncompleted/same-tenant wrong-job behavior; resolved by `f36b520e…` / CI #930.
- M08.2 skeptical review found one acceptance gap: validated assessment summary was not yet shown above competency cards. Resolved through RED `e46a68c…` / CI #939 and GREEN `afc3b79c…` / CI #940.
- M08.2 validation hardening added explicit rejection of decision-like assessment payloads and unresolved immutable competency identity at `6616fcc7…`; CI #941 GREEN.
- Critical: none known.
- Important: none known unresolved.
- PR #10 unresolved review threads: 0 at latest recovery.

## Fixes / Re-review
M08.1 and M08.2 findings were fixed and re-reviewed. Provider-backed database, build and Chromium E2E gates passed on the exact M08.2 hardening head. No Critical/Important findings remain for completed M08.1–M08.2 work.

## Fresh Verification Commands
Repository CI runs frozen install, lint, typecheck, unit/component tests, framework/source verifiers, local Supabase tests, build, Chromium E2E and PRD coverage.

## Fresh Verification Results
M08.2 exact verified behavioral head `6616fcc735df5ee06616f3e6e2cb7146469cea7c`: CI #941 / run `35215607658` complete GREEN across every required job step.

## Commits / Files Changed
M08.1 added candidate-result repository/tests, tenant-scoped result RPC/provider tests and result page. M08.2 extended that bounded projection with immutable assessment/competency identity, added runtime review validation/enrichment, assessment summary and competency/evidence cards, and added fail-closed regression tests. PR #10 remains the single milestone PR.

## Known Limitations
M08.3 transcript review is now active. Evidence references are displayed but are not navigable until M08.4. Human overrides, notes/status, disagreement and dashboard remain later iterations.

## Documentation Updated
Canonical status/current/handoff, this ledger, traceability and feature matrix are reconciled to M08.2 VERIFIED / M08.3 ACTIVE after CI #941.

## Durable Recovery Sources
`AGENTS.md` → `docs/AUTONOMOUS-DEVELOPMENT.md` → `docs/progress/STATUS.md` → known issues → this ledger → requirements source → selected design/plan → active PR/reviews/exact-head CI → source/tests.

## Completion Checklist
- [ ] Requirements and iterations accounted for.
- [ ] Acceptance criteria verified.
- [ ] Required TDD/integration/E2E evidence recorded.
- [ ] Security/accessibility/performance/AI-eval reviews complete.
- [ ] 0 Critical / 0 Important findings.
- [ ] Traceability/feature matrix reconciled.
- [ ] Exact-final-head CI green.
- [ ] Durable status/closeout state current.

## Next Milestone
M09 — Billing + Usage.
