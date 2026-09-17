# Session Handoff

This handoff never outranks actual Git/code/current exact-SHA CI. Recover `AGENTS.md`, `CODEX-START-HERE.md`, `docs/AUTONOMOUS-DEVELOPMENT.md`, and live GitHub state first.

## Repository state

- Repository: `salman0butt/hire-evidence`
- Default branch: `main`
- Verified base/main SHA: `d85883f4177e2ec122a695092d5c6ac846afbe72` (M07 squash merge; post-merge CI #920 GREEN).
- Active branch: `feat/hiring-team-review`
- Active milestone: M08 — Hiring Team Review Experience — **IMPLEMENTING M08.2**.
- Active milestone PR: #10 — `Build hiring team review experience` — OPEN / DRAFT.
- Selected design: `docs/superpowers/specs/2026-09-16-hiring-team-review-design.md`.
- Selected plan: `docs/superpowers/plans/2026-09-16-hiring-team-review.md`.
- Latest verified behavioral head: `f36b520eacee26069ee7da8047bbae50ebe1f727`, CI #930 / run `35206818423` — GREEN.

## M08 state

M08.1 candidate result projection/page is VERIFIED. It includes the fail-closed candidate-result repository, authoritative `get_candidate_review_result` security-definer RPC, provider-backed tenant/job/candidate/completed-assessment tests, and candidate result page.

TDD evidence: repository RED `2f1f7dcc…` CI #921 → GREEN `7125b5c2…` CI #922; RPC RED `d8518c26…` CI #925 → GREEN `7185d2e2…` CI #926; page RED `301be2ad…` CI #927 → initial implementation `a74d7240…` CI #928 NOT GREEN due RPC Promise typing → root-cause fix `1207c07b…` CI #929 GREEN. Verification hardening `f36b520e…` passed CI #930 and is not misrepresented as RED.

M08.2 is ACTIVE. Competency/evidence cards must use AI score or explicit insufficient evidence, rationale and validated citations. Historical competency identity must come from the immutable published interviewer-version snapshot, not mutable live competency records.

## Review / safety state

- Critical findings: **0 known**.
- Important findings: **0 known** after M08.1 scope-test hardening.
- PR #10 has no unresolved inline review threads at latest recovery.
- Humans remain hiring decision makers; no autonomous hire/reject/ranking.
- AI assessment/provenance/history remains immutable.
- Human overrides must preserve AI score and require attributable reason.
- Tenant/job/candidate/attempt/assessment authorization is server-authoritative and fail-closed.
- Transcript/model/reviewer text is untrusted inert data.

## Exact next work

1. Recheck PR #10 remote head/concurrency before writing.
2. Start M08.2 with a provider-backed RED requiring the scoped review RPC to expose the completed assessment plus immutable competency catalog from `interviewer_versions.snapshot`.
3. Verify intended RED against the exact commit.
4. Add the minimum new migration replacing/extending the RPC projection; verify provider GREEN.
5. Add repository RED for runtime assessment validation + immutable competency identity enrichment, implement minimally, then verify GREEN.
6. Add component/page RED for accessible competency/evidence cards, implement minimally, verify full gates and continue M08.3.
