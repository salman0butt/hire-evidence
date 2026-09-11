# M01 — SaaS Shell + Auth

Status: **VERIFYING**

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
3. **VERIFIED** — M01.3 core email auth; provider-independent coverage plus real provider lifecycle in CI #148.
4. **VERIFIED** — M01.4 password recovery; provider-independent security GREEN `b048782…`, CI #121; real recovery email/reset/login in CI #148.
5. **VERIFIED** — M01.5 protected app shell; provider-independent `f912da9…`, CI #127 plus real authenticated `/app` entry in CI #148.
6. **VERIFIED** — M01.6 basic profile persistence/settings with RLS. Reviewed implementation `e9c2ad64…`, CI #130; real local Supabase migration, own-row persistence and mutual User A/User B cross-profile SELECT/UPDATE denial in `7348526…`, CI #148.
7. **VERIFIED** — M01.7 accessibility + provider-backed E2E/security/review closeout. Provider-independent browser evidence #134; real Supabase auth/profile lifecycle, authenticated mobile/keyboard evidence and replayed-token safety in `7348526…`, CI #148.

## TDD Evidence
M01.6 RED `8656902db4774ab91075e7dbadeb29464577917f`; GitHub Actions #128 failed at typecheck for intentionally absent production modules. Reviewed profile implementation `e9c2ad64f2f9065d53a44652ac1116f91538e7f7` passed CI #130.

M01.7 browser verification initially produced genuine CI #133 RED because an unscoped `Log in` locator matched both header and footer links. Systematic debugging established a test-selector defect rather than product behavior. `061762ec28a9f95ed97c433f35df8eee060389fe` scoped the assertion to the `banner` landmark; CI #134 passed.

Provider-backed closeout was then exercised against a real local Supabase stack. Workflow hardening commit `a30c4f540522bfcbb6991be54db6f76286e4af50` restored `set -o pipefail` so a failing Playwright run cannot be masked by `tee`. The remaining password-reset E2E failure was traced to an ambiguous label locator; `7348526cb466a66b907e4c92148b7c6d68daf674` addressed the concrete `#recovery-password` control and CI #148 passed all eight Playwright tests.

The Vitest config warning was configuration-only maintenance, so artificial behavioral RED was not created. CI #140 reproduced ESM syntax being loaded as CommonJS. `85ff10741875892e2787631b106cfc48bfad0d5c` moved the config to explicit ESM `.mts` semantics and used `import.meta.url` path resolution; CI #141 passed and the loader warning disappeared.

## Integration Test Evidence
Profile action tests prove invalid input is rejected before authentication/persistence, row ownership comes only from server-validated `requireUser()`, forged `id` and `user_id` form fields are ignored, trimmed display names are persisted, and repository failures map to bounded user-safe errors. Structural migration tests verify RLS enablement, own-user select/insert/update policies, update `USING` plus `WITH CHECK`, auth-user ownership FK, and the 120-character database constraint.

CI #148 adds real execution evidence: `supabase start` followed by `supabase db reset` applied `20260910_create_profiles.sql` to PostgreSQL. Two users authenticated independently with the publishable key. Each could read its own profile; cross-user SELECTs returned no rows; cross-user UPDATEs returned no rows; and each own profile remained unchanged after the forged update attempts. No service-role client is used by browser/RLS tests.

## E2E / Visual Verification
Provider-independent CI #134 passed seven Chromium tests for marketing/auth route behavior, unauthenticated protection, health, 390×844 layout without horizontal overflow, keyboard focus, labeled auth inputs, and safe return-path handling.

Provider-backed CI #148 passed eight Chromium tests total. The added serial lifecycle uses Supabase Auth/PostgREST/Mailpit and the production Next.js routes to verify:

- signup and verification-email delivery;
- `/auth/confirm` token exchange and authenticated `/app` entry;
- `/app/profile` persistence across reload;
- logout and password login;
- forgot-password request and recovery-email delivery;
- password reset followed by login with the updated password;
- a second independent user and own-profile persistence;
- authenticated 390×844 profile layout without horizontal overflow;
- keyboard focus on authenticated profile navigation;
- two-user RLS read/update isolation;
- replay of a consumed confirmation link fails safely without exposing `token_hash`.

## Security Review
The auth boundary uses publishable credentials only; the provider E2E does not introduce a service-role browser path. Protected routes remain server-authoritative. Redirect validation, bounded provider errors, token secrecy, caller-independent profile ownership, and RLS are preserved. CI #148 proves the migration and RLS policies against real local PostgreSQL/PostgREST rather than mocks or static inspection.

The earlier need for a dedicated hosted test project is no longer a blocker because the repository now provisions an isolated disposable Supabase local stack in CI. This is provider-backed execution while avoiding unrelated hosted projects, production credentials, cost-bearing infrastructure, or committed secrets.

## Accessibility Review
Provider-independent browser verification proves narrow-mobile no-horizontal-overflow on public/unauthenticated paths, keyboard focus navigation, and accessible labels. Provider-backed CI #148 additionally verifies the authenticated profile route at 390×844 without horizontal overflow and keyboard focus on the product/profile navigation. Existing visible `:focus-visible` styling and reduced-motion rules remain in place. No Important accessibility defect is known.

## Performance Review
M01 remains a single Next.js application and introduces no speculative service boundary. Profile rendering is one authenticated identity validation plus one own-row query; save is one upsert. Provider E2E adds CI-only local Supabase startup cost, not production runtime cost. Vitest still emits an informational environment-performance suggestion; disabling isolation is intentionally not used because shared jsdom state previously caused test leakage.

## AI / Eval Review
No assessment AI is introduced in M01. Humans remain hiring decision makers; prohibited sensitive/proxy scoring remains out of scope. No candidate evidence is generated or altered by this milestone.

## Code Review Findings
- Critical: 0 unresolved.
- Important: 0 unresolved.
- Resolved: ambiguous Playwright login locator, provider E2E pipe failure masking, password-reset locator ambiguity, and Vitest ESM config-loader warning.
- Minor: Supabase logout retains SDK default session scope absent an explicit product-semantics requirement.
- Informational: GitHub-hosted third-party action/runtime Node deprecation notices remain external maintenance and do not affect application verification.

## Fixes / Re-review
The complete active boundary has been reviewed from PRD compliance, correctness/edge cases, architecture/YAGNI, testing quality, auth/session security, profile data isolation/RLS, accessibility/responsiveness, CI failure semantics, and hiring-AI safety perspectives. The provider slice uses the publishable key and independently authenticated users, exercises real provider/database behavior, and does not weaken any test or authorization boundary. Critical: 0 unresolved. Important: 0 unresolved.

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
supabase start
supabase db reset
pnpm build
pnpm e2e
python3 scripts/verify_prd_coverage.py
supabase stop --no-backup
```

## Fresh Verification Results
Provider implementation head `7348526cb466a66b907e4c92148b7c6d68daf674` passed GitHub Actions `34582926587` / CI #148. The quality job passed frozen dependency installation, lint, typecheck, 54/54 unit/component tests, six autonomous-framework verifier tests, five requirements-source verifier tests, autonomous-framework verification, requirements-source integrity verification, real local Supabase startup and database reset with `20260910_create_profiles.sql` applied, production build, 8/8 Chromium E2E tests, PRD sections 1–242 coverage, and Supabase teardown.

The current durable closeout documentation is newer than `7348526…`; it must receive fresh exact-head CI before PR #3 is integration-ready.

## Known Limitations
No remaining Critical/Important M01 limitation is known. Supabase logout currently uses the SDK default session scope; this is Minor and intentionally unchanged absent an explicit product requirement for all-device logout. GitHub-hosted action/runtime deprecation notices are informational external maintenance.

M02 organization membership/RBAC remains deliberately out of scope until M01 is merged and post-merge `main` is verified.

## Documentation Updated
Status, known issues, current milestone, this active milestone ledger, feature matrix, requirements traceability, milestone program, and `docs/superpowers/evidence/2026-09-11-m01-provider-backed-closeout.md` are reconciled with CI #148 provider evidence. PR #3 must be updated with the final exact-head CI before merge.

## Durable Recovery Sources
`AGENTS.md` → `docs/AUTONOMOUS-DEVELOPMENT.md` → actual Git/PR/CI → `docs/progress/STATUS.md` → `docs/progress/KNOWN-ISSUES.md` → `docs/milestones/CURRENT.md` → this ledger → PRD/traceability → M01 Superpowers spec/plan/evidence → source/tests.

## Completion Checklist
- [x] All M01 requirements and iterations accounted for.
- [x] Server-authoritative `/app` shell implemented and provider-backed entry verified.
- [x] Unauthenticated `/app` browser redirect verified.
- [x] Basic profile schema, settings flow and own-user authorization boundary implemented.
- [x] Local Supabase migration execution verified.
- [x] Real User A/User B own-profile access and mutual cross-user read/update denial verified.
- [x] Signup/login/email verification/recovery/logout provider lifecycle verified.
- [x] Authenticated `/app` and `/app/profile` behavior verified.
- [x] Provider-independent and authenticated mobile/keyboard accessibility closeout verified.
- [x] Test runner config uses explicit ESM semantics without the prior loader warning.
- [x] Milestone-wide security/accessibility/performance/review closeout complete with 0 unresolved Critical/Important findings.
- [ ] Exact-final-head CI green after durable closeout reconciliation.
- [ ] PR #3 integrated and post-merge `main` CI green.

## Exact Next Capability
Complete the final durable reconciliation, obtain fresh exact-head CI, re-check PR #3 head/reviews/threads/mergeability, then mark it ready and squash-merge under the owner's standing authorization if all gates remain green. Verify post-merge `main` CI before starting M02.

## Next Milestone
M02 — Organizations + RBAC. Start only after PR #3 is integrated and post-merge `main` is green.