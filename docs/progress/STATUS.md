# Project Status

Last reconciled: 2026-09-12

## Completed Milestones

- Product Foundation — **COMPLETE**. PR #2 merged as `64ebeb4f7b2a39fc0557685ef34035650211aad9`; post-merge CI #57 passed.
- SaaS Shell + Auth — **COMPLETE**. PR #3 squash-merged as `ed10e1b55bb62cf202585c8c50e6487014e83c29`; post-merge CI #157 passed.
- Organizations + RBAC — **COMPLETE**. PR #4 squash-merged as `835d7d571a69cd13e3e802be4872e873ffdd34fe`; post-merge CI #232 / `34624252208` passed.
- Jobs + Interviewer Builder — **COMPLETE**. PR #5 squash-merged as `729474ffb03075c93dfa2564f0004f1590533753`; post-merge CI #432 / `34677775158` passed.
- Candidates + Invitations — **COMPLETE**. PR #6 squash-merged as `943e8a5c1dd45dc1652453ddf8ebc4ae31951925`; post-merge CI #517 / `34692492691` passed the full repository gate.

## Current Milestone

Realtime AI Interview — **ACTIVE** on `feat/realtime-ai-interview`.

Active PR: #7 — `Build realtime AI interview` — OPEN / DRAFT / unmerged.
Verified base/main: `943e8a5c1dd45dc1652453ddf8ebc4ae31951925`, CI #517 / `34692492691` GREEN.
Selected design: `docs/superpowers/specs/2026-09-12-realtime-ai-interview-design.md`.
Selected plan: `docs/superpowers/plans/2026-09-12-realtime-ai-interview.md`.
Latest exact verified branch SHA: `e821c88beec11e76a990b621b57c833cee455e00`, CI #545 / `34698304817` GREEN through frozen install, lint, typecheck, unit/component tests, framework/source verifiers, local Supabase migrations, production build, Chromium E2E, PRD coverage, and cleanup.

## Current Task State

- M05.1 Reference characterization — **VERIFIED**. Talk Tutor is pinned at `69b6beee90c8dbd186730389f8a1462c2239fe61`; reuse/non-reuse and hiring-safety decisions are durable in the selected design.
- M05.2 Session authorization/provider boundary — **ACTIVE / PARTIALLY VERIFIED**. Invitation/consent/version authorization, one-authoritative-attempt persistence, hashed capability repository boundary, constant-safe handler, and short-lived provider-token lifetime enforcement are implemented. The actual Next.js route/provider adapter remains intentionally uncomposed because no authoritative realtime provider selection/SDK/config exists; do not guess a vendor merely to close the task.
- M05.3 Browser compatibility + microphone diagnostics — **ACTIVE**. Pure fail-closed capability diagnostics are RED/GREEN verified; client-side acquisition/input-level/network readiness, accessible diagnostics UI, page integration, keyboard and narrow-viewport verification remain.
- M05.4–M05.14 — **NOT STARTED**.

## M05 Safety / Architecture State

- Invitation capability, current disclosure consent, immutable published interviewer version, and one authoritative attempt gate realtime authorization.
- Raw invitation tokens and long-lived provider secrets are not persisted or logged.
- Candidate speech/transcript is untrusted content and cannot modify system policy, job criteria, plan order, follow-up bounds, or assessment rules.
- Reconnect resumes the same authoritative attempt and cannot reset the plan.
- Technical failures, microphone/provider/network problems, timeouts, and reconnects must never become negative candidate evidence.
- M05 creates no candidate score and no autonomous hire/reject decision.
- Provider coupling remains behind an injected boundary until authoritative requirements justify a provider.

## TDD / Verification Evidence

- M05.2 authorization RED: `89004863aaa8d5e456d7bed9c9cbd1e1d3f5e0e5`, CI #519 / `34693052261`.
- M05.2 persistence RED: `02ed8e228cfd67ee24f6deb1badab4169beb1e6e`, CI #524 / `34693510005`.
- M05.2 security-review RED: `17de3f6f93c25037dbcb9aaa1395a9c623ea9fe0`, CI #526 / `34693860526`.
- M05.2 security GREEN: `ac529449ab3a9ad8a87500700995445b66472f98`, CI #527 / `34693998554`.
- M05.2 later provider-neutral route-handler/token/repository work reached `c10a4a888454fe9c3612c869d8c6ba7b7b040cd6`, CI #543 / `34696198083` GREEN across the full repository gate.
- M05.3 diagnostics RED: `c23a89c66d97c97f8a9be45e135bc8c1d0268950`, CI #544 / `34698263217`; lint passed and typecheck failed exactly because `./diagnostics` did not yet exist. The later Supabase cleanup error was cascading after setup was skipped and was not the RED cause.
- M05.3 diagnostics GREEN: `e821c88beec11e76a990b621b57c833cee455e00`, CI #545 / `34698304817` — complete repository gate GREEN.

## Review State

Critical findings: **0 unresolved**.
Important findings: **0 unresolved** for implemented M05 slices. The earlier anonymous-capable RPC full-row exposure was fixed by returning only the opaque attempt UUID.
PR #7 currently has no submitted reviews or unresolved review threads.

## Blockers

- M05.2 production provider issuance/route composition requires an authoritative provider choice and associated configuration; none exists in current requirements/source/dependencies. Preserve the provider-neutral boundary rather than inventing one.
- This does not block independent M05.3 browser-diagnostics work.

## Durable Recovery

Recover actual Git/PR/CI first, then read `AGENTS.md`, `CODEX-START-HERE.md`, `docs/AUTONOMOUS-DEVELOPMENT.md`, this file, `docs/progress/KNOWN-ISSUES.md`, `docs/milestones/CURRENT.md`, `docs/milestones/M05-realtime-ai-interview.md`, `docs/SESSION-HANDOFF.md`, requirements/traceability, and the selected M05 design/plan.

Exact next work: continue M05.3 with strict TDD for accessible candidate-facing diagnostics and browser microphone readiness while keeping M05.2 provider selection explicitly unresolved. Do not mark either iteration verified until its full acceptance boundary is complete.
