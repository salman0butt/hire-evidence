# M06 — Transcript + Durable Session

Status: **IN PROGRESS**

## Goal
Deliver an evidence-safe durable interview transcript: partial provider hypotheses remain ephemeral, finalized candidate/interviewer turns become immutable ordered records, reconnect restores only the same authoritative attempt, technical interruptions stay separate from candidate evidence, and finalization is idempotent.

## Authoritative PRD Milestone Definition

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

Exit: completed interview produces durable accurate transcript.

## Dependencies
M05 — Realtime AI Interview — **COMPLETE**, merged to `main` as `5c3843c6444bad256974ea391a4a6a978bf88f24`.

## In Scope
The authoritative M06 definition and iterations M06.1–M06.9, including normalized transcript handling, durable finalized messages, ordering/speaker/idempotency/reconnect/technical-event/finalization guarantees, and durability E2E.

## Out of Scope
M07 assessment/scoring logic and later milestones; speculative transcript interpretation; persistence or evaluation of partial hypotheses; any protected-trait, emotion, personality, deception, appearance, health, or accent-quality inference.

## Selected Design / Implementation Plan
- Design: `docs/superpowers/specs/2026-09-14-transcript-durable-session-design.md`
- Plan: `docs/superpowers/plans/2026-09-14-transcript-durable-session.md`
- Active branch: `feat/transcript-durable-session`
- Active PR: #8 — `Build transcript durable session` — OPEN / DRAFT while M06 remains incomplete.

## Acceptance Criteria
- PRD deliverables and exit criteria pass.
- Partial transcripts are never persisted as candidate evidence.
- Finalized turns are immutable, speaker-correct, ordered and attempt-isolated.
- Technical failures remain non-evaluative.
- Finalization/assessment trigger is exactly-once/idempotent.
- Relevant security/privacy/tenancy/accessibility/performance/AI-safety gates pass.
- 0 unresolved Critical or Important findings.
- Traceability and feature state are reconciled.
- Exact-final-head CI is green.

## Tasks / Iterations
1. **VERIFIED** — M06.1 — Provider event normalization: normalized provider-neutral `partialTranscript` / `finalTranscript` events, Gemini transcription setup, interruption fragment clearing.
2. **VERIFIED** — M06.2 — Transcript state: per-speaker partial UI hypotheses vs immutable finalized turns, generation-safe session snapshots, no persistence.
3. **VERIFIED** — M06.3 — Durable messages: attempt-scoped insert-only finalized turns, capability isolation, immutable identity, server-assigned monotonic sequence and ordered reads.
4. **ACTIVE** — M06.4 — Correctness guards: no duplication, order/speaker/immutability adversarial guarantees.
5. **NOT STARTED** — M06.5 — Idempotent attempt lifecycle: authoritative start/end and retry safety.
6. **NOT STARTED** — M06.6 — Reconnect persistence: resume without cross-session transcript leakage.
7. **NOT STARTED** — M06.7 — Technical interruption events: separate platform failures from candidate behavior.
8. **NOT STARTED** — M06.8 — Session finalization: seal transcript, duration, state and assessment trigger exactly once.
9. **NOT STARTED** — M06.9 — Durability E2E: refresh/disconnect/reconnect/finalize scenarios and milestone closeout.

## TDD Evidence

### M06.1 — Provider event normalization
- Final verified GREEN: `60fa653e8b5dc9c47a21dc9bea8c3d8aba6566e3`, CI #796 / run `34868105525` — complete repository gate GREEN.

### M06.2 — Transcript state
- **RED** `0e7706db0ed71547a0dbe4a4147fc94febece73b`, CI #797 / run `34868960575`: intended failure because `./transcript-state` did not yet exist.
- **INVALID NOT RED** `cd47ecf9cd3b531df6407a93523c52da0fc2d6cb`, CI #799 / run `34872497110`: test harness TypeScript failure before product behavior; not counted as behavioral RED.
- **RED** `de9340078c556153b189cd088b18729fd881a00d`, CI #800 / run `34872661481`: lint/typecheck passed; unit suite failed because session snapshots did not expose transcript state.
- **NOT GREEN** `530d8ef2eb5c0899042f8b5653536ed221199019`, CI run `34872992584`: compatibility fixtures still used the old snapshot shape.
- **GREEN** `2e91eb529cdc56688aca65766c6e5785d6b1378b`, CI #804 / run `34873181788`: complete repository gate GREEN.

### M06.3 — Durable messages
- **RED** `1a35d109496c51fa5b4f1e740c0ff756f7903619`, CI #806 / run `34873858138`: typecheck failed solely because the transcript repository module did not yet exist.
- **NOT GREEN** `5c9231a10d2063dec10e42732a21773fb32232be`, CI #807 / run `34874048598`: repository implementation passed lint/typecheck/all then-current tests, but the autonomous-framework verifier correctly rejected an accidentally damaged ledger contract.
- **RED** `c219b68f24b2e900e5b4bfb69cd17c63ba34027d`, CI #809 / run `34875215424`: lint and typecheck passed; the new migration contract failed exactly because `202609140001_interview_transcript_messages.sql` was absent. The other 517 tests passed. A later `supabase stop` cleanup error was secondary fallout after Supabase setup was skipped, not the RED cause.
- **GREEN** `73a43be166d87db0e1a20c89d4894f20bd550dbf`, CI #810 / run `34875410392`: frozen install, lint, typecheck, 521 unit/component tests, framework/requirements verifiers, autonomous/requirements integrity checks, local Supabase startup with the new migration, build, Chromium E2E, PRD coverage and cleanup all passed.

## Integration Test Evidence
M06.3 exact-head CI #810 / `34875410392` applied the transcript migration successfully in local Supabase and passed the complete repository gate, including browser E2E. The database now enforces attempt-scoped sequence/idempotency uniqueness, valid speaker/non-empty finalized text, direct browser table-access revocation, and capability-bound append/list RPCs.

## Security Review
No Critical or Important findings remain for M06.1–M06.3. Transcript text remains untrusted data; partials stay in memory only. Durable writes are bound to the authoritative active attempt and invitation token hash, require an unexpired/non-revoked started invitation, serialize sequence assignment under an attempt row lock, and expose no direct anon/auth table grants. Identical event replay is idempotent; conflicting replay fails closed. M06.4 adds defense-in-depth adversarial validation around malformed/duplicate durable responses and finalized immutability.

## Accessibility Review
No new transcript presentation UI was introduced through M06.3. Existing interview accessibility acceptance passed CI #810. Transcript presentation remains subject to browser/accessibility review if exposed later in M06.

## Performance Review
Attempt-scoped transcript reads are ordered and indexed; authoritative sequence allocation is serialized per attempt, which intentionally favors correctness over cross-turn write concurrency. Partial state remains bounded to two speaker previews.

## AI / Eval Review
Transcript text is evidence input, never trusted instruction. Technical/browser/provider failures cannot reduce candidate evaluation. Evidence-grounded assessment remains M07 scope.

## Code Review Findings
- Critical: 0 unresolved.
- Important: 0 unresolved.
- PR #8 had no submitted reviews or unresolved inline review comments at the latest recovery.
- M06.4 is explicitly reserved for adversarial transcript correctness hardening before lifecycle/reconnect work.

## Fresh Verification Results
Latest fully verified M06 implementation head: `73a43be166d87db0e1a20c89d4894f20bd550dbf`, CI #810 / run `34875410392` — complete repository gate GREEN. Documentation reconciliation commits after that checkpoint require their own exact-head verification and do not supersede this implementation evidence until CI passes.

## Commits / Files Changed
M06.1/M06.2 introduced normalized transcript transport handling, Gemini transcript mapping/interruption cleanup, immutable transcript state, session integration and tests. M06.3 added the capability-bound transcript repository, migration contract tests, and `supabase/migrations/202609140001_interview_transcript_messages.sql`. Git history remains authoritative for the complete diff.

## Known Limitations
M06.4 adversarial correctness guards, idempotent lifecycle, reconnect transcript restore, technical-event persistence, finalization and durability E2E remain unfinished M06 work.

## Documentation Updated
This ledger records valid RED/GREEN/NOT GREEN checkpoints. `docs/milestones/CURRENT.md`, `docs/progress/STATUS.md` and `docs/SESSION-HANDOFF.md` are being reconciled to M06 in the same autonomous run.

## Durable Recovery Sources
`AGENTS.md` → `docs/AUTONOMOUS-DEVELOPMENT.md` → actual Git/PR/CI → this ledger → `docs/progress/STATUS.md` → `docs/milestones/CURRENT.md` → `docs/SESSION-HANDOFF.md` → PRD/design/plan → source/tests.

## Completion Checklist
- [ ] Requirements and all M06 iterations accounted for.
- [ ] Acceptance criteria verified.
- [ ] Required TDD/integration/E2E evidence recorded.
- [ ] Security/accessibility/performance/AI-eval reviews complete where relevant.
- [ ] 0 Critical / 0 Important findings.
- [ ] Traceability/feature matrix reconciled.
- [ ] Exact-final-head CI green.
- [ ] Durable status/closeout state current.

## Next Work
M06.4 — add the smallest adversarial RED for a transcript correctness invariant not yet defended by the repository boundary, verify exact-head RED, implement the minimal fail-closed guard, verify GREEN, then continue M06.4 coverage without weakening durable identity/order/speaker/immutability rules.

## Next Milestone
M07 — Evidence-Based Assessment Engine.
