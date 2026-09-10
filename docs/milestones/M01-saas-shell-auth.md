# M01 — SaaS Shell + Auth

Status: **IMPLEMENTING**

## Goal
Deliver a premium public SaaS experience plus secure Supabase email/password authentication, protected application entry, and a minimal user profile while preserving human hiring authority and deferring organization/RBAC scope to M02.

## Authoritative PRD Milestone Definition
PRD section 196 requires premium homepage, pricing placeholder/config, signup, login, verification, forgot/reset password, authenticated shell, secure sessions, basic profile, SEO, responsive design, accessibility; exit when an authenticated user can enter the SaaS app. Relevant positioning/auth requirements trace to PRD sections 15–17 and 196.

## Dependencies
Product Foundation — COMPLETE and integrated on `main` at `64ebeb4f7b2a39fc0557685ef34035650211aad9`; post-merge CI #57 passed.

## In Scope
- premium public homepage, pricing placeholder/config, SEO, responsive design and accessibility;
- Supabase email/password auth/recovery and secure cookie-backed sessions;
- server-authoritative authenticated application shell;
- minimal own-user profile persistence protected by RLS;
- provider-backed auth E2E and cross-user profile-isolation evidence before milestone completion.

## Out of Scope
- organizations/memberships/RBAC and later product milestones;
- AI assessment or autonomous hiring decisions;
- billing enforcement and enterprise SSO;
- speculative service decomposition.

## Selected Design / Implementation Plan
- Design: `docs/superpowers/specs/2026-09-10-saas-shell-auth-design.md`
- Plan: `docs/superpowers/plans/2026-09-10-saas-shell-auth.md`

## Acceptance Criteria
- PRD deliverables and exit criteria pass.
- All M01 iterations complete or explicitly resolved.
- Provider-backed auth and RLS isolation evidence exists before completion.
- Relevant security/privacy/accessibility/performance gates pass.
- 0 unresolved Critical or Important findings.
- Traceability/feature state reconciled and exact-final-head CI green.

## Tasks / Iterations
1. **VERIFIED** — M01.1 marketing shell; CI #64.
2. **VERIFIED** — M01.2 Supabase SSR/session infrastructure; CI #83.
3. **VERIFIED (provider-independent)** — M01.3 core email auth; CI #103.
4. **VERIFIED (provider-independent)** — M01.4 password recovery; security GREEN `b048782…`, CI #121; durable repair `6833d47…`, CI #123.
5. **VERIFIED (provider-independent)** — M01.5 protected app shell; final reconciliation `f912da9…`, CI #127.
6. **IMPLEMENTED (provider verification pending)** — M01.6 basic profile persistence/settings with RLS; reviewed code/test head `e9c2ad64f2f9065d53a44652ac1116f91538e7f7`, CI #130. Real two-user Supabase RLS isolation is still required before VERIFIED.
7. **IN PROGRESS** — M01.7 accessibility + provider-backed E2E/security/review closeout. Provider-independent browser slice is verified at `061762ec28a9f95ed97c433f35df8eee060389fe`, CI #134; provider-backed scenarios remain blocked on external Supabase test configuration.

## TDD Evidence
M01.6 RED `8656902db4774ab91075e7dbadeb29464577917f`; GitHub Actions #128 failed at typecheck for intentionally absent production modules. Reviewed profile implementation `e9c2ad64f2f9065d53a44652ac1116f91538e7f7` passed CI #130.

M01.7 is verification-only rather than new product behavior. Initial browser test commit `caa82b59ebd85e20b4c02702c85587b6ce7b68cd` produced a genuine CI #133 RED: two new tests failed under Playwright strict mode because an unscoped `Log in` locator matched both header and footer links. Systematic debugging confirmed the failure was test ambiguity, not product behavior. Minimum fix `061762ec28a9f95ed97c433f35df8eee060389fe` scoped the intended locator through the `banner` landmark; CI #134 passed all gates.

## Integration Test Evidence
Profile action tests prove invalid input is rejected before authentication/persistence, row ownership comes only from server-validated `requireUser()`, forged `id` and `user_id` form fields are ignored, trimmed display names are persisted, and repository failures map to bounded user-safe errors. Structural migration tests verify RLS enablement, own-user select/insert/update policies, update `USING` plus `WITH CHECK`, auth-user ownership FK, and the 120-character database constraint. Real database execution remains mandatory.

## E2E / Visual Verification
CI #134 passes seven Chromium E2E tests. Provider-independent coverage now verifies the marketing path, unauthenticated protected-route redirect, health endpoint, a 390×844 mobile homepage without horizontal overflow, keyboard focus navigation from the home link to the header login link, labeled email/password controls on login/signup, and mobile unauthenticated `/app` return-path behavior without horizontal overflow.

This evidence does not simulate or replace provider-backed signup/email verification/login/logout/recovery/authenticated app/profile or cross-user RLS verification. Those remain mandatory before M01 completion.

## Security Review
Existing auth/profile boundaries remain unchanged by the M01.7 browser-only slice. Profile ownership is not caller-selectable; RLS remains mandatory; tokens and secrets are not added to browser tests; placeholder CI Supabase values are not treated as provider evidence. Redirect coverage continues to prove an internal `/app` return path. No service-role browser path is introduced.

## Accessibility Review
Provider-independent browser verification now proves narrow-mobile no-horizontal-overflow on the public and unauthenticated auth-entry path, keyboard focus reaches the semantically scoped header login link, and login/signup credential inputs have accessible labels. Existing visible `:focus-visible` styling and reduced-motion rules remain in place. Provider-backed keyboard/mobile verification of authenticated/profile flows remains outstanding.

## Performance Review
The M01.7 slice adds test-only browser assertions and no runtime dependencies, polling, client state, network calls, or production JavaScript. Existing profile rendering remains one authenticated identity verification plus one own-row query; save remains one upsert.

## AI / Eval Review
No assessment AI is introduced in M01. Humans remain hiring decision makers; prohibited sensitive/proxy scoring remains out of scope.

## Code Review Findings
- Critical: 0 unresolved.
- Important: 0 unresolved.
- Resolved test defect: CI #133 exposed ambiguous Playwright login locators in the new browser verification; fixed by semantic banner scoping in `061762ec…`, with CI #134 green.
- Minor: existing Vitest/Vite ESM-in-CommonJS configuration-loader warning remains deferred maintenance.
- Minor: logout default scope remains unchanged absent an explicit product-semantics requirement.

## Fixes / Re-review
The M01.7 browser test failure was debugged from exact CI logs and fixed at the locator boundary without changing production behavior or weakening assertions. Re-review confirms the new tests stay provider-independent, make no fabricated provider claims, and introduce no security or hiring-AI behavior. No unresolved Critical or Important finding is known for this slice.

## Fresh Verification Commands
```bash
pnpm install --frozen-lockfile
pnpm lint
pnpm typecheck
pnpm test
python3 -m unittest tests/python/test_verify_autonomous_framework.py
python3 -m unittest tests/python/test_verify_requirements_source.py
python3 scripts/verify_autonomous_framework.py
python3 scripts/verify_requirements_source.py
pnpm build
pnpm e2e
python3 scripts/verify_prd_coverage.py
```

## Fresh Verification Results
Provider-independent browser code head `061762ec28a9f95ed97c433f35df8eee060389fe` passed GitHub Actions `34516697315` / #134 across frozen install, lint, typecheck, 54 unit/component tests, framework/source verifier tests, both repository verifiers, production build, all 7 Chromium E2E tests, and PRD coverage. Durable reconciliation commits after that code head require their own exact-SHA CI before being called green.

## Known Limitations
M01 is not complete. The profile migration has not yet been executed against a configured Supabase test project, so User A/User B RLS denial is not proven. Provider-backed signup/email verification/login/logout/recovery/authenticated `/app` and `/app/profile` E2E also remain unfinished. Browser accessibility coverage is intentionally provider-independent and does not replace those gates.

## Documentation Updated
Status, known issues, current milestone, feature matrix, requirements traceability, M01 ledger, milestone program, and M01.7 Superpowers evidence are reconciled with the browser verification state.

## Durable Recovery Sources
`AGENTS.md` → `docs/AUTONOMOUS-DEVELOPMENT.md` → actual Git/PR/CI → `docs/progress/STATUS.md` → `docs/progress/KNOWN-ISSUES.md` → `docs/milestones/CURRENT.md` → this ledger → PRD/traceability → M01 Superpowers spec/plan/evidence → source/tests.

## Completion Checklist
- [ ] All M01 requirements and iterations accounted for.
- [x] Server-authoritative `/app` shell implemented provider-independently.
- [x] Unauthenticated `/app` browser redirect verified.
- [x] Basic profile schema, settings flow and own-user authorization boundary implemented.
- [x] Provider-independent mobile overflow, keyboard auth focus path, and auth-control labels verified in Chromium.
- [ ] Provider-backed authenticated user can enter `/app`.
- [ ] Provider-backed signup/login/verification/recovery/logout E2E passes.
- [ ] Profile own-user RLS and cross-user denial are verified against real Supabase.
- [ ] Milestone-wide provider-backed security/accessibility closeout complete.
- [ ] Exact-final-head CI green with durable closeout current.

## Exact Next Capability
M01.7 — execute provider-backed/authenticated E2E and the outstanding M01.6 two-user RLS isolation gate when a configured Supabase test environment is available. Until then, preserve the verified provider-independent browser evidence and do not claim provider-backed verification.

## Next Milestone
M02 — Organizations + RBAC. Do not start until M01 is objectively complete and integrated/authorized according to repository policy.
