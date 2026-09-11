# Organizations and RBAC Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build secure multi-tenant organization creation, fixed RBAC, team invitations, organization settings, tenant-aware navigation, and provider-backed two-organization isolation so M02 exits with verified tenant isolation.

**Architecture:** Extend the existing Next.js + Supabase application with URL-scoped organization context under `/app/o/[organizationId]`. PostgreSQL RLS and narrowly scoped authenticated RPCs are authoritative; TypeScript capability helpers drive UX/preflight only. Organization creation atomically inserts the owner membership, invitation tokens are random/hash-at-rest/expiring, and all closeout verification runs against the real local Supabase stack already used by CI.

**Tech Stack:** Next.js 16 App Router, React 19, strict TypeScript, Supabase Auth/Postgres/RLS/RPC/PostgREST, Node `crypto`, Tailwind CSS, Vitest/Testing Library, Playwright, GitHub Actions.

**Spec:** `docs/superpowers/specs/2026-09-11-organizations-rbac-design.md`

## Global Constraints

- Preserve PRD sections 8–14, 18–19, and milestone 197.
- Fixed organization roles are exactly `owner | admin | recruiter | hiring_manager | reviewer`.
- Do not build an arbitrary permission editor or ownership-transfer workflow in M02.
- PostgreSQL RLS/RPCs are authoritative; possessing an organization UUID or rendering an enabled control never grants access.
- No service-role credential may be exposed to browser code or used to make tenancy E2E pass.
- Organization instructions or AI must never bypass role or tenant policy; humans remain hiring decision makers.
- Invitation tokens use at least 32 random bytes, persist only a SHA-256 hash, expire, and are bound to the authenticated invited email.
- Meaningful behavioral changes require genuine RED → GREEN → refactor evidence.
- M02 is not complete without real local-Supabase two-organization read/write denial, role-restricted mutation denial, invitation abuse cases, security/accessibility review, 0 unresolved Critical/Important findings, and exact-final-head CI.

---

### Task 1: Organization and Membership Database Foundation

**Files:**
- Create: `src/lib/organization/migration.test.ts`
- Create: `supabase/migrations/20260911_create_organizations.sql`
- Modify: `docs/milestones/M02-organizations-rbac.md`

**Interfaces:**
- Consumes: authenticated Supabase `auth.uid()` and the existing local-Supabase CI environment.
- Produces: enum `public.organization_role`; tables `public.organizations` and `public.organization_memberships`; private membership/role policy helpers; authenticated RPC `public.create_organization(p_name text, p_company_size text default null, p_hiring_use_case text default null) returns uuid`.

- [ ] **Step 1: Write the failing migration contract test**

Create `src/lib/organization/migration.test.ts` that loads `supabase/migrations/20260911_create_organizations.sql` and requires all of the following literals/structural invariants:

```ts
expect(sql).toMatch(/create type public\.organization_role as enum/i);
for (const role of ["owner", "admin", "recruiter", "hiring_manager", "reviewer"]) {
  expect(sql).toContain(`'${role}'`);
}
expect(sql).toMatch(/create table public\.organizations/i);
expect(sql).toMatch(/create table public\.organization_memberships/i);
expect(sql).toMatch(/primary key\s*\(organization_id,\s*user_id\)/i);
expect(sql).toMatch(/enable row level security/i);
expect(sql).toMatch(/create schema if not exists private/i);
expect(sql).toMatch(/security definer/i);
expect(sql).toMatch(/set search_path\s*=\s*''/i);
expect(sql).toMatch(/create or replace function public\.create_organization/i);
expect(sql).toMatch(/auth\.uid\(\)/i);
expect(sql).toMatch(/'owner'::public\.organization_role/i);
```

Also assert direct organization INSERT is not granted to `authenticated` and membership write grants/policies are not introduced by this bootstrap migration.

- [ ] **Step 2: Verify genuine RED**

Run:

```bash
pnpm test -- src/lib/organization/migration.test.ts
```

Expected: FAIL because `supabase/migrations/20260911_create_organizations.sql` does not exist yet. Preserve the exact failure in CI/commit evidence; do not create a placeholder migration merely to make file loading succeed.

- [ ] **Step 3: Implement the minimum secure schema**

Create the migration with:

```sql
create type public.organization_role as enum (
  'owner', 'admin', 'recruiter', 'hiring_manager', 'reviewer'
);

create table public.organizations (
  id uuid primary key default gen_random_uuid(),
  name text not null check (char_length(btrim(name)) between 1 and 120),
  company_size text null check (company_size is null or char_length(company_size) <= 80),
  hiring_use_case text null check (hiring_use_case is null or char_length(hiring_use_case) <= 500),
  created_by uuid null references auth.users(id) on delete set null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.organization_memberships (
  organization_id uuid not null references public.organizations(id) on delete cascade,
  user_id uuid not null references auth.users(id) on delete cascade,
  role public.organization_role not null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  primary key (organization_id, user_id)
);

create index organization_memberships_user_id_idx
  on public.organization_memberships(user_id);
```

Create `private.is_organization_member(uuid)` and `private.has_organization_role(uuid, public.organization_role[])` as stable `SECURITY DEFINER` SQL functions with `set search_path = ''` and fully-qualified references. Revoke broad execution and grant only what authenticated policy evaluation needs. Enable RLS on both tables. Grant authenticated users SELECT on organizations/memberships and column-limited UPDATE on only `name`, `company_size`, `hiring_use_case`, `updated_at` for organizations. Add organization SELECT/member and UPDATE/owner-admin policies plus membership SELECT/member policy. Do not add direct membership write policies yet.

Implement `public.create_organization(...)` as a `SECURITY DEFINER` function with `set search_path = ''` that:

```text
requires auth.uid()
normalizes and validates name/company_size/hiring_use_case
inserts organization with created_by = auth.uid()
inserts creator membership with owner role in the same transaction
returns organization id
```

Revoke function execution from `public`/`anon` and grant to `authenticated` only.

- [ ] **Step 4: Verify GREEN and real migration execution**

Run:

```bash
pnpm test -- src/lib/organization/migration.test.ts
supabase start
supabase db reset
supabase stop --no-backup
pnpm lint
pnpm typecheck
```

Expected: focused test passes and local Supabase applies both M01 and M02 migrations without error.

- [ ] **Step 5: Record evidence and commit**

Update the M02 ledger with RED commit/run and GREEN migration evidence, then commit:

```bash
git add src/lib/organization/migration.test.ts supabase/migrations/20260911_create_organizations.sql docs/milestones/M02-organizations-rbac.md
git commit -m "feat: add organization tenancy foundation"
```

---

### Task 2: Fixed RBAC and Organization Input Validation

**Files:**
- Create: `src/lib/organization/rbac.ts`
- Create: `src/lib/organization/rbac.test.ts`
- Create: `src/lib/organization/validation.ts`
- Create: `src/lib/organization/validation.test.ts`

**Interfaces:**
- Consumes: database roles `owner | admin | recruiter | hiring_manager | reviewer`.
- Produces:

```ts
export type OrganizationRole = "owner" | "admin" | "recruiter" | "hiring_manager" | "reviewer";
export type OrganizationCapability =
  | "organization:view"
  | "organization:update"
  | "team:view"
  | "team:invite"
  | "team:manage_roles";
export function hasOrganizationCapability(role: OrganizationRole, capability: OrganizationCapability): boolean;
export function validateOrganizationInput(input: { name: unknown; companySize: unknown; hiringUseCase: unknown }): ValidationResult;
```

- [ ] **Step 1: Write failing RBAC matrix tests** requiring owner/admin all M02 capabilities and recruiter/hiring_manager/reviewer only `organization:view` + `team:view`.
- [ ] **Step 2: Write failing validation tests** requiring trimmed 1–120 name, nullable/trimmed company size <=80, nullable/trimmed hiring use case <=500, and bounded actionable messages.
- [ ] **Step 3: Verify RED** with `pnpm test -- src/lib/organization/rbac.test.ts src/lib/organization/validation.test.ts` and confirm missing modules/functions are the failure.
- [ ] **Step 4: Implement pure minimum helpers** with immutable role→capability sets and no dynamic/custom permission mechanism.
- [ ] **Step 5: Verify GREEN**, then `pnpm lint && pnpm typecheck`.
- [ ] **Step 6: Commit** with `feat: add fixed organization role capabilities`.

---

### Task 3: Organization Creation and Onboarding

**Files:**
- Create: `src/lib/organization/repository.ts`
- Create: `src/app/(app)/app/organizations/new/actions.ts`
- Create: `src/app/(app)/app/organizations/new/actions.test.ts`
- Create: `src/app/(app)/app/organizations/new/page.tsx`
- Create: `src/components/organization/organization-form.tsx`
- Create: `src/components/organization/organization-form.test.tsx`
- Modify: `src/app/(app)/app/page.tsx`

**Interfaces:**
- Consumes: trusted M01 user identity, organization validation, `public.create_organization` RPC.
- Produces: `createOrganizationAction`, organization onboarding form, and `/app` organization-list/onboarding entry.

- [ ] **Step 1: Write failing action tests** proving invalid input never calls Supabase, valid input calls only `create_organization` with normalized fields, provider/database errors map to bounded copy, and successful creation redirects to `/app/o/{returnedUuid}`.
- [ ] **Step 2: Write failing component tests** for labels, help/error/status semantics, and no fake job/interviewer controls.
- [ ] **Step 3: Verify RED**.
- [ ] **Step 4: Implement repository/action/form/page**. Use `requireUser()` before mutation even though the RPC independently requires `auth.uid()`. List only organizations visible through membership/RLS and order deterministically by name then id.
- [ ] **Step 5: Verify GREEN**, lint/typecheck/build, and add provider-independent browser coverage that `/app/organizations/new` is protected.
- [ ] **Step 6: Commit** with `feat: add organization onboarding`.

---

### Task 4: Tenant-Aware Application Shell

**Files:**
- Create: `src/lib/organization/require-membership.ts`
- Create: `src/lib/organization/require-membership.test.ts`
- Create: `src/app/(app)/app/o/[organizationId]/layout.tsx`
- Create: `src/app/(app)/app/o/[organizationId]/page.tsx`
- Create: `src/components/organization/tenant-navigation.tsx`
- Create: `src/components/organization/tenant-navigation.test.tsx`

**Interfaces:**
- Consumes: organization membership query protected by RLS and role helpers.
- Produces:

```ts
export type OrganizationContext = Readonly<{
  organizationId: string;
  organizationName: string;
  role: OrganizationRole;
}>;
export async function requireOrganizationMembership(organizationId: string): Promise<OrganizationContext>;
```

- [ ] **Step 1: Write failing membership-boundary tests** requiring malformed IDs and inaccessible/missing rows to fail uniformly without rendering tenant metadata.
- [ ] **Step 2: Write failing navigation tests** requiring organization name, role text, team/settings links according to capability, and accessible navigation labeling.
- [ ] **Step 3: Verify RED**.
- [ ] **Step 4: Implement membership repository/boundary and tenant layout** under `/app/o/[organizationId]`; never infer authorization from the route parameter.
- [ ] **Step 5: Verify GREEN**, lint/typecheck/build and browser direct-route denial with a provider-backed user where available.
- [ ] **Step 6: Commit** with `feat: add tenant-aware application shell`.

---

### Task 5: Membership Management With Owner Invariants

**Files:**
- Create: `supabase/migrations/20260911_manage_memberships.sql`
- Create: `src/lib/organization/membership-migration.test.ts`
- Create: `src/lib/organization/members.ts`
- Create: `src/app/(app)/app/o/[organizationId]/team/actions.ts`
- Create: `src/app/(app)/app/o/[organizationId]/team/actions.test.ts`
- Create: `src/app/(app)/app/o/[organizationId]/team/page.tsx`
- Create: `src/components/organization/team-members.tsx`
- Create: `src/components/organization/team-members.test.tsx`

**Interfaces:**
- Consumes: owner/admin role, membership table.
- Produces narrowly scoped database RPC(s) for changing/removing non-owner member roles while preserving at least one owner and disallowing ownership transfer in M02.

- [ ] **Step 1: Write failing SQL/action tests** requiring admin/owner authorization, rejecting assignment of `owner`, rejecting any mutation of the existing owner membership, and ignoring/denying forged organization/member IDs through RLS/RPC authorization.
- [ ] **Step 2: Verify RED**.
- [ ] **Step 3: Implement minimum security-definer management RPCs** with empty search path, authenticated actor membership/role checks, row-count/state validation, and no direct table write grants broad enough to bypass invariants.
- [ ] **Step 4: Implement team list and bounded role/remove actions** for non-owner members only.
- [ ] **Step 5: Verify GREEN** against local Supabase with at least owner/admin/recruiter actors, then lint/typecheck/build.
- [ ] **Step 6: Commit** with `feat: enforce organization membership roles`.

---

### Task 6: Secure Team Invitations

**Files:**
- Create: `supabase/migrations/20260911_create_organization_invitations.sql`
- Create: `src/lib/organization/invitations.ts`
- Create: `src/lib/organization/invitations.test.ts`
- Create: `src/app/(app)/app/o/[organizationId]/team/invite-actions.ts`
- Create: `src/app/(app)/app/o/[organizationId]/team/invite-actions.test.ts`
- Create: `src/app/(app)/app/invitations/[token]/page.tsx`
- Create: `src/app/(app)/app/invitations/[token]/actions.ts`
- Create: `src/components/organization/invite-form.tsx`
- Create: `src/components/organization/invite-form.test.tsx`

**Interfaces:**
- Consumes: authenticated owner/admin, organization role enum, current authenticated user's verified email.
- Produces:

```ts
export const INVITATION_TTL_MS = 7 * 24 * 60 * 60 * 1000;
export function generateInvitationToken(): { rawToken: string; tokenHash: string };
```

and authenticated invite-create/revoke/accept database RPCs with atomic state checks.

- [ ] **Step 1: Write failing token tests** requiring >=32 random bytes of entropy, URL-safe raw token, SHA-256 hash persisted representation, deterministic hashing, and no raw token equality with stored hash.
- [ ] **Step 2: Write failing invitation action/SQL tests** for owner/admin create/revoke, non-admin denial, no owner-role invites, normalized email, expiry, wrong-email denial, revoked denial, consumed/replay denial, and atomic membership creation.
- [ ] **Step 3: Verify RED**.
- [ ] **Step 4: Implement migration/RPCs/token helper/actions/UI**. Return the raw invitation link once to the authorized inviter; persist only the hash. Do not add an email-delivery provider.
- [ ] **Step 5: Verify GREEN** with real local Supabase abuse cases plus component tests, lint/typecheck/build.
- [ ] **Step 6: Commit** with `feat: add secure organization invitations`.

---

### Task 7: Organization Settings

**Files:**
- Create: `src/app/(app)/app/o/[organizationId]/settings/actions.ts`
- Create: `src/app/(app)/app/o/[organizationId]/settings/actions.test.ts`
- Create: `src/app/(app)/app/o/[organizationId]/settings/page.tsx`
- Create: `src/components/organization/organization-settings-form.tsx`
- Create: `src/components/organization/organization-settings-form.test.tsx`

**Interfaces:**
- Consumes: organization validation, tenant context, owner/admin capability, column-limited RLS update.
- Produces: owner/admin settings updates for only `name`, `company_size`, `hiring_use_case`.

- [ ] **Step 1: Write failing tests** proving recruiter/hiring_manager/reviewer cannot update settings, invalid values fail before persistence, forged immutable columns are ignored, and provider errors are bounded.
- [ ] **Step 2: Verify RED**.
- [ ] **Step 3: Implement settings form/action** using trusted route organization ID plus RLS; update only the three allowed business fields and `updated_at`.
- [ ] **Step 4: Verify GREEN**, including direct PostgREST unauthorized update attempts between two organizations.
- [ ] **Step 5: Verify accessibility/mobile states**, lint/typecheck/build.
- [ ] **Step 6: Commit** with `feat: add bounded organization settings`.

---

### Task 8: Adversarial Tenancy E2E, Review, and Closeout

**Files:**
- Create: `e2e/organizations.spec.ts`
- Modify: `.github/workflows/ci.yml` only if the existing provider-backed command needs no-behavior-change plumbing for new test diagnostics.
- Modify: `docs/progress/STATUS.md`
- Modify: `docs/progress/KNOWN-ISSUES.md`
- Modify: `docs/milestones/CURRENT.md`
- Modify: `docs/milestones/M02-organizations-rbac.md`
- Modify: `docs/milestones/README.md`
- Modify: `docs/FEATURE-MATRIX.md`
- Modify: `docs/requirements/TRACEABILITY.md`
- Create: `docs/superpowers/evidence/2026-09-11-m02-organizations-rbac-closeout.md`

**Interfaces:**
- Consumes: completed M02 schema/RPC/routes/actions and local Supabase provider environment.
- Produces: milestone completion evidence and merge-ready PR state.

- [ ] **Step 1: Add provider-backed organization lifecycle E2E** with independently authenticated User A, User B, and User C:

```text
A creates Org A
B creates Org B
A/B can access their own organizations
A cannot read/update Org B organization/memberships/invitations by API or forged URL/action
B cannot read/update Org A equivalents
unauthenticated clients get no tenant-owned rows
A invites C as recruiter
wrong authenticated email cannot accept C's token
C accepts matching invitation exactly once
replay fails
revoked invitation fails
expired invitation fails
recruiter C cannot update organization settings or manage roles/invitations
owner/admin allowed operations succeed
```

- [ ] **Step 2: Add responsive/keyboard E2E** for tenant navigation, team page, invitation/settings forms at desktop and 390×844 without horizontal overflow.
- [ ] **Step 3: Run E2E and debug root causes only**. Do not weaken RLS, tests, token checks, or role assertions to obtain GREEN.
- [ ] **Step 4: Perform skeptical independent review** across PRD compliance, RLS/tenant isolation, RBAC invariants, invitation security, token leakage, application authorization, UX/accessibility, performance/YAGNI, and hiring-AI safety. Classify Critical/Important/Minor and fix all Critical/Important.
- [ ] **Step 5: Run complete verification**:

```bash
pnpm install --frozen-lockfile
pnpm lint
pnpm typecheck
pnpm test
python3 -m unittest tests/python/test_verify_autonomous_framework.py
python3 -m unittest tests/python/test_verify_requirements_source.py
python3 scripts/verify_autonomous_framework.py
python3 scripts/verify_requirements_source.py
supabase start
supabase db reset
pnpm build
pnpm e2e
python3 scripts/verify_prd_coverage.py
supabase stop --no-backup
```

- [ ] **Step 6: Reconcile durable state** with exact branch, PR, SHA, CI, real two-org evidence, findings, and exactly one `Exact next work:` item.
- [ ] **Step 7: Verify exact-final-head GitHub Actions** and ensure no newer unverified commit exists, no unresolved Critical/Important findings or blocking review threads remain, and the PR is mergeable.
- [ ] **Step 8: Auto-merge under standing owner authorization** when every completion gate is green, then verify post-merge `main` CI before activating M03.

## Plan Self-Review

- Spec coverage: Tasks 1–8 cover organization creation, memberships, fixed RBAC, RLS, tenant-aware navigation, team invitations, bounded settings, and aggressive two-organization verification from PRD 8–14, 18–19, and 197.
- Security: organization bootstrap avoids permissive direct INSERT; complex membership/invitation transitions use authenticated atomic RPCs; no service-role/browser bypass exists; raw invite tokens are not persisted.
- Scope: ownership transfer, arbitrary permissions, billing, branding/retention, jobs/interviewers/candidates, and email-provider integration remain out of M02.
- Test integrity: static SQL contract tests are only RED/structural evidence; completion requires real local-Supabase execution and adversarial PostgREST/browser tests.
- Type/interface consistency: fixed role and capability names match the design and all later tasks.
- Placeholder scan: no implementation step depends on TBD/TODO behavior.