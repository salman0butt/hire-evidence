# M10 — AI Quality, Guardrails & Evals

## Authoritative PRD milestone definition

# 205. MILESTONE 10 — AI QUALITY, GUARDRAILS & EVALS

Deliver production AI quality layer.

```text
golden interview dataset
assessment evals
interviewer behavior evals
adversarial evals
fairness paired evals
prompt versioning
guardrail versions
AI tracing
human override analytics
AI regression CI gates

```

Exit:

AI changes are measurable rather than subjective.

---

## Default iteration decomposition

- **M10.1 — Eval harness:** interviewer/assessment/guardrails/fairness/adversarial/realtime structure.
- **M10.2 — Golden interview dataset.**
- **M10.3 — Golden assessment dataset + human calibration.**
- **M10.4 — Interviewer behavior evals.**
- **M10.5 — Assessment grounding/schema/consistency evals.**
- **M10.6 — Adversarial prompt-injection evals.**
- **M10.7 — Fairness paired evals.**
- **M10.8 — Prompt/guardrail version regression comparisons.**
- **M10.9 — AI tracing + cost/quality metadata.**
- **M10.10 — Human override/disagreement analytics.**
- **M10.11 — CI regression gates:** deterministic first, bounded live-model checks where required.

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
