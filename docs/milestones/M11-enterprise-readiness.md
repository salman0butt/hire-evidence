# M11 — Enterprise Readiness

Status: **CLOSEOUT — IMPLEMENTATION COMPLETE / FINAL LIVE GATES PENDING**

## Goal
Deliver enterprise hardening as reviewable, evidence-backed capabilities while preserving tenant isolation, privacy, evidence integrity and sole human hiring authority.

## Authoritative PRD Milestone Definition
PRD §206/source M11 covers advanced audit logs, retention configuration, data deletion workflows, organization branding, security hardening, rate limiting, observability, incident/SLA tooling and admin/support access reviews. SSO/SAML is only a potential conditional enterprise item “if required.”

## Dependencies
M00–M10 are integrated. Base/main `54444d49761b7eb089c1c6a30a27fdfd115cdd9e` passed post-merge CI #1084. M11 work remains on `feat/enterprise-readiness`, PR #13, until closeout/merge gates pass.

## In Scope
Advanced audit, explicit retention, repository candidate deletion, safe organization branding, exposed-route security hardening, server-authoritative rate/abuse controls, privacy-minimized observability, incident/SLA tooling and privileged support/access-review controls.

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
7. **VERIFIED** — M11.7 privileged support / access reviews, full implementation CI #1223.
8. **DEFERRED / DECISION RESOLVED** — M11.8 SSO/SAML. Authoritative source makes it conditional “if required”; no durable current product/customer evidence requires it. Reopen only when such evidence exists.

## Current Design Boundary
M11.7 support access is operational only. The only permitted scope is `read_incident_health`; grants require attributable organization/actor/reason identity and a positive lifetime no longer than one hour. Direct anon/authenticated table access remains revoked. Lifecycle RPCs use server-authoritative timestamps, same-tenant owner/admin authorization, immutable audit evidence and fail-closed cross-tenant behavior. The access-review projection is bounded, same-tenant owner/admin only and exposes lifecycle metadata only. Support controls must never expose or mutate candidate evidence, scores, rankings, recommendations or hiring decisions.

## TDD Evidence
### M11.5 abuse-control closeout
- Provider credential mint limiter — genuine database RED #1154; full exact-head GREEN #1155.
- Technical-event ingestion limiter — genuine database RED #1164; full exact-head GREEN #1166.
- Finalization retry write-amplification — #1167 INVALID NOT RED, #1168 genuine retry RED, full exact-head GREEN #1169.

### M11.6 closeout
- Structured operational signals: genuine behavioral RED #1175 → full exact-head GREEN #1176.
- Bounded persistence: genuine database RED #1177; #1178 NOT GREEN due client RPC execute grants; full exact-head GREEN #1179.
- Incident-health projection: #1181 attempt 1 INVALID NOT RED; attempt 2 genuine behavioral RED; full exact-head GREEN #1182.
- Service-level measurement: #1188 INVALID NOT RED; #1189 genuine behavioral RED; #1190 NOT GREEN; full exact-head GREEN #1191.

### M11.7 privileged support domain
- `e6c3ea882f9ee8c596a754ddccceb1a49d8c7ccd` / #1193, `09068fee01c728ac3afe3caeedba83b0425b7bbf` / #1194 and `45d4f71734a955d6f9714662eafd2ab66201f16c` / #1195 are INVALID NOT RED because TypeScript failed before intended support behavior.
- `fafb99074f026cdbad917e8a2c9b3a9832b5714f` / #1196 GREEN established the immutable attributable domain contract. No genuine pre-implementation domain RED is claimed.

### M11.7 persisted least-privilege boundary
- `9f6e3bdc12f7c0b9d50842840e010ff9e14ac561` / #1197 genuine DB RED: `support_access_grants` was absent while earlier gates passed.
- By `8732fe7041515ec25170bedd9848880380ebe086` / #1202 full exact-head GREEN, persistence was RLS/client-role locked down, scope fixed to `read_incident_health`, and nonblank reason required.

### M11.7 database lifetime enforcement
- `42376df4e06c321739cefed2d5060155fe7c677f` / #1203 INVALID NOT RED: malformed pgTAP quoting caused syntax failure before behavior.
- `85933a3a0075227637ffb61d54d7a1fd5d418890` / #1204 genuine DB RED for zero-duration and >1-hour grants.
- `48287ffe823ae7aaf5847967afe0ecac7bbfc613` / #1205 full GREEN after lifetime enforcement.
- Skeptical review found an Important missing positive boundary; `32d54c5f5b4067b3fb2de5d9c717997d01f404b5` / #1206 full GREEN proved exactly one hour is allowed and resolved it.

### M11.7 audited grant lifecycle
- `9a113f8501c5e5ed5a3e4220a406e067c42059ed` / #1214 genuine DB RED: all preceding gates passed; all 11 lifecycle assertions failed because `grant_support_access(...)` did not exist.
- `ef8b84307cd20f353f190d1b22ebb2f52d506423` / #1215 full exact-head GREEN: same-tenant owner/admin grant, reviewer/cross-tenant denial, fixed least-privilege scope, server-authoritative grant time, bounded expiry/reason and one immutable grant audit event per successful transition.

### M11.7 audited revocation
- `51fa2dbaf1e810bb7231f6b85c498d8827dcf2cc` / #1217 genuine DB RED: 10/13 assertions failed specifically because `revoke_support_access(uuid,uuid)` was absent; earlier gates passed.
- `845d8e556c34061912dba3110aa30b25cef05396` / #1218 full exact-head GREEN: owner/admin same-tenant revoke, reviewer/cross-tenant denial, server `revoked_at`, idempotency, direct-client mutation denial and one immutable revoke audit per actual transition.
- Review found 0 Critical/Important. Missing/cross-tenant/already-revoked grant IDs collapse to the same non-transition result, avoiding an existence oracle; free-form reason is not duplicated into revocation audit metadata.

### M11.7 access-review projection
- `02c38930094304a3d8c66bc734d4e03a3ef0e5f4` / #1220 INVALID NOT RED: intended missing-RPC errors appeared, but a temporary-table privilege fixture aborted the test.
- `913a2f8201a988b6392d02394e2be1ba78384279` / #1221 produced no RED evidence: superseded/cancelled before DB execution after finding a 16-vs-17 plan defect.
- `2cffabf35a5543d979726f07815adc1ea03628c0` / #1222 genuine DB RED: all 17 assertions executed; 16 failed only because `list_support_access_reviews(uuid,integer,integer)` was absent while earlier quality/database tests passed.
- `7d0ec19b81a3ba897e0df03ffe3b01ebbff6c13e` / #1223 full exact-head GREEN: same-tenant owner/admin review, reviewer/cross-tenant denial, page bound 1–100, active/expired/revoked status, deterministic ordering and direct-table denial all passed lint, typecheck, 786 unit/component tests, framework/source checks, DB boundaries, build, Chromium E2E and PRD coverage.
- Review: 0 known Critical/Important. Projection is lifecycle-only and has no candidate evidence/scoring/hiring-decision authority.

## M11.8 Decision Evidence
The authoritative source file `docs/requirements/source/AI-Interviewer-Codex-Pack/docs/milestones/M11-enterprise-readiness.md` lists the required M11 enterprise capabilities and separately describes SSO/SAML as a potential conditional item “if required.” Repository search/recovery found no durable current customer/product requirement making it required. The implementation plan directs workers to record DEFERRED when no such evidence exists. Decision: **DEFERRED / gate resolved**; do not implement speculatively.

## Integration / Review Evidence
M11.1–M11.6 integration evidence is preserved by their exact-head CI runs. M11.7 includes domain tests plus `support_access_grants_test.sql`, `support_access_lifecycle_test.sql`, `support_access_revocation_test.sql`, and `support_access_review_test.sql`. Implementation head #1223 passed the complete repository gate.

At implementation head `7d0ec19b...`: 0 known Critical findings, 0 known Important findings, 0 submitted PR reviews and 0 unresolved inline review threads. Security/privacy/YAGNI review found no remaining blocking issue. Existing external provider/deployment concerns remain documented and are not repository milestone blockers.

## Fresh Verification Results
- M11.5 closeout: full exact-head CI #1169 GREEN.
- M11.6 closeout: full exact-head CI #1191 GREEN.
- M11.7 domain/foundation/lifetime: #1196/#1202/#1205/#1206 GREEN with invalid historical checkpoints explicitly preserved.
- M11.7 grant: genuine RED #1214 → full GREEN #1215.
- M11.7 revoke: genuine RED #1217 → full GREEN #1218.
- M11.7 access review: #1220 INVALID NOT RED; #1221 no RED evidence; genuine RED #1222 → full implementation GREEN #1223 at `7d0ec19b81a3ba897e0df03ffe3b01ebbff6c13e`.

## Durable Recovery Sources
`AGENTS.md` → `docs/AUTONOMOUS-DEVELOPMENT.md` → live Git/PR/exact-head CI → source/tests → `docs/progress/STATUS.md` → `docs/milestones/CURRENT.md` → this ledger → traceability/feature matrix → design/plan → older handoffs/chat.

## Exact Next Work
No new M11 product feature is authorized. Verify the documentation-reconciliation head with full exact-head CI, recheck reviews/threads/concurrency/mergeability, update PR #13 description, mark ready if required, and execute the authorized squash merge only when every live gate passes. Verify post-merge `main` CI before activating M12.

## Completion Checklist
- [x] All required M11 iterations implemented or explicitly resolved.
- [x] Acceptance criteria implemented and supported by milestone evidence.
- [x] Required TDD/integration/E2E evidence recorded, including invalid checkpoints without fabrication.
- [x] Security/privacy/performance/YAGNI/AI-safety review complete where relevant; no known blocking issue.
- [x] 0 known Critical / 0 known Important findings at verified implementation head.
- [x] Traceability/feature matrix reconciled in the closeout commit.
- [ ] Exact-final-head full CI GREEN — evaluate live on the current closeout head immediately before merge.
- [ ] PR #13 stable/ready/mergeable with all live merge gates satisfied.

## Next Milestone
M12 — Integrations. Activate only after M11 is legitimately merged and post-merge `main` CI passes; recover the M12 source/roadmap and start with the smallest evidence-backed integration-boundary decision/unit rather than speculatively implementing every adapter.