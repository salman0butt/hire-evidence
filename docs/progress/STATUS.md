# Project Status

Last reconciled: 2026-09-12

## Completed Milestones

- Product Foundation — **COMPLETE**. PR #2 merged as `64ebeb4f7b2a39fc0557685ef34035650211aad9`; post-merge CI #57 passed.
- SaaS Shell + Auth — **COMPLETE**. PR #3 squash-merged as `ed10e1b55bb62cf202585c8c50e6487014e83c29`; post-merge CI #157 passed.
- Organizations + RBAC — **COMPLETE**. PR #4 squash-merged as `835d7d571a69cd13e3e802be4872e873ffdd34fe`; post-merge CI #232 / `34624252208` passed.
- Jobs + Interviewer Builder — **COMPLETE**. PR #5 squash-merged as `729474ffb03075c93dfa2564f0004f1590533753`; post-merge CI #432 / `34677775158` passed.

## Current Milestone

Candidates + Invitations — **CLOSEOUT / MERGE GATE** on PR #6 / `feat/candidates-invitations`.

Active branch: `feat/candidates-invitations`
Active PR: #6 — `Build candidates and secure invitations` — OPEN / DRAFT / unmerged.
Latest verified implementation head: `8a6f6cc8adba2d39f2b255a74db166e3285527ba`.
CI status: CI #507 / `34691558117` passed the complete repository gate on that exact implementation head. Documentation reconciliation creates a newer head and therefore requires fresh final CI before merge.

## Current Task State

- M04.1 Candidate records — **VERIFIED**: tenant/job constraints, normalized identity, role-gated creation, bounded repository behavior, provider-backed tenant/PII isolation.
- M04.2 Secure invitation tokens/persistence — **VERIFIED**: 32 random bytes, base64url raw tokens, SHA-256 hash-only persistence, uniqueness, expiry/revocation, immutable interviewer-version binding, RLS, browser-write denial.
- M04.3 Invitation lifecycle — **VERIFIED**: authoritative `draft -> sent -> opened -> started -> completed`, timestamps, cross-tenant/out-of-order/expired/revoked/completed replay denial.
- M04.4 Public candidate route — **VERIFIED**: server-side token hashing, narrow `SECURITY DEFINER` resolver, safe public projection, constant-shape unavailable result, no public table grant.
- M04.5 Pre-interview experience — **VERIFIED**: company, role, immutable duration/format, technical requirements, privacy summary, prerequisites, semantic responsive UI.
- M04.6 Disclosure + consent — **VERIFIED**: AI/transcription/data-processing/retention disclosures; explicit consent; append-only consent evidence; stale disclosure versions rejected; start blocked without current consent.
- M04.7 Accommodation/support path — **VERIFIED**: trusted owner/admin-configured support email/URL, candidate-facing alternative support path without requiring protected/medical disclosure.
- M04.8 Security/browser closeout — **VERIFIED** on `8a6f6cc8...` / CI #507: valid mobile browser flow, keyboard consent, support links, no horizontal overflow, and wrong/expired/revoked/completed tokens sharing the same unavailable state.

## TDD / Verification Evidence

- M04.2 token RED `f447b4d18a08c1063b0b6c58f173f89e561f497a` / CI #447; GREEN `f9240ffb35ce07452d3f5c83bc4254fd8c091156` / CI #448.
- M04.2 persistence RED `3df096e27eebd6183d3baf679d1ae9e93777c9ad` / CI #449; GREEN `a2b1fb7a686f985c71a1398b3610c499c2d4d63d` / CI #450; provider verification `af46174165c6a90f0fb03525afb0ffa0bbfba128` / CI #451.
- M04.3 lifecycle RED `792e56f422e1f77be6967facca73e69388314340` / CI #456; schema GREEN `9267e97d7467af5049a2c0ac7cf95b4b3e3cb465` / CI #458; provider GREEN `d8c5317c1d5a28aaec89a826002847db96ed9cdf` / CI #460.
- M04.4 RED sequence: `2c931522851abbf39513f44f09070c745082069e` / CI #465, `d3f808ea7b7c1acd6d5d7e408fe52bc2ddef7545` / CI #468, `fd759ad8da07ad8dfc29a4b2336ce20625605956` / CI #470, security RED `ff992cf8762dcc59c9d21a70d1a6ad6f5a98c30f` / CI #472; GREEN `2d5883ce57916b4a48ec338d6ea8816eb3470d80` / CI #473.
- M04.5 RED `2b89fb69f03fb61f9b93a3f5c993094df1a45edf` / CI #483; GREEN `0e73126561bd940a4e04cc86109996d603e70ab7` / CI #484.
- M04.7 support-path test-first checkpoint `a7a553de51ac28c0eabfe34cae27bd6e96c6fe9e`; implementation `a88cfd44a373decb543d7367372fe9f70484c3ed`. CI #505 exposed only a stale pre-existing keyboard test. Root-cause fix `ac047aff7cffb335226702e24b443cd1706796a9` passed full CI #506 / `34691250632`.
- M04.8 browser/security closeout `8a6f6cc8adba2d39f2b255a74db166e3285527ba` passed full CI #507 / `34691558117`.

## Review State

Critical findings: **0 unresolved**.
Important findings: **0 unresolved**.
Latest GitHub recovery: **0 unresolved review threads**.

Security/privacy review: PostgreSQL constraints/RLS/RPCs remain authoritative; raw tokens are not persisted/logged; public capability is invitation-scoped; support settings remain owner/admin RLS constrained; consent is append-only from browser roles and required before start. Accessibility review: semantic sections, explicit consent, focus order, status semantics and narrow viewport coverage are verified. Performance/YAGNI review found no unbounded public query or speculative architecture. AI-safety boundaries remain intact and humans remain hiring decision makers.

## Blockers

No external blocker. The only remaining M04 merge gate is procedural evidence: final durable-document/PR reconciliation creates a new branch head, so exact-final-head CI must pass and the head/review/concurrency/mergeability state must be rechecked before auto-merge.

## Durable Recovery

Recover actual Git/PR/CI first, then read `AGENTS.md`, `CODEX-START-HERE.md`, `docs/AUTONOMOUS-DEVELOPMENT.md`, this file, `docs/progress/KNOWN-ISSUES.md`, `docs/milestones/CURRENT.md`, `docs/milestones/M04-candidates-invitations.md`, `docs/SESSION-HANDOFF.md`, requirements/traceability, and the active M04 design/plan.

Exact next work: finish durable closeout, verify exact-final-head CI, squash-merge PR #6 if every authorized merge gate remains green, verify post-merge `main`, then activate M05 — Realtime AI Interview and begin its first dependency-valid TDD unit.
