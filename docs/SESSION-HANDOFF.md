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
- Latest verified behavioral/browser head: `1c4635618aa1d3471284ca30cfb8658981afdd94`, CI #682 / `34734661625` — complete repository gate GREEN with 25 Chromium E2E tests.
- Durable documentation commits after that head require fresh exact-head CI before being treated as final branch verification.

## Current milestone state

M05.1 reference characterization — **VERIFIED**.

M05.2 session authorization/provider boundary — **ACTIVE / PARTIALLY VERIFIED**. Provider-neutral authorization/attempt boundaries are verified. Provider-specific credential issuance remains blocked because no authoritative realtime provider is selected/configured.

M05.3 browser compatibility + microphone diagnostics — **VERIFIED**.

M05.4 deterministic Web Audio capture — **VERIFIED**.

M05.5 provider-neutral realtime transport — **VERIFIED (provider-neutral scope)**. Provider-specific adapter remains blocked by provider selection.

M05.6 AI audio playback — **VERIFIED**.

M05.7 explicit connection state + accessible controls — **VERIFIED**.

M05.8 deterministic interview-plan runner — **VERIFIED**.

M05.9 pacing/time budget — **VERIFIED**.

M05.10 bounded follow-ups — **VERIFIED**.

M05.11 realtime orchestration — **ACTIVE / PARTIALLY VERIFIED**. Provider-neutral multi-turn progression, barge-in, stale callback rejection, candidate-safe snapshots, and presentation are verified. Production live composition is provider-blocked.

M05.12 timeout/error recovery — **VERIFIED (provider-neutral scope)**.

M05.13 same-attempt reconnect — **VERIFIED (provider-neutral scope)**. Server-authoritative resume checkpoints and progress RPCs are implemented. Runtime question completion waits for authoritative persistence, consumes the server checkpoint, rejects stale-generation results, and fails closed on conflicts, persistence rejection, or malformed checkpoints. Provider-backed reconnect integration remains blocked until provider selection.

M05.14 full realtime E2E / closeout — **ACTIVE / PARTIALLY VERIFIED**. A real candidate-page Playwright scenario now verifies mobile layout, keyboard focus, microphone denial, explicit retry recovery, enumerated microphone selection, and that readiness checks do not start recording. Stable provider-backed multi-turn voice completion remains unresolved.

## Current evidence

M05.14 browser checkpoints:
- `829d9d92c3f9b92d32944b54622436b1a54b63a5`, CI #681 / `34734365068` — **NOT GREEN**. The intended denial UI rendered and 24 existing E2E tests passed, but a generic `role=alert` locator also matched Next.js's route announcer.
- `1c4635618aa1d3471284ca30cfb8658981afdd94`, CI #682 / `34734661625` — GREEN after the locator was scoped to the technical-check alert; full repository gate passed, including 480 unit/component tests and 25 Chromium E2E tests.

Recent M05.13 checkpoints:
- runtime persistence RED: `f3b01a0e1f3f9ca17cf5058aea73816f6e639d49`, CI #671 / `34732962547` — missing orchestration persistence boundary.
- implementation checkpoint: `cff7cc7e0c3c5ce0db27319bc4728811c7a1f53c` — local progress waits for persistence and consumes authoritative state.
- fail-closed review RED: `a0fcda2590020b4bd574dcd342a3aec308e34300`, CI #673 / `34733342412` — malformed server checkpoint threw instead of preserving local state.
- reviewed GREEN: `5e9328d2f945cd10eaecea312896f29fbc93b10e`, CI #674 / `34733465242` — full repository gate GREEN after invalid persisted checkpoints were made fail-closed.

## Review state

- Critical findings: 0 unresolved for implemented M05 slices.
- Important findings: 0 unresolved for verified provider-neutral slices through the latest M05.14 browser slice.
- PR #7 had no unresolved review threads at the latest recovery check.
- The CI #681 browser failure was a test-locator defect, not a production defect; systematic debugging identified and corrected it.

## Safety / architecture state

- Raw invitation tokens remain capabilities and are never persisted/logged.
- Long-lived provider secrets remain server-only; browser credentials must be short-lived/minimally scoped.
- Candidate speech/transcript is untrusted input and cannot change system policy, job criteria, plan order, follow-up limits, or assessment rules.
- Reconnect resumes the same authoritative attempt and cannot silently restart/reset required progress.
- Technical/browser/provider/microphone failures never lower candidate evaluation or become negative evidence.
- M05 introduces no autonomous hire/reject decision, candidate score, protected-trait/emotion/personality/deception/appearance/accent-quality inference.
- No realtime provider SDK is authoritative yet; do not choose one merely to unblock the milestone.

## Exact next work

1. Recover PR #7 exact remote head and exact-head CI; newer GitHub state wins over this handoff.
2. Verify the latest documentation head with the complete CI gate.
3. Continue M05.14 with the next real deterministic browser/E2E scenario that does not require fabricated provider coupling.
4. Keep PR #7 draft/unmerged while provider-specific authorization/adapter/live page/reconnect and the stable live multi-turn exit criterion remain blocked by the missing authoritative provider decision/configuration.
