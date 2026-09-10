# M00 — Product Foundation

## Authoritative PRD milestone definition

# 195. MILESTONE 00 — PRODUCT FOUNDATION

## Goal

Bootstrap repository and persistent project-management structure.

Deliver:

```text
Next.js project
TypeScript
lint
tests
CI
README
AGENTS.md
PRD
milestone system
architecture skeleton
env template

```

No major product UI yet.

Exit:

```text
repo builds
CI green
milestone recovery works

```

---

## Default iteration decomposition

- **M00.1 — Repository bootstrap:** Next.js, TypeScript, package manager, lint/format, environment validation.
- **M00.2 — Testing foundation:** unit/component/E2E test runners and conventions.
- **M00.3 — CI foundation:** lint, typecheck, tests, build, smoke E2E.
- **M00.4 — Governance docs:** README, AGENTS, PRD, architecture, security, AI docs.
- **M00.5 — Milestone recovery:** CURRENT.md, templates, scripts, verified fresh-session recovery.

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
