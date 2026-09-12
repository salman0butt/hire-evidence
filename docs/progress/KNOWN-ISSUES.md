# Known Issues

Only unresolved or materially relevant issues belong here.

## Current unresolved issues

No Critical or Important M03 implementation/review issue is currently known.

The only current merge blocker is procedural/evidence-based: closeout documentation changes the PR head after implementation CI #430 passed, so fresh exact-final-head CI is required before merge.

Supabase logout uses the SDK default session scope. Classification: **Minor / product-semantics decision**; do not alter multi-device logout behavior without an explicit product requirement.

GitHub-hosted CI emits deprecation notices from third-party action runtimes being forced from Node 20 to Node 24, plus transitive runtime deprecation notices. Classification: **Informational/external maintenance**, not an application correctness blocker.

## Recently resolved M03 execution issues

- Important deterministic-ordering finding: `job_requirements` originally permitted duplicate positions across requirement kinds. The authoritative invariant is now `unique (job_id, position)` and passed the complete repository gate.
- Builder closeout CI #428 / `34676664381` exposed an ambiguous competency checkbox locator. Root cause was Playwright substring label matching; commit `26fd9a81f02bbeb69f5d4570313f1e42e4a41175` made it exact.
- CI #429 / `34676971822` then exposed an ambiguous interviewer duration locator. Commit `6b3526aacfe8d5f0df33b699012bd11e521228bc` made it exact.
- CI #430 / `34677201542` passed the complete quality gate on the corrected implementation head, including provider-backed E2E and PRD coverage.

## Merge gate

PR #5 remains OPEN / DRAFT until fresh exact-final-head CI passes this documentation reconciliation and the final head/review/concurrency re-check succeeds. With those gates satisfied, the user's standing authorization permits autonomous milestone merge without additional approval.
