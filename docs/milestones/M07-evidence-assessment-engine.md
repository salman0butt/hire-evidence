# M07 — Evidence-Based Assessment Engine

Status: **NOT STARTED**

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
Durable Transcript; Jobs/Competencies/Rubrics/Questions.

## In Scope
The authoritative definition plus every default iteration listed below.

## Out of Scope
Later milestones, speculative abstractions, and behavior not justified by the PRD.

## Architecture Notes
Assessment operates on immutable trusted inputs and runtime-validated structured output. Every score links to validated candidate evidence; insufficient evidence yields null/insufficient rather than invented certainty. Assessment generations are versioned and append-only.

## Selected Design / Implementation Plan
- Not created yet. On activation, recover requirements, use Superpowers brainstorming/design, write an executable plan, and record the selected paths here.

## Acceptance Criteria
- PRD deliverables and exit criteria pass.
- All required iterations are complete or explicitly resolved.
- Relevant security/privacy/tenancy/accessibility/performance/AI-safety gates pass.
- 0 unresolved Critical or Important review findings.
- Traceability and feature state are reconciled.
- Exact-final-head CI is green.

## Tasks / Iterations
1. **NOT STARTED** — M07.1 — Assessment domain/schema: runtime-validatable structures and states.
2. **NOT STARTED** — M07.2 — Trusted prompt composition: immutable rubric/job/questions + delimited transcript.
3. **NOT STARTED** — M07.3 — Competency scoring: rubric-aligned 1–5/null behavior.
4. **NOT STARTED** — M07.4 — Evidence citations: candidate message sequences/excerpts.
5. **NOT STARTED** — M07.5 — Evidence validator: sequence/speaker/excerpt existence and fabricated-citation rejection.
6. **NOT STARTED** — M07.6 — Evidence sufficiency + question coverage: insufficient/partial/sufficient and asked/answered/skipped.
7. **NOT STARTED** — M07.7 — Prompt-injection defense: transcript treated strictly as data.
8. **NOT STARTED** — M07.8 — Provenance: model/prompt/rubric/interviewer/guardrail version capture.
9. **NOT STARTED** — M07.9 — Idempotent generation: pending/processing/completed/failed atomic claim.
10. **NOT STARTED** — M07.10 — Regeneration/history: preserve prior assessment versions.
11. **NOT STARTED** — M07.11 — Golden fixtures: deterministic and model-based assessment test cases.

## TDD Evidence
PENDING — milestone has not started. Never fabricate evidence.

## Integration Test Evidence
PENDING — milestone has not started. Never fabricate evidence.

## E2E / Visual Verification
PENDING — define milestone-specific browser/realtime/visual scenarios before closeout where applicable.

## Security Review
PENDING — cover auth/authz, tenant isolation, untrusted input, secrets, data exposure, injection and milestone-specific threats.

## Accessibility Review
PENDING where UI exists — keyboard, focus, semantics, labels, status/error states, responsive and assistive-technology paths.

## Performance Review
PENDING where relevant — bounded work, pagination, resource limits, retries and hot-path cost.

## AI / Eval Review
No autonomous hire/reject. Reject fabricated citations, candidate prompt injection, unsupported inferences, protected-trait signals, appearance/emotion/accent/personality/deception scoring, and model self-confidence as calibrated confidence.

## Code Review Findings
None yet; milestone has not started.

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
PENDING — milestone has not started.

## Commits / Files Changed
None yet.

## Known Limitations
Milestone is NOT STARTED; implementation-specific limitations are not yet known.

## Documentation Updated
This living ledger must be reconciled whenever milestone state/evidence changes.

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
