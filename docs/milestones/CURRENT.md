# Current Milestone

Milestone:
Organizations + RBAC

Legacy roadmap identifier:
M02

Current capability:
Organization tenancy, fixed RBAC, onboarding, tenant shell, owner-safe membership management, secure invitations, bounded settings, provider-backed two-organization isolation, and responsive/keyboard closeout are implemented and reviewed. The branch is awaiting exact-final-head CI after documentation reconciliation and then explicit merge authorization.

Status:
CLOSEOUT COMPLETE / AWAITING EXPLICIT MERGE AUTHORIZATION

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
- Closeout evidence: `docs/superpowers/evidence/2026-09-11-m02-organizations-rbac-closeout.md`.
- Tenant context is URL-scoped under `/app/o/[organizationId]`.
- PostgreSQL RLS/RPCs are authoritative; TypeScript capabilities are UX/preflight only.
- Fixed roles: `owner`, `admin`, `recruiter`, `hiring_manager`, `reviewer`.
- Organization creation atomically creates owner membership through an authenticated RPC.
- Membership mutations use narrow authenticated RPCs and preserve owner invariants.
- Invitation tokens are cryptographically random, SHA-256 hash-at-rest, expiring, revocable, replay-protected and authenticated-email-bound.
- Settings update only `name`, `company_size`, `hiring_use_case` plus `updated_at`, with owner/admin RLS authority.

## Iterations

1. M02.1 — organization schema + memberships — VERIFIED SLICE; CI #161.
2. M02.2 — fixed RBAC + organization validation — VERIFIED SLICE; RED #162 → GREEN #163.
3. M02.3 — organization onboarding — VERIFIED SLICE; RED #165, build-debug #167, GREEN #168.
4. M02.4 — tenant-aware application shell/navigation — VERIFIED SLICE; RED #169 → GREEN #170.
5. M02.5 — membership management + owner invariants — VERIFIED SLICE; final implementation `fa7a996d…`, CI #190.
6. M02.6 — secure team invitations — VERIFIED SLICE; final implementation `5abee48b…`, CI #215.
7. M02.7 — bounded organization settings — VERIFIED SLICE; RED `8a080819…` / CI #217 → GREEN `43b7c231…` / CI #218.
8. M02 closeout — provider-backed Org A/Org B/unauthenticated isolation VERIFIED at `3e0c3555…`, CI #219; responsive/keyboard browser matrix and whole-milestone review VERIFIED on reviewed head `fd8907cf…`, CI #224 / `34610615757`.

## Blocker

No engineering blocker is known. Merge is blocked only by the standing explicit-authorization policy.

## Verification state

Reviewed implementation/documentation head `fd8907cf20498466c2d62cb1b12abd29eb584686` passed GitHub Actions #224 / `34610615757` across frozen install, lint, typecheck, tests, framework/source checks, local Supabase, production build, Chromium E2E, PRD coverage and teardown. Closeout documentation written after that SHA requires a fresh exact-final-head run before PR readiness is finalized.

## Review state

Final skeptical security/accessibility/YAGNI review: 0 unresolved Critical, 0 unresolved Important. PR #4 had no submitted reviews and no unresolved review threads at closeout inspection.

## Next Action

Follow `docs/progress/STATUS.md` `Exact next work:`: verify GitHub Actions against the exact latest closeout-documentation head, reconcile PR metadata if green, then stop at the explicit merge-authorization gate. Do not merge PR #4 and do not start M03 before explicit authorization and green post-merge `main` CI.