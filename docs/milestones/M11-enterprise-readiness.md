# M11 — Enterprise Readiness

Status: **ACTIVE — M11.5 SECURITY HARDENING / RATE LIMITS / ABUSE CONTROLS**

## Goal
Deliver enterprise hardening as reviewable, evidence-backed capabilities while preserving tenant isolation, privacy, evidence integrity and sole human hiring authority.

## Authoritative Definition
PRD §206 covers advanced audit logs, retention configuration, data deletion workflows, organization branding, security hardening, rate limiting, observability, incident/SLA tooling and access reviews. SSO/SAML is conditional on durable product/market evidence.

## Branch / PR
- Base/main: `54444d49761b7eb089c1c6a30a27fdfd115cdd9e`; post-merge CI #1084 GREEN.
- Branch: `feat/enterprise-readiness`.
- PR #13 `Build enterprise readiness controls` — OPEN / DRAFT. Do not merge while M11 remains incomplete.
- Design: `docs/superpowers/specs/2026-09-24-enterprise-readiness-design.md`.
- Plan: `docs/superpowers/plans/2026-09-24-enterprise-readiness.md`.

## Iteration State
1. **VERIFIED** — M11.1 advanced immutable audit trail, CI #1093.
2. **VERIFIED** — M11.2 retention configuration, CI #1099.
3. **VERIFIED** — M11.3 repository deletion workflows, full CI #1118. Internal candidate-linked erasure, rollback/idempotency and removal of application-controlled Gemini Live session resumption are covered; provider-side deletion/deployment-wide zero retention are not claimed.
4. **VERIFIED** — M11.4 safe organization branding. Candidate-facing inert rendering RED #1138 → full exact-head GREEN #1139 at `0c63e11f711114fbd7975cb66ade947077e2e61a`.
5. **ACTIVE** — M11.5 security hardening / rate limits / abuse controls.
6. **PLANNED** — M11.6 observability / incident / SLA tooling.
7. **PLANNED** — M11.7 privileged support / access reviews.
8. **DECISION GATE** — M11.8 SSO/SAML only if durable evidence requires it.

## M11.5 Threat Model
Prioritize public/exposed candidate routes and operations that can consume provider or storage resources. Controls must be server-authoritative, bounded, safe across multiple app instances, based on authoritative capability/attempt state, privacy-minimized, and must never affect candidate assessment, score, evidence, ranking or hiring decisions.

Current exposed candidate operations include realtime session authorization/provider credential minting, realtime progress, finalization and technical-event ingestion. Rate-limit accounting must use server time, not client-controlled timestamps.

## M11.5 Unit A — Provider Credential Mint Limiting
### Risk
An otherwise valid candidate capability could repeatedly call the realtime-session route and mint constrained Gemini credentials. App-memory limiting would be bypassable across instances.

### TDD evidence
- `46a57f...` / CI #1143 — **INVALID NOT RED**: new adversarial test did not compile because the dependency seam was absent.
- `bd409d6bb50cbe12248051f577cb82fd040fc9d3` / CI #1144 — **GENUINE RED**: after the compile-only seam, the second repeated request remained authorized; 762 other tests passed.
- `47e693ed8255556ce6b4eafc274a5bbe1e0de75c` / CI #1145 — TypeScript authorization-boundary **GREEN**: a denied allowance returns constant-safe unavailable before provider access.
- `556522784c6b47d9cd0bf0270b9c6af9c7a708bd` / CI #1153 — **INVALID NOT RED**: database fixture referenced nonexistent `jobs.status`, so zero pgTAP assertions executed.
- `3967c8238463dd50bfe2f6b3581cfa47435492a1` / CI #1154 (`37284199626`) — **GENUINE DATABASE RED**: valid fixture reached pgTAP and proved `consume_realtime_credential_mint(text, uuid)` was missing.
- `baea4c5f22934cb5cbe20a76e02b9867611e8636` / CI #1155 (`37284892083`) — **FULL EXACT-HEAD GREEN**: frozen install, lint, typecheck, 766 unit/component tests, framework/source verifiers, database boundary, build, Chromium/E2E, PRD coverage and cleanup all passed.

### Verified implementation
`supabase/migrations/202610050001_realtime_credential_mint_limit.sql` adds a direct-access-revoked RLS operational table and `consume_realtime_credential_mint(text, uuid)` security-definer RPC. The RPC validates the hashed capability against the active authoritative attempt and matching started/non-expired/non-revoked invitation, locks the attempt row to serialize concurrent consumers, uses a one-minute server-time window, allows two mints in that window (initial + one immediate reconnect), returns false on further attempts, and removes stale window rows. Attempt deletion cascades cleanup.

The production repository hashes the raw invitation token and calls this RPC before Gemini access. Denial is constant-safe and is not scoring/evidence input.

### Review
- Correctness/security/privacy/YAGNI: no known Critical or Important findings at this checkpoint.
- PR reviews: 0 submitted reviews and 0 unresolved inline threads at latest recovery.
- Scope note: this protects provider credential issuance; it does not complete M11.5.

## Exact Next Work
M11.5 Unit B: bound `record_realtime_interview_technical_event`. The current RPC validates an active capability/attempt but permits unlimited operational event inserts. Establish a genuine adversarial database RED requiring a server-time per-attempt burst limit. Do not use client-supplied `occurredAt` as quota time. Then implement the smallest server-authoritative GREEN, verify exact-head full CI, perform skeptical security/privacy review, update durable evidence, and continue the next exposed route.

## Milestone Merge Gate
M11 may merge only after all required iterations are complete/resolved, all Critical/Important findings and blocking threads are cleared, durable traceability/status are current, exact-final-head full CI is green, PR head is stable/mergeable, and safety/privacy/evidence/human-review boundaries are preserved. M11 is not currently merge eligible.