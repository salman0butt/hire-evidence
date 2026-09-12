# Current Milestone

Milestone:
Candidates + Invitations

Legacy roadmap identifier:
M04

Current capability:
M04.1 candidate records, M04.2 secure invitation tokens/persistence, M04.3 authoritative invitation lifecycle, and M04.4 public invitation resolution are verified. The next unfinished unit is M04.5 pre-interview experience.

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
4. M04.4 — Public candidate route / invitation resolution — **VERIFIED**.
5. M04.5 — Pre-interview experience — **NEXT / NOT STARTED**.
6. M04.6 — Disclosure + consent — **NOT STARTED**.
7. M04.7 — Accommodation/support path — **NOT STARTED**.
8. M04.8 — Security E2E closeout — **NOT STARTED**.

## Verification state

M04.4 final implementation head `2d5883ce57916b4a48ec338d6ea8816eb3470d80` passed CI #473 / `34684127179` across frozen install, lint, typecheck, all 322 unit/component tests, framework/source verification, local Supabase reset, production build, Chromium E2E, PRD coverage, and cleanup.

M04.4 TDD evidence: SQL-boundary RED `2c931522851abbf39513f44f09070c745082069e` / CI #465 failed only because the public invitation migration did not exist; server-resolver RED `d3f808ea7b7c1acd6d5d7e408fe52bc2ddef7545` / CI #468 failed only because `public-invitation.ts` did not exist; route RED `fd759ad8da07ad8dfc29a4b2336ce20625605956` / CI #470 failed only because the public page did not exist. Security RED `ff992cf8762dcc59c9d21a70d1a6ad6f5a98c30f` / CI #472 then proved draft invitations were still publicly resolvable and authenticated visitors lacked the same narrow RPC capability. The final hardening restricts public resolution to sent/opened/started invitations and grants only function execution to anon/authenticated roles.

Documentation reconciliation creates newer branch heads and does not replace the verified implementation evidence above. Exact-final-head CI will be re-established after the next behavioral unit.

## Review state

Latest GitHub recovery found 0 unresolved review threads. For completed M04.1–M04.4 there are 0 unresolved Critical and 0 unresolved Important findings. M04.4 hashes raw tokens server-side, returns only organization/job display fields, uses a `SECURITY DEFINER` RPC with blank `search_path`, exposes no invitation table grant, fails closed for draft/expired/revoked/completed invitations, and supports both anonymous and authenticated visitors without broadening tenant access.

## Next Action

Start M04.5 with strict RED tests requiring the safe public projection to derive expected duration and interview format from the invitation-bound immutable interviewer-version snapshot. Then add the focused pre-interview experience covering company, role, expected duration, format, technical requirements, privacy summary, and start prerequisites with semantic/accessibility tests. Verify exact-head CI and continue directly to M04.6 when M04.5 is genuinely complete.