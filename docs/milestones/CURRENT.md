# Current Milestone

Milestone:
SaaS Shell + Auth

Legacy roadmap identifier:
M01

Current capability:
Provider-independent accessibility/browser closeout and Vitest configuration maintenance verified; provider-backed auth and RLS evidence remain blocked on a dedicated Supabase test environment

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

Product Foundation is COMPLETE. PR #2 was already merged to `main` as `64ebeb4f7b2a39fc0557685ef34035650211aad9`; post-merge CI #57 passed.

## Completed / Implemented in M01

- M01.1–M01.5: VERIFIED provider-independently.
- M01.6 profile persistence/RLS: IMPLEMENTED provider-independently at reviewed head `e9c2ad64f2f9065d53a44652ac1116f91538e7f7`; CI #130 SUCCESS. Real Supabase cross-user denial remains mandatory before VERIFIED.
- M01.7 provider-independent accessibility/browser slice: VERIFIED at `061762ec28a9f95ed97c433f35df8eee060389fe`; CI #134 SUCCESS.
- Focused provider-independent configuration maintenance: VERIFIED at `85ff10741875892e2787631b106cfc48bfad0d5c`; CI `34528888577` / #141 SUCCESS. The prior Vitest/Vite ESM-in-CommonJS configuration warning no longer appears in the test logs.

## Remaining

1. Execute real Supabase migration + User A/User B profile isolation verification.
2. Execute provider-backed signup/email verification/login/logout/password-recovery/authenticated `/app` + `/app/profile` E2E.
3. Reconcile final milestone security/accessibility/performance review and exact-final-head CI after provider evidence exists.

## Blocker

Configured Supabase provider/database evidence is mandatory before M01.6 or the milestone is called VERIFIED/COMPLETE. Connected-account discovery on 2026-09-11 found only clearly unrelated existing projects by schema and neither was modified. Creating a new project/development branch requires explicit organization/cost confirmation. Mocks, placeholder credentials, unrelated projects, service-role clients, and static SQL inspection do not satisfy the provider gate.

## Verification state

M01.7 browser verification initially failed at `caa82b59…`, CI #133, because an unscoped Playwright locator matched both header and footer `Log in` links. Root-cause fix `061762ec…` scoped the assertion to the banner landmark and CI #134 passed.

The configuration-maintenance head `85ff10741875892e2787631b106cfc48bfad0d5c` passed CI #141 across frozen install, lint, typecheck, 54 unit/component tests, framework/source verifier tests, autonomous/source integrity verification, production build, seven Chromium E2E tests, and PRD coverage. Test logs confirm the prior Vite config-loader warning is absent. This documentation reconciliation is newer and requires fresh exact-head CI before being called green.

## Next Action

Follow `docs/progress/STATUS.md` `Exact next work:`. Keep PR #3 open/draft and unmerged unless explicitly authorized.
