# Enterprise Readiness (M11) — Implementation Plan

Design: `docs/superpowers/specs/2026-09-24-enterprise-readiness-design.md`

## Execution order

### M11.1 Advanced immutable audit trail
1. Characterize existing audit/event patterns and schema.
2. RED: define safe immutable audit-event domain contract and prohibited metadata cases.
3. GREEN: implement minimal runtime-validatable audit event boundary.
4. RED/GREEN: tenant-scoped append-only persistence with RLS and cross-tenant adversarial tests.
5. RED/GREEN: query/read boundary for authorized organization roles with bounded pagination.
6. Verify security/privacy/performance and exact-head CI.

### M11.2 Retention configuration
Define bounded organization retention policy values, authorized mutation, immutable policy-change audit evidence, effective-policy calculation, and RLS tests. Avoid claiming legal defaults; product configuration must be explicit and documented.

### M11.3 Complete deletion workflows
Inventory persisted candidate artifacts; define idempotent deletion state machine; delete/irreversibly detach applicable transcript, assessment, evidence, audio and AI traces; preserve only minimum non-sensitive audit tombstones; test tenant isolation, retries, partial failure, and historical integrity constraints.

### M11.4 Organization branding
Validated name/welcome/accent/logo metadata; safe rendering; no CSS/HTML/script injection; authorization, storage and accessibility tests.

### M11.5 Security hardening / rate limits / abuse controls
Threat-model exposed routes; add bounded server-authoritative controls; ensure candidate technical failures are never scoring inputs; adversarial verification.

### M11.6 Observability / incident / SLA tooling
Structured privacy-minimized operational signals, request/correlation identity, service health/error/latency signals, incident-oriented diagnostics, bounded retention, and no shadow candidate evidence store.

### M11.7 Privileged support/access reviews
Least-privilege support access, explicit reason/expiry where applicable, attributable audit trail, access review projection, cross-tenant denial tests.

### M11.8 SSO/SAML decision gate
Search durable requirements/market evidence at execution time. Implement only if required. Otherwise record DEFERRED with evidence and preserve traceability.

## Per-unit gate
For every behavioral unit: genuine RED → minimal GREEN → focused tests → broader applicable tests → skeptical correctness/security/privacy/YAGNI review → fix Critical/Important findings → durable docs → push → exact-head CI. Do not weaken RLS, auditability, evidence integrity, or human-review boundaries.

## Milestone closeout
Reconcile ledger/status/traceability, run full repository gate (lint/typecheck/tests/database/build/E2E/framework/PRD coverage and security checks), verify exact final SHA CI, recheck reviews/threads/concurrency, then merge only under the owner's authorized merge gates. Post-merge `main` CI must pass before M12 activation.