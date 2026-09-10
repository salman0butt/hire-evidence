# M04 — Candidates + Invitations

Status: **NOT STARTED**

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
Candidate access uses opaque, expiring, revocable, narrowly scoped invitation tokens. Store token hashes where practical; public candidate routes authorize only the specific invitation/session.

## Selected Design / Implementation Plan
- Not created yet. On activation, recover requirements, use Superpowers brainstorming/design, write an executable plan, and record the selected paths here.

## Acceptance Criteria
- PRD deliverables and exit criteria pass.
- All required iterations are complete or explicitly resolved.
- Relevant security/privacy/tenancy/accessibility/performance/AI-safety gates pass.
- 0 unresolved Critical or Important review findings.
- Traceability and feature state are reconciled.
- Exact-final-head CI is green.

## Tasks / Iterations
1. **NOT STARTED** — M04.1 — Candidate records: minimal candidate identity + job relation.
2. **NOT STARTED** — M04.2 — Secure token service: opaque random tokens, hash-at-rest, expiry/revocation.
3. **NOT STARTED** — M04.3 — Invitation lifecycle: draft/sent/opened/started/completed/expired/revoked.
4. **NOT STARTED** — M04.4 — Public candidate route: narrowly scoped server lookup/authorization.
5. **NOT STARTED** — M04.5 — Pre-interview experience: company/role/duration/format/technical requirements.
6. **NOT STARTED** — M04.6 — Disclosure + consent: AI/transcription/data/retention events.
7. **NOT STARTED** — M04.7 — Accommodation/support path: alternative-process information.
8. **NOT STARTED** — M04.8 — Security E2E: enumeration/replay/expiry/revocation/completed-token cases.

## TDD Evidence
PENDING — milestone has not started. Never fabricate evidence.

## Integration Test Evidence
PENDING — milestone has not started. Never fabricate evidence.

## E2E / Visual Verification
PENDING — define milestone-specific browser/realtime/visual scenarios before closeout where applicable.

## Security Review
PENDING — cover auth/authz, tenant isolation, untrusted input, secrets, data exposure, injection and milestone-specific threats.

## Accessibility Review
PENDING where UI exists — keyboard, focus, semantics, labels, status/error states, responsive and assistive-technology paths.

## Performance Review
PENDING where relevant — bounded work, pagination, resource limits, retries and hot-path cost.

## AI / Eval Review
Candidate-facing disclosure must accurately state AI/transcription use. Candidate text remains untrusted input.

## Code Review Findings
None yet; milestone has not started.

## Fixes / Re-review
PENDING when evidence-backed findings exist.

## Fresh Verification Commands
Run repository-wide verification plus milestone-specific tests. Baseline:

```bash
pnpm lint
pnpm typecheck
pnpm test
pnpm build
pnpm e2e
python3 scripts/verify_autonomous_framework.py
python3 scripts/verify_prd_coverage.py
```

## Fresh Verification Results
PENDING — milestone has not started.

## Commits / Files Changed
None yet.

## Known Limitations
Milestone is NOT STARTED; implementation-specific limitations are not yet known.

## Documentation Updated
This living ledger must be reconciled whenever milestone state/evidence changes.

## Durable Recovery Sources
`AGENTS.md` → `docs/AUTONOMOUS-DEVELOPMENT.md` → `docs/progress/STATUS.md` → known issues → this ledger → relevant PRD → selected spec/plan → active PR/reviews/exact-head CI → source/tests.

## Completion Checklist
- [ ] Requirements and iterations accounted for.
- [ ] Acceptance criteria verified.
- [ ] Required TDD/integration/E2E evidence recorded.
- [ ] Security/accessibility/performance/AI-eval reviews complete where relevant.
- [ ] 0 Critical / 0 Important findings.
- [ ] Traceability/feature matrix reconciled.
- [ ] Exact-final-head CI green.
- [ ] Durable status/closeout state current.

## Next Milestone
M05 — Realtime AI Interview.
