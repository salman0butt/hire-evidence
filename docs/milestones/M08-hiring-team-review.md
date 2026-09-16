# M08 — Hiring Team Review Experience

Status: **IMPLEMENTING — M08.1 ACTIVE**

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
Human-review-first experience over immutable M07 assessment generations and M06 durable transcript. Review state and human judgment are separate from AI output. Overrides preserve AI score and require reason/reviewer attribution. Tenant/job/candidate/attempt relationships remain server-authoritative.

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
1. **ACTIVE** — M08.1 candidate result projection/page.
2. **NOT STARTED** — M08.2 competency/evidence cards.
3. **NOT STARTED** — M08.3 transcript viewer.
4. **NOT STARTED** — M08.4 evidence deep links.
5. **NOT STARTED** — M08.5 human score overrides.
6. **NOT STARTED** — M08.6 reviewer notes/status lifecycle.
7. **NOT STARTED** — M08.7 AI/human disagreement data.
8. **NOT STARTED** — M08.8 job candidate dashboard without AI ranking.
9. **NOT STARTED** — M08.9 visual/accessibility/E2E closeout.

## TDD Evidence
PENDING M08.1 behavioral RED. Design/activation commits are not RED/GREEN evidence.

## Integration Test Evidence
PENDING implementation.

## E2E / Visual Verification
PENDING. M08.9 owns independent-review browser acceptance, keyboard/focus, evidence deep links and mobile layout.

## Security Review
Required focus: tenant/job/candidate/attempt/assessment authorization, immutable AI history, reviewer attribution, inert text rendering and no client authority over organization/reviewer identity.

## Accessibility Review
Required throughout: semantic structure, keyboard/focus, evidence navigation, labels/status, mobile no-overflow and no color-only meaning.

## Performance Review
Keep result/transcript queries bounded/indexed; avoid N+1 evidence lookup and unbounded cross-job history.

## AI / Eval Review
Humans make hiring decisions. AI/human disagreement is retained for evaluation and never silently overwrites either history.

## Code Review Findings
None yet for M08 implementation.

## Fixes / Re-review
PENDING when findings exist.

## Fresh Verification Commands
Use full repository CI plus focused M08 tests/provider/browser gates.

## Fresh Verification Results
M07 merge/main `d85883f4177e2ec122a695092d5c6ac846afbe72`: post-merge CI #920 / run `35054705165` complete GREEN before M08 activation. M08 behavioral verification pending M08.1 RED.

## Commits / Files Changed
M08 design and implementation plan created on `feat/hiring-team-review`; durable activation state is being reconciled.

## Known Limitations
M08 implementation has only just activated; no behavioral completion is claimed.

## Documentation Updated
This ledger, design/plan and canonical recovery docs establish M08 durable state.

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