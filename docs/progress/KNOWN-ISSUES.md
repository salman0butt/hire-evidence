# Known Issues

Only unresolved or materially relevant issues belong here.

## Resolved foundation issues

Product Foundation requirements durability, dependency-lockfile, requirements-source-integrity, recovery-marker, and unified-verification issues were resolved before PR #2 integration. PR #2 merged as `64ebeb4f7b2a39fc0557685ef34035650211aad9`; post-merge CI `34486610200` / #57 passed.

## Resolved during M01.1

### KI-007 — Component test DOM leaked between tests

- **Previous severity:** Important / active-CI blocker
- **Status:** RESOLVED
- **Root cause:** Vitest globals were disabled, so Testing Library automatic cleanup was not registered.
- **Evidence / fix:** CI `34488549294` / #62 failed on `f8bf5c9…`; `97513c5357aa82b1bbf8c6ea093c61962e9407ab` registered explicit cleanup.

### KI-008 — Human-decision assertion assumed globally unique copy

- **Previous severity:** Important / active-CI blocker
- **Status:** RESOLVED
- **Root cause:** two legitimate safety statements existed while the test required a single global text match.
- **Evidence / fix:** CI `34491773023` / #63 exposed it; `6107253fdde1639097a6e6a6d8fd3777f242e5a4` scoped the assertion semantically; CI #64 passed.

## Resolved during M01.2

### KI-009 — Missing Supabase environment contract

- **Previous severity:** Expected TDD RED / capability blocker
- **Status:** RESOLVED
- **Evidence:** `883853a231650487d9c5fda8bf8029550194ed36` introduced tests first; CI `34498258324` / #67 failed because production configuration had no Supabase fields. The implementation added required URL/key validation and request-scoped configuration use.

### KI-010 — Optional-property test encoded missing as explicit undefined

- **Previous severity:** Important / CI blocker in test construction
- **Status:** RESOLVED
- **Root cause:** `exactOptionalPropertyTypes` correctly rejected an explicitly assigned `undefined` where the test intended an omitted key.
- **Evidence / fix:** CI `34498441763` / #70; fixed in `c7d5d2160cd3c3d1ea8d956bc574fbfcb1d0ccda` without weakening runtime validation.

### KI-011 — Provider-independent CI lacked public Supabase configuration

- **Previous severity:** Important / integration gap
- **Status:** RESOLVED
- **Root cause:** the request proxy validates Supabase configuration, while build/smoke CI previously supplied only the application URL.
- **Fix:** CI now supplies explicit non-secret placeholder public credentials for provider-independent build/smoke execution. These values are not provider-backed auth evidence.

### KI-012 — Backslash network-path redirect escape

- **Previous severity:** Important / security
- **Status:** RESOLVED
- **Root cause:** the first redirect guard rejected `//host` and absolute URLs but accepted `/\\host`, which URL consumers can normalize into a network-path-style destination.
- **RED evidence:** `ea8f6d628935bb942f0fd26b824c603bd1380e4f`; CI `34499549698` / #82 failed exactly on the new regression test while 15 other tests passed.
- **GREEN evidence:** `c1a11206916684546c8b8dcdd89f4a3908fe359e` rejects backslashes; CI `34499829397` / #83 passed every repository gate.

## Current unresolved issues

No Critical or Important implementation/review issue is known after M01.2 re-review.

A non-blocking Vitest/Vite warning remains: `vitest.config.ts` is loaded as CommonJS while using ESM syntax. Classification: **Minor**; defer to focused configuration maintenance.

M01 remains intentionally incomplete. Core auth/recovery, authenticated shell, profile/RLS, provider-backed authentication E2E, cross-user isolation evidence, and final accessibility/security closeout remain planned work.

The documentation reconciliation commits after reviewed code head `c1a11206916684546c8b8dcdd89f4a3908fe359e` require fresh exact-head CI before the latest branch head may be treated as green.
