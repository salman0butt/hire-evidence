# Project Status

Last reconciled: 2026-09-13

## Completed Milestones

- Product Foundation — **COMPLETE**. PR #2 merged as `64ebeb4f7b2a39fc0557685ef34035650211aad9`.
- SaaS Shell + Auth — **COMPLETE**. PR #3 merged as `ed10e1b55bb62cf202585c8c50e6487014e83c29`.
- Organizations + RBAC — **COMPLETE**. PR #4 merged as `835d7d571a69cd13e3e802be4872e873ffdd34fe`.
- Jobs + Interviewer Builder — **COMPLETE**. PR #5 merged as `729474ffb03075c93dfa2564f0004f1590533753`.
- Candidates + Invitations — **COMPLETE**. PR #6 merged as `943e8a5c1dd45dc1652453ddf8ebc4ae31951925`; post-merge CI #517 / `34692492691` passed the full repository gate.

## Current Milestone

Realtime AI Interview — **ACTIVE**.

Active branch: `feat/realtime-ai-interview`
Active PR: #7 — `Build realtime AI interview` — OPEN / DRAFT / unmerged.
Verified base/main: `943e8a5c1dd45dc1652453ddf8ebc4ae31951925`.
Latest verified browser head: `1c4635618aa1d3471284ca30cfb8658981afdd94`.
CI status: CI #682 / `34734661625` passed the complete repository gate on `1c4635618aa1d3471284ca30cfb8658981afdd94`: frozen install, lint, typecheck, 480 unit/component tests, framework/source verifiers, local Supabase startup/migrations, production build, 25 Chromium E2E tests, PRD coverage, and cleanup.

Selected design: `docs/superpowers/specs/2026-09-12-realtime-ai-interview-design.md`.
Selected plan: `docs/superpowers/plans/2026-09-12-realtime-ai-interview.md`.

## Current Task State

- M05.1 Reference characterization — **VERIFIED**.
- M05.2 Session authorization/provider boundary — **ACTIVE / PARTIALLY VERIFIED**. Provider-neutral authorization and attempt boundaries are verified; provider-specific production credential issuance remains blocked because no authoritative realtime provider is selected.
- M05.3 Browser compatibility + microphone diagnostics — **VERIFIED**.
- M05.4 Deterministic Web Audio capture — **VERIFIED**.
- M05.5 Provider-neutral realtime transport — **VERIFIED (provider-neutral scope)**. Provider adapter remains blocked pending authoritative provider selection.
- M05.6 AI audio playback — **VERIFIED**.
- M05.7 Explicit connection state machine + accessible controls — **VERIFIED**.
- M05.8 Deterministic interview-plan runner — **VERIFIED**.
- M05.9 Pacing/time budget — **VERIFIED**.
- M05.10 Bounded follow-ups — **VERIFIED**.
- M05.11 Realtime interview orchestration — **ACTIVE / PARTIALLY VERIFIED**. Deterministic multi-turn progression, barge-in routing, generation-scoped stale callback rejection, safe candidate projection, and presentation are verified. Production page/transport composition remains dependent on provider selection.
- M05.12 Timeout/error recovery — **VERIFIED (provider-neutral scope)**.
- M05.13 Same-attempt reconnect — **VERIFIED (provider-neutral scope)**. Server-authoritative attempt checkpoints, idempotent processed event IDs, capability-bound progress RPCs, immutable-plan restoration, stale-generation rejection, and runtime persistence gating are implemented. Local progression waits for authoritative persistence, consumes the returned server checkpoint, fails closed on conflicts/rejections/malformed checkpoints, and does not fabricate candidate evidence. Provider-backed reconnect integration remains blocked by provider selection.
- M05.14 Full realtime E2E / milestone closeout — **ACTIVE / PARTIALLY VERIFIED**. `e2e/realtime-interview.spec.ts` now exercises the real candidate invitation page on a mobile viewport and proves keyboard focus, microphone denial, explicit retry recovery, input enumeration/selection, no horizontal overflow, and that readiness checks do not start recording. Stable provider-backed multi-turn voice completion remains blocked until an authoritative realtime provider is selected/configured.

## TDD / Verification Evidence

Earlier M05 evidence remains preserved in `docs/milestones/M05-realtime-ai-interview.md` and Git history.

M05.14 browser checkpoints:
- `829d9d92c3f9b92d32944b54622436b1a54b63a5`, CI #681 / `34734365068` — **NOT GREEN**. New realtime browser scenario reached E2E; 24 existing browser tests passed, but the assertion used an ambiguous `role=alert` locator that also matched Next.js's route announcer.
- `1c4635618aa1d3471284ca30cfb8658981afdd94`, CI #682 / `34734661625` — reviewed browser GREEN. Locator is scoped to the technical-check alert; full repository gate passed with 25 Chromium E2E tests.

Recent M05.13 checkpoints:
- authoritative progress repository RED: `87406dc5d0186d5f28f3b8d5cdd5f19c9f50b2b1`, CI #665 / `34732181229` — progress persistence repository boundary absent.
- initial repository GREEN: `41d35ab89d24ef8b093c37c47a1dc8261f3285d1`, CI #666 / `34732252665` — full repository gate GREEN.
- authority review RED: `a2cf5eb633751d58cfcf3e3fb0b2e657504cc00a`, CI #667 / `34732505070` — repository trusted a caller-supplied interviewer version.
- reviewed repository GREEN: `576d5dbad4138b85876eeac22ddfe8e7247381ce`, CI #669 / `34732650018` — authoritative attempt version is returned and consumed; full repository gate GREEN.
- runtime persistence RED: `f3b01a0e1f3f9ca17cf5058aea73816f6e639d49`, CI #671 / `34732962547` — orchestration tests required a persistence boundary production code did not expose.
- runtime persistence implementation: `cff7cc7e0c3c5ce0db27319bc4728811c7a1f53c` — local advancement waits for authoritative persistence and consumes the returned checkpoint.
- persistence review RED: `a0fcda2590020b4bd574dcd342a3aec308e34300`, CI #673 / `34733342412` — malformed authoritative checkpoint threw instead of failing closed.
- reviewed GREEN: `5e9328d2f945cd10eaecea312896f29fbc93b10e`, CI #674 / `34733465242` — malformed/conflicting/rejected persistence cannot advance or crash local plan state; complete repository gate GREEN.

## Review State

Critical findings: **0 unresolved** for implemented M05 slices.
Important findings: **0 unresolved** for verified provider-neutral slices through the latest M05.14 browser slice.
PR #7 had no unresolved review threads at the latest recovery.

The M05.14 CI #681 failure was a test-locator defect rather than a product defect. Systematic debugging identified the Next.js route announcer as the second `role=alert`; the minimal scoped-locator fix is exact-head verified by CI #682.

## Blockers / Constraints

- Provider-specific production credential issuance, provider adapter composition, live page wiring, and provider-backed reconnect/E2E remain blocked until an authoritative realtime provider is selected/configured.
- This blocker does not justify inventing a provider or weakening authorization/safety boundaries.
- Deterministic provider-neutral verification, documentation reconciliation, and other work that does not depend on provider behavior may continue.

## Durable Recovery

Recover actual Git/PR/CI first, then read `AGENTS.md`, `CODEX-START-HERE.md`, `docs/AUTONOMOUS-DEVELOPMENT.md`, this file, `docs/progress/KNOWN-ISSUES.md`, `docs/milestones/CURRENT.md`, `docs/milestones/M05-realtime-ai-interview.md`, `docs/SESSION-HANDOFF.md`, requirements/traceability, and the selected M05 design/plan. Git/code/current exact-SHA CI outrank stale Markdown.

Exact next work: continue M05.14 with the next largest deterministic browser/E2E slice that exercises real candidate-facing behavior without fabricating provider coupling. Do not merge PR #7 while the stable live multi-turn provider path remains unresolved.
