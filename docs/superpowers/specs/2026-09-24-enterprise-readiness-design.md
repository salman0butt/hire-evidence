# Enterprise Readiness (M11) — Design

## Goal
Harden the existing hiring evidence product for enterprise operation without weakening human hiring authority, tenant isolation, evidence integrity, privacy, or auditability.

## Scope
M11 follows the durable roadmap in dependency order:
1. append-only advanced audit trail;
2. organization retention configuration;
3. complete deletion workflows for transcript, assessment, evidence, audio/traces where applicable;
4. safe organization branding (name/logo/accent/welcome text; never arbitrary CSS);
5. security hardening, rate limits, and abuse controls;
6. platform observability and incident/SLA signals;
7. privileged-access/support controls and access-review evidence;
8. SSO/SAML only if durable market/product evidence requires it. Otherwise preserve it as deferred rather than speculatively implementing it.

## Architecture principles
- Extend the existing modular monolith and Supabase/Postgres boundaries; do not introduce services, queues, or generic policy engines without a concrete requirement.
- Tenant-owned state remains protected by RLS and server-side authorization.
- Audit records are append-only, attributable, timestamped, tenant-scoped, and avoid secrets/raw credentials.
- Retention/deletion is policy-driven and explicit. Deletion must not silently destroy records that are legally/product-required to remain; conflicts must fail closed and surface a reviewable state.
- Deletion operations are idempotent and produce auditable lifecycle evidence without retaining the deleted sensitive payload.
- Branding is data, not executable styling. Accent values are validated; text is rendered inertly; logos are bounded by safe media policy.
- Rate limits and abuse controls protect sensitive/public endpoints without turning technical failures into candidate scoring signals.
- Observability minimizes PII and never treats logs/traces as a shadow evidence store.
- Privileged support access is least-privilege, attributable, bounded, and auditable.

## Safety invariants
- Humans remain the sole hiring decision makers.
- No candidate ranking, autonomous hire/reject, protected-trait inference, emotion/appearance/accent/personality/deception scoring.
- No cross-tenant audit, retention, deletion, branding, or support access.
- No secret/token values in audit or observability payloads.
- Candidate technical errors, rate limits, or incidents cannot reduce assessment scores.
- Historical assessment/evidence provenance is not silently rewritten.

## Verification strategy
Each behavioral unit uses strict RED→GREEN TDD. Persistence changes require database/RLS/adversarial tests. UI changes require component/accessibility/browser coverage as applicable. Security controls receive adversarial tests. Closeout requires repository full quality gate and exact-final-head CI, with Critical/Important findings resolved.

## Initial capability: M11.1 advanced immutable audit trail
Start with a narrow domain contract before persistence. The contract should accept only known auditable action categories and safe identifiers/metadata, reject secret-like or candidate-sensitive free-form payloads, require organization/actor/action/resource/provenance/time identity, and produce immutable data suitable for later tenant-scoped persistence. Persistence/RLS follows only after the domain boundary is proven.