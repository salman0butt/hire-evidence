# Current Milestone

Milestone:
Transcript + Durable Session

Legacy roadmap identifier:
M06

Status:
IN PROGRESS — M06.1–M06.8 VERIFIED / M06.9 ACTIVE

Branch:
`feat/transcript-durable-session`

Base:
`main` at verified M05 merge SHA `5c3843c6444bad256974ea391a4a6a978bf88f24`

PR:
#8 — `Build transcript durable session` — OPEN / DRAFT while M06 remains incomplete. Reuse this PR; do not create a duplicate.

Canonical compact recovery state:
`docs/progress/STATUS.md`

## Iterations

1. M06.1 — Provider event normalization — **VERIFIED**.
2. M06.2 — Ephemeral partials vs immutable finalized transcript state — **VERIFIED**.
3. M06.3 — Attempt-scoped durable finalized transcript messages — **VERIFIED**.
4. M06.4 — Duplicate/order/speaker/immutability correctness guards — **VERIFIED**.
5. M06.5 — Idempotent attempt lifecycle — **VERIFIED**.
6. M06.6 — Same-attempt reconnect transcript restoration — **VERIFIED**.
7. M06.7 — Separate technical interruption events — **VERIFIED**.
8. M06.8 — Idempotent session finalization — **VERIFIED**.
9. M06.9 — Durability browser acceptance and milestone closeout — **ACTIVE**.

## Latest Verification

M05 merged to `main` as `5c3843c6444bad256974ea391a4a6a978bf88f24` before M06 activation.

M06.4 chronology RED: `f34d095fb5607bddef3252cfec5a04228954153a`, CI #821 / run `34884154545` — lint/typecheck passed and the intended reversed-timestamp transcript correctness test failed while 524 tests passed.

M06.4 GREEN: `ef898009c063c57a42af1ae64463719a77e13d50`, CI #822 / run `34884400868` — complete repository gate GREEN.

M06.5 terminal-replay RED: `8117a3eed5ab3114e1ed81697f680dd8c8f98699`, CI #823 / run `34885046377` — intended lifecycle contract failure with the rest of the suite healthy.

M06.5 GREEN: `fd2da242a636acd5ec4ea879c6ec43d6359e5f10`, CI #824 / run `34885300353` — complete repository gate GREEN.

Subsequent verified work added same-attempt durable transcript reconnect, separate non-evaluative technical event persistence, idempotent session finalization, launcher finalization, interviewer-version preservation, and durable transcript hydration into the realtime runtime.

Latest fully verified implementation head before this reconciliation: `4943d949ff943b2585580655e1596ac32f006e32`, CI #861 / run `34903314993` — complete GitHub Actions CI GREEN. The exact head includes `feat: restore transcript into realtime runtime` and all M06.6–M06.8 implementation/tests. This documentation commit requires its own exact-head CI before milestone completion.

## Review State

- Unresolved Critical findings: **0** at latest recovery.
- Unresolved Important findings: **0** at latest recovery.
- PR #8 has no submitted reviews or unresolved inline review comments at latest recovery.
- M06 is not merge-ready because M06.9 browser durability acceptance, closeout review/traceability, and exact-final-head verification remain incomplete.

## Constraints

- Persist only finalized transcript turns; partial provider hypotheses remain UI-only.
- Transcript speaker identity comes from normalized event semantics, never text inference.
- Durable ordering/identity are server-authoritative and attempt-scoped.
- Cross-attempt/cross-capability transcript access must fail closed.
- Reconnect restores only the same authoritative attempt and discards stale ephemeral partials/generation callbacks.
- Technical failures remain separate from candidate evidence and cannot reduce assessment.
- Finalization remains retry-safe and exactly-once for durable completion/assessment-trigger state.
- Do not introduce autonomous hire/reject decisions or unsupported protected-trait/emotion/personality/deception/appearance/accent-quality inference.

## Next Action

Execute M06.9 under strict TDD. Add the smallest browser acceptance proving durable finalized transcript data is restored across a same-attempt reconnect while partial hypotheses are not restored and technical interruptions remain separate; verify an intended RED on the exact test-only head, implement only missing runtime/UI composition, verify GREEN, then complete skeptical review, traceability/feature/test-matrix reconciliation, exact-final-head CI, and the authorized milestone merge gate.