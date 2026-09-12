# Session Handoff

This compatibility handoff never outranks actual Git/code/current exact-SHA CI. Recover `AGENTS.md` and `docs/AUTONOMOUS-DEVELOPMENT.md`, then actual GitHub state before trusting this file.

## Current repository state

- Repository: `salman0butt/hire-evidence`
- Default branch: `main`
- Current verified main SHA: `729474ffb03075c93dfa2564f0004f1590533753`; M03 PR #5 squash-merged and post-merge CI #432 / `34677775158` passed.
- Active branch: `feat/candidates-invitations`
- Active PR: #6 — `Build candidates and secure invitations` — OPEN / DRAFT / unmerged.
- M04.3 lifecycle provider-verification head `d8c5317c1d5a28aaec89a826002847db96ed9cdf` passed CI #460 / `34682867624` across the complete repository quality gate.
- Durable documentation reconciliation creates newer heads; recover current exact branch/CI before writing.

## Current milestone

M04 — Candidates + Invitations is IN PROGRESS.

- M04.1 Candidate records — VERIFIED.
- M04.2 Secure token service + invitation persistence — VERIFIED with strict RED/GREEN evidence and provider-backed uniqueness/tenant/browser-boundary checks.
- M04.3 Invitation lifecycle — VERIFIED with database-authoritative monotonic transitions, transition timestamps, cross-tenant denial, and expired/revoked/completed replay denial.
- M04.4 Public invitation resolution — NEXT.
- M04.5–M04.8 — NOT STARTED.

Lifecycle evidence: RED `792e56f422e1f77be6967facca73e69388314340` / CI #456 failed exactly because the lifecycle migration was absent. Schema GREEN was established at `9267e97d7467af5049a2c0ac7cf95b4b3e3cb465` / CI #458. Provider checkpoint `9d97ec54c1fd2872fca62b9abe1e7290427d4264` / CI #459 was NOT GREEN because the revoked-row test fixture set `revoked_at` before the database default `created_at`; the fixture was corrected without weakening the production constraint. Exact provider GREEN is `d8c5317c1d5a28aaec89a826002847db96ed9cdf` / CI #460.

## Review / blockers

- Critical findings: 0 unresolved for completed M04.1–M04.3 work.
- Important findings: 0 unresolved for completed M04.1–M04.3 work.
- Latest GitHub recovery found no unresolved review threads.
- M04.3 manager lifecycle authority is not exposed anonymously. M04.4 must introduce a separate narrowly scoped token-resolution boundary rather than broadening table/RPC privileges.
- No external blocker. M04 remains incomplete by scope.

## Exact next work

Recover the exact current PR head and CI. Then start M04.4 with strict TDD: require invalid, expired, revoked and completed raw tokens to return the same safe failure shape; require raw-token hashing server-side; resolve at most one invitation; expose only the safe public projection; and avoid any service-role browser client or public table grant. Verify real RED, implement the minimal server-only/public-RPC boundary, verify full GREEN/provider behavior, reconcile evidence, then continue directly to M04.5.
