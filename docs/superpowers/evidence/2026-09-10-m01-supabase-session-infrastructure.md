# M01.2 Supabase Session Infrastructure — Engineering Evidence

Date: 2026-09-10

Branch: `feat/saas-shell-auth`

PR: #3 — draft/open, `Build SaaS shell and authentication`

Base: `main` at `64ebeb4f7b2a39fc0557685ef34035650211aad9`

## Scope

Task 2 of `docs/superpowers/plans/2026-09-10-saas-shell-auth.md`: Supabase public environment validation, generated dependency lock state, browser/server SSR clients, request proxy session refresh/claim verification, and safe internal redirect handling.

## Requirements

Anchors: PRD sections 16 and 196. This slice establishes auth/session infrastructure only; it does not claim provider-backed signup/login/recovery/profile completion.

## TDD Evidence

### Environment boundary RED

- Test-first commit: `883853a231650487d9c5fda8bf8029550194ed36` — `test: define Supabase environment boundary`.
- CI: `34498258324` / #67.
- Expected failure: typecheck proved production `EnvironmentInput`/`AppEnvironment` did not yet expose required Supabase values.

### Redirect boundary RED/GREEN

- Initial test-first redirect commit: `e334ce34ebca2851cf239daa6364164300be30e4`.
- Skeptical security review later identified a network-path normalization edge case using backslashes.
- Regression RED: `ea8f6d628935bb942f0fd26b824c603bd1380e4f`; CI `34499549698` / #82 failed exactly on `rejects backslash network-path variants` while 15 other tests passed.
- Minimal GREEN fix: `c1a11206916684546c8b8dcdd89f4a3908fe359e` rejects any backslash-bearing redirect candidate.
- Full GREEN: CI `34499829397` / #83 passed every repository gate.

## Systematic Debugging Evidence

CI `34498441763` / #70 exposed a test-construction failure under `exactOptionalPropertyTypes`: a test represented a missing optional key by explicitly assigning `undefined`. The root cause was corrected in `c7d5d2160cd3c3d1ea8d956bc574fbfcb1d0ccda` by omitting the property for the missing-key case and testing blank strings separately. Runtime validation was not weakened.

Pre-verification integration review also found that the broad Next.js request proxy requires public Supabase configuration during provider-independent build/smoke execution. `.github/workflows/ci.yml` now supplies explicit non-secret placeholders for those steps. They are only configuration seams and are not provider-backed authentication evidence.

## Dependency Reproducibility

The runtime could not clone GitHub directly, so dependency resolutions were not hand-edited. A temporary one-shot GitHub Actions workflow ran:

```bash
pnpm add @supabase/supabase-js @supabase/ssr
```

Generated dependency commit: `4c81f50f8025ac4bfd800e4ae50b929f1123b0d3`.

Resolved direct versions in the generated lock state:

- `@supabase/ssr` 0.12.7;
- `@supabase/supabase-js` 2.116.0.

The one-shot write-enabled workflow was removed immediately after generation; no temporary generator workflow remains in the final tree. Normal CI retains read-only contents permission and frozen installation.

## Implementation

- `.env.example` documents browser-safe Supabase URL/publishable key values and explicitly rejects service-role/secret-key placement.
- `src/config/env.ts` validates absolute HTTP(S) Supabase URLs and non-empty publishable keys.
- `src/lib/supabase/client.ts` creates the browser client.
- `src/lib/supabase/server.ts` creates request-scoped cookie-backed server clients.
- `src/lib/supabase/proxy.ts` performs request cookie adaptation and `auth.getClaims()` verification/refresh.
- `src/proxy.ts` delegates request handling while excluding static asset paths.
- `src/lib/auth/safe-redirect.ts` accepts internal single-slash paths and rejects external, protocol-relative, non-slash, empty, and backslash network-path candidates.

## GREEN Verification

Reviewed code head: `c1a11206916684546c8b8dcdd89f4a3908fe359e`.

GitHub Actions: `34499829397` / #83 — SUCCESS.

Passed:

- `pnpm install --frozen-lockfile`;
- lint;
- typecheck;
- unit/component tests: 16 passed;
- autonomous-framework verifier tests;
- requirements-source verifier tests;
- autonomous-framework verification;
- requirements-source integrity verification;
- production build;
- Chromium installation;
- smoke E2E;
- PRD sections 1–242 coverage verification.

## Skeptical Review

Perspectives: PRD compliance, correctness/edge cases, architecture/YAGNI, dependency reproducibility, test quality, authentication/session security, redirect injection, and hiring-AI safety.

Findings after fixes:

- Critical: 0 unresolved.
- Important: 0 unresolved.
- Resolved Important security finding: backslash network-path redirect escape.
- Resolved Important integration finding: provider-independent CI lacked explicit public Supabase config once the proxy became active.
- Minor: existing Vitest/Vite ESM-in-CommonJS config-loader warning remains deferred maintenance.

No hiring-decision functionality, protected-trait inference, prohibited scoring, candidate evidence fabrication, or tenant authorization behavior was introduced by this infrastructure slice.

## Known Limitations

Provider-backed auth is intentionally not proven here. Signup/login/logout/verification, recovery, protected app entry, profile RLS/cross-user denial, and milestone-wide accessibility/security E2E remain later M01 slices.

## Next Legitimate Action

M01.3: write genuine RED tests for auth input validation and accessible signup/login form behavior, then implement the minimum email/password signup/login/logout/verification flow. Keep PR #3 draft/open and unmerged.
