# M02 Foundation + Fixed RBAC Evidence — 2026-09-11

## Scope

This record covers the first two implementation slices of Organizations + RBAC in draft PR #4: the organization/membership database foundation and the pure fixed-role capability + bounded organization-input validation layer.

## Repository boundary

- Base `main`: `ed10e1b55bb62cf202585c8c50e6487014e83c29` (M01 squash merge).
- Post-M01 main CI: `34584310345` / #157 — SUCCESS.
- Branch: `feat/organizations-rbac`.
- PR: #4 `Build organization tenancy and role-based access` — OPEN / DRAFT.

## Task 1 — Organization tenancy foundation

RED commit `6db6188df85a0cfa1b71a5a403accc8fe8896312` introduced the migration contract before `supabase/migrations/20260911_create_organizations.sql` existed.

GREEN implementation `881f786ccb6560bc902c1d16cac53906ba15a58a` added:
- exact fixed organization-role enum;
- `public.organizations` and `public.organization_memberships`;
- composite membership identity and user lookup index;
- private `SECURITY DEFINER` membership/role helpers with empty search paths;
- RLS with member reads and owner/admin organization updates;
- no direct authenticated organization INSERT or membership write grants;
- authenticated `public.create_organization(...)` RPC using `auth.uid()` and atomic owner bootstrap.

Follow-up test commit `0e24fcfc02c6df809ad1555f6fb5a7e5a5963737` scoped an overbroad grant assertion without weakening the security contract. Exact-head CI `34585418940` / #161 — SUCCESS, including real local Supabase migration execution and the complete quality suite.

## Task 2 — Fixed RBAC + organization input validation

RED commit: `6c2719c9502a4a23c59023322eeed247e362eb21`.

CI `34586195185` / #162 produced the intended failure during typecheck:
- `Cannot find module './rbac'`
- `Cannot find module './validation'`

The failure occurred because the test-first production modules had not been created; lint had already passed. No test or verifier was weakened.

GREEN commit: `ed9b3d52db6674fb15bb91c366f18940544e31ae`.

Implemented:
- immutable fixed roles `owner | admin | recruiter | hiring_manager | reviewer`;
- explicit capabilities `organization:view | organization:update | team:view | team:invite | team:manage_roles`;
- owner/admin receive all current M02 capabilities;
- recruiter/hiring_manager/reviewer receive only organization/team view capabilities;
- no generic/custom permission mechanism;
- organization input validation trims values, requires a 1–120 character name, maps blank optional fields to null, bounds company size to 80 and hiring use case to 500, and rejects non-text inputs with bounded messages.

Exact implementation-head CI `34586305688` / #163 — SUCCESS. Passed frozen install, lint, typecheck, unit/component tests, autonomous-framework verifier tests, requirements-source verifier tests, autonomous-framework verification, requirements-source integrity, local Supabase startup/migrations, production build, Chromium E2E, PRD sections 1–242 coverage, and teardown.

## Skeptical review

Reviewed current slices for PRD compliance, correctness/edge cases, architecture/YAGNI, test quality, security/tenancy and hiring-AI safety.

- Critical: 0 unresolved.
- Important: 0 unresolved.
- Accessibility: no new UI in Task 2; M02 UI review remains pending.
- Security: TypeScript capabilities are UX/preflight only; database RLS/RPC remains authoritative. No service-role browser path or cross-tenant bypass was added.
- Hiring AI safety: no hiring decision logic or prohibited trait/appearance/emotion/accent/personality/deception inference was added.

## Remaining milestone evidence

M02 is deliberately not complete. Required remaining work includes onboarding, tenant-aware shell/navigation, owner-invariant membership management, secure invitation lifecycle, organization settings and real local-Supabase Org A vs Org B vs unauthenticated adversarial verification.

## Next action

Begin Task 3 with genuine failing organization-onboarding server-action and component tests before adding the repository/action/form/page implementation.