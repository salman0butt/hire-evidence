# Project Status

Last reconciled: 2026-10-05. Current Git/code/exact-SHA CI outrank these recovery notes.

## Completed Milestones
M00–M10 COMPLETE and integrated. M10 merge/main `54444d49761b7eb089c1c6a30a27fdfd115cdd9e`; post-merge CI #1084 GREEN.

## Current Milestone
M11 Enterprise Readiness — ACTIVE.
Active task: M11.5 security hardening / rate limits / abuse controls.
Active branch: `feat/enterprise-readiness`.
Active PR: #13 OPEN / DRAFT; not merge eligible while M11 remains incomplete.
Main/base: `54444d49761b7eb089c1c6a30a27fdfd115cdd9e`.

## M11 Task State
- M11.1 immutable audit — VERIFIED, CI #1093.
- M11.2 retention configuration — VERIFIED, CI #1099.
- M11.3 deletion — VERIFIED through full CI #1118. Internal artifact erasure, rollback/idempotency, and removal of application-controlled Gemini Live session resumption are covered. Provider-side deletion or deployment-wide zero retention is not claimed.
- M11.4 organization branding — VERIFIED; candidate-facing inert rendering RED #1138 → full exact-head GREEN #1139 at `0c63e11f711114fbd7975cb66ade947077e2e61a`.
- M11.5 security hardening/rate limits/abuse — ACTIVE.
- M11.6 observability/incident/SLA — PLANNED.
- M11.7 privileged support/access reviews — PLANNED.
- M11.8 SSO/SAML — CONDITIONAL DECISION GATE.

## M11.5 Credential-Mint Abuse Control
The public realtime-session route could repeatedly mint constrained Gemini credentials for an otherwise valid candidate capability. The production path now requires a server-authoritative Supabase allowance before provider access.

TDD / verification evidence:
- CI #1143: INVALID NOT RED — the first adversarial test did not compile because the dependency seam was absent.
- `bd409d6bb50cbe12248051f577cb82fd040fc9d3` / CI #1144: genuine behavioral RED — repeated minting remained authorized after the seam compiled.
- `47e693ed8255556ce6b4eafc274a5bbe1e0de75c` / CI #1145: TypeScript authorization-boundary GREEN; denial prevents provider access.
- `556522784c6b47d9cd0bf0270b9c6af9c7a708bd` / CI #1153: INVALID NOT RED — pgTAP fixture used nonexistent `jobs.status`, so zero assertions ran.
- `3967c8238463dd50bfe2f6b3581cfa47435492a1` / CI #1154: genuine database RED — valid fixture reached pgTAP and proved `consume_realtime_credential_mint(text, uuid)` was missing.
- `baea4c5f22934cb5cbe20a76e02b9867611e8636` / CI #1155 (`37284892083`): full exact-head GREEN. Frozen install, lint, typecheck, 766 unit/component tests, framework/source verifiers, Supabase database boundary, build, Chromium/E2E, PRD coverage and cleanup all passed.

Verified implementation boundary:
- raw invitation capability is hashed before the database boundary;
- the database validates active authoritative attempt + matching non-expired/non-revoked started invitation;
- `FOR UPDATE` serializes count-and-insert across application instances;
- two credential mints per one-minute server-time window allow one immediate reconnect while bounding repeated provider access;
- stale operational mint rows are removed and attempt deletion cascades cleanup;
- direct table access is revoked with RLS enabled;
- rate-limit denial is constant-safe and is not candidate score/evidence input.

Review at this checkpoint: 0 known Critical findings, 0 known Important findings, 0 submitted PR reviews, 0 unresolved inline review threads.

## Known Issues
See `docs/progress/KNOWN-ISSUES.md`; real external Gemini browser smoke still depends on owner-supplied credentials and is not repository CI evidence.

## Exact Next Work
Continue M11.5 with the next exposed-route abuse boundary: `record_realtime_interview_technical_event` currently permits an otherwise valid candidate capability to persist an unbounded number of technical-event rows. Establish a genuine adversarial database RED requiring a bounded, server-time, per-attempt ingestion limit; client-supplied `occurredAt` must not control the quota. Then implement the smallest server-authoritative GREEN without making technical failures scoring/evidence inputs.