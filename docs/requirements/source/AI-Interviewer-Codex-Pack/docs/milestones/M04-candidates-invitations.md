# M04 — Candidates + Invitations

## Authoritative PRD milestone definition

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

---

## Default iteration decomposition

- **M04.1 — Candidate records:** minimal candidate identity + job relation.
- **M04.2 — Secure token service:** opaque random tokens, hash-at-rest, expiry/revocation.
- **M04.3 — Invitation lifecycle:** draft/sent/opened/started/completed/expired/revoked.
- **M04.4 — Public candidate route:** narrowly scoped server lookup/authorization.
- **M04.5 — Pre-interview experience:** company/role/duration/format/technical requirements.
- **M04.6 — Disclosure + consent:** AI/transcription/data/retention events.
- **M04.7 — Accommodation/support path:** alternative-process information.
- **M04.8 — Security E2E:** enumeration/replay/expiry/revocation/completed-token cases.

## Required workflow per iteration

1. Recover repository/PR/CI/review state.
2. Confirm iteration acceptance criteria and dependencies.
3. Write/update design and plan where needed.
4. Use TDD/characterization tests.
5. Implement the smallest coherent capability.
6. Run focused tests, then broader verification.
7. Review from relevant P0/specialist lenses and fix findings.
8. Re-run fresh verification.
9. Commit/push coherently and update `CURRENT.md`.

## Milestone completion gate

Do not mark COMPLETE until the PRD exit condition above is met and final implementation, tests, review, CI, documentation and fresh verification all pass.
