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

## Iterations

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

## TDD / Verification Evidence

Important preserved checkpoints include:

- production Gemini session composition RED/GREEN: `7f9b2f6beb195c48a03595fceb191d0adc83aa3f` → `409a899ce000674b441bd0da2ff8a01d4efc62db`;
- capability-bound realtime progress checkpoint `ce161fbaa34450839ac8f323f6fcc3a33cdc4863`, CI #728 / `34834823096` — GREEN;
- provider-interruption RED `6d22bdf5e1b36a105f151cc6f8698c433854957b`, CI #772 / `34857082289` — intended failure because provider `interrupted` did not stop obsolete playback;
- provider-interruption GREEN `d191b0d6414190c90956b8a964dbc0fbc26f330d`, CI #773 / `34857361292` — complete repository gate GREEN after the minimal orchestration fix;
- durable-document contract failure `3914a347a47090f666a5458014196d9ca9d4a338`, CI #778 / `34859783065` — legitimate NOT GREEN checkpoint caught by the framework verifier;
- corrected pre-closeout head `5c8710559ab1c40073843cb9a7909e626d8a0dc3`, CI #781 / `34860464517` — complete repository gate GREEN.

Deterministic browser acceptance covers production launcher/runtime setup, constrained credential non-display, authoritative snapshots, readiness/microphone flows, mute/end controls, mobile no-overflow, safe provider unavailability, interruption handling, and disconnect→reauthorize same-attempt recovery. Unit/provider/security coverage verifies bounded follow-ups, pacing, timeout/error behavior, persistence, stale-generation rejection, and provider-interruption playback cancellation.

## Review State

- Critical findings: **0 unresolved** at latest recovery.
- Important findings: **0 unresolved** at latest recovery.
- PR #7 has no known unresolved blocking review threads at latest recovery.
- Previously identified authorization, diagnostics wiring, question-authority, progress-authority, malformed-checkpoint, production composition, and provider-interruption findings were fixed and regression-covered.

## Security / Privacy / Accessibility / Performance

Invitation capability and current consent remain server authorization requirements. Raw capability tokens and long-lived provider secrets are not persisted or logged by M05 production code. Progress is capability-bound and database-authoritative. Candidate content remains untrusted. Technical failure cannot become negative candidate evidence.

Candidate diagnostics and realtime controls expose semantic status/alerts, keyboard-operable controls, labelled mute/end/retry actions, pressed/disabled state, live text, microphone selection, and mobile-safe layout in deterministic browser coverage.

Capture/playback/transport cleanup is bounded; stale generations are rejected; retry/reconnect bookkeeping is bounded; no unbounded background retry or browser queue is introduced.

## Live Provider Acceptance

The real-provider smoke has **not been executed** in repository CI. It requires a real server-side `GEMINI_API_KEY` and controlled environment. The owner will supply that credential locally. Follow `docs/LOCAL-REALTIME-ACCEPTANCE.md` and record only sanitized pass/fail evidence if it is run.

The absence of this external smoke is no longer an M05 repository merge blocker by explicit owner decision. It remains a deployment-readiness check and must not be described as completed until actually executed.

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
- [x] Requirements and all M05 iterations accounted for at repository scope.
- [x] Deterministic multi-turn/runtime acceptance and production composition covered.
- [x] Required TDD/integration/provider/browser/E2E evidence recorded.
- [x] Security/accessibility/performance/AI-safety reviews complete at repository scope.
- [x] 0 Critical / 0 Important findings at latest closeout recovery.
- [ ] Traceability/status/handoff reconciliation commit complete.
- [ ] Exact-final-head CI green after closeout reconciliation.
- [ ] Final PR head/review/concurrency/mergeability gates green.
- [ ] Authorized PR #7 merge and post-merge `main` verification.

## Next Action
Finish durable closeout reconciliation, verify the exact final PR head with the complete CI gate, recheck reviews/concurrency/mergeability, then execute the authorized M05 merge. After merge, verify `main`, activate M06, and continue.

## Next Milestone
M06 — Transcript + Durable Session, after M05 merges and post-merge `main` is verified.