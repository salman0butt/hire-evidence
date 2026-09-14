# M07 — Evidence-Based Assessment Engine

Status: **IMPLEMENTING — M07.1 ACTIVE**

## Goal
Deliver the authoritative PRD milestone below as a reviewable, evidence-backed capability.

## Authoritative PRD Milestone Definition

# 202. MILESTONE 07 — EVIDENCE-BASED ASSESSMENT ENGINE

Deliver:

```text
structured assessment
competency scores
rubric enforcement
evidence citations
evidence sufficiency
strengths
concerns
question coverage
guardrails
schema validation
prompt injection defense
assessment provenance
```

Do NOT include autonomous hire/reject.

Exit:

assessment is reviewable and every score is evidence-grounded.

## Dependencies
Durable Transcript; Jobs/Competencies/Rubrics/Questions. M06 merged as `45d1e1a6083b44b5793c242091ef8d8fe3df9f96` and post-merge main CI #875 / run `34909208645` passed before M07 activation.

## In Scope
The authoritative definition plus every default iteration listed below, grounded in PRD sections 58 and 69–81.

## Out of Scope
Later milestones, speculative abstractions, behavior not justified by the PRD, autonomous hire/reject, candidate success probability, coding sandbox, and M08 reviewer workflow beyond M07 acceptance needs.

## Architecture Notes
Assessment operates on immutable trusted inputs and runtime-validated structured output. Every score links to validated candidate evidence; insufficient evidence yields null/insufficient rather than invented certainty. Transcript content is untrusted data. Assessment generations and provenance are versioned and append-only.

## Selected Design / Implementation Plan
- Design: `docs/superpowers/specs/2026-09-15-evidence-assessment-engine-design.md` (`a8b270c2e676b37ffde38a54851cdda10cb00e09`).
- Plan: `docs/superpowers/plans/2026-09-15-evidence-assessment-engine.md` (`7a68209f8352b4f1a5090712be828362ace7eb2f`).

## Acceptance Criteria
- PRD deliverables and exit criteria pass.
- Every non-null competency score is 1–5, rubric-aligned, and backed by validated same-attempt transcript evidence.
- Insufficient evidence can yield `score: null`; no forced certainty.
- Transcript instructions cannot alter assessment policy, rubric, schema, evidence validation, or guardrails.
- No autonomous hire/reject or prohibited protected-trait/biometric/appearance/emotion/accent/personality/deception/health/political/union/socioeconomic inference.
- Generation/provenance/history are append-only, retry-safe, and tenant/attempt scoped.
- All required iterations are complete or explicitly resolved.
- Relevant security/privacy/tenancy/accessibility/performance/AI-safety gates pass.
- 0 unresolved Critical or Important review findings.
- Traceability and feature state are reconciled.
- Exact-final-head CI is green.

## Tasks / Iterations
1. **ACTIVE** — M07.1 — Assessment domain/schema: runtime-validatable structures and states.
2. **NOT STARTED** — M07.2 — Trusted prompt composition: immutable rubric/job/questions + delimited transcript.
3. **NOT STARTED** — M07.3 — Competency scoring: rubric-aligned 1–5/null behavior.
4. **NOT STARTED** — M07.4 — Evidence citations: candidate message sequences/excerpts.
5. **NOT STARTED** — M07.5 — Evidence validator: sequence/speaker/excerpt existence and fabricated-citation rejection.
6. **NOT STARTED** — M07.6 — Evidence sufficiency + question coverage: insufficient/partial/sufficient and asked/answered/skipped.
7. **NOT STARTED** — M07.7 — Prompt-injection defense: transcript treated strictly as data.
8. **NOT STARTED** — M07.8 — Provenance: model/prompt/rubric/interviewer/guardrail/transcript version capture.
9. **NOT STARTED** — M07.9 — Idempotent generation: pending/processing/completed/failed atomic claim.
10. **NOT STARTED** — M07.10 — Regeneration/history: preserve prior assessment versions.
11. **NOT STARTED** — M07.11 — Golden fixtures: deterministic and model-based assessment test cases.

## TDD Evidence
PENDING M07.1 behavioral RED. Design/activation commits are not RED/GREEN evidence and must not be reported as such.

## Integration Test Evidence
PENDING — implementation has not reached an integration boundary.

## E2E / Visual Verification
PENDING — M08 owns the full reviewer experience; add M07 browser acceptance only where needed to prove evidence reviewability at milestone closeout.

## Security Review
PENDING implementation review. Required focus: tenant/attempt isolation, prompt input minimization, untrusted transcript handling, fabricated/cross-attempt citations, immutable completed generations, and secrets/provider boundaries.

## Accessibility Review
PENDING where M07 exposes user-visible state. Full assessment review interaction is M08 scope.

## Performance Review
PENDING implementation review. Keep prompt/output collections bounded, evidence validation O(n) over transcript turns, and generation/history queries indexed.

## AI / Eval Review
No autonomous hire/reject. Reject fabricated citations, candidate prompt injection, unsupported inferences, protected-trait signals, appearance/emotion/accent/personality/deception scoring, and model self-confidence as calibrated confidence. Deterministic validators remain authoritative over model output.

## Code Review Findings
None yet for M07 implementation; fresh review starts after the first behavioral unit.

## Fixes / Re-review
PENDING when evidence-backed findings exist.

## Fresh Verification Commands
Run repository-wide verification plus milestone-specific tests. Baseline:

```bash
pnpm lint
pnpm typecheck
pnpm test
pnpm build
pnpm e2e
python3 scripts/verify_autonomous_framework.py
python3 scripts/verify_prd_coverage.py
```

## Fresh Verification Results
- M06 base/main `45d1e1a6083b44b5793c242091ef8d8fe3df9f96`: post-merge CI #875 / run `34909208645` complete GREEN before branch activation.
- M07 behavioral verification: PENDING M07.1 RED/GREEN.

## Commits / Files Changed
- `a8b270c2e676b37ffde38a54851cdda10cb00e09` — selected M07 design.
- `7a68209f8352b4f1a5090712be828362ace7eb2f` — executable M07 implementation plan.
- Durable activation docs updated on `feat/evidence-assessment-engine` before first behavioral RED.

## Known Limitations
No model/provider or persistence implementation exists yet for M07. This is expected at activation; do not infer completion from design artifacts.

## Documentation Updated
`docs/progress/STATUS.md`, `docs/milestones/CURRENT.md`, this ledger, selected design and implementation plan establish fresh-session recovery state.

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
M08 — Hiring Team Review Experience.
