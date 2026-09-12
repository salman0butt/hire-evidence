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

## Current milestone state

M05.1 reference characterization is **VERIFIED**.

M05.2 session authorization/provider boundary is **ACTIVE / PARTIALLY VERIFIED**. Implemented work includes invitation/consent/version authorization, one-authoritative-attempt persistence, hashed capability repository behavior, constant-safe handler semantics, narrow attempt projection, and short-lived provider-token lifetime enforcement. Production provider-specific credential issuance/adapter composition remains unresolved because current requirements/source/dependencies do not select a realtime provider. Preserve the provider-neutral boundary rather than guessing a vendor.

M05.3 browser compatibility + microphone diagnostics is **ACTIVE**. Implemented work includes typed secure-context/media/getUserMedia/AudioContext/AudioWorklet/permission/input-count/network diagnostics, explicit microphone acquisition with immediate track cleanup, accessible status/recovery UI, candidate-page integration, offline fail-closed behavior, and selected-device acquisition support. Remaining acceptance: candidate-facing device enumeration/selection UX after explicit access, usable input-level readiness, and focused keyboard/narrow-viewport browser verification.

M05.4–M05.14 remain **NOT STARTED**.

## Safety / architecture state

- Raw invitation tokens are capabilities and are never persisted/logged.
- Long-lived provider secrets remain server-only; browser credentials must be short-lived/minimally scoped.
- Candidate speech/transcript is untrusted input and cannot change system policy, job criteria, plan order, follow-up limits, or assessment rules.
- Reconnect must resume the same authoritative attempt and cannot silently restart the plan.
- Technical/browser/provider/microphone failures never lower candidate evaluation or become negative evidence.
- M05 introduces no autonomous hire/reject decision, candidate score, protected-trait/emotion/personality/deception/appearance/accent-quality inference.
- No realtime provider SDK is authoritative yet; do not couple a provider merely because a reference project uses one.

## Current evidence

- M05.2 authorization RED: `89004863aaa8d5e456d7bed9c9cbd1e1d3f5e0e5`, CI #519 / `34693052261`.
- M05.2 persistence/security work ultimately passed complete repository gates, including `ac529449ab3a9ad8a87500700995445b66472f98`, CI #527 / `34693998554`, and later provider-neutral work at `c10a4a888454fe9c3612c869d8c6ba7b7b040cd6`, CI #543 / `34696198083`.
- M05.3 diagnostics RED: `c23a89c66d97c97f8a9be45e135bc8c1d0268950`, CI #544 / `34698263217`.
- M05.3 diagnostics GREEN: `e821c88beec11e76a990b621b57c833cee455e00`, CI #545 / `34698304817`.
- M05.3 accessible-UI RED: `100528c0fae1837ee214be8db82c1d6ae4c09cfa`, CI #547 / `34698666201`.
- Offline integration regression: `5630cb89d69bf379bfc77dd77157c0b32405ef24`, CI #560 / `34700605728` — typecheck caught missing `network-offline` UI copy and missing `isOnline` runtime input.
- Offline integration fix: `019ac11a6a3575d11af96b579964ec206a6f7da0`, CI #561 / `34700935235` — full repository gate GREEN.
- Selected-input RED: `1ac380e3b1a32b30cb6623ed13f74297b6865a02`, CI #562 / `34701284392` — intended TS2554 because the access verifier accepted one argument only.
- Selected-input GREEN: `2708322cd406eb3e2877295bfe25f495cff422c5`, CI #563 / `34701331592` — frozen install, lint, typecheck, unit/component, repository verifiers, local Supabase reset, build, Chromium E2E, PRD coverage and cleanup all GREEN.
- Documentation reconciliation commits after `2708322…` require fresh exact-head CI before a later readiness claim.

## Review state

- Critical findings: 0 unresolved for implemented M05 slices.
- Important findings: 0 unresolved for implemented M05 slices.
- PR #7 had no submitted reviews or unresolved review threads at last reconciliation.

## Exact next work

1. Recover PR #7 exact head and CI; newer GitHub state wins over this handoff.
2. Finish M05.3 with strict TDD for privacy-preserving audio-input enumeration and accessible candidate selection after explicit microphone access.
3. Re-check the selected input without implicit recording/permission requests and keep audio transient.
4. Add usable input-level readiness without turning signal quality into candidate evidence.
5. Add focused browser keyboard and narrow-viewport coverage, then perform security/accessibility/performance review and exact-head verification before marking M05.3 verified.
6. Keep M05.2 provider-specific issuance explicitly unresolved unless authoritative provider requirements appear.
