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
CI status: M04.3 lifecycle provider-verification head `d8c5317c1d5a28aaec89a826002847db96ed9cdf` passed CI #460 / `34682867624` across frozen install, lint, typecheck, all 312 unit/component tests, framework/source verifiers, local Supabase reset, production build, Chromium E2E, PRD coverage, and cleanup.

## Current Task State

- M04.1 Candidate records — **VERIFIED** with tenant/job constraints, normalized candidate identity, role-gated creation, bounded repository behavior, and provider-backed tenant/PII isolation.
- M04.2 Secure token service + invitation persistence — **VERIFIED**. Tokens use 32 random bytes encoded base64url, only SHA-256 hashes are persisted, hashes are unique, invitation rows bind organization/job/candidate/immutable interviewer version, expiry/revocation metadata is present, RLS is enabled, cross-tenant bindings fail, direct browser mutation is denied, and provider-backed verification passed.
- M04.3 Invitation lifecycle — **VERIFIED**. PostgreSQL enforces `draft -> sent -> opened -> started -> completed`; transition timestamps are persisted; the security-definer transition RPC uses the existing organization-role authority; non-monotonic, cross-tenant, expired, revoked, completed/replayed transitions fail closed; and direct authenticated table updates remain revoked. Provider-backed Supabase coverage passed on exact head `d8c5317...`.
- M04.4 Public candidate route — **NEXT / NOT STARTED**.
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
- Invitation lifecycle RED: `792e56f422e1f77be6967facca73e69388314340`, CI #456 / `34681801542` — exactly 3 lifecycle migration-contract tests failed because `202609120013_candidate_invitation_lifecycle.sql` did not exist; 309 unrelated tests passed.
- Lifecycle implementation checkpoint: `2496c27e5da90fe16835f570958eedc5f5b63e6a`, CI #457 / `34682251033` — all 312 tests passed, then framework verification exposed a missing durable `CI status:` marker. This was NOT full GREEN.
- Lifecycle schema GREEN: `9267e97d7467af5049a2c0ac7cf95b4b3e3cb465`, CI #458 / `34682350770` — complete repository quality gate passed.
- Provider lifecycle checkpoint `9d97ec54c1fd2872fca62b9abe1e7290427d4264`, CI #459 / `34682631170` — NOT GREEN because the E2E revoked-row fixture timestamp preceded database `created_at` by milliseconds and correctly violated the existing timestamp-order check; 22 other browser/provider tests passed.
- Lifecycle provider GREEN: `d8c5317c1d5a28aaec89a826002847db96ed9cdf`, CI #460 / `34682867624` — fixture corrected without weakening the invariant; full repository gate passed, including provider-backed monotonic transitions, cross-tenant denial, replay denial, expired/revoked denial, and persisted transition timestamps.

## Review State

- Critical findings: 0 unresolved for completed M04.1–M04.3 work.
- Important findings: 0 unresolved for completed M04.1–M04.3 work.
- Latest GitHub recovery found no unresolved PR review threads.
- M04.3 skeptical review: transition authority remains database-enforced; the RPC is `SECURITY DEFINER` with a blank `search_path`, row locking prevents concurrent transition races, organization-role checks precede mutation, and only the exact next state is accepted. Anonymous candidate access is intentionally not granted through this manager-facing RPC; M04.4 must add a separate narrowly scoped token capability boundary rather than weakening these grants.
- Safety invariants remain intact: RLS/database constraints are authoritative, raw candidate invitation tokens are not persisted or logged, anonymous table access is denied, direct authenticated browser mutation is denied, immutable interviewer versions are bound to invitations, candidate input remains untrusted, and humans remain hiring decision makers.

## Blockers

No external blocker. M04 remains incomplete by scope; public invitation authorization, candidate-facing pre-interview UI, disclosure/consent evidence, accommodation support, and final security/browser closeout remain to be built and verified.

## Durable Recovery

Recover actual Git/PR/CI first, then read `AGENTS.md`, `CODEX-START-HERE.md`, `docs/AUTONOMOUS-DEVELOPMENT.md`, this file, `docs/progress/KNOWN-ISSUES.md`, `docs/milestones/CURRENT.md`, `docs/milestones/M04-candidates-invitations.md`, `docs/SESSION-HANDOFF.md`, requirements/traceability, and the active M04 design/plan.

Exact next work: begin M04.4 Public invitation resolution with a genuine RED requiring raw-token server-side hashing, one-invitation safe projection, constant-shape failure for invalid/expired/revoked/completed tokens, and no tenant/member/internal metadata leakage. Then implement the minimal server-only/public-RPC boundary and verify exact-head CI.
