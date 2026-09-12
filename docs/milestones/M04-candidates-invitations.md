# M04 — Candidates + Invitations

Status: **CLOSEOUT / MERGE GATE**

## Goal
Deliver tenant-scoped candidate records and secure opaque invitations with expiry/revocation, a safe pre-interview experience, AI/privacy disclosure, explicit consent evidence, and an accommodation/support path.

## Authoritative PRD Milestone Definition

PRD milestone 199 requires candidate records, secure invitations, opaque tokens, expiry, revocation, candidate pre-interview page, AI disclosure, consent, privacy information, and accommodation contact. Exit criterion: a candidate can securely open only their invitation.

## Selected Design / Plan
- Design: `docs/superpowers/specs/2026-09-12-candidates-invitations-design.md`
- Plan: `docs/superpowers/plans/2026-09-12-candidates-invitations.md`
- Branch: `feat/candidates-invitations`
- PR: #6 — `Build candidates and secure invitations`

## Iterations
1. **VERIFIED** — Candidate records.
2. **VERIFIED** — Secure token service + invitation persistence.
3. **VERIFIED** — Authoritative invitation lifecycle.
4. **VERIFIED** — Public invitation resolution.
5. **VERIFIED** — Pre-interview experience.
6. **VERIFIED** — Disclosure + consent evidence.
7. **VERIFIED** — Accommodation/support path.
8. **VERIFIED** — Provider/browser security closeout.

## Security / Privacy Invariants

- Raw invitation tokens are generated from 32 random bytes, encoded URL-safe, SHA-256 hashed server-side, and never persisted or logged.
- Invitation rows are bound to organization, job, candidate, and immutable published interviewer version with database constraints/RLS.
- Public resolution uses a narrow `SECURITY DEFINER` RPC with blank `search_path`, exposes only the one invitation represented by the token, and returns a bounded safe projection.
- Invalid, wrong, expired, revoked, draft, and completed invitations fail closed without revealing which condition occurred.
- Anonymous/authenticated browser roles do not receive direct candidate/invitation mutation authority.
- Consent evidence is append-only from browser roles, versioned, records all required disclosure categories, and interview start is rejected without current consent.
- Candidate support settings are configured through organization owner/admin boundaries and only parsed safe `mailto`/HTTP(S) destinations are exposed publicly.
- Candidate input is untrusted. No autonomous hire/reject authority, protected-trait inference, emotion/personality/deception scoring, or fabricated candidate evidence is introduced.

## Accessibility / Browser Verification

The candidate page uses semantic headings/sections, an explicit required consent checkbox, status/error semantics, keyboard-reachable controls, and responsive layout. M04.8 browser coverage verifies the valid flow at 390×844 without horizontal overflow, keyboard focus from consent to submit, disclosure/support content, and constant-shape unavailable UI for wrong, expired, revoked, and completed tokens.

## TDD / Verification Evidence

- Token RED `f447b4d18a08c1063b0b6c58f173f89e561f497a` / CI #447; GREEN `f9240ffb35ce07452d3f5c83bc4254fd8c091156` / CI #448.
- Invitation persistence RED `3df096e27eebd6183d3baf679d1ae9e93777c9ad` / CI #449; GREEN `a2b1fb7a686f985c71a1398b3610c499c2d4d63d` / CI #450; provider verification `af46174165c6a90f0fb03525afb0ffa0bbfba128` / CI #451.
- Lifecycle RED `792e56f422e1f77be6967facca73e69388314340` / CI #456; schema GREEN `9267e97d7467af5049a2c0ac7cf95b4b3e3cb465` / CI #458; provider GREEN `d8c5317c1d5a28aaec89a826002847db96ed9cdf` / CI #460.
- Public resolver REDs `2c931522851abbf39513f44f09070c745082069e` / #465, `d3f808ea7b7c1acd6d5d7e408fe52bc2ddef7545` / #468, `fd759ad8da07ad8dfc29a4b2336ce20625605956` / #470, security RED `ff992cf8762dcc59c9d21a70d1a6ad6f5a98c30f` / #472; GREEN `2d5883ce57916b4a48ec338d6ea8816eb3470d80` / #473.
- Pre-interview RED `2b89fb69f03fb61f9b93a3f5c993094df1a45edf` / #483; GREEN `0e73126561bd940a4e04cc86109996d603e70ab7` / #484.
- Candidate support test-first checkpoint `a7a553de51ac28c0eabfe34cae27bd6e96c6fe9e`; implementation `a88cfd44a373decb543d7367372fe9f70484c3ed`. CI #505 then exposed a stale organization-settings keyboard expectation. Root-cause fix `ac047aff7cffb335226702e24b443cd1706796a9` passed complete CI #506 / `34691250632`.
- M04.8 browser/security closeout `8a6f6cc8adba2d39f2b255a74db166e3285527ba` passed complete CI #507 / `34691558117`.

## Review Findings

- Critical: **0 unresolved**.
- Important: **0 unresolved**.
- GitHub review threads: **0 unresolved** at latest recovery.
- Security/privacy/accessibility/performance/AI-safety/YAGNI review completed for the milestone implementation; no merge-blocking finding remains.

## Acceptance / Merge Gate

Implementation and acceptance criteria are satisfied on the verified implementation head. Documentation reconciliation creates a newer head, so fresh exact-final-head CI is required. After it passes, recheck the remote head, review threads, mergeability, and concurrent activity; then squash-merge PR #6 automatically under the repository owner's standing authorization.

## Post-Merge Continuation

Verify the resulting `main` SHA and required post-merge CI. Then activate M05 — Realtime AI Interview, create/reuse its branch/PR according to repository conventions, update durable state, and begin its first valid TDD unit in the same autonomous loop.
