# Session Handoff

This handoff never outranks actual Git/code/current exact-SHA CI. Recover `AGENTS.md`, `CODEX-START-HERE.md`, `docs/AUTONOMOUS-DEVELOPMENT.md`, and live GitHub state first.

## Repository state

- Repository: `salman0butt/hire-evidence`
- Default branch: `main`
- Verified base/main SHA: `d85883f4177e2ec122a695092d5c6ac846afbe72` (M07 squash merge; post-merge CI #920 GREEN).
- Active branch: `feat/hiring-team-review`
- Active milestone: M08 — Hiring Team Review Experience — **IMPLEMENTING M08.3**.
- Active milestone PR: #10 — `Build hiring team review experience` — OPEN / DRAFT.
- Selected design: `docs/superpowers/specs/2026-09-16-hiring-team-review-design.md`.
- Selected plan: `docs/superpowers/plans/2026-09-16-hiring-team-review.md`.
- Latest verified behavioral head: `6616fcc735df5ee06616f3e6e2cb7146469cea7c`, CI #941 / run `35215607658` — GREEN.

## M08 state

M08.1 candidate result projection/page is VERIFIED at `f36b520e…` / CI #930.

M08.2 competency/evidence cards is VERIFIED at `6616fcc7…` / CI #941. The scoped result projection exposes the latest completed assessment and competency identity from the immutable published interviewer-version snapshot. The repository re-parses the M07 assessment contract, enriches configured names without mutating AI payload/history, and fails closed on decision-like payloads or unresolved competency identity. The page renders the validated assessment summary plus accessible competency cards with AI score or explicit insufficient evidence, rationale, evidence sufficiency, and inert supporting evidence references.

M08.2 TDD: provider RED `b129d5d6…` CI #932 → GREEN `3ead20de…` CI #933; repository genuine RED `7d0b86e9…` → GREEN `fd50c8a1…` CI #936; card RED `82749fa7…` CI #937 → GREEN `803ca803…` CI #938; summary RED `e46a68c7…` CI #939 → GREEN `afc3b79c…` CI #940; hardening `6616fcc7…` CI #941 GREEN. `90b39865…` was a typecheck-only harness failure and is not treated as behavioral RED.

M08.3 is ACTIVE. The durable transcript already exists from M06, but hiring-team review needs its own authenticated tenant/job/candidate/attempt-scoped read boundary. Do not use the public/candidate invitation-token transcript RPC as hiring authority. Return only finalized transcript turns in sequence order; technical interruption events remain a separate non-evaluative data surface.

## Review / safety state

- Critical findings: **0 known**.
- Important findings: **0 known** after M08.2 skeptical review and hardening.
- PR #10 has no unresolved inline review threads at latest recovery.
- Humans remain hiring decision makers; no autonomous hire/reject/ranking.
- AI assessment/provenance/history remains immutable.
- Human overrides must preserve AI score and require attributable reason.
- Tenant/job/candidate/attempt/assessment authorization is server-authoritative and fail-closed.
- Transcript/model/reviewer text is untrusted inert data; technical events are not evaluative evidence.

## Exact next work

1. Recheck PR #10 remote head/concurrency before writing.
2. Add a provider-backed RED for `get_candidate_review_transcript(organization, job, candidate, attempt)` requiring authenticated membership, exact relationship scope, ordered durable transcript turns and exclusion of technical events.
3. Verify the intended database RED at the exact commit.
4. Add the minimum security-definer migration; revoke anonymous execution and grant authenticated execution; verify provider GREEN.
5. Add a repository RED for strict transcript parsing/order/integrity and implement minimally.
6. Add a page/component RED for an accessible speaker-separated ordered transcript viewer with search, using the server-derived reviewed `attempt_id`; render transcript text inertly.
7. Verify full exact-head gates, perform skeptical review, reconcile state, then continue M08.4 evidence deep links.
