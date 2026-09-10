# Known Issues

Only unresolved or materially relevant issues belong here.

## Resolved foundation issues

Product Foundation requirements durability, dependency-lockfile, requirements-source-integrity, recovery-marker, and unified-verification issues were resolved before PR #2 integration. PR #2 merged as `64ebeb4f7b2a39fc0557685ef34035650211aad9`; post-merge CI `34486610200` / #57 passed.

## Resolved during M01.1–M01.3

- KI-007 — component-test DOM leakage: RESOLVED by explicit Testing Library cleanup; CI #64 green.
- KI-008 — human-decision assertion global uniqueness assumption: RESOLVED by semantic scoping; CI #64 green.
- KI-009 — missing Supabase environment contract: RESOLVED through test-first environment validation.
- KI-010 — optional-property test encoded absence as explicit undefined: RESOLVED without weakening runtime validation.
- KI-011 — provider-independent CI lacked public Supabase configuration: RESOLVED with explicit non-secret placeholders.
- KI-012 — backslash network-path redirect escape: RESOLVED; RED `ea8f6d6…`, GREEN `c1a1120…`, CI #83.
- KI-013 — login page supplied explicit undefined optional redirect: RESOLVED at call site; CI #100.
- KI-014 — server-action provider errors lacked focused verification: RESOLVED with action tests; CI #103.
- KI-015 — signup-action review test omitted required runtime environment: RESOLVED with explicit test fixture; CI #103.
- KI-016 — Supabase SSR token-hash email-template prerequisite was not durable: RESOLVED in `docs/SUPABASE-AUTH-SETUP.md`; provider-backed evidence remains a final M01 gate.

## Resolved during M01.4

### KI-017 — Confirmation redirects trusted request origin

- **Previous severity:** Important / auth redirect security.
- **Status:** RESOLVED.
- **Root cause:** `src/app/(auth)/auth/confirm/route.ts` used `requestUrl.origin` for post-verification success/error redirects. A manipulated request host/origin could therefore choose the redirect origin despite the design requiring `NEXT_PUBLIC_APP_URL` as the canonical application origin.
- **RED:** `ee8fd9b4706c47530d3268542ee5495d8ea3796c`; CI `34507199272` / #120 failed at unit/component tests on the new configured-origin assertions.
- **GREEN:** `b048782e0644213727f16fdf376d87f6bebb1d1e` derives redirects from validated application environment; CI `34507320033` / #121 passed every gate.

## Current unresolved issues

No Critical or Important implementation/review issue is known after M01.4 re-review.

A non-blocking Vitest/Vite warning remains: `vitest.config.ts` is loaded as CommonJS while using ESM syntax. Classification: **Minor**; defer to focused configuration maintenance.

Supabase logout currently uses the SDK default session scope. Classification: **Minor / product-semantics decision**; do not alter multi-device logout behavior without an explicit product requirement.

M01 remains intentionally incomplete. Protected application shell, profile/RLS, provider-backed authentication/recovery E2E, cross-user isolation evidence, and final accessibility/security closeout remain planned work.
