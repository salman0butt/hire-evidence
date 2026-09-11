# M02 Membership Management Evidence

Date: 2026-09-11

## Scope

Verified M02 Task 5: bounded organization membership role/removal management with database-enforced owner preservation.

## TDD / Debugging

- Migration invariant RED: `80506379e3a98c91086fa3031b1ceb0496b779e2` added failing expectations for narrow authenticated membership RPCs, owner/admin authorization, owner assignment rejection, immutable owner membership, and tenant-bound target membership state.
- Server-action RED: `35b83c953e860ec26dfc5fe6631ff30723dccd0d` added route-bound team mutation tests for bounded roles, forged organization IDs, malformed member IDs and bounded provider errors.
- Follow-up regression work corrected migration version uniqueness, client/server import boundaries, pure RBAC role validation, scoped UI assertions, and stale route state after successful mutations.
- Final Task 5 implementation head: `fa7a996d19d790e87fb7123cb0071910424ea3a9`.

## Security Evidence

`public.update_organization_member_role` and `public.remove_organization_member` are `SECURITY DEFINER` RPCs with an empty search path. They require an authenticated actor with owner/admin membership in the requested organization. Direct authenticated INSERT/UPDATE/DELETE grants on `organization_memberships` were not introduced.

Role update rejects `owner` assignment and refuses to mutate an existing owner membership. Removal refuses to delete an owner membership. Both RPCs select the target membership using both `organization_id` and `user_id`, so a forged tenant/member combination fails without becoming cross-tenant authority.

Application actions use the route-bound organization ID, not attacker-supplied organization form fields, require the trusted authenticated session, validate non-owner roles through the pure RBAC boundary, map database errors to bounded copy, and revalidate the team route after successful mutation.

## Review

Skeptical review perspectives: PRD compliance, correctness/edge cases, architecture/YAGNI, testing, tenant security, accessibility, performance, and hiring-AI safety.

- Critical findings: 0 unresolved.
- Important findings: 0 unresolved.
- Minor findings: none specific to Task 5 that block progress.
- PR #4 submitted reviews: 0.
- PR #4 unresolved review threads: 0.

No autonomous hiring decision behavior, sensitive-trait inference, fabricated candidate evidence, or AI-controlled authorization was added.

## Verification

Exact Task 5 implementation SHA `fa7a996d19d790e87fb7123cb0071910424ea3a9` passed GitHub Actions run `34594961808` / #190. Required CI covers frozen install, lint, typecheck, tests, autonomous-framework/source verification, local Supabase migrations, production build, Chromium E2E, PRD coverage and teardown.

The later documentation reconciliation head requires its own fresh exact-head CI before it can be treated as final run evidence.

## Remaining M02 Work

Task 6 secure organization invitations is next. Task 7 organization settings plus aggressive real Org A vs Org B vs unauthenticated isolation remains the milestone completion gate. PR #4 must remain draft/unmerged until those requirements and final review/CI gates are complete.
