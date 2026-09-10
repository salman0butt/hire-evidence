# Known Issues

Only unresolved or materially relevant issues belong here.

## Resolved foundation issues

The Product Foundation requirements-durability, dependency-lockfile, requirements-source-integrity, recovery-marker, and unified-verification issues were resolved before PR #2 integration. PR #2 was merged as `64ebeb4f7b2a39fc0557685ef34035650211aad9`; post-merge CI run `34486610200` / run #57 passed on that exact `main` SHA.

## Resolved during M01.1

### KI-007 — Component test DOM leaked between tests

- **Previous severity:** Important / active-CI blocker
- **Status:** RESOLVED
- **Root cause:** Vitest globals are disabled, so Testing Library's automatic cleanup hook was not registered by the test environment. A first `render()` remained in `document.body` for the next test, duplicating named regions.
- **Evidence / fix:** CI run `34488549294` / run #62 failed on `f8bf5c915acc7ba2dc7630adef516b4e43182cee`. Commit `97513c5357aa82b1bbf8c6ea093c61962e9407ab` registered explicit `afterEach(cleanup)` in `test/setup.ts`.

### KI-008 — Human-decision assertion assumed globally unique copy

- **Previous severity:** Important / active-CI blocker
- **Status:** RESOLVED
- **Root cause:** after DOM isolation was restored, the page legitimately contained two human-decision safety statements while `getByText()` required a single global match.
- **Evidence / fix:** CI run `34491773023` / run #63 exposed the selector defect. Commit `6107253fdde1639097a6e6a6d8fd3777f242e5a4` scoped the assertion to the named Security & fairness region. CI run `34492022676` / run #64 passed all required gates.

## Current unresolved issues

No Critical or Important implementation/review issue is currently known.

A non-blocking Vitest/Vite warning remains: `vitest.config.ts` is loaded as CommonJS while using ESM syntax. It is classified **Minor** because the exact reviewed code head passes tests/build/E2E; address it in focused module/config maintenance instead of broadening the current capability.

M01 is intentionally incomplete. Provider-backed authentication E2E, profile RLS/cross-user isolation evidence, and the remaining M01 capability slices are required before milestone completion; these are planned work, not defects in M01.1.

The durable reconciliation head created after reviewed code head `6107253fdde1639097a6e6a6d8fd3777f242e5a4` requires its own exact-head CI before a fresh worker may treat the latest branch head as green.
