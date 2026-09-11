# Vitest ESM Configuration Maintenance — 2026-09-11

## Scope

Resolve the provider-independent Vitest/Vite configuration-loader warning without changing application behavior, weakening tests, or changing package-wide module semantics.

## Recovery and root cause

Recovered active branch `feat/saas-shell-auth`, draft PR #3, and exact pre-change head `39b61db390a391c72b5cdda2be71eb5898351058`. GitHub Actions `34523401772` / CI #140 was green but its `pnpm test` output reproducibly warned that `vitest.config.ts` contained ESM syntax while being loaded as CommonJS.

`package.json` intentionally has no global `"type": "module"`, while the Vitest configuration used ESM imports plus CommonJS `__dirname`. Vitest supports an explicit `.mts` configuration extension. Changing the whole package to ESM would have been broader than required.

## Change

Commit `85ff10741875892e2787631b106cfc48bfad0d5c`:

- renamed `vitest.config.ts` to `vitest.config.mts` so module semantics are explicit;
- replaced `path.resolve(__dirname, "./src")` with `fileURLToPath(new URL("./src", import.meta.url))`;
- preserved every Vitest setting and test inclusion pattern;
- changed no application runtime code, dependency, test assertion, or provider behavior.

This was configuration-only maintenance, so an artificial RED behavioral test was not introduced. CI #140 supplied the reproducible warning evidence and CI #141 supplied the verification evidence.

## Verification

Exact implementation/configuration head: `85ff10741875892e2787631b106cfc48bfad0d5c`.

GitHub Actions: `34528888577` / CI #141 — SUCCESS.

Verified gates:

- frozen dependency installation;
- lint;
- typecheck;
- 17 test files / 54 tests;
- autonomous-framework verifier tests;
- requirements-source verifier tests;
- autonomous-framework verification;
- requirements-source integrity verification;
- production build;
- seven Chromium E2E tests;
- PRD sections 1–242 coverage.

The Vite warning `ESM syntax in a file loaded as CommonJS (vitest.config.ts:1:1)` is absent from CI #141's Vitest output.

Vitest still emits a performance suggestion about repeated jsdom environment creation. No change was made because sharing a jsdom environment can compromise isolation and this repository previously had cross-test DOM leakage. GitHub-hosted runner/action Node deprecation notices are external to this application change.

## Independent review

Perspectives: correctness, configuration portability, test integrity, architecture/YAGNI, security, and active M01 safety boundaries.

- Critical: 0 unresolved.
- Important: 0 unresolved.
- Minor: none introduced by this change.

The `.mts` change narrows ESM semantics to the configuration file rather than changing the package globally. `fileURLToPath` avoids URL-path portability errors. No credentials, provider access, authorization behavior, hiring logic, or test expectations changed.

## Provider blocker

The M01 provider evidence blocker is unchanged. Read-only connected-account discovery found two existing Supabase projects and their public schemas clearly correspond to unrelated applications. Neither was modified. New project/branch creation remains gated by explicit organization/cost confirmation.

## Exact next work

Identify or configure a dedicated safe Hire Evidence Supabase test environment, then execute real M01.6 two-user RLS isolation and remaining M01.7 provider-backed auth/profile E2E. Keep PR #3 open/draft and unmerged.
