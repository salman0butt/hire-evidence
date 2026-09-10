# M01 — SaaS Shell + Auth

Status: **IMPLEMENTING**

## Goal
Deliver a premium public SaaS experience plus secure Supabase email/password authentication, protected application entry, and a minimal user profile while preserving human hiring authority and deferring organization/RBAC scope to M02.

## Authoritative PRD Milestone Definition
PRD section 196 requires premium homepage, pricing placeholder/config, signup, login, verification, forgot/reset password, authenticated shell, secure sessions, basic profile, SEO, responsive design, accessibility; exit when an authenticated user can enter the SaaS app. Relevant positioning/auth requirements trace to PRD sections 15–17 and 196.

## Dependencies
Product Foundation — COMPLETE and integrated on `main` at `64ebeb4f7b2a39fc0557685ef34035650211aad9`; post-merge CI #57 passed.

## In Scope
- premium public homepage, pricing placeholder/config, SEO, responsive design and accessibility;
- Supabase email/password auth/recovery and secure cookie-backed sessions;
- server-authoritative authenticated application shell;
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

## Acceptance Criteria
- PRD deliverables and exit criteria pass.
- All M01 iterations complete or explicitly resolved.
- Provider-backed auth and RLS isolation evidence exists before completion.
- Relevant security/privacy/accessibility/performance gates pass.
- 0 unresolved Critical or Important findings.
- Traceability/feature state reconciled and exact-final-head CI green.

## Tasks / Iterations
1. **VERIFIED** — M01.1 marketing shell; CI #64.
2. **VERIFIED** — M01.2 Supabase SSR/session infrastructure; CI #83.
3. **VERIFIED (provider-independent)** — M01.3 core email auth; CI #103.
4. **VERIFIED (provider-independent)** — M01.4 password recovery; security GREEN `b048782…`, CI #121; durable repair `6833d47…`, CI #123.
5. **VERIFIED (provider-independent)** — M01.5 protected app shell; final reconciliation `f912da9…`, CI #127.
6. **IMPLEMENTED (provider verification pending)** — M01.6 basic profile persistence/settings with RLS; reviewed code/test head `e9c2ad64f2f9065d53a44652ac1116f91538e7f7`, CI #130. Real two-user Supabase RLS isolation is still required before VERIFIED.
7. **NOT STARTED** — M01.7 accessibility + provider-backed E2E/security/review closeout.

## TDD Evidence
M01.6 RED `8656902db4774ab91075e7dbadeb29464577917f`; GitHub Actions `34510379628` / #128 passed frozen install and lint, then failed typecheck for the intended reason: profile validation/form production modules did not yet exist. Minimum implementation `78f2602124486f417af19c057f71cb9192cc3590` added the profile schema/RLS, validation, repository, action, page and accessible form. Review-fix head `e9c2ad64f2f9065d53a44652ac1116f91538e7f7` passed CI `34510856609` / #130.

## Integration Test Evidence
Profile action tests prove invalid input is rejected before authentication/persistence, row ownership comes only from server-validated `requireUser()`, forged `id` and `user_id` form fields are ignored, trimmed display names are persisted, and repository failures map to bounded user-safe errors. Structural migration tests verify RLS enablement, own-user select/insert/update policies, update `USING` plus `WITH CHECK`, auth-user ownership FK, and the 120-character database constraint. Real database execution remains mandatory.

## E2E / Visual Verification
CI #130 passes the existing Chromium smoke suite and confirms no regression to public/auth/protected route behavior. Provider-backed authenticated `/app/profile` interaction, mobile profile flow, and cross-user denial remain M01.7/provider-environment work.

## Security Review
Profile ownership is not caller-selectable: `updateProfileAction` reads only `display_name` and passes the authenticated `requireUser()` ID to persistence. `public.profiles` has RLS enabled; authenticated select/insert/update policies constrain `auth.uid() = id`, and update uses both `USING` and `WITH CHECK`. No delete policy or service-role browser path is introduced. Static SQL assertions are not accepted as deployed RLS proof, so real cross-user isolation remains an explicit gate.

## Accessibility Review
The profile form uses a visible associated label, help text via `aria-describedby`, bounded native `maxLength`, visible submit text, disabled pending state, and alert/status semantics. Provider-backed keyboard/mobile verification remains M01.7.

## Performance Review
Profile rendering performs one authenticated identity verification and one own-row query; saving performs one upsert. No polling, client state framework, queue, trigger, or speculative infrastructure was added.

## AI / Eval Review
No assessment AI is introduced in M01. Humans remain hiring decision makers; prohibited sensitive/proxy scoring remains out of scope.

## Code Review Findings
- Critical: 0 unresolved.
- Important: 0 unresolved.
- Resolved Important: initial M01.6 implementation lacked explicit tests proving forged owner fields cannot influence persistence and machine-checked policy structure. Fixed in `e9c2ad64…`; CI #130 passed.
- Minor: existing Vitest/Vite ESM-in-CommonJS configuration-loader warning remains deferred maintenance.
- Minor: logout default scope remains unchanged absent an explicit product-semantics requirement.

## Fixes / Re-review
The M01.6 Important testing gap was fixed by action-level ownership/error coverage and migration-policy structural tests. Re-review found no remaining Critical or Important code issue. The provider-backed RLS gate remains open by design and is documented as an external verification dependency rather than falsely closed with mocks.

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
Reviewed M01.6 code/test head `e9c2ad64f2f9065d53a44652ac1116f91538e7f7` passed GitHub Actions `34510856609` / #130 across every repository CI gate. Durable reconciliation commits produced after that code head require their own exact-SHA CI before being called green.

## Known Limitations
M01 is not complete. The profile migration has not yet been executed against a configured Supabase test project in this repository's available environment, so User A/User B RLS denial is not yet proven. Provider-backed signup/login/verification/recovery/logout/authenticated app/profile E2E and milestone-wide accessibility/security closeout also remain unfinished.

## Documentation Updated
Status, known issues, current milestone, feature matrix, requirements traceability, Supabase setup, M01 ledger, and M01.6 Superpowers evidence are reconciled with the reviewed code head.

## Durable Recovery Sources
`AGENTS.md` → `docs/AUTONOMOUS-DEVELOPMENT.md` → actual Git/PR/CI → `docs/progress/STATUS.md` → `docs/progress/KNOWN-ISSUES.md` → `docs/milestones/CURRENT.md` → this ledger → PRD/traceability → M01 Superpowers spec/plan/evidence → source/tests.

## Completion Checklist
- [ ] All M01 requirements and iterations accounted for.
- [x] Server-authoritative `/app` shell implemented provider-independently.
- [x] Unauthenticated `/app` browser redirect verified.
- [x] Basic profile schema, settings flow and own-user authorization boundary implemented.
- [ ] Provider-backed authenticated user can enter `/app`.
- [ ] Provider-backed signup/login/verification/recovery/logout E2E passes.
- [ ] Profile own-user RLS and cross-user denial are verified against real Supabase.
- [ ] Milestone-wide security/accessibility/performance review complete.
- [ ] Exact-final-head CI green with durable closeout current.

## Exact Next Capability
M01.7 — provider-backed/authenticated E2E and final accessibility/security closeout, including the outstanding M01.6 two-user RLS isolation gate when a configured Supabase test environment is available. Do not claim provider-backed verification without real evidence.

## Next Milestone
M02 — Organizations + RBAC. Do not start until M01 is objectively complete and integrated/authorized according to repository policy.