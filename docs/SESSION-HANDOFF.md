# Session Handoff

This handoff never outranks actual Git/code/current exact-SHA CI. Recover `AGENTS.md`, `CODEX-START-HERE.md`, `docs/AUTONOMOUS-DEVELOPMENT.md`, and live GitHub state first.

## Repository state

- Repository: `salman0butt/hire-evidence`
- Default branch: `main`
- Verified base/main SHA: `943e8a5c1dd45dc1652453ddf8ebc4ae31951925` (Candidates + Invitations PR #6 squash merge).
- Base post-merge main CI: #517 / `34692492691` — GREEN full repository gate.
- Active branch: `feat/realtime-ai-interview`
- Active milestone: M05 — Realtime AI Interview.
- Active draft milestone PR: #7 — `Build realtime AI interview`.
- Selected design: `docs/superpowers/specs/2026-09-12-realtime-ai-interview-design.md`.
- Selected plan: `docs/superpowers/plans/2026-09-12-realtime-ai-interview.md`.
- Latest verified behavioral head: `9982d75f02fb6911162d60cec98581441ecf704b`, CI #603 / `34710723994` — complete repository gate GREEN.

## Current milestone state

M05.1 reference characterization is **VERIFIED**.

M05.2 session authorization/provider boundary is **ACTIVE / PARTIALLY VERIFIED**. Invitation/consent/version authorization, one-authoritative-attempt persistence, hashed capability repository behavior, constant-safe handler semantics, narrow attempt projection, and short-lived provider-token lifetime enforcement exist. Provider-specific credential issuance/adapter composition remains unresolved because authoritative requirements do not select a realtime provider.

M05.3 browser compatibility + microphone diagnostics is **VERIFIED**. Implemented and verified behavior includes typed browser/network/media diagnostics, explicit microphone acquisition and immediate cleanup, privacy-preserving post-access audio-input enumeration, candidate-selected input checks, usable input-level readiness, accessible status/recovery UI, candidate-page integration, focusable keyboard controls, and existing 390px candidate browser no-overflow coverage. Diagnostic audio stays transient and is not candidate evidence.

M05.4 deterministic Web Audio capture is **VERIFIED**. Selected mono input acquisition, AudioWorklet PCM callbacks, mute, generation-scoped stale callback rejection, idempotent stop, one-time resource cleanup, and visible input-level reset are covered.

M05.5 provider-neutral realtime transport is **ACTIVE / NEXT**. Build the app-owned normalized transport interface and deterministic fake transport under strict TDD. Provider adapter creation remains blocked until authoritative provider selection/configuration exists.

M05.6–M05.14 remain **NOT STARTED**.

## Safety / architecture state

- Raw invitation tokens are capabilities and are never persisted/logged.
- Long-lived provider secrets remain server-only; browser credentials must be short-lived/minimally scoped.
- Candidate speech/transcript is untrusted input and cannot change system policy, job criteria, plan order, follow-up limits, or assessment rules.
- Reconnect must resume the same authoritative attempt and cannot silently restart the plan.
- Technical/browser/provider/microphone failures never lower candidate evaluation or become negative evidence.
- M05 introduces no autonomous hire/reject decision, candidate score, protected-trait/emotion/personality/deception/appearance/accent-quality inference.
- No realtime provider SDK is authoritative yet; do not couple a provider merely because a reference project uses one.

## Current evidence

Earlier M05.2/M05.3 RED/GREEN checkpoints are retained in `docs/milestones/M05-realtime-ai-interview.md`.

Latest checkpoints:
- M05.4 invalid NOT RED: `cae05ed76eca9547863087aa0ee9e4721c0a59c4`, CI #599 / `34710015886` — test typing failure; not behavioral RED.
- M05.4 RED: `7b39f6be82982bc6b1e9f677d8b1c640ef06058e`, CI #600 / `34710078998` — intended input-level reset assertion failed after lint/typecheck passed.
- M05.4 GREEN: `4b5260bc1dfd4b4e726784d306562e60b12b814c`, CI #601 / `34710176595` — full repository gate GREEN.
- Capture regression coverage: `3cb6776411e345bb1f7bf8ccc078f23cac6ea389`, CI #602 / `34710451680` — mute, stale callback rejection, idempotent resource cleanup; full gate GREEN.
- M05.3 keyboard closeout: `9982d75f02fb6911162d60cec98581441ecf704b`, CI #603 / `34710723994` — complete repository gate GREEN.

## Review state

- Critical findings: 0 unresolved for implemented M05 slices.
- Important findings: 0 unresolved for implemented M05 slices.
- PR #7 had no unresolved review threads at the latest recovery check.
- Task 4 review found no Critical/Important cleanup, stale-generation, mute, resource-lifecycle, safety, or evidence-integrity issue.

## Exact next work

1. Recover PR #7 exact remote head and exact-SHA CI; newer GitHub state wins over this handoff.
2. Begin M05.5 with a failing `src/lib/realtime/transport.test.ts` covering lifecycle ordering, send rejection before open and after close, stale-generation callback rejection, normalized technical errors, and idempotent/safe disconnect.
3. Implement only the app-owned provider-neutral transport boundary plus deterministic fake transport required by later tests.
4. Do not create or guess a provider adapter while provider selection/configuration is not authoritative.
5. Review, verify exact-head CI, update durable docs, then continue automatically to the next safe M05 unit.
