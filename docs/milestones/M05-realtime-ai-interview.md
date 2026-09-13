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
Candidates + Invitations; published Interviewer Builder configuration; an authoritative realtime provider selection/configuration is required for the final live provider path.

## In Scope
The authoritative definition plus M05.1–M05.14 from the selected implementation plan.

## Out of Scope
Later milestones, autonomous hiring decisions, protected-trait/emotion/personality/deception/appearance/accent-quality inference, fabricated candidate evidence, and provider coupling not justified by authoritative requirements.

## Architecture Notes
Server-authorized realtime setup; short-lived provider credentials; provider-neutral boundaries until a provider is authoritative; explicit browser diagnostics; deterministic audio capture/playback lifecycles; app-owned connection state; immutable interview-plan runner; monotonic pacing; bounded job-related follow-ups; same-attempt reconnect. Candidate speech is untrusted data. Technical failures never lower candidate evaluation. Runtime plan progression is committed only after authoritative attempt persistence succeeds and a returned server checkpoint is validated.

The production `POST /api/interview/[token]/realtime-session` endpoint now exists and intentionally fails closed with constant-safe `503 { status: "unavailable" }` while no authoritative provider is configured. This prevents accidental provider fabrication or credential issuance while preserving a real production integration point for the later provider adapter.

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
2. **ACTIVE / PARTIALLY VERIFIED** — M05.2 Session authorization/provider boundary. Provider-neutral authorization/attempt/persistence/token-lifetime boundaries and the real production endpoint are verified. Provider-specific credential issuance remains blocked on authoritative provider selection/configuration.
3. **VERIFIED** — M05.3 Browser compatibility + microphone diagnostics.
4. **VERIFIED** — M05.4 Deterministic Web Audio capture.
5. **VERIFIED (provider-neutral scope)** — M05.5 Provider-neutral realtime transport. Provider-specific adapter remains blocked pending provider selection/configuration.
6. **VERIFIED** — M05.6 AI audio playback.
7. **VERIFIED** — M05.7 Explicit connection state machine + accessible controls.
8. **VERIFIED** — M05.8 Deterministic interview-plan runner.
9. **VERIFIED** — M05.9 Pacing/time budget.
10. **VERIFIED** — M05.10 Bounded follow-up policy.
11. **ACTIVE / PARTIALLY VERIFIED** — M05.11 Realtime interview orchestrator/barge-in integration. Provider-neutral controller/presentation behavior is verified; production provider/page composition remains blocked.
12. **VERIFIED (provider-neutral scope)** — M05.12 Timeout/error recovery.
13. **VERIFIED (provider-neutral scope)** — M05.13 Same-authoritative-attempt reconnect. Server-authoritative checkpoints, capability-bound progress persistence, immutable-plan restoration, stale-generation handling, and runtime persistence gating are implemented and exact-head verified. Provider-backed reconnect remains blocked by provider selection.
14. **ACTIVE / PARTIALLY VERIFIED** — M05.14 Full realtime E2E and closeout. Browser coverage verifies microphone denial/recovery, keyboard focus, microphone selection, mobile no-overflow, no recording during readiness checks, and the production realtime endpoint's fail-closed/no-secret behavior. Stable provider-backed multi-turn voice completion remains blocked.

## TDD Evidence

Earlier M05.2–M05.12 checkpoints remain historically preserved in Git and prior revisions of this ledger.

Key M05.13 checkpoints:
- authoritative progress repository RED: `87406dc5d0186d5f28f3b8d5cdd5f19c9f50b2b1`, CI #665 / `34732181229`.
- initial repository GREEN: `41d35ab89d24ef8b093c37c47a1dc8261f3285d1`, CI #666 / `34732252665`.
- authority review RED: `a2cf5eb633751d58cfcf3e3fb0b2e657504cc00a`, CI #667 / `34732505070`.
- reviewed repository GREEN: `576d5dbad4138b85876eeac22ddfe8e7247381ce`, CI #669 / `34732650018`.
- runtime persistence RED: `f3b01a0e1f3f9ca17cf5058aea73816f6e639d49`, CI #671 / `34732962547`.
- fail-closed review RED: `a0fcda2590020b4bd574dcd342a3aec308e34300`, CI #673 / `34733342412`.
- reviewed GREEN: `5e9328d2f945cd10eaecea312896f29fbc93b10e`, CI #674 / `34733465242`.

M05.14 browser/production-route evidence:
- readiness browser checkpoint `829d9d92c3f9b92d32944b54622436b1a54b63a5`, CI #681 / `34734365068` — **NOT GREEN** because a generic `role=alert` locator also matched the Next.js route announcer; product behavior reached the intended state.
- readiness reviewed GREEN `1c4635618aa1d3471284ca30cfb8658981afdd94`, CI #682 / `34734661625` — scoped alert locator; complete repository gate GREEN.
- production-route RED `e5a38034fbb35203e47a97fa2491cca5142b116b`, CI #687 / `34765320016` — intended TypeScript RED: `Cannot find module './route'` proved the real route was absent.
- production-route GREEN `cf37ffadcea1bab410e32d89060df22138af4324`, CI #688 / `34765378818` — minimal constant-safe fail-closed production route; complete repository gate GREEN.
- browser/API integration GREEN `db86e81fa19af2daf2c830c0b5cb0082fd118fd9`, CI #689 / `34765662964` — real candidate capability exercises the production route and verifies `503 { status: "unavailable" }`, no raw capability echo, and no credential exposure; complete repository gate GREEN.

## Integration Test Evidence

CI #689 / `34765662964` on `db86e81fa19af2daf2c830c0b5cb0082fd118fd9` passed frozen dependency installation, lint, typecheck, unit/component tests, framework/source verifiers, local Supabase startup/migrations, production build, Chromium E2E, PRD coverage, and cleanup.

The browser path now exercises the real candidate invitation page on a mobile viewport, proves microphone denial/retry recovery, accessible keyboard focus, enumerated microphone selection, no horizontal overflow, no recording during readiness checks, and the production realtime endpoint's safe unavailable response while provider configuration is absent.

Full stable multi-turn live-provider browser E2E remains an M05.14 closeout requirement and is not satisfied.

## Security Review

Implemented M05 work does not create candidate scores or autonomous hire/reject decisions. Candidate speech remains untrusted. Technical failure, microphone/network/provider state, accent, prosody, emotion, protected traits, or infrastructure downtime cannot become negative candidate evidence.

Invitation capability and current consent remain server authorization requirements. Raw capability tokens and long-lived provider secrets are not persisted/logged. Progress persistence is capability-bound and database-authoritative. The production realtime endpoint currently issues no credential and returns only constant-safe unavailability, so it cannot bypass consent or expose provider secrets before provider configuration exists.

## Accessibility Review

M05.3 diagnostic UI and M05.7 realtime controls provide semantic status/alert information, keyboard-operable controls, labelled mute/end/retry actions, pressed/disabled state, and live status text. Candidate-facing current-question/completion presentation is covered by component tests. Browser coverage verifies keyboard focus, recovery presentation, microphone selection, and mobile no-overflow. Full live realtime browser accessibility coverage remains provider-blocked.

## Performance Review

Capture/playback/transport lifecycles use bounded cleanup and stale-generation rejection. Plan, pacing, follow-up, recovery, reconnect, and persistence bookkeeping are bounded. The fail-closed endpoint performs constant work and does not allocate provider resources. Browser fixtures use bounded mocked media calls only in test execution.

## Code Review Findings

- Important — **fixed**: anonymous-capable realtime authorization RPC returned a full attempt row; narrowed to safe attempt/session state.
- Important — **fixed**: offline diagnostic domain change was incompletely wired into UI/runtime.
- Important — **fixed**: M05.8 initially authorized future planned questions; current-question-only authority is regression-tested.
- Important — **fixed**: progress checkpoint authority initially depended on caller input; persisted attempt version now wins.
- Important — **fixed**: malformed authoritative progress checkpoint could throw; it now fails closed.
- Test quality — **fixed**: initial browser alert locator was ambiguous.
- Production integration gap — **fixed in provider-neutral scope**: the realtime-session route test existed without a production route. RED `e5a38034…` proved the absence; GREEN `cf37ffad…` added a fail-closed production endpoint; E2E GREEN `db86e81f…` proves no capability/credential leakage.
- Critical: **0 unresolved** for implemented slices.
- Important: **0 unresolved** for verified provider-neutral slices through the current browser/route coverage.
- PR #7 has no unresolved review threads at the latest recovery check.

## Known Limitations / Blocker

No authoritative realtime provider SDK/configuration or production credential-minting contract exists. Therefore provider-specific credential issuance, provider adapter composition, final live page/transport wiring, provider-backed reconnect/interruption recovery, and the live stable multi-turn browser exit criterion remain unresolved. Do not invent a provider merely to close M05.

Existing candidate invitation browser E2E already covers unusable, expired, revoked, and completed invitation safety. Provider-neutral tests already cover mute/end controls, barge-in, timeout/error recovery, and bounded reconnect semantics. Surfacing a fake "live" interview page solely to exercise those browser states would fabricate integration evidence and is not legitimate progress.

M05.14 remains incomplete. PR #7 must stay draft and unmerged until all acceptance, exact-final-head CI, review, traceability, and live-provider gates are genuinely satisfied.

## Fresh Verification Results

Latest verified behavioral/browser SHA `db86e81fa19af2daf2c830c0b5cb0082fd118fd9` passed CI #689 / `34765662964`, including frozen dependency install, lint, typecheck, unit/component tests, framework/source verification, local Supabase startup/migrations, production build, Chromium E2E, PRD coverage, and cleanup.

Documentation commits after `db86e81f…` require their own exact-head CI before they become final branch verification evidence.

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
When authoritative realtime provider/configuration is available, wire the existing server authorization boundary to short-lived provider credential issuance, implement the provider adapter/live candidate-page composition, verify provider-backed reconnect/interruption recovery, and complete stable multi-turn browser E2E. Until then preserve the blocker and keep PR #7 draft/unmerged.

## Next Milestone
M06 — Transcript + Durable Session, only after M05 is genuinely complete, merged, and post-merge `main` is verified.
