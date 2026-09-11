# M02 Organization Onboarding and Tenant Shell Evidence — 2026-09-11

## Scope

This record covers M02 Task 3 (organization creation/onboarding) and Task 4 (tenant-aware application shell) on branch `feat/organizations-rbac`, PR #4.

## Task 3 — Organization onboarding

### RED
- Commit: `955ea25927e0fa5ee2195f319d3d036be956c8b0` (`test: define organization onboarding behavior`).
- CI: `34591242677` / #165 — failed at typecheck because the planned organization repository, onboarding action and form modules did not exist.
- This was the expected TDD failure. No test or verifier was weakened.

### GREEN implementation
- Commit: `753e73dcea531b420bc51d8b670f88343ae04abf` (`feat: add organization onboarding`).
- Added the RLS-backed organization repository, authenticated server action, bounded validation/error handling, accessible onboarding form/page, and `/app` organization list/empty state.
- Follow-up verification commit `bdaef58838f0fa7c749e9d00b3f8626642c2ddf1` added successful redirect and unauthenticated route-protection assertions.

### Systematic-debugging fix
- CI `34591548069` / #167 passed lint, typecheck, 78 unit/component tests, framework/source verification and real local Supabase migrations, then failed production build with Next.js `invalid-use-server-value` because the `"use server"` action module re-exported the non-function idle action-state object.
- Root cause: Next.js server-action modules may export async functions only; the ordinary state object belonged in its existing non-server module.
- Fix: commit `b817f49ac5beaa8a07bbbf0b32d4e798dcff8484` removed the object re-export and imported state directly in tests.
- Exact-head CI `34591943413` / #168 — SUCCESS across frozen install, lint, typecheck, 78 unit/component tests, framework/source verifiers, local Supabase start/reset/migrations, production build, Chromium E2E, PRD 1–242 coverage and teardown.

## Task 4 — Tenant-aware application shell

### RED
- Commit: `6a47c0ee42f2a95fe8bdc2a8e07024db7bf9f09f` (`test: define tenant membership boundary`).
- CI: `34592400459` / #169 — failed typecheck exactly because `require-membership` and `tenant-navigation` did not exist.

### GREEN
- Commit: `709993dd37fe60cb8db7647c9c8251b6011fc977` (`feat: add tenant-aware application shell`).
- `requireOrganizationMembership()` validates canonical UUID shape before provider access, then queries `organization_memberships` through the authenticated Supabase server client and RLS. Missing, inaccessible, errored or structurally unexpected results fail through the same `notFound()` boundary without exposing tenant metadata.
- `TenantNavigation` renders tenant name/role and capability-driven Overview/Team/Settings links. TypeScript capability checks are UX only; RLS remains authoritative.
- `/app/o/[organizationId]` layout resolves membership context server-side before rendering tenant UI.
- Exact-head CI `34592533041` / #170 — SUCCESS across the full repository suite including local Supabase, production build, browser E2E and PRD coverage.

## Review

Skeptical review considered PRD compliance, route-forgery behavior, authorization boundaries, server/client separation, accessibility, YAGNI, tests and hiring-AI safety.

- Critical: 0 unresolved.
- Important: 0 unresolved.
- Minor: the milestone-wide aggressive two-organization browser/API matrix remains intentionally deferred to later M02 closeout after membership-management/invitation/settings mutations exist; it is not bypassed or marked complete here.
- No service-role path, autonomous hiring decision, protected-trait inference, emotion/appearance/accent/personality/deception scoring, fabricated candidate evidence or cross-tenant authorization bypass was introduced.

## Remaining M02 work

1. Membership management RPCs/UI with owner-preservation invariants.
2. Secure hash-at-rest invitation lifecycle and abuse cases.
3. Bounded organization settings.
4. Real Org A vs Org B vs unauthenticated read/write isolation across all M02 resources and roles.
5. Final accessibility/security/performance review, durable closeout, exact-final-head CI, merge and post-merge main verification.
