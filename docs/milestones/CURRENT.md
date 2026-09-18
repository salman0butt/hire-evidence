# Current Milestone

Milestone:
Hiring Team Review Experience

Legacy roadmap identifier:
M08

Status:
IMPLEMENTING — M08.4 EVIDENCE DEEP LINKS

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
4. M08.4 — Evidence deep links — **ACTIVE**.
5. M08.5 — Human score overrides — **NOT STARTED**.
6. M08.6 — Reviewer notes/status — **NOT STARTED**.
7. M08.7 — AI/human disagreement — **NOT STARTED**.
8. M08.8 — Job candidate dashboard — **NOT STARTED**.
9. M08.9 — Visual/accessibility/E2E closeout — **NOT STARTED**.

## Latest Verification
M08.3 exact verified head `7cb2b5077aa5b03348c29ee86af0a56e954f0624`; CI #951 / run `35320101385` complete GREEN across frozen install, lint, typecheck, unit/component tests, framework/source verification, local Supabase boundary tests, build, Chromium E2E and PRD coverage. Provider RED `67196c6b…` / CI #943 and page integration RED `280ca6ee…` / CI #950 were genuine. Repository/viewer checkpoints `1dd1d7a1…` / #946 and `2e32b19a…` / #948 stopped at TS2307 missing-module typecheck and are explicitly **NOT** behavioral RED evidence.

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
Execute M08.4 under strict TDD: require each validated assessment citation to resolve to an exact transcript turn, then add keyboard-accessible evidence links that move focus to that turn and visibly highlight the cited excerpt without trusting arbitrary client selectors. Fail closed when a citation cannot resolve to the reviewed transcript.
