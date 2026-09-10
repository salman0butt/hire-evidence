# M13 — Coding Interview

## Authoritative PRD milestone definition

# 208. MILESTONE 13 — CODING INTERVIEW

Separate future milestone.

Potential:

```text
Monaco editor
sandbox
test execution
coding prompt
AI follow-ups
code snapshot
evidence-based evaluation

```

Security-sensitive.

Use isolated execution environment.

---

## Default iteration decomposition

- **M13.1 — Security/threat model:** isolated execution requirements before coding.
- **M13.2 — Editor experience:** Monaco and prompt/context model.
- **M13.3 — Sandboxed execution service:** strict isolation, quotas, network/filesystem policy.
- **M13.4 — Test execution/results.**
- **M13.5 — Code snapshots/versioning.**
- **M13.6 — AI interview follow-ups around code without leaking solutions.**
- **M13.7 — Evidence-based coding assessment.**
- **M13.8 — Adversarial sandbox/security/E2E verification.**

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
