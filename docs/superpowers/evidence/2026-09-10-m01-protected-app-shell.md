# M01.5 Protected Application Shell — Engineering Evidence

Date: 2026-09-10

Branch: `feat/saas-shell-auth`

PR: #3 — draft/open, `Build SaaS shell and authentication`

Base: `main` at `64ebeb4f7b2a39fc0557685ef34035650211aad9`

## Scope
Task 5 of `docs/superpowers/plans/2026-09-10-saas-shell-auth.md`: trusted server user guard, authenticated `/app` layout/dashboard placeholder, product/profile/logout navigation, and unauthenticated protected-route redirect behavior.

## TDD Evidence
- RED commit `0d3aa49f61d29b9feb2d1a2ea4a10186748a108c` added guard/navigation tests before production modules existed.
- RED CI `34508434425` / #124: frozen install and lint passed; typecheck failed because `./require-user` and `./app-navigation` did not exist. Later gates correctly skipped.
- Minimum implementation `361ff9adf450d758389d60baa7c2962fd210b2e0` added only the server guard, navigation, protected layout, and honest workspace placeholder. CI #125 passed every repository gate.
- Browser verification `d5ee32a4ceab57df9ea8108a0e7600a1244c070c` added unauthenticated `/app` redirect smoke coverage. CI `34508795038` / #126 passed every gate including Chromium smoke E2E.

## Implementation
- `src/lib/auth/require-user.ts` obtains the user through server-side Supabase `getUser()` and redirects missing/invalid identity to login.
- Return paths are constrained with existing `safeInternalPath`; no external destination is accepted.
- `src/app/(app)/app/layout.tsx` gates protected rendering before supplying trusted user email to the navigation.
- `src/components/app/app-navigation.tsx` exposes product identity, profile path and server logout control without client state.
- `/app` intentionally states later organization/interview functionality is not yet available instead of fabricating product state.
- Existing root request proxy already refreshes/verifies auth for applicable routes; no redundant proxy authorization layer was introduced.

## Skeptical Review
Perspectives: PRD compliance, correctness, architecture/YAGNI, tests, auth/session security, redirect handling, accessibility, performance and hiring-AI safety.

- Critical: 0 unresolved.
- Important: 0 unresolved.
- Minor: `/app/profile` navigation points at M01.6-owned functionality and must remain clearly staged until that route is implemented.
- Minor: existing logout-scope and Vitest/Vite warning remain deferred as previously documented.

The shell does not introduce autonomous hire/reject behavior, protected-trait inference, appearance/emotion/accent/personality/deception scoring, fabricated evidence, or tenant authorization changes.

## Exact-Head Verification
Reviewed code/E2E head: `d5ee32a4ceab57df9ea8108a0e7600a1244c070c`.

GitHub Actions CI `34508795038` / #126 — SUCCESS across frozen dependency install, lint, typecheck, unit/component/integration tests, autonomous-framework verifier tests, requirements-source verifier tests, autonomous-framework verification, requirements-source integrity verification, production build, Chromium installation, smoke E2E, and PRD sections 1–242 coverage verification.

## Remaining Boundary
Authenticated provider-backed `/app` entry is intentionally not claimed by placeholder CI credentials and remains part of M01.7. Profile behavior/RLS belongs to M01.6.

## Next Legitimate Action
Begin M01.6 profile persistence/RLS test-first. Do not mark profile isolation VERIFIED without configured Supabase cross-user evidence. Keep PR #3 draft/open and unmerged.
