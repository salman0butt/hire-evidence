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
2. **ACTIVE / PARTIALLY VERIFIED** — M05.2 Session authorization/provider boundary. Provider-neutral authorization/attempt boundaries are verified; provider-specific production issuance remains blocked on authoritative provider selection/configuration.
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
14. **ACTIVE / PARTIALLY VERIFIED** — M05.14 Full realtime E2E and closeout. Deterministic browser coverage now proves candidate-page microphone denial → explicit retry recovery, keyboard focus, input enumeration/selection, mobile no-overflow, and that the readiness check does not start recording. Continue deterministic coverage that does not depend on provider coupling; do not claim the stable live multi-turn exit until the provider path exists.

## TDD Evidence

Earlier M05.2–M05.12 checkpoints remain historically preserved in Git and prior revisions of this ledger. Key M05.13 checkpoints:

- authoritative progress repository RED: `87406dc5d0186d5f28f3b8d5cdd5f19c9f50b2b1`, CI #665 / `34732181229` — progress persistence repository boundary absent.
- initial repository GREEN: `41d35ab89d24ef8b093c37c47a1dc8261f3285d1`, CI #666 / `34732252665` — complete repository gate GREEN.
- authority review RED: `a2cf5eb633751d58cfcf3e3fb0b2e657504cc00a`, CI #667 / `34732505070` — regression proved caller-supplied interviewer version could incorrectly define checkpoint authority.
- reviewed repository GREEN: `576d5dbad4138b85876eeac22ddfe8e7247381ce`, CI #669 / `34732650018` — authoritative persisted attempt version is returned/consumed; complete repository gate GREEN.
- runtime persistence RED: `f3b01a0e1f3f9ca17cf5058aea73816f6e639d49`, CI #671 / `34732962547` — orchestration lacked the required persistence boundary.
- runtime implementation: `cff7cc7e0c3c5ce0db27319bc4728811c7a1f53c` — question progression waits for authoritative persistence and consumes the returned checkpoint.
- fail-closed review RED: `a0fcda2590020b4bd574dcd342a3aec308e34300`, CI #673 / `34733342412` — malformed authoritative checkpoint rejected the session promise instead of failing closed.
- reviewed GREEN: `5e9328d2f945cd10eaecea312896f29fbc93b10e`, CI #674 / `34733465242` — invalid/conflicting/rejected persistence leaves local progress unchanged; complete repository gate GREEN.

M05.14 browser evidence:

- browser scenario checkpoint: `829d9d92c3f9b92d32944b54622436b1a54b63a5`, CI #681 / `34734365068` — **NOT GREEN**. The scenario reached the intended microphone-denial state and all 24 pre-existing browser tests passed, but Playwright strict mode found both the technical-check alert and Next.js route announcer for a generic `role=alert` locator. This is test-locator evidence, not a product behavior RED.
- reviewed browser GREEN: `1c4635618aa1d3471284ca30cfb8658981afdd94`, CI #682 / `34734661625` — locator narrowed to the technical-check alert; full repository gate GREEN with 25 Chromium E2E tests.

## Integration Test Evidence

CI #682 / `34734661625` on `1c4635618aa1d3471284ca30cfb8658981afdd94` passed frozen dependency installation, lint, typecheck, 480 unit/component tests, framework/source verifiers, local Supabase startup/migrations, production build, 25 Chromium E2E tests, PRD coverage, and cleanup. The new deterministic browser scenario exercises the real candidate invitation page on a 390×844 viewport and proves microphone denial/retry recovery, accessible keyboard focus, enumerated microphone selection, no horizontal overflow, and no recording during readiness checks.

Full stable multi-turn live-provider browser E2E remains an M05.14 closeout requirement and is not yet satisfied.

## Security Review

Implemented M05 work does not create candidate scores or autonomous hire/reject decisions. Candidate speech remains untrusted. Technical failure, microphone/network/provider state, accent, prosody, emotion, protected traits, or infrastructure downtime cannot become negative candidate evidence.

Invitation capability and current consent remain server authorization requirements. Raw capability tokens and long-lived provider secrets are not persisted/logged. Progress persistence is capability-bound and database-authoritative; browser/session values cannot replace the persisted interviewer-version authority. Invalid, conflicting, or malformed persisted progress fails closed without advancing local plan state.

The M05.14 browser fixture creates only ephemeral local-CI candidate/invitation data and does not weaken production authorization or persist raw invitation tokens outside the test process.

## Accessibility Review

M05.3 diagnostic UI and M05.7 realtime controls provide semantic status/alert information, keyboard-operable controls, labelled mute/end/retry actions, pressed/disabled state, and live status text. Candidate-facing current-question/completion presentation is covered by component tests. M05.14 browser coverage now verifies keyboard focus on the microphone-check action, semantic recovery presentation, microphone selection, and mobile no-overflow on the real candidate invitation page. Full live realtime browser accessibility coverage remains part of M05.14.

## Performance Review

Capture/playback/transport lifecycles use bounded cleanup and stale-generation rejection. Plan, pacing, follow-up, recovery, reconnect, and persistence bookkeeping are bounded by published plan/event sizes. Runtime progression performs at most the explicitly injected authoritative persistence operation per accepted completion and does not buffer unbounded media or duplicate model calls. The new browser fixture adds one isolated invitation flow and bounded mocked media calls only in test execution.

## Code Review Findings

- Important — **fixed**: anonymous-capable realtime authorization RPC returned a full attempt row; narrowed to safe attempt/session state.
- Important — **fixed**: offline diagnostic domain change was incompletely wired into UI/runtime; exact CI exposed and the root cause was fixed.
- Important — **fixed**: M05.8 initially authorized future planned questions; current-question-only authority is regression-tested.
- Important — **fixed**: progress checkpoint authority initially depended on caller input; persisted attempt version now wins.
- Important — **fixed**: malformed authoritative progress checkpoint could throw from runtime orchestration; regression RED `a0fcda25…` proved it and GREEN `5e9328d2…` now fails closed with unchanged local state.
- Test quality — **fixed**: first M05.14 browser assertion used an ambiguous `role=alert` locator also matching Next.js route announcer; CI #681 reproduced it and CI #682 verifies the scoped locator.
- Critical: **0 unresolved** for implemented slices.
- Important: **0 unresolved** for verified provider-neutral slices through the current browser coverage.
- PR #7 had no unresolved review threads at the latest recovery check.

## Known Limitations

No authoritative realtime provider SDK/configuration exists yet. Therefore provider-specific production credential issuance, provider adapter composition, final live page wiring, provider-backed reconnect, and the live stable multi-turn browser exit criterion remain unresolved. Do not invent a provider merely to close M05.

M05.14 remains incomplete. PR #7 must stay draft and unmerged until all acceptance, exact-final-head CI, review, traceability, and live-provider gates are genuinely satisfied.

## Fresh Verification Results

Latest verified behavioral/browser SHA `1c4635618aa1d3471284ca30cfb8658981afdd94` passed CI #682 / `34734661625`, including frozen dependency install, lint, typecheck, 480 unit/component tests, framework/source verification, local Supabase startup/migrations, production build, 25 Chromium E2E tests, PRD coverage, and cleanup.

Durable documentation commits after `1c463561…` require their own exact-head CI before they can become final branch verification evidence.

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

Recover actual Git/GitHub first, then read `AGENTS.md`, `CODEX-START-HERE.md`, `docs/AUTONOMOUS-DEVELOPMENT.md`, `docs/progress/STATUS.md`, `docs/progress/KNOWN-ISSUES.md`, `docs/milestones/CURRENT.md`, this ledger, `docs/SESSION-HANDOFF.md`, requirements/traceability records, and the selected M05 design/plan. Actual Git graph, source/tests, and exact-SHA CI outrank stale Markdown.

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
Continue M05.14 with the next largest deterministic browser/E2E scenario that exercises real candidate-facing behavior without provider coupling. If all such work is exhausted, persist the provider-selection blocker exactly and keep PR #7 draft/unmerged rather than inventing a provider or weakening the exit criterion.

## Next Milestone
M06 — Transcript + Durable Session, only after M05 is genuinely complete, merged, and post-merge `main` is verified.
