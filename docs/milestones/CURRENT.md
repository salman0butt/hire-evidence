# Current Milestone

Milestone:
Candidates + Invitations

Legacy roadmap identifier:
M04

Current capability:
M04.1 candidate records and M04.2 secure invitation tokens/persistence are verified. The next unfinished unit is M04.3 invitation lifecycle.

Status:
IN PROGRESS

Branch:
`feat/candidates-invitations`

Base:
`main` at verified M03 merge SHA `729474ffb03075c93dfa2564f0004f1590533753`

PR:
#6 — `Build candidates and secure invitations` — OPEN / DRAFT / unmerged.

Canonical compact recovery state:
`docs/progress/STATUS.md`

## Iterations

1. M04.1 — Candidate records — **VERIFIED**.
2. M04.2 — Secure token service + invitation persistence — **VERIFIED**.
3. M04.3 — Invitation lifecycle — **NEXT / NOT STARTED**.
4. M04.4 — Public candidate route — **NOT STARTED**.
5. M04.5 — Pre-interview experience — **NOT STARTED**.
6. M04.6 — Disclosure + consent — **NOT STARTED**.
7. M04.7 — Accommodation/support path — **NOT STARTED**.
8. M04.8 — Security E2E closeout — **NOT STARTED**.

## Verification state

M04.2 provider verification head `af46174165c6a90f0fb03525afb0ffa0bbfba128` passed CI #451 / `34681517870` across frozen install, lint, typecheck, unit/component tests, framework/source verification, local Supabase startup, build, Chromium E2E, PRD coverage, and cleanup.

Task 2's earlier strict TDD evidence is recorded in `docs/milestones/M04-candidates-invitations.md`, including RED `f447b4d...` / CI #447 for the token module and RED `3df096e...` / CI #449 for invitation persistence, followed by full GREEN runs #448, #450, and provider verification #451.

Documentation reconciliation creates newer branch heads and therefore does not replace the implementation evidence above; exact-final-head CI will be required again at milestone closeout.

## Review state

For completed M04.1–M04.2, latest review/recovery has 0 unresolved Critical and 0 unresolved Important findings and no unresolved GitHub review threads. Security invariants: raw invitation tokens are not persisted, hashes are unique, invitation bindings are tenant/job/candidate/interviewer-version constrained, authenticated browser mutation is denied, anon has no table privilege, and RLS remains authoritative.

## Next Action

Start M04.3 with strict RED tests for monotonic `draft -> sent -> opened -> started -> completed` transitions and terminal denial after expiry, revocation, or completion. Implement authoritative database transition checks, verify exact-head CI, then continue directly to M04.4 when M04.3 is genuinely complete.
