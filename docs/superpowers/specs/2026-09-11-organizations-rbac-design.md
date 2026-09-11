# Organizations and RBAC Design

## Purpose

Deliver PRD sections 8–14, 18–19, and milestone 197: organization creation, memberships, fixed owner/admin/recruiter/hiring-manager/reviewer roles, secure team invitations, organization settings, tenant-aware navigation, PostgreSQL RLS, and aggressive two-organization isolation verification.

This is an architectural milestone. It extends the M01 authenticated single-user application into the first true multi-tenant boundary. Routine design decisions are pre-authorized by `AGENTS.md` and `docs/AUTONOMOUS-DEVELOPMENT.md`; evidence gates remain mandatory.

## Product / Safety Boundaries

- The application is organization-first; every organization-owned record is tenant-scoped.
- RLS is the database authorization boundary. Application checks improve UX but never replace RLS.
- Initial roles are fixed: `owner | admin | recruiter | hiring_manager | reviewer`.
- Do not build an arbitrary permission editor in V1.
- AI has no role in organization authorization and cannot bypass membership or role policy.
- Candidate/private hiring data is not introduced in this milestone.
- No service-role credential is exposed to the browser or used to make tenant E2E pass.

## Approaches Considered

### 1. URL-scoped organization context + RLS — selected

Use routes under `/app/o/[organizationId]`. The URL carries navigation context, while every server read/mutation still executes under the authenticated Supabase user and RLS. Membership/role checks are explicit and testable.

Benefits:
- tenant context is visible and bookmarkable;
- avoids a hidden mutable “current organization” cookie becoming authorization state;
- future jobs/interviewer routes can nest under the same organization boundary;
- RLS remains authoritative even if a caller forges the URL.

### 2. Cookie-only active organization

Rejected for M02. It creates hidden state, makes direct-link behavior weaker, and increases the risk that UI context is mistaken for authorization.

### 3. Custom permission-builder / ACL tables

Rejected. The PRD explicitly asks for a simple fixed-role model. A generic permission system would be speculative complexity.

## Data Model

### `public.organizations`

```text
id uuid primary key
name text required, trimmed, 1..120 chars
company_size text nullable, max 80 chars
hiring_use_case text nullable, max 500 chars
created_by uuid -> auth.users(id)
created_at timestamptz
updated_at timestamptz
```

`created_by` records provenance but is not the long-term authorization source; membership is.

### `public.organization_memberships`

```text
organization_id uuid -> organizations(id) on delete cascade
user_id uuid -> auth.users(id) on delete cascade
role organization_role not null
created_at timestamptz
updated_at timestamptz
primary key (organization_id, user_id)
```

PostgreSQL enum:

```text
owner
admin
recruiter
hiring_manager
reviewer
```

The initial creator receives `owner` atomically.

### `public.organization_invitations`

```text
id uuid primary key
organization_id uuid -> organizations(id) on delete cascade
email text required, normalized lowercase
role organization_role not null
invited_by uuid -> auth.users(id)
token_hash text unique not null
expires_at timestamptz not null
accepted_at timestamptz nullable
revoked_at timestamptz nullable
created_at timestamptz
```

Only a SHA-256 hash of a cryptographically random token is persisted. The raw token exists only long enough to construct the invitation URL returned to an authorized inviter. A valid invitation is unexpired, unrevoked, unaccepted, and bound to the authenticated user's verified email.

## Database Authorization Helpers

Create a non-exposed `private` schema with small `SECURITY DEFINER` helpers whose bodies set an empty search path and fully qualify referenced objects. Examples:

```text
private.is_organization_member(org_id uuid)
private.has_organization_role(org_id uuid, allowed organization_role[])
```

These helpers prevent recursive membership-policy queries and keep RLS readable. Revoke broad execution and grant only the execution needed by `authenticated` policy evaluation.

Do not place authorization helpers in browser code as the only enforcement layer.

## Organization Creation

Use an authenticated database RPC:

```text
public.create_organization(
  p_name text,
  p_company_size text default null,
  p_hiring_use_case text default null
) returns uuid
```

The function:
1. requires `auth.uid()`;
2. validates bounded normalized text;
3. inserts the organization with `created_by = auth.uid()`;
4. inserts the creator membership with role `owner` in the same transaction;
5. returns the new organization ID.

This solves the bootstrap problem without weakening organization RLS or using a service-role application path.

## RBAC Model

Application-facing capabilities are explicit and intentionally small for M02:

```text
organization:view
organization:update
team:view
team:invite
team:manage_roles
```

Role mapping:

| Role | view org/team | update org | invite team | manage roles |
|---|---|---|---|---|
| owner | yes | yes | yes | yes |
| admin | yes | yes | yes | yes, except ownership transfer/removal |
| recruiter | yes | no | no | no |
| hiring_manager | yes | no | no | no |
| reviewer | yes | no | no | no |

Later milestones extend job/interview/review capabilities without changing the fixed-role identity model.

Ownership invariants:
- an organization must never be left without an owner;
- M02 does not implement ownership transfer;
- admins cannot assign, remove, or demote the owner role;
- owner membership cannot be removed through the M02 UI;
- users cannot change their own role to bypass these rules.

## RLS Policy Model

### Organizations
- SELECT: any active membership in that organization.
- UPDATE: owner/admin membership.
- direct INSERT: denied; use `create_organization` RPC.
- DELETE: not implemented in M02.

### Memberships
- SELECT: organization member.
- INSERT/UPDATE/DELETE from browser-facing table: constrained so only owner/admin management paths succeed, with owner invariants preserved by database function/RPC where mutations are complex.
- Prefer dedicated membership-management RPCs over permissive direct table policies when preserving owner invariants requires multi-row checks.

### Invitations
- SELECT: owner/admin of the organization.
- create/revoke: owner/admin only.
- acceptance: dedicated authenticated RPC validates token hash, email, state, expiry, and creates membership atomically.
- raw invite token is never stored.

## Server / Application Boundaries

### Organization repository

Server-only repository wraps Supabase queries/RPC calls. It accepts organization IDs for resource selection but never assumes that possessing an ID grants access; RLS decides.

### Role / capability helper

A pure TypeScript capability function maps fixed roles to current M02 capabilities for UI affordances and server preflight checks. Database RLS/RPCs remain authoritative.

### Routes

```text
/app
  organization list / onboarding entry

/app/organizations/new
  create-organization form

/app/o/[organizationId]
  tenant dashboard shell

/app/o/[organizationId]/team
  members + invitations

/app/o/[organizationId]/settings
  bounded organization settings

/app/invitations/[token]
  authenticated invitation acceptance boundary
```

Unknown/inaccessible organization IDs fail as not-found/unauthorized without exposing organization metadata.

## Organization Onboarding

The initial form requests only PRD-backed fields:
- organization name;
- company size;
- hiring use case.

After successful creation, redirect to `/app/o/{organizationId}`. “Create first job/interviewer” remains a later milestone; the UI may identify it as the next unavailable capability but must not fake implementation.

## Team Invitations

Owner/admin can create an invitation for an email and one non-owner role. M02 does not invite a new owner and does not implement ownership transfer.

Token generation:
- Node `crypto.randomBytes(32)`;
- URL-safe raw token;
- SHA-256 hash persisted;
- bounded expiry (default 7 days, constant in server module);
- database uniqueness on `token_hash`.

Acceptance requires a currently authenticated user whose verified email case-insensitively matches the invitation email. Acceptance is atomic and idempotent enough to reject consumed/revoked/expired tokens cleanly.

No email-delivery provider is added solely for M02. The authorized inviter receives a one-time invitation link from the server action/UI so product behavior and security can be verified without speculative infrastructure. Actual transactional delivery can be integrated when required.

## Organization Settings

Bounded MVP fields are the organization name, company size, and hiring use case introduced during onboarding. Owner/admin may update them. No branding, billing, retention, custom CSS, or compliance controls are pulled forward from later milestones.

## Error Handling

- Validate all form input server-side before provider/database calls.
- Return bounded user-safe errors; never reflect raw database policy errors, invitation hashes, or tokens in logs.
- Treat inaccessible organization IDs uniformly rather than exposing existence.
- Expired/revoked/consumed/wrong-email invitations return a stable invalid-invitation result.
- Concurrent invitation acceptance must yield at most one membership and one accepted timestamp.

## Security Review Requirements

Before completion prove:
- Org A member cannot SELECT/UPDATE Org B organization settings.
- Org A member cannot SELECT/INSERT/UPDATE/DELETE Org B memberships.
- Org A owner/admin cannot create/revoke Org B invitations.
- recruiter/hiring_manager/reviewer cannot perform admin mutations.
- unauthenticated direct API attempts cannot access organization-owned rows.
- forged organization IDs in URLs/actions do not bypass RLS.
- owner/admin boundaries and owner-preservation invariants hold.
- raw invite tokens are absent from persistent rows and logs.
- wrong-email, expired, revoked, and replayed invitation acceptance fails.

## Accessibility / Responsive Design

- tenant switch/list and nav are keyboard reachable and semantically labeled;
- forms have associated labels/errors/status text;
- team role labels are text, not color-only;
- narrow mobile layouts do not overflow;
- unavailable actions are not represented as misleading enabled controls.

## Performance

Keep M02 queries bounded. Organization/member/invitation lists are small initial SaaS lists; add deterministic ordering and conservative limits where appropriate. Add indexes for membership user lookup, invitation organization lookup, and invitation token hash/active state. Do not add caches or background workers.

## Testing Strategy

### Unit/component
- organization/profile-like validation boundaries;
- fixed role-to-capability matrix;
- invitation token hash/expiry helpers;
- forms/navigation semantics and permission-driven affordances.

### Integration/database
- migration executes on local Supabase;
- organization creation atomically creates owner membership;
- role-management invariants;
- invitation acceptance state machine;
- two-organization RLS read/write denial using independently authenticated clients.

### E2E
- User A creates Org A and sees tenant shell;
- User B creates Org B;
- owner/admin settings and team-management flow;
- invite User C, accept as matching authenticated email, role appears;
- wrong-email/replay/revoked/expired cases;
- Org A direct URL/API access to Org B fails and vice versa;
- role-restricted mutation attempts fail;
- mobile/keyboard tenant navigation.

## Non-Goals

- arbitrary custom permissions;
- ownership transfer;
- organization deletion;
- billing/subscription controls;
- branding/retention/compliance settings;
- jobs/interviewers/candidates beyond disabled or explanatory next-step UI;
- email-provider integration solely for invitation delivery;
- platform-super-admin support tooling.

## Success Criteria

M02 is complete only when organization creation, memberships, fixed RBAC, secure invitation acceptance, bounded settings, and tenant-aware navigation are implemented; Org A vs Org B plus unauthenticated direct access is verified against real local Supabase RLS; security/accessibility/performance reviews have 0 unresolved Critical/Important findings; durable traceability is reconciled; and exact-final-head CI is green.