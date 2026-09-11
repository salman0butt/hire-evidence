# M01 Provider-Backed Closeout Evidence — 2026-09-11

## Scope
This record closes the previously blocked provider-backed evidence gate for M01 using the real Supabase local development stack in GitHub Actions. It does not use mocks, placeholder provider behavior, service-role browser access, or an unrelated hosted project.

## Provider environment
Exact-head CI `34582926587` / #148 on `7348526cb466a66b907e4c92148b7c6d68daf674` installed Supabase CLI 2.117.0, started the local Supabase stack, and ran `supabase db reset`. The run applied `supabase/migrations/20260910_create_profiles.sql` against PostgreSQL and used Supabase Auth, PostgREST, Mailpit, and the repository's production application routes.

## Browser/provider evidence
`e2e/auth.spec.ts` executed an end-to-end lifecycle against that stack:

- User A signup through the application UI;
- confirmation email delivery through Supabase Auth/Mailpit and `/auth/confirm` token exchange;
- authenticated `/app` entry;
- `/app/profile` display-name persistence and reload;
- logout and password login;
- forgot-password request, real recovery email, reset route, password update, logout, and login with the new password;
- User B signup/confirmation and own-profile persistence;
- authenticated 390×844 profile rendering without horizontal overflow plus keyboard focus evidence;
- direct authenticated Supabase clients for User A and User B proving each can read their own profile;
- User A receives no row when selecting User B and vice versa;
- User A receives no updated row when attempting to update User B and vice versa;
- both own profile names remain unchanged after forged cross-user updates;
- replaying the consumed User A confirmation link fails safely without exposing `token_hash`.

CI #148 reports `8 passed` Playwright tests. The quality job also passed frozen install, lint, typecheck, 54 unit/component tests, framework verifier tests, requirements-source verifier tests, autonomous framework verification, requirements-source integrity verification, production build, PRD sections 1–242 coverage, and clean Supabase teardown.

## Debugging evidence
The provider closeout was built through genuine failures before the final green head. The immediately preceding workflow hardening commit `a30c4f540522bfcbb6991be54db6f76286e4af50` restored `pipefail` so Playwright failures cannot be hidden by `tee`. Final commit `7348526cb466a66b907e4c92148b7c6d68daf674` fixed an ambiguous password-reset field locator by addressing the concrete `#recovery-password` control. CI #148 is green on that exact head.

## Review
Skeptical review of the provider slice covered PRD compliance, auth/session correctness, RLS/tenant-style isolation, token handling, test integrity, accessibility/mobile behavior, CI failure semantics, YAGNI, and hiring-AI safety.

- Critical: 0 unresolved.
- Important: 0 unresolved.
- Minor: logout continues to use the Supabase SDK default session scope; no product requirement currently requires global-device logout semantics.
- Informational: GitHub-hosted third-party action/runtime deprecation notices remain external maintenance.

No autonomous hiring decision, protected-trait inference, appearance/emotion/accent/personality/deception scoring, fabricated candidate evidence, service-role browser path, or cross-user authorization bypass was introduced.

## Conclusion
The previously documented M01 provider/RLS blocker is resolved. M01.6 profile/RLS and M01.7 provider-backed auth/profile closeout satisfy their evidence gates at `7348526cb466a66b907e4c92148b7c6d68daf674`, CI #148. Durable milestone state must be reconciled and then receive fresh exact-head CI before PR #3 is merged.