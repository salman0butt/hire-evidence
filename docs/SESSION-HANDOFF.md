# Session Handoff

This handoff never outranks actual Git/code/current exact-SHA CI. Recover `AGENTS.md`, `docs/AUTONOMOUS-DEVELOPMENT.md`, and live GitHub state first.

## Repository state

- Repository: `salman0butt/hire-evidence`
- Default branch: `main`
- Verified base/main SHA: `943e8a5c1dd45dc1652453ddf8ebc4ae31951925` (Candidates + Invitations PR #6 squash merge).
- Post-merge main CI: #517 / `34692492691` — GREEN full repository gate.
- Active branch: `feat/realtime-ai-interview`
- Active milestone: M05 — Realtime AI Interview.
- Active draft milestone PR: #7 — `Build realtime AI interview`.
- Selected design: `docs/superpowers/specs/2026-09-12-realtime-ai-interview-design.md`.
- Selected plan: `docs/superpowers/plans/2026-09-12-realtime-ai-interview.md`.

## Current milestone

M05 — Realtime AI Interview is **ACTIVE**.

M05.1 reference characterization is **VERIFIED**. Talk Tutor is pinned at `69b6beee90c8dbd186730389f8a1462c2239fe61`; reusable ephemeral-token, generation-guard, Web Audio, queued-playback, interruption and teardown mechanics plus hiring-specific non-reuse rules are durable in the selected design.

M05.2 session authorization/provider boundary is **ACTIVE**. The domain authorization module and authoritative attempt persistence/RPC are implemented. The persistence layer creates/resumes one invitation-bound attempt, checks usable invitation state, current `candidate-interview-v1` consent and immutable interviewer version, atomically advances the invitation to `started`, stores no raw capability token, leaves the attempt table inaccessible to browser roles, and returns only the opaque attempt UUID. The public API route and short-lived provider-token issuer remain unfinished.

M05.3–M05.14 have not started.

## Safety / architecture state

- Raw invitation tokens are capabilities and are never persisted/logged.
- Long-lived provider secrets remain server-only; browser credentials must be short-lived/minimally scoped.
- Candidate speech/transcript is untrusted input and cannot change system policy, job criteria, plan order, follow-up limits, or assessment rules.
- Reconnect resumes the same authoritative attempt and cannot silently restart the plan.
- Technical/browser/provider/microphone failures never lower candidate evaluation or become negative evidence.
- M05 introduces no autonomous hire/reject decision, candidate score, or protected-trait/emotion/personality/deception/appearance/accent-quality inference.
- No realtime provider SDK is currently present. Do not select/couple a provider merely because the Talk Tutor reference uses one; preserve the provider-neutral boundary until authoritative requirements justify selection.

## Current evidence

- M04 merge SHA `943e8a5c1dd45dc1652453ddf8ebc4ae31951925` verified by CI #517 / `34692492691`.
- M05 design commit: `7dcbaac0fc84e1843e7867feb8f076c43dbebb3f`.
- M05 implementation-plan commit: `671ee4826df39cc45ed14463b1f8251dd5ce5982`.
- M05.2 authorization RED: `89004863aaa8d5e456d7bed9c9cbd1e1d3f5e0e5`, CI #519 / `34693052261`.
- M05.2 persistence RED: `02ed8e228cfd67ee24f6deb1badab4169beb1e6e`, CI #524 / `34693510005` — intended missing migration failure.
- M05.2 persistence implementation: `0239ce3054856012b9630ebdcfb5127f5b5509c2`.
- M05.2 security-review RED: `17de3f6f93c25037dbcb9aaa1395a9c623ea9fe0`, CI #526 / `34693860526` — exactly one new test failed because the RPC returned the full attempt row.
- M05.2 security GREEN: `ac529449ab3a9ad8a87500700995445b66472f98`, CI #527 / `34693998554` — complete repository gate GREEN, including local Supabase migrations, build, Chromium E2E and PRD coverage.
- Security re-review: 0 unresolved Critical / 0 unresolved Important findings for the implemented persistence slice.
- Documentation commits after `ac529449…` create a newer head and therefore require fresh exact-head CI before any readiness claim.

## Exact next work

1. Recover PR #7 exact head and CI; do not trust this handoff if GitHub has advanced.
2. Continue M05.2, not M05.3.
3. With strict TDD, add the public `POST /api/interview/[token]/realtime-session` contract: constant-safe unavailable/error response, no raw capability echo/logging, and a narrow successful session projection only.
4. Implement the provider-neutral server repository/authorization wiring needed by that route without exposing attempt rows or internal assessment data.
5. Add the injected short-lived provider-token issuer boundary. Do not choose a provider SDK absent authoritative justification; if provider-specific issuance cannot yet be implemented, keep that dependency explicit and M05.2 ACTIVE rather than fabricating a provider.
6. Run focused tests/typecheck/security review and exact-head CI; update durable evidence.
7. Only mark M05.2 verified and advance to browser diagnostics after the real server/API/provider credential boundary is complete and green.
