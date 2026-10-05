# M11 — Enterprise Readiness

Status: **ACTIVE — M11.5 SECURITY HARDENING / RATE LIMITS / ABUSE CONTROLS**

## Goal
Deliver enterprise hardening as reviewable, evidence-backed capabilities while preserving tenant isolation, privacy, evidence integrity and sole human hiring authority.

## Authoritative PRD Milestone Definition
PRD §206 covers advanced audit logs, retention configuration, data deletion workflows, organization branding, security hardening, rate limiting, observability, incident/SLA tooling and access reviews. SSO/SAML is conditional on durable product/market evidence.

## Dependencies
M00–M10 are integrated. Base/main `54444d49761b7eb089c1c6a30a27fdfd115cdd9e` passed post-merge CI #1084. M11 work remains on `feat/enterprise-readiness`, PR #13 OPEN / DRAFT.

## In Scope
Advanced audit, explicit retention, complete repository candidate deletion, safe organization branding, exposed-route security hardening, server-authoritative rate/abuse controls, observability/incident/SLA tooling, and privileged support/access review controls. SSO/SAML is a conditional decision gate.

## Out of Scope
Autonomous hire/reject/ranking, technical-failure scoring, secret or unnecessary PII storage in operational controls, arbitrary CSS/HTML/script branding, fabricated deletion/provider-retention claims, and SSO/SAML without durable evidence.

## Acceptance Criteria
- PRD deliverables/exit criteria for required M11 capabilities are satisfied or explicitly resolved.
- All behavioral units have genuine RED→GREEN evidence; invalid infrastructure/fixture failures are recorded as NOT RED/NOT GREEN.
- Relevant tenancy/RLS, security, privacy, accessibility, performance and AI-safety gates pass.
- 0 unresolved Critical or Important review findings and 0 blocking review threads.
- Durable status, feature matrix and traceability are current.
- Exact-final-head full CI is GREEN before merge.

## Tasks / Iterations
1. **VERIFIED** — M11.1 advanced immutable audit trail, CI #1093.
2. **VERIFIED** — M11.2 retention configuration, CI #1099.
3. **VERIFIED** — M11.3 repository deletion workflows, full CI #1118. Internal erasure/rollback/idempotency and removal of application-controlled Gemini Live session resumption are covered; provider-side deletion/deployment-wide zero retention are not claimed.
4. **VERIFIED** — M11.4 safe organization branding. Candidate-facing inert rendering RED #1138 → full exact-head GREEN #1139 at `0c63e11f711114fbd7975cb66ade947077e2e61a`.
5. **ACTIVE** — M11.5 security hardening / rate limits / abuse controls.
   - Provider credential mint limiter — VERIFIED through full CI #1155 at `baea4c5f22934cb5cbe20a76e02b9867611e8636`.
   - Technical-event ingestion limiter — ACTIVE TDD unit; first CI #1162 is INVALID NOT RED because framework verification failed before pgTAP.
6. **PLANNED** — M11.6 observability / incident / SLA tooling.
7. **PLANNED** — M11.7 privileged support / access reviews.
8. **DECISION GATE** — M11.8 SSO/SAML only if durable evidence requires it.

## Current Design Boundary
M11.5 prioritizes public/exposed candidate routes that can consume provider or storage resources. Controls must be server-authoritative, bounded, safe across multiple app instances, capability/attempt scoped, privacy-minimized, and operational only. Candidate technical failures and rate-limit denials must never become assessment evidence, scores, rankings, recommendations, or hiring decisions. Quota time must be server-owned rather than client-supplied.

## TDD Evidence
### Provider credential mint limiter
- #1143 — INVALID NOT RED: dependency seam missing at compile time.
- `bd409d6...` / #1144 — genuine behavioral RED: repeated request remained authorized.
- `47e693e...` / #1145 — TypeScript authorization-boundary GREEN.
- `5565227...` / #1153 — INVALID NOT RED: pgTAP fixture referenced nonexistent `jobs.status`; zero assertions ran.
- `3967c8238463dd50bfe2f6b3581cfa47435492a1` / #1154 (`37284199626`) — genuine database RED: missing `consume_realtime_credential_mint(text, uuid)`.
- `baea4c5f22934cb5cbe20a76e02b9867611e8636` / #1155 (`37284892083`) — full exact-head GREEN: frozen install, lint, typecheck, 766 unit/component tests, framework/source verifiers, database boundary, build, Chromium/E2E, PRD coverage and cleanup all passed.

### Technical-event limiter
- `e2d2d9fbf984b1c9179912a3d3e1ff5d1ba4806e` / CI #1162 — INVALID NOT RED. The new burst pgTAP test was present and unit tests passed, but `scripts/verify_autonomous_framework.py` failed first because required milestone/status recovery markers were removed during documentation reconciliation. Database tests were skipped; no behavioral RED claim is allowed.

## Integration Test Evidence
M11.1 audit persistence/RLS, M11.2 retention persistence/authorization/audit, M11.3 tenant-scoped deletion/rollback, M11.4 branding persistence/rendering, and M11.5 provider credential mint persistence are covered by their exact-head CI evidence. The credential limiter validates hashed capability + active authoritative attempt/invitation, serializes consumption with an attempt-row lock, and enforces two mints per one-minute server-time window. Technical-event rate limiting is not implemented yet.

## Security Review
Credential limiter review found no known Critical/Important findings: raw tokens are hashed before the DB boundary; direct operational table access is revoked with RLS enabled; attempt/invitation state is authoritative; row locking prevents multi-instance count/insert races; stale mint-window rows are minimized; denial is constant-safe and never scoring/evidence input. Technical-event limiter must preserve the same capability/attempt authorization and use server-time quota accounting.

## Code Review Findings
Unresolved Critical: 0 known.
Unresolved Important: 0 known.
Unresolved PR review threads: 0 at latest recovery.
PR #13 had 0 submitted reviews at latest recovery. Independent milestone closeout review remains required before merge.

## Fresh Verification Results
- M11.4 latest verified full gate: #1139 at `0c63e11...`.
- M11.5 provider credential limiter: full exact-head CI #1155 / `37284892083` GREEN at `baea4c5f22934cb5cbe20a76e02b9867611e8636`.
- Technical-event test head `e2d2d9f...` / #1162 is INVALID NOT RED because framework verification failed before database tests. Documentation markers are being repaired without modifying the test.

## Durable Recovery Sources
`AGENTS.md` → `docs/AUTONOMOUS-DEVELOPMENT.md` → live Git/PR/exact-head CI → source/tests → `docs/progress/STATUS.md` → `docs/milestones/CURRENT.md` → this ledger → traceability/feature matrix → design/plan → older handoffs/chat.

## Exact Next Work
Restore the required autonomous-framework documentation markers, then rerun the unchanged `supabase/tests/realtime_technical_event_rate_limit_test.sql`. Accept RED only if pgTAP reaches the intended assertion that a 13th same-attempt event is rejected despite manipulated client `occurredAt`. Then implement the minimal server-authoritative GREEN and continue M11.5.

## Completion Checklist
- [ ] All required M11 iterations complete/resolved.
- [ ] Acceptance criteria verified.
- [ ] Required TDD/integration/E2E evidence recorded.
- [ ] Security/accessibility/performance/AI-safety reviews complete where relevant.
- [ ] 0 Critical / 0 Important findings.
- [ ] Traceability/feature matrix reconciled.
- [ ] Exact-final-head CI GREEN.
- [ ] PR #13 stable/mergeable and all merge gates satisfied.

## Next Milestone
M12 — Integrations, only after M11 is legitimately merged and post-merge `main` CI passes.