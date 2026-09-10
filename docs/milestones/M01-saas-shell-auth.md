# M01 — SaaS Shell + Auth

Status: **IMPLEMENTING**

## Goal
Deliver a premium public SaaS experience plus secure Supabase email/password authentication, protected application entry, and a minimal user profile while preserving human hiring authority and deferring organization/RBAC scope to M02.

## Authoritative PRD Milestone Definition

PRD section 196 requires: premium homepage, pricing placeholder/config, signup, login, verification, forgot/reset password, authenticated shell, secure sessions, basic profile, SEO, responsive design, accessibility; exit when an authenticated user can enter the SaaS app.

Relevant positioning/auth requirements trace to PRD sections 15–17 and 196.

## Dependencies
Product Foundation — COMPLETE and integrated on `main` at `64ebeb4f7b2a39fc0557685ef34035650211aad9`; post-merge CI #57 passed.

## In Scope

- premium public homepage, pricing placeholder/config, SEO, responsive design and accessibility;
- Supabase email/password signup, login, verification, logout and password recovery;
- cookie-backed secure sessions with server-authoritative protected routing;
- authenticated application shell;
- minimal own-user profile persistence protected by RLS;
- provider-backed auth E2E and cross-user profile-isolation evidence before milestone completion.

## Out of Scope

- organizations/memberships/RBAC and later product milestones;
- AI assessment or autonomous hiring decisions;
- billing enforcement and enterprise SSO;
- speculative service decomposition.

## Selected Design / Implementation Plan

- Design: `docs/superpowers/specs/2026-09-10-saas-shell-auth-design.md`
- Plan: `docs/superpowers/plans/2026-09-10-saas-shell-auth.md`
- Architecture: existing Next.js App Router + Supabase SSR cookie-backed auth, server-authoritative protected rendering, server actions, and RLS-protected own-profile persistence.

## Acceptance Criteria

- PRD deliverables and exit criteria pass.
- All M01 iterations complete or explicitly resolved.
- Relevant security/privacy/accessibility/performance gates pass.
- Provider-backed auth and RLS isolation evidence exists before completion.
- 0 unresolved Critical or Important review findings.
- Traceability/feature state reconciled.
- Exact-final-head CI green.

## Tasks / Iterations

1. **VERIFIED** — M01.1 — Marketing shell: premium homepage, typed pricing placeholder, responsive layout, SEO/accessibility baseline. CI #64.
2. **VERIFIED** — M01.2 — Supabase auth infrastructure: clients, cookies/session boundaries, env/config, safe internal redirects. `c1a1120…`, CI #83.
3. **VERIFIED (provider-independent)** — M01.3 — signup, login, logout, verification. `32326d4…`, CI #103. Provider-backed verification remains M01.7.
4. **VERIFIED (provider-independent)** — M01.4 — forgot/reset password, generic account-enumeration-safe reset-request state, recovery-session password update, expired/invalid recovery states, and configured-origin confirmation redirects. `b048782e0644213727f16fdf376d87f6bebb1d1e`, CI #121.
5. **NOT STARTED** — M01.5 — authenticated app shell: protected routing/navigation.
6. **NOT STARTED** — M01.6 — basic profile: minimum profile persistence/settings with RLS.
7. **NOT STARTED** — M01.7 — accessibility + provider-backed E2E/security/review closeout.

## TDD Evidence

M01.1–M01.3 retain their durable evidence in prior milestone history and dedicated evidence files.

M01.4 recovered actual test-first recovery commits from Git rather than reconstructing evidence. During skeptical review, an Important redirect security defect was found: the confirmation route used the incoming request origin instead of the configured app origin.

- Existing recovery confirmation RED: `44d91c291eb58ee35b7e34bcfe615d969660a97b`.
- Existing minimum recovery-session implementation: `472b06a0176db5cba50edad9ccfcae9209443eed`.
- Existing expired-link regression: `bb83e7eb213cd0e8a349c2be3b8fb9cacb9d16d9` → `8bb51c4cf84ff62e3e64e49e4f17c4058a60fcfa`.
- Security review regression RED: `ee8fd9b4706c47530d3268542ee5495d8ea3796c`.
- RED CI: `34507199272` / #120 — frozen install, lint and typecheck passed; unit/component tests failed on configured-origin assertions.
- Minimum fix: `b048782e0644213727f16fdf376d87f6bebb1d1e`.
- Full GREEN: `34507320033` / #121 — all repository gates passed.

Detailed evidence: `docs/superpowers/evidence/2026-09-10-m01-password-recovery.md`.

## Integration Test Evidence

Provider-independent unit/component/integration and smoke E2E remain green through CI #121. Recovery action tests cover invalid email/password input, generic account-enumeration-safe reset-request state, invalid recovery sessions, and bounded provider exceptions. Confirmation-route tests cover server-side recovery token verification, expired-token routing, and configured-origin redirect safety.

Provider-backed signup/login/verification/recovery/logout/profile integration is still PENDING and required before M01 completion.

## E2E / Visual Verification

Provider-independent smoke E2E remains green through CI #121. Provider-backed desktop/mobile auth/profile scenarios and milestone-wide visual/accessibility verification remain PENDING for M01.7.

## Security Review

M01.4 keeps forgot-password responses generic, validates reset inputs before provider access, maps recovery-session failure to a bounded retry path, establishes recovery sessions server-side through token verification, does not log recovery tokens, and now pins all confirmation redirects to validated `NEXT_PUBLIC_APP_URL` rather than the request origin.

Hiring-AI safety boundaries remain unchanged: no autonomous hire/reject behavior, protected-trait inference, appearance/emotion/accent/personality/deception scoring, fabricated evidence, or tenant bypass was introduced.

## Accessibility Review

Recovery forms use associated labels, autocomplete semantics, password help text, pending disabled state, and alert/status roles. Provider-backed keyboard/mobile/visual verification remains M01.7.

## Performance Review

M01.4 adds bounded validation and one provider call per mutation; no unbounded work, queue, polling loop, or speculative service was introduced.

## AI / Eval Review

No assessment AI is introduced in M01. AI does not make hiring decisions, infer protected traits, or score appearance/emotion/accent/personality/deception.

## Code Review Findings

- Critical: 0 unresolved.
- Important: 0 unresolved after fixing request-origin trust in the confirmation route.
- Resolved Important: `/auth/confirm` used the incoming request origin for post-verification redirects; regression RED `ee8fd9b…` and GREEN `b048782…` prove the fix.
- Minor: Supabase logout default scope remains a product-semantics follow-up only.
- Minor: existing Vitest/Vite ESM-in-CommonJS warning remains deferred maintenance.

## Fixes / Re-review

The configured-origin security regression was written before the fix and failed in CI #120 for the intended reason. The minimum production fix then passed the complete repository suite in CI #121. Re-review found 0 unresolved Critical/Important findings for M01.4.

## Fresh Verification Commands

```bash
pnpm install --frozen-lockfile
pnpm lint
pnpm typecheck
pnpm test
python3 -m unittest tests/python/test_verify_autonomous_framework.py
python3 -m unittest tests/python/test_verify_requirements_source.py
python3 scripts/verify_autonomous_framework.py
python3 scripts/verify_requirements_source.py
pnpm build
pnpm e2e
python3 scripts/verify_prd_coverage.py
```

## Fresh Verification Results

Reviewed M01.4 code head `b048782e0644213727f16fdf376d87f6bebb1d1e` passed GitHub Actions CI `34507320033` / #121 across frozen install, lint, typecheck, unit/component/integration tests, both verifier test suites, both repository verifiers, production build, Chromium smoke E2E, and PRD coverage.

A subsequent documentation reconciliation commit `6c001265bd71076bd67eaca34a9a23f208d46a6a` correctly failed the autonomous-framework verifier because this ledger accidentally omitted required durable section headings. That documentation-contract regression is being repaired without changing or weakening the verifier; the repaired head requires fresh exact-SHA CI before being called green.

## Known Limitations

M01 is not complete. Protected app shell, profile/RLS, provider-backed auth/recovery E2E, cross-user isolation, and milestone-wide security/accessibility closeout remain unfinished.

## Documentation Updated

Progress/status, known issues, current milestone, feature matrix, requirements traceability, milestone program, and dedicated M01.4 engineering evidence are reconciled for the verified password-recovery capability.

## Durable Recovery Sources

`AGENTS.md` → `docs/AUTONOMOUS-DEVELOPMENT.md` → actual Git/PR/CI → `docs/progress/STATUS.md` → `docs/progress/KNOWN-ISSUES.md` → `docs/milestones/CURRENT.md` → this ledger → relevant PRD/traceability → M01 Superpowers spec/plan/evidence → source/tests.

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

M01.5 — protected application shell. Begin with failing navigation/protection tests from the active implementation plan after the repaired durable reconciliation head passes exact-SHA CI.

## Next Milestone
M02 — Organizations + RBAC. Do not start until M01 is objectively complete and integrated/authorized according to repository policy.
