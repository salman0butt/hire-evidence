# Known Issues

Only unresolved or materially relevant issues belong here.

## Resolved foundation and M01 issues

Product Foundation requirements durability, dependency reproducibility, requirements-source integrity, and autonomous-framework issues are resolved and integrated on `main` at `64ebeb4f7b2a39fc0557685ef34035650211aad9` with CI #57 green.

M01 resolved issues include Testing Library DOM leakage, overly broad human-decision selectors, environment-contract/test-fixture defects, backslash redirect escape, bounded provider-error verification gaps, durable Supabase token-hash setup documentation, confirmation-route request-origin trust, milestone-ledger reconciliation, and the M01.6 forged-profile-owner test gap.

### KI-019 — Profile owner boundary lacked explicit action-level regression coverage

Status: RESOLVED. Skeptical review found that the server action correctly derived row ownership from `requireUser()`, but no test proved forged `id` / `user_id` form fields were ignored. `e9c2ad64f2f9065d53a44652ac1116f91538e7f7` added the ownership-boundary test plus structural RLS migration tests; CI #130 passed.

## Current unresolved issues

### KI-020 — Provider-backed profile RLS isolation evidence unavailable

Status: BLOCKED ON EXTERNAL TEST CONFIGURATION. The profile schema, own-user repository/action, and RLS policies are implemented, but M01.6 may not be called VERIFIED until the migration runs against a configured Supabase test project and two real authenticated users prove User A cannot select/update User B. Required human/environment action: provide/configure a safe Supabase test environment with the documented public application variables and test identities; never commit service-role secrets.

A non-blocking Vitest/Vite warning remains: `vitest.config.ts` is loaded as CommonJS while using ESM syntax. Classification: **Minor**; defer to focused configuration maintenance.

Supabase logout currently uses the SDK default session scope. Classification: **Minor / product-semantics decision**; do not alter multi-device logout behavior without an explicit product requirement.

M01 remains incomplete. Provider-backed auth/recovery/profile E2E, cross-user isolation evidence, and final accessibility/security closeout remain planned work.