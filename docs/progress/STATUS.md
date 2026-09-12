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
Verified implementation/provider state: `af46174165c6a90f0fb03525afb0ffa0bbfba128` passed CI #451 / `34681517870` across frozen install, lint, typecheck, unit/component tests, framework/source verification, local Supabase, build, Chromium E2E, PRD coverage, and cleanup.
CI status: M04.3 lifecycle implementation head `2496c27e5da90fe16835f570958eedc5f5b63e6a` passed lint, typecheck, all 312 unit/component tests, framework verifier tests, and requirements-source verifier tests in CI #457 / `34682251033`; that run then failed only because this status file lacked the required literal `CI status:` framework marker, before Supabase/build/E2E could execute. This reconciliation commit requires fresh exact-head CI.

## Current Task State

- M04.1 Candidate records — **VERIFIED** with tenant/job constraints, normalized candidate identity, role-gated creation, bounded repository behavior, and provider-backed tenant/PII isolation.
- M04.2 Secure token service + invitation persistence — **VERIFIED**. Tokens use 32 random bytes encoded base64url, only SHA-256 hashes are persisted, hashes are unique, invitation rows bind organization/job/candidate/immutable interviewer version, expiry/revocation metadata is present, RLS is enabled, cross-tenant bindings fail, direct browser mutation is denied, and provider-backed verification passed.
- M04.3 Invitation lifecycle — **IMPLEMENTED / VERIFYING**. The database now models `draft -> sent -> opened -> started -> completed`, records transition timestamps, exposes an authoritative security-definer transition RPC, rejects expired/revoked/completed invitations and non-monotonic transitions, and keeps direct authenticated table updates revoked. Provider/build/E2E verification remains pending on fresh exact-head CI.
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
- Invitation lifecycle RED: `792e56f422e1f77be6967facca73e69388314340`, CI #456 / `34681801542` — exactly 3 lifecycle migration-contract tests failed because `202609120013_candidate_invitation_lifecycle.sql` did not exist; 309 unrelated tests passed.
- Invitation lifecycle GREEN candidate: `2496c27e5da90fe16835f570958eedc5f5b63e6a`, CI #457 / `34682251033` — all 312 unit/component tests passed including the lifecycle contract; CI then stopped at the durable-framework marker defect documented above, so this is not yet complete quality-gate evidence.

## Review State

- Critical findings: 0 unresolved for completed M04.1–M04.2 work.
- Important findings: 0 unresolved for completed M04.1–M04.2 work.
- Latest GitHub recovery found no unresolved PR review threads.
- M04.3 security review: transition authority is database-enforced; direct authenticated table updates remain revoked; role checks use the existing organization-role helper; expiry, revocation, completion and non-monotonic transitions fail closed. Provider-backed behavior still requires exact-head verification.
- Safety invariants remain intact: RLS/database constraints are authoritative, raw candidate invitation tokens are not persisted, anonymous table access is denied, direct authenticated browser mutation is denied, immutable interviewer versions are bound to invitations, candidate input remains untrusted, and humans remain hiring decision makers.

## Blockers

No external blocker. The current verification blocker is fresh exact-head CI after durable status reconciliation. M04 remains incomplete by scope; public invitation authorization, candidate-facing UI, disclosure/consent evidence, accommodation support, and final security/replay closeout remain to be built and verified.

## Durable Recovery

Recover actual Git/PR/CI first, then read `AGENTS.md`, `CODEX-START-HERE.md`, `docs/AUTONOMOUS-DEVELOPMENT.md`, this file, `docs/progress/KNOWN-ISSUES.md`, `docs/milestones/CURRENT.md`, `docs/milestones/M04-candidates-invitations.md`, `docs/SESSION-HANDOFF.md`, requirements/traceability, and the active M04 design/plan.

Exact next work: verify fresh exact-head CI for the M04.3 lifecycle implementation and status reconciliation. If the complete gate passes, add provider-backed lifecycle transition/replay coverage if not already proven by that run, reconcile M04.3 as VERIFIED, then begin M04.4 public invitation resolution with a genuine RED.
