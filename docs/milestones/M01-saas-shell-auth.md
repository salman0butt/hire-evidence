# M01 — SaaS Shell + Auth

Status: **IMPLEMENTING**

## Goal
Deliver a premium public SaaS experience plus secure Supabase email/password authentication, protected application entry, and a minimal user profile while preserving human hiring authority and deferring organization/RBAC scope to M02.

## Authoritative PRD Milestone Definition

PRD section 196 requires: premium homepage, pricing placeholder/config, signup, login, verification, forgot/reset password, authenticated shell, secure sessions, basic profile, SEO, responsive design, accessibility; exit when an authenticated user can enter the SaaS app.

Relevant positioning/auth requirements trace to PRD sections 15–17 and 196.

## Dependencies
Product Foundation — COMPLETE and integrated on `main` at `64ebeb4f7b2a39fc0557685ef34035650211aad9`; post-merge CI `34486610200` / #57 passed.

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

1. **VERIFIED** — M01.1 — Marketing shell: premium homepage, typed pricing placeholder, responsive layout, SEO/accessibility baseline.
2. **VERIFIED** — M01.2 — Supabase auth infrastructure: clients, cookies/session boundaries, env/config, safe internal redirects. Reviewed code head `c1a11206916684546c8b8dcdd89f4a3908fe359e`; CI `34499829397` / #83 PASS.
3. **VERIFIED (provider-independent)** — M01.3 — Core auth flows: signup, login, logout, verification. Reviewed code/setup head `32326d4715b1c60c485b40308df0c5f022c01bbb`; CI `34502240299` / #103 PASS. Provider-backed verification remains an M01.7 gate.
4. **NOT STARTED** — M01.4 — Recovery flows: forgot/reset password and error states.
5. **NOT STARTED** — M01.5 — Authenticated app shell: protected routing/navigation.
6. **NOT STARTED** — M01.6 — Basic profile: minimum profile persistence/settings with RLS.
7. **NOT STARTED** — M01.7 — Accessibility + provider-backed E2E/security/review closeout.

## TDD Evidence

M01.1:

- RED `32571d4b9ced71dfb50f7fc53204901b33f3e92c`; implementation `1279843b285178a3024c37a3cc3cafcee728587c`; final reviewed GREEN `6107253fdde1639097a6e6a6d8fd3777f242e5a4`, CI #64.

M01.2:

- Environment RED `883853a231650487d9c5fda8bf8029550194ed36`; CI #67 failed because production Supabase environment fields did not yet exist.
- Redirect test-first commit `e334ce34ebca2851cf239daa6364164300be30e4` preceded helper implementation.
- Security regression RED `ea8f6d628935bb942f0fd26b824c603bd1380e4f`; CI #82 failed exactly on the backslash redirect case.
- GREEN `c1a11206916684546c8b8dcdd89f4a3908fe359e`; CI #83 passed all gates.

M01.3:

- Validation RED `e434a8f7387e09aba56ccc374f1bb32ea8e47941`.
- Form RED `041f2cdd0daa3330e9899750fd0e8b80d14006af`; CI `34501339680` / #92 failed because production validation/form modules did not yet exist.
- Minimum implementation followed in commits `5a7eda4…` through `9959e52…`.
- Implementation CI #99 exposed an `exactOptionalPropertyTypes` call-site defect; `edf7e93f95b0646587041306670cb1c198540e13` fixed it by omitting the absent optional prop; CI #100 passed.
- Review verification added focused provider-error tests in `f43b089d6167feae1fa260b77cef29181f3d2f27`.
- CI #102 exposed a missing required environment fixture in that new signup-action test; `32326d4715b1c60c485b40308df0c5f022c01bbb` fixed only the fixture with explicit non-secret values.
- Full GREEN `32326d4715b1c60c485b40308df0c5f022c01bbb`; CI `34502240299` / #103 passed all repository gates with 25 tests.

M01.4–M01.7 TDD evidence: PENDING; never fabricate evidence before execution.

## Integration Test Evidence

- M01.1 provider-independent smoke E2E remains green.
- M01.2 build/smoke CI exercises the active request proxy using explicit non-secret public placeholder Supabase config.
- M01.3 focused server-action tests verify invalid input stops before provider access and login/signup provider failures map to stable user-safe messages.
- Provider-backed signup/login/verification/recovery/logout/profile integration remains PENDING and is required before M01 completion.

## E2E / Visual Verification

- M01.1 semantic/responsive public shell smoke coverage passed on CI #64.
- M01.2/M01.3 provider-independent smoke E2E remains green through CI #103.
- Provider-backed desktop/mobile auth/profile scenarios remain PENDING for M01.7.

## Security Review

M01.2 established browser-safe publishable credentials, request-scoped cookie-backed SSR clients, claim verification, and internal redirect validation.

M01.3 validates credentials before provider calls, maps provider failures to bounded messages, revalidates login destinations server-side, never logs confirmation tokens, and restricts the confirmation route to expected email/signup token types. Supabase's SSR token-hash email-template requirement is now durable in `docs/SUPABASE-AUTH-SETUP.md`.

Provider-backed account-enumeration, verification/recovery token, authenticated-route, and RLS reviews remain later M01 gates. Human hiring authority and prohibited-scoring boundaries remain unchanged.

## Accessibility Review

M01.3 forms use associated labels, email/password autocomplete semantics, help text, pending disabled state, and alert/status roles. Provider-backed keyboard/mobile/visual checks remain M01.7.

## Performance Review

M01.3 adds bounded form validation and one provider call per auth mutation. No unbounded work, queue, polling loop, or speculative service was added. Provider latency/failure behavior will be exercised in provider-backed M01 verification.

## AI / Eval Review

No assessment AI is introduced in M01. AI does not make hiring decisions, infer protected traits, or score appearance/emotion/accent/personality/deception.

## Code Review Findings

Skeptical M01.3 perspectives: PRD compliance, correctness, architecture/YAGNI, testing quality, auth security, token/redirect handling, accessibility, and hiring-AI safety.

- Critical: 0 unresolved.
- Important: 0 unresolved.
- Resolved Important: server-action provider-error translation lacked focused verification.
- Resolved Important/documentation gap: provider-backed SSR email verification depends on Supabase token-hash email-template configuration that was not durably recorded.
- Minor: Supabase logout currently uses SDK default scope; leave unchanged absent an explicit session-scope product requirement.
- Minor: existing Vitest/Vite ESM-in-CommonJS config-loader warning remains deferred maintenance.

## Fixes / Re-review

- Added focused action tests without pretending they were part of the original RED phase.
- Fixed only the missing test environment fixture exposed by CI #102; production validation was not weakened.
- Added `docs/SUPABASE-AUTH-SETUP.md` for required provider configuration.
- Re-review of `32326d4715b1c60c485b40308df0c5f022c01bbb` found 0 unresolved Critical/Important findings.

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

Reviewed M01.3 code/setup head `32326d4715b1c60c485b40308df0c5f022c01bbb` passed GitHub Actions CI `34502240299` / #103 across frozen install, lint, typecheck, 25 tests, both verifier test suites, both repository verifiers, production build, Chromium installation, smoke E2E, and PRD coverage.

Durable reconciliation after this reviewed head requires fresh exact-head CI before the latest branch head is considered green.

## Known Limitations

M01 is not complete. Password recovery, protected app shell, profile/RLS, provider-backed signup/login/verification/logout E2E, and milestone-wide security/accessibility closeout remain unfinished. Provider-backed email confirmation also requires the Supabase project configuration in `docs/SUPABASE-AUTH-SETUP.md`.

## Documentation Updated

Progress/status, current milestone, feature matrix, requirements traceability, Supabase auth setup, and dedicated M01.3 engineering evidence are reconciled for the verified code/setup state.

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

M01.4 — password recovery. Begin with failing recovery-form/action tests from the active implementation plan after fresh exact-head CI validates this reconciliation.

## Next Milestone
M02 — Organizations + RBAC. Do not start until M01 is objectively complete and integrated/authorized according to repository policy.
