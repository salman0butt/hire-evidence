# Known Issues

Only unresolved or materially relevant issues belong here.

## Resolved foundation and M01 issues

Product Foundation requirements durability, dependency reproducibility, requirements-source integrity, and autonomous-framework issues are resolved and integrated on `main` at `64ebeb4f7b2a39fc0557685ef34035650211aad9` with CI #57 green.

M01 resolved issues include Testing Library DOM leakage, overly broad human-decision selectors, environment-contract/test-fixture defects, backslash redirect escape, bounded provider-error verification gaps, durable Supabase token-hash setup documentation, confirmation-route request-origin trust, milestone-ledger reconciliation, the M01.6 forged-profile-owner test gap, and the M01.7 ambiguous Playwright login locator.

### KI-021 — Accessibility browser test used an ambiguous login locator

Status: RESOLVED. Initial M01.7 browser verification `caa82b59ebd85e20b4c02702c85587b6ce7b68cd` failed CI #133 because `getByRole("link", { name: /log in/i })` matched both the header and footer login links under Playwright strict mode. This was a test-scoping defect, not a product failure. `061762ec28a9f95ed97c433f35df8eee060389fe` scoped the intended link through the `banner` landmark; CI #134 passed all gates including all seven browser tests.

## Current unresolved issues

### KI-020 — Provider-backed profile RLS isolation evidence unavailable

Status: BLOCKED ON EXTERNAL TEST CONFIGURATION. The profile schema, own-user repository/action, and RLS policies are implemented, but M01.6 may not be called VERIFIED until the migration runs against a configured Supabase test project and two real authenticated users prove User A cannot select/update User B and vice versa. Required environment action: configure a safe Supabase test environment with the documented public application variables and test identities; never commit service-role secrets.

### KI-022 — Provider-backed M01 auth E2E evidence unavailable

Status: BLOCKED ON EXTERNAL TEST CONFIGURATION. Provider-independent browser coverage now proves mobile layout/no horizontal overflow, keyboard focus navigation to authentication, labeled login/signup controls, and unauthenticated protected-route behavior. Full signup/email verification/login/logout/recovery/authenticated app/profile E2E still requires a configured Supabase test project and real test identities. Placeholder CI credentials are not valid provider evidence.

A non-blocking Vitest/Vite warning remains: `vitest.config.ts` is loaded as CommonJS while using ESM syntax. Classification: **Minor**; defer to focused configuration maintenance.

Supabase logout currently uses the SDK default session scope. Classification: **Minor / product-semantics decision**; do not alter multi-device logout behavior without an explicit product requirement.

M01 remains incomplete until KI-020 and KI-022 are resolved and final provider-backed closeout evidence is recorded.
