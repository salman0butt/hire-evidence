# M13 — Coding Interview

Status: **NOT STARTED**

## Goal
Deliver the authoritative PRD milestone below as a reviewable, evidence-backed capability.

## Authoritative PRD Milestone Definition

# 208. MILESTONE 13 — CODING INTERVIEW

Separate future milestone.

Potential:

```text
Monaco editor
sandbox
test execution
coding prompt
AI follow-ups
code snapshot
evidence-based evaluation
```

Security-sensitive.

Use isolated execution environment.

## Dependencies
Candidate sessions, evidence assessment, review, security hardening.

## In Scope
The authoritative definition plus every default iteration listed below.

## Out of Scope
Later milestones, speculative abstractions, and behavior not justified by the PRD.

## Architecture Notes
Security-first isolated execution boundary with strict CPU/memory/time/network/filesystem limits. Editor state and code snapshots are durable evidence; sandbox results are normalized before assessment.

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
1. **NOT STARTED** — M13.1 — Security/threat model: isolated execution requirements before coding.
2. **NOT STARTED** — M13.2 — Editor experience: Monaco and prompt/context model.
3. **NOT STARTED** — M13.3 — Sandboxed execution service: strict isolation, quotas, network/filesystem policy.
4. **NOT STARTED** — M13.4 — Test execution/results.
5. **NOT STARTED** — M13.5 — Code snapshots/versioning.
6. **NOT STARTED** — M13.6 — AI interview follow-ups around code without leaking solutions.
7. **NOT STARTED** — M13.7 — Evidence-based coding assessment.
8. **NOT STARTED** — M13.8 — Adversarial sandbox/security/E2E verification.

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
AI follow-ups must not leak solutions. Coding assessment remains evidence-based and must separate sandbox/platform failures from candidate performance.

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
M14 — Advanced Interview Formats.
