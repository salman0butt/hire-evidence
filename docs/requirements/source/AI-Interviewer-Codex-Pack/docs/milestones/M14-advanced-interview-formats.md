# M14 — Advanced Interview Formats

## Authoritative PRD milestone definition

# 209. MILESTONE 14 — ADVANCED INTERVIEW FORMATS

Possible:

```text
case study
presentation
system-design canvas
take-home review

```

Only after core adoption.

---

## Default iteration decomposition

- Implement **one format at a time** only after core adoption.
- Candidate iterations: case study → presentation → system-design canvas → take-home review.
- Each format requires its own domain model, evidence model, accessibility path, security review, evals and E2E acceptance criteria before the next format begins.

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
