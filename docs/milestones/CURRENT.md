# Current Milestone

Milestone:
Transcript + Durable Session

Legacy roadmap identifier:
M06

Status:
IN PROGRESS — M06.3 VERIFIED / M06.4 ACTIVE

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
4. M06.4 — Duplicate/order/speaker/immutability correctness guards — **ACTIVE**.
5. M06.5 — Idempotent attempt lifecycle — **NOT STARTED**.
6. M06.6 — Same-attempt reconnect transcript restoration — **NOT STARTED**.
7. M06.7 — Separate technical interruption events — **NOT STARTED**.
8. M06.8 — Idempotent session finalization — **NOT STARTED**.
9. M06.9 — Durability E2E and milestone closeout — **NOT STARTED**.

## Latest Verification

M05 merged to `main` as `5c3843c6444bad256974ea391a4a6a978bf88f24` before M06 activation.

M06.3 migration-contract RED: `c219b68f24b2e900e5b4bfb69cd17c63ba34027d`, CI #809 / run `34875215424` — four intended contract failures because the transcript migration was absent; all other 517 tests passed.

M06.3 GREEN: `73a43be166d87db0e1a20c89d4894f20bd550dbf`, CI #810 / run `34875410392` — complete repository gate GREEN, including local Supabase startup applying the migration, 521 tests, build, Chromium E2E and PRD coverage.

CI status: the latest fully verified implementation SHA is `73a43be166d87db0e1a20c89d4894f20bd550dbf`. Documentation reconciliation commits after that checkpoint require fresh exact-head CI and must not be described as independently verified until it passes.

## Review State

- Unresolved Critical findings: **0** at latest recovery.
- Unresolved Important findings: **0** at latest recovery.
- PR #8 has no submitted reviews or unresolved inline review comments at latest recovery.
- M06 is not merge-ready because M06.4–M06.9 remain incomplete.

## Constraints

- Persist only finalized transcript turns; partial provider hypotheses remain UI-only.
- Transcript speaker identity comes from normalized event semantics, never text inference.
- Durable ordering/identity are server-authoritative and attempt-scoped.
- Cross-attempt/cross-capability transcript access must fail closed.
- Technical failures remain separate from candidate evidence and cannot reduce assessment.
- Do not introduce autonomous hire/reject decisions or unsupported protected-trait/emotion/personality/deception/appearance/accent-quality inference.

## Next Action

Execute M06.4 under strict TDD: add an adversarial behavioral RED for a missing transcript correctness invariant, verify the intended exact-head failure, implement the smallest fail-closed guard, verify GREEN, update durable evidence, and continue to the next M06.4/M06.5 unit without stopping at a green checkpoint.
