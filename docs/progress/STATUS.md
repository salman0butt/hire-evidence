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
CI status: exact implementation head `ac529449ab3a9ad8a87500700995445b66472f98` passed CI #527 / `34693998554` end-to-end: frozen install, lint, typecheck, 95 Vitest files / 358 tests, framework and requirements-source verifiers, autonomous-framework verification, local Supabase migration startup, production build, Chromium E2E, PRD coverage, and cleanup. This status reconciliation creates a newer docs-only head that requires fresh exact-head CI before any integration-readiness claim.

## Current Task State

- M05.1 Reference characterization — **VERIFIED**. Talk Tutor pinned at `69b6beee90c8dbd186730389f8a1462c2239fe61`; reusable mechanics and hiring-specific non-reuse/safety decisions are durable in the design.
- M05.2 Session authorization/provider boundary — **ACTIVE**. Domain authorization is implemented and tested; the authoritative attempt migration/RPC now creates or resumes one invitation-bound attempt, requires active invitation + current disclosure consent + immutable interviewer version, atomically advances the invitation to `started`, stores no raw capability token, exposes no attempt-table grants to browser roles, and returns only the opaque attempt UUID. The API route and short-lived provider-token issuer remain unfinished.
- M05.3–M05.14 — **NOT STARTED**.

## M05 Safety / Architecture State

- Invitation capability, current disclosure consent, immutable published interviewer version, and one authoritative attempt gate realtime authorization.
- Raw invitation tokens and long-lived provider secrets are not persisted or logged.
- Candidate speech/transcript is untrusted content and cannot modify system policy, job criteria, plan order, follow-up bounds, or assessment rules.
- Reconnect resumes the same authoritative attempt and cannot reset the plan.
- Technical failures, microphone/provider/network problems, timeouts, and reconnects must never become negative candidate evidence.
- M05 creates no candidate score and no autonomous hire/reject decision.
- No realtime provider SDK is present; provider selection/SDK coupling remains intentionally deferred until justified by authoritative requirements.

## TDD / Verification Evidence

M05.1 is characterization/design and intentionally has no fabricated behavioral RED/GREEN history.

M05.2 authorization-module RED: `89004863aaa8d5e456d7bed9c9cbd1e1d3f5e0e5`, CI #519 / `34693052261`, failed for the intended missing `session-authorization` implementation. Initial implementation later passed focused tests but needed durable-state verifier repair.

M05.2 persistence RED: `02ed8e228cfd67ee24f6deb1badab4169beb1e6e`, CI #524 / `34693510005`. Lint/typecheck passed; unit tests failed exactly because `supabase/migrations/202609120017_realtime_interview_sessions.sql` did not exist.

M05.2 persistence implementation: `0239ce3054856012b9630ebdcfb5127f5b5509c2` added authoritative attempt persistence and the token-hash/consent/version-bound RPC.

M05.2 security-review RED: `17de3f6f93c25037dbcb9aaa1395a9c623ea9fe0`, CI #526 / `34693860526`. Install/lint/typecheck passed; 357 tests passed and exactly one new regression failed because the anonymous-capable RPC returned a full `interview_attempts` row instead of only an opaque UUID.

M05.2 security fix GREEN: `ac529449ab3a9ad8a87500700995445b66472f98`, CI #527 / `34693998554` — complete repository gate GREEN including Supabase migration application, build, E2E, and PRD coverage.

M04 merge verification: exact `main` SHA `943e8a5c1dd45dc1652453ddf8ebc4ae31951925` passed post-merge CI #517 / `34692492691`.

## Review State

Critical findings: **0 unresolved**.
Important findings: **0 unresolved** for the implemented attempt-persistence slice. Security review identified one Important exposure (full attempt-row return from an anonymous-capable RPC); it was fixed by returning only the opaque attempt UUID and verified by CI #527.
M05.2 overall remains active until the server API/provider-token boundary is implemented and reviewed.

## Blockers

No external blocker for provider-neutral server/API work. Provider-specific SDK integration is not yet justified by authoritative requirements and must not be guessed merely to advance the milestone.

## Durable Recovery

Recover actual Git/PR/CI first, then read `AGENTS.md`, `CODEX-START-HERE.md`, `docs/AUTONOMOUS-DEVELOPMENT.md`, this file, `docs/progress/KNOWN-ISSUES.md`, `docs/milestones/CURRENT.md`, `docs/milestones/M05-realtime-ai-interview.md`, `docs/SESSION-HANDOFF.md`, requirements/traceability, and the selected M05 design/plan.

Exact next work: continue M05.2 with strict TDD for the public realtime-session API/server repository boundary: prove the route returns a constant-safe unavailable response without raw capability/log leakage and returns only the narrow authorized session projection on success; then implement the minimal provider-neutral route/repository wiring and injected short-lived provider-token issuer. Do not advance to M05.3 until M05.2 is genuinely verified.
