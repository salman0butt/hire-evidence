# Current Milestone

Milestone:
Hiring Team Review Experience

Legacy roadmap identifier:
M08

Status:
IMPLEMENTING — M08.3 TRANSCRIPT VIEWER

Branch:
`feat/hiring-team-review`

Base:
`main` at verified M07 merge SHA `d85883f4177e2ec122a695092d5c6ac846afbe72`.

PR:
#10 — `Build hiring team review experience` — OPEN / DRAFT.

Canonical compact recovery state:
`docs/progress/STATUS.md`

Selected design:
`docs/superpowers/specs/2026-09-16-hiring-team-review-design.md`

Selected plan:
`docs/superpowers/plans/2026-09-16-hiring-team-review.md`

## Iterations
1. M08.1 — Candidate result projection/page — **VERIFIED** at `f36b520eacee26069ee7da8047bbae50ebe1f727`, CI #930 / run `35206818423` GREEN.
2. M08.2 — Competency/evidence cards — **VERIFIED** at `6616fcc735df5ee06616f3e6e2cb7146469cea7c`, CI #941 / run `35215607658` GREEN.
3. M08.3 — Transcript viewer — **ACTIVE**.
4. M08.4 — Evidence deep links — **NOT STARTED**.
5. M08.5 — Human score overrides — **NOT STARTED**.
6. M08.6 — Reviewer notes/status — **NOT STARTED**.
7. M08.7 — AI/human disagreement — **NOT STARTED**.
8. M08.8 — Job candidate dashboard — **NOT STARTED**.
9. M08.9 — Visual/accessibility/E2E closeout — **NOT STARTED**.

## Latest Verification
M08.2 exact verified behavioral head `6616fcc735df5ee06616f3e6e2cb7146469cea7c`; CI #941 / run `35215607658` complete GREEN across lint, typecheck, unit/component tests, framework/source verification, local Supabase boundary tests, build, Chromium E2E and PRD coverage.

## Review State
- Unresolved Critical findings: **0 known**.
- Unresolved Important findings: **0 known** after M08.2 skeptical review and validation hardening.
- PR #10 unresolved inline review threads: **0** at latest recovery.

## Constraints
- Humans remain hiring decision makers; no autonomous hire/reject/ranking.
- AI assessment/provenance/history remains immutable.
- Historical competency identity comes from the immutable published interviewer-version snapshot.
- Human overrides preserve AI score and require attributable reason.
- Tenant/job/candidate/attempt/assessment authorization is server-authoritative.
- Hiring-team transcript access must use authenticated scoped authority, not candidate invitation tokens.
- Transcript/model/reviewer text is inert data; technical events remain separate from evaluative transcript turns.

## Next Action
Execute M08.3 under strict TDD: add a provider-backed RED for an authenticated tenant/job/candidate/attempt transcript-review RPC, verify the intended missing-boundary failure, implement the minimum fail-closed projection over durable transcript turns, then add strict repository parsing and an accessible ordered/searchable speaker-separated transcript viewer.
