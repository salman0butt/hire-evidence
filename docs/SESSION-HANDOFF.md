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
- Latest verified behavioral head: `a184da9ec54aa317fa42c600591be422676797d1`, CI #623 / `34722042401` — complete repository gate GREEN.

## Current milestone state

M05.1 reference characterization is **VERIFIED**.

M05.2 session authorization/provider boundary is **ACTIVE / PARTIALLY VERIFIED**. Provider-neutral authorization/attempt boundaries are verified. Provider-specific credential issuance remains blocked because no authoritative realtime provider is selected/configured.

M05.3 browser compatibility + microphone diagnostics is **VERIFIED**.

M05.4 deterministic Web Audio capture is **VERIFIED**.

M05.5 provider-neutral realtime transport is **VERIFIED (provider-neutral scope)**. Normalized lifecycle, open-only PCM send, stale callback rejection, typed technical errors, idempotent disconnect, and deterministic fake transport are implemented. Provider-specific adapter work remains blocked by provider selection.

M05.6 AI audio playback is **VERIFIED**. Serialized PCM output, bounded lifecycle cleanup, output level, interruption epoch/queue invalidation, stale ended-callback rejection, copied chunk ownership, and idempotent stop are covered.

M05.7 explicit connection state + accessible controls is **VERIFIED**. State is application-owned; stale generation events are ignored; terminal authorization failures do not blindly retry; recoverable failures enter explicit recovery; mute/end/retry controls expose accessible state and status semantics.

M05.8 deterministic interview-plan runner is **VERIFIED**. The runner snapshots the published plan, advances only by current section/question cursor, rejects replay/out-of-order events, bounds follow-up consumption, and authorizes only the current question. Candidate/model input cannot rewrite plan metadata or order through this boundary.

M05.9 pacing/time budget is **NEXT**. M05.10–M05.14 are **NOT STARTED**.

## Safety / architecture state

- Raw invitation tokens are capabilities and are never persisted/logged.
- Long-lived provider secrets remain server-only; browser credentials must be short-lived/minimally scoped.
- Candidate speech/transcript is untrusted input and cannot change system policy, job criteria, plan order, follow-up limits, or assessment rules.
- Reconnect must resume the same authoritative attempt and cannot silently restart the plan.
- Technical/browser/provider/microphone failures never lower candidate evaluation or become negative evidence.
- M05 introduces no autonomous hire/reject decision, candidate score, protected-trait/emotion/personality/deception/appearance/accent-quality inference.
- No realtime provider SDK is authoritative yet; do not couple a provider merely because a reference project uses one.

## Current evidence

Earlier M05.2–M05.6 checkpoints are retained in `docs/milestones/M05-realtime-ai-interview.md`.

Latest checkpoints:
- M05.7 connection RED: `15f887e62d628965a01b7f58363fb63d50b339e0`, CI #616 / `34719618954` — required state-machine behavior absent.
- M05.7 implementation `ef4718a28d0a88dcdcdb59098c3630a3a028df3e`, CI #617 / `34719712700` was cancelled by the next head and is not final GREEN evidence.
- M05.7 accessible-controls RED: `2faa12fca7d0f39a5b411259286f54a11176d5d1`, CI #618 / `34719805392` — missing realtime-controls component.
- M05.7 GREEN: `6a440ccd0233b2083c47f3ec9991b897487dbad6`, CI #619 / `34720013611` — complete repository gate GREEN.
- M05.8 initial RED: `1ef658fabd7ca8b8c29921661c9e2f42001a0c16`, CI #620 / `34721584894` — missing plan-runner module.
- M05.8 initial GREEN: `0fab34a4a61dd4d8c91c1ca80e1055905bf2e6f9`, CI #621 / `34721656385` — complete repository gate GREEN.
- M05.8 review RED: `a3224b943c5b4613c58b54e0ca3953d97285975f`, CI #622 / `34721926133` — future planned question incorrectly authorized while an earlier question was current.
- M05.8 reviewed GREEN: `a184da9ec54aa317fa42c600591be422676797d1`, CI #623 / `34722042401` — current-question-only authority; complete repository gate GREEN.

## Review state

- Critical findings: 0 unresolved for implemented M05 slices.
- Important findings: 0 unresolved for implemented M05 slices.
- PR #7 had no unresolved review threads at the latest recovery check.
- M05.8's Important future-question authority issue is fixed and regression-tested.

## Exact next work

1. Recover PR #7 exact remote head and exact-SHA CI; newer GitHub state wins over this handoff.
2. Begin M05.9 with a failing `src/lib/realtime/pacing.test.ts` covering monotonic elapsed-time accounting, backwards/discontinuous clock resistance, optional-follow-up suppression near deadline, graceful completion, and infrastructure-downtime treatment.
3. Implement pure pacing decisions with no candidate-quality inference.
4. Review, verify exact-head CI, update durable docs, then continue automatically to M05.10.
