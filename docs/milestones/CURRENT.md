# Current Milestone

Milestone:
Hiring Team Review Experience

Legacy roadmap identifier:
M08

Status:
IMPLEMENTING — M08.5 HUMAN SCORE OVERRIDES

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
3. M08.3 — Transcript viewer — **VERIFIED** at `7cb2b5077aa5b03348c29ee86af0a56e954f0624`, CI #951 / run `35320101385` GREEN.
4. M08.4 — Evidence deep links — **VERIFIED** at `d0ed14671c214e5a2e38351147bc6dc54b068f29`, CI #970 / run `35444823271` GREEN.
5. M08.5 — Human score overrides — **ACTIVE**.
6. M08.6 — Reviewer notes/status — **NOT STARTED**.
7. M08.7 — AI/human disagreement — **NOT STARTED**.
8. M08.8 — Job candidate dashboard — **NOT STARTED**.
9. M08.9 — Visual/accessibility/E2E closeout — **NOT STARTED**.

## Latest Verification
M08.4 exact verified head `d0ed14671c214e5a2e38351147bc6dc54b068f29`; CI #970 / run `35444823271` complete GREEN across frozen install, lint, typecheck, unit/component tests, framework/source verification, local Supabase boundary tests, build, Chromium E2E and PRD coverage. Hardening RED `ca7c1247…` / CI #968 genuinely proved arbitrary non-evidence fragments could activate a transcript target. `2eb7ffd…` / CI #969 is explicitly NOT GREEN because the search-takeover test fixture omitted the newly required validated citation; fixture correction plus implementation passed #970.

## Review State
- Unresolved Critical findings: **0 known**.
- Unresolved Important findings: **0 known**. M08.4 arbitrary-fragment activation finding was fixed and reverified at CI #970.
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
Execute M08.5 under strict TDD: define append-only tenant-scoped human competency score override persistence that references the immutable completed assessment generation, preserves AI history, accepts only bounded `1..5 | null` human score with mandatory bounded reason, attributes the authenticated reviewer, and fails closed across tenant/job/candidate/attempt/assessment mismatches.