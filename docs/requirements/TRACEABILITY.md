# Requirements Traceability

This matrix tracks durable framework requirements plus active product capabilities. The canonical PRD remains the product source of truth.

| Requirement | Milestone | Spec | Implementation | Tests | Verification | Status |
|---|---|---|---|---|---|---|
| AUTO-001 — Git/GitHub durable execution memory | Product Foundation | autonomous framework | recovery/control plane | framework tests | framework CI | VERIFIED |
| AUTO-002 — Fresh recovery before writes | Active capabilities | autonomous policy | fresh Git/PR/CI/doc recovery | recovery discipline | current run recovered live state | VERIFIED |
| AUTO-003 — Evidence precedence | Active capabilities | autonomous policy | stale docs reconciled to code/current CI | verifier tests | framework verifier | VERIFIED |
| AUTO-005 — Genuine RED→GREEN / root-cause debugging | Active capabilities | TDD/debugging policy | test-first capability history; exact failure diagnosis | unit/provider/browser | M04 RED/GREEN chain; CI #505 root-cause fix → #506 PASS | VERIFIED |
| AUTO-006 — Critical/Important findings block completion | Active capabilities | review policy | skeptical milestone review | review checks | M04 closeout: 0 Critical / 0 Important | VERIFIED |
| AUTO-007 — Fresh exact-SHA CI | Active capabilities | verification policy | GitHub Actions exact-head gate | complete quality gate | implementation `8a6f6cc8…` CI #507 PASS; repaired doc-head CI pending | ACTIVE |
| AUTO-010 — Avoid duplicate concurrent work | Active capabilities | concurrency policy | active PR reused; remote head checked before writes | head/CI checks | no competing head observed during closeout | VERIFIED |
| PRD-195 — Product Foundation | Product Foundation | foundation requirements | foundation + requirements control plane | foundation suites | PR #2 / CI #57 | VERIFIED |
| PRD-015/016/017/196 — SaaS shell/auth/profile | SaaS Shell + Auth | M01 spec/plan | M01 implementation | unit/E2E | PR #3; post-merge CI #157 | VERIFIED |
| PRD 8–14, 18–19, 197 — Organizations/RBAC | Organizations + RBAC | M02 spec/plan | fixed roles, tenant RLS/RPCs, onboarding/team/invites/settings | unit/provider/E2E | PR #4; post-merge CI #232 | VERIFIED |
| PRD 20–41, 198 — Jobs + Interviewer Builder | Jobs + Interviewer Builder | M03 spec/plan | jobs, competencies, rubrics, questions, deterministic plan, config, guardrails, publish/version, preview | unit/provider/browser | PR #5; post-merge CI #432 | VERIFIED |
| M04-CANDIDATES — Tenant/job-scoped candidate records | Candidates + Invitations | M04 design/plan | normalized candidate persistence + role/RLS boundaries | unit/provider E2E | provider isolation green | VERIFIED |
| M04-TOKEN — Opaque secure invitation tokens | Candidates + Invitations | M04 design/plan | 32 random bytes, base64url raw token, SHA-256 hash-only persistence | token/schema/provider tests | CI #447 RED → #448/#451 GREEN | VERIFIED |
| M04-BINDING — Invitation tenant/job/candidate/version integrity | Candidates + Invitations | M04 design/plan | composite constraints/RLS + immutable published-version binding | provider abuse tests | cross-tenant/direct-write denial green | VERIFIED |
| M04-LIFECYCLE — Expiry/revocation/replay-safe lifecycle | Candidates + Invitations | M04 design/plan | authoritative monotonic lifecycle RPC + timestamps | migration/provider E2E | CI #456 RED → #460 GREEN | VERIFIED |
| M04-PUBLIC — Narrow candidate invitation access | Candidates + Invitations | M04 design/plan | server-side token hash + bounded public RPC/projection | resolver/security/provider tests | CI #472 RED → #473 GREEN | VERIFIED |
| M04-PREINTERVIEW — Candidate pre-interview page | Candidates + Invitations | M04 design/plan | company/role/duration/format/technical/privacy/prerequisite UI | component/browser | CI #483 RED → #484 GREEN | VERIFIED |
| M04-CONSENT — AI/privacy disclosure and explicit consent evidence | Candidates + Invitations | M04 design/plan | AI/transcription/data-processing/retention copy + versioned append-only consent + start gate | unit/migration/provider/browser | implementation included in complete CI #507 | VERIFIED |
| M04-SUPPORT — Accommodation/support path | Candidates + Invitations | M04 design/plan | owner/admin support email/URL + candidate support UI | component/settings/browser | CI #505 diagnosed → #506 GREEN | VERIFIED |
| M04-CLOSEOUT — Security/accessibility/browser closeout | Candidates + Invitations | M04 design/plan | valid mobile flow + constant-shape unusable-token UI + keyboard/no-overflow | `candidate-invitation-ui.spec.ts` + full gate | CI #507 / `34691558117` PASS | VERIFIED |
| PRD 42–57, 199 — Candidates + Invitations milestone | Candidates + Invitations | M04 design/plan | M04.1–M04.8 | complete milestone suites | implementation/review complete; repaired final doc-head CI + merge/post-merge pending | ACTIVE |

## Active requirement interpretation

M00–M03 are integrated on `main`. M04 implementation, provider-backed security verification, candidate-facing accessibility/browser closeout, privacy/AI-safety review, and skeptical engineering review are complete on PR #6. Implementation head `8a6f6cc8adba2d39f2b255a74db166e3285527ba` passed the complete repository quality gate in CI #507 / `34691558117`. Documentation CI #514 correctly caught a closeout-doc regression: the M04 ledger had lost mandatory framework section markers and this table had lost mandatory `Spec`/`Tests` columns. Those documentation-only defects are being repaired; fresh exact-head CI remains the only pre-merge evidence gate, followed by final head/review/concurrency/mergeability verification. After M04 merges and post-merge `main` is green, M05 — Realtime AI Interview becomes active.
