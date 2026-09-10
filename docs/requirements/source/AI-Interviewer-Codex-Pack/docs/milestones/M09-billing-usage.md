# M09 — Billing + Usage

## Authoritative PRD milestone definition

# 204. MILESTONE 09 — BILLING + USAGE

Deliver:

```text
organization subscription
Stripe
plans
interview-minute usage
server-side enforcement
usage meter
checkout
portal
cancellation
webhooks

```

Exit:

organizations pay and limits are enforceable server-side.

---

## Default iteration decomposition

- **M09.1 — Plan configuration:** simple organization plans/limits.
- **M09.2 — Subscription persistence:** organization billing state.
- **M09.3 — Stripe customer + checkout:** authorized organization roles only.
- **M09.4 — Webhook synchronization:** signature validation and idempotent state updates.
- **M09.5 — Billing portal + cancellation/plan changes.**
- **M09.6 — Server-authoritative usage:** interview seconds as source unit.
- **M09.7 — Usage periods/meter:** current allowance, remaining and renewal.
- **M09.8 — Server-side enforcement:** limits/entitlements cannot be bypassed by client.
- **M09.9 — Billing security/idempotency E2E:** duplicate finalization/webhooks and authorization.

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
