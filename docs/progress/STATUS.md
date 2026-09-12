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
CI status: M04.4 final implementation head `2d5883ce57916b4a48ec338d6ea8816eb3470d80` passed CI #473 / `34684127179` across frozen install, lint, typecheck, all 322 unit/component tests, framework/source verifiers, local Supabase reset, production build, Chromium E2E, PRD coverage, and cleanup.

## Current Task State

- M04.1 Candidate records — **VERIFIED** with tenant/job constraints, normalized candidate identity, role-gated creation, bounded repository behavior, and provider-backed tenant/PII isolation.
- M04.2 Secure token service + invitation persistence — **VERIFIED**. Tokens use 32 random bytes encoded base64url, only SHA-256 hashes are persisted, hashes are unique, invitation rows bind organization/job/candidate/immutable interviewer version, expiry/revocation metadata is present, RLS is enabled, cross-tenant bindings fail, direct browser mutation is denied, and provider-backed verification passed.
- M04.3 Invitation lifecycle — **VERIFIED**. PostgreSQL enforces `draft -> sent -> opened -> started -> completed`; transition timestamps are persisted; non-monotonic, cross-tenant, expired, revoked, completed/replayed transitions fail closed; direct authenticated table updates remain revoked.
- M04.4 Public candidate route — **VERIFIED**. Raw tokens are SHA-256 hashed server-side, a narrow `SECURITY DEFINER` RPC with blank `search_path` resolves only sent/opened/started non-expired non-revoked invitations, only organization/job display fields leave the database boundary, invalid/unusable/provider-error cases collapse to one unavailable shape, and both anonymous and authenticated visitors use function execution without table access.
- M04.5 Pre-interview experience — **NEXT / NOT STARTED**.
- M04.6 Disclosure + consent — **NOT STARTED**.
- M04.7 Accommodation/support path — **NOT STARTED**.
- M04.8 Security E2E closeout — **NOT STARTED**.

## TDD / Verification Evidence

- Token RED: `f447b4d18a08c1063b0b6c58f173f89e561f497a`, CI #447 / `34680870935`.
- Token GREEN: `f9240ffb35ce07452d3f5c83bc4254fd8c091156`, CI #448 / `34680902097`.
- Invitation persistence RED: `3df096e27eebd6183d3baf679d1ae9e93777c9ad`, CI #449 / `34681166049`.
- Invitation persistence GREEN: `a2b1fb7a686f985c71a1398b3610c499c2d4d63d`, CI #450 / `34681234048`.
- Provider isolation verification: `af46174165c6a90f0fb03525afb0ffa0bbfba128`, CI #451 / `34681517870`.
- Invitation lifecycle RED: `792e56f422e1f77be6967facca73e69388314340`, CI #456 / `34681801542`.
- Lifecycle schema GREEN: `9267e97d7467af5049a2c0ac7cf95b4b3e3cb465`, CI #458 / `34682350770`.
- Lifecycle provider GREEN: `d8c5317c1d5a28aaec89a826002847db96ed9cdf`, CI #460 / `34682867624`.
- M04.4 SQL-boundary RED: `2c931522851abbf39513f44f09070c745082069e`, CI #465 / `34683441570` — 312 unrelated tests passed; exactly the new tests failed because the public migration did not exist.
- M04.4 server-resolver RED: `d3f808ea7b7c1acd6d5d7e408fe52bc2ddef7545`, CI #468 / `34683732745` — 315 unrelated tests passed; exactly the five new resolver cases failed because the production resolver did not exist.
- M04.4 route RED: `fd759ad8da07ad8dfc29a4b2336ce20625605956`, CI #470 / `34683893563` — existing tests passed; exactly the two route cases failed because the page did not exist.
- M04.4 security RED: `ff992cf8762dcc59c9d21a70d1a6ad6f5a98c30f`, CI #472 / `34684044217` — route/resolver tests were green; exactly two new authorization assertions failed because draft invitations were still resolvable and authenticated callers lacked the narrow function grant.
- M04.4 GREEN: `2d5883ce57916b4a48ec338d6ea8816eb3470d80`, CI #473 / `34684127179` — complete repository quality gate passed.

## Review State

- Critical findings: 0 unresolved for completed M04.1–M04.4 work.
- Important findings: 0 unresolved for completed M04.1–M04.4 work.
- Latest GitHub recovery found no unresolved PR review threads.
- M04.4 skeptical security review fixed two important edge cases before verification: draft invitations are no longer publicly resolvable, and logged-in visitors can use the same token-bound resolver without receiving broader table or tenant privileges.
- Safety invariants remain intact: RLS/database constraints are authoritative, raw candidate invitation tokens are not persisted or logged, anonymous/authenticated direct table mutation remains denied, immutable interviewer versions are bound to invitations, candidate input remains untrusted, and humans remain hiring decision makers.

## Blockers

No external blocker. M04 remains incomplete by scope; pre-interview information, disclosure/consent evidence, accommodation support, and final security/browser closeout remain to be built and verified.

## Durable Recovery

Recover actual Git/PR/CI first, then read `AGENTS.md`, `CODEX-START-HERE.md`, `docs/AUTONOMOUS-DEVELOPMENT.md`, this file, `docs/progress/KNOWN-ISSUES.md`, `docs/milestones/CURRENT.md`, `docs/milestones/M04-candidates-invitations.md`, `docs/SESSION-HANDOFF.md`, requirements/traceability, and the active M04 design/plan.

Exact next work: begin M04.5 Pre-interview experience with a genuine RED requiring expected duration and interview format to come from the invitation-bound immutable interviewer-version snapshot, then add semantic/accessibility coverage for company, role, duration, format, technical requirements, privacy summary, and start prerequisites. Verify exact-head CI, reconcile durable evidence, and continue directly to M04.6.