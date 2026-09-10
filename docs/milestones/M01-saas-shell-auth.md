# M01 — SaaS Shell + Auth

Status: **IMPLEMENTING**

## Goal
Deliver a premium public SaaS experience plus secure Supabase email/password authentication, protected application entry, and a minimal user profile while preserving human hiring authority and deferring organization/RBAC scope to M02.

## Authoritative PRD Milestone Definition

PRD section 196 requires: premium homepage, pricing placeholder/config, signup, login, verification, forgot/reset password, authenticated shell, secure sessions, basic profile, SEO, responsive design, accessibility; exit when an authenticated user can enter the SaaS app.

Relevant positioning/auth requirements trace to PRD sections 15–17 and 196.

## Dependencies
Product Foundation — COMPLETE and integrated on `main` at `64ebeb4f7b2a39fc0557685ef34035650211aad9`; post-merge CI #57 passed.

## Selected Design / Implementation Plan

- Design: `docs/superpowers/specs/2026-09-10-saas-shell-auth-design.md`
- Plan: `docs/superpowers/plans/2026-09-10-saas-shell-auth.md`
- Architecture: existing Next.js App Router + Supabase SSR cookie-backed auth, server-authoritative protected rendering, server actions, and RLS-protected own-profile persistence.

## Tasks / Iterations

1. **VERIFIED** — M01.1 — Marketing shell: premium homepage, typed pricing placeholder, responsive layout, SEO/accessibility baseline. CI #64.
2. **VERIFIED** — M01.2 — Supabase auth infrastructure: clients, cookies/session boundaries, env/config, safe internal redirects. `c1a1120…`, CI #83.
3. **VERIFIED (provider-independent)** — M01.3 — signup, login, logout, verification. `32326d4…`, CI #103. Provider-backed verification remains M01.7.
4. **VERIFIED (provider-independent)** — M01.4 — forgot/reset password, generic account-enumeration-safe reset-request state, recovery-session password update, expired/invalid recovery states, and configured-origin confirmation redirects. `b048782e0644213727f16fdf376d87f6bebb1d1e`, CI #121.
5. **NOT STARTED** — M01.5 — authenticated app shell: protected routing/navigation.
6. **NOT STARTED** — M01.6 — basic profile: minimum profile persistence/settings with RLS.
7. **NOT STARTED** — M01.7 — accessibility + provider-backed E2E/security/review closeout.

## M01.4 TDD / Debugging Evidence

Recovered implementation history includes test-first recovery work rather than reconstructed evidence. During skeptical review, an Important redirect security defect was found: the confirmation route used the incoming request origin instead of the configured app origin.

- Security regression RED: `ee8fd9b4706c47530d3268542ee5495d8ea3796c`.
- RED CI: `34507199272` / #120 — lint/typecheck passed; unit/component tests failed on the configured-origin assertions.
- Minimum fix: `b048782e0644213727f16fdf376d87f6bebb1d1e`.
- Full GREEN: `34507320033` / #121 — all repository gates passed.

Detailed evidence: `docs/superpowers/evidence/2026-09-10-m01-password-recovery.md`.

## Integration / E2E Evidence

Provider-independent unit/component/integration and smoke E2E remain green through CI #121. Provider-backed signup/login/verification/recovery/logout/profile integration is still PENDING and required before M01 completion.

## Security Review

M01.4 keeps forgot-password responses generic, validates reset inputs before provider access, maps recovery-session failure to a bounded retry path, establishes recovery sessions server-side through token verification, does not log recovery tokens, and now pins all confirmation redirects to validated `NEXT_PUBLIC_APP_URL` rather than the request origin.

Hiring-AI safety boundaries remain unchanged: no autonomous hire/reject behavior, protected-trait inference, appearance/emotion/accent/personality/deception scoring, fabricated evidence, or tenant bypass was introduced.

## Accessibility / Performance Review

Recovery forms use associated labels, autocomplete semantics, password help text, pending disabled state, and alert/status roles. M01.4 adds bounded validation and one provider call per mutation; no unbounded work or polling was introduced. Provider-backed keyboard/mobile/visual verification remains M01.7.

## Code Review Findings

- Critical: 0 unresolved.
- Important: 0 unresolved after fixing request-origin trust in the confirmation route.
- Minor: Supabase logout default scope remains a product-semantics follow-up only.
- Minor: existing Vitest/Vite ESM-in-CommonJS warning remains deferred maintenance.

## Fresh Verification Results

Reviewed M01.4 head `b048782e0644213727f16fdf376d87f6bebb1d1e` passed GitHub Actions CI `34507320033` / #121 across frozen install, lint, typecheck, unit/component/integration tests, both verifier test suites, both repository verifiers, production build, Chromium smoke E2E, and PRD coverage.

## Known Limitations

M01 is not complete. Protected app shell, profile/RLS, provider-backed auth/recovery E2E, cross-user isolation, and milestone-wide security/accessibility closeout remain unfinished.

## Completion Checklist

- [ ] All M01 requirements and iterations accounted for.
- [ ] Authenticated user can enter `/app`.
- [ ] Provider-backed signup/login/verification/recovery/logout E2E passes.
- [ ] Profile own-user RLS and cross-user denial are verified.
- [ ] Milestone-wide security/accessibility/performance review complete.
- [ ] 0 Critical / 0 Important findings at final review.
- [ ] Traceability/feature matrix reconciled for final M01 state.
- [ ] Exact-final-head CI green.
- [ ] Durable closeout state current.

## Exact Next Capability

M01.5 — protected application shell. Begin with failing navigation/protection tests from the active implementation plan.

## Next Milestone
M02 — Organizations + RBAC. Do not start until M01 is objectively complete and integrated/authorized according to repository policy.
