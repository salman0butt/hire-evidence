# Milestone Test Matrix

This is a **planned verification map**, not proof that a test has run. Actual results belong in the active milestone ledger, closeout evidence, PR checks, and exact-SHA CI.

Legend: **R** required by default, **C** conditional on feature surface, **—** normally not applicable. A milestone may require more coverage when its acceptance criteria demand it.

| Milestone | Unit/Component | Integration/API | E2E/Browser | Security/Authz | Accessibility | Performance | AI/Evals | Special |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| M00 Foundation | R | R | R | C | C | C | — | PRD/framework verifier |
| M01 SaaS/Auth | R | R | R | R | R | C | — | session/cookie recovery |
| M02 Organizations/RBAC | R | R | R | R | R | C | — | adversarial tenant/RLS |
| M03 Builder | R | R | R | R | R | C | C | immutable versioning/guardrails |
| M04 Candidate Invites | R | R | R | R | R | C | C | token expiry/revocation/consent |
| M05 Realtime Interview | R | R | R | R | R | R | R | mic/audio/reconnect/barge-in/failure |
| M06 Transcript | R | R | R | R | C | R | C | ordering/speaker/idempotency/reconnect |
| M07 Assessment | R | R | C | R | C | R | R | evidence validation/injection/golden fixtures |
| M08 Human Review | R | R | R | R | R | C | C | evidence deep links/override history |
| M09 Billing/Usage | R | R | R | R | R | R | — | webhook signature/idempotency/entitlements |
| M10 AI Quality/Evals | R | R | C | R | C | R | R | golden/adversarial/fairness/regression |
| M11 Enterprise | R | R | R | R | R | R | C | deletion/retention/audit/abuse/ops |
| M12 Integrations | R | R | C | R | C | R | C | mapping/idempotency/sync errors |
| M13 Coding Interview | R | R | R | R | R | R | R | sandbox quotas/network/fs/adversarial |
| M14 Advanced Formats | R | R | R | R | R | C | R | format-specific evidence/evals |
| M15 Compliance | R | R | R | R | R | C | R | current legal/security review/audit export |

## Universal Verification Rules

- RED → GREEN for meaningful behavioral changes where technically practical.
- Bug fixes receive regression tests where practical.
- Authorization and tenant isolation are tested directly, not inferred from UI behavior.
- Technical/platform failures must not count against a candidate.
- AI outputs require deterministic validation, grounding and failure-mode/eval coverage where applicable.
- UI completion requires loading, empty, error, validation, keyboard, responsive and assistive-technology checks where relevant.
- Exact-final-head CI is required; an older green SHA is not evidence for newer changes.
