# M01 Provider-Independent Accessibility / Browser Closeout Evidence — 2026-09-10

## Scope

Advance M01.7 only where objective evidence is possible without real Supabase provider credentials. This slice verifies responsive public/auth entry, keyboard focus navigation, accessible credential labels, and unauthenticated protected-route behavior. It does not simulate signup/email verification/login/logout/recovery/authenticated profile behavior or RLS isolation.

## Recovery

Recovered `main` at `64ebeb4f7b2a39fc0557685ef34035650211aad9`, active draft PR #3 on `feat/saas-shell-auth`, and exact recovered head `908f3919e8e94cd74adcca30fc1114297cdb91b8` with CI #132 SUCCESS. PR #3 had no submitted reviews or unresolved review threads. PR #2 was already merged before this run.

## Verification Change

Added `e2e/accessibility.spec.ts` with provider-independent browser scenarios:

- 390×844 marketing page renders without horizontal overflow and exposes the header login path;
- keyboard Tab navigation reaches the home link and then the header login link;
- login and signup pages expose labeled email/password controls and a submit button;
- 390×844 unauthenticated `/app` redirects to `/auth/login?next=/app` without horizontal overflow.

## Systematic Debugging Evidence

Initial test commit: `caa82b59ebd85e20b4c02702c85587b6ce7b68cd`.

GitHub Actions `34516443855` / #133 passed frozen install, lint, typecheck, all 54 unit/component tests, framework/source verifier tests, both repository verifiers, build, and Chromium installation, then failed E2E with 5 browser tests passing and 2 failing.

Exact logs showed Playwright strict-mode violations because an unscoped `Log in` locator matched two legitimate links: one in the `banner` and one in `contentinfo`. No product defect was established.

Minimum root-cause fix: `061762ec28a9f95ed97c433f35df8eee060389fe` scopes the intended login assertion to `page.getByRole("banner")`. It does not use `.first()`, remove an assertion, alter production markup, or weaken accessibility expectations.

## GREEN Evidence

GitHub Actions `34516697315` / #134 on exact code/test head `061762ec28a9f95ed97c433f35df8eee060389fe`: SUCCESS.

Passed:

- frozen dependency install;
- lint;
- typecheck;
- 17 Vitest files / 54 tests;
- autonomous-framework verifier tests;
- requirements-source verifier tests;
- autonomous-framework verification;
- requirements-source integrity verification;
- production build;
- Chromium installation;
- all 7 Playwright E2E tests, including all 4 new provider-independent accessibility/browser checks;
- PRD sections 1–242 coverage verification.

## Skeptical Review

PRD compliance: the slice directly increases evidence for M01 responsive design/accessibility and protected entry without expanding scope.

Correctness: locators are semantically scoped to landmarks; overflow is checked against document scroll/client width; auth labels use accessible-name queries; the protected path assertion preserves the internal return path.

Architecture/YAGNI: test-only change, no runtime dependency or production abstraction.

Testing quality: provider-dependent success paths remain intentionally absent rather than mocked. CI #133 is retained as genuine failure/debug evidence.

Security: no tokens, secrets, service-role credentials, session forgery, or authorization bypass are introduced. Placeholder CI values are not treated as provider evidence.

Hiring-AI safety: no AI assessment or hiring-decision behavior changed. Humans remain the decision makers; prohibited sensitive/proxy scoring remains absent.

Findings:
- Critical: 0 unresolved.
- Important: 0 unresolved.
- Minor: provider-independent browser checks cannot prove provider-backed session/RLS behavior; tracked as an external evidence blocker rather than review debt.

## Remaining Evidence Gates

- run the profile migration against a configured safe Supabase test project;
- prove mutual User A/User B select/update denial through normal authenticated clients;
- execute real signup/email verification/login/logout/password recovery;
- prove authenticated `/app` and `/app/profile` entry/update;
- complete provider-backed keyboard/mobile/authenticated closeout;
- reconcile final milestone evidence and exact-final-head CI.

No provider-backed result may be fabricated from mocks, placeholder CI credentials, or static SQL inspection.
