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

Active branch: `feat/realtime-ai-interview`
Active PR: #7 — `Build realtime AI interview` — OPEN / DRAFT / unmerged.
Verified base/main: `943e8a5c1dd45dc1652453ddf8ebc4ae31951925`, CI #517 / `34692492691` GREEN.
Selected design: `docs/superpowers/specs/2026-09-12-realtime-ai-interview-design.md`.
Selected plan: `docs/superpowers/plans/2026-09-12-realtime-ai-interview.md`.
CI status: M05.2 RED CI #519 / `34693052261` failed as intended because `src/lib/realtime/session-authorization.ts` did not exist; implementation head `6b562a6ef70ef731f68096002edba81b35f9e73a` passed typecheck and all 353 unit/component tests in CI #520 / `34693110559`, but the repository framework verifier rejected this status file because the required `CI status:` marker was missing. This documentation repair creates a newer head that requires fresh exact-head CI.

## Current Task State

- M05.1 Reference characterization — **VERIFIED**. Talk Tutor pinned at `69b6beee90c8dbd186730389f8a1462c2239fe61`; reusable mechanics and hiring-specific non-reuse/safety decisions are durable in the design.
- M05.2 Session authorization/provider boundary — **ACTIVE**. Initial domain authorization policy has a verified RED and passing focused implementation tests; real server-side invitation/attempt/provider integration remains unfinished.
- M05.3–M05.14 — **NOT STARTED**.

## M05 Safety / Architecture State

- Invitation capability, current disclosure consent, immutable published interviewer version, and one authoritative attempt must gate realtime authorization.
- Raw invitation tokens and long-lived provider secrets must not be persisted or logged.
- Candidate speech/transcript is untrusted content and cannot modify system policy, job criteria, plan order, follow-up bounds, or assessment rules.
- Reconnect resumes the same authoritative attempt and cannot reset the plan.
- Technical failures, microphone/provider/network problems, timeouts, and reconnects must never become negative candidate evidence.
- M05 creates no candidate score and no autonomous hire/reject decision.
- The repository currently has no realtime provider SDK dependency; provider coupling must be justified by authoritative requirements.

## TDD / Verification Evidence

M05.1 is characterization/design and intentionally has no fabricated behavioral RED/GREEN history.

M05.2 RED: `89004863aaa8d5e456d7bed9c9cbd1e1d3f5e0e5`, CI #519 / `34693052261`. Frozen install and lint passed; typecheck failed specifically with TS2307 because `./session-authorization` did not yet exist. The later `supabase stop` failure was secondary because setup was skipped after the intended RED.

M05.2 initial implementation: `6b562a6ef70ef731f68096002edba81b35f9e73a`, CI #520 / `34693110559`. Lint, typecheck, all 94 test files / 353 tests, framework verifier tests, and requirements-source verifier tests passed. The pipeline then failed only because `scripts/verify_autonomous_framework.py` required the literal `CI status:` marker in this file. This commit repairs that durable-state contract; fresh CI is required before treating the implementation checkpoint as fully GREEN.

M04 merge verification: exact `main` SHA `943e8a5c1dd45dc1652453ddf8ebc4ae31951925` passed post-merge CI #517 / `34692492691`, including frozen install, lint, typecheck, unit/component tests, framework/source verification, local Supabase, production build, Chromium E2E, PRD coverage and cleanup.

## Review State

Critical findings: **0 unresolved**.
Important findings: **0 unresolved** so far; M05.2 security/correctness review remains active until lifecycle semantics and the real server/provider boundary are verified.
The initial authorization module issues credentials only after invitation availability, current consent, immutable version and authoritative attempt readiness; raw invitation tokens are not returned in its result.

## Blockers

No external product blocker. The local Codex execution bridge was transiently unavailable earlier in this run; GitHub mutation and CI remain operational, so durable progress continues through the repository. Do not claim local command evidence that did not run.

## Durable Recovery

Recover actual Git/PR/CI first, then read `AGENTS.md`, `CODEX-START-HERE.md`, `docs/AUTONOMOUS-DEVELOPMENT.md`, this file, `docs/progress/KNOWN-ISSUES.md`, `docs/milestones/CURRENT.md`, `docs/milestones/M05-realtime-ai-interview.md`, `docs/SESSION-HANDOFF.md`, requirements/traceability, and the selected M05 design/plan.

Exact next work: verify fresh CI after this status repair, inspect invitation lifecycle/consent semantics, add a positive authorization contract, then implement the real server-side session/attempt/provider boundary for M05.2 with strict TDD. Do not advance to M05.3 until M05.2 is genuinely verified.
