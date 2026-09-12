# Project Status

Last reconciled: 2026-09-12

## Completed Milestones

- Product Foundation — **COMPLETE**. PR #2 merged as `64ebeb4f7b2a39fc0557685ef34035650211aad9`; post-merge CI #57 passed.
- SaaS Shell + Auth — **COMPLETE**. PR #3 squash-merged as `ed10e1b55bb62cf202585c8c50e6487014e83c29`; post-merge CI #157 passed.
- Organizations + RBAC — **COMPLETE**. PR #4 squash-merged as `835d7d571a69cd13e3e802be4872e873ffdd34fe`; post-merge CI #232 / `34624252208` passed.
- Jobs + Interviewer Builder — **COMPLETE**. PR #5 squash-merged as `729474ffb03075c93dfa2564f0004f1590533753`; post-merge CI #432 / `34677775158` passed.

## Current Milestone

Candidates + Invitations — **IN PROGRESS** on PR #6 / `feat/candidates-invitations`.

Active branch: `feat/candidates-invitations`
Active PR: #6 — `Build candidates and secure invitations` — OPEN / DRAFT / unmerged.
Verified implementation/provider state: `af46174165c6a90f0fb03525afb0ffa0bbfba128` passed CI #451 / `34681517870` across frozen install, lint, typecheck, unit/component tests, framework/source verification, local Supabase, build, Chromium E2E, PRD coverage, and cleanup. Durable-document reconciliation creates newer heads and does not replace this implementation evidence.

## Current Task State

- M04.1 Candidate records — **VERIFIED** with tenant/job constraints, normalized candidate identity, role-gated creation, bounded repository behavior, and provider-backed tenant/PII isolation.
- M04.2 Secure token service + invitation persistence — **VERIFIED**. Tokens use 32 random bytes encoded base64url, only SHA-256 hashes are persisted, hashes are unique, invitation rows bind organization/job/candidate/immutable interviewer version, expiry/revocation metadata is present, RLS is enabled, cross-tenant bindings fail, direct browser mutation is denied, and provider-backed verification passed.
- M04.3 Invitation lifecycle — **NEXT / NOT STARTED**.
- M04.4 Public candidate route — **NOT STARTED**.
- M04.5 Pre-interview experience — **NOT STARTED**.
- M04.6 Disclosure + consent — **NOT STARTED**.
- M04.7 Accommodation/support path — **NOT STARTED**.
- M04.8 Security E2E closeout — **NOT STARTED**.

## TDD / Verification Evidence

- Token RED: `f447b4d18a08c1063b0b6c58f173f89e561f497a`, CI #447 / `34680870935` — failed because the token production module did not exist.
- Token GREEN: `f9240ffb35ce07452d3f5c83bc4254fd8c091156`, CI #448 / `34680902097` — complete quality gate passed.
- Invitation persistence RED: `3df096e27eebd6183d3baf679d1ae9e93777c9ad`, CI #449 / `34681166049` — unit/component tests failed because the migration did not exist.
- Invitation persistence GREEN: `a2b1fb7a686f985c71a1398b3610c499c2d4d63d`, CI #450 / `34681234048` — complete quality gate passed.
- Provider isolation verification: `af46174165c6a90f0fb03525afb0ffa0bbfba128`, CI #451 / `34681517870` — complete quality gate passed.

## Review State

- Critical findings: 0 unresolved for completed M04.1–M04.2 work.
- Important findings: 0 unresolved for completed M04.1–M04.2 work.
- Latest GitHub recovery found no unresolved PR review threads.
- Safety invariants remain intact: RLS/database constraints are authoritative, raw candidate invitation tokens are not persisted, anonymous table access is denied, direct authenticated browser mutation is denied, immutable interviewer versions are bound to invitations, candidate input remains untrusted, and humans remain hiring decision makers.

## Blockers

No current external blocker. M04 remains incomplete by scope; invitation lifecycle, public invitation authorization, candidate-facing UI, disclosure/consent evidence, accommodation support, and final security/replay closeout remain to be built and verified.

## Durable Recovery

Recover actual Git/PR/CI first, then read `AGENTS.md`, `CODEX-START-HERE.md`, `docs/AUTONOMOUS-DEVELOPMENT.md`, this file, `docs/progress/KNOWN-ISSUES.md`, `docs/milestones/CURRENT.md`, `docs/milestones/M04-candidates-invitations.md`, `docs/SESSION-HANDOFF.md`, requirements/traceability, and the active M04 design/plan.

Exact next work: M04.3 Invitation lifecycle. Establish a genuine RED for monotonic `draft -> sent -> opened -> started -> completed` transitions and fail-closed terminal behavior after expiry/revocation/completion; implement authoritative database transition checks; verify exact-head CI; then continue to M04.4.
