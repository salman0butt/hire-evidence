# M05 — Realtime AI Interview

Status: **REPOSITORY ACCEPTANCE COMPLETE / FINAL MERGE GATE**

## Goal
Deliver a stable, safe, evidence-backed multi-turn realtime voice interview from the existing invitation flow through deterministic interview completion and bounded recovery.

## Authoritative PRD Milestone Definition

# 200. MILESTONE 05 — REALTIME AI INTERVIEW

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

Candidates + Invitations, a published immutable interviewer version, current candidate consent, authoritative attempt state, and the M05 realtime provider boundary. A real server-side `GEMINI_API_KEY` is required only for the separate local/deployment live-provider smoke documented in `docs/LOCAL-REALTIME-ACCEPTANCE.md`.

## In Scope

The authoritative M05 definition plus M05.1–M05.14: authorization/provider boundaries, browser/microphone diagnostics, deterministic capture/playback, provider-neutral transport, connection/recovery state, immutable plan execution, pacing, bounded follow-ups, barge-in, timeout/error handling, same-attempt reconnect, production browser composition, and deterministic realtime E2E acceptance.

## Out of Scope

Later milestones; autonomous hiring decisions; protected-trait, emotion, personality, deception, appearance, or accent-quality inference; fabricated candidate evidence; provider coupling outside the isolated Gemini adapter; and claiming an external live-provider run that has not actually occurred.

## Scope Resolution

Repository implementation and deterministic acceptance for M05 are complete. The external Gemini Live service smoke is intentionally separated from repository CI because it requires a real server-side credential and provider availability.

On 2026-09-14 the repository owner explicitly instructed autonomous development to complete M05 now and stated that real credentials will be supplied locally. Therefore the live-provider run is a **local/deployment acceptance check**, documented in `docs/LOCAL-REALTIME-ACCEPTANCE.md`, rather than a repository merge blocker.

This resolution does not fabricate evidence: no live Gemini-backed browser run is claimed. A future failed live smoke is a real defect and must be fixed before that deployment is relied upon for candidate interviews.

## Architecture / Safety Invariants

- Realtime setup is server-authorized and bound to the authoritative invitation/attempt.
- Long-lived `GEMINI_API_KEY` remains server-only; the browser receives only constrained short-lived provider credentials after authorization.
- The app owns a provider-neutral transport boundary; provider-specific schema remains isolated in the Gemini adapter.
- Browser diagnostics and audio capture/playback lifecycles are deterministic and bounded.
- Interview-plan execution is immutable and server-authoritative.
- Candidate speech is untrusted data and cannot rewrite policy, criteria, plan order, or follow-up limits.
- Same-attempt reconnect cannot silently reset required progress or budgets.
- Technical/provider/browser/microphone failures never lower candidate evaluation or become negative evidence.
- M05 introduces no autonomous hire/reject decision and no protected-trait, emotion, personality, deception, appearance, or accent-quality inference.

## Selected Design / Implementation Plan

- Design: `docs/superpowers/specs/2026-09-12-realtime-ai-interview-design.md`
- Plan: `docs/superpowers/plans/2026-09-12-realtime-ai-interview.md`
- Local live-provider acceptance: `docs/LOCAL-REALTIME-ACCEPTANCE.md`
- Talk Tutor reference: `69b6beee90c8dbd186730389f8a1462c2239fe61`.

## Acceptance Criteria

- PRD M05 deliverables are implemented at repository scope.
- Deterministic production-path acceptance demonstrates stable multi-turn orchestration, interruption, bounded recovery, same-attempt continuity, and candidate-safe controls.
- Authorization, consent, provider-secret isolation, evidence integrity, privacy, accessibility, performance, and AI-safety invariants pass repository review/tests.
- Technical/provider failures cannot become negative candidate evidence.
- Candidate content cannot rewrite trusted policy, plan order, criteria, or follow-up bounds.
- Same-attempt reconnect cannot reset persisted progress or bounded budgets.
- 0 unresolved Critical or Important findings remain.
- Durable status/traceability/handoff state matches actual Git/code/tests/CI.
- Exact-final-head repository CI is green before the authorized merge.
- The separate real Gemini local/deployment smoke is not represented as executed unless it is actually run with an owner-supplied server credential.

## Tasks / Iterations

1. **VERIFIED** — M05.1 Reference characterization.
2. **VERIFIED** — M05.2 Session authorization/provider boundary.
3. **VERIFIED** — M05.3 Browser compatibility + microphone diagnostics.
4. **VERIFIED** — M05.4 Deterministic Web Audio capture.
5. **VERIFIED (REPOSITORY SCOPE)** — M05.5 Provider-neutral realtime transport and Gemini adapter isolation.
6. **VERIFIED** — M05.6 AI audio playback and candidate/provider interruption handling.
7. **VERIFIED** — M05.7 Explicit connection state + accessible controls.
8. **VERIFIED** — M05.8 Deterministic immutable interview-plan runner.
9. **VERIFIED** — M05.9 Pacing/time budget.
10. **VERIFIED** — M05.10 Bounded follow-up policy.
11. **VERIFIED (REPOSITORY SCOPE)** — M05.11 Realtime orchestration and production browser composition.
12. **VERIFIED** — M05.12 Timeout/error recovery.
13. **VERIFIED** — M05.13 Same-authoritative-attempt reconnect and persistence gating.
14. **REPOSITORY ACCEPTANCE COMPLETE** — M05.14 deterministic full browser/E2E closeout. Real Gemini smoke deferred to local/deployment acceptance by explicit owner decision.

## TDD Evidence

Important preserved checkpoints include:

- production Gemini session composition RED/GREEN: `7f9b2f6beb195c48a03595fceb191d0adc83aa3f` → `409a899ce000674b441bd0da2ff8a01d4efc62db`;
- capability-bound realtime progress checkpoint `ce161fbaa34450839ac8f323f6fcc3a33cdc4863`, CI #728 / `34834823096` — GREEN;
- provider-interruption RED `6d22bdf5e1b36a105f151cc6f8698c433854957b`, CI #772 / `34857082289` — intended failure because provider `interrupted` did not stop obsolete playback;
- provider-interruption GREEN `d191b0d6414190c90956b8a964dbc0fbc26f330d`, CI #773 / `34857361292` — complete repository gate GREEN after the minimal orchestration fix;
- durable-document contract failure `3914a347a47090f666a5458014196d9ca9d4a338`, CI #778 / `34859783065` — legitimate NOT GREEN checkpoint caught by the framework verifier.

## Integration Test Evidence

Deterministic production browser acceptance covers authorized launcher/runtime setup, constrained credential non-display, authoritative snapshots, readiness/microphone flows, mute/end controls, mobile no-overflow, safe provider unavailability, provider/candidate interruption, and disconnect→reauthorize same-attempt recovery. Unit/provider/security integration coverage verifies bounded follow-ups, pacing, timeout/error behavior, persistence, stale-generation rejection, capability binding, and provider-interruption playback cancellation.

The corrected pre-closeout branch head `5c8710559ab1c40073843cb9a7909e626d8a0dc3` passed complete CI #781 / `34860464517` before the owner-approved closeout-document reconciliation.

## Security Review

Invitation capability and current consent remain server authorization requirements. Raw capability tokens and long-lived provider secrets are not persisted or logged by M05 production code. Progress is capability-bound and database-authoritative. Candidate content remains untrusted. Technical failure cannot become negative candidate evidence. No autonomous hire/reject decision or protected-trait/emotion/personality/deception/appearance/accent-quality inference is introduced.

## Accessibility Review

Candidate diagnostics and realtime controls expose semantic status/alerts, keyboard-operable controls, labelled mute/end/retry actions, pressed/disabled state, live text, microphone selection, and mobile-safe layout in deterministic browser coverage.

## Performance Review

Capture/playback/transport cleanup is bounded; stale generations are rejected; retry/reconnect bookkeeping is bounded; no unbounded background retry or browser queue is introduced.

## Code Review Findings

- Critical findings: **0 unresolved** at latest recovery.
- Important findings: **0 unresolved** at latest recovery.
- PR #7 has no known unresolved blocking review threads at latest recovery.
- Previously identified authorization, diagnostics wiring, question-authority, progress-authority, malformed-checkpoint, production composition, and provider-interruption findings were fixed and regression-covered.

## Live Provider Acceptance

The real-provider smoke has **not been executed** in repository CI. It requires a real server-side `GEMINI_API_KEY` and controlled environment. The owner will supply that credential locally. Follow `docs/LOCAL-REALTIME-ACCEPTANCE.md` and record only sanitized pass/fail evidence if it is run.

The absence of this external smoke is no longer an M05 repository merge blocker by explicit owner decision. It remains a deployment-readiness check and must not be described as completed until actually executed.

## Fresh Verification Results

- Pre-closeout head `5c8710559ab1c40073843cb9a7909e626d8a0dc3`, CI #781 / `34860464517` — **GREEN** complete repository gate.
- Closeout-document head `1404a6d0a211d8be052a7e8098418b704a221dd9`, CI #788 / `34862420793` — **NOT GREEN**. Frozen install, lint, typecheck, 125 test files / 506 tests, framework-verifier unit tests, and requirements-source-verifier unit tests passed. `scripts/verify_autonomous_framework.py` then correctly rejected this M05 ledger because its closeout rewrite omitted required durable headings. Build/E2E/PRD coverage were skipped after that verifier failure. The downstream `supabase: command not found` cleanup message followed skipped setup and was not the root cause.
- This commit restores the required ledger headings without weakening the verifier. Fresh exact-head CI is required before merge.

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

Recover actual Git/GitHub state first, then read `AGENTS.md`, `CODEX-START-HERE.md`, `docs/AUTONOMOUS-DEVELOPMENT.md`, `docs/progress/STATUS.md`, `docs/progress/KNOWN-ISSUES.md`, `docs/milestones/CURRENT.md`, this milestone ledger, `docs/SESSION-HANDOFF.md`, `docs/requirements/TRACEABILITY.md`, the authoritative requirements/PRD source, and the selected M05 design/plan. Actual Git graph, source/tests, and exact-SHA CI outrank stale Markdown or prior chat/task summaries.

## Completion Checklist

- [x] Requirements and all M05 iterations accounted for at repository scope.
- [x] Deterministic multi-turn/runtime acceptance and production composition covered.
- [x] Required TDD/integration/provider/browser/E2E evidence recorded.
- [x] Security/accessibility/performance/AI-safety reviews complete at repository scope.
- [x] 0 Critical / 0 Important findings at latest closeout recovery.
- [x] Traceability/status/handoff reconciliation complete.
- [ ] Exact-final-head CI green after this framework-contract correction.
- [ ] Final PR head/review/concurrency/mergeability gates green.
- [ ] Authorized PR #7 merge and post-merge `main` verification.

## Next Action

Verify this exact corrected branch head with the complete CI gate. Recheck remote head, reviews, concurrency, and mergeability. If every authorized merge gate passes, mark PR #7 ready and squash-merge it. Then verify post-merge `main`, activate M06 — Transcript + Durable Session, and continue.

## Next Milestone

M06 — Transcript + Durable Session, after M05 merges and post-merge `main` is verified.