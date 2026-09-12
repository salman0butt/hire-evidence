# M05 — Realtime AI Interview

Status: **ACTIVE**

## Goal
Deliver a stable, safe, evidence-backed multi-turn realtime voice interview from the existing invitation flow through deterministic interview completion and bounded recovery.

## Authoritative PRD Milestone Definition

# 200. MILESTONE 05 — REALTIME AI INTERVIEW

This milestone may reuse patterns from Talk Tutor.

Deliver:

```text
microphone diagnostics
realtime AI connection
voice interviewer
interview plan execution
question pacing
bounded follow-ups
barge-in
connection state
timeout
error recovery
```

Characterization + TDD.

Exit:

candidate can complete stable multi-turn voice interview.

## Dependencies
Candidates + Invitations; published Interviewer Builder configuration.

## In Scope
The authoritative definition plus M05.1–M05.14 from the selected implementation plan.

## Out of Scope
Later milestones, autonomous hiring decisions, protected-trait/emotion/personality/deception/appearance/accent-quality inference, fabricated candidate evidence, and provider coupling not justified by authoritative requirements.

## Architecture Notes
Server-authorized realtime setup; short-lived provider credentials; provider-neutral boundaries until a provider is authoritative; explicit browser diagnostics; deterministic audio capture/playback lifecycles; app-owned connection state; immutable interview-plan runner; monotonic pacing; bounded job-related follow-ups; same-attempt reconnect. Candidate speech is untrusted data. Technical failures never lower candidate evaluation.

## Selected Design / Implementation Plan
- Design: `docs/superpowers/specs/2026-09-12-realtime-ai-interview-design.md`
- Plan: `docs/superpowers/plans/2026-09-12-realtime-ai-interview.md`
- Talk Tutor reference: `69b6beee90c8dbd186730389f8a1462c2239fe61`.

## Acceptance Criteria
- PRD deliverables and stable multi-turn exit criterion pass.
- Every M05 iteration is complete or explicitly resolved with evidence.
- Required security/privacy/tenancy/accessibility/performance/AI-safety gates pass.
- Technical failures cannot become negative candidate evidence.
- Candidate content cannot rewrite policy, criteria, plan order, or follow-up bounds.
- 0 unresolved Critical or Important findings.
- Traceability/feature/status/handoff state matches actual Git/code/tests/CI.
- Exact-final-head CI is green before authorized milestone merge.

## Tasks / Iterations
1. **VERIFIED** — M05.1 Reference characterization.
2. **ACTIVE / PARTIALLY VERIFIED** — M05.2 Session authorization/provider boundary. Authorization, authoritative attempt persistence, narrow repository/handler behavior, and token lifetime rules exist. Provider-specific production issuance remains blocked on authoritative provider selection/configuration.
3. **VERIFIED** — M05.3 Browser compatibility + microphone diagnostics. Capability/network/permission/input diagnostics, explicit microphone acquisition/cleanup, privacy-preserving audio-input enumeration/selection, selected-device checks, usable input-level readiness, accessible recovery UI, candidate-page integration, keyboard-focus semantics, and narrow-viewport/no-overflow browser coverage are present.
4. **VERIFIED** — M05.4 Deterministic Web Audio capture. Selected mono acquisition, AudioWorklet PCM flow, mute, generation-scoped stale callback rejection, idempotent stop, one-time resource cleanup, and input-level reset are covered.
5. **ACTIVE / NEXT** — M05.5 Provider-neutral realtime transport. Implement the app-owned normalized transport interface and deterministic fake transport. Provider-specific adapter work remains blocked until authoritative provider selection/configuration exists.
6. **NOT STARTED** — M05.6 AI audio playback.
7. **NOT STARTED** — M05.7 Explicit connection state machine.
8. **NOT STARTED** — M05.8 Deterministic interview-plan runner.
9. **NOT STARTED** — M05.9 Pacing/time budget.
10. **NOT STARTED** — M05.10 Bounded follow-up policy.
11. **NOT STARTED** — M05.11 Realtime interview orchestrator/barge-in integration.
12. **NOT STARTED** — M05.12 Timeout/error recovery.
13. **NOT STARTED** — M05.13 Same-authoritative-attempt reconnect.
14. **NOT STARTED** — M05.14 Full realtime E2E and closeout.

## TDD Evidence
- M05.2 authorization RED: `89004863aaa8d5e456d7bed9c9cbd1e1d3f5e0e5`, CI #519 / `34693052261`.
- M05.2 persistence RED: `02ed8e228cfd67ee24f6deb1badab4169beb1e6e`, CI #524 / `34693510005`.
- M05.2 security-review RED: `17de3f6f93c25037dbcb9aaa1395a9c623ea9fe0`, CI #526 / `34693860526`.
- M05.2 security GREEN: `ac529449ab3a9ad8a87500700995445b66472f98`, CI #527 / `34693998554`.
- Later provider-neutral M05.2 work: `c10a4a888454fe9c3612c869d8c6ba7b7b040cd6`, CI #543 / `34696198083` GREEN.
- M05.3 capability diagnostics RED: `c23a89c66d97c97f8a9be45e135bc8c1d0268950`, CI #544 / `34698263217`.
- M05.3 capability diagnostics GREEN: `e821c88beec11e76a990b621b57c833cee455e00`, CI #545 / `34698304817`.
- M05.3 accessible UI RED: `100528c0fae1837ee214be8db82c1d6ae4c09cfa`, CI #547 / `34698666201`.
- Offline integration regression: `5630cb89d69bf379bfc77dd77157c0b32405ef24`, CI #560 / `34700605728`; typecheck correctly caught missing `network-offline` UI handling and missing `isOnline` capability input.
- Offline integration GREEN: `019ac11a6a3575d11af96b579964ec206a6f7da0`, CI #561 / `34700935235` — complete repository gate GREEN.
- Selected-input RED: `1ac380e3b1a32b30cb6623ed13f74297b6865a02`, CI #562 / `34701284392`; intended TS2554 because `verifyRealtimeMicrophoneAccess` accepted only one argument.
- Selected-input GREEN: `2708322cd406eb3e2877295bfe25f495cff422c5`, CI #563 / `34701331592` — complete repository gate GREEN.
- M05.4 invalid NOT RED: `cae05ed76eca9547863087aa0ee9e4721c0a59c4`, CI #599 / `34710015886` — a test-harness type mismatch prevented the intended behavioral assertion from running.
- M05.4 cleanup RED: `7b39f6be82982bc6b1e9f677d8b1c640ef06058e`, CI #600 / `34710078998` — lint/typecheck passed and unit tests failed on the intended input-level reset assertion after `AudioContext.close()` rejection.
- M05.4 cleanup GREEN: `4b5260bc1dfd4b4e726784d306562e60b12b814c`, CI #601 / `34710176595` — complete repository gate GREEN.
- M05.4 regression coverage: `3cb6776411e345bb1f7bf8ccc078f23cac6ea389`, CI #602 / `34710451680` — mute, stale callbacks, repeated stop/resource release; complete repository gate GREEN.
- M05.3 keyboard closeout/current verified behavioral head: `9982d75f02fb6911162d60cec98581441ecf704b`, CI #603 / `34710723994` — complete repository gate GREEN.

## Integration Test Evidence
M05 attempt persistence migrations have applied successfully in provider-backed CI. Current verified behavioral head `9982d75…` passed local Supabase reset/migrations, production build, existing Chromium E2E, and PRD coverage in CI #603. Milestone-specific realtime-provider integration and full interview E2E remain pending by design.

## E2E / Visual Verification
The existing candidate invitation browser scenario runs at a 390×844 viewport and verifies no horizontal overflow. M05.3 also has focused component coverage proving the explicit technical-check trigger can receive keyboard focus. CI #603 passed the complete Chromium E2E suite. M05.14 will still add successful multi-turn completion, microphone denial/recovery, mute/end, barge-in, provider interruption, timeout, bounded reconnect, realtime status semantics, and unavailable/revoked/completed invitation safety.

## Security Review
Implemented M05.2 work gates realtime authorization on invitation capability, current consent, immutable published interviewer version, and one authoritative attempt; raw invitation/provider secrets are not persisted. Earlier full-row anonymous-capable RPC exposure was corrected to return only an opaque attempt UUID. M05.3 keeps diagnostic audio transient, releases acquired tracks immediately, and treats selected device IDs only as browser-local technical inputs. M05.4 keeps captured PCM transient at the capture boundary and rejects stale generations from emitting new chunks.

## Accessibility Review
M05.3 uses semantic status/alert UI, labelled microphone selection, explicit controls, live readiness status, and keyboard-focusable actions. Existing narrow-viewport candidate E2E remains green. Later realtime controls must retain visible non-audio status, labelled mute/end/retry controls, pressed/disabled semantics, focus safety, and screen-reader announcements.

## Performance Review
Diagnostics are bounded probes and close AudioContext/MediaStream resources. M05.4 cleanup is idempotent and covered for one-time track/node/context shutdown, preventing duplicate teardown and stale emissions. Later M05 work must preserve bounded playback queues, retries, follow-ups, event accumulation, and cleanup; no speculative optimization is justified yet.

## AI / Eval Review
M05 creates no candidate score and no autonomous hire/reject decision. Candidate speech remains untrusted content. Technical failures, network state, microphone quality, silence caused by infrastructure, accent, prosody, emotion, or protected traits cannot become negative candidate evidence. Deterministic plan/follow-up policy and adversarial evals remain required in later M05 iterations.

## Code Review Findings
- Important — **fixed**: anonymous-capable realtime authorization RPC returned a full attempt row; narrowed to opaque UUID only.
- Important — **fixed**: offline diagnostic domain change was not fully integrated into UI/runtime call; exact typecheck CI exposed and the root cause was fixed at `019ac11…`.
- Task 4 review found no Critical/Important issue in cleanup, stale-generation, mute, resource-lifecycle, safety, or evidence-integrity behavior.
- Critical: **0 unresolved** for implemented slices.
- Important: **0 unresolved** for implemented slices.
- PR #7 had no unresolved review threads at the latest recovery check.

## Fixes / Re-review
Security and network-integration findings above received regression evidence and complete GREEN CI. Diagnostics/device-selection/input-level/keyboard acceptance and deterministic capture are now verified through exact behavioral head `9982d75…`, CI #603. M05.2 remains partially active only for provider-specific issuance; M05.5 is the next safe provider-neutral unit.

## Fresh Verification Commands

```bash
pnpm install --frozen-lockfile
pnpm lint
pnpm typecheck
pnpm test
python3 -m unittest tests/python/test_verify_autonomous_framework.py
python3 -m unittest tests/python/test_verify_requirements_source.py
python3 scripts/verify_autonomous_framework.py
python3 scripts/verify_requirements_source.py
pnpm build
pnpm e2e
python3 scripts/verify_prd_coverage.py
```

plus focused realtime/provider/browser/security tests required by the active unit.

## Fresh Verification Results
Exact behavioral SHA `9982d75f02fb6911162d60cec98581441ecf704b` passed CI #603 / `34710723994`, including frozen dependencies, lint, typecheck, unit/component tests, framework/source verification, local Supabase reset/migrations, production build, Chromium E2E, PRD coverage, and cleanup. Documentation reconciliation commits after that behavioral SHA require their own exact-head CI before any later milestone-readiness claim.

## Commits / Files Changed
The active PR contains the M05 design/plan, realtime authorization/persistence/provider-token boundaries, browser diagnostics, candidate technical-check UI/page integration, deterministic audio capture/worklet lifecycle, and associated tests/docs. Recover the current PR head from GitHub rather than trusting a stale commit list here.

## Known Limitations
No authoritative realtime provider SDK/configuration exists yet, so provider-specific production token issuance and the selected-provider adapter portion of M05.5 remain unresolved. This does not block the provider-neutral transport contract/fake transport or later provider-neutral domain work.

## Documentation Updated
`docs/progress/STATUS.md`, `docs/milestones/CURRENT.md`, this ledger, `docs/SESSION-HANDOFF.md`, and requirements/traceability surfaces are durable recovery sources and must remain synchronized with Git/code/current exact-SHA CI.

## Durable Recovery Sources
`AGENTS.md` → `CODEX-START-HERE.md` → `docs/AUTONOMOUS-DEVELOPMENT.md` → live Git/PR/review/exact-head CI → `docs/progress/STATUS.md` → `docs/progress/KNOWN-ISSUES.md` → `docs/milestones/CURRENT.md` → this ledger → requirements/traceability → selected design/plan → source/tests.

## Completion Checklist
- [ ] Requirements and all M05 iterations accounted for.
- [ ] Stable multi-turn candidate interview acceptance criterion verified.
- [ ] Required TDD/integration/provider/browser/E2E evidence recorded.
- [ ] Security/accessibility/performance/AI-safety reviews complete.
- [ ] 0 Critical / 0 Important findings at milestone closeout.
- [ ] Traceability/feature matrix/status/handoff reconciled.
- [ ] Exact-final-head CI green.
- [ ] Final PR head/review/concurrency/mergeability gates green before authorized merge.

## Next Action
Begin M05.5 with strict TDD for the provider-neutral transport lifecycle: normalized events/technical errors, send-before-open and send-after-close rejection, stale callback rejection, safe/idempotent disconnect, and a deterministic fake transport for later orchestration tests. Do not create a provider adapter until authoritative provider selection/configuration exists.

## Next Milestone
M06 — Transcript + Durable Session, only after M05 is genuinely complete, merged, and post-merge `main` is verified.
