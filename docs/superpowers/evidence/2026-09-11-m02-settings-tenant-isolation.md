# M02 Settings and Tenant-Isolation Evidence — 2026-09-11

## Scope

This record covers bounded organization settings and the provider-backed Org A / Org B / unauthenticated isolation matrix added during M02 closeout on branch `feat/organizations-rbac`, PR #4.

## Settings TDD

RED commit: `8a080819ef387fbbdcfad34cd0a9802b2d9974ea` (`test: define bounded organization settings behavior`).

GitHub Actions #217 (`34607531069`) failed at typecheck for the intended reason: `updateOrganizationSettings`, the settings server action, and the settings form production modules did not exist yet. The failure occurred after frozen install and lint succeeded.

GREEN implementation: `43b7c23122ec775253bbca0e38b701a694545205` (`feat: add bounded organization settings`).

Implemented behavior:
- route-bound organization ID is authoritative; forged organization/immutable form fields are ignored;
- existing bounded validation normalizes `name`, `company_size`, and `hiring_use_case`;
- only owner/admin roles pass the TypeScript preflight;
- database owner/admin UPDATE RLS remains authoritative;
- persistence is limited to the three business fields plus `updated_at`;
- zero-row/denied writes are treated as failure rather than success;
- provider errors are mapped to bounded user copy;
- settings form exposes accessible labels/help and explicit read-only behavior.

GitHub Actions #218 (`34607784231`) passed the complete repository pipeline for the settings implementation.

## Provider-Backed Tenant Isolation

Verification commit: `3e0c35557a8cd21e9a223909753a6fdf412d2557` (`test: verify organization tenant isolation`).

`e2e/organizations.spec.ts` creates independently authenticated users against the real local Supabase stack and verifies:
- Owner A sees Org A and not Org B; Owner B sees Org B and not Org A.
- Cross-tenant organization-membership and invitation reads expose no rows.
- Owner A cannot update Org B through direct PostgREST; Org B remains unchanged.
- Owner A can update authorized Org A settings.
- A recruiter joins Org A through the real invitation RPC, then cannot update settings, create invitations, or mutate roles.
- Owner A cannot invoke membership-role mutation against Org B.
- Unauthenticated clients receive no organization or membership data.
- Authorized state remains unchanged after denied attacks.

GitHub Actions #219 (`34608235065`) passed frozen install, lint, typecheck, unit/component tests, framework/source verifiers, local Supabase startup/migrations, production build, Chromium E2E including this matrix, PRD coverage and teardown.

## Independent Review

Current review of this slice found 0 unresolved Critical and 0 unresolved Important findings. PostgreSQL RLS/RPCs remain authoritative; service-role credentials are used only by provider-backed test setup to create confirmed test users, never to make tenant authorization assertions pass.

## Remaining M02 Closeout

The plan-specific responsive/keyboard browser matrix for tenant navigation, team, invitations and settings at desktop and 390×844 remains required, followed by final whole-milestone skeptical review, durable closeout reconciliation, and exact-final-head CI. PR #4 must remain unmerged unless explicit user authorization is provided.
