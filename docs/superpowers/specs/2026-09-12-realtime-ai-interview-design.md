# Realtime AI Interview Design

## Goal

Deliver M05 as a stable multi-turn voice interview that is authorized by the existing candidate invitation capability, bound to the immutable published interviewer version, resilient to browser/provider failures, and unable to turn technical failure or candidate prompt injection into hiring evidence.

## Source of Truth

- Milestone: `docs/milestones/M05-realtime-ai-interview.md`
- Candidate capability boundary: `src/lib/candidates/public-invitation.ts`
- Candidate route: `src/app/interview/[token]/`
- Published interviewer configuration from M03
- Candidate consent/start gates from M04
- Reference implementation characterized from `salman0butt/talk-tutor` at `69b6beee90c8dbd186730389f8a1462c2239fe61`

## M05.1 Reference Characterization

### Reuse or adapt from Talk Tutor

1. Server-minted, short-lived provider credentials. Long-lived provider secrets remain server-only.
2. Explicit connection lifecycle rather than inferring state from UI events.
3. Generation/attempt guards so stale async callbacks cannot mutate the current session.
4. `getUserMedia` microphone acquisition with deterministic cleanup.
5. AudioWorklet-based input capture when supported, with input-device selection and mute semantics.
6. Provider event normalization into app-owned events.
7. Serialized output-audio playback with an interruption epoch so barge-in can stop obsolete queued audio.
8. Resource cleanup that is idempotent across normal end, cancellation, provider close, reconnect, and error paths.
9. Separate browser controls/status from provider transport details.

### Do not copy as-is

1. Talk Tutor's learner-selected topic, persona, correction mode, and practice configuration. Hire Evidence must use the immutable published interviewer version already bound to the invitation.
2. Provider or generic `agentState` as the authority for interview-plan progression. Plan progression is deterministic application state.
3. Learning-session feedback semantics. M05 does not score candidates and must not infer hiring evidence from transport or audio quality.
4. Billing-session authorization. Hire Evidence authorization is invitation-capability + invitation lifecycle + current disclosure consent + immutable interviewer version + authoritative attempt binding.
5. Tutor prompt flexibility. Candidate utterances are untrusted interview content and cannot rewrite system policy, job requirements, question order, follow-up bounds, safety rules, or assessment criteria.
6. Any behavior where connection quality, silence caused by infrastructure, microphone failure, accent, prosody, emotion, appearance, or protected traits could become candidate performance evidence.

## Safety Invariants

- Humans remain the hiring decision makers.
- M05 creates no autonomous hire/reject decision and no candidate score.
- Technical failures, reconnects, dropped audio, provider errors, microphone errors, and timeout caused by infrastructure must never lower candidate evaluation.
- Do not infer emotion, personality, deception, protected traits, disability, health, ethnicity, age, gender, religion, accent quality, or appearance.
- Candidate speech and transcript text are untrusted data. They never become system instructions.
- Only the invitation-bound published interviewer version may define the interview plan.
- Raw invitation tokens are capabilities: do not persist or log them. Hash server-side at the existing boundary.
- Provider credentials are short-lived, minimally scoped, single-session where supported, and never persisted in browser storage.
- Reconnect resumes the same authoritative attempt; it must not silently create a second attempt or reset the interview plan.

## Architecture

### 1. Session authorization boundary

Add a server-owned realtime-session authorization service and route behind the public invitation capability. The service must resolve the raw token server-side, require an invitation that is eligible to start or resume, require the current disclosure consent, load the invitation-bound immutable interviewer version, and create/reuse one authoritative interview attempt. Only then may it mint a short-lived provider credential.

The browser receives a narrow response such as an attempt/session identifier, credential, credential expiry, duration, language, and normalized immutable interview plan. Candidate PII and internal assessment configuration not required to run the interview stay server-side.

Provider-specific token minting lives behind a narrow server interface so domain authorization can be tested without network/provider access. The repository currently has no realtime provider SDK dependency, so provider selection and SDK introduction must be justified by authoritative requirements before coupling the domain to one vendor.

### 2. Browser diagnostics

Before authorization/connect, run explicit capability diagnostics: secure context, media-device support, microphone permission/acquisition, selected audio-input availability, usable input level, AudioContext/AudioWorklet support, and browser/network readiness that can be measured without sending candidate content.

Diagnostics produce actionable, accessible states. Failure keeps the invitation usable and cannot create negative candidate evidence.

### 3. Audio input lifecycle

Own microphone stream, AudioContext, source node, worklet node, mute state, and teardown in a focused capture module. Acquisition and teardown are idempotent. Stale connection generations cannot send audio after disconnect/reconnect.

### 4. Provider transport

Use a small app-owned transport contract for connect, audio input, normalized server events, errors, close, and disconnect. Provider payloads must not leak through the rest of the application. Provider callbacks are tagged to the active generation/attempt.

### 5. Audio output and barge-in

Queue decoded AI audio deterministically. Track an output epoch and active sources. Candidate speech interruption invalidates obsolete queued playback immediately without changing authoritative interview-plan state. Playback cleanup is safe when sources are already ended or disconnected.

### 6. Connection state machine

Application-owned states:

`idle -> diagnosing -> authorizing -> connecting -> connected -> recovering -> ended`

Any active state may move to `error`; recoverable transport failures may move from `connected` to `recovering` and back to `connecting/connected`. Terminal invitation/authorization failures do not retry blindly. UI presentation states such as listening/thinking/speaking are subordinate indicators, not plan authority.

### 7. Deterministic interview-plan runner

The runner consumes only the immutable normalized published plan. It owns section/question index, completed questions, remaining time, follow-up budget, and completion. Provider model output cannot append, remove, reorder, or redefine plan items.

Candidate utterances may inform whether an allowed follow-up is needed, but any follow-up must fit a fixed job-related category: neutral clarification, request for concrete example, or request for a missing job-related dimension. The configured bound and an application absolute ceiling prevent loops.

### 8. Pacing and timeout

Track a monotonic interview time budget derived from the published duration. Pacing may shorten or skip optional follow-ups to finish the immutable core plan, but it must not silently omit required questions unless the authoritative plan explicitly permits it. Expiration ends gracefully and records a technical/session outcome separately from candidate evidence.

### 9. Reconnect and recovery

Reconnect is bounded and generation-safe. The server reauthorizes against the same invitation and attempt, rejects completed/revoked/expired capabilities as appropriate, and returns the authoritative resume state. Browser retry counters and backoff are bounded. If recovery is exhausted, the candidate receives a neutral resumable/support state; no performance penalty is created.

## Data and Trust Boundaries

- Browser: microphone samples, transient provider credential, UI/realtime state. No long-lived provider secret.
- Server: invitation capability validation, consent/start gate, immutable version resolution, authoritative attempt identity, provider credential minting.
- Provider: receives only data necessary for the live interview and an application-authored system contract derived from the immutable plan.
- Database: authoritative invitation/version/attempt/session state. Transport events and technical errors are distinct from later candidate evidence/transcript records.

## Testing Strategy

Each behavioral unit follows RED -> verified intended failure -> minimal GREEN -> refactor while green. Provider-independent domain modules use Vitest. Server authorization is tested with injected provider-token issuer and invitation/attempt repositories before any live-provider integration. Browser diagnostics/audio lifecycle use focused DOM/Web Audio mocks plus Playwright coverage for real browser permission/error UI. Realtime transport uses deterministic fake transport fixtures for interruption/reconnect/error sequences. The milestone closes only after stable multi-turn E2E covers success, barge-in, timeout, microphone denial, provider disconnect, bounded reconnect, and safe terminal failure.

## Review Gates

Security review covers capability leakage, provider secrets, session replay, attempt duplication, prompt injection, tenant/version binding, and logging. Accessibility review covers keyboard control, status semantics, error recovery, device selection, mute/end controls, and non-audio status text. Performance review covers bounded queues, worklet lifecycle, resource cleanup, retry limits, and no unbounded transcript/event accumulation. AI-safety review confirms the model cannot redefine interview criteria or convert technical failure into candidate performance evidence.
