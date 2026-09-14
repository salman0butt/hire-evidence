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
Candidates + Invitations; published Interviewer Builder configuration; authoritative Gemini Live runtime configuration for final live-provider acceptance.

## In Scope
The authoritative definition plus M05.1–M05.14 from the selected implementation plan.

## Out of Scope
Later milestones, autonomous hiring decisions, protected-trait/emotion/personality/deception/appearance/accent-quality inference, fabricated candidate evidence, and provider coupling outside the selected Gemini Live integration.

## Architecture Notes
Server-authorized realtime setup; short-lived Gemini provider credentials; app-owned provider-neutral transport boundary; explicit browser diagnostics; deterministic audio capture/playback lifecycles; app-owned connection state; immutable interview-plan runner; monotonic pacing; bounded job-related follow-ups; same-attempt reconnect. Candidate speech is untrusted data. Technical failures never lower candidate evaluation. Runtime plan progression is committed only after authoritative attempt persistence succeeds and a returned server checkpoint is validated.

The production candidate path now includes `POST /api/interview/[token]/realtime-session`, the capability-bound realtime-progress boundary, Gemini Live ephemeral credential issuance, the Gemini transport adapter, browser capture/playback composition, and `RealtimeInterviewLauncher`. Missing server `GEMINI_API_KEY` continues to fail closed with constant-safe unavailability.

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
- Same-attempt reconnect cannot reset required progress or follow-up budgets.
- 0 unresolved Critical or Important findings.
- Traceability/feature/status/handoff state matches actual Git/code/tests/CI.
- Exact-final-head CI is green before authorized milestone merge.

## Tasks / Iterations
1. **VERIFIED** — M05.1 Reference characterization.
2. **IMPLEMENTED / ACTIVE VERIFICATION** — M05.2 Session authorization/provider boundary. Authoritative attempt binding, consent/version gating, short-lived credential constraints, Gemini Live ephemeral credential issuance, production realtime-session endpoint, and capability-bound realtime-progress endpoint are implemented.
3. **VERIFIED** — M05.3 Browser compatibility + microphone diagnostics.
4. **VERIFIED** — M05.4 Deterministic Web Audio capture.
5. **IMPLEMENTED / ACTIVE VERIFICATION** — M05.5 Provider-neutral realtime transport with Gemini Live adapter behind the app-owned boundary.
6. **VERIFIED** — M05.6 AI audio playback.
7. **VERIFIED** — M05.7 Explicit connection state machine + accessible controls.
8. **VERIFIED** — M05.8 Deterministic interview-plan runner.
9. **VERIFIED** — M05.9 Pacing/time budget.
10. **VERIFIED** — M05.10 Bounded follow-up policy.
11. **IMPLEMENTED / ACTIVE VERIFICATION** — M05.11 Realtime interview orchestrator/barge-in integration. Production candidate-page launcher/runtime composition now authorizes the capability, creates Gemini transport/capture/playback behind provider-neutral interfaces, renders authoritative snapshots, and exposes mute/end controls.
12. **VERIFIED (provider-neutral scope)** — M05.12 Timeout/error recovery.
13. **IMPLEMENTED / ACTIVE VERIFICATION** — M05.13 Same-authoritative-attempt reconnect. Server-authoritative checkpoints, capability-bound progress persistence, immutable-plan restoration, stale-generation handling, and runtime persistence gating are implemented; live Gemini browser reconnect/interruption acceptance remains open.
14. **ACTIVE / PARTIALLY VERIFIED** — M05.14 Full realtime E2E and closeout. Browser coverage verifies microphone denial/recovery, keyboard focus, microphone selection, mobile no-overflow, no recording during readiness checks, and constant-safe unavailable-provider behavior when the server secret is absent. Stable Gemini-backed multi-turn completion plus interruption/recovery/barge-in/timeout/bounded reconnect acceptance remain open.

## TDD Evidence

Earlier M05 checkpoints remain historically preserved in Git and prior revisions of this ledger. Important recent checkpoints include:

- production Gemini session composition RED/GREEN: `7f9b2f6beb195c48a03595fceb191d0adc83aa3f` → `409a899ce000674b441bd0da2ff8a01d4efc62db`.
- production browser runtime/launcher composition advanced through later commits, including snapshot forwarding `6bfef96dbeb4a9d4c529eb710f7d15c6b74ac5dc` and authoritative snapshot rendering `95106d791b42220a53788bc058327182902cc99a`.
- historical M05.13 persistence evidence includes repository RED `87406dc5d0186d5f28f3b8d5cdd5f19c9f50b2b1`, authority review RED `a2cf5eb633751d58cfcf3e3fb0b2e657504cc00a`, reviewed GREEN `576d5dbad4138b85876eeac22ddfe8e7247381ce`, runtime persistence RED `f3b01a0e1f3f9ca17cf5058aea73816f6e639d49`, fail-closed review RED `a0fcda2590020b4bd574dcd342a3aec308e34300`, and reviewed GREEN `5e9328d2f945cd10eaecea312896f29fbc93b10e`.
- documentation reconciliation checkpoint `52f0ccb2a3a1e0c3f2fa4a38860dc9a097da5aba`, CI #750 / `34841743614` — **NOT GREEN**. Lint, typecheck, 120 test files / 497 tests, and verifier unit tests passed, but `scripts/verify_autonomous_framework.py` correctly rejected this ledger because the exact required `## TDD Evidence` and `## Integration Test Evidence` section headings had been accidentally combined. This commit restores the required durable ledger contract rather than weakening the verifier.

## Integration Test Evidence

- production route/provider wiring and schema fixes through `56c78425f7052b2e54ac9cfea410a57c53aef805`, CI #713 / `34832502815` — complete repository gate GREEN.
- capability-bound realtime progress checkpoint `ce161fbaa34450839ac8f323f6fcc3a33cdc4863`, CI #728 / `34834823096` — complete repository gate GREEN.
- exact behavioral head `95106d791b42220a53788bc058327182902cc99a`, CI #745 / `34839902037` — complete repository gate GREEN before the documentation reconciliation.
- CI #750 / `34841743614` on `52f0ccb2a3a1e0c3f2fa4a38860dc9a097da5aba` is an invalid final verification checkpoint because the autonomous framework verifier failed on the ledger heading contract; later build/E2E steps were consequently skipped. The cleanup `supabase: command not found` message was downstream of skipped Supabase setup, not the root failure.
- Stable live Gemini multi-turn browser completion and recovery remain an M05.14 exit requirement and are not yet satisfied.

## Security Review

Implemented M05 work does not create candidate scores or autonomous hire/reject decisions. Candidate speech remains untrusted. Technical failure, microphone/network/provider state, accent, prosody, emotion, protected traits, or infrastructure downtime cannot become negative candidate evidence.

Invitation capability and current consent remain server authorization requirements. Raw capability tokens and long-lived provider secrets are not persisted/logged. Progress persistence is capability-bound and database-authoritative. Gemini long-lived credentials remain server-only; the browser receives only constrained short-lived session credentials after authorization.

## Accessibility Review

Diagnostic UI and realtime controls provide semantic status/alert information, keyboard-operable controls, labelled mute/end/retry actions, pressed/disabled state, and live status text. Candidate-facing current-question/completion presentation is covered by component tests. Browser coverage verifies keyboard focus, recovery presentation, microphone selection, and mobile no-overflow. Full live Gemini browser accessibility acceptance remains open.

## Performance Review

Capture/playback/transport lifecycles use bounded cleanup and stale-generation rejection. Plan, pacing, follow-up, recovery, reconnect, and persistence bookkeeping are bounded. Provider setup and progress boundaries use bounded request/response payloads. No unbounded background retry or browser queue has been introduced.

## Code Review Findings

- Important — **fixed**: anonymous-capable realtime authorization RPC returned a full attempt row; narrowed to safe attempt/session state.
- Important — **fixed**: offline diagnostic domain change was incompletely wired into UI/runtime.
- Important — **fixed**: M05.8 initially authorized future planned questions; current-question-only authority is regression-tested.
- Important — **fixed**: progress checkpoint authority initially depended on caller input; persisted attempt version now wins.
- Important — **fixed**: malformed authoritative progress checkpoint could throw; it now fails closed.
- Important — **fixed**: production browser composition gap. Candidate page now authorizes the session, instantiates the browser runtime/Gemini transport, and renders authoritative snapshots.
- Critical: **0 unresolved** for implemented slices.
- Important: **0 unresolved** for implemented slices at latest recovery.
- PR #7 has no unresolved review threads at latest recovery.

## Known Limitations / Blocker

The remaining blocker is acceptance evidence, not production composition. Stable live Gemini multi-turn browser completion and recovery paths have not yet been demonstrated in CI because provider-backed execution requires server `GEMINI_API_KEY` and controlled browser/provider conditions. Existing E2E intentionally proves constant-safe unavailability when the runtime secret is absent.

Do not substitute provider-neutral/component tests for live-provider acceptance and do not expose client-side long-lived secrets to manufacture E2E evidence. M05.14 remains incomplete. PR #7 must stay draft and unmerged until live-provider acceptance, final reviews, durable traceability, exact-final-head CI, concurrency checks, and repository merge gates are all satisfied.

## Fresh Verification Results

Latest verified behavioral SHA before the current documentation reconciliation: `95106d791b42220a53788bc058327182902cc99a`, CI #745 / `34839902037` — complete repository gate GREEN.

Checkpoint `52f0ccb2a3a1e0c3f2fa4a38860dc9a097da5aba`, CI #750 / `34841743614` — **NOT GREEN** because the framework verifier detected missing exact required ledger headings. The current correction requires fresh exact-head CI before becoming final branch verification evidence.

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

## Durable Recovery Sources

Recover actual Git/GitHub first, then read `AGENTS.md`, `CODEX-START-HERE.md`, `docs/AUTONOMOUS-DEVELOPMENT.md`, `docs/progress/STATUS.md`, `docs/progress/KNOWN-ISSUES.md`, `docs/milestones/CURRENT.md`, this milestone ledger, `docs/SESSION-HANDOFF.md`, `docs/requirements/TRACEABILITY.md`, the authoritative requirements/PRD source, and the selected M05 design/plan. Actual Git graph, source/tests, and exact-SHA CI outrank stale Markdown or prior chat/task summaries.

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
Add deterministic browser acceptance around the production launcher/runtime composition without exposing provider secrets, then execute live Gemini-backed browser acceptance when server `GEMINI_API_KEY` is available. Verify stable multi-turn completion, interruption/barge-in, timeout/error recovery, bounded same-attempt reconnect, mute/end controls, accessibility/mobile behavior, and invitation safety; then reconcile final traceability/feature/handoff state and run the complete quality gate.

## Next Milestone
M06 — Transcript + Durable Session, only after M05 is genuinely complete, merged, and post-merge `main` is verified.