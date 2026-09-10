# M03 — Jobs + Interviewer Builder

Status: **NOT STARTED**

## Goal
Deliver the authoritative PRD milestone below as a reviewable, evidence-backed capability.

## Authoritative PRD Milestone Definition

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

## Dependencies
Organizations + RBAC.

## In Scope
The authoritative definition plus every default iteration listed below.

## Out of Scope
Later milestones, speculative abstractions, and behavior not justified by the PRD.

## Architecture Notes
Versioned domain objects for jobs, competencies, rubrics, questions, interview plans, and interviewer configuration. Published interviewer versions are immutable snapshots; global safety guardrails outrank organization configuration.

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
1. **NOT STARTED** — M03.1 — Jobs: CRUD, description, requirements, seniority and role metadata.
2. **NOT STARTED** — M03.2 — Competencies: explicit job-related competency model.
3. **NOT STARTED** — M03.3 — Rubrics: 1–5 observable evidence definitions, weights and validation.
4. **NOT STARTED** — M03.4 — Question bank: questions, competency links, difficulty, expected areas, limits.
5. **NOT STARTED** — M03.5 — Interview plan: deterministic sections, duration budgets, question coverage.
6. **NOT STARTED** — M03.6 — Interviewer configuration: persona, language, type, guidelines and follow-up policy.
7. **NOT STARTED** — M03.7 — Guardrail validation: reject prohibited/discriminatory configuration.
8. **NOT STARTED** — M03.8 — Draft/publish: state transitions and validation.
9. **NOT STARTED** — M03.9 — Immutable versioning: interviewer/rubric/prompt snapshots.
10. **NOT STARTED** — M03.10 — Preview: simulated/non-billable preview workflow.
11. **NOT STARTED** — M03.11 — Builder E2E: create job → configure → validate → publish immutable version.

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
Prompt/persona configuration is bounded by platform safety policy. No configuration may enable protected-trait, appearance, emotion, accent, personality, deception, or autonomous hiring judgments.

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
M04 — Candidates + Invitations.
