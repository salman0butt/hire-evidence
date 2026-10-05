# Session Handoff

Recover live Git/PR/CI first. Git/source/tests/exact-SHA CI outrank this file if newer work exists.

## Current State — 2026-10-05
- Repository: `salman0butt/hire-evidence`.
- Main/base: `54444d49761b7eb089c1c6a30a27fdfd115cdd9e`; post-merge CI #1084 GREEN.
- Active branch: `feat/enterprise-readiness`.
- PR #13 `Build enterprise readiness controls`: OPEN / DRAFT. M11 incomplete; do not merge yet.
- Milestone: M11 Enterprise Readiness.
- M11.1 audit VERIFIED (#1093).
- M11.2 retention VERIFIED (#1099).
- M11.3 deletion VERIFIED through full #1118; provider-side deletion/deployment-wide zero retention are not claimed.
- M11.4 safe branding VERIFIED through full exact-head #1139 at `0c63e11...`.
- M11.5 security/rate limits/abuse controls ACTIVE.

## M11.5 Verified Unit — Realtime Credential Minting
Production authorization now requires a server-authoritative database allowance before Gemini provider credential issuance.

Evidence chain:
- #1143 — INVALID NOT RED: dependency seam missing at compile time.
- `bd409d6...` / #1144 — genuine behavioral RED: repeat request remained authorized.
- `47e693e...` / #1145 — TypeScript authorization-boundary GREEN.
- `5565227...` / #1153 — INVALID NOT RED: bad pgTAP fixture referenced nonexistent `jobs.status`; zero assertions ran.
- `3967c8238463dd50bfe2f6b3581cfa47435492a1` / #1154 (`37284199626`) — genuine database RED: valid fixture proved `consume_realtime_credential_mint(text, uuid)` missing.
- `baea4c5f22934cb5cbe20a76e02b9867611e8636` / #1155 (`37284892083`) — full exact-head GREEN: lint, typecheck, 766 unit/component tests, framework/source integrity, Supabase/database, build, Chromium/E2E, PRD coverage and cleanup all passed.

Implementation: `supabase/migrations/202610050001_realtime_credential_mint_limit.sql` validates hashed capability + active authoritative attempt/invitation, locks the attempt row, permits two mints per one-minute server-time window (initial + one reconnect), denies further mints, minimizes stale operational rows, and has direct table access revoked with RLS enabled. Denial never affects candidate scoring/evidence.

Review at verified checkpoint: 0 known Critical findings, 0 known Important findings, 0 submitted PR reviews, 0 unresolved inline review threads.

## Exact Next Work
Continue M11.5 with technical-event ingestion. `public.record_realtime_interview_technical_event` currently validates capability/attempt but permits unbounded operational inserts. Write the smallest pgTAP adversarial test that proves an excessive burst for the same valid attempt is rejected by a server-time quota. Do not use client-provided `occurredAt` for quota accounting. Verify a genuine RED before changing the RPC, then implement minimal server-authoritative GREEN, run exact-head full CI, perform skeptical security/privacy/YAGNI review, update durable docs, and continue to the next exposed route.

## Safety / Scope
Preserve tenant isolation/RLS, privacy minimization, immutable evidence/provenance except explicit authorized erasure, and sole human hiring authority. Technical events, provider failures and rate-limit denials are operational only and must never become assessment evidence, score, ranking, recommendation, hire/reject decision, or proxy candidate signal.