# Current Milestone

Milestone:
Transcript + Durable Session

Legacy roadmap identifier:
M06

Status:
IN PROGRESS — M06.5 VERIFIED / M06.6 ACTIVE

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
6. M06.6 — Same-attempt reconnect transcript restoration — **ACTIVE**.
7. M06.7 — Separate technical interruption events — **NOT STARTED**.
8. M06.8 — Idempotent session finalization — **NOT STARTED**.
9. M06.9 — Durability E2E and milestone closeout — **NOT STARTED**.

## Latest Verification

M05 merged to `main` as `5c3843c6444bad256974ea391a4a6a978bf88f24` before M06 activation.

M06.4 chronology RED: `f34d095fb5607bddef3252cfec5a04228954153a`, CI #821 / run `34884154545` — lint/typecheck passed and the intended reversed-timestamp transcript correctness test failed while 524 tests passed.

M06.4 GREEN: `ef898009c063c57a42af1ae64463719a77e13d50`, CI #822 / run `34884400868` — complete repository gate GREEN, including unit/component tests, framework and requirements verifiers, local Supabase startup, build, Chromium E2E and PRD coverage.

M06.5 terminal-replay RED: `8117a3eed5ab3114e1ed81697f680dd8c8f98699`, CI #823 / run `34885046377` — lint/typecheck passed and the sole new lifecycle contract failed because completed-attempt rejection preceded processed-event replay; 525 tests passed.

M06.5 GREEN: `fd2da242a636acd5ec4ea879c6ec43d6359e5f10`, CI #824 / run `34885300353` — complete repository gate GREEN, including migration application in local Supabase, build, Chromium E2E and PRD coverage.

CI status: the latest fully verified implementation SHA is `fd2da242a636acd5ec4ea879c6ec43d6359e5f10`. Documentation commits after that checkpoint require fresh exact-head verification and do not supersede this implementation evidence until CI passes.

## Review State

- Unresolved Critical findings: **0** at latest recovery.
- Unresolved Important findings: **0** at latest recovery.
- PR #8 has no submitted reviews or unresolved inline review comments at latest recovery.
- M06 is not merge-ready because M06.6–M06.9 remain incomplete.

## Constraints

- Persist only finalized transcript turns; partial provider hypotheses remain UI-only.
- Transcript speaker identity comes from normalized event semantics, never text inference.
- Durable ordering/identity are server-authoritative and attempt-scoped.
- Cross-attempt/cross-capability transcript access must fail closed.
- Reconnect must restore only the same authoritative attempt and discard stale ephemeral partials/generation callbacks.
- Technical failures remain separate from candidate evidence and cannot reduce assessment.
- Do not introduce autonomous hire/reject decisions or unsupported protected-trait/emotion/personality/deception/appearance/accent-quality inference.

## Next Action

Execute M06.6 under strict TDD: define the smallest reconnect-persistence RED proving committed finalized turns are restored only for the authoritative resumed attempt, verify the intended exact-head failure, implement the minimal composition without restoring ephemeral partials or leaking another attempt, verify GREEN, update durable evidence, and continue without stopping at a green checkpoint.
