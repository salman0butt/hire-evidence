# M04 — Candidates + Invitations

Status: **IN PROGRESS**

## Goal
Deliver the authoritative PRD milestone below as a reviewable, evidence-backed capability.

## Authoritative PRD Milestone Definition

# 199. MILESTONE 04 — CANDIDATES + INVITATIONS

Deliver:

```text
candidate records
secure invitations
opaque tokens
expiry
revocation
candidate pre-interview page
AI disclosure
consent
privacy info
accommodation contact
```

Exit:

candidate can securely open only their invitation.

## Dependencies
Organizations + RBAC; published job/interviewer versions.

## In Scope
The authoritative definition plus every default iteration listed below.

## Out of Scope
Later milestones, speculative abstractions, and behavior not justified by the PRD.

## Architecture Notes
Candidate access uses opaque, expiring, revocable, narrowly scoped invitation tokens. Raw tokens are generated from 32 random bytes and only SHA-256 hashes are persisted. Candidate invitations are tenant/job/candidate/version bound with composite foreign keys, RLS, and no direct browser mutation grants. Manager lifecycle mutation remains separate from the future public token capability boundary.

## Selected Design / Implementation Plan
- Design: `docs/superpowers/specs/2026-09-12-candidates-invitations-design.md`
- Plan: `docs/superpowers/plans/2026-09-12-candidates-invitations.md`
- Active branch: `feat/candidates-invitations`
- Active PR: #6 — `Build candidates and secure invitations` — OPEN / DRAFT.

## Acceptance Criteria
- PRD deliverables and exit criteria pass.
- All required iterations are complete or explicitly resolved.
- Relevant security/privacy/tenancy/accessibility/performance/AI-safety gates pass.
- 0 unresolved Critical or Important review findings.
- Traceability and feature state are reconciled.
- Exact-final-head CI is green.

## Tasks / Iterations
1. **VERIFIED** — M04.1 — Candidate records: minimal candidate identity + job relation, tenant/job integrity, role-gated creation, and provider-backed PII isolation.
2. **VERIFIED** — M04.2 — Secure token service: 256-bit URL-safe opaque tokens, deterministic SHA-256 hashing, hash-only persistence, expiry/revocation metadata, immutable interviewer-version binding, RLS, browser-write denial, provider-backed uniqueness and tenant isolation.
3. **VERIFIED** — M04.3 — Invitation lifecycle: authoritative monotonic `draft -> sent -> opened -> started -> completed`, transition timestamps, cross-tenant denial, and expired/revoked/completed replay denial.
4. **NEXT / NOT STARTED** — M04.4 — Public candidate route: narrowly scoped raw-token server lookup/authorization and safe public projection.
5. **NOT STARTED** — M04.5 — Pre-interview experience: company/role/duration/format/technical requirements.
6. **NOT STARTED** — M04.6 — Disclosure + consent: AI/transcription/data/retention events.
7. **NOT STARTED** — M04.7 — Accommodation/support path: alternative-process information.
8. **NOT STARTED** — M04.8 — Security E2E: enumeration/replay/expiry/revocation/completed-token cases.

## TDD Evidence

### M04.1 Candidate records
Candidate persistence, validation, bounded repository behavior, RLS, role authorization, and Org A/Org B/anonymous provider isolation were completed and verified earlier on this PR before M04.2 began.

### M04.2 Secure token service
- RED `f447b4d18a08c1063b0b6c58f173f89e561f497a` — `test: define secure invitation token contract`; CI #447 / `34680870935` failed at typecheck because the production token module did not yet exist, while lint passed.
- GREEN `f9240ffb35ce07452d3f5c83bc4254fd8c091156` — `feat: add secure invitation token service`; CI #448 / `34680902097` passed the complete quality gate.
- RED `3df096e27eebd6183d3baf679d1ae9e93777c9ad` — `test: define candidate invitation persistence contract`; CI #449 / `34681166049` failed in unit/component tests because the invitation migration did not yet exist, after lint/typecheck passed.
- GREEN `a2b1fb7a686f985c71a1398b3610c499c2d4d63d` — `feat: add secure candidate invitation persistence`; CI #450 / `34681234048` passed the complete quality gate.
- Provider verification `af46174165c6a90f0fb03525afb0ffa0bbfba128` — CI #451 / `34681517870` passed including Supabase startup/reset, build, Chromium E2E, PRD coverage, and cleanup.

### M04.3 Invitation lifecycle
- RED `792e56f422e1f77be6967facca73e69388314340` — CI #456 / `34681801542`: exactly 3 lifecycle migration-contract tests failed because `202609120013_candidate_invitation_lifecycle.sql` did not exist; 309 unrelated tests passed.
- Implementation checkpoint `2496c27e5da90fe16835f570958eedc5f5b63e6a` — CI #457 / `34682251033`: all 312 tests passed; run then failed only because durable `STATUS.md` lacked the repository-required `CI status:` marker, so this is NOT full GREEN evidence.
- Schema GREEN `9267e97d7467af5049a2c0ac7cf95b4b3e3cb465` — CI #458 / `34682350770`: complete quality gate passed.
- Provider checkpoint `9d97ec54c1fd2872fca62b9abe1e7290427d4264` — CI #459 / `34682631170`: NOT GREEN. The new E2E test correctly hit the pre-existing `revoked_at >= created_at` constraint because the JavaScript fixture timestamp was a few milliseconds earlier than PostgreSQL's default `created_at`. Twenty-two other E2E tests passed.
- Provider GREEN `d8c5317c1d5a28aaec89a826002847db96ed9cdf` — CI #460 / `34682867624`: fixture changed to insert first then revoke; no production constraint was weakened. Frozen install, lint, typecheck, all 312 tests, framework/source verifiers, local Supabase reset, build, Chromium E2E, PRD coverage, and cleanup all passed.

## Integration Test Evidence
M04.2 provider-backed E2E verifies unique token hashes, cross-tenant candidate/version binding denial, manager-scoped RLS reads, cross-tenant read isolation, anonymous denial, and direct authenticated browser-write denial.

M04.3 provider-backed E2E additionally verifies cross-tenant lifecycle mutation denial, rejection of out-of-order transitions, successful ordered transitions through completion, persisted transition timestamps, completed-token replay denial, and expired/revoked transition denial.

## E2E / Visual Verification
Provider-backed data/security E2E for M04.1–M04.3 is green on `d8c5317...` / CI #460. Candidate-facing visual/accessibility closeout remains pending until M04.4–M04.7 UI exists.

## Security Review
No unresolved Critical or Important issue is known for completed M04.1–M04.3. Raw invitation tokens are never persisted; token hashes are unique and constrained; tenant/job/candidate/interviewer-version relationships are enforced by composite foreign keys; RLS is enabled; anon has no table privilege; authenticated users have read-only role-gated access; direct browser mutation is denied. The lifecycle RPC is `SECURITY DEFINER`, uses `set search_path = ''`, row-locks the invitation, verifies an existing organization role before mutation, accepts only the exact next state, and fails closed after expiry/revocation/completion. It is intentionally not granted to anonymous candidates. M04.4 must create a separate narrow token-resolution capability rather than broadening these grants.

## Accessibility Review
PENDING for candidate-facing UI in M04.4–M04.7.

## Performance Review
Current persistence/lifecycle work is bounded by indexed tenant/job access, unique token lookup constraints, and primary-key row locking. Public token lookup behavior will be reviewed with M04.4.

## AI / Eval Review
Candidate-facing disclosure must accurately state AI/transcription use. Candidate text remains untrusted input. No autonomous hiring decision authority is introduced by M04.1–M04.3.

## Code Review Findings
- Critical: 0 unresolved for completed M04.1–M04.3.
- Important: 0 unresolved for completed M04.1–M04.3.
- Latest GitHub recovery found no unresolved PR review threads.

## Fixes / Re-review
The CI #459 fixture defect was fixed without changing production constraints; CI #460 passed the full gate. Public token-resolution attack surfaces require fresh review in M04.4.

## Fresh Verification Commands
Repository CI covers frozen install, lint, typecheck, unit/component tests, framework/source verifiers, local Supabase reset/provider tests, build, Chromium E2E, and PRD coverage.

## Fresh Verification Results
Exact M04.3 provider-verification head `d8c5317c1d5a28aaec89a826002847db96ed9cdf` passed CI #460 / `34682867624` across the complete repository quality gate before subsequent documentation reconciliation commits.

## Commits / Files Changed
Key M04 additions include `src/lib/candidates/invitation-token.ts`, candidate persistence/token tests, `supabase/migrations/202609120012_create_candidate_invitations.sql`, `supabase/migrations/202609120013_candidate_invitation_lifecycle.sql`, lifecycle migration-contract tests, and expanded `e2e/candidate-invitations.spec.ts` provider verification.

## Known Limitations
M04 is not complete. Public invitation resolution, candidate pre-interview UI, disclosure/consent evidence, accommodation/support, and final security/browser closeout remain unfinished.

## Documentation Updated
This living ledger is reconciled through verified M04.3. Documentation commits create newer heads, so later implementation/closeout claims require fresh exact-head CI.

## Durable Recovery Sources
`AGENTS.md` → `docs/AUTONOMOUS-DEVELOPMENT.md` → `docs/progress/STATUS.md` → known issues → this ledger → relevant PRD → selected spec/plan → active PR/reviews/exact-head CI → source/tests.

## Completion Checklist
- [ ] Requirements and iterations accounted for.
- [ ] Acceptance criteria verified.
- [x] M04.1 candidate records verified.
- [x] M04.2 secure token/persistence verified.
- [x] M04.3 invitation lifecycle verified.
- [ ] M04.4–M04.8 complete.
- [ ] Required final security/accessibility/performance/AI-eval reviews complete.
- [x] 0 Critical / 0 Important findings for completed work.
- [ ] Traceability/feature matrix reconciled for milestone closeout.
- [ ] Exact-final-head CI green at milestone completion.
- [x] Durable status reconciled through M04.3.

## Exact Next Unit
M04.4 Public invitation resolution — establish RED evidence for raw-token server-side hashing, one-invitation safe projection, constant-shape invalid/expired/revoked/completed failure, and no tenant/member/internal metadata leakage; then implement the minimal server-only/public-RPC boundary and verify provider behavior.

## Next Milestone
M05 — Realtime AI Interview.
