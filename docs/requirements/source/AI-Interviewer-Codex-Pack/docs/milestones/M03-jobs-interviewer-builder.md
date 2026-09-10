# M03 — Jobs + Interviewer Builder

## Authoritative PRD milestone definition

# 198. MILESTONE 03 — JOBS + INTERVIEWER BUILDER

Deliver:

```text
jobs
job criteria
competencies
rubrics
interview agent builder
persona
guidelines
question bank
interview sections
duration
draft/publish
versioning
preview

```

Also global guardrail validation.

Exit:

organization can publish immutable interviewer version.

---

## Default iteration decomposition

- **M03.1 — Jobs:** CRUD, description, requirements, seniority and role metadata.
- **M03.2 — Competencies:** explicit job-related competency model.
- **M03.3 — Rubrics:** 1–5 observable evidence definitions, weights and validation.
- **M03.4 — Question bank:** questions, competency links, difficulty, expected areas, limits.
- **M03.5 — Interview plan:** deterministic sections, duration budgets, question coverage.
- **M03.6 — Interviewer configuration:** persona, language, type, guidelines and follow-up policy.
- **M03.7 — Guardrail validation:** reject prohibited/discriminatory configuration.
- **M03.8 — Draft/publish:** state transitions and validation.
- **M03.9 — Immutable versioning:** interviewer/rubric/prompt snapshots.
- **M03.10 — Preview:** simulated/non-billable preview workflow.
- **M03.11 — Builder E2E:** create job → configure → validate → publish immutable version.

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
