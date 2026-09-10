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
7. **IN PROGRESS** — M01.7 accessibility + provider-backed E2E/security/review closeout. Provider-independent browser slice is verified at `061762ec28a9f95ed97c433f35df8eee060389fe`, CI #134. Focused test-runner configuration maintenance is verified at `85ff10741875892e2787631b106cfc48bfad0d5c`, CI #141. Provider-backed scenarios remain blocked on dedicated Supabase test configuration.

## TDD Evidence
M01.6 RED `8656902db4774ab91075e7dbadeb29464577917f`; GitHub Actions #128 failed at typecheck for intentionally absent production modules. Reviewed profile implementation `e9c2ad64f2f9065d53a44652ac1116f91538e7f7` passed CI #130.

M01.7 browser verification initially produced genuine CI #133 RED because an unscoped `Log in` locator matched both header and footer links. Systematic debugging established a test-selector defect rather than product behavior. `061762ec28a9f95ed97c433f35df8eee060389fe` scoped the assertion to the `banner` landmark; CI #134 passed.

The Vitest config warning was a configuration-only maintenance issue, so artificial behavioral RED was not created. Exact CI #140 provided reproducible failure evidence: Vite reported ESM syntax in `vitest.config.ts` loaded as CommonJS. The minimal fix moved the config to explicit ESM `vitest.config.mts` and replaced `__dirname` with an `import.meta.url`-based path. CI #141 passed the complete suite and no longer emitted that loader warning.

## Integration Test Evidence
Profile action tests prove invalid input is rejected before authentication/persistence, row ownership comes only from server-validated `requireUser()`, forged `id` and `user_id` form fields are ignored, trimmed display names are persisted, and repository failures map to bounded user-safe errors. Structural migration tests verify RLS enablement, own-user select/insert/update policies, update `USING` plus `WITH CHECK`, auth-user ownership FK, and the 120-character database constraint. Real database execution remains mandatory.

## E2E / Visual Verification
CI #134 passes seven Chromium E2E tests. Provider-independent coverage verifies the marketing path, unauthenticated protected-route redirect, health endpoint, a 390×844 mobile homepage without horizontal overflow, keyboard focus navigation from the home link to the header login link, labeled email/password controls on login/signup, and mobile unauthenticated `/app` return-path behavior without horizontal overflow. CI #141 re-ran all seven successfully after configuration maintenance.

This evidence does not simulate or replace provider-backed signup/email verification/login/logout/recovery/authenticated app/profile or cross-user RLS verification. Those remain mandatory before M01 completion.

## Security Review
Existing auth/profile boundaries remain unchanged by the provider-independent browser/configuration/documentation slices. Profile ownership is not caller-selectable; RLS remains mandatory; tokens and secrets are not added to browser tests; placeholder CI Supabase values are not treated as provider evidence. No service-role browser path is introduced.

Connected-account discovery on 2026-09-11 found two existing Supabase projects; read-only schema inspection established both as unrelated to Hire Evidence. Neither was modified. Creating a new Supabase project/development branch is cost-bearing and requires explicit organization/cost confirmation, so no provider infrastructure was fabricated or silently created.

## Accessibility Review
Provider-independent browser verification proves narrow-mobile no-horizontal-overflow on the public and unauthenticated auth-entry path, keyboard focus reaches the semantically scoped header login link, and login/signup credential inputs have accessible labels. Existing visible `:focus-visible` styling and reduced-motion rules remain in place. Provider-backed keyboard/mobile verification of authenticated/profile flows remains outstanding.

## Performance Review
The configuration maintenance changes no application runtime dependency, route behavior, client state, network call, polling, or production JavaScript. Existing profile rendering remains one authenticated identity verification plus one own-row query; save remains one upsert. Vitest still reports an informational test-environment performance suggestion; no isolation change is justified without evidence because shared jsdom state previously caused leakage.

## AI / Eval Review
No assessment AI is introduced in M01. Humans remain hiring decision makers; prohibited sensitive/proxy scoring remains out of scope.

## Code Review Findings
- Critical: 0 unresolved.
- Important: 0 unresolved.
- Resolved test defect: CI #133 exposed ambiguous Playwright login locators; fixed by semantic banner scoping in `061762ec…`, with CI #134 green.
- Resolved maintenance finding: Vite ESM-in-CommonJS configuration-loader warning; root cause fixed by explicit `.mts` config in `85ff107…`, with CI #141 green and warning absent.
- Minor: logout default scope remains unchanged absent an explicit product-semantics requirement.
- Informational: GitHub-hosted third-party action/runtime deprecation notices remain external maintenance and do not affect application verification.

## Fixes / Re-review
The focused configuration diff was reviewed for correctness, portability, YAGNI, test integrity, security, and interaction with the active M01 boundary. Using `.mts` scopes ESM semantics to the Vitest config rather than changing all package semantics, and `fileURLToPath(new URL("./src", import.meta.url))` is portable path resolution. The complete required CI suite passed. No unresolved Critical or Important finding was identified. Provider-backed gates remain explicitly open rather than falsely closed with mocks or unrelated infrastructure.

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
Configuration head `85ff10741875892e2787631b106cfc48bfad0d5c` passed GitHub Actions `34528888577` / CI #141 across frozen install, lint, typecheck, 54 unit/component tests, framework/source verifier tests, both repository verifiers, production build, all seven Chromium E2E tests, and PRD coverage. The prior Vite ESM-in-CommonJS config-loader warning does not appear in the test output. Any documentation reconciliation commit after that head requires fresh exact-SHA CI before being called green.

## Known Limitations
M01 is not complete. The profile migration has not yet been executed against a dedicated configured Supabase test project, so User A/User B RLS denial is not proven. Provider-backed signup/email verification/login/logout/recovery/authenticated `/app` and `/app/profile` E2E also remain unfinished. Browser accessibility coverage is intentionally provider-independent and does not replace those gates.

## Documentation Updated
Status, known issues, current milestone, this active milestone ledger, feature matrix, requirements traceability, milestone program, PR #3, provider-blocker evidence, and Vitest configuration-maintenance evidence are reconciled with the latest verified implementation/configuration state.

## Durable Recovery Sources
`AGENTS.md` → `docs/AUTONOMOUS-DEVELOPMENT.md` → actual Git/PR/CI → `docs/progress/STATUS.md` → `docs/progress/KNOWN-ISSUES.md` → `docs/milestones/CURRENT.md` → this ledger → PRD/traceability → M01 Superpowers spec/plan/evidence → source/tests.

## Completion Checklist
- [ ] All M01 requirements and iterations accounted for.
- [x] Server-authoritative `/app` shell implemented provider-independently.
- [x] Unauthenticated `/app` browser redirect verified.
- [x] Basic profile schema, settings flow and own-user authorization boundary implemented.
- [x] Provider-independent mobile overflow, keyboard auth focus, and auth-control labels verified in Chromium.
- [x] Test runner config uses explicit ESM semantics without the prior loader warning.
- [ ] Provider-backed authenticated user can enter `/app`.
- [ ] Provider-backed signup/login/verification/recovery/logout E2E passes.
- [ ] Profile own-user RLS and cross-user denial are verified against real Supabase.
- [ ] Milestone-wide provider-backed security/accessibility closeout complete.
- [ ] Exact-final-head CI green with durable closeout current.

## Exact Next Capability
M01.7 — identify or configure a dedicated safe Supabase test environment, then execute provider-backed/authenticated E2E and the outstanding M01.6 two-user RLS isolation gate. Until then, preserve provider-independent evidence and do not claim provider-backed verification.

## Next Milestone
M02 — Organizations + RBAC. Do not start until M01 is objectively complete and integrated/authorized according to repository policy.
