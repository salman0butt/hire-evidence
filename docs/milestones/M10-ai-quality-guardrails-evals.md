# M10 — AI Quality, Guardrails & Evals

Status: **ACTIVE — M10.1 EVAL HARNESS**

## Goal
Deliver a production AI quality layer so AI changes are measurable rather than subjective.

## Authoritative PRD Milestone Definition
Golden interview dataset; assessment evals; interviewer behavior evals; adversarial evals; fairness paired evals; prompt versioning; guardrail versions; AI tracing; human override analytics; AI regression CI gates.

Exit: AI changes are measurable rather than subjective.

## Dependencies
Realtime Interview; Assessment Engine; Human Review data. M09 merged as `3c63598354728d2651bf7630f9bea397a50b9a18`; post-merge CI #1055 / run `35774166917` is GREEN.

## In Scope
The authoritative definition plus every default M10 iteration.

## Out of Scope
Later milestones, autonomous hiring decisions, sensitive/protected-trait inference, generic agent/eval platforms, and unbounded provider-dependent CI.

## Architecture Notes
Application-owned typed/versioned eval domain with immutable synthetic/de-identified fixtures, deterministic evaluators as the required baseline, narrow optional provider-backed evaluators, adversarial/fairness paired cases, provenance/version comparisons, trace metadata, and explicit regression thresholds.

## Selected Design / Implementation Plan
- Design: `docs/superpowers/specs/2026-09-23-ai-quality-guardrails-evals-design.md`.
- Plan: `docs/superpowers/plans/2026-09-23-ai-quality-guardrails-evals.md`.
- M10.1 selected boundary: stable case/suite/result contracts, duplicate-ID rejection, deterministic ordered execution, failure isolation, evaluator identity/version, and aggregate counts.

## Acceptance Criteria
- PRD deliverables and exit criteria pass.
- All required iterations are complete or explicitly resolved.
- Deterministic evals cover grounding, schema, behavior, adversarial and fairness invariants before closeout.
- Live-model checks, where required, are bounded/versioned and never silently pass when credentials are absent.
- No eval or analytics feature creates autonomous hire/reject/ranking or prohibited inference.
- Relevant security/privacy/tenancy/performance/AI-safety gates pass.
- 0 unresolved Critical or Important review findings.
- Traceability and feature state are reconciled.
- Exact-final-head CI is green.

## Tasks / Iterations
1. **ACTIVE** — M10.1 — Eval harness.
2. **NOT STARTED** — M10.2 — Golden interview dataset.
3. **NOT STARTED** — M10.3 — Golden assessment dataset + human calibration.
4. **NOT STARTED** — M10.4 — Interviewer behavior evals.
5. **NOT STARTED** — M10.5 — Assessment grounding/schema/consistency evals.
6. **NOT STARTED** — M10.6 — Adversarial prompt-injection evals.
7. **NOT STARTED** — M10.7 — Fairness paired evals.
8. **NOT STARTED** — M10.8 — Prompt/guardrail version regression comparisons.
9. **NOT STARTED** — M10.9 — AI tracing + cost/quality metadata.
10. **NOT STARTED** — M10.10 — Human override/disagreement analytics.
11. **NOT STARTED** — M10.11 — CI regression gates.

## TDD Evidence
M10.1 behavioral RED not yet created. Never fabricate evidence.

## Integration Test Evidence
PENDING — harness domain comes first.

## E2E / Visual Verification
PENDING where later M10 behavior has a user-visible surface.

## Security Review
Activation design requires inert untrusted fixtures, no credentials/secrets in traces, PII minimization, bounded provider calls, and preservation of existing tenant/human-review boundaries.

## Accessibility Review
No M10.1 UI. Review later UI surfaces if introduced.

## Performance Review
Harness execution must be bounded by explicit suite size; provider-backed evaluators later require concurrency, timeout and cost bounds.

## AI / Eval Review
AI evals are product tests: grounding, evidence validity, interviewer behavior, prompt-injection resistance, fairness pairs, schema correctness, failure handling, provenance and regression comparison must be measurable.

## Code Review Findings
No Critical or Important finding known at activation.

## Fixes / Re-review
PENDING when evidence-backed findings exist.

## Fresh Verification Commands
Repository-wide verification plus milestone-specific eval tests; baseline includes `pnpm lint`, `pnpm typecheck`, `pnpm test`, `pnpm build`, `pnpm e2e`, autonomous-framework verification and PRD coverage verification.

## Fresh Verification Results
Post-M09-merge baseline: exact `main` SHA `3c63598354728d2651bf7630f9bea397a50b9a18`, CI #1055 / run `35774166917` GREEN. M10 branch verification pending first TDD unit.

## Commits / Files Changed
Activation branch `feat/ai-quality-evals`; design/plan and durable activation state added/updated.

## Known Limitations
No M10 eval harness behavior is implemented yet; M10.1 is active.

## Documentation Updated
Design, plan, CURRENT, project status and this ledger activated on 2026-09-23.

## Durable Recovery Sources
`AGENTS.md` → `docs/AUTONOMOUS-DEVELOPMENT.md` → `docs/progress/STATUS.md` → known issues → this ledger → relevant PRD → selected spec/plan → active PR/reviews/exact-head CI → source/tests.

## Completion Checklist
- [ ] Requirements and iterations accounted for.
- [ ] Acceptance criteria verified.
- [ ] Required TDD/integration/E2E evidence recorded.
- [ ] Security/accessibility/performance/AI-eval reviews complete where relevant.
- [ ] 0 Critical / 0 Important findings.
- [ ] Traceability/feature matrix reconciled.
- [ ] Exact-final-head CI green.
- [ ] Durable status/closeout state current.

## Next Milestone
M11 — Enterprise Readiness.