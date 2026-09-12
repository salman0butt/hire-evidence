# Requirements Traceability

This matrix tracks durable framework requirements plus active product capabilities. The canonical PRD remains the product source of truth.

| Requirement | Milestone | Implementation / evidence | Verification | Status |
|---|---|---|---|---|
| AUTO-001 — Git/GitHub durable execution memory | Product Foundation | recovery/control plane | framework CI | VERIFIED |
| AUTO-002 — Fresh recovery before writes | Active capabilities | autonomous policy | current run recovered Git/PR/review/CI/docs | VERIFIED |
| AUTO-003 — Evidence precedence | Active capabilities | stale docs reconciled to code/current CI | framework verifier | VERIFIED |
| AUTO-005 — Genuine RED→GREEN / root-cause debugging | Active capabilities | test-first capability history; failures debugged from exact logs/artifacts | M04 RED/GREEN chain + CI #505 root-cause fix → #506 PASS | VERIFIED |
| AUTO-006 — Critical/Important findings block completion | Active capabilities | skeptical milestone review | M04 closeout: 0 Critical / 0 Important | VERIFIED |
| AUTO-007 — Fresh exact-SHA CI | Active capabilities | GitHub Actions | M04 implementation head `8a6f6cc8…` CI #507 PASS; final doc-head CI pending | ACTIVE |
| AUTO-010 — Avoid duplicate concurrent work | Active capabilities | active PR reused and head rechecked before writes | no competing head observed during closeout writes | VERIFIED |
| PRD-195 — Product Foundation | Product Foundation | foundation + requirements control plane | PR #2 / CI #57 | VERIFIED |
| PRD-015/016/017/196 — SaaS shell/auth/profile | SaaS Shell + Auth | M01 implementation | PR #3; post-merge CI #157 | VERIFIED |
| PRD 8–14, 18–19, 197 — Organizations/RBAC | Organizations + RBAC | fixed roles, tenant RLS/RPCs, onboarding/team/invites/settings | PR #4; post-merge CI #232 | VERIFIED |
| PRD 20–41, 198 — Jobs + Interviewer Builder | Jobs + Interviewer Builder | jobs, competencies, rubrics, questions, deterministic plan, config, guardrails, publish/version, preview, accessible builder | PR #5; post-merge CI #432 | VERIFIED |
| M04-CANDIDATES — Tenant/job-scoped candidate records | Candidates + Invitations | normalized candidate persistence + role/RLS boundaries | unit/provider E2E | VERIFIED |
| M04-TOKEN — Opaque secure invitation tokens | Candidates + Invitations | 32 random bytes, base64url raw token, SHA-256 hash-only persistence | token tests + schema/provider E2E | VERIFIED |
| M04-BINDING — Invitation tenant/job/candidate/version integrity | Candidates + Invitations | composite constraints/RLS + immutable published interviewer-version binding | provider cross-tenant abuse tests | VERIFIED |
| M04-LIFECYCLE — Expiry/revocation/replay-safe lifecycle | Candidates + Invitations | authoritative monotonic lifecycle RPC + timestamps | migration tests + provider E2E | VERIFIED |
| M04-PUBLIC — Narrow candidate invitation access | Candidates + Invitations | server-side token hash + bounded public RPC/projection | resolver unit/security/provider tests | VERIFIED |
| M04-PREINTERVIEW — Candidate pre-interview page | Candidates + Invitations | company/role/duration/format/technical/privacy/prerequisite UI | component + browser E2E | VERIFIED |
| M04-CONSENT — AI/privacy disclosure and explicit consent evidence | Candidates + Invitations | AI/transcription/data-processing/retention copy + append-only versioned consent + start gate | unit/migration/provider/browser tests | VERIFIED |
| M04-SUPPORT — Accommodation/support path | Candidates + Invitations | owner/admin-configured support email/URL, candidate-facing support UI | component/settings/browser tests | VERIFIED |
| M04-CLOSEOUT — Security/accessibility/browser closeout | Candidates + Invitations | valid mobile flow + constant-shape unusable-token UI + keyboard/no-overflow | `e2e/candidate-invitation-ui.spec.ts`, CI #507 / `34691558117` | VERIFIED |
| PRD 42–57, 199 — Candidates + Invitations milestone | Candidates + Invitations | M04.1–M04.8 | implementation/review complete; final doc-head CI + merge/post-merge pending | ACTIVE |

## Active requirement interpretation

M00–M03 are integrated on `main`. M04 implementation, provider-backed security verification, candidate-facing accessibility/browser closeout, privacy/AI-safety review, and skeptical engineering review are complete on PR #6. The implementation head `8a6f6cc8adba2d39f2b255a74db166e3285527ba` passed the complete repository quality gate in CI #507 / `34691558117`. Durable closeout commits create a newer PR head, so the only remaining pre-merge requirement is fresh exact-final-head CI plus final head/review/concurrency/mergeability verification. Once merged and post-merge `main` is green, M05 — Realtime AI Interview becomes the active milestone.
