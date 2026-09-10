# M05 — Realtime AI Interview

Status: **NOT STARTED**

## Goal
Deliver the authoritative PRD milestone below as a reviewable, evidence-backed capability.

## Authoritative PRD Milestone Definition

# 200. MILESTONE 05 — REALTIME AI INTERVIEW

This milestone may reuse patterns from Talk Tutor.

Deliver:

```text
microphone diagnostics
realtime AI connection
voice interviewer
interview plan execution
question pacing
bounded follow-ups
barge-in
connection state
timeout
error recovery
```

Characterization + TDD.

Exit:

candidate can complete stable multi-turn voice interview.

## Dependencies
Candidate Invitations; published Interviewer Builder configuration.

## In Scope
The authoritative definition plus every default iteration listed below.

## Out of Scope
Later milestones, speculative abstractions, and behavior not justified by the PRD.

## Architecture Notes
Server-authorized realtime session setup with browser diagnostics, deterministic audio lifecycle, provider transport abstraction only where justified, explicit connection state machine, pacing budgets, bounded follow-ups, reconnect and failure recovery.

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
1. **NOT STARTED** — M05.1 — Reference characterization: inspect Talk Tutor patterns; document what to reuse vs not copy.
2. **NOT STARTED** — M05.2 — Session authorization/provider boundary: server-authorized realtime session setup.
3. **NOT STARTED** — M05.3 — Browser compatibility + microphone diagnostics: feature detection, permission/input/level/network readiness.
4. **NOT STARTED** — M05.4 — Web Audio capture: deterministic audio capture lifecycle.
5. **NOT STARTED** — M05.5 — Realtime transport: provider connect/send/receive lifecycle.
6. **NOT STARTED** — M05.6 — AI audio playback: output queue and clean teardown.
7. **NOT STARTED** — M05.7 — Connection state machine: explicit idle/connecting/connected/recovering/ended/error states.
8. **NOT STARTED** — M05.8 — Interview-plan execution: deterministic sections/questions and phase transitions.
9. **NOT STARTED** — M05.9 — Pacing/time budget: remaining time and graceful section/interview completion.
10. **NOT STARTED** — M05.10 — Bounded follow-ups: neutral clarification/example/missing-dimension rules.
11. **NOT STARTED** — M05.11 — Barge-in: stop AI playback when candidate interrupts without corrupting state.
12. **NOT STARTED** — M05.12 — Timeout/error handling: browser/provider/microphone failures.
13. **NOT STARTED** — M05.13 — Reconnect: bounded recovery into the same authoritative attempt.
14. **NOT STARTED** — M05.14 — Full realtime E2E: stable multi-turn voice interview across failure scenarios.

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
Technical failures must never lower candidate scores. Interview behavior must remain job-related, bounded by the immutable plan and guardrails, and robust to candidate prompt injection.

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
M06 — Transcript + Durable Session.
