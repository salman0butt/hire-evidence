# AI Quality, Guardrails & Evals — Design

Date: 2026-09-23
Milestone: M10

## Goal
Make interviewer and assessment AI changes measurable, reproducible, safety-aware, and regression-testable without turning model output into autonomous hiring authority.

## Constraints
- Humans remain hiring decision makers.
- Transcript/model output is untrusted data.
- No protected-trait inference, emotion/appearance/accent/confidence/personality/deception scoring.
- Evaluation fixtures must not contain unnecessary real candidate PII.
- Deterministic checks gate CI first; live-model checks must be bounded, explicit, versioned, and must not make ordinary CI depend on unavailable credentials.
- Existing immutable prompt/rubric/interviewer/guardrail provenance remains authoritative.

## Options considered
1. Provider-specific eval scripts. Rejected: couples quality policy to one model/provider and fragments evidence.
2. Generic agent/eval platform. Rejected as unnecessary architecture and too broad for current requirements.
3. Application-owned typed eval domain with adapters for deterministic and bounded model evaluators. Selected: smallest design that supports datasets, fairness/adversarial cases, provenance, tracing, comparisons, and CI thresholds.

## Selected architecture
Create an application-owned eval package organized around immutable `EvalCase`, `EvalSuite`, `EvalResult`, and `EvalRun` contracts. Cases identify a stable fixture ID, category, input, expected invariants, tags, and version. Suites are explicit ordered collections. Evaluators return structured pass/fail metrics and evidence rather than prose-only judgments.

The harness separates deterministic evaluators from optional provider-backed evaluators. Deterministic schema, grounding, evidence-citation, safety, paired-fairness invariants, and fixture integrity run in normal CI. Provider-backed quality checks use a narrow adapter, bounded concurrency/cost/timeouts, captured model/prompt/guardrail versions, and explicit skip/block semantics when credentials are absent; they never silently count as passed.

Golden interview and assessment datasets are repository-owned synthetic/de-identified fixtures. Fairness cases are paired so job-relevant evidence is held constant while only a protected-trait proxy/name-context dimension changes; expected behavior is invariant scoring/behavior. Adversarial cases treat candidate transcript instructions as data and assert they cannot override platform/system safety or assessment grounding.

Tracing records run/case IDs, evaluator version, model/provider when used, prompt/guardrail/rubric/interviewer versions, token/cost/latency metadata where available, result metrics, and failure class. Do not persist secrets or raw unnecessary PII.

Human override/disagreement analytics operate on preserved AI generation plus attributable human review data. They measure disagreement/calibration patterns; they do not rank candidates or infer reviewer correctness automatically.

## M10.1 harness boundary
The first unit defines the typed deterministic harness and runner only: stable suite/case IDs, duplicate rejection, deterministic ordered execution, structured results, failure isolation, and aggregate counts. No golden dataset or provider call is required yet.

## Security / fairness
Fail closed on malformed cases/results. Fixtures are inert data. No eval may add prohibited inference to production. Fairness metrics compare paired outputs only on explicitly job-relevant dimensions. Traces must exclude credentials and minimize candidate data.

## Verification
Each behavioral unit follows RED → GREEN. Closeout requires repository gates plus deterministic eval regression gates, adversarial/fairness suites, provenance/version comparisons, trace/cost metadata tests, and review of safety, performance, and privacy.