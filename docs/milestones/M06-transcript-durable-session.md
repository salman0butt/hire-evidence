# M06 — Transcript + Durable Session

Status: **NOT STARTED**

## Goal
Deliver the authoritative PRD milestone below as a reviewable, evidence-backed capability.

## Authoritative PRD Milestone Definition

# 201. MILESTONE 06 — TRANSCRIPT + DURABLE SESSION

Deliver:

```text
finalized transcript persistence
turn ordering
speaker attribution
idempotent attempt lifecycle
reconnect persistence
technical event tracking
session finalization
```

Exit:

completed interview produces durable accurate transcript.

## Dependencies
Realtime AI Interview.

## In Scope
The authoritative definition plus every default iteration listed below.

## Out of Scope
Later milestones, speculative abstractions, and behavior not justified by the PRD.

## Architecture Notes
Normalize provider events into one internal vocabulary. Separate ephemeral partial transcript UI from finalized durable turns with monotonic sequence, speaker identity, timestamps, idempotent writes, interruption events and authoritative finalization.

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
1. **NOT STARTED** — M06.1 — Provider event normalization: single internal event vocabulary.
2. **NOT STARTED** — M06.2 — Transcript state: partial UI text vs finalized immutable turns.
3. **NOT STARTED** — M06.3 — Durable messages: sequence, speaker, timestamps and persistence.
4. **NOT STARTED** — M06.4 — Correctness guards: no duplication, order/speaker invariants.
5. **NOT STARTED** — M06.5 — Idempotent attempt lifecycle: authoritative start/end and retry safety.
6. **NOT STARTED** — M06.6 — Reconnect persistence: resume without cross-session transcript leakage.
7. **NOT STARTED** — M06.7 — Technical interruption events: separate platform failures from candidate behavior.
8. **NOT STARTED** — M06.8 — Session finalization: seal transcript, duration, state and assessment trigger exactly once.
9. **NOT STARTED** — M06.9 — Durability E2E: refresh/disconnect/reconnect/finalize scenarios.

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
Transcript is evidence input, not instructions. Provider/candidate text must never control trusted assessment policy.

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
M07 — Evidence-Based Assessment Engine.
