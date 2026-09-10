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
3. **NOT STARTED** — M01.3 — Core auth flows: signup, login, logout, verification.
4. **NOT STARTED** — M01.4 — Recovery flows: forgot/reset password and error states.
5. **NOT STARTED** — M01.5 — Authenticated app shell: protected routing/navigation.
6. **NOT STARTED** — M01.6 — Basic profile: minimum profile persistence/settings with RLS.
7. **NOT STARTED** — M01.7 — Accessibility + provider-backed E2E/security/review closeout.

## TDD Evidence

M01.1:

- RED `32571d4b9ced71dfb50f7fc53204901b33f3e92c`; implementation `1279843b285178a3024c37a3cc3cafcee728587c`; final reviewed GREEN `6107253fdde1639097a6e6a6d8fd3777f242e5a4`, CI #64.

M01.2:

- Environment RED `883853a231650487d9c5fda8bf8029550194ed36`; CI `34498258324` / #67 failed because Supabase environment fields did not exist in production code.
- Redirect test-first commit `e334ce34ebca2851cf239daa6364164300be30e4` preceded helper implementation.
- CI `34498441763` / #70 later exposed a test-construction misuse of `exactOptionalPropertyTypes`; corrected in `c7d5d2160cd3c3d1ea8d956bc574fbfcb1d0ccda` without weakening runtime validation.
- Security regression RED `ea8f6d628935bb942f0fd26b824c603bd1380e4f`; CI `34499549698` / #82 failed exactly on `/\\evil.example` while 15 tests passed.
- Security/full GREEN `c1a11206916684546c8b8dcdd89f4a3908fe359e`; CI `34499829397` / #83 passed all gates.

M01.3–M01.7 TDD evidence: PENDING; never fabricate evidence before execution.

## Integration Test Evidence

- M01.1 provider-independent smoke E2E remains green.
- M01.2 build/smoke CI exercises the active request proxy using explicit non-secret public placeholder Supabase config.
- Provider-backed signup/login/verification/recovery/logout/profile integration remains PENDING and is required before M01 completion.

## E2E / Visual Verification

- M01.1 semantic/responsive public shell smoke coverage passed on CI #64.
- M01.2 provider-independent smoke E2E passed on code head `c1a1120…` in CI #83 with request proxy active.
- Provider-backed desktop/mobile auth/profile scenarios remain PENDING for M01.7.

## Security Review

M01.2 uses browser-safe publishable credentials only, request-scoped cookie-backed SSR clients, `auth.getClaims()` in the request proxy, and safe internal redirect validation. A skeptical review identified `/\\evil.example` as an Important network-path redirect escape; a failing regression test proved the defect and the helper now rejects backslashes. CI #83 verified the fix.

Provider-backed account-enumeration, verification/recovery token, authenticated route, and RLS reviews remain later M01 gates. Human hiring authority and prohibited-scoring boundaries remain unchanged.

## Accessibility Review

No new user-facing M01.2 form UI was added. M01.1 accessibility baseline remains in place. Labeled form/error/status and provider-backed keyboard/mobile checks are required in later slices.

## Performance Review

The request proxy introduces auth claim verification on matched dynamic requests, following the selected SSR architecture. No queues/services or speculative infrastructure were added. Reassess provider latency/failure behavior as auth flows are introduced.

## AI / Eval Review

No assessment AI is introduced in M01. M01.2 contains authentication/session infrastructure only. Humans remain hiring decision makers.

## Code Review Findings

Skeptical M01.2 perspectives: PRD compliance, correctness, architecture/YAGNI, test quality, dependency reproducibility, security/redirect injection, and hiring-AI safety.

- Critical: 0 unresolved.
- Important: 0 unresolved.
- Resolved Important: backslash network-path redirect escape.
- Resolved Important: build/smoke CI lacked explicit public Supabase config after the broad request proxy became active.
- Minor: existing Vitest/Vite ESM-in-CommonJS config-loader warning remains deferred maintenance.

## Fixes / Re-review

- Added a genuine failing redirect regression before hardening `safeInternalPath`.
- Added only non-secret CI placeholders for provider-independent build/smoke; did not misclassify them as provider-backed auth evidence.
- Generated Supabase lockfile changes through `pnpm add` in a one-shot runner workflow; the temporary write-enabled workflow was removed immediately afterward.
- Re-review of reviewed code head `c1a11206916684546c8b8dcdd89f4a3908fe359e` found 0 unresolved Critical/Important findings.

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

Reviewed M01.2 code head `c1a11206916684546c8b8dcdd89f4a3908fe359e` passed GitHub Actions CI `34499829397` / #83 across frozen install, lint, typecheck, 16 tests, both verifier test suites, both repository verifiers, production build, Chromium installation, smoke E2E, and PRD coverage.

Documentation reconciliation after this reviewed code head requires fresh exact-head CI before the latest branch head is considered green.

## Known Limitations

M01 is not complete. Signup/login/logout/verification, password recovery, protected app shell, profile/RLS, provider-backed E2E, and milestone-wide security/accessibility closeout remain unfinished.

## Documentation Updated

Progress/status, known issues, current milestone, feature matrix, requirements traceability, and dedicated M01.2 engineering evidence are reconciled for the verified M01.2 code state.

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

M01.3 — core email authentication. Start with failing auth validation and accessible signup/login form tests from the active plan.

## Next Milestone
M02 — Organizations + RBAC. Do not start until M01 is objectively complete and integrated/authorized according to repository policy.
