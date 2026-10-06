# M11 — Enterprise Readiness

Status: **ACTIVE — M11.7 PRIVILEGED SUPPORT / ACCESS REVIEWS**

## Goal
Deliver enterprise hardening as reviewable, evidence-backed capabilities while preserving tenant isolation, privacy, evidence integrity and sole human hiring authority.

## Authoritative PRD Milestone Definition
PRD §206 covers advanced audit logs, retention configuration, data deletion workflows, organization branding, security hardening, rate limiting, observability, incident/SLA tooling and access reviews. SSO/SAML is conditional on durable product/market evidence.

## Dependencies
M00–M10 are integrated. Base/main `54444d49761b7eb089c1c6a30a27fdfd115cdd9e` passed post-merge CI #1084. M11 work remains on `feat/enterprise-readiness`, PR #13 OPEN / DRAFT.

## In Scope
Advanced audit, explicit retention, repository candidate deletion, safe organization branding, exposed-route security hardening, server-authoritative rate/abuse controls, privacy-minimized observability, incident/SLA tooling and privileged support/access-review controls. SSO/SAML is a conditional decision gate.

## Out of Scope
Autonomous hire/reject/ranking, technical-failure scoring, secret or unnecessary PII storage in operational controls, arbitrary CSS/HTML/script branding, fabricated deletion/provider-retention claims, invented contractual SLA promises, and SSO/SAML without durable evidence.

## Acceptance Criteria
- Required PRD M11 capabilities are implemented or explicitly resolved.
- Behavioral changes have genuine RED→GREEN evidence; infrastructure/fixture failures are recorded as NOT RED/NOT GREEN.
- Relevant tenancy/RLS, security, privacy, accessibility, performance and AI-safety gates pass.
- Observability cannot become a shadow candidate-evidence store or candidate scoring signal.
- 0 unresolved Critical or Important review findings and 0 blocking review threads.
- Durable status, feature matrix and traceability are current.
- Exact-final-head full CI is GREEN before merge.

## Tasks / Iterations
1. **VERIFIED** — M11.1 advanced immutable audit trail, CI #1093.
2. **VERIFIED** — M11.2 retention configuration, CI #1099.
3. **VERIFIED** — M11.3 repository deletion workflows, full CI #1118. Provider-side deletion/deployment-wide zero retention are not claimed.
4. **VERIFIED** — M11.4 safe organization branding, full CI #1139.
5. **VERIFIED** — M11.5 security hardening / rate limits / abuse controls, full closeout CI #1169.
6. **VERIFIED** — M11.6 platform observability / incident / SLA tooling.
   - Structured privacy-safe operational-signal contract — VERIFIED, #1176.
   - Bounded persistence/retention and client-role lock-down — VERIFIED, #1179.
   - Deterministic incident-health projection — VERIFIED, #1182.
   - Non-contractual service-level measurement and M11.6 closeout — VERIFIED, full exact-head CI #1191.
7. **ACTIVE** — M11.7 privileged support / access reviews.
8. **DECISION GATE** — M11.8 SSO/SAML only if durable evidence requires it.

## Current Design Boundary
M11.6 observability is platform-operational only. Signals use bounded structured request/correlation/service/status/latency/error-code data, exclude secrets and candidate-sensitive free-form content, use bounded persistence, and project incident health without request/correlation/candidate identifiers. Incident and technical-failure data never become assessment evidence, scores, rankings, recommendations or hiring decisions. SLA monitoring must measure operational behavior without inventing a contractual service-level promise absent product evidence.

## TDD Evidence
### M11.5 abuse-control closeout
- Provider credential mint limiter — genuine database RED #1154; full exact-head GREEN #1155.
- Technical-event ingestion limiter — genuine database RED #1164; full exact-head GREEN #1166.
- Finalization retry write-amplification — #1167 INVALID NOT RED, #1168 genuine retry RED, full exact-head GREEN #1169 at `da95e4acc65624ed5ae02bf783e819430280d557`.

### M11.6 structured operational-signal contract
- `0f3b7721a5fa06c8a910c4be9cad7820b4535d85` / CI #1175 — genuine behavioral RED: unsafe free-form fields and invalid bounded fields were accepted.
- `07166058183daa1fa021b870ea640903d23f721c` / CI #1176 — full exact-head GREEN for strict allow-list validation and immutable normalized output.

### M11.6 bounded persistence
- `7ee4bdf616169570e254b1d07aceac84138d1699` / CI #1177 — genuine database RED for missing persistence/server-only ingestion/cleanup boundary.
- `46a649d3d69bd05c573f127238c9e6f9c3d73401` / CI #1178 — NOT GREEN: client API roles retained RPC execute permission.
- `0e1c8dee4191fe62e7a0c6d12f939f2a9dc8b6fb` / CI #1179 — full exact-head GREEN after explicit client-role revocation while retaining service-role-only ingestion/purge and 30-day expiry.

### M11.6 incident-health projection
- CI #1181 attempt 1 — INVALID NOT RED; runner job cancelled before tests executed.
- `bf45d9b21026c55b2246749501606216281c92f0` / CI #1181 attempt 2 — genuine RED: 770 existing tests passed and only the two new projection assertions failed against the deliberate zero-value seam.
- `bb1f803fb98cb489fe170322b52f45999d215627` / CI #1182 — full exact-head GREEN: deterministic total/error/degraded counts, maximum latency, unique sorted error codes and healthy/incident state without identifier leakage.

## Integration Test Evidence
M11.1–M11.5 integration evidence is preserved by their exact-head CI runs. M11.6 persistence is protected by `supabase/tests/operational_signals_test.sql`, including no anon/authenticated direct reads/inserts or ingestion RPC execution. CI #1179 and later #1182 prove the database boundary together with the application contract. CI #1182 also passed build, Chromium E2E and PRD coverage.

## Security Review
M11.6 review at `bb1f803f…` found 0 known Critical and 0 known Important findings. Operational payloads are strict and bounded; arbitrary transcript/resume/candidate/free-form payloads are rejected; persisted operational data is RLS-protected and client roles cannot invoke platform RPCs; retention is bounded; incident projection emits aggregates only. No signal feeds hiring evidence or scoring.

## Code Review Findings
Unresolved Critical: 0 known.
Unresolved Important: 0 known.
Unresolved PR review threads: 0 at latest recovery.
PR #13 has 0 submitted reviews. Independent milestone closeout review remains required before merge.

## Fresh Verification Results
- M11.5 closeout: full exact-head CI #1169 at `da95e4acc65624ed5ae02bf783e819430280d557` GREEN.
- M11.6 validation contract: CI #1176 at `07166058183daa1fa021b870ea640903d23f721c` GREEN.
- M11.6 persistence authorization: CI #1179 at `0e1c8dee4191fe62e7a0c6d12f939f2a9dc8b6fb` GREEN.
- M11.6 incident-health projection: CI #1182 at `bb1f803fb98cb489fe170322b52f45999d215627` GREEN.

## Durable Recovery Sources
`AGENTS.md` → `docs/AUTONOMOUS-DEVELOPMENT.md` → live Git/PR/exact-head CI → source/tests → `docs/progress/STATUS.md` → `docs/milestones/CURRENT.md` → this ledger → traceability/feature matrix → design/plan → older handoffs/chat.

### M11.6 service-level measurement
- `2d52a66b...` / #1188 — INVALID NOT RED; TypeScript failed before the intended behavior assertion.
- `7404a9f01dfde9329f249a55a48a55bcdfe98afd` / #1189 — genuine behavioral RED; lint/typecheck passed, 781 existing tests passed, only two new service-level assertions failed.
- `a63350413c0d9214bea0f67810b2ba0edb8d5b0b` / #1190 — NOT GREEN; new behavior passed but old exact-object projection tests required explicit extension.
- `84c311e1a2a85ff291251f0ccdb8cb0d05f49bb8` / #1191 — full exact-head GREEN across unit/component, framework/source verification, database, build, Chromium E2E and PRD coverage.
- Measurement exposes observed counts/rates only; empty windows return null rates and no contractual SLA target is represented.

## Exact Next Work
Begin M11.7 with a narrow privileged-support access domain contract before persistence: least privilege, explicit reason and bounded expiry where applicable, attributable actor/organization identity, auditable lifecycle and fail-closed cross-tenant behavior. Use strict TDD and preserve sole human hiring authority.

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