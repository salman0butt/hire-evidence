# Session Handoff

This compatibility handoff never outranks actual Git/code/current exact-SHA CI. Recover `AGENTS.md` and `docs/AUTONOMOUS-DEVELOPMENT.md`, then actual GitHub state before trusting this file.

## Current repository state

- Repository: `salman0butt/hire-evidence`
- Default branch: `main`
- Current verified main SHA: `729474ffb03075c93dfa2564f0004f1590533753`; M03 PR #5 squash-merged and post-merge CI #432 / `34677775158` passed.
- Active branch: `feat/candidates-invitations`
- Active PR: #6 — `Build candidates and secure invitations` — OPEN / DRAFT / unmerged.
- M04.2 provider-verification head `af46174165c6a90f0fb03525afb0ffa0bbfba128` passed CI #451 / `34681517870` across the complete repository quality gate.
- Durable documentation reconciliation creates newer heads; recover current exact branch/CI before writing.

## Current milestone

M04 — Candidates + Invitations is IN PROGRESS.

- M04.1 Candidate records — VERIFIED.
- M04.2 Secure token service + invitation persistence — VERIFIED with strict RED/GREEN evidence and provider-backed uniqueness/tenant/browser-boundary checks.
- M04.3 Invitation lifecycle — NEXT.
- M04.4–M04.8 — NOT STARTED.

Key M04.2 evidence is recorded in `docs/milestones/M04-candidates-invitations.md`. Raw invitation tokens are generated from 32 random bytes and never persisted; SHA-256 hashes are stored, invitation rows are tenant/job/candidate/immutable-version bound, RLS is enabled, anon has no table access, and authenticated browser mutation is denied.

## Review / blockers

- Critical findings: 0 unresolved for completed M04.1–M04.2 work.
- Important findings: 0 unresolved for completed M04.1–M04.2 work.
- Latest GitHub recovery found no unresolved review threads.
- No external blocker. M04 remains incomplete by scope.

## Exact next work

Recover the exact current PR head and CI. Then start M04.3 with strict TDD: write the smallest meaningful failing test for monotonic `draft -> sent -> opened -> started -> completed` invitation transitions and terminal denial after expiry/revocation/completion; verify real RED; implement authoritative database transition enforcement; verify full GREEN; review security/replay behavior; update durable evidence; then continue directly to M04.4.
