# M04 — Candidates + Invitations

Status: **CLOSEOUT / MERGE GATE**

## Goal
Deliver tenant-scoped candidate records and secure opaque invitations with expiry/revocation, a safe pre-interview experience, AI/privacy disclosure, explicit consent evidence, and an accommodation/support path.

## Authoritative PRD Milestone Definition

PRD milestone 199 requires candidate records, secure invitations, opaque tokens, expiry, revocation, candidate pre-interview page, AI disclosure, consent, privacy information, and accommodation contact. Exit criterion: a candidate can securely open only their invitation.

## Dependencies

M00–M03 complete and integrated on `main`, especially published immutable interviewer versions from M03.

## In Scope

Candidate persistence; secure invitation token generation/hash-at-rest; invitation binding/lifecycle/expiry/revocation; public invitation resolution; pre-interview candidate UI; disclosure/consent; accommodation/support; provider-backed isolation/security tests; browser/accessibility closeout.

## Out of Scope

Realtime interview transport/audio (M05), durable transcript/session continuity (M06), assessment/scoring (M07), autonomous hiring decisions, protected-trait inference, emotion/personality/deception scoring, or speculative future abstractions.

## Selected Design / Implementation Plan

- Design: `docs/superpowers/specs/2026-09-12-candidates-invitations-design.md`
- Plan: `docs/superpowers/plans/2026-09-12-candidates-invitations.md`
- Branch: `feat/candidates-invitations`
- PR: #6 — `Build candidates and secure invitations`

## Acceptance Criteria

- Candidate records remain tenant/job scoped and protected by authoritative database boundaries.
- Invitations use opaque high-entropy raw tokens with only SHA-256 hashes persisted.
- Invitations bind organization/job/candidate/immutable interviewer version and enforce expiry/revocation.
- Lifecycle is monotonic and replay-safe.
- Public invitation access exposes only the narrow safe projection represented by the valid token.
- Candidate pre-interview UI exposes company/role/duration/format/technical/prerequisite information.
- AI/transcription/data-processing/retention disclosures and explicit versioned consent are recorded before interview start.
- Candidate has a trusted accommodation/support path without being asked for protected or medical details.
- Invalid/wrong/expired/revoked/completed tokens fail closed without condition disclosure.
- Mobile/keyboard/browser verification and full repository quality gates pass.
- 0 unresolved Critical or Important findings; exact-final-head CI green before merge.

## Tasks / Iterations

1. **VERIFIED** — M04.1 Candidate records.
2. **VERIFIED** — M04.2 Secure token service + invitation persistence.
3. **VERIFIED** — M04.3 Authoritative invitation lifecycle.
4. **VERIFIED** — M04.4 Public invitation resolution.
5. **VERIFIED** — M04.5 Pre-interview experience.
6. **VERIFIED** — M04.6 Disclosure + consent evidence.
7. **VERIFIED** — M04.7 Accommodation/support path.
8. **VERIFIED** — M04.8 Security/browser closeout on implementation head `8a6f6cc8adba2d39f2b255a74db166e3285527ba`, CI #507 / `34691558117`.

## TDD Evidence

- Token RED `f447b4d18a08c1063b0b6c58f173f89e561f497a` / CI #447; GREEN `f9240ffb35ce07452d3f5c83bc4254fd8c091156` / CI #448.
- Persistence RED `3df096e27eebd6183d3baf679d1ae9e93777c9ad` / CI #449; GREEN `a2b1fb7a686f985c71a1398b3610c499c2d4d63d` / CI #450; provider GREEN `af46174165c6a90f0fb03525afb0ffa0bbfba128` / CI #451.
- Lifecycle RED `792e56f422e1f77be6967facca73e69388314340` / CI #456; schema GREEN `9267e97d7467af5049a2c0ac7cf95b4b3e3cb465` / CI #458; provider GREEN `d8c5317c1d5a28aaec89a826002847db96ed9cdf` / CI #460.
- Public resolver/security RED chain: `2c931522851abbf39513f44f09070c745082069e` / #465, `d3f808ea7b7c1acd6d5d7e408fe52bc2ddef7545` / #468, `fd759ad8da07ad8dfc29a4b2336ce20625605956` / #470, `ff992cf8762dcc59c9d21a70d1a6ad6f5a98c30f` / #472; GREEN `2d5883ce57916b4a48ec338d6ea8816eb3470d80` / #473.
- Pre-interview RED `2b89fb69f03fb61f9b93a3f5c993094df1a45edf` / #483; GREEN `0e73126561bd940a4e04cc86109996d603e70ab7` / #484.
- Support path test-first checkpoint `a7a553de51ac28c0eabfe34cae27bd6e96c6fe9e`; implementation `a88cfd44a373decb543d7367372fe9f70484c3ed`.
- CI #505 exposed a stale older keyboard expectation; root-cause fix `ac047aff7cffb335226702e24b443cd1706796a9` passed CI #506 / `34691250632`.
- Browser/security closeout `8a6f6cc8adba2d39f2b255a74db166e3285527ba` passed CI #507 / `34691558117`.

## Integration Test Evidence

Provider-backed tests exercise tenant isolation, candidate PII boundaries, invitation organization/job/candidate/version binding, anonymous/direct-write denial, lifecycle authorization, out-of-order/replay denial, expiry/revocation, consent version/categories, start-without-consent denial, and append-only consent behavior. The complete repository gate passed these tests on implementation head `8a6f6cc8…` in CI #507.

## E2E / Visual Verification

`e2e/candidate-invitation-ui.spec.ts` verifies a valid invitation on a 390×844 viewport with no horizontal overflow, safe company/job/duration/format/disclosure/support projection, keyboard focus from consent checkbox to submit, successful consent recording, and constant-shape unavailable UI for wrong, expired, revoked, and completed tokens. Existing organization UI E2E was updated to include the two legitimate candidate-support inputs in keyboard order.

## Security Review

- Raw invitation tokens are generated from 32 random bytes, URL-safe encoded, SHA-256 hashed server-side, and never persisted/logged.
- Database constraints/RLS/RPCs remain authoritative for tenant/job/candidate/version integrity and mutations.
- Public resolution uses a narrow `SECURITY DEFINER` RPC with blank `search_path`; no public candidate/invitation table grant was introduced.
- Invalid/unusable tokens fail closed without identifying the failure cause.
- Consent evidence is versioned and append-only from browser roles; current consent is required before `started`.
- Organization support settings remain owner/admin constrained by existing organization update RLS; only parsed email and HTTP(S) destinations are exposed.
- Candidate data remains untrusted input. No autonomous hire/reject or prohibited inference feature was added.

## Accessibility Review

Semantic headings/sections, explicit required consent, focusable controls, status/error semantics, mobile no-overflow coverage, and keyboard consent flow are verified. Candidate support is available without requiring medical/protected disclosure.

## Performance Review

Public invitation resolution performs one token hash and a bounded single-record projection. No unbounded public listing, polling loop, or speculative abstraction was introduced.

## AI / Eval Review

AI/transcription/data-processing/retention are disclosed before interview start. Technical failures are not assessment evidence. Humans remain hiring decision makers. Runtime scoring/evals belong to later milestones and must preserve the immutable published plan/guardrails.

## Code Review Findings

Critical: **0 unresolved**. Important: **0 unresolved**. GitHub review threads: **0 unresolved** at latest recovery. The latest skeptical security/privacy/accessibility/performance/YAGNI/AI-safety review found no merge-blocking issue.

## Fixes / Re-review

CI #505 failure was systematically debugged to stale organization-settings keyboard coverage after support fields were added. Commit `ac047aff7cffb335226702e24b443cd1706796a9` fixed only the test focus sequence; CI #506 passed the full gate. Browser closeout then passed CI #507. Final documentation CI #514 failed before product gates because this ledger rewrite had dropped mandatory autonomous-framework section markers and the traceability table no longer contained every required verifier column; that closeout-document regression is being repaired without changing product code.

## Fresh Verification Commands

```bash
pnpm lint
pnpm typecheck
pnpm test
pnpm build
pnpm e2e
python3 scripts/verify_autonomous_framework.py
python3 scripts/verify_requirements_source.py
python3 scripts/verify_prd_coverage.py
```

## Fresh Verification Results

Implementation head `8a6f6cc8adba2d39f2b255a74db166e3285527ba`: complete CI #507 / `34691558117` PASS. Final documentation head must pass a fresh complete CI after the verifier-marker repair before merge.

## Commits / Files Changed

M04 adds candidate/invitation/consent/support migrations and domain/repository/action/UI/tests, `e2e/candidate-invitations.spec.ts`, `e2e/candidates.spec.ts`, `e2e/candidate-invitation-ui.spec.ts`, public `/interview/[token]`, organization support settings, and durable docs/spec/plan updates. See PR #6 for the authoritative diff.

## Known Limitations

Realtime microphone/voice transport, transcript continuity, assessment/scoring, and hiring-team review are intentionally deferred to M05+.

## Documentation Updated

`docs/progress/STATUS.md`, `docs/milestones/CURRENT.md`, this ledger, `docs/SESSION-HANDOFF.md`, `docs/FEATURE-MATRIX.md`, `docs/requirements/TRACEABILITY.md`, `docs/progress/KNOWN-ISSUES.md`, and PR #6 describe the current closeout state.

## Durable Recovery Sources

`AGENTS.md` → `CODEX-START-HERE.md` → `docs/AUTONOMOUS-DEVELOPMENT.md` → live Git/PR/exact-head CI → `docs/progress/STATUS.md` → known issues → `docs/milestones/CURRENT.md` → this ledger → canonical PRD/traceability → selected design/plan → source/tests.

## Completion Checklist

- [x] Requirements and iterations accounted for.
- [x] Required TDD/integration/E2E evidence recorded.
- [x] Security/accessibility/performance/AI review complete.
- [x] 0 unresolved Critical / Important findings.
- [x] Traceability/feature matrix reconciled.
- [ ] Exact-final-documentation-head CI green.
- [ ] PR #6 merged under authorized gate.
- [ ] Post-merge `main` CI green.

## Next Milestone

M05 — Realtime AI Interview. After M04 merge and post-merge verification, activate it and begin M05.1 reference characterization/design under the repository's pre-authorized autonomous design/plan procedure.
