# Current Milestone

Milestone:
SaaS Shell + Auth

Legacy roadmap identifier:
M01

Current capability:
Provider-independent accessibility/browser closeout verified; provider-backed auth and RLS evidence remain blocked on a dedicated Supabase test environment

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
- M01.7 provider-independent accessibility/browser slice: VERIFIED at `061762ec28a9f95ed97c433f35df8eee060389fe`; CI #134 SUCCESS. The subsequent durable reconciliation head `787039c65db6f1e11c96d5298f004f5a4862f8f2` passed exact-head GitHub Actions `34517135634` / #135.

## Remaining

1. Execute real Supabase migration + User A/User B profile isolation verification.
2. Execute provider-backed signup/email verification/login/logout/password-recovery/authenticated `/app` + `/app/profile` E2E.
3. Reconcile final milestone security/accessibility/performance review and exact-final-head CI after provider evidence exists.

## Blocker

Configured Supabase provider/database evidence is mandatory before M01.6 or the milestone is called VERIFIED/COMPLETE. Connected-account discovery on 2026-09-11 found no clearly identifiable Hire Evidence test project and no unrelated project was modified. Creating a new project/development branch requires explicit organization/cost confirmation. Mocks, placeholder credentials, unrelated projects, service-role clients, and static SQL inspection do not satisfy the provider gate.

## Verification state

M01.7 browser verification initially failed at `caa82b59…`, CI #133, because an unscoped Playwright locator matched both header and footer `Log in` links. Root-cause fix `061762ec…` scoped the assertion to the banner landmark. CI #134 passed frozen install, lint, typecheck, 54 unit/component tests, framework/source verifier tests, autonomous/source integrity verification, production build, all 7 Chromium E2E tests, and PRD coverage. Durable reconciliation `787039c…` then passed the same exact-head CI gate in #135. New documentation-only recovery commits still require fresh exact-SHA CI.

## Next Action

Follow `docs/progress/STATUS.md` `Exact next work:`. Keep PR #3 open/draft and unmerged unless explicitly authorized.
