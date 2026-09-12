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
3. **ACTIVE** — M05.3 Browser compatibility + microphone diagnostics. Capability/network/permission/input diagnostics, explicit microphone acquisition/cleanup, accessible recovery UI, candidate-page integration, offline handling, and selected-device acquisition exist. Device-selection UX, usable input-level readiness, and focused keyboard/narrow-viewport verification remain.
4. **NOT STARTED** — M05.4 Deterministic Web Audio capture.
5. **NOT STARTED** — M05.5 Provider-neutral realtime transport / selected adapter when justified.
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

## Integration Test Evidence
M05 attempt persistence migrations have applied successfully in provider-backed CI. Exact selected-input behavioral head `2708322…` passed local Supabase reset, production build, and existing Chromium E2E in CI #563. Milestone-specific realtime provider and full interview E2E remain pending by design.

## E2E / Visual Verification
Existing candidate invitation browser coverage remains green through CI #563. M05.3 still requires focused technical-check keyboard/narrow-viewport coverage. M05.14 will add successful multi-turn completion, microphone denial/recovery, mute/end, barge-in, provider interruption, timeout, bounded reconnect, mobile/no-overflow, status semantics, and unusable invitation safety.

## Security Review
Implemented M05.2 work gates realtime authorization on invitation capability, current consent, immutable published interviewer version, and one authoritative attempt; raw invitation/provider secrets are not persisted. Earlier full-row anonymous-capable RPC exposure was corrected to return only an opaque attempt UUID. M05.3 keeps diagnostic audio transient and releases acquired tracks immediately. Selected device IDs are browser-local inputs and are not candidate assessment evidence.

## Accessibility Review
M05.3 uses semantic status/alert UI and explicit buttons. Remaining closeout requires accessible device selection plus keyboard and narrow-viewport browser verification. Realtime controls later must retain visible non-audio status, labelled mute/end/retry controls, focus safety, and screen-reader announcements.

## Performance Review
Current diagnostics are bounded probes and immediately close AudioContext/MediaStream resources. Later M05 work must preserve bounded queues, retries, follow-ups, event accumulation, and idempotent cleanup; no speculative optimization is currently justified.

## AI / Eval Review
M05 creates no candidate score and no autonomous hire/reject decision. Candidate speech remains untrusted content. Technical failures, network state, microphone quality, silence caused by infrastructure, accent, prosody, emotion, or protected traits cannot become negative candidate evidence. Deterministic plan/follow-up policy and adversarial evals are required in later M05 iterations.

## Code Review Findings
- Important — **fixed**: anonymous-capable realtime authorization RPC returned a full attempt row; narrowed to opaque UUID only.
- Important — **fixed**: offline diagnostic domain change was not fully integrated into UI/runtime call; exact typecheck CI exposed and the root cause was fixed at `019ac11…`.
- Critical: **0 unresolved** for implemented slices.
- Important: **0 unresolved** for implemented slices.
- PR #7 had no submitted reviews or unresolved review threads at the latest reconciliation.

## Fixes / Re-review
Security and network-integration findings above received regression evidence and complete GREEN CI. Selected-device access support also passed a complete exact-head gate at `2708322…`. M05.2 and M05.3 remain ACTIVE because their acceptance boundaries are not yet complete.

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
Exact behavioral SHA `2708322cd406eb3e2877295bfe25f495cff422c5` passed CI #563 / `34701331592`, including frozen dependencies, lint, typecheck, unit/component tests, framework/source verification, local Supabase reset/migrations, build, Chromium E2E, PRD coverage, and cleanup. Documentation reconciliation commits after that SHA require a fresh exact-head run before any later integration-readiness claim.

## Commits / Files Changed
The active PR contains the M05 design/plan, realtime authorization/persistence/provider-token boundaries, browser diagnostics, candidate technical-check UI/page integration, and associated tests/docs. Recent diagnostic checkpoints are recorded in TDD Evidence above; recover the current PR head from GitHub rather than trusting a stale commit list here.

## Known Limitations
No authoritative realtime provider SDK/configuration exists yet, so provider-specific production token issuance/adapter composition remains unresolved. M05.3 still lacks candidate device enumeration/selection UX, usable input-level readiness, and focused browser technical-check accessibility closeout.

## Documentation Updated
`docs/progress/STATUS.md`, `docs/milestones/CURRENT.md`, this ledger, `docs/progress/KNOWN-ISSUES.md`, `docs/SESSION-HANDOFF.md`, and requirements traceability are the durable recovery surfaces and must be kept synchronized with Git/code/current exact-SHA CI.

## Durable Recovery Sources
`AGENTS.md` → `CODEX-START-HERE.md` → `docs/AUTONOMOUS-DEVELOPMENT.md` → live Git/PR/review/exact-head CI → `docs/progress/STATUS.md` → `docs/progress/KNOWN-ISSUES.md` → `docs/milestones/CURRENT.md` → this ledger → requirements/traceability → selected design/plan → source/tests.

## Completion Checklist
- [ ] Requirements and all M05 iterations accounted for.
- [ ] Stable multi-turn candidate interview acceptance criterion verified.
- [ ] Required TDD/integration/provider/browser/E2E evidence recorded.
- [ ] Security/accessibility/performance/AI-safety reviews complete.
- [ ] 0 Critical / 0 Important findings.
- [ ] Traceability/feature matrix/status/handoff reconciled.
- [ ] Exact-final-head CI green.
- [ ] Final PR head/review/concurrency/mergeability gates green before authorized merge.

## Next Action
Complete M05.3 with strict TDD for privacy-preserving candidate audio-input enumeration/selection after explicit microphone access, re-check the chosen input, add usable input-level readiness, then close keyboard/narrow-viewport browser verification before marking M05.3 verified.

## Next Milestone
M06 — Transcript + Durable Session, only after M05 is genuinely complete, merged, and post-merge `main` is verified.
