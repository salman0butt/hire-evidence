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
3. **ACTIVE** — M06.3 — Durable messages: sequence, speaker, timestamps, immutable persistence and capability/attempt isolation.
4. **NOT STARTED** — M06.4 — Correctness guards: no duplication, order/speaker invariants.
5. **NOT STARTED** — M06.5 — Idempotent attempt lifecycle: authoritative start/end and retry safety.
6. **NOT STARTED** — M06.6 — Reconnect persistence: resume without cross-session transcript leakage.
7. **NOT STARTED** — M06.7 — Technical interruption events: separate platform failures from candidate behavior.
8. **NOT STARTED** — M06.8 — Session finalization: seal transcript, duration, state and assessment trigger exactly once.
9. **NOT STARTED** — M06.9 — Durability E2E: refresh/disconnect/reconnect/finalize scenarios and milestone closeout.

## TDD Evidence

### M06.1 — Provider event normalization
- Final verified GREEN: `60fa653e8b5dc9c47a21dc9bea8c3d8aba6566e3`, CI #796 / run `34868105525` — complete repository gate GREEN.
- The branch history before that checkpoint contains the normalization RED and minimal Gemini/transport implementation commits; exact history remains recoverable from Git/GitHub.

### M06.2 — Transcript state
- **RED** `0e7706db0ed71547a0dbe4a4147fc94febece73b`, CI #797 / run `34868960575`: intended failure because `./transcript-state` did not yet exist; dependency install and lint succeeded before TypeScript reported the missing module.
- Implementation `e26b6d676b5f6d3d96167ce424889578f74fcca7`: added the pure immutable transcript state. CI #798 / run `34872246490` was superseded/cancelled after unit/verifier stages had passed; it is **not** claimed as a full GREEN checkpoint.
- **INVALID NOT RED** `cd47ecf9cd3b531df6407a93523c52da0fc2d6cb`, CI #799 / run `34872497110`: the first session-integration test failed in TypeScript on its own cast before reaching product behavior. This does not count as behavioral RED.
- **RED** `de9340078c556153b189cd088b18729fd881a00d`, CI #800 / run `34872661481`: lint/typecheck passed; the full unit suite failed only because session snapshots did not yet expose transcript state. This is the valid integration RED.
- **NOT GREEN** `530d8ef2eb5c0899042f8b5653536ed221199019`, CI run `34872992584`: minimal session integration exposed a compatibility failure because existing UI/runtime test fixtures still constructed the pre-transcript snapshot shape. Production type safety was preserved; fixtures were updated rather than weakening the type.
- **GREEN** `2e91eb529cdc56688aca65766c6e5785d6b1378b`, CI #804 / run `34873181788`: install, lint, typecheck, unit/component tests, framework/requirements verifiers, local Supabase startup, build, Chromium, E2E and PRD coverage all passed.

### M06.3 — Durable messages
- **RED** `1a35d109496c51fa5b4f1e740c0ff756f7903619`, CI #806 / run `34873858138`: install/lint passed and typecheck failed solely because the durable transcript repository module did not yet exist.
- **NOT GREEN** `5c9231a10d2063dec10e42732a21773fb32232be`, CI #807 / run `34874048598`: repository implementation passed lint, typecheck and all 517 unit/component tests, but the autonomous-framework verifier correctly rejected this ledger because a prior reconciliation accidentally removed required `In Scope` / `Out of Scope` headings. The product implementation was not claimed GREEN.

## Integration Test Evidence
M06.2 exact-head CI #804 / `34873181788` passed the complete repository gate, including local-Supabase-backed E2E. M06.3 durable database integration remains active work.

## Security Review
Current M06.1/M06.2 review: no Critical or Important findings. Transcript text remains untrusted data; partials are in-memory only; stale-generation callbacks are rejected by the existing session guard; no scoring or protected-trait/emotion/personality/accent inference is introduced. M06.3 repository calls are capability-bound and fail closed; database-side attempt isolation remains pending migration verification.

## Accessibility Review
No transcript UI was introduced by M06.1/M06.2. Existing interview UI/accessibility acceptance passed CI #804. Transcript presentation remains future acceptance work if/when exposed.

## Performance Review
No blocking issue found. Transcript partial state is bounded to two speaker previews. Finalized turns are currently copied by the pure immutable state helper; acceptable for the current bounded browser-session scope and subject to later optimization if profiling shows pressure.

## AI / Eval Review
Transcript text is evidence input, never trusted instruction. Technical/browser/provider failures cannot reduce candidate evaluation. Evidence-grounded assessment remains M07 scope.

## Code Review Findings
- Critical: 0 unresolved.
- Important: 0 unresolved.
- PR #8 had no submitted reviews or unresolved review threads at the latest recovery.
- Minor/performance observation: immutable finalized-turn arrays are copied by the state helper; no correctness or safety impact at current scale.

## Fresh Verification Results
Latest fully verified M06 head: `2e91eb529cdc56688aca65766c6e5785d6b1378b`, CI #804 / `34873181788` — complete repository gate GREEN. M06.3 head requires fresh full exact-head verification after the ledger-contract repair.

## Commits / Files Changed
M06.1/M06.2 introduced normalized transcript transport handling, Gemini transcript mapping/interruption cleanup, `src/lib/realtime/transcript-state.ts`, transcript state tests, session transcript integration tests, and snapshot fixture updates. M06.3 has added `src/lib/realtime/transcript-repository.test.ts` and `src/lib/realtime/transcript-repository.ts`. Git history is authoritative for the exact diff.

## Known Limitations
Durable finalized-turn database persistence, correctness/idempotency guards, reconnect transcript restore, technical-event persistence, finalization and durability E2E remain unfinished M06 work.

## Documentation Updated
This ledger records valid RED/GREEN/NOT GREEN checkpoints. `docs/milestones/CURRENT.md`, `docs/progress/STATUS.md` and `docs/SESSION-HANDOFF.md` must remain aligned as work advances.

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
M06.3 — verify the durable transcript repository boundary on exact head, then add attempt-scoped immutable finalized transcript database messages with server-assigned monotonic sequence, idempotent identity and capability-bound cross-attempt denial using strict RED → GREEN evidence.

## Next Milestone
M07 — Evidence-Based Assessment Engine.
