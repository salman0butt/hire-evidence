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
5. **VERIFIED (provider-independent)** — M01.5 protected app shell; `d5ee32a4ceab57df9ea8108a0e7600a1244c070c`, CI #126.
6. **NOT STARTED** — M01.6 basic profile persistence/settings with RLS.
7. **NOT STARTED** — M01.7 accessibility + provider-backed E2E/security/review closeout.

## TDD Evidence
M01.4 security review RED `ee8fd9b…` failed CI #120 for the intended origin-trust regression; GREEN `b048782…` passed CI #121.

M01.5:
- RED `0d3aa49f61d29b9feb2d1a2ea4a10186748a108c`; CI `34508434425` / #124 failed at typecheck because protected-user/navigation production modules did not yet exist.
- Minimum implementation `361ff9adf450d758389d60baa7c2962fd210b2e0`; CI #125 passed all gates.
- Browser verification `d5ee32a4ceab57df9ea8108a0e7600a1244c070c`; CI `34508795038` / #126 passed all gates including protected-route smoke E2E.

## Integration Test Evidence
`requireUser()` tests prove server-side Supabase `getUser()` is the identity source and unauthenticated access redirects to `/auth/login?next=/app`. Navigation tests prove product identity, authenticated email, profile path, and logout control. Provider-backed authenticated-entry verification remains M01.7.

## E2E / Visual Verification
CI #126 browser smoke verifies unauthenticated `/app` entry redirects to login with the internal return path. Authenticated provider-backed desktop/mobile scenarios remain M01.7.

## Security Review
M01.5 protects the app layout server-side, uses Supabase `getUser()` rather than trusting browser session payloads, constrains return paths with the existing safe-internal-path helper, and exposes only the authenticated user's email in the shell. Existing request proxy already refreshes/verifies auth on applicable routes, so no speculative proxy duplication was added. Hiring-AI safety boundaries remain unchanged.

## Accessibility Review
Navigation has an explicit accessible label, text controls, visible focus treatment, semantic header/main structure, and no icon-only actions. Provider-backed keyboard/mobile verification remains M01.7.

## Performance Review
One server identity verification gates protected rendering. No client state library, polling, queue, or speculative service was added.

## AI / Eval Review
No assessment AI is introduced in M01. Humans remain hiring decision makers; prohibited sensitive/proxy scoring remains out of scope.

## Code Review Findings
- Critical: 0 unresolved.
- Important: 0 unresolved after M01.5 review.
- Minor: profile navigation targets the exact-next M01.6 route and must not be mistaken for completed profile functionality.
- Minor: logout default scope and the existing Vitest/Vite configuration warning remain deferred as previously documented.

## Fixes / Re-review
No M01.5 Critical/Important code defect was found after the RED/GREEN implementation. Browser-level protected-route evidence was added before verification closeout. The earlier M01.4 documentation-contract regression was repaired in `6833d47…` without weakening the verifier; CI #123 passed.

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
Reviewed M01.5 browser-evidence head `d5ee32a4ceab57df9ea8108a0e7600a1244c070c` passed GitHub Actions CI `34508795038` / #126 across every repository gate. The durable reconciliation commit created after that head requires its own exact-SHA CI before being called green.

## Known Limitations
M01 is not complete. Profile/RLS, provider-backed auth/recovery/profile E2E, cross-user isolation, and milestone-wide security/accessibility closeout remain unfinished.

## Documentation Updated
Status, known issues, current milestone, feature matrix, traceability, milestone program, and M01.5 evidence are reconciled.

## Durable Recovery Sources
`AGENTS.md` → `docs/AUTONOMOUS-DEVELOPMENT.md` → actual Git/PR/CI → `docs/progress/STATUS.md` → `docs/progress/KNOWN-ISSUES.md` → `docs/milestones/CURRENT.md` → this ledger → PRD/traceability → M01 Superpowers spec/plan/evidence → source/tests.

## Completion Checklist
- [ ] All M01 requirements and iterations accounted for.
- [x] Server-authoritative `/app` shell implemented provider-independently.
- [x] Unauthenticated `/app` browser redirect verified.
- [ ] Provider-backed authenticated user can enter `/app`.
- [ ] Provider-backed signup/login/verification/recovery/logout E2E passes.
- [ ] Profile own-user RLS and cross-user denial are verified.
- [ ] Milestone-wide security/accessibility/performance review complete.
- [ ] Exact-final-head CI green with durable closeout current.

## Exact Next Capability
M01.6 — Basic Profile Persistence and RLS. Begin with failing validation/component tests and preserve the provider-backed RLS isolation gate.

## Next Milestone
M02 — Organizations + RBAC. Do not start until M01 is objectively complete and integrated/authorized according to repository policy.
