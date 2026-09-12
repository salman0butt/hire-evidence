# M05 — Realtime AI Interview

Status: **ACTIVE**

## Goal
Deliver the authoritative PRD milestone below as a reviewable, evidence-backed capability.

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
Candidate Invitations; published Interviewer Builder configuration.

## In Scope
The authoritative definition plus every default iteration listed below.

## Out of Scope
Later milestones, speculative abstractions, and behavior not justified by the PRD.

## Architecture Notes
Server-authorized realtime session setup with browser diagnostics, deterministic audio lifecycle, provider transport abstraction only where justified, explicit connection state machine, pacing budgets, bounded follow-ups, reconnect and failure recovery. Candidate speech remains untrusted data; the immutable invitation-bound interviewer version is authoritative. Technical failures must never lower candidate evaluation.

## Selected Design / Implementation Plan
- Design: `docs/superpowers/specs/2026-09-12-realtime-ai-interview-design.md`
- Plan: `docs/superpowers/plans/2026-09-12-realtime-ai-interview.md`
- Talk Tutor reference pinned at `69b6beee90c8dbd186730389f8a1462c2239fe61`.

## Acceptance Criteria
- PRD deliverables and exit criteria pass.
- All required iterations are complete or explicitly resolved.
- Relevant security/privacy/tenancy/accessibility/performance/AI-safety gates pass.
- 0 unresolved Critical or Important review findings.
- Traceability and feature state are reconciled.
- Exact-final-head CI is green.

## Tasks / Iterations
1. **VERIFIED** — M05.1 — Reference characterization: Talk Tutor server token, state, Web Audio capture/playback, interruption and teardown patterns characterized; reuse/non-reuse and hiring safety boundaries recorded in the selected design.
2. **ACTIVE** — M05.2 — Session authorization/provider boundary: domain authorization plus authoritative invitation-bound attempt persistence/RPC are implemented and verified; public API wiring and short-lived provider-token issuer remain.
3. **NOT STARTED** — M05.3 — Browser compatibility + microphone diagnostics: feature detection, permission/input/level/network readiness.
4. **NOT STARTED** — M05.4 — Web Audio capture: deterministic audio capture lifecycle.
5. **NOT STARTED** — M05.5 — Realtime transport: provider connect/send/receive lifecycle.
6. **NOT STARTED** — M05.6 — AI audio playback: output queue and clean teardown.
7. **NOT STARTED** — M05.7 — Connection state machine: explicit idle/diagnosing/authorizing/connecting/connected/recovering/ended/error states.
8. **NOT STARTED** — M05.8 — Interview-plan execution: deterministic sections/questions and phase transitions.
9. **NOT STARTED** — M05.9 — Pacing/time budget: remaining time and graceful section/interview completion.
10. **NOT STARTED** — M05.10 — Bounded follow-ups: neutral clarification/example/missing-dimension rules.
11. **NOT STARTED** — M05.11 — Barge-in: stop AI playback when candidate interrupts without corrupting authoritative plan state.
12. **NOT STARTED** — M05.12 — Timeout/error handling: browser/provider/microphone failures.
13. **NOT STARTED** — M05.13 — Reconnect: bounded recovery into the same authoritative attempt.
14. **NOT STARTED** — M05.14 — Full realtime E2E: stable multi-turn voice interview across failure scenarios.

## TDD Evidence
M05.1 is characterization/design work and has no fabricated behavioral RED/GREEN evidence.

M05.2 authorization-module RED: `89004863aaa8d5e456d7bed9c9cbd1e1d3f5e0e5`, CI #519 / `34693052261`, failed for the intended missing `session-authorization` implementation.

M05.2 persistence RED: `02ed8e228cfd67ee24f6deb1badab4169beb1e6e`, CI #524 / `34693510005`, failed exactly because `202609120017_realtime_interview_sessions.sql` did not exist.

M05.2 persistence implementation: `0239ce3054856012b9630ebdcfb5127f5b5509c2` created one invitation-bound authoritative attempt with token-hash, consent, immutable-version and lifecycle gating.

M05.2 security-review RED: `17de3f6f93c25037dbcb9aaa1395a9c623ea9fe0`, CI #526 / `34693860526`, had 357 passing tests and one intended failure proving the anonymous-capable authorization RPC returned too much data (`public.interview_attempts`) instead of only an opaque UUID.

M05.2 security GREEN: `ac529449ab3a9ad8a87500700995445b66472f98`, CI #527 / `34693998554`, passed the complete repository gate after narrowing the RPC result to `uuid`.

## Integration Test Evidence
CI #527 successfully started local Supabase with the new migration, proving the attempt schema/function applies against the repository migration chain; production build and Chromium E2E also passed.

## E2E / Visual Verification
Current repository E2E is GREEN at the M05.2 persistence checkpoint. Milestone-specific realtime E2E remains pending for M05.14: successful multi-turn completion plus microphone denial/recovery, barge-in, timeout, provider interruption, bounded reconnect, mobile/no-overflow and keyboard/status coverage.

## Security Review
The implemented authorization slice requires invitation capability + current consent + immutable interviewer version + one authoritative attempt. Raw invitation/provider secrets are not persisted. `interview_attempts` has RLS and no browser table grants. A review-found Important issue—returning the complete attempt row through an anon-capable security-definer RPC—was fixed so only the opaque attempt UUID is returned. No unresolved Critical/Important findings remain for this slice.

## Accessibility Review
No new candidate UI was introduced in this slice. The selected design still requires semantic status/error states, keyboard-accessible mute/end/retry/device controls, visible non-audio connection state, and narrow viewport coverage in later tasks.

## Performance Review
Attempt authorization uses a unique invitation constraint and one create/resume operation; no unbounded collection/queue is introduced. Later realtime work must preserve bounded queues, follow-ups, retries and event accumulation.

## AI / Eval Review
Technical failures must never lower candidate scores. Interview behavior must remain job-related, bounded by the immutable plan and guardrails, and robust to candidate prompt injection. M05 introduces no autonomous hire/reject decision or candidate score.

## Code Review Findings
- Important — fixed: anonymous-capable realtime authorization RPC originally returned the complete `interview_attempts` row. Regression RED `17de3f6…`; fix GREEN `ac529449…` returns only the opaque attempt UUID while preserving no direct browser table grants.
- Critical: 0 unresolved.
- Important: 0 unresolved for the implemented slice.

## Fixes / Re-review
The security regression and complete CI #527 confirm the narrowed result contract and migration validity. M05.2 remains ACTIVE because API/provider-token integration is not yet complete.

## Fresh Verification Commands
Run repository-wide verification plus milestone-specific tests. Baseline:

```bash
pnpm lint
pnpm typecheck
pnpm test
pnpm build
pnpm e2e
python3 scripts/verify_autonomous_framework.py
python3 scripts/verify_prd_coverage.py
```

## Fresh Verification Results
Exact implementation SHA `ac529449ab3a9ad8a87500700995445b66472f98` passed CI #527 / `34693998554`, including install, lint, typecheck, unit/component tests, framework/source verification, local Supabase startup/migrations, build, Chromium E2E, PRD coverage and cleanup. Subsequent durable documentation commits require fresh exact-head CI.

## Commits / Files Changed
- `7dcbaac0fc84e1843e7867feb8f076c43dbebb3f` — realtime interview design/reference characterization.
- `671ee4826df39cc45ed14463b1f8251dd5ce5982` — executable M05 implementation plan.
- `0239ce3054856012b9630ebdcfb5127f5b5509c2` — authoritative realtime attempt persistence/RPC.
- `17de3f6f93c25037dbcb9aaa1395a9c623ea9fe0` — security regression RED for narrow RPC output.
- `ac529449ab3a9ad8a87500700995445b66472f98` — narrow RPC result GREEN.

## Known Limitations
No realtime provider SDK is currently present in the application dependency set. Provider selection/SDK coupling must be justified by authoritative requirements rather than inferred from the Talk Tutor reference. Public realtime-session route and short-lived provider credential issuance are still unfinished M05.2 work.

## Documentation Updated
Design, implementation plan, milestone ledger, project status and session handoff carry the M05 recovery/evidence state.

## Durable Recovery Sources
`AGENTS.md` → `docs/AUTONOMOUS-DEVELOPMENT.md` → `docs/progress/STATUS.md` → known issues → this ledger → relevant PRD → selected spec/plan → active PR/reviews/exact-head CI → source/tests.

## Completion Checklist
- [ ] Requirements and iterations accounted for.
- [ ] Acceptance criteria verified.
- [ ] Required TDD/integration/E2E evidence recorded.
- [ ] Security/accessibility/performance/AI-eval reviews complete where relevant.
- [ ] 0 Critical / 0 Important findings.
- [ ] Traceability/feature matrix reconciled.
- [ ] Exact-final-head CI green.
- [ ] Durable status/closeout state current.

## Next Action
Continue M05.2 with strict TDD for the public realtime-session API/server repository boundary. Prove constant-safe unavailable responses, no raw capability/log leakage, and a narrow successful session projection; then implement provider-neutral server wiring and the injected short-lived provider-token issuer without choosing a provider absent authoritative justification.

## Next Milestone
M06 — Transcript + Durable Session.
