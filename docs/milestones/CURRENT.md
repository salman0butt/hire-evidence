# Current Milestone

Milestone:
Transcript + Durable Session

Legacy roadmap identifier:
M06

Status:
IMPLEMENTATION COMPLETE — MERGE GATE

Branch:
`feat/transcript-durable-session`

Base:
`main` at verified M05 merge SHA `5c3843c6444bad256974ea391a4a6a978bf88f24`

PR:
#8 — `Build transcript durable session` — OPEN / DRAFT pending exact-final-head closeout CI. Reuse this PR; do not create a duplicate.

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
9. M06.9 — Durability browser acceptance and milestone closeout — **VERIFIED**.

## Latest Verification

M05 merged to `main` as `5c3843c6444bad256974ea391a4a6a978bf88f24` before M06 activation.

M06.4 chronology RED: `f34d095fb5607bddef3252cfec5a04228954153a`, CI #821 / run `34884154545`; GREEN: `ef898009c063c57a42af1ae64463719a77e13d50`, CI #822 / run `34884400868`.

M06.5 terminal-replay RED: `8117a3eed5ab3114e1ed81697f680dd8c8f98699`, CI #823 / run `34885046377`; GREEN: `fd2da242a636acd5ec4ea879c6ec43d6359e5f10`, CI #824 / run `34885300353`.

M06.6–M06.8 integrated exact head `4943d949ff943b2585580655e1596ac32f006e32`, CI #861 / run `34903314993` — complete repository gate GREEN.

M06.9 browser RED: `02dfe4704892110d59873efc3262421b0e7e4890`, CI #863 / run `34906932165` — all pre-E2E gates passed and the new durability browser acceptance failed. GREEN: `ddf3d32024fc6d5c67115326aba0405ba87d0d96`, CI #864 / run `34907376635` — complete repository gate GREEN including Chromium E2E and PRD coverage.

Closeout status/ledger/handoff/feature/traceability documents were reconciled after the verified implementation head. Their final exact SHA must pass the complete CI gate before merge.

## Review State

- Unresolved Critical findings: **0**.
- Unresolved Important findings: **0**.
- PR #8 had no submitted reviews or unresolved inline review comments at latest recovery.
- M06 acceptance criteria are satisfied at the verified implementation head; only final closeout exact-head verification remains before the authorized merge.

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

Verify the exact final closeout head in GitHub Actions. If it is fully GREEN, recheck PR head/reviews/threads/mergeability/concurrency, mark PR #8 ready if required, execute the user-authorized squash merge, verify post-merge `main` CI, then activate M07 — Evidence-Based Assessment Engine and immediately begin its first valid unit.