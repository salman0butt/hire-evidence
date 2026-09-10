# M01 — SaaS Shell + Auth

Status: **IMPLEMENTING**

## Goal
Deliver a premium public SaaS experience plus secure Supabase email/password authentication, protected application entry, and a minimal user profile while preserving human hiring authority and deferring organization/RBAC scope to M02.

## Authoritative PRD Milestone Definition

PRD section 196 requires: premium homepage, pricing placeholder/config, signup, login, verification, forgot/reset password, authenticated shell, secure sessions, basic profile, SEO, responsive design, accessibility; exit when an authenticated user can enter the SaaS app.

Relevant positioning/auth requirements are traced from PRD sections 15–17 and 196 through the active design and plan.

## Dependencies
Product Foundation — COMPLETE and integrated on `main` at `64ebeb4f7b2a39fc0557685ef34035650211aad9`; post-merge CI run `34486610200` / run #57 passed.

## In Scope

- premium public homepage, pricing placeholder/config, SEO, responsive design and accessibility;
- Supabase email/password signup, login, email verification, logout and password recovery;
- cookie-backed secure sessions with server-authoritative protected routing;
- authenticated application shell;
- minimal own-user profile persistence protected by RLS;
- provider-backed auth E2E and cross-user profile-isolation evidence before milestone completion.

## Out of Scope

- organizations, memberships, RBAC, jobs/interviewer builder, candidate invitations or interview execution;
- AI assessment and autonomous hiring decisions;
- billing enforcement;
- enterprise social login/SSO;
- speculative service decomposition or design-system packages.

## Selected Design / Implementation Plan

- Design: `docs/superpowers/specs/2026-09-10-saas-shell-auth-design.md`
- Plan: `docs/superpowers/plans/2026-09-10-saas-shell-auth.md`
- Selected architecture: existing Next.js App Router application + Supabase SSR cookie-backed auth, server-authoritative protected rendering, server actions, RLS-protected own-profile persistence.

## Acceptance Criteria

- PRD deliverables and exit criteria pass.
- All M01 iterations complete or explicitly resolved.
- Relevant security/privacy/accessibility/performance gates pass.
- Provider-backed auth and RLS isolation evidence exists before completion.
- 0 unresolved Critical or Important review findings.
- Traceability/feature state reconciled.
- Exact-final-head CI green.

## Tasks / Iterations

1. **VERIFIED** — M01.1 — Marketing shell: premium homepage, typed pricing placeholder, responsive layout, SEO baseline, accessibility baseline.
2. **NOT STARTED** — M01.2 — Supabase auth infrastructure: clients, cookies/session boundaries, env/config, safe internal redirects.
3. **NOT STARTED** — M01.3 — Core auth flows: signup, login, logout, verification.
4. **NOT STARTED** — M01.4 — Recovery flows: forgot/reset password and error states.
5. **NOT STARTED** — M01.5 — Authenticated app shell: protected routing/navigation.
6. **NOT STARTED** — M01.6 — Basic profile: minimum profile persistence/settings with RLS.
7. **NOT STARTED** — M01.7 — Accessibility + provider-backed E2E/security/review closeout.

## TDD Evidence

M01.1:

- RED behavior definition: `32571d4b9ced71dfb50f7fc53204901b33f3e92c` — `test: define premium marketing shell behavior` preceded implementation.
- GREEN implementation: `1279843b285178a3024c37a3cc3cafcee728587c` — `feat: add premium marketing shell`.
- CI regression RED: `f8bf5c915acc7ba2dc7630adef516b4e43182cee`, run `34488549294` / #62, exposed missing DOM cleanup.
- Root-cause fix: `97513c5357aa82b1bbf8c6ea093c61962e9407ab` registered explicit Testing Library cleanup; run `34491773023` / #63 exposed a separate ambiguous safety-copy selector.
- Final GREEN: `6107253fdde1639097a6e6a6d8fd3777f242e5a4`; run `34492022676` / #64 passed all repository gates.

M01.2–M01.7 TDD evidence: PENDING; never fabricate evidence before those slices execute.

## Integration Test Evidence

- M01.1 provider-independent smoke E2E validates public homepage positioning and signup navigation.
- Full Supabase provider-backed signup/login/verification/recovery/logout and profile integration evidence is PENDING and required before M01 completion.

## E2E / Visual Verification

- Semantic headings/regions, visible focus treatment, reduced-motion handling, and responsive utility layout are implemented for M01.1.
- Smoke E2E passed on reviewed code head `6107253fdde1639097a6e6a6d8fd3777f242e5a4` in CI run `34492022676` / #64.
- Provider-backed desktop/mobile auth/profile scenarios remain PENDING for M01.7.

## Security Review

M01.1 introduces no credential/session/provider boundary. Marketing copy explicitly preserves human hiring-decision authority and rejects autonomous hire/reject and prohibited appearance/emotion/accent/personality/deception scoring.

Milestone-wide review remains PENDING for later auth/profile slices and must cover session authority, cookie handling, redirect injection, account enumeration, token leakage, RLS and cross-user denial before completion.

## Accessibility Review

M01.1 includes semantic landmarks/headings, keyboard-visible focus treatment and reduced-motion behavior. Milestone-wide labeled form/error/status and provider-backed keyboard/mobile checks remain PENDING.

## Performance Review

M01.1 is server-rendered and dependency-light with no new async/service hot path. Reassess external auth/database calls when M01.2+ introduce Supabase.

## AI / Eval Review

No assessment AI is introduced in M01. AI/hiring safety is represented only as product-positioning boundaries; humans remain hiring decision makers.

## Code Review Findings

Skeptical M01.1 review perspectives: PRD compliance, correctness, architecture/YAGNI, testing, security, accessibility/responsiveness, and hiring-AI safety.

- Critical: 0 unresolved.
- Important: 0 unresolved after the two active-CI test-infrastructure/selector defects were root-caused and fixed.
- Minor: existing Vitest/Vite ESM-in-CommonJS config-loader warning remains deferred maintenance.

## Fixes / Re-review

- Fixed missing explicit Testing Library cleanup after CI #62 identified cross-test DOM leakage.
- Fixed the overly broad human-decision text selector after CI #63 proved two legitimate safety statements exist in one isolated render.
- Re-review on code head `6107253fdde1639097a6e6a6d8fd3777f242e5a4` found 0 unresolved Critical/Important findings.
- Durable-ledger reconciliation at `06c167967b1ce9abfdb43b68abf8548d3b2d955e` failed framework verification because this ledger revision omitted required structural headings; this update restores the required contract without weakening verification.

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

Reviewed M01.1 code head `6107253fdde1639097a6e6a6d8fd3777f242e5a4` passed GitHub Actions CI run `34492022676` / run #64 across every repository gate.

Reconciliation head `06c167967b1ce9abfdb43b68abf8548d3b2d955e` passed frozen install, lint, typecheck, unit/component tests and verifier unit tests, then failed `scripts/verify_autonomous_framework.py` solely because six required ledger headings had been omitted. This current structural correction requires fresh exact-head CI.

## Known Limitations

Only M01.1 is complete. Supabase infrastructure, auth flows, protected app shell, profile/RLS, provider-backed E2E, and milestone-wide security/accessibility closeout remain unfinished.

## Documentation Updated

Current progress/status, known issues, milestone program/current ledger, feature matrix, requirements traceability, and dedicated M01.1 engineering evidence are reconciled on the active branch.

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

M01.2 — Supabase SSR infrastructure and environment boundary. Start with the plan's failing environment and safe-internal-redirect tests before production implementation.

## Next Milestone
M02 — Organizations + RBAC. Do not start until M01 is objectively complete and integrated/authorized according to repository policy.
