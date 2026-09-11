# Current Milestone

Milestone:
Organizations + RBAC

Legacy roadmap identifier:
M02

Current capability:
Organization tenancy foundation and fixed RBAC are implemented/verified slices; organization onboarding is the next active implementation task.

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

1. M02.1 — organization schema + memberships — VERIFIED SLICE; CI #161 and later #163 green.
2. M02.2 — fixed RBAC + organization validation — VERIFIED SLICE; RED #162 → GREEN #163.
3. M02.3 — tenant RLS — ACTIVE foundation; broader mutation/isolation cases remain.
4. M02.4 — organization UI/navigation — NEXT via Task 3 onboarding, then tenant shell.
5. M02.5 — secure team invitations — PLANNED.
6. M02.6 — bounded organization settings — PLANNED.
7. M02.7 — adversarial Org A/Org B/unauthenticated verification — PLANNED / completion gate.

## Blocker

None currently known. Do not confuse unfinished planned work with an external blocker.

## Verification state

Task 1 database foundation exact head `0e24fcfc02c6df809ad1555f6fb5a7e5a5963737` passed CI `34585418940` / #161. Task 2 used genuine RED `6c2719c9502a4a23c59023322eeed247e362eb21`, CI #162, then GREEN `ed9b3d52db6674fb15bb91c366f18940544e31ae`, CI `34586305688` / #163, which passed install, lint, typecheck, unit/component tests, framework/source verification, local Supabase, build, E2E, PRD coverage and teardown. This durable-state reconciliation requires fresh exact-head CI.

## Next Action

Follow `docs/progress/STATUS.md` `Exact next work:` and begin Task 3 with failing organization onboarding action/component tests before implementation.