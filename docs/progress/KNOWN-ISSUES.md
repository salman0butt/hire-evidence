# Known Issues

Only unresolved or materially relevant issues belong here.

## Resolved foundation and M01 issues

Product Foundation requirements durability, dependency reproducibility, requirements-source integrity, and autonomous-framework issues are resolved and integrated on `main` at `64ebeb4f7b2a39fc0557685ef34035650211aad9` with CI #57 green.

M01 resolved issues include Testing Library DOM leakage, overly broad human-decision selectors, environment-contract/test-fixture defects, backslash redirect escape, bounded provider-error verification gaps, durable Supabase token-hash setup documentation, and the M01.4 confirmation-route request-origin trust issue.

### KI-017 — Confirmation redirects trusted request origin

Status: RESOLVED. RED `ee8fd9b4706c47530d3268542ee5495d8ea3796c`, CI #120; GREEN `b048782e0644213727f16fdf376d87f6bebb1d1e`, CI #121. Redirects now derive from validated `NEXT_PUBLIC_APP_URL`.

### KI-018 — M01.4 reconciliation omitted required milestone-ledger headings

Status: RESOLVED. Documentation head `6c001265bd71076bd67eaca34a9a23f208d46a6a` failed the autonomous-framework verifier in CI #122 while install/lint/typecheck/tests passed. Root cause was a documentation-contract regression, not verifier behavior. Required headings were restored without weakening verification in `6833d47340c1210235ac501c93a95a178fdfe3cd`; CI #123 passed all gates.

## Current unresolved issues

No Critical or Important implementation/review issue is known after M01.5 re-review.

The profile link in the authenticated navigation targets `/app/profile`, whose behavior belongs to exact-next M01.6. Classification: **Minor / expected staged implementation**; M01.5 must not imply profile persistence is already available.

A non-blocking Vitest/Vite warning remains: `vitest.config.ts` is loaded as CommonJS while using ESM syntax. Classification: **Minor**; defer to focused configuration maintenance.

Supabase logout currently uses the SDK default session scope. Classification: **Minor / product-semantics decision**; do not alter multi-device logout behavior without an explicit product requirement.

M01 remains incomplete. Profile/RLS, provider-backed auth/recovery E2E, cross-user isolation evidence, and final accessibility/security closeout remain planned work.
