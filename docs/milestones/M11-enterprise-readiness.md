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
- Behavioral changes have genuine RED→GREEN evidence; infrastructure/fixture/typecheck failures are recorded as NOT RED/NOT GREEN.
- Relevant tenancy/RLS, security, privacy, accessibility, performance and AI-safety gates pass.
- Observability/support controls cannot become a shadow candidate-evidence store or candidate scoring signal.
- 0 unresolved Critical or Important review findings and 0 blocking review threads.
- Durable status, feature matrix and traceability are current.
- Exact-final-head full CI is GREEN before merge.

## Tasks / Iterations
1. **VERIFIED** — M11.1 advanced immutable audit trail, CI #1093.
2. **VERIFIED** — M11.2 retention configuration, CI #1099.
3. **VERIFIED** — M11.3 repository deletion workflows, full CI #1118. Provider-side deletion/deployment-wide zero retention are not claimed.
4. **VERIFIED** — M11.4 safe organization branding, full CI #1139.
5. **VERIFIED** — M11.5 security hardening / rate limits / abuse controls, full closeout CI #1169.
6. **VERIFIED** — M11.6 platform observability / incident / SLA tooling, full closeout CI #1191.
7. **ACTIVE** — M11.7 privileged support / access reviews.
   - Domain and persisted least-privilege/lifetime safeguards are verified through #1206.
   - Audited owner/admin grant lifecycle was verified before the revocation unit.
   - Audited owner/admin revocation is VERIFIED by genuine RED #1217 at `51fa2dbaf1e810bb7231f6b85c498d8827dcf2cc` → full exact-head GREEN #1218 at `845d8e556c34061912dba3110aa30b25cef05396`.
   - Safe access-review projection with owner/admin same-tenant authorization and cross-tenant denial remains.
8. **DECISION GATE** — M11.8 SSO/SAML only if durable evidence requires it.

## Current Design Boundary
M11.7 support access is operational only. The only permitted scope is `read_incident_health`; grants require attributable organization/actor/reason identity and a positive lifetime no longer than one hour. Direct anon/authenticated table access remains revoked. Lifecycle RPCs use server-authoritative timestamps, same-tenant owner/admin authorization, immutable audit evidence, and fail-closed cross-tenant behavior. Support controls must never expose or mutate candidate evidence, scores, rankings, recommendations, or hiring decisions.

## TDD Evidence
### M11.5 abuse-control closeout
- Provider credential mint limiter — genuine database RED #1154; full exact-head GREEN #1155.
- Technical-event ingestion limiter — genuine database RED #1164; full exact-head GREEN #1166.
- Finalization retry write-amplification — #1167 INVALID NOT RED, #1168 genuine retry RED, full exact-head GREEN #1169 at `da95e4acc65624ed5ae02bf783e819430280d557`.

### M11.6 closeout
- Structured operational signals: genuine behavioral RED #1175 → full exact-head GREEN #1176.
- Bounded persistence: genuine database RED #1177; #1178 NOT GREEN due client RPC execute grants; full exact-head GREEN #1179.
- Incident-health projection: #1181 attempt 1 INVALID NOT RED; attempt 2 genuine behavioral RED; full exact-head GREEN #1182.
- Service-level measurement: #1188 INVALID NOT RED; #1189 genuine behavioral RED; #1190 NOT GREEN due exact-object contract extension; full exact-head GREEN #1191.

### M11.7 privileged support domain
- `e6c3ea882f9ee8c596a754ddccceb1a49d8c7ccd` / CI #1193, `09068fee01c728ac3afe3caeedba83b0425b7bbf` / CI #1194, and `45d4f71734a955d6f9714662eafd2ab66201f16c` / CI #1195 are INVALID NOT RED because TypeScript failed before the intended support-access behavior executed.
- `fafb99074f026cdbad917e8a2c9b3a9832b5714f` / CI #1196 GREEN established the immutable attributable domain contract. No genuine pre-implementation domain RED exists; this limitation is recorded rather than fabricated.

### M11.7 persisted least-privilege boundary
- `9f6e3bdc12f7c0b9d50842840e010ff9e14ac561` / CI #1197 genuine database RED: `support_access_grants` was absent while earlier gates passed.
- By `8732fe7041515ec25170bedd9848880380ebe086` / CI #1202 full exact-head GREEN, the table was RLS-protected from client roles, fixed to `read_incident_health`, and required a nonblank reason.

### M11.7 database lifetime enforcement
- `42376df4e06c321739cefed2d5060155fe7c677f` / CI #1203 INVALID NOT RED: malformed pgTAP dollar quoting caused syntax failure before lifetime assertions ran.
- `85933a3a0075227637ffb61d54d7a1fd5d418890` / CI #1204 genuine database RED: earlier gates passed and only zero-duration and >1-hour grant assertions failed.
- `48287ffe823ae7aaf5847967afe0ecac7bbfc613` / CI #1205 full exact-head GREEN after adding the positive <=1-hour database constraint.
- Skeptical review found an Important missing positive boundary test. `32d54c5f5b4067b3fb2de5d9c717997d01f404b5` / CI #1206 full exact-head GREEN proved exactly one hour remains allowed and resolved the finding.

### M11.7 audited revocation
- `51fa2dbaf1e810bb7231f6b85c498d8827dcf2cc` / CI #1217 genuine database RED: lint, typecheck, 786 unit/component tests, framework/source verifiers and all earlier database tests passed; 10/13 revocation assertions then failed specifically because `revoke_support_access(uuid,uuid)` was absent.
- `845d8e556c34061912dba3110aa30b25cef05396` / CI #1218 full exact-head GREEN: owner/admin same-tenant revocation, reviewer denial, cross-tenant fail-closed behavior, server-authoritative `revoked_at`, idempotent transition, direct-client mutation denial and one immutable `support_access.revoked` audit event per actual transition all passed database/build/E2E/PRD coverage.
- Review: 0 known Critical and 0 known Important findings. Missing/cross-tenant/already-revoked grant IDs collapse to the same non-transition result, avoiding a cross-tenant existence oracle; free-form grant reason is not copied into immutable revocation audit metadata.

## Integration Test Evidence
M11.1–M11.6 integration evidence is preserved by their exact-head CI runs. M11.7 now includes `src/lib/support/support-access.test.ts`, `supabase/tests/support_access_grants_test.sql`, `support_access_lifecycle_test.sql`, and `support_access_revocation_test.sql`. Exact-head #1218 passed lint, typecheck, unit/component tests, framework/source verification, real local Supabase database boundaries, build, Chromium E2E and PRD coverage.

## Security Review
At revocation GREEN `845d8e556c34061912dba3110aa30b25cef05396`, 0 known Critical and 0 known Important findings remain. Support persistence has no anon/authenticated direct table privileges; grant/revoke lifecycle is owner/admin-authorized and tenant-bound; revocation is atomic/idempotent and auditable without duplicating free-form reason. The access-review projection remains required before M11.7 completion.

## Code Review Findings
Unresolved Critical: 0 known.
Unresolved Important: 0 known.
Unresolved PR review threads: 0 at latest verified recovery.
PR #13 had 0 submitted reviews at the latest verified recovery. Independent milestone closeout review remains required before merge.

## Fresh Verification Results
- M11.5 closeout: full exact-head CI #1169 at `da95e4acc65624ed5ae02bf783e819430280d557` GREEN.
- M11.6 closeout: full exact-head CI #1191 at `84c311e1a2a85ff291251f0ccdb8cb0d05f49bb8` GREEN.
- M11.7 persisted support foundation: genuine database RED #1197; baseline full exact-head GREEN #1202 at `8732fe7041515ec25170bedd9848880380ebe086`.
- M11.7 lifetime: #1203 INVALID NOT RED; #1204 genuine RED; full GREEN #1205; review-fix full exact-head GREEN #1206 at `32d54c5f5b4067b3fb2de5d9c717997d01f404b5`.
- M11.7 revocation: genuine RED #1217 at `51fa2dba...`; full exact-head GREEN #1218 at `845d8e55...`.

## Durable Recovery Sources
`AGENTS.md` → `docs/AUTONOMOUS-DEVELOPMENT.md` → live Git/PR/exact-head CI → source/tests → `docs/progress/STATUS.md` → `docs/milestones/CURRENT.md` → this ledger → traceability/feature matrix → design/plan → older handoffs/chat.

## Exact Next Work
Add the safe support access-review projection as a separate genuine database RED→GREEN unit. It must permit only same-tenant owners/admins to review bounded grant lifecycle/status data, deny reviewers and cross-tenant callers, preserve direct-table lock-down, and expose no candidate evidence, scores, rankings, recommendations or hiring-decision authority. Then resolve the M11.8 SSO/SAML evidence gate and perform milestone closeout.

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