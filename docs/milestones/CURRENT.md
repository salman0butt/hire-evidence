# Current Milestone

Milestone:
Hiring Team Review Experience

Legacy roadmap identifier:
M08

Status:
IMPLEMENTING — M08.2 COMPETENCY / EVIDENCE CARDS

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
2. M08.2 — Competency/evidence cards — **ACTIVE**.
3. M08.3 — Transcript viewer — **NOT STARTED**.
4. M08.4 — Evidence deep links — **NOT STARTED**.
5. M08.5 — Human score overrides — **NOT STARTED**.
6. M08.6 — Reviewer notes/status — **NOT STARTED**.
7. M08.7 — AI/human disagreement — **NOT STARTED**.
8. M08.8 — Job candidate dashboard — **NOT STARTED**.
9. M08.9 — Visual/accessibility/E2E closeout — **NOT STARTED**.

## Latest Verification
M08.1 exact verified head `f36b520eacee26069ee7da8047bbae50ebe1f727`; CI #930 / run `35206818423` complete GREEN across lint, typecheck, unit/component tests, framework/source verification, local Supabase boundary tests, build, Chromium E2E and PRD coverage.

## Review State
- Unresolved Critical findings: **0 known**.
- Unresolved Important findings: **0 known** after M08.1 provider-backed scope hardening.
- PR #10 unresolved inline review threads: **0** at latest recovery.

## Constraints
- Humans remain hiring decision makers; no autonomous hire/reject/ranking.
- AI assessment/provenance/history remains immutable.
- Historical competency identity for review must come from the immutable published interviewer-version snapshot, not a mutable live competency record.
- Human overrides preserve AI score and require attributable reason.
- Tenant/job/candidate/attempt/assessment authorization is server-authoritative.
- Transcript/model/reviewer text is inert data.

## Next Action
Execute M08.2 under strict TDD: require the scoped result projection to expose the completed assessment and immutable competency catalog, verify genuine provider RED, implement the minimum projection, then add repository validation/enrichment and accessible competency/evidence cards through separate RED→GREEN cycles.
