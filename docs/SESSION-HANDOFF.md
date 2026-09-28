# Session Handoff

Read live Git/PR/CI and `docs/progress/STATUS.md` first; older text may be stale.

## Recovered state on 2026-09-26
- Main `54444d49761b7eb089c1c6a30a27fdfd115cdd9e`; CI #1084 GREEN. M00–M10 merged.
- M11 enterprise readiness ACTIVE; branch `feat/enterprise-readiness`; PR #13 OPEN/DRAFT; pre-reconciliation head `b388936674db6d8f5dbeb945d93da37a6b5ba8db`.
- M11.1 audit and M11.2 retention VERIFIED. M11.2 head `91a19c3274b77f77d5ac6f701984f2ecc746d314`; CI #1099 GREEN.
- M11.3 lifecycle RED `c9bb5b0b509a057a621411945743d8e622b035ae` / CI #1102; minimal TypeScript implementation `b388936674db6d8f5dbeb945d93da37a6b5ba8db`.
- CI #1103 / `36020938314`: 753 unit/component tests passed, framework verifier failed missing STATUS `CI status:`; later database/build/E2E not run. This documentation reconciliation fixes the marker; do not infer new exact-head CI passed.
- 0 reviews, 0 unresolved inline threads at recovery; incomplete M11 blocks merging.

## Next
Verify documentation-marker fix on the new exact head. Then inventory Supabase candidate artifacts and create behavioral RED for tenant-scoped idempotent deletion, adversarial cross-tenant denial, retries, partial failure and historical-integrity/minimal-audit handling. The state-machine contract must not be confused with actual data erasure.

Exact next work: recheck exact-head CI for marker repair, then establish persisted deletion RED.

## Verified recovery on 2026-09-28
- The earlier handoff above is historical, not live execution state. Actual main remains `54444d49761b7eb089c1c6a30a27fdfd115cdd9e`; PR #13 was still OPEN/DRAFT at artifact-chain RED head `f3ec33f32f155b75cbfc996bcbee84d1b6eecbd1` when this note was written.
- Full exact-head CI #1104 (`f379f2afd4e6a570a86d374ef410269f2ff5e3e1`) fixed the STATUS marker; initial candidate-row deletion passed CI #1106 (`4050e110cd7845f371ebfe4027d75dacc8a2a166`).
- Artifact-chain test at `f3ec33f32f155b75cbfc996bcbee84d1b6eecbd1` was confirmed genuinely RED by CI #1107 (https://github.com/salman0butt/hire-evidence/actions/runs/36263470981): 13/14 assertions failed because restrictive `candidate_invitations_candidate_id_fkey` prevents candidate-row-only erasure. Previous lint/typecheck/unit/framework stages passed. This is NOT GREEN or full M11.3 completion.
- Next: add a subsequent migration performing tenant-scoped transactional, FK-ordered deletion of candidate reviews/overrides, generations/evidence, transcript/technical events, attempts, consent events, invitations and candidate; preserve owner/admin authorization, one minimal receipt/audit, retry idempotence and fail-closed semantics. Test external audio/traces separately where applicable. Keep PR draft until all M11 gates pass.
- This handoff update is a safe GitHub connector file-write diagnostic after switching the GitHub-specific app permission to Allow all actions. Its own commit/CI must be recovered live; do not infer that artifact-chain tests passed merely because the connector accepted a documentation write.

## Recovery update — 2026-09-28, M11.3 SQL implementation
- Assessment-trigger-inclusive pgTAP test commit `66fe1a7455915718c23846d363ddf6cf134afb14` / CI #1109 was genuine RED: 14/15 failed at restrictive candidate-invitation FK; lint/typecheck/unit/framework succeeded.
- Follow-on transactional FK-ordered deletion migration `supabase/migrations/202609280001_erase_candidate_artifacts.sql`, head `be3b96a3d277668ffa95c61027c8b0626a1bb077`, passed exact-head full CI #1110 https://github.com/salman0butt/hire-evidence/actions/runs/36463309265.
- A separate adversarial rollback/retry test was added to artifact-chain pgTAP at head `fdd2f54e8e286ed64cb1c38581457c9ef1c88203`; CI #1111 https://github.com/salman0butt/hire-evidence/actions/runs/36464166029 was running when written. Recover it live. This docs update is newer and requires exact-head CI too.
- M11.3 still ACTIVE: determine applicability of external audio/model trace retention/deletion, verify rollbacks and safety, reconcile traceability. M11.4–M11.7 planned; M11.8 conditional; PR #13 OPEN/DRAFT, do not merge now.
