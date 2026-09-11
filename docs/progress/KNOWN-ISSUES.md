# Known Issues

Only unresolved or materially relevant issues belong here.

## Resolved foundation and M01 issues

Product Foundation requirements durability, dependency reproducibility, requirements-source integrity, and autonomous-framework issues are resolved and integrated on `main` at `64ebeb4f7b2a39fc0557685ef34035650211aad9` with CI #57 green.

M01 resolved issues include Testing Library DOM leakage, overly broad human-decision selectors, environment-contract/test-fixture defects, backslash redirect escape, bounded provider-error verification gaps, durable Supabase token-hash setup documentation, confirmation-route request-origin trust, milestone-ledger reconciliation, forged-profile-owner test coverage, ambiguous Playwright locators, the Vitest/Vite ESM-in-CommonJS configuration-loader warning, missing provider-backed auth evidence, and missing real profile RLS-isolation evidence.

### KI-020 — Provider-backed profile RLS isolation evidence unavailable

Status: RESOLVED. CI `34582926587` / #148 on `7348526cb466a66b907e4c92148b7c6d68daf674` started the real Supabase local stack, reset the database, applied `20260910_create_profiles.sql`, created two independently authenticated users through the product/provider flow, and proved User A/User B mutual cross-profile SELECT/UPDATE denial while preserving each user's own row. Evidence: `docs/superpowers/evidence/2026-09-11-m01-provider-backed-closeout.md`.

### KI-022 — Provider-backed M01 auth E2E evidence unavailable

Status: RESOLVED. CI #148 ran Supabase Auth/PostgREST/Mailpit plus the production Next.js app and passed signup, email confirmation/token exchange, login, logout, forgot/reset password, authenticated `/app`, authenticated `/app/profile`, profile persistence, authenticated narrow-mobile/keyboard evidence, and consumed-confirmation-link safety. Playwright result: 8/8 passed.

### KI-021 — Accessibility browser test used an ambiguous login locator

Status: RESOLVED. Initial M01.7 browser verification `caa82b59ebd85e20b4c02702c85587b6ce7b68cd` failed CI #133 because an unscoped `Log in` locator matched both header and footer login links under Playwright strict mode. `061762ec28a9f95ed97c433f35df8eee060389fe` scoped the intended link through the `banner` landmark; CI #134 passed all gates.

### KI-023 — Vitest configuration loaded as CommonJS while using ESM syntax

Status: RESOLVED. Exact CI #140 reproduced the warning at `vitest.config.ts:1:1`. Root cause was the `.ts` config being interpreted as CommonJS while containing ESM imports. `85ff10741875892e2787631b106cfc48bfad0d5c` renamed the config to `vitest.config.mts` and used `fileURLToPath(new URL("./src", import.meta.url))`; CI #141 passed and the warning disappeared.

## Current unresolved issues

No Critical or Important M01 issue is currently unresolved.

Supabase logout uses the SDK default session scope. Classification: **Minor / product-semantics decision**; do not alter multi-device logout behavior without an explicit product requirement.

GitHub-hosted CI emits deprecation notices from third-party action runtimes being forced from Node 20 to Node 24, plus transitive runtime deprecation notices. Classification: **Informational/external maintenance**, not an application correctness blocker.

M01 completion is now gated on final durable reconciliation, fresh exact-head CI for that reconciliation, and final PR merge/post-merge-main verification rather than missing provider evidence.