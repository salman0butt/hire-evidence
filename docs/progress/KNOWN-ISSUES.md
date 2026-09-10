# Known Issues

Only unresolved or materially relevant issues belong here.

## Resolved foundation issues

Product Foundation requirements durability, dependency-lockfile, requirements-source-integrity, recovery-marker, and unified-verification issues were resolved before PR #2 integration. PR #2 merged as `64ebeb4f7b2a39fc0557685ef34035650211aad9`; post-merge CI `34486610200` / #57 passed.

## Resolved during M01.1

### KI-007 — Component test DOM leaked between tests

- **Previous severity:** Important / active-CI blocker
- **Status:** RESOLVED
- **Root cause:** Vitest globals were disabled, so Testing Library automatic cleanup was not registered.
- **Evidence / fix:** CI #62 failed; `97513c5357aa82b1bbf8c6ea093c61962e9407ab` registered explicit cleanup.

### KI-008 — Human-decision assertion assumed globally unique copy

- **Previous severity:** Important / active-CI blocker
- **Status:** RESOLVED
- **Evidence / fix:** CI #63 exposed it; `6107253fdde1639097a6e6a6d8fd3777f242e5a4` scoped the assertion semantically; CI #64 passed.

## Resolved during M01.2

### KI-009 — Missing Supabase environment contract

- **Previous severity:** Expected TDD RED / capability blocker
- **Status:** RESOLVED
- **Evidence:** `883853a231650487d9c5fda8bf8029550194ed36` introduced tests first; CI #67 failed before production configuration gained the required Supabase fields.

### KI-010 — Optional-property test encoded missing as explicit undefined

- **Previous severity:** Important / CI blocker in test construction
- **Status:** RESOLVED
- **Evidence / fix:** CI #70; fixed in `c7d5d2160cd3c3d1ea8d956bc574fbfcb1d0ccda` without weakening runtime validation.

### KI-011 — Provider-independent CI lacked public Supabase configuration

- **Previous severity:** Important / integration gap
- **Status:** RESOLVED
- **Fix:** CI supplies explicit non-secret placeholder public credentials for provider-independent build/smoke execution. These are not provider-backed evidence.

### KI-012 — Backslash network-path redirect escape

- **Previous severity:** Important / security
- **Status:** RESOLVED
- **RED:** `ea8f6d628935bb942f0fd26b824c603bd1380e4f`, CI #82.
- **GREEN:** `c1a11206916684546c8b8dcdd89f4a3908fe359e`, CI #83.

## Resolved during M01.3

### KI-013 — Login page explicitly supplied undefined optional redirect

- **Previous severity:** Important / CI blocker
- **Status:** RESOLVED
- **Root cause:** `nextPath={undefined}` violated the repository's `exactOptionalPropertyTypes` contract.
- **Evidence / fix:** CI `34501650238` / #99 failed at typecheck; `edf7e93f95b0646587041306670cb1c198540e13` omits the optional prop when absent; CI #100 passed.

### KI-014 — Server-action provider errors lacked focused verification

- **Previous severity:** Important / review finding
- **Status:** RESOLVED
- **Fix:** `src/app/(auth)/auth/actions.test.ts` verifies invalid-input short-circuiting and stable user-safe login/signup provider errors.
- **Evidence:** final reviewed code/setup head `32326d4715b1c60c485b40308df0c5f022c01bbb`, CI `34502240299` / #103 PASS.

### KI-015 — Signup-action review test omitted required runtime environment

- **Previous severity:** Important / CI blocker in test construction
- **Status:** RESOLVED
- **Root cause:** the test exercised `getAppOrigin()` without supplying the environment that production correctly requires.
- **Evidence / fix:** CI `34502118781` / #102 failed one test while 24 passed; `32326d4715b1c60c485b40308df0c5f022c01bbb` added explicit non-secret test environment values; CI #103 passed all gates.

### KI-016 — Supabase SSR token-hash email-template prerequisite was not durable

- **Previous severity:** Important / deployment-documentation gap
- **Status:** RESOLVED in repository documentation
- **Fix:** `docs/SUPABASE-AUTH-SETUP.md` records Site URL/redirect configuration and the confirmation template required to send `token_hash` to `/auth/confirm`.
- **Remaining evidence:** provider-backed confirmation is still intentionally required before final M01 completion.

## Current unresolved issues

No Critical or Important implementation/review issue is known after M01.3 re-review.

A non-blocking Vitest/Vite warning remains: `vitest.config.ts` is loaded as CommonJS while using ESM syntax. Classification: **Minor**; defer to focused configuration maintenance.

Supabase logout currently uses the SDK default session scope. Classification: **Minor / product-semantics decision**; do not alter multi-device logout behavior without an explicit product requirement.

M01 remains intentionally incomplete. Password recovery, authenticated shell, profile/RLS, provider-backed authentication E2E, cross-user isolation evidence, and final accessibility/security closeout remain planned work.

Durable reconciliation commits after reviewed code/setup head `32326d4715b1c60c485b40308df0c5f022c01bbb` require fresh exact-head CI before the latest branch head may be treated as green.
