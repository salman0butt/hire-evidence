# M01 — SaaS Shell + Auth

## Authoritative PRD milestone definition

# 196. MILESTONE 01 — SAAS SHELL + AUTH

Deliver:

```text
premium homepage
pricing placeholder/config
signup
login
verification
forgot/reset password
authenticated shell
secure sessions
basic profile

```

Also:

```text
SEO
responsive design
accessibility

```

Exit:

authenticated user can enter SaaS app.

---

## Default iteration decomposition

- **M01.1 — Marketing shell:** premium homepage, responsive layout, SEO baseline.
- **M01.2 — Supabase auth infrastructure:** clients, cookies/session boundaries, env/config.
- **M01.3 — Core auth flows:** signup, login, logout, verification.
- **M01.4 — Recovery flows:** forgot/reset password and error states.
- **M01.5 — Authenticated app shell:** protected routing/navigation.
- **M01.6 — Basic profile:** minimum profile persistence/settings.
- **M01.7 — Accessibility + E2E:** keyboard, mobile, visual/auth scenarios.

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
