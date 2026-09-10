# M01 Profile Persistence and RLS Evidence — 2026-09-10

## Scope

Implements the M01 Task 6 provider-independent profile slice: optional display name, trusted authenticated ownership, Supabase profile schema/RLS, accessible profile settings UI, and bounded persistence errors. No organization/RBAC or hiring-decision functionality is introduced.

## TDD

RED commit: `8656902db4774ab91075e7dbadeb29464577917f`.

RED CI: GitHub Actions `34510379628` / #128. Frozen install and lint passed, then typecheck failed for the expected reason because `src/lib/profile/validation.ts` and `src/components/profile/profile-form.tsx` did not yet exist.

Implementation commit: `78f2602124486f417af19c057f71cb9192cc3590`.

## Review

Skeptical review perspectives: PRD compliance, correctness/edge cases, architecture/YAGNI, testing quality, RLS/authorization, accessibility, performance, and hiring-AI safety.

Finding: **Important** — initial implementation derived ownership correctly from `requireUser()`, but lacked an action-level regression proving forged `id` / `user_id` form fields cannot select profile ownership. It also lacked machine-checked structural assertions for all three RLS policy directions.

Fix: `e9c2ad64f2f9065d53a44652ac1116f91538e7f7` adds action-level trusted-owner/error tests plus migration tests for RLS enablement, select/insert/update `auth.uid()` constraints, ownership FK, and display-name bound.

Re-review: Critical 0 unresolved; Important 0 unresolved. Existing Vitest/Vite configuration warning remains Minor.

## Verification

Reviewed code/test head `e9c2ad64f2f9065d53a44652ac1116f91538e7f7` passed GitHub Actions `34510856609` / #130: frozen install, lint, typecheck, unit/component/integration tests, framework verifier tests, requirements-source verifier tests, autonomous-framework verification, requirements-source integrity verification, production build, Chromium smoke E2E, and PRD coverage.

## Security boundary

The profile action reads only `display_name` from user-controlled form data. Row ownership is passed to persistence only from the server-validated `requireUser()` result. The migration enables RLS and constrains select/insert/update to `auth.uid() = id`; update includes both `USING` and `WITH CHECK`.

## Remaining evidence gate

The repository does not yet have configured provider-backed Supabase test evidence. Static migration tests are defense-in-depth, not proof that deployed RLS behaves correctly. M01.6 therefore remains IMPLEMENTED, not VERIFIED, until two real authenticated test users prove mutual cross-user select/update denial.
