# M11 — Enterprise Readiness

Status: **ACTIVE — M11.4 SAFE ORGANIZATION BRANDING**

## Goal
Deliver enterprise hardening as reviewable, evidence-backed capabilities while preserving tenant isolation, privacy, evidence integrity and human hiring authority.

## Authoritative PRD Milestone Definition
PRD §206 defines advanced audit logs, retention configuration, data deletion workflows, organization branding, security hardening, rate limiting, observability, incident tooling, SLA monitoring and access reviews as possible M11 capabilities. SSO/SAML is potential only if required.

## Dependencies
M00–M10 integrated. M10 merge `54444d49761b7eb089c1c6a30a27fdfd115cdd9e` passed post-merge CI #1084 / run `35928472870`.

## In Scope
Advanced audit logs, retention configuration, complete data-deletion workflows, safe organization branding, security hardening, rate limiting/abuse controls, observability, incident/SLA tooling and access reviews/support privileged-access controls. SSO/SAML remains conditional on durable product/market evidence.

## Out of Scope
Later milestones, speculative abstractions, autonomous hiring decisions, candidate ranking from technical/audit signals, secret storage in audit/observability data, arbitrary CSS/HTML/script branding, and SSO/SAML without the required evidence gate.

## Selected Design / Implementation Plan
- Design: `docs/superpowers/specs/2026-09-24-enterprise-readiness-design.md`
- Plan: `docs/superpowers/plans/2026-09-24-enterprise-readiness.md`
- Branch: `feat/enterprise-readiness`
- PR: #13 — `Build enterprise readiness controls` — OPEN / DRAFT.

## Acceptance Criteria
- PRD deliverables and exit criteria pass.
- All required iterations are complete or explicitly resolved.
- Relevant security/privacy/tenancy/accessibility/performance/AI-safety gates pass.
- 0 unresolved Critical or Important review findings.
- Traceability and feature state are reconciled.
- Exact-final-head CI is green.

## Tasks / Iterations
1. **VERIFIED** — M11.1 — Advanced immutable audit trail.
2. **VERIFIED** — M11.2 — Retention configuration.
3. **VERIFIED** — M11.3 — Complete repository deletion workflows: tenant-scoped internal candidate artifacts, rollback/idempotency, and removal of application-controlled Gemini Live session resumption; no provider-side deletion claim.
4. **ACTIVE** — M11.4 — Organization branding: safe logo/name/accent/welcome text; no CSS injection.
5. **PLANNED** — M11.5 — Security hardening + rate limits + abuse controls.
6. **PLANNED** — M11.6 — Platform observability + incident/SLA tooling.
7. **PLANNED** — M11.7 — Access reviews/support privileged-access controls.
8. **DECISION GATE** — M11.8 — SSO/SAML only when durable market/product evidence requires it.

## Current Design Boundary
M11.3 begins by inventorying persisted candidate artifacts and defining an explicit idempotent deletion state machine. Applicable transcript, assessment, evidence, audio and AI-trace data must be deleted or irreversibly detached tenant-safely; only minimum non-sensitive audit tombstones may remain. Retries/partial failure must fail closed and historical integrity must not be fabricated.

## TDD Evidence
- M11.1 RED/GREEN chain is complete through exact-head CI #1093 on `d2892d16a6511c79b3b630d8c2949cbb66e1efbe`.
- M11.2 domain RED `3cf05460d3b65b833a1540078c04fc213931f860`; domain GREEN `7ae12445f4c2c9aa219f064c23d06319b59bafa9` passed CI #1095.
- M11.2 persistence/mutation/audit RED `5c086b3f4ce91c251dd07f3b307164814c658514`; GREEN `33054e2c0f20850e37df22171cfd366e99aebb77` passed CI #1097.
- M11.2 effective-policy RED `7d4b2eb5b4f1dfd889cc10d836f4ead68e7734a3`; GREEN `91a19c3274b77f77d5ac6f701984f2ecc746d314` passed exact-head CI #1099 / run `36006380119`.
- M11.3 domain RED `c9bb5b0...` / CI #1102, domain implementation `b388936...`.
- M11.3 candidate-row persistence RED `2afcd90...` / #1105; narrow GREEN `4050e110...` / full #1106.
- M11.3 artifact-chain RED `f3ec33f...` / #1107; expanded assessment-trigger RED `66fe1a7...` / #1109 (14/15 expected failures).
- M11.3 internal FK-ordered SQL erasure GREEN `be3b96a...` / full exact-head CI #1110, including database/build/E2E/coverage.
- M11.3 unforeseen-FK atomic rollback regression `fdd2f54...` / CI #1111 pending when written.

## Integration Test Evidence
M11.1 append-only audit persistence/RLS and bounded organization-scoped reads are verified. M11.2 tenant-scoped retention persistence, owner/admin mutation authorization, reviewer denial, database bounds, immutable policy-change audit evidence and RLS tests are verified. M11.3 database artifact-chain erasure is GREEN at exact-head CI #1110; rollback adversarial regression at #1111 awaited when this note was written. External artifacts remain subject to separate applicability verification.

## Integration / E2E Evidence
M11.1/M11.2 have no required new UI boundary. Database/security integration is verified through exact-head CI. M11.3 will require tenant/RLS, retry/partial-failure and historical-integrity coverage before completion.

## Security Review
M11.1/M11.2 preserve tenant isolation and explicit bounded data handling; audit metadata excludes secret-like/free-form sensitive payloads, retention has no invented legal default, and retention mutation is owner/admin-authorized. M11.3 must not allow cross-tenant deletion, silent partial success, or deletion of required minimal audit integrity records.

## Security / Privacy Review
Preserve tenant isolation, privacy minimization, immutable provenance, anti-fabrication and human hiring authority throughout M11. Candidate deletion should minimize retained personal data while keeping only non-sensitive integrity tombstones where required.

## Accessibility / Performance Review
No UI boundary exists yet for M11.1/M11.2. Audit reads are bounded/paginated. Deletion work must be bounded/idempotent and safe to retry; any later UI must meet keyboard/semantic/status requirements.

## AI / Eval Review
AI traces and assessment artifacts follow retention/deletion/access/observability policy without leaking prompts, secrets or PII unnecessarily. Technical failures never become candidate scoring evidence.

## Code Review Findings
Unresolved Critical: 0 known. Unresolved Important: 0 known. Unresolved PR review threads: 0 at latest recovery.

## Fresh Verification
Per unit: focused tests then repository quality gate as applicable. Milestone closeout requires lint, typecheck, tests, database/security checks, build, E2E, autonomous-framework verification, PRD coverage, exact-final-head CI.

## Fresh Verification Results
Exact head `91a19c3274b77f77d5ac6f701984f2ecc746d314` passed CI #1099 / run `36006380119`, completing M11.2 effective configured retention calculation. PR #13 remained open/draft/mergeable with no unresolved review threads at recovery.

## Durable Recovery Sources
`AGENTS.md` → `docs/AUTONOMOUS-DEVELOPMENT.md` → `docs/progress/STATUS.md` → known issues → this ledger → PRD/traceability → selected spec/plan → active PR/reviews/exact-head CI → source/tests.

## Exact Next Work
Extend the existing organization settings boundary with a genuine M11.4 RED for bounded branding metadata (logo URL, accent color, welcome text), then implement the minimal safe validation/persistence path with owner/admin authorization and no arbitrary CSS/HTML/script execution.

## Completion Checklist
- [ ] Requirements and iterations accounted for.
- [ ] Acceptance criteria verified.
- [ ] Required TDD/integration/E2E evidence recorded.
- [ ] Security/accessibility/performance/AI-eval reviews complete where relevant.
- [ ] 0 Critical / 0 Important findings.
- [ ] Traceability/feature matrix reconciled.
- [ ] Exact-final-head CI green.
- [ ] Durable status/closeout state current.

## Next Milestone
M12 — Integrations.

## Reconciliation — 2026-09-28
- Full run #1110 https://github.com/salman0butt/hire-evidence/actions/runs/36463309265 passed lint/typecheck/unit/framework/requirements checks, pgTAP database boundary, build, E2E, and PRD coverage at `be3b96a3d277668ffa95c61027c8b0626a1bb077`.
- Security review: preserved owner/admin authorization, restricted function execution and receipt table, tenant-scoped candidate selection, parent lock, database transactional rollback, one digest receipt and minimal audit event. Database deletion does not rewrite immutable assessment history; it explicitly erases source and versions only under authorized deletion. External service traces/audio have NOT been verified erased.
- Additional pgTAP unexpected restrictive-FK test at `fdd2f54e8e286ed64cb1c38581457c9ef1c88203` requires its own final CI #1111 verification. Do not treat #1110 as verifying the newer test.
- Independent reviewer was not available in this tool session; closeout review remains open. No merge while remaining M11 iterations are incomplete.

## M11.3 Closeout — 2026-09-30
- CI #1111 for `fdd2f54...` finished CANCELLED and is not standalone GREEN evidence; the rollback regression is included in later full CI #1118 at `dabe4721675395d421f023a46ca4b73ae56a82da`.
- Full CI #1118 passed lint, typecheck, unit/component, framework/source checks, database boundary including unexpected-FK rollback, build, E2E and PRD coverage.
- Application-controlled Gemini Live session resumption was removed from transport setup and ephemeral token constraints before #1118. The app does not claim provider-side deletion or deployment-wide zero retention; project/account-level provider settings remain operational owner evidence.
- Skeptical closeout review found 0 Critical and 0 Important repository findings. The domain lifecycle can represent audio/trace counts but is not itself evidence of provider deletion; this is a non-blocking scope note because the verified SQL path and docs make the boundary explicit.
