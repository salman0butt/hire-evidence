# Current Milestone

Milestone:
Candidates + Invitations

Legacy roadmap identifier:
M04

Current capability:
M04.1 candidate records, M04.2 secure invitation tokens/persistence, and M04.3 authoritative invitation lifecycle are verified. The next unfinished unit is M04.4 public invitation resolution.

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
3. M04.3 — Invitation lifecycle — **VERIFIED**.
4. M04.4 — Public candidate route / invitation resolution — **NEXT / NOT STARTED**.
5. M04.5 — Pre-interview experience — **NOT STARTED**.
6. M04.6 — Disclosure + consent — **NOT STARTED**.
7. M04.7 — Accommodation/support path — **NOT STARTED**.
8. M04.8 — Security E2E closeout — **NOT STARTED**.

## Verification state

M04.3 provider-verification head `d8c5317c1d5a28aaec89a826002847db96ed9cdf` passed CI #460 / `34682867624` across frozen install, lint, typecheck, all 312 unit/component tests, framework/source verification, local Supabase reset, build, Chromium E2E, PRD coverage, and cleanup.

Lifecycle TDD evidence: RED `792e56f422e1f77be6967facca73e69388314340` / CI #456 failed only because the lifecycle migration was absent; schema GREEN was established at `9267e97d7467af5049a2c0ac7cf95b4b3e3cb465` / CI #458; provider behavior was then exercised. CI #459 was an invalid NOT GREEN caused by a revoked-row fixture timestamp preceding database `created_at`; the fixture was corrected without weakening the constraint, and CI #460 passed.

Documentation reconciliation creates newer branch heads and does not replace the verified implementation evidence above. Exact-final-head CI will be re-established after the next behavioral unit.

## Review state

Latest GitHub recovery found 0 unresolved review threads. For completed M04.1–M04.3 there are 0 unresolved Critical and 0 unresolved Important findings. M04.3 transition authority remains database-enforced, direct authenticated table updates remain revoked, the manager transition RPC is not anonymous, and expired/revoked/completed/replayed transitions fail closed.

## Next Action

Start M04.4 with strict RED tests requiring invalid/expired/revoked/completed tokens to return the same safe failure shape, raw tokens to be hashed server-side, exactly one invitation to be resolved, and the result to expose only a safe public projection. Implement the minimal server-only/public-RPC authorization boundary with no service-role browser client, verify provider behavior and exact-head CI, then continue directly to M04.5 when M04.4 is genuinely complete.
