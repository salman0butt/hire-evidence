# AI Quality, Guardrails & Evals — Implementation Plan

Date: 2026-09-23
Design: `docs/superpowers/specs/2026-09-23-ai-quality-guardrails-evals-design.md`

## Sequence

### M10.1 Eval harness
1. Add focused tests defining typed eval cases/suites/results and deterministic runner behavior.
2. Verify genuine RED for the missing harness.
3. Implement minimal application-owned harness with duplicate-ID validation, ordered execution, failure isolation, aggregate counts, and explicit evaluator identity/version.
4. Verify focused GREEN, broader tests, review, exact-head CI.

### M10.2 Golden interview dataset
Add versioned synthetic/de-identified interview fixtures with fixture integrity validation and representative normal, insufficient-evidence, interruption, and boundary cases.

### M10.3 Golden assessment dataset + human calibration
Add expected rubric/evidence/sufficiency outcomes and explicit human-calibration metadata without treating a single human score as unquestionable ground truth.

### M10.4 Interviewer behavior evals
Measure deterministic plan adherence, bounded follow-ups, neutrality, pacing/technical-failure separation, and prohibited behavior.

### M10.5 Assessment evals
Measure schema validity, rubric alignment, evidence grounding, citation validity, sufficiency/null behavior, consistency, and failure handling.

### M10.6 Adversarial evals
Add prompt-injection and transcript-control attempts asserting transcript content remains inert and cannot weaken platform guardrails.

### M10.7 Fairness paired evals
Add controlled pairs holding job evidence constant while changing only protected-trait proxy context; assert invariant job-relevant behavior and prohibit sensitive inference.

### M10.8 Version regression comparisons
Compare prompt/guardrail versions over the same immutable suite with explicit metric deltas and no silent baseline replacement.

### M10.9 AI tracing + cost/quality metadata
Capture run/case/evaluator/model/prompt/guardrail provenance plus bounded latency/token/cost metadata where available; exclude secrets and minimize PII.

### M10.10 Human override/disagreement analytics
Aggregate preserved AI/human disagreement and calibration signals without candidate ranking or autonomous hiring decisions.

### M10.11 CI regression gates
Run deterministic suites in required CI with versioned thresholds. Add bounded live-model checks only where required and explicitly configured; missing external credentials are never represented as success.

## Cross-cutting gates
Every unit uses strict TDD where behavioral, skeptical correctness/security/fairness review, bounded performance, durable traceability, and exact-SHA CI. Closeout requires zero unresolved Critical/Important findings and full repository verification.