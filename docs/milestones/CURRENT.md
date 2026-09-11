# Current Milestone

Milestone:
Organizations + RBAC

Legacy roadmap identifier:
M02

Current capability:
Organization tenancy foundation, fixed RBAC, onboarding and the RLS-backed tenant shell are implemented/verified slices; membership management with owner invariants is next.

Status:
IMPLEMENTING

Branch:
`feat/organizations-rbac`

Base:
`main` at verified SHA `ed10e1b55bb62cf202585c8c50e6487014e83c29`

PR:
#4 — `Build organization tenancy and role-based access` — OPEN / DRAFT / unmerged.

Canonical compact recovery state:
`docs/progress/STATUS.md`

Detailed known issues:
`docs/progress/KNOWN-ISSUES.md`

## Dependency closeout

- Product Foundation: COMPLETE.
- SaaS Shell + Auth: COMPLETE. PR #3 squash-merged as `ed10e1b55bb62cf202585c8c50e6487014e83c29`; post-merge main CI #157 passed.

## Selected M02 Architecture

- Design: `docs/superpowers/specs/2026-09-11-organizations-rbac-design.md`.
- Plan: `docs/superpowers/plans/2026-09-11-organizations-rbac.md`.
- Tenant context is URL-scoped under `/app/o/[organizationId]`.
- PostgreSQL RLS/RPCs are authoritative; TypeScript capabilities are UX/preflight only.
- Fixed roles: `owner`, `admin`, `recruiter`, `hiring_manager`, `reviewer`.
- Organization creation atomically creates owner membership through an authenticated RPC.
- Invitation tokens will be cryptographically random, SHA-256 hash-at-rest, expiring, and authenticated-email-bound.

## Iterations

1. M02.1 — organization schema + memberships — VERIFIED SLICE; CI #161 green.
2. M02.2 — fixed RBAC + organization validation — VERIFIED SLICE; RED #162 → GREEN #163.
3. M02.3 — organization onboarding — VERIFIED SLICE; RED #165, build-debug CI #167, final GREEN #168.
4. M02.4 — tenant-aware application shell/navigation — VERIFIED SLICE; RED #169 → GREEN #170.
5. M02.5 — membership management + owner invariants — NEXT.
6. M02.6 — secure team invitations — PLANNED.
7. M02.7 — organization settings + adversarial Org A/Org B/unauthenticated verification — PLANNED / completion gate.

## Blocker

None currently known. Do not confuse unfinished planned work with an external blocker.

## Verification state

Task 3 final implementation/fix head `b817f49ac5beaa8a07bbbf0b32d4e798dcff8484` passed CI `34591943413` / #168. Task 4 GREEN head `709993dd37fe60cb8db7647c9c8251b6011fc977` passed CI `34592533041` / #170 across frozen install, lint, typecheck, 83 unit/component tests, framework/source verification, local Supabase migrations, build, E2E, PRD coverage and teardown. This durable-state reconciliation requires fresh exact-head CI.

## Next Action

Follow `docs/progress/STATUS.md` `Exact next work:` and begin Task 5 with failing membership-management migration/action tests before implementation.
