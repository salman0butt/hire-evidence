# Current Milestone

Milestone: AI Quality, Guardrails & Evals (M10)

Status: **ACTIVE — M10.1 EVAL HARNESS**

Branch: `feat/ai-quality-evals`
PR: pending first coherent branch state.
Base: `main` at M09 merge SHA `3c63598354728d2651bf7630f9bea397a50b9a18`.
Post-merge baseline: CI #1055 / run `35774166917` — GREEN on exact `main` SHA.

Design: `docs/superpowers/specs/2026-09-23-ai-quality-guardrails-evals-design.md`
Plan: `docs/superpowers/plans/2026-09-23-ai-quality-guardrails-evals.md`

## Iterations
1. M10.1 Eval harness — ACTIVE.
2. M10.2 Golden interview dataset — NOT STARTED.
3. M10.3 Golden assessment dataset + human calibration — NOT STARTED.
4. M10.4 Interviewer behavior evals — NOT STARTED.
5. M10.5 Assessment grounding/schema/consistency evals — NOT STARTED.
6. M10.6 Adversarial prompt-injection evals — NOT STARTED.
7. M10.7 Fairness paired evals — NOT STARTED.
8. M10.8 Prompt/guardrail version regression comparisons — NOT STARTED.
9. M10.9 AI tracing + cost/quality metadata — NOT STARTED.
10. M10.10 Human override/disagreement analytics — NOT STARTED.
11. M10.11 CI regression gates — NOT STARTED.

## Review state
Unresolved Critical: 0 known. Unresolved Important: 0 known.

## Constraints
Humans remain hiring decision makers. Evals may measure AI behavior but must not introduce autonomous hire/reject/ranking or protected-trait, emotion, appearance, accent, personality, confidence, or deception inference. Transcript/model text is untrusted data. Deterministic gates run without provider credentials; bounded live-model checks must be explicit and cannot silently pass when unavailable.

## Next action
Write the smallest M10.1 failing tests for the application-owned deterministic eval harness, verify genuine RED, then implement the minimum harness behavior.