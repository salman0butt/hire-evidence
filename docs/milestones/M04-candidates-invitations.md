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
Candidate access uses opaque, expiring, revocable, narrowly scoped invitation tokens. Raw tokens are generated from 32 random bytes and only SHA-256 hashes are persisted. Candidate invitations are tenant/job/candidate/version bound with composite foreign keys, RLS, and no direct browser mutation grants.

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
3. **NEXT / NOT STARTED** — M04.3 — Invitation lifecycle: draft/sent/opened/started/completed with expired/revoked terminal authorization failures.
4. **NOT STARTED** — M04.4 — Public candidate route: narrowly scoped server lookup/authorization.
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
- Provider verification `af46174165c6a90f0fb03525afb0ffa0bbfba128` — `test: verify invitation persistence isolation`; CI #451 / `34681517870` passed including Supabase startup, build, Chromium E2E, PRD coverage, and cleanup.

## Integration Test Evidence
M04.2 provider-backed E2E verifies unique token hashes, cross-tenant candidate/version binding denial, manager-scoped RLS reads, cross-tenant read isolation, anonymous denial, and direct authenticated browser-write denial. CI #451 / `34681517870` passed on exact SHA `af46174165c6a90f0fb03525afb0ffa0bbfba128`.

## E2E / Visual Verification
Provider-backed data/security E2E for M04.1–M04.2 is green. Candidate-facing visual/accessibility closeout remains pending until M04.4–M04.7 UI exists.

## Security Review
Current M04.2 review finds no unresolved Critical or Important issue: raw invitation tokens are never persisted, token hashes are unique and constrained, tenant/job/candidate/interviewer-version relationships are enforced by composite foreign keys, RLS is enabled, anon has no table privilege, authenticated users have read-only role-gated access, and direct browser mutation is denied. Public token resolution and lifecycle RPC attack surfaces remain future M04.3–M04.4 work and must receive fresh review.

## Accessibility Review
PENDING for candidate-facing UI in M04.4–M04.7.

## Performance Review
Current persistence work is bounded by indexed tenant/job access and unique token lookup constraints. Public lookup behavior will be reviewed when M04.4 is implemented.

## AI / Eval Review
Candidate-facing disclosure must accurately state AI/transcription use. Candidate text remains untrusted input. No autonomous hiring decision authority is introduced by M04.1–M04.2.

## Code Review Findings
- Critical: 0 unresolved.
- Important: 0 unresolved.
- Latest GitHub recovery before this reconciliation found no unresolved PR review threads.

## Fixes / Re-review
No Critical or Important findings require fixes for completed M04.1–M04.2. Re-review after lifecycle/public-token surfaces are introduced.

## Fresh Verification Commands
Repository CI currently covers frozen install, lint, typecheck, unit/component tests, framework/source verifiers, local Supabase, build, Chromium E2E, and PRD coverage.

## Fresh Verification Results
Exact implementation/provider head `af46174165c6a90f0fb03525afb0ffa0bbfba128` passed CI #451 / `34681517870` across the complete repository quality gate before this documentation reconciliation.

## Commits / Files Changed
Key M04.2 additions include `src/lib/candidates/invitation-token.ts`, its TDD test, `supabase/migrations/202609120012_create_candidate_invitations.sql`, migration contract tests, and `e2e/candidate-invitations.spec.ts`.

## Known Limitations
M04 is not complete. Invitation lifecycle transitions, public invitation resolution, candidate pre-interview UI, disclosure/consent evidence, accommodation/support, and final security/replay closeout remain unfinished.

## Documentation Updated
This living ledger is reconciled through verified M04.2. Documentation commits create a newer head, so exact-head CI must be re-established before any later integration claim.

## Durable Recovery Sources
`AGENTS.md` → `docs/AUTONOMOUS-DEVELOPMENT.md` → `docs/progress/STATUS.md` → known issues → this ledger → relevant PRD → selected spec/plan → active PR/reviews/exact-head CI → source/tests.

## Completion Checklist
- [ ] Requirements and iterations accounted for.
- [ ] Acceptance criteria verified.
- [x] M04.1 candidate records verified.
- [x] M04.2 secure token/persistence verified.
- [ ] M04.3–M04.8 complete.
- [ ] Required final security/accessibility/performance/AI-eval reviews complete.
- [x] 0 Critical / 0 Important findings for completed work.
- [ ] Traceability/feature matrix reconciled for milestone closeout.
- [ ] Exact-final-head CI green at milestone completion.
- [x] Durable status is being reconciled for current active work.

## Exact Next Unit
M04.3 Invitation lifecycle — establish RED evidence for monotonic `draft -> sent -> opened -> started -> completed` transitions and terminal denial after expiry/revocation/completion, then implement authoritative database transition enforcement.

## Next Milestone
M05 — Realtime AI Interview.
