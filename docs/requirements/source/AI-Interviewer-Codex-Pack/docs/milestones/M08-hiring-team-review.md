# M08 — Hiring Team Review Experience

## Authoritative PRD milestone definition

# 203. MILESTONE 08 — HIRING TEAM REVIEW EXPERIENCE

Deliver:

```text
candidate results
assessment dashboard
transcript viewer
evidence deep links
human score override
reviewer notes
review status
AI/human disagreement
job candidate dashboard

```

Exit:

human can independently review AI assessment.

---

## Default iteration decomposition

- **M08.1 — Candidate result page:** identity/job/interview/status summary.
- **M08.2 — Competency/evidence cards:** score, rationale, sufficiency.
- **M08.3 — Transcript viewer:** speaker separation, search, markers.
- **M08.4 — Evidence deep links:** score → exact transcript turn/highlight.
- **M08.5 — Human overrides:** preserve AI score + human score + reason.
- **M08.6 — Reviewer notes + states:** awaiting review/reviewed and notes.
- **M08.7 — AI/human disagreement data:** durable comparison for evals.
- **M08.8 — Job candidate dashboard:** workflow status without AI "best candidate" ranking.
- **M08.9 — Visual/accessibility/E2E QA:** desktop/mobile and independent-review flow.

## Required workflow per iteration

1. Recover repository/PR/CI/review state.
2. Confirm iteration acceptance criteria and dependencies.
3. Write/update design and plan where needed.
4. Use TDD/characterization tests.
5. Implement the smallest coherent capability.
6. Run focused tests, then broader verification.
7. Review from relevant P0/specialist lenses and fix findings.
8. Re-run fresh verification.
9. Commit/push coherently and update `CURRENT.md`.

## Milestone completion gate

Do not mark COMPLETE until the PRD exit condition above is met and final implementation, tests, review, CI, documentation and fresh verification all pass.
