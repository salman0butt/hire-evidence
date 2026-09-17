# M08 — Hiring Team Review Experience

Status: **IMPLEMENTING — M08.2 ACTIVE**

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
Human-review-first experience over immutable M07 assessment generations and M06 durable transcript. Review state and human judgment stay separate from AI output. Overrides preserve AI score and require reason/reviewer attribution. Tenant/job/candidate/attempt relationships remain server-authoritative. Historical competency identity must be resolved from the immutable published `interviewer_versions.snapshot`, never silently relabeled from mutable current configuration.

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
2. **ACTIVE** — M08.2 competency/evidence cards.
3. **NOT STARTED** — M08.3 transcript viewer.
4. **NOT STARTED** — M08.4 evidence deep links.
5. **NOT STARTED** — M08.5 human score overrides.
6. **NOT STARTED** — M08.6 reviewer notes/status lifecycle.
7. **NOT STARTED** — M08.7 AI/human disagreement data.
8. **NOT STARTED** — M08.8 job candidate dashboard without AI ranking.
9. **NOT STARTED** — M08.9 visual/accessibility/E2E closeout.

## TDD Evidence
M08.1 repository RED `2f1f7dcc260e401a42392d717bd2957daafd0a3c` / CI #921 run `35055211285` → repository GREEN `7125b5c2424cd2a919dd65776c4d34d57b726710` / CI #922 run `35055274842`.

M08.1 database RPC RED `d8518c2673ed3042e78cf1971d4916fafddf4dd4` / CI #925 run `35200668092` → RPC GREEN `7185d2e2daec6fb965715274eb35c8cb3296ce0c` / CI #926 run `35201308470`.

M08.1 page RED `301be2ad7215f95de28d5772b1d613cb6292273b` / CI #927 run `35201856962`. Initial page implementation `a74d724007a0551c4b5cb096dde08ad36d0ca49b` failed CI #928 because the adapter required a concrete `Promise`; this is recorded as NOT GREEN. Root-cause fix `1207c07b48e8028a138b8292a91d9c7507119c03` changed only the RPC adapter contract to `PromiseLike` and passed CI #929 run `35204953237`.

Provider-backed verification hardening `f36b520eacee26069ee7da8047bbae50ebe1f727` is not claimed as RED; it strengthened coverage for real successful projection, latest completed generation, cross-tenant denial, same-tenant wrong-job, missing candidate and uncompleted assessment and passed CI #930.

## Integration Test Evidence
`supabase/tests/get_candidate_review_result_test.sql` exercises authenticated execute/anonymous denial, unauthenticated failure, real cross-tenant denial, exact safe projection, same-tenant job mismatch, absent candidate and absent completed assessment. Exact-head CI #930 / run `35206818423` passed the local Supabase boundary stage.

## E2E / Visual Verification
CI #930 passed the existing Chromium E2E suite on the exact M08.1 head. Dedicated independent-review/evidence navigation and responsive visual acceptance remains owned by later M08 iterations and M08.9.

## Security Review
M08.1 reviewed for security/tenancy: security-definer RPC requires authenticated organization membership, joins organization/job/candidate/attempt/completed assessment on server-authoritative keys, exposes only bounded metadata, denies anonymous execute, and provider tests cover cross-tenant and same-tenant wrong-job cases. No Critical/Important security finding remains.

## Accessibility Review
M08.1 result page uses semantic heading and definition-list status metadata and preserves plain text rendering. Deeper keyboard/focus/evidence-navigation/mobile verification remains required as interactive review UI is added.

## Performance Review
M08.1 projection is one bounded scoped query selecting only the latest completed attempt and assessment generation. M08.2 should extend the same bounded result without N+1 live competency lookups.

## AI / Eval Review
Humans remain decision makers. M08.1 exposes no hire/reject/recommendation/ranking output. Assessment generation identity is shown as historical metadata. AI/human disagreement later remains separate and must never mutate AI history.

## Code Review Findings
- Important: initial provider DB test proved denial but not a real successful projection/missing/uncompleted/same-tenant wrong-job boundary. Resolved by `f36b520eacee26069ee7da8047bbae50ebe1f727` and verified in CI #930.
- Critical: none known.
- PR #10 unresolved review threads: 0 at latest recovery.

## Fixes / Re-review
M08.1 Important test-depth finding was fixed and re-reviewed. Provider-backed database, build and E2E gates passed on the exact fix head; no Critical/Important findings remain for M08.1.

## Fresh Verification Commands
Repository CI runs frozen install, lint, typecheck, unit/component tests, framework/source verifiers, local Supabase tests, build, Chromium E2E and PRD coverage.

## Fresh Verification Results
M08.1 exact verified head `f36b520eacee26069ee7da8047bbae50ebe1f727`: CI #930 / run `35206818423` complete GREEN across every required job step.

## Commits / Files Changed
M08.1 added the candidate-result repository/tests, tenant-scoped `get_candidate_review_result` migration/provider tests, candidate result route/page tests, and a minimal Supabase RPC adapter typing fix. PR #10 remains the single milestone PR.

## Known Limitations
M08.1 intentionally contains only result metadata. Competency/evidence review is M08.2 and is now active; transcript/deep links/human review state/dashboard remain later iterations.

## Documentation Updated
Canonical status/current/handoff, this ledger, traceability and feature matrix are reconciled when M08.2 activates.

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
