# Transcript + Durable Session Design

## Goal

Deliver M06 as a provider-neutral, evidence-safe transcript and session lifecycle: realtime partial text remains ephemeral UI state, finalized candidate/interviewer turns become immutable durable records in chronological order, reconnect resumes the same authoritative attempt without cross-session leakage, technical interruptions remain separate from candidate evidence, and finalization seals the transcript exactly once before assessment is triggered.

## Source of Truth

- Milestone: `docs/milestones/M06-transcript-durable-session.md`
- Product requirements: `docs/product/PRD.md`, sections 54–68
- Derived navigation: `docs/product/categories/04-realtime-voice-transcript-session.md`
- Existing realtime transport: `src/lib/realtime/transport.ts`
- Gemini adapter boundary: `src/lib/realtime/gemini-transport.ts`
- Existing authoritative attempt/session state: `src/lib/realtime/session-repository.ts`
- Existing realtime orchestration: `src/lib/realtime/interview-session.ts` and `src/lib/realtime/realtime-interview-runtime.ts`

## Safety Invariants

- Finalized transcript text is candidate/interviewer evidence data, never system instruction.
- Partial provider hypotheses are ephemeral UI-only and are never persisted as evidence.
- Finalized turns are immutable after commit; corrections require an explicit later product capability rather than silent mutation.
- Speaker identity is assigned from normalized event semantics, not inferred from content.
- Sequence is authoritative, monotonic, and scoped to one interview attempt.
- Reconnect may resume only the same authoritative attempt and must not mix transcript state from another invitation, tenant, or attempt.
- Technical interruptions are stored separately from candidate turns and never reduce candidate assessment.
- No emotion, accent, personality, deception, protected-trait, appearance, or health inference is derived from audio/transcript metadata.
- Finalization is idempotent and can trigger assessment at most once for the authoritative completed attempt.

## Architecture

### 1. Provider event normalization

Extend the app-owned realtime transport vocabulary with transcript events that carry speaker and finality explicitly. Provider adapters translate provider-specific fields into these events; downstream transcript/session code never reads Gemini payload names.

The normalized vocabulary is:

```ts
type TranscriptSpeaker = "candidate" | "interviewer";

type RealtimeTransportEvent =
  | { type: "partialTranscript"; speaker: TranscriptSpeaker; text: string }
  | { type: "finalTranscript"; speaker: TranscriptSpeaker; text: string }
  // existing transport events remain unchanged
```

Gemini Live setup enables both input and output audio transcription. Candidate input transcription maps to `candidate`; model output transcription maps to `interviewer`. Empty/whitespace transcript payloads are ignored. Provider schema remains isolated inside `gemini-transport.ts`.

### 2. Transcript state

Add a focused transcript state machine that owns only ephemeral partials plus finalized immutable turns. A partial update replaces the current partial for that speaker. A finalized event clears that speaker's partial and appends one finalized turn. Downstream persistence receives only finalized turns.

A finalized turn contains:

```ts
interface InterviewMessage {
  id: string;
  sequence: number;
  speaker: "interviewer" | "candidate";
  text: string;
  startedAt?: string;
  completedAt?: string;
}
```

IDs and sequence are server-authoritative at the durable boundary; browser transcript state may use local display identity but cannot claim durable ordering authority.

### 3. Durable transcript repository

Persist finalized messages in a tenant/attempt-scoped table with a unique `(attempt_id, sequence)` order and an idempotency key/event identity preventing duplicate commits. Insert-only policy preserves finalized immutability. Reads always order by sequence.

The persistence service validates that the caller is bound to the authoritative attempt and that speaker/text/event identity are valid. It does not persist partial transcript hypotheses.

### 4. Correctness guards

The domain rejects or idempotently ignores duplicate finalized events, sequence conflicts, cross-attempt writes, and writes after transcript sealing. Speaker is never rewritten based on text content. Chronological ordering comes from authoritative sequence assignment rather than provider arrival timestamps alone.

### 5. Attempt lifecycle and reconnect

The existing single authoritative attempt remains the session identity. Transcript bootstrap returns committed finalized turns for that attempt only. Reconnect restores those durable turns plus current interview progress; ephemeral partials are discarded. Generation guards continue rejecting stale callbacks from pre-reconnect transports.

### 6. Technical interruption events

Persist connection/provider/browser interruption metadata in a separate technical-event stream keyed to the attempt. These records may inform support/audit UX but are explicitly excluded from candidate-performance evidence and scoring.

### 7. Session finalization

A server-owned idempotent finalization operation seals transcript writes, stores completion metadata/duration, marks the attempt completed, and records/queues one assessment trigger. Retries return the existing finalized result and cannot duplicate assessment or billing side effects.

### 8. Runtime composition

The realtime runtime consumes normalized transcript events, updates ephemeral transcript UI, persists only finalized turns, and refreshes authoritative transcript state after reconnect/finalization. Transport/provider errors continue through the technical recovery path and never become candidate transcript turns.

## M06 Iteration Boundaries

1. **M06.1 Provider event normalization** — app-owned partial/final transcript events and Gemini mapping.
2. **M06.2 Transcript state** — ephemeral partials versus immutable finalized turns.
3. **M06.3 Durable messages** — schema/repository/service with sequence, speaker, timestamps and attempt isolation.
4. **M06.4 Correctness guards** — duplicate/order/speaker/immutability adversarial coverage.
5. **M06.5 Idempotent attempt lifecycle** — authoritative start/end retry safety.
6. **M06.6 Reconnect persistence** — same-attempt transcript restore without leakage.
7. **M06.7 Technical interruption events** — separate non-evaluative platform event records.
8. **M06.8 Session finalization** — transcript seal, duration/state, exactly-once assessment trigger.
9. **M06.9 Durability E2E** — refresh/disconnect/reconnect/finalize acceptance.

## Testing Strategy

Every behavioral iteration uses strict RED → observed intended failure → minimal GREEN. Provider normalization tests use deterministic websocket payloads. Transcript state uses pure Vitest domain tests. Persistence/lifecycle use repository/provider tests and Supabase/RLS verification where applicable. Browser E2E proves partial text is not treated as durable evidence, reconnect restores only finalized same-attempt turns, and finalization is retry-safe.

## Review Gates

Security review covers tenant/attempt isolation, RLS, transcript injection boundaries, raw capability leakage, post-seal writes, and reconnect leakage. Architecture review keeps provider schemas isolated and separates ephemeral UI state from durable authority. Performance review ensures bounded ephemeral state and indexed ordered transcript reads. Accessibility review ensures transcript/status UI has non-audio equivalents. AI-safety review verifies technical failures and unsupported inferences cannot become candidate evidence.