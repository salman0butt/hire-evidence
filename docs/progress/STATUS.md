# Project Status

Last reconciled: 2026-10-05. Current Git/code/exact-SHA CI outrank these recovery notes.

## Completed Milestones
M00–M10 COMPLETE and integrated. M10 merge/main `54444d49761b7eb089c1c6a30a27fdfd115cdd9e`; post-merge CI #1084 GREEN.

## Current Milestone
M11 Enterprise Readiness — ACTIVE.
Active task: M11.6 observability / incident / SLA tooling.
Active branch: `feat/enterprise-readiness`.
Active PR: #13 OPEN / DRAFT; not merge eligible while M11 remains incomplete.
Main/base: `54444d49761b7eb089c1c6a30a27fdfd115cdd9e`.

## M11 Task State
- M11.1 immutable audit — VERIFIED, CI #1093.
- M11.2 retention configuration — VERIFIED, CI #1099.
- M11.3 deletion — VERIFIED through full CI #1118. Internal artifact erasure, rollback/idempotency, and removal of application-controlled Gemini Live session resumption are covered. Provider-side deletion or deployment-wide zero retention is not claimed.
- M11.4 organization branding — VERIFIED; candidate-facing inert rendering RED #1138 → full exact-head GREEN #1139 at `0c63e11f711114fbd7975cb66ade947077e2e61a`.
- M11.5 security hardening/rate limits/abuse — VERIFIED through full exact-head CI #1169 at `da95e4acc65624ed5ae02bf783e819430280d557`.
- M11.6 observability/incident/SLA — ACTIVE.
- M11.7 privileged support/access reviews — PLANNED.
- M11.8 SSO/SAML — CONDITIONAL DECISION GATE.

## M11.5 Verified Abuse-Control Boundaries
### Realtime provider credential minting
- CI #1143 INVALID NOT RED: missing compile seam.
- `bd409d6bb50cbe12248051f577cb82fd040fc9d3` / CI #1144 genuine behavioral RED.
- `47e693ed8255556ce6b4eafc274a5bbe1e0de75c` / CI #1145 TypeScript authorization-boundary GREEN.
- `556522784c6b47d9cd0bf0270b9c6af9c7a708bd` / CI #1153 INVALID NOT RED: bad pgTAP fixture.
- `3967c8238463dd50bfe2f6b3581cfa47435492a1` / CI #1154 genuine database RED.
- `baea4c5f22934cb5cbe20a76e02b9867611e8636` / CI #1155 full exact-head GREEN.
- Server-authoritative hashed capability + active attempt/invitation check; attempt-row serialization; two mints per one-minute server-time window; denials are operational only and never scoring evidence.

### Realtime technical-event ingestion
- `0c9549dcb5c77e6429683311fb9e0c52e800ded5` / CI #1164 genuine database RED: an otherwise-valid capability could persist the 13th technical event inside one server-time minute.
- `42d966b...` implemented the limiter; `3d9448725e2441cd76123112fd004e147376aa55` preserved the existing RPC contract.
- CI #1166 full exact-head GREEN at `3d9448725e2441cd76123112fd004e147376aa55`.
- The database locks the authoritative attempt, counts only server `created_at`, permits at most 12 operational events per one-minute window, and ignores client `occurredAt` for quota accounting. Technical events remain non-scoring operational data.

### Realtime finalization retry write amplification
- `6d1f2cb27982194ba3af7f272eae422e95691f9d` / CI #1167 INVALID NOT RED for the intended retry behavior: a pre-existing ambiguous `ON CONFLICT (attempt_id)` prevented the first finalization.
- `1d7867fbc25ce68ee3f8b738bf71a6912422e059` fixed only the conflict target and CI #1168 reached the intended genuine RED: retrying a completed finalization rewrote `updated_at`.
- `da95e4acc65624ed5ae02bf783e819430280d557` / CI #1169 full exact-head GREEN: completed retries remain authorized/idempotent and return the existing trigger/result without updating the attempt row; first finalization remains row-locked and creates exactly one assessment trigger.

### Remaining exposed realtime route review
`realtime-progress` is bounded by the immutable finite interview plan and idempotent processed-event IDs. Adding an unrelated generic throttle would add complexity without a demonstrated abuse path. Review at M11.5 closeout: 0 known Critical findings and 0 known Important findings. Candidate technical failures, rate-limit denials, and incidents remain outside assessment/evidence/scoring inputs.

## M11.6 Active Boundary
Observability must be structured and privacy-minimized: explicit request/correlation identity, service health/error/latency signals, incident-oriented diagnostics, bounded retention, no raw credentials/secrets, and no transcript/resume/candidate-text shadow evidence store. Tenant isolation and human hiring authority remain unchanged.

## Known Issues
See `docs/progress/KNOWN-ISSUES.md`; real external Gemini browser smoke still depends on owner-supplied credentials and is not repository CI evidence.

CI status: M11.5 VERIFIED by full exact-head CI #1169 at `da95e4acc65624ed5ae02bf783e819430280d557`; M11.6 ACTIVE.

Exact next work: inventory current logging/telemetry boundaries, then establish the smallest genuine RED for a structured privacy-safe operational signal contract with request/correlation identity and bounded status/latency fields while rejecting secrets and candidate-sensitive free-form payloads. Implement only after the RED is verified.