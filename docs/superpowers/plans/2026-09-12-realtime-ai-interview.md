# Realtime AI Interview Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Deliver a safe, stable, multi-turn realtime voice interview from the existing invitation flow through deterministic interview completion and bounded recovery.

**Architecture:** Keep invitation/consent/version/attempt authorization on the server; keep provider credentials short-lived; normalize provider events behind an app-owned transport boundary; isolate microphone capture and audio playback lifecycles; and make a deterministic interview-plan runner—not the model—the authority for question order, pacing, follow-ups, and completion.

**Tech Stack:** Next.js 16 App Router, React 19, TypeScript 5.9, Supabase/PostgreSQL, Vitest, Testing Library, Playwright, Web Audio API/AudioWorklet, provider SDK only after provider selection is justified by requirements.

**Spec:** `docs/superpowers/specs/2026-09-12-realtime-ai-interview-design.md`

## Global Constraints

- Candidate invitation capability, current consent, and immutable published interviewer version are mandatory before realtime authorization.
- Raw invitation tokens and long-lived provider secrets must not be persisted or logged.
- Candidate speech/transcript is untrusted data and cannot rewrite interview policy or plan.
- Technical failures must never lower candidate scores or become negative hiring evidence.
- M05 performs no autonomous hire/reject decision and introduces no protected-trait, emotion, personality, deception, appearance, accent-quality, or health inference.
- Reconnect resumes the same authoritative attempt and never silently resets the plan.
- Strict RED -> intended failure -> minimal GREEN -> refactor discipline applies to every behavioral task.

---

### Task 1: Characterize Reference Realtime Patterns

**Files:**
- Create: `docs/superpowers/specs/2026-09-12-realtime-ai-interview-design.md`
- Modify: `docs/milestones/M05-realtime-ai-interview.md`

**Interfaces:**
- Consumes: Talk Tutor pinned reference SHA `69b6beee90c8dbd186730389f8a1462c2239fe61` and M05 ledger.
- Produces: approved architecture/safety invariants and reuse/non-reuse decisions for every later task.

- [x] Inspect Talk Tutor server token issuance, connection state, Web Audio capture, output queue, interruption, transcript/provider normalization, and teardown.
- [x] Record reusable mechanics and explicit hiring-specific non-reuse rules.
- [ ] Mark M05.1 verified in the milestone ledger and point it to this spec/plan.

### Task 2: Server Realtime Session Authorization

**Files:**
- Create: `src/lib/realtime/session-authorization.test.ts`
- Create: `src/lib/realtime/session-authorization.ts`
- Create: `src/lib/realtime/provider-token.ts`
- Create: `src/app/api/interview/[token]/realtime-session/route.test.ts`
- Create: `src/app/api/interview/[token]/realtime-session/route.ts`
- Modify only if needed: candidate invitation/consent repository boundary and attempt persistence migration/repository.

**Interfaces:**
- Consumes: raw invitation token; existing server-side token hashing/resolution; current consent/start gate; immutable interviewer version.
- Produces: `authorizeRealtimeSession(rawToken, deps): Promise<RealtimeSessionAuthorization>` returning only safe immutable plan/session data and a short-lived provider credential.

- [ ] Write a failing test proving unavailable/revoked/expired/completed invitations, missing current consent, or missing published interviewer version cannot receive provider credentials.
- [ ] Run the focused Vitest test and verify the intended missing/incorrect authorization behavior is the RED cause.
- [ ] Add the minimal authorization service with injected `ProviderTokenIssuer`; never expose the long-lived provider secret.
- [ ] Add one-authoritative-attempt create/resume semantics and reject accidental duplicate attempts.
- [ ] Add route tests proving raw capability values are not returned or logged and error responses are constant-safe.
- [ ] Run focused tests, typecheck, and security review; commit GREEN.

### Task 3: Browser Compatibility and Microphone Diagnostics

**Files:**
- Create: `src/lib/realtime/diagnostics.test.ts`
- Create: `src/lib/realtime/diagnostics.ts`
- Create: `src/components/interview/realtime-diagnostics.test.tsx`
- Create: `src/components/interview/realtime-diagnostics.tsx`
- Modify: `src/app/interview/[token]/page.tsx`

**Interfaces:**
- Consumes: browser media/audio capabilities and candidate-selected input device.
- Produces: typed `RealtimeDiagnosticResult` with pass/fail/recoverable reason and accessible remediation copy.

- [ ] RED-test secure-context/media-device/permission/input/AudioContext/AudioWorklet failures and successful readiness.
- [ ] Verify each RED is a diagnostic behavior failure, not test infrastructure.
- [ ] Implement feature detection and microphone readiness without persisting audio.
- [ ] Render semantic status/error UI and device remediation without changing invitation validity.
- [ ] Verify focused component tests plus narrow-viewport/keyboard behavior; commit GREEN.

### Task 4: Deterministic Web Audio Capture

**Files:**
- Create: `src/lib/realtime/audio-capture.test.ts`
- Create: `src/lib/realtime/audio-capture.ts`
- Create: `public/worklets/interview-mic-processor.js`

**Interfaces:**
- Consumes: input device id and callbacks for PCM chunks/input level.
- Produces: `RealtimeAudioCapture` with `start`, `setMuted`, and idempotent `stop`.

- [ ] RED-test acquisition, mono capture, mute, stale-generation rejection, and repeated cleanup.
- [ ] Implement minimal stream/AudioContext/worklet lifecycle.
- [ ] Ensure stopped generations cannot emit/send new chunks.
- [ ] Verify tracks/nodes/contexts are closed once and input level resets; commit GREEN.

### Task 5: Provider-Neutral Realtime Transport

**Files:**
- Create: `src/lib/realtime/transport.test.ts`
- Create: `src/lib/realtime/transport.ts`
- Create provider adapter files only after the selected provider is justified by authoritative requirements.

**Interfaces:**
- Consumes: short-lived credential + immutable session config + PCM input.
- Produces: normalized events `open | audio | candidateSpeechStart | candidateSpeechEnd | modelTurn | interrupted | recoverableError | fatalError | close`.

- [ ] RED-test lifecycle ordering, audio send rejection before open/after close, stale callback rejection, and safe disconnect.
- [ ] Implement the app-owned transport interface and deterministic fake transport used by later tests.
- [ ] Implement the selected provider adapter without leaking provider payload types into domain modules.
- [ ] Verify provider/network errors normalize to typed technical errors; commit GREEN.

### Task 6: AI Audio Playback and Barge-In

**Files:**
- Create: `src/lib/realtime/audio-playback.test.ts`
- Create: `src/lib/realtime/audio-playback.ts`

**Interfaces:**
- Consumes: normalized provider audio chunks and interruption events.
- Produces: serialized playback, output-level callbacks, `interrupt`, and idempotent `stop`.

- [ ] RED-test sequential chunk playback, ended-source cleanup, queued-audio invalidation, and repeated stop.
- [ ] Implement a serialized queue with playback epoch and active source tracking.
- [ ] Verify `interrupt()` stops obsolete playback immediately without mutating interview-plan state.
- [ ] Run focused tests and resource-leak review; commit GREEN.

### Task 7: Explicit Connection State Machine

**Files:**
- Create: `src/lib/realtime/connection-machine.test.ts`
- Create: `src/lib/realtime/connection-machine.ts`
- Create: `src/components/interview/realtime-controls.test.tsx`
- Create: `src/components/interview/realtime-controls.tsx`

**Interfaces:**
- Consumes: diagnostics/authorization/transport/capture/playback events.
- Produces: authoritative connection state `idle | diagnosing | authorizing | connecting | connected | recovering | ended | error` plus subordinate listening/thinking/speaking presentation state.

- [ ] RED-test allowed and forbidden transitions, cancel/end behavior, stale-generation events, and accessible controls.
- [ ] Implement pure transition logic first, then controller integration.
- [ ] Add mute/end/retry controls with labels, pressed/disabled semantics, and live status text.
- [ ] Verify component and state-machine tests; commit GREEN.

### Task 8: Deterministic Interview-Plan Runner

**Files:**
- Create: `src/lib/realtime/plan-runner.test.ts`
- Create: `src/lib/realtime/plan-runner.ts`

**Interfaces:**
- Consumes: normalized immutable published plan and app-approved progression events.
- Produces: section/question cursor, required-question completion, follow-up allowance, and terminal completion state.

- [ ] RED-test exact section/question order, immutable plan enforcement, replay/idempotency, and model attempts to introduce unplanned questions.
- [ ] Implement pure deterministic transitions independent of provider/model payload format.
- [ ] Prove candidate text cannot modify plan metadata, criteria, or progression policy.
- [ ] Verify focused tests and AI-safety review; commit GREEN.

### Task 9: Pacing and Time Budget

**Files:**
- Create: `src/lib/realtime/pacing.test.ts`
- Create: `src/lib/realtime/pacing.ts`

**Interfaces:**
- Consumes: published duration, monotonic elapsed time, plan progress, required/optional follow-up state.
- Produces: remaining-time state and next pacing action.

- [ ] RED-test monotonic budget, clock discontinuity resistance, optional-follow-up suppression near deadline, and graceful completion.
- [ ] Implement pure pacing decisions without candidate-quality inference.
- [ ] Keep infrastructure downtime distinguishable from candidate speaking time where authoritative session state permits.
- [ ] Verify focused tests; commit GREEN.

### Task 10: Bounded Follow-Up Policy

**Files:**
- Create: `src/lib/realtime/follow-up-policy.test.ts`
- Create: `src/lib/realtime/follow-up-policy.ts`

**Interfaces:**
- Consumes: immutable question metadata, configured bound, current per-question count, model-requested follow-up category.
- Produces: allow/deny plus a bounded job-related follow-up instruction.

- [ ] RED-test neutral clarification/example/missing-dimension categories, configured bound, absolute safety ceiling, and prohibited criteria-changing follow-ups.
- [ ] Implement deterministic allow/deny rules.
- [ ] Reject follow-ups based on protected traits, emotion/personality/deception, accent quality, or transport quality.
- [ ] Verify adversarial prompt-injection tests; commit GREEN.

### Task 11: Realtime Interview Orchestrator

**Files:**
- Create: `src/lib/realtime/interview-session.test.ts`
- Create: `src/lib/realtime/interview-session.ts`
- Create: `src/components/interview/realtime-interview.test.tsx`
- Create: `src/components/interview/realtime-interview.tsx`
- Modify: `src/app/interview/[token]/page.tsx`

**Interfaces:**
- Consumes: authorization, diagnostics, capture, transport, playback, connection machine, plan runner, pacing, follow-up policy.
- Produces: one candidate-facing realtime session controller with explicit start/end/retry behavior.

- [ ] RED-test a successful multi-turn fake-transport interview and deterministic question progression.
- [ ] Implement minimal orchestration with generation-scoped callbacks.
- [ ] Wire barge-in to playback only and plan progression to explicit normalized turn-completion events.
- [ ] Verify candidate-visible text never exposes secrets/internal scoring configuration; commit GREEN.

### Task 12: Timeout and Error Recovery

**Files:**
- Create: `src/lib/realtime/recovery.test.ts`
- Create: `src/lib/realtime/recovery.ts`
- Modify: `src/lib/realtime/interview-session.ts`

**Interfaces:**
- Consumes: typed technical failure + retry history + session/attempt status.
- Produces: retry/recover/terminal-safe action and candidate-facing neutral reason.

- [ ] RED-test microphone loss, browser unsupported, provider close/error, credential expiry, send/decode failure, and interview timeout.
- [ ] Implement bounded retry classification; never retry terminal invitation/consent/authorization failures blindly.
- [ ] Prove every technical failure path avoids candidate penalty/evaluation mutation.
- [ ] Verify tests and security review; commit GREEN.

### Task 13: Reconnect Same Authoritative Attempt

**Files:**
- Create: `src/lib/realtime/reconnect.test.ts`
- Modify: `src/lib/realtime/session-authorization.ts`
- Modify: `src/lib/realtime/interview-session.ts`
- Modify persistence only where needed for authoritative resume cursor/session binding.

**Interfaces:**
- Consumes: existing attempt/session identity, last authoritative plan cursor, bounded retry state.
- Produces: resumed short-lived provider credential and same-attempt session state.

- [ ] RED-test same-attempt resume, duplicate-attempt denial, revoked/completed invitation denial, stale reconnect callback rejection, and exhausted retries.
- [ ] Implement server reauthorization/resume and browser recovery handoff.
- [ ] Verify reconnect cannot reset required questions or follow-up budgets.
- [ ] Run provider-backed integration tests where available; commit GREEN.

### Task 14: Full Realtime E2E and Milestone Closeout

**Files:**
- Create: `e2e/realtime-interview.spec.ts`
- Modify: `docs/milestones/M05-realtime-ai-interview.md`
- Modify: `docs/milestones/CURRENT.md`
- Modify: `docs/progress/STATUS.md`
- Modify: `docs/SESSION-HANDOFF.md`
- Modify: `docs/requirements/TRACEABILITY.md`
- Modify feature matrix / known issues as required by repository verifiers.

**Interfaces:**
- Consumes: complete M05 implementation.
- Produces: exact-SHA milestone verification and merge-ready durable state.

- [ ] Add deterministic browser scenarios for successful multi-turn completion, microphone denial/recovery, mute/end controls, barge-in, provider interruption, timeout, bounded reconnect, mobile/no-overflow, keyboard/status semantics, and unavailable/revoked/completed invitation safety.
- [ ] Run focused E2E and fix root causes using systematic debugging.
- [ ] Run full repository gate: `pnpm lint`, `pnpm typecheck`, `pnpm test`, `pnpm build`, `pnpm e2e`, framework verifier, requirements verifier, PRD coverage.
- [ ] Perform skeptical maintainer, security, architecture/YAGNI, performance, accessibility, and AI-safety review; resolve all Critical/Important findings.
- [ ] Reconcile ledger/status/traceability/known issues/handoff without fabricating RED/GREEN evidence.
- [ ] Push final head, verify GitHub Actions against that exact SHA, then execute the authorized milestone merge gate only if every gate passes.
