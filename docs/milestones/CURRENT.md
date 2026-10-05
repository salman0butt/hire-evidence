# Current Milestone

Milestone: Enterprise Readiness (M11)
Status: **ACTIVE — M11.5 SECURITY HARDENING / RATE LIMITS / ABUSE CONTROLS**
Branch: `feat/enterprise-readiness`; PR #13 OPEN / DRAFT.
Base/main: `54444d49761b7eb089c1c6a30a27fdfd115cdd9e`; post-merge CI #1084 GREEN.
Design: `docs/superpowers/specs/2026-09-24-enterprise-readiness-design.md`
Plan: `docs/superpowers/plans/2026-09-24-enterprise-readiness.md`
Ledger: `docs/milestones/M11-enterprise-readiness.md`

## Iterations
1. M11.1 advanced immutable audit trail — VERIFIED, CI #1093.
2. M11.2 retention configuration — VERIFIED, CI #1099.
3. M11.3 deletion workflows — VERIFIED through full CI #1118. Provider-side deletion/deployment-wide zero retention are not claimed.
4. M11.4 safe organization branding — VERIFIED. Candidate-facing inert rendering completed at `0c63e11...`; full exact-head CI #1139 GREEN after genuine RED #1138.
5. M11.5 security/rate limiting/abuse controls — ACTIVE.
   - Realtime provider-credential mint limiter — VERIFIED.
     - CI #1143 INVALID NOT RED: missing compile seam.
     - CI #1144 genuine behavioral RED after the seam compiled.
     - CI #1145 TypeScript authorization-boundary GREEN.
     - CI #1153 INVALID NOT RED: bad pgTAP fixture (`jobs.status` did not exist), zero assertions.
     - `3967c823...` / CI #1154 genuine database RED: missing `consume_realtime_credential_mint(text, uuid)`.
     - `baea4c5f...` / CI #1155 full exact-head GREEN: server-authoritative, hashed-capability, per-attempt two-mints-per-one-minute window with row-lock concurrency serialization; full database/build/E2E/coverage gate passed.
6. M11.6 observability/incident/SLA — PLANNED.
7. M11.7 privileged support/access review — PLANNED.
8. M11.8 SSO/SAML — CONDITIONAL DECISION GATE.

## Recovery
Recover latest exact branch head and CI before writing. M11.5 is not complete. The next highest-risk missing abuse boundary is technical-event ingestion: `record_realtime_interview_technical_event` currently permits an otherwise valid active candidate capability to persist unbounded operational rows. Establish a genuine database RED for a bounded **server-time** per-attempt ingestion limit; do not use client-supplied `occurredAt` for quota accounting. Then implement minimal GREEN, verify exact-head CI, review, update durable state, and continue other exposed routes. Candidate technical failures or rate-limit denials must never become candidate scoring/evidence inputs. Keep PR #13 draft and unmerged while M11 remains incomplete.