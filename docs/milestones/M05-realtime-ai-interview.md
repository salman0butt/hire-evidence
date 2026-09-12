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
2. **ACTIVE / PARTIALLY VERIFIED** — M05.2 Session authorization/provider boundary. Provider-neutral authorization, attempt persistence, narrow handler behavior, and token lifetime rules exist; provider-specific production issuance remains blocked on authoritative provider selection/configuration.
3. **VERIFIED** — M05.3 Browser compatibility + microphone diagnostics.
4. **VERIFIED** — M05.4 Deterministic Web Audio capture.
5. **VERIFIED (provider-neutral scope)** — M05.5 Provider-neutral realtime transport. Provider-specific adapter remains blocked pending provider selection/configuration.
6. **VERIFIED** — M05.6 AI audio playback.
7. **VERIFIED** — M05.7 Explicit connection state machine + accessible controls.
8. **VERIFIED** — M05.8 Deterministic interview-plan runner.
9. **NEXT** — M05.9 Pacing/time budget.
10. **NOT STARTED** — M05.10 Bounded follow-up policy.
11. **NOT STARTED** — M05.11 Realtime interview orchestrator/barge-in integration.
12. **NOT STARTED** — M05.12 Timeout/error recovery.
13. **NOT STARTED** — M05.13 Same-authoritative-attempt reconnect.
14. **NOT STARTED** — M05.14 Full realtime E2E and closeout.

## TDD / Verification Evidence

Earlier M05.2–M05.4 evidence remains historically preserved in Git. Key later checkpoints:

- M05.5 RED: `2e1569cdac314884d5f56af837360dd300e57bd7`, CI #608 / `34711135700` — transport module intentionally absent.
- M05.5 initial GREEN: `c6401b8bb4a14f30b6bc02ac386168fa2d499474`, CI #609 / `34718728708` — behavior green; stale durable-state formatting prevented final verification.
- M05.5 exact verified head: `fb960c72136246fb2ba1a236971db948fb7ee95e`, CI #610 / `34718812471` — complete repository gate GREEN.
- M05.6 RED: `0bd355a996f1d2ceec18b985bd1b533ff1a992c9`, CI #612 / `34719132103` — playback module intentionally absent.
- M05.6 invalid NOT GREEN: `6c97808ae14fd6e69a951617ef22dfc0fa3fcf27`, CI #613 / `34719250355` — test-harness typing failed before behavioral verification.
- M05.6 GREEN: `d3e4edf01001f893f3f913f45011233096744a67`, CI #614 / `34719329747` — complete repository gate GREEN.
- M05.7 connection-state RED: `15f887e62d628965a01b7f58363fb63d50b339e0`, CI #616 / `34719618954` — required state-machine behavior absent.
- M05.7 implementation checkpoint: `ef4718a28d0a88dcdcdb59098c3630a3a028df3e`, CI #617 / `34719712700` — CI cancelled by the next head, so not final GREEN evidence.
- M05.7 accessible-controls RED: `2faa12fca7d0f39a5b411259286f54a11176d5d1`, CI #618 / `34719805392` — missing realtime-controls component.
- M05.7 GREEN: `6a440ccd0233b2083c47f3ec9991b897487dbad6`, CI #619 / `34720013611` — complete repository gate GREEN.
- M05.8 initial RED: `1ef658fabd7ca8b8c29921661c9e2f42001a0c16`, CI #620 / `34721584894` — deterministic plan-runner module intentionally absent.
- M05.8 initial GREEN: `0fab34a4a61dd4d8c91c1ca80e1055905bf2e6f9`, CI #621 / `34721656385` — complete repository gate GREEN.
- M05.8 review RED: `a3224b943c5b4613c58b54e0ca3953d97285975f`, CI #622 / `34721926133` — unit test proved the initial helper authorized future planned questions before the current cursor reached them.
- M05.8 reviewed GREEN: `a184da9ec54aa317fa42c600591be422676797d1`, CI #623 / `34722042401` — current-question-only authority fix; complete repository gate GREEN.

## Current Verification

Latest verified behavioral SHA `a184da9ec54aa317fa42c600591be422676797d1` passed CI #623 / `34722042401`, including frozen dependency install, lint, typecheck, unit/component tests, framework/source verification, local Supabase startup/migrations, production build, Chromium E2E, PRD coverage, and cleanup.

Documentation reconciliation commits after this behavioral SHA must receive their own exact-head CI before they are treated as final milestone evidence.

## Security / AI-Safety Review

Implemented M05 work does not create candidate scores or autonomous hire/reject decisions. Candidate speech remains untrusted. Technical failure, microphone/network/provider state, accent, prosody, emotion, protected traits, or infrastructure downtime cannot become negative candidate evidence.

The M05.8 runner snapshots the published plan rather than retaining mutable caller-owned plan objects. Progression events must target the current question, replayed event IDs and out-of-order events are ignored, follow-up consumption cannot exceed the immutable per-question bound, and the question-authority helper permits only the current deterministic cursor. Untrusted extra candidate/model event fields are not used to mutate plan policy.

## Accessibility Review

M05.3 diagnostic UI and M05.7 realtime controls provide semantic status/alert information, keyboard-operable controls, labelled mute/end/retry actions, pressed/disabled state, and live status text. Existing narrow-viewport candidate E2E remains green. Full realtime browser coverage remains for M05.14.

## Performance Review

Capture/playback/transport lifecycles use bounded cleanup and stale-generation rejection. The plan runner is pure and bounded by published plan/event size; it performs no model calls, database work, or unbounded media buffering. Later pacing/retry/follow-up work must preserve bounded state.

## Code Review Findings

- Important — **fixed**: anonymous-capable realtime authorization RPC returned a full attempt row; narrowed to opaque UUID only.
- Important — **fixed**: offline diagnostic domain change was not fully integrated into UI/runtime call; exact typecheck CI exposed and the root cause was fixed.
- Important — **fixed**: M05.8 initially allowed any question present anywhere in the immutable plan. Regression RED `a3224b9…` proved a future question could be authorized out of order; `a184da9…` now authorizes only the current cursor and passed the full gate.
- Critical: **0 unresolved** for implemented slices.
- Important: **0 unresolved** for implemented slices.
- PR #7 had no unresolved review threads at the latest recovery check.

## Known Limitations

No authoritative realtime provider SDK/configuration exists yet, so provider-specific production token issuance and adapter composition remain unresolved. This does not block provider-neutral M05 domain work.

M05.9–M05.14 remain required before milestone completion. The stable multi-turn browser exit criterion is not yet satisfied, so PR #7 must remain draft and unmerged.

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
Begin M05.9 with strict TDD for a pure pacing/time-budget boundary: monotonic elapsed-time accounting, backwards/discontinuous clock resistance, optional-follow-up suppression near deadline, graceful completion, and explicit infrastructure-downtime accounting without candidate-quality inference.

## Next Milestone
M06 — Transcript + Durable Session, only after M05 is genuinely complete, merged, and post-merge `main` is verified.
