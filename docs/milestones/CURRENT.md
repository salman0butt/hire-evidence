# Current Milestone

Milestone:
SaaS Shell + Auth

Legacy roadmap identifier:
M01

Current capability:
Core email authentication flows — durable reconciliation

Status:
IMPLEMENTING

Branch:
`feat/saas-shell-auth`

Base:
`main`

PR:
#3 — open draft, `Build SaaS shell and authentication`

Canonical compact recovery state:
`docs/progress/STATUS.md`

Detailed known issues:
`docs/progress/KNOWN-ISSUES.md`

## Dependency closeout

Product Foundation is COMPLETE. PR #2 merged to `main` as `64ebeb4f7b2a39fc0557685ef34035650211aad9`; post-merge CI `34486610200` / #57 passed.

## Completed in M01

- M01.1 marketing shell: VERIFIED on `6107253fdde1639097a6e6a6d8fd3777f242e5a4`; CI #64 PASS.
- M01.2 Supabase SSR/session infrastructure: VERIFIED on `c1a11206916684546c8b8dcdd89f4a3908fe359e`; CI `34499829397` / #83 PASS.
- M01.3 core email authentication: validation, accessible login/signup forms, signup/login/logout server actions, bounded provider errors, internal-only login redirect, and token-hash confirmation route are implemented and provider-independently verified on `32326d4715b1c60c485b40308df0c5f022c01bbb`; CI `34502240299` / #103 PASS with 25 tests and all repository gates.
- Supabase SSR email-template/project configuration required for provider-backed verification is durably documented in `docs/SUPABASE-AUTH-SETUP.md`.

## In progress

- Durable recovery reconciliation after verified M01.3 code/setup head.

## Remaining

1. M01.4 — password recovery.
2. M01.5 — protected application shell.
3. M01.6 — basic profile persistence with RLS/cross-user isolation.
4. M01.7 — accessibility/provider-backed E2E/security-review/closeout.

## Blocker

No blocker prevents M01.4 after fresh exact-head CI validates this reconciliation. Provider-backed Supabase verification remains mandatory before final M01 completion.

## Verification state

Reviewed M01.3 code/setup head `32326d4715b1c60c485b40308df0c5f022c01bbb` passed:

- frozen dependency install;
- lint;
- typecheck;
- unit/component/integration tests: 25 passed;
- framework verifier tests;
- requirements-source verifier tests;
- autonomous-framework verification;
- requirements-source integrity;
- production build;
- Chromium install + smoke E2E;
- PRD coverage;
- exact-head CI `34502240299` / #103.

Newer durable reconciliation heads require fresh exact-head CI.

## Next Action

Follow `docs/progress/STATUS.md` `Exact next work:`. After final reconciliation CI is green, begin M01.4 test-first and keep PR #3 open/draft and unmerged unless explicitly authorized.
