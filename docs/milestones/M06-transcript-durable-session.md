# M06 — Transcript + Durable Session

Status: **IMPLEMENTATION COMPLETE / MERGE GATE**

## Goal
Deliver an evidence-safe durable interview transcript: partial provider hypotheses remain ephemeral, finalized candidate/interviewer turns become immutable ordered records, reconnect restores only the same authoritative attempt, technical interruptions stay separate from candidate evidence, and finalization is idempotent.

## Authoritative PRD Milestone Definition

Deliver finalized transcript persistence, turn ordering, speaker attribution, idempotent attempt lifecycle, reconnect persistence, technical event tracking, and session finalization.

Exit: completed interview produces durable accurate transcript.

## Dependencies
M05 — Realtime AI Interview — **COMPLETE**, merged to `main` as `5c3843c6444bad256974ea391a4a6a978bf88f24`.

## In Scope
Provider-neutral transcript event normalization; browser-only partial hypotheses; immutable attempt-scoped finalized transcript messages; duplicate/order/speaker/immutability correctness; idempotent attempt lifecycle; same-attempt reconnect hydration; separately persisted non-evaluative technical interruptions; idempotent session finalization; accessible transcript presentation; and browser durability acceptance.

## Out of Scope
M07 assessment/scoring logic and later milestones; persistence or evaluation of partial hypotheses; autonomous hire/reject decisions; speculative transcript interpretation; and protected-trait, emotion, personality, deception, appearance, health, or accent-quality inference.

## Selected Design / Plan
- Design: `docs/superpowers/specs/2026-09-14-transcript-durable-session-design.md`
- Plan: `docs/superpowers/plans/2026-09-14-transcript-durable-session.md`
- Branch: `feat/transcript-durable-session`
- PR: #8 — `Build transcript durable session`

## Acceptance Criteria
- **PASS** — Partial transcripts are never persisted as candidate evidence.
- **PASS** — Finalized turns are immutable, speaker-correct, ordered and attempt-isolated.
- **PASS** — Technical failures remain separately persisted and non-evaluative.
- **PASS** — Same authoritative attempt is restored across reconnect without cross-attempt leakage.
- **PASS** — Finalization/assessment trigger is exactly-once/idempotent.
- **PASS** — Browser acceptance proves finalized reconnect transcript restoration and separate technical interruption handling.
- **PASS** — Security/privacy/tenancy/accessibility/performance/AI-safety review has 0 unresolved Critical/Important findings.
- **ACTIVE GATE** — Final closeout documentation head requires exact-final-head CI before merge.

## Tasks / Iterations
1. **VERIFIED** — M06.1 Provider event normalization.
2. **VERIFIED** — M06.2 Ephemeral partials vs immutable finalized transcript state.
3. **VERIFIED** — M06.3 Attempt-scoped durable finalized transcript messages.
4. **VERIFIED** — M06.4 Duplicate/order/speaker/immutability correctness guards.
5. **VERIFIED** — M06.5 Idempotent authoritative attempt lifecycle.
6. **VERIFIED** — M06.6 Same-attempt durable transcript reconnect/hydration.
7. **VERIFIED** — M06.7 Separate non-evaluative technical interruption events.
8. **VERIFIED** — M06.8 Idempotent session finalization and exactly-once assessment marker.
9. **VERIFIED** — M06.9 Browser durability acceptance; closeout/merge gate active.

## TDD Evidence

### M06.1–M06.3
- M06.1 final GREEN `60fa653e8b5dc9c47a21dc9bea8c3d8aba6566e3`, CI #796 / `34868105525`.
- M06.2 RED `de9340078c556153b189cd088b18729fd881a00d`, CI #800 / `34872661481`; GREEN `2e91eb529cdc56688aca65766c6e5785d6b1378b`, CI #804 / `34873181788`.
- M06.3 repository RED `1a35d109496c51fa5b4f1e740c0ff756f7903619`, CI #806 / `34873858138`; migration RED `c219b68f24b2e900e5b4bfb69cd17c63ba34027d`, CI #809 / `34875215424`; GREEN `73a43be166d87db0e1a20c89d4894f20bd550dbf`, CI #810 / `34875410392`.

### M06.4–M06.5
- M06.4 chronology RED `f34d095fb5607bddef3252cfec5a04228954153a`, CI #821 / `34884154545`; GREEN `ef898009c063c57a42af1ae64463719a77e13d50`, CI #822 / `34884400868`.
- M06.5 terminal replay RED `8117a3eed5ab3114e1ed81697f680dd8c8f98699`, CI #823 / `34885046377`; GREEN `fd2da242a636acd5ec4ea879c6ec43d6359e5f10`, CI #824 / `34885300353`.

### M06.6–M06.8
Git history after M06.5 contains the strict TDD units for reconnect transcript bootstrap/hydration, technical interruption persistence, and idempotent finalization. The integrated exact head `4943d949ff943b2585580655e1596ac32f006e32` passed complete CI #861 / run `34903314993`, covering all M06.6–M06.8 implementation and tests.

Representative implementation commits include reconnect transcript restoration (`2995fa51…`, `bf7621ac…`, `4943d949…`), technical interruption persistence (`9f1c36f4…`, `bc7ebcdd…`), and session finalization (`54382c72…`, `ef324c30…`, `de07fd6d…`, `cc3ec681…`). Git history is authoritative for the complete RED/GREEN chain.

### M06.9 — Durability Browser Acceptance
- **RED** `02dfe4704892110d59873efc3262421b0e7e4890`, CI #863 / run `34906932165`: frozen install, lint, typecheck, unit/component tests, verifiers, local Supabase and build passed; the newly added browser durability acceptance failed in E2E because reconnect-restored finalized transcript was not yet exposed through candidate-visible transcript UI.
- **GREEN** `ddf3d32024fc6d5c67115326aba0405ba87d0d96`, CI #864 / run `34907376635`: complete repository gate GREEN, including Chromium E2E and PRD coverage. Minimal production change renders finalized turns plus ephemeral partial previews as accessible React text. The browser acceptance proves a same-attempt reconnect restores a finalized candidate turn while the provider disconnect is recorded through the separate technical-event path.

## Integration Test Evidence
M06.3 CI #810 applied the durable transcript migration in local Supabase and verified attempt-scoped capability-bound append/list behavior. M06.6–M06.8 integrated CI #861 verified reconnect hydration, technical-event separation, and idempotent finalization with repository-wide tests. M06.9 CI #864 verified the production browser composition through Chromium E2E, including same-attempt reconnect transcript restoration and separate technical-event recording.

## Security Review
No Critical or Important findings remain. Capability-bound repositories/RPCs preserve tenant and attempt isolation, direct browser table access remains denied, sealed/finalized transcript state cannot be silently mutated, and transcript text is treated as untrusted data rather than instruction. Technical failures cannot reduce candidate assessment.

## Accessibility Review
Finalized transcript and current partial previews are available as text rather than audio-only information. Partial previews use live-region semantics; finalized content remains ordinary readable text. Chromium acceptance passed CI #864.

## Performance Review
Ephemeral state is bounded to two speaker previews. Durable reads remain attempt-scoped and ordered/indexed. Sequence allocation intentionally serializes per attempt for correctness.

## AI / Eval Review
Technical failures never become candidate-performance evidence. Transcript text cannot act as system instruction. No unsupported emotion/accent/personality/deception/protected-trait/appearance/health inference is added. M07 assessment remains explicitly downstream and evidence-grounded.

## Code Review Findings
- Critical: **0 unresolved**.
- Important: **0 unresolved**.
- PR #8 has no submitted reviews or unresolved inline review comments at latest recovery.

## Fresh Verification Results
Latest fully verified implementation head before closeout documentation: `ddf3d32024fc6d5c67115326aba0405ba87d0d96`, CI #864 / `34907376635` — full repository gate GREEN.

Closeout head `bddea8c8aa4b59b9ff6e1389487871d875a84397`, CI #872 / run `34908228069`, was **NOT GREEN**: frozen install, lint, typecheck, unit/component tests and verifier tests passed, but `Verify autonomous framework` failed because this ledger rewrite had dropped required durable-ledger section headings. That failure is a documentation-framework contract failure, not product behavior evidence. This commit restores the mandatory sections; its own exact-head CI must pass before merge.

## Durable Recovery Sources
Recover `AGENTS.md` and `docs/AUTONOMOUS-DEVELOPMENT.md` first, then actual Git/PR/CI state, `docs/progress/STATUS.md`, `docs/milestones/CURRENT.md`, this ledger, `docs/SESSION-HANDOFF.md`, traceability/feature/test matrices, the M06 design/plan, source and tests. Actual Git/code/exact-SHA CI outrank stale prose.

## Completion Checklist
- [x] Requirements and all M06 iterations accounted for.
- [x] Acceptance criteria implemented and verified.
- [x] Required TDD/integration/E2E evidence recorded.
- [x] Security/accessibility/performance/AI-safety reviews complete.
- [x] 0 Critical / 0 Important findings.
- [x] Traceability/feature/test matrices fully reconciled.
- [ ] Exact-final-head CI green after closeout docs.
- [x] Durable status/handoff/current-milestone state reconciled.

## Next Work
Verify exact-final-head CI for the restored framework-contract head. If GREEN, recheck concurrency/reviews/mergeability, execute the user-authorized PR #8 merge gate, verify post-merge `main`, then activate M07 — Evidence-Based Assessment Engine and immediately begin its first valid unit under strict TDD.