# M05 — Realtime AI Interview

## Authoritative PRD milestone definition

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

---

## Default iteration decomposition

- **M05.1 — Reference characterization:** inspect Talk Tutor patterns; document what to reuse vs not copy.
- **M05.2 — Session authorization/provider boundary:** server-authorized realtime session setup.
- **M05.3 — Browser compatibility + microphone diagnostics:** feature detection, permission/input/level/network readiness.
- **M05.4 — Web Audio capture:** deterministic audio capture lifecycle.
- **M05.5 — Realtime transport:** provider connect/send/receive lifecycle.
- **M05.6 — AI audio playback:** output queue and clean teardown.
- **M05.7 — Connection state machine:** explicit idle/connecting/connected/recovering/ended/error states.
- **M05.8 — Interview-plan execution:** deterministic sections/questions and phase transitions.
- **M05.9 — Pacing/time budget:** remaining time and graceful section/interview completion.
- **M05.10 — Bounded follow-ups:** neutral clarification/example/missing-dimension rules.
- **M05.11 — Barge-in:** stop AI playback when candidate interrupts without corrupting state.
- **M05.12 — Timeout/error handling:** browser/provider/microphone failures.
- **M05.13 — Reconnect:** bounded recovery into the same authoritative attempt.
- **M05.14 — Full realtime E2E:** stable multi-turn voice interview across failure scenarios.

## Required workflow per iteration

1. Recover repository/PR/CI/review state.
2. Confirm iteration acceptance criteria and dependencies.
3. Write/update design and plan where needed.
4. Use TDD/characterization tests.
5. Implement the smallest coherent capability.
6. Run focused tests, then broader verification.
7. Review from relevant P0/specialist lenses and fix findings.
8. Re-run fresh verification.
9. Commit/push coherently and update `CURRENT.md`.

## Milestone completion gate

Do not mark COMPLETE until the PRD exit condition above is met and final implementation, tests, review, CI, documentation and fresh verification all pass.
