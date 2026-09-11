# Current Milestone

Milestone:
Organizations + RBAC

Legacy roadmap identifier:
M02

Current capability:
Organization tenancy foundation, fixed RBAC, secure team invitations, tenant-aware navigation, organization settings, and adversarial tenant-isolation verification

Status:
PLANNED

Branch:
`feat/organizations-rbac`

Base:
`main` at verified SHA `ed10e1b55bb62cf202585c8c50e6487014e83c29`

PR:
Not opened yet; create one draft PR after M02 transition docs are durable.

Canonical compact recovery state:
`docs/progress/STATUS.md`

Detailed known issues:
`docs/progress/KNOWN-ISSUES.md`

## Dependency closeout

- Product Foundation: COMPLETE.
- SaaS Shell + Auth: COMPLETE. PR #3 final head `b8844130118453e56009284b9498c8357429f1af` passed CI #156 and squash-merged as `ed10e1b55bb62cf202585c8c50e6487014e83c29`; post-merge main CI #157 passed.

## Selected M02 Architecture

- Design: `docs/superpowers/specs/2026-09-11-organizations-rbac-design.md`.
- Plan: `docs/superpowers/plans/2026-09-11-organizations-rbac.md`.
- Tenant context is URL-scoped under `/app/o/[organizationId]`.
- PostgreSQL RLS/RPCs are authoritative; TypeScript capabilities are UX/preflight only.
- Fixed roles: `owner`, `admin`, `recruiter`, `hiring_manager`, `reviewer`.
- Organization creation atomically creates owner membership through an authenticated RPC.
- Invitation tokens are cryptographically random, SHA-256 hash-at-rest, expiring, and authenticated-email-bound.
- No arbitrary permission builder, ownership transfer, service-role browser path, or later-milestone scope.

## Iterations

1. M02.1 — organization schema + memberships — READY FOR RED.
2. M02.2 — fixed RBAC — PLANNED.
3. M02.3 — tenant RLS — PLANNED.
4. M02.4 — organization UI/navigation — PLANNED.
5. M02.5 — secure team invitations — PLANNED.
6. M02.6 — bounded organization settings — PLANNED.
7. M02.7 — adversarial Org A/Org B/unauthenticated verification — PLANNED.

## Blocker

None currently known.

## Verification state

M01 integration baseline is verified on `main` at `ed10e1b55bb62cf202585c8c50e6487014e83c29`, post-merge CI `34584310345` / #157 SUCCESS. M02 has not yet produced behavioral implementation evidence; do not claim RED/GREEN until the M02.1 test and migration commits are executed and observed.

## Next Action

Follow `docs/progress/STATUS.md` `Exact next work:`. Open the M02 draft PR, then begin M02.1 with the failing migration contract test before creating the migration.