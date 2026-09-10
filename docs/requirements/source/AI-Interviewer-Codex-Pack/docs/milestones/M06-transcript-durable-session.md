# M06 — Transcript + Durable Session

## Authoritative PRD milestone definition

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

---

## Default iteration decomposition

- **M06.1 — Provider event normalization:** single internal event vocabulary.
- **M06.2 — Transcript state:** partial UI text vs finalized immutable turns.
- **M06.3 — Durable messages:** sequence, speaker, timestamps and persistence.
- **M06.4 — Correctness guards:** no duplication, order/speaker invariants.
- **M06.5 — Idempotent attempt lifecycle:** authoritative start/end and retry safety.
- **M06.6 — Reconnect persistence:** resume without cross-session transcript leakage.
- **M06.7 — Technical interruption events:** separate platform failures from candidate behavior.
- **M06.8 — Session finalization:** seal transcript, duration, state and assessment trigger exactly once.
- **M06.9 — Durability E2E:** refresh/disconnect/reconnect/finalize scenarios.

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
