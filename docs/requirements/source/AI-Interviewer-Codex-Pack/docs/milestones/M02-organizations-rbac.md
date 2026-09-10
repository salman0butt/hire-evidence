# M02 — Organizations + RBAC

## Authoritative PRD milestone definition

# 197. MILESTONE 02 — ORGANIZATIONS + RBAC

Deliver:

```text
organization creation
memberships
owner/admin/recruiter/reviewer roles
team invitations
organization settings
tenant-aware navigation
RLS

```

Test two organizations aggressively.

Exit:

tenant isolation verified.

---

## Default iteration decomposition

- **M02.1 — Organization schema:** organizations + memberships.
- **M02.2 — Explicit RBAC:** owner/admin/recruiter/hiring-manager/reviewer capabilities.
- **M02.3 — RLS policies:** tenant-owned read/write isolation.
- **M02.4 — Organization UI/navigation:** onboarding and tenant-aware shell.
- **M02.5 — Team invitations:** secure invitation lifecycle/roles/expiry.
- **M02.6 — Organization settings:** bounded MVP settings.
- **M02.7 — Adversarial tenancy verification:** Org A vs Org B vs unauthenticated direct API attempts.

## Required workflow per iteration

1. Recover repository/PR/CI/review state.
2. Confirm iteration acceptance criteria and dependencies.
3. Write/update design and plan where needed.
4. Use TDD/characterization tests.
5. Implement the smallest coherent capability.
6. Run focused tests, then broader verification.
7. Review from relevant P0/specialist lenses and fix findings.
8. Re-run fresh verification.
9. Commit/push coherently and update `CURRENT.md`.

## Milestone completion gate

Do not mark COMPLETE until the PRD exit condition above is met and final implementation, tests, review, CI, documentation and fresh verification all pass.
