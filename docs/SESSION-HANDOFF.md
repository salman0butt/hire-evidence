# Session Handoff

This handoff never outranks actual Git/code/current exact-SHA CI. Recover `AGENTS.md`, `docs/AUTONOMOUS-DEVELOPMENT.md`, and live GitHub state first.

## Repository state

- Repository: `salman0butt/hire-evidence`
- Default branch: `main`
- Verified base/main SHA: `943e8a5c1dd45dc1652453ddf8ebc4ae31951925` (M04 PR #6 squash merge).
- Post-merge main CI: #517 / `34692492691` — GREEN full repository gate.
- Active branch: `feat/realtime-ai-interview`
- Active milestone: M05 — Realtime AI Interview.
- Draft milestone PR: create/reuse the single M05 PR after coherent durable activation state.
- Selected design: `docs/superpowers/specs/2026-09-12-realtime-ai-interview-design.md`.
- Selected plan: `docs/superpowers/plans/2026-09-12-realtime-ai-interview.md`.

## Current milestone

M05 — Realtime AI Interview is **ACTIVE**.

M05.1 reference characterization is verified. Talk Tutor is pinned at `69b6beee90c8dbd186730389f8a1462c2239fe61`; its ephemeral-token, generation-guard, Web Audio, queued-playback, interruption and teardown mechanics were characterized. The design explicitly rejects copying tutor-controlled prompt/configuration semantics into hiring: invitation capability, current consent, immutable interviewer version, authoritative plan/attempt state and hiring safety boundaries remain application-owned.

M05.2 session authorization/provider boundary is the exact next behavioral unit.

## Safety / architecture state

- Raw invitation tokens are capabilities and are never persisted/logged.
- Long-lived provider secrets remain server-only; browser credentials are short-lived/minimally scoped.
- Candidate speech/transcript is untrusted input and cannot change system policy, job criteria, plan order, follow-up limits, or assessment rules.
- Reconnect resumes the same authoritative attempt and cannot silently restart the plan.
- Technical/browser/provider/microphone failures never lower candidate evaluation or become negative evidence.
- M05 introduces no autonomous hire/reject decision, no candidate scoring, and no protected-trait/emotion/personality/deception/appearance/accent-quality inference.
- The application currently has no realtime provider SDK dependency; do not infer a provider solely because Talk Tutor uses one.

## Current evidence

- M04 merge SHA `943e8a5c1dd45dc1652453ddf8ebc4ae31951925` verified by CI #517 / `34692492691`.
- M05 design commit: `7dcbaac0fc84e1843e7867feb8f076c43dbebb3f`.
- M05 implementation-plan commit: `671ee4826df39cc45ed14463b1f8251dd5ce5982`.
- M05 ledger activation commit: `727779dca4eb579028244faba85f7a6c355ae5eb`.
- No M05 behavioral RED/GREEN exists yet. Never fabricate one.

## Exact next work

1. Recover active branch/PR/exact head and ensure no competing run advanced M05.
2. If no draft M05 PR exists, create it from `feat/realtime-ai-interview` to `main` and keep it draft.
3. Begin M05.2 with `src/lib/realtime/session-authorization.test.ts`.
4. RED must prove at minimum that an unusable invitation, missing current consent, missing immutable published interviewer version, or duplicate-attempt condition cannot mint a provider credential.
5. Verify the exact RED failure is intended and not lint/type/infrastructure noise.
6. Implement the minimum safe `authorizeRealtimeSession` + injected provider-token issuer/authoritative attempt boundary.
7. Verify GREEN on the exact new head, review security/YAGNI/safety, update durable evidence, and continue into M05.3.
