# M12 — Integrations

## Authoritative PRD milestone definition

# 207. MILESTONE 12 — INTEGRATIONS

Only after core product works.

Potential:

```text
Greenhouse
Lever
Ashby
Workable
generic webhooks
public API
CSV import

```

One integration at a time.

---

## Default iteration decomposition

- **M12.1 — Stable integration boundary:** outbound webhooks/public API contracts only if core domain is ready.
- **M12.2 — CSV import:** bounded candidate import if prioritized.
- **M12.3+ — ATS integrations one at a time:** Greenhouse, Lever, Ashby, Workable according to customer demand.
- For each integration: auth, mapping, idempotency, sync errors, tenant scope, audit, tests and docs before beginning the next integration.

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
