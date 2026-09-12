# M05 — Realtime AI Interview

Status: **ACTIVE**

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
Server-authorized realtime session setup with browser diagnostics, deterministic audio lifecycle, provider transport abstraction only where justified, explicit connection state machine, pacing budgets, bounded follow-ups, reconnect and failure recovery. Candidate speech remains untrusted data; the immutable invitation-bound interviewer version is authoritative. Technical failures must never lower candidate evaluation.

## Selected Design / Implementation Plan
- Design: `docs/superpowers/specs/2026-09-12-realtime-ai-interview-design.md`
- Plan: `docs/superpowers/plans/2026-09-12-realtime-ai-interview.md`
- Talk Tutor reference pinned at `69b6beee90c8dbd186730389f8a1462c2239fe61`.

## Acceptance Criteria
- PRD deliverables and exit criteria pass.
- All required iterations are complete or explicitly resolved.
- Relevant security/privacy/tenancy/accessibility/performance/AI-safety gates pass.
- 0 unresolved Critical or Important review findings.
- Traceability and feature state are reconciled.
- Exact-final-head CI is green.

## Tasks / Iterations
1. **VERIFIED** — M05.1 — Reference characterization: Talk Tutor server token, state, Web Audio capture/playback, interruption and teardown patterns characterized; reuse/non-reuse and hiring safety boundaries recorded in the selected design.
2. **ACTIVE** — M05.2 — Session authorization/provider boundary: server-authorized realtime session setup.
3. **NOT STARTED** — M05.3 — Browser compatibility + microphone diagnostics: feature detection, permission/input/level/network readiness.
4. **NOT STARTED** — M05.4 — Web Audio capture: deterministic audio capture lifecycle.
5. **NOT STARTED** — M05.5 — Realtime transport: provider connect/send/receive lifecycle.
6. **NOT STARTED** — M05.6 — AI audio playback: output queue and clean teardown.
7. **NOT STARTED** — M05.7 — Connection state machine: explicit idle/diagnosing/authorizing/connecting/connected/recovering/ended/error states.
8. **NOT STARTED** — M05.8 — Interview-plan execution: deterministic sections/questions and phase transitions.
9. **NOT STARTED** — M05.9 — Pacing/time budget: remaining time and graceful section/interview completion.
10. **NOT STARTED** — M05.10 — Bounded follow-ups: neutral clarification/example/missing-dimension rules.
11. **NOT STARTED** — M05.11 — Barge-in: stop AI playback when candidate interrupts without corrupting authoritative plan state.
12. **NOT STARTED** — M05.12 — Timeout/error handling: browser/provider/microphone failures.
13. **NOT STARTED** — M05.13 — Reconnect: bounded recovery into the same authoritative attempt.
14. **NOT STARTED** — M05.14 — Full realtime E2E: stable multi-turn voice interview across failure scenarios.

## TDD Evidence
M05.1 is characterization/design work and has no fabricated RED/GREEN evidence. M05.2 behavioral RED is the next required checkpoint.

## Integration Test Evidence
PENDING — M05.2 will establish the first server authorization integration boundary.

## E2E / Visual Verification
PENDING — milestone plan requires successful multi-turn completion plus microphone denial/recovery, barge-in, timeout, provider interruption, bounded reconnect, mobile/no-overflow and keyboard/status coverage.

## Security Review
Initial design review requires invitation capability + current consent + immutable interviewer version + authoritative attempt before provider credential issuance; raw invitation/provider secrets are not persisted or logged; reconnect resumes the same attempt; candidate speech cannot alter policy/plan.

## Accessibility Review
Initial design requires semantic status/error states, keyboard-accessible mute/end/retry/device controls, visible non-audio connection state, and narrow viewport coverage.

## Performance Review
Initial design requires bounded output queues, follow-ups, retries and event accumulation with idempotent audio/resource cleanup.

## AI / Eval Review
Technical failures must never lower candidate scores. Interview behavior must remain job-related, bounded by the immutable plan and guardrails, and robust to candidate prompt injection. M05 introduces no autonomous hire/reject decision or candidate score.

## Code Review Findings
None yet for behavioral implementation; M05.1 design self-review found no Critical/Important blocker.

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
M04 post-merge base `943e8a5c1dd45dc1652453ddf8ebc4ae31951925` passed CI #517 / `34692492691`. M05 branch verification is required on each behavioral checkpoint and final head.

## Commits / Files Changed
- `7dcbaac0fc84e1843e7867feb8f076c43dbebb3f` — realtime interview design/reference characterization.
- `671ee4826df39cc45ed14463b1f8251dd5ce5982` — executable M05 implementation plan.

## Known Limitations
No realtime provider SDK is currently present in the application dependency set. Provider selection/SDK coupling must be justified by authoritative requirements rather than inferred from the Talk Tutor reference.

## Documentation Updated
M05 design and implementation plan are durable. Project CURRENT/STATUS/HANDOFF are being reconciled to the activated milestone.

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

## Next Action
Execute M05.2 with strict TDD: first define a failing server realtime-session authorization contract proving unusable invitations, missing current consent, missing immutable published interviewer version and duplicate-attempt creation cannot mint provider credentials. Verify the RED is genuine before minimal implementation.

## Next Milestone
M06 — Transcript + Durable Session.
