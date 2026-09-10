# Known Issues

Only unresolved or materially relevant issues belong here.

## Resolved foundation and M01 issues

Product Foundation requirements durability, dependency reproducibility, requirements-source integrity, and autonomous-framework issues are resolved and integrated on `main` at `64ebeb4f7b2a39fc0557685ef34035650211aad9` with CI #57 green.

M01 resolved issues include Testing Library DOM leakage, overly broad human-decision selectors, environment-contract/test-fixture defects, backslash redirect escape, bounded provider-error verification gaps, durable Supabase token-hash setup documentation, confirmation-route request-origin trust, milestone-ledger reconciliation, the M01.6 forged-profile-owner test gap, the M01.7 ambiguous Playwright login locator, and the Vitest/Vite ESM-in-CommonJS configuration-loader warning.

### KI-021 — Accessibility browser test used an ambiguous login locator

Status: RESOLVED. Initial M01.7 browser verification `caa82b59ebd85e20b4c02702c85587b6ce7b68cd` failed CI #133 because `getByRole("link", { name: /log in/i })` matched both header and footer login links under Playwright strict mode. `061762ec28a9f95ed97c433f35df8eee060389fe` scoped the intended link through the `banner` landmark; CI #134 passed all gates.

### KI-023 — Vitest configuration loaded as CommonJS while using ESM syntax

Status: RESOLVED. Exact CI #140 reproduced the warning at `vitest.config.ts:1:1`. Root cause was the `.ts` config being interpreted as CommonJS while containing ESM imports. `85ff10741875892e2787631b106cfc48bfad0d5c` renamed the config to `vitest.config.mts` and used `fileURLToPath(new URL("./src", import.meta.url))` for the alias so the file has explicit ESM semantics without changing package-wide module behavior. Exact-head CI `34528888577` / #141 passed frozen install, lint, typecheck, 54 tests, framework/source verifiers, build, seven Chromium E2E tests, and PRD coverage; the prior config-loader warning is absent from the new Vitest log.

## Current unresolved issues

### KI-020 — Provider-backed profile RLS isolation evidence unavailable

Status: BLOCKED ON EXTERNAL TEST CONFIGURATION. The profile schema, own-user repository/action, and RLS policies are implemented, but M01.6 may not be called VERIFIED until the migration runs against a configured Supabase test project and two real authenticated users prove User A cannot select/update User B and vice versa.

2026-09-11 recovery evidence: safe discovery through the connected Supabase account found only two existing projects, both clearly unrelated to Hire Evidence by their public schemas. Neither was modified. Creating a new project/development branch is cost-bearing and requires explicit organization/cost confirmation. Required unblock action: identify or configure a dedicated safe Hire Evidence Supabase test environment and test identities; never commit service-role secrets.

### KI-022 — Provider-backed M01 auth E2E evidence unavailable

Status: BLOCKED ON EXTERNAL TEST CONFIGURATION. Provider-independent browser coverage proves mobile layout/no horizontal overflow, keyboard focus navigation to authentication, labeled login/signup controls, and unauthenticated protected-route behavior. Full signup/email verification/login/logout/recovery/authenticated app/profile E2E still requires the dedicated configured Supabase test environment and real test identities. Placeholder CI credentials, unrelated projects, and mocks are not valid provider evidence.

Supabase logout currently uses the SDK default session scope. Classification: **Minor / product-semantics decision**; do not alter multi-device logout behavior without an explicit product requirement.

GitHub-hosted CI currently emits deprecation notices from third-party action runtimes being forced from Node 20 to Node 24, plus a `punycode` dependency notice. Classification: **Informational/external maintenance**, not an application correctness blocker.

M01 remains incomplete until KI-020 and KI-022 are resolved and final provider-backed closeout evidence is recorded.
