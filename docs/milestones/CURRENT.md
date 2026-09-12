# Current Milestone

Milestone:
Realtime AI Interview

Legacy roadmap identifier:
M05

Status:
ACTIVE

Branch:
`feat/realtime-ai-interview`

Base:
`main` at verified M04 merge SHA `943e8a5c1dd45dc1652453ddf8ebc4ae31951925`

PR:
#7 — `Build realtime AI interview` — OPEN / DRAFT / unmerged. Reuse this PR for M05; do not create a duplicate.

Canonical compact recovery state:
`docs/progress/STATUS.md`

## Iterations

1. M05.1 — Reference characterization — **VERIFIED**.
2. M05.2 — Session authorization/provider boundary — **ACTIVE / PARTIALLY VERIFIED**; provider-neutral authorization/persistence/token lifetime boundaries exist, while provider-specific credential issuance remains blocked on authoritative provider selection.
3. M05.3 — Browser compatibility + microphone diagnostics — **VERIFIED**.
4. M05.4 — Deterministic Web Audio capture — **VERIFIED**.
5. M05.5 — Provider-neutral realtime transport — **VERIFIED (provider-neutral scope)**; provider adapter remains blocked until provider selection is authoritative.
6. M05.6 — AI audio playback — **VERIFIED**.
7. M05.7 — Connection state machine + accessible controls — **VERIFIED**.
8. M05.8 — Deterministic interview-plan execution — **VERIFIED**.
9. M05.9 — Pacing/time budget — **NEXT**.
10. M05.10 — Bounded follow-ups — **NOT STARTED**.
11. M05.11 — Barge-in/orchestration — **NOT STARTED**.
12. M05.12 — Timeout/error handling — **NOT STARTED**.
13. M05.13 — Same-attempt reconnect — **NOT STARTED**.
14. M05.14 — Full realtime E2E and closeout — **NOT STARTED**.

## Latest Verification

M04 PR #6 was squash-merged to `main` as `943e8a5c1dd45dc1652453ddf8ebc4ae31951925`; post-merge CI #517 / `34692492691` passed the complete repository gate.

Latest verified M05 behavioral head `a184da9ec54aa317fa42c600591be422676797d1` passed CI #623 / `34722042401`: frozen dependencies, lint, typecheck, unit/component tests, framework/source verification, local Supabase, production build, Chromium E2E, PRD coverage, and cleanup all GREEN.

Recent evidence:
- M05.7 state-machine RED `15f887e62d628965a01b7f58363fb63d50b339e0`, CI #616 / `34719618954`.
- M05.7 accessible-controls RED `2faa12fca7d0f39a5b411259286f54a11176d5d1`, CI #618 / `34719805392`.
- M05.7 GREEN `6a440ccd0233b2083c47f3ec9991b897487dbad6`, CI #619 / `34720013611`.
- M05.8 initial RED `1ef658fabd7ca8b8c29921661c9e2f42001a0c16`, CI #620 / `34721584894`.
- M05.8 initial GREEN `0fab34a4a61dd4d8c91c1ca80e1055905bf2e6f9`, CI #621 / `34721656385`.
- M05.8 review RED `a3224b943c5b4613c58b54e0ca3953d97285975f`, CI #622 / `34721926133` proved future planned questions were incorrectly authorizable.
- M05.8 reviewed GREEN `a184da9ec54aa317fa42c600591be422676797d1`, CI #623 / `34722042401` restricts authority to the current deterministic cursor.

## Review State

- Unresolved Critical findings: **0** for implemented M05 slices.
- Unresolved Important findings: **0** for implemented M05 slices.
- PR #7 had no unresolved review threads at the latest recovery check.
- M05.8's Important future-question authority finding is fixed and regression-tested; candidate/model input cannot reorder the immutable published plan or expand follow-up limits through the runner.

## Next Action

Begin M05.9 with strict TDD for pure pacing/time-budget decisions: monotonic elapsed-time accounting, resistance to backwards clock changes, optional-follow-up suppression near deadline, graceful completion, and explicit treatment of infrastructure downtime without candidate-quality inference.
