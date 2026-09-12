# Known Issues

Only unresolved or materially relevant issues belong here.

## Current unresolved issues

No Critical or Important M04 implementation/review issue is currently known.

The only current M04 merge blocker is procedural/evidence-based: durable closeout documentation changes the PR head after implementation CI #507 passed, so fresh exact-final-head CI is required before merge.

Supabase logout uses the SDK default session scope. Classification: **Minor / product-semantics decision**; do not alter multi-device logout behavior without an explicit product requirement.

GitHub-hosted CI emits deprecation notices from third-party action runtimes being forced from Node 20 to Node 24, plus transitive runtime deprecation notices. Classification: **Informational/external maintenance**, not an application correctness blocker.

## Recently resolved M04 execution issues

- CI #505 / `34690796275` failed only in `e2e/organization-ui.spec.ts`: after candidate-support email and URL were correctly added to organization settings, the older keyboard test still expected `Save settings` immediately after `Hiring use case`. Root cause was stale accessibility coverage, not incorrect UI behavior. Commit `ac047aff7cffb335226702e24b443cd1706796a9` updated the expected focus sequence; CI #506 / `34691250632` passed the complete quality gate.
- M04.8 browser/security closeout commit `8a6f6cc8adba2d39f2b255a74db166e3285527ba` passed CI #507 / `34691558117`, including local Supabase, build, Chromium E2E, and PRD coverage.
- Earlier M04.3 provider checkpoint `9d97ec54c1fd2872fca62b9abe1e7290427d4264` exposed a test fixture timestamp that violated the legitimate `revoked_at >= created_at` constraint by milliseconds. The fixture was corrected without weakening production constraints; `d8c5317c1d5a28aaec89a826002847db96ed9cdf` / CI #460 passed.

## Merge gate

PR #6 remains OPEN / DRAFT until final documentation/PR reconciliation is complete, exact-final-head CI is green, and the final remote head/review/concurrency/mergeability checks succeed. With those gates satisfied, the repository owner's standing authorization permits autonomous squash merge without additional approval.
