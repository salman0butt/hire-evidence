# Transcript + Durable Session Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Persist accurate, immutable finalized interview turns across reconnects and finalize the authoritative interview attempt exactly once without treating technical failures as candidate evidence.

**Architecture:** Extend the existing provider-neutral realtime boundary with normalized transcript events, feed those events into a focused transcript state machine, and persist only finalized turns through attempt-scoped server authority. Keep partial hypotheses browser-only, restore durable turns on reconnect, persist technical interruptions separately, and seal transcript/session state through one idempotent finalization operation.

**Tech Stack:** Next.js, TypeScript, Vitest, Playwright, Supabase/PostgreSQL RLS, existing realtime transport/runtime modules.

**Spec:** `docs/superpowers/specs/2026-09-14-transcript-durable-session-design.md`

## Global Constraints

- `docs/product/PRD.md` sections 54–68 are authoritative.
- Partial transcript hypotheses are UI-only and must not be persisted as evidence.
- Finalized turns are immutable, speaker-correct, chronological, and isolated to one authoritative attempt.
- Technical failures/interruption metadata cannot reduce candidate evaluation.
- No audio-based emotion, personality, deception, protected-trait, accent, appearance, or health inference.
- Finalization and downstream assessment trigger are idempotent.
- Every behavioral task follows verified RED → minimal GREEN → fresh verification before completion.

---

### Task 1: Normalize provider transcript events (M06.1)

**Files:**
- Modify: `src/lib/realtime/transport.ts`
- Modify: `src/lib/realtime/gemini-transport.ts`
- Test: `src/lib/realtime/gemini-transport.test.ts`

**Interfaces:**
- Produces: `TranscriptSpeaker = "candidate" | "interviewer"`
- Produces normalized transport events `partialTranscript` and `finalTranscript` carrying `speaker` + trimmed `text`.

- [ ] **Step 1: Write failing adapter tests** proving Gemini setup enables input/output audio transcription and provider input/output transcript fields become provider-neutral transcript events.
- [ ] **Step 2: Run `pnpm vitest run src/lib/realtime/gemini-transport.test.ts`** and record an intended RED caused by the missing normalized transcript behavior.
- [ ] **Step 3: Add the minimal transport types and Gemini mapping.** Ignore whitespace payloads; do not expose provider field names downstream. Buffer model output fragments only as needed to emit one finalized interviewer turn on provider turn completion.
- [ ] **Step 4: Re-run the focused test and the realtime transport tests** and require GREEN.
- [ ] **Step 5: Commit** as `feat: normalize realtime transcript events` and record RED/GREEN evidence in the M06 ledger.

### Task 2: Separate partial transcript UI state from finalized turns (M06.2)

**Files:**
- Create: `src/lib/realtime/transcript-state.ts`
- Create: `src/lib/realtime/transcript-state.test.ts`
- Modify: `src/lib/realtime/interview-session.ts`
- Test: `src/lib/realtime/interview-session.test.ts`

**Interfaces:**
- Produces: `TranscriptState`, `InterviewTranscriptTurn`, `applyTranscriptEvent`.
- Consumes: normalized `partialTranscript` / `finalTranscript` events from Task 1.

- [ ] **Step 1: RED** tests that partial text replaces only the matching speaker preview and never enters finalized turns; final text clears the speaker preview and appends exactly one immutable turn.
- [ ] **Step 2: Verify intended RED** with focused Vitest commands.
- [ ] **Step 3: Implement minimal pure transcript state** and wire session snapshots/callbacks without persistence.
- [ ] **Step 4: GREEN** focused transcript/session tests, then full realtime unit suite.
- [ ] **Step 5: Commit** as `feat: add interview transcript state`.

### Task 3: Persist finalized durable messages (M06.3)

**Files:**
- Create: `supabase/migrations/<timestamp>_interview_transcript_messages.sql`
- Create: `src/lib/realtime/transcript-repository.ts`
- Create: `src/lib/realtime/transcript-repository.test.ts`
- Modify: generated/database types only if repository convention requires it.

**Interfaces:**
- Produces: attempt-scoped `appendFinalizedTurn`, `listFinalizedTurns` with server-assigned monotonic `sequence` and immutable message identity.

- [ ] **Step 1: RED** repository/provider tests for ordered insert-only messages, valid speakers, same-attempt idempotency, and cross-attempt denial.
- [ ] **Step 2: Verify RED** is behavioral rather than migration/test infrastructure failure.
- [ ] **Step 3: Implement migration, indexes/RLS/RPC or repository boundary** following existing Supabase conventions. Enforce unique attempt sequence and idempotency identity.
- [ ] **Step 4: GREEN** unit/provider/database security tests.
- [ ] **Step 5: Commit** as `feat: persist finalized interview transcript turns`.

### Task 4: Enforce transcript correctness invariants (M06.4)

**Files:**
- Modify: `src/lib/realtime/transcript-repository.ts`
- Modify: `src/lib/realtime/transcript-state.ts`
- Test: corresponding transcript tests plus adversarial/security tests.

**Interfaces:**
- Guarantees duplicate finalized event replay is idempotent, sequences remain monotonic, stored speaker cannot be content-inferred/reassigned, and sealed turns cannot be mutated.

- [ ] **Step 1: RED** adversarial tests for duplicate replay, order conflict, invalid speaker, whitespace-only final, cross-attempt contamination, and mutation of a committed turn.
- [ ] **Step 2: Verify intended RED.**
- [ ] **Step 3: Add only the required validation/constraints.**
- [ ] **Step 4: GREEN** focused and security suites.
- [ ] **Step 5: Commit** as `fix: enforce transcript correctness invariants`.

### Task 5: Make attempt lifecycle idempotent (M06.5)

**Files:**
- Modify: `src/lib/realtime/session-repository.ts`
- Modify: related realtime-session authorization/service code.
- Test: `src/lib/realtime/session-repository.test.ts` and provider/service tests.

**Interfaces:**
- Produces authoritative retry-safe start/end semantics for exactly one invitation-bound attempt.

- [ ] **Step 1: RED** tests for repeated start/end requests and stale capability/session generations.
- [ ] **Step 2: Verify RED.**
- [ ] **Step 3: Implement idempotent lifecycle transitions without creating a second attempt.**
- [ ] **Step 4: GREEN** unit/provider/security tests.
- [ ] **Step 5: Commit** as `feat: make interview attempt lifecycle idempotent`.

### Task 6: Restore transcript across reconnect (M06.6)

**Files:**
- Modify: `src/lib/realtime/reconnect.ts`
- Modify: `src/lib/realtime/realtime-interview-runtime.ts`
- Modify: transcript/session repository modules.
- Test: reconnect/runtime tests.

**Interfaces:**
- Reconnect bootstrap returns finalized durable turns for the same authoritative attempt; ephemeral partials are discarded.

- [ ] **Step 1: RED** same-attempt restore and cross-attempt leakage tests.
- [ ] **Step 2: Verify RED.**
- [ ] **Step 3: Implement authoritative transcript bootstrap and generation-safe replacement.**
- [ ] **Step 4: GREEN** reconnect/runtime/security tests.
- [ ] **Step 5: Commit** as `feat: restore durable transcript on reconnect`.

### Task 7: Persist technical interruption events separately (M06.7)

**Files:**
- Create/modify migration for technical interview events.
- Create: `src/lib/realtime/technical-event-repository.ts`
- Modify recovery/runtime composition.
- Test: repository/recovery/security tests.

**Interfaces:**
- Produces attempt-scoped non-evaluative technical events with category/timestamp and no candidate score/evidence mutation.

- [ ] **Step 1: RED** tests that reconnect/provider/browser failures record technical events without creating transcript turns or assessment evidence.
- [ ] **Step 2: Verify RED.**
- [ ] **Step 3: Implement minimal separate persistence path.**
- [ ] **Step 4: GREEN** focused and AI-safety tests.
- [ ] **Step 5: Commit** as `feat: record interview technical interruptions`.

### Task 8: Finalize session exactly once (M06.8)

**Files:**
- Modify: session/transcript repository and server service/route used to end interviews.
- Add migration/RPC if transactionality requires it.
- Test: provider/service/security tests.

**Interfaces:**
- Produces one idempotent `finalizeAttempt` result that seals transcript writes, stores duration/completion metadata, marks completed, and creates one assessment trigger marker.

- [ ] **Step 1: RED** concurrent/retry tests proving duplicate finalization cannot duplicate transcript sealing, assessment triggers, or billing markers.
- [ ] **Step 2: Verify RED.**
- [ ] **Step 3: Implement atomic/idempotent finalization following existing DB transaction/RPC conventions.**
- [ ] **Step 4: GREEN** focused provider/security tests.
- [ ] **Step 5: Commit** as `feat: finalize interview session idempotently`.

### Task 9: Durability E2E and milestone closeout (M06.9)

**Files:**
- Create/modify: `e2e/*transcript*.spec.ts`
- Update: `docs/milestones/M06-transcript-durable-session.md`
- Update: `docs/milestones/CURRENT.md`
- Update: `docs/progress/STATUS.md`
- Update: `docs/SESSION-HANDOFF.md`
- Update: `docs/requirements/TRACEABILITY.md`
- Update: `docs/FEATURE-MATRIX.md` / `docs/progress/TEST-MATRIX.md` where required.

**Interfaces:**
- Acceptance proves refresh/disconnect/reconnect/finalize preserves only finalized same-attempt transcript turns in order and exposes technical interruptions separately.

- [ ] **Step 1: RED** browser acceptance for durable finalized transcript plus reconnect/finalize retry behavior.
- [ ] **Step 2: Verify RED** on exact branch head.
- [ ] **Step 3: Add only missing runtime/UI composition needed by acceptance.**
- [ ] **Step 4: Run full repository gate:** frozen install, format/lint, typecheck, unit/provider/security tests, build, E2E, and repository verifiers.
- [ ] **Step 5: Perform skeptical security/architecture/performance/accessibility/AI-safety review and resolve all Critical/Important findings.**
- [ ] **Step 6: Update durable milestone evidence with exact RED/GREEN/final SHAs and CI URLs.**
- [ ] **Step 7: Verify exact-final-head CI, mark PR ready, and merge only when every repository/user merge gate passes.**
- [ ] **Step 8: Verify post-merge `main` and activate M07 Evidence-Based Assessment Engine.**

## Self-Review

The plan covers every M06 ledger iteration and PRD sections 54–68 relevant to durable transcript/session lifecycle. Provider details remain isolated; partial transcript persistence is explicitly prohibited; technical interruptions remain non-evaluative; audio recording/video remain out of M06 scope; evidence-grounded scoring is intentionally deferred to M07.