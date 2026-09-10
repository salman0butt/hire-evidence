# M01.1 Marketing Shell — Engineering Evidence

Date: 2026-09-10

Branch: `feat/saas-shell-auth`

PR: #3 — draft/open, `Build SaaS shell and authentication`

Base: `main` at `64ebeb4f7b2a39fc0557685ef34035650211aad9`

## Scope

M01.1 from `docs/superpowers/plans/2026-09-10-saas-shell-auth.md`: premium public marketing shell, typed pricing placeholder/config, SEO metadata, responsive/accessibility baseline, human hiring-decision boundary, component coverage, and provider-independent smoke E2E.

## TDD evidence

- Test-first commit: `32571d4b9ced71dfb50f7fc53204901b33f3e92c` — `test: define premium marketing shell behavior`.
- Implementation commit: `1279843b285178a3024c37a3cc3cafcee728587c` — `feat: add premium marketing shell`.
- Follow-up test/config commits refined the intended semantic contract without removing requirements.

## Systematic debugging evidence

### CI failure 1

- SHA: `f8bf5c915acc7ba2dc7630adef516b4e43182cee`
- CI: `34488549294` / run #62
- Symptom: the second homepage component test found duplicate named regions.
- Root cause: Vitest globals are disabled, therefore Testing Library automatic cleanup did not register and the first test's rendered DOM leaked into the second.
- Fix: `97513c5357aa82b1bbf8c6ea093c61962e9407ab` explicitly registers `afterEach(cleanup)` in `test/setup.ts`.

### CI failure 2

- SHA: `97513c5357aa82b1bbf8c6ea093c61962e9407ab`
- CI: `34491773023` / run #63
- Symptom: a global `getByText(/humans make hiring decisions/i)` matched two intentional safety statements in one clean render.
- Root cause: selector uniqueness assumption, not duplicate DOM and not a product safety defect.
- Fix: `6107253fdde1639097a6e6a6d8fd3777f242e5a4` scopes the assertion to the named Security & fairness region with Testing Library `within()`.

## GREEN verification

Reviewed code head: `6107253fdde1639097a6e6a6d8fd3777f242e5a4`

GitHub Actions: `34492022676` / run #64 — SUCCESS.

Passed gates:

- `pnpm install --frozen-lockfile`;
- lint;
- typecheck;
- unit/component tests;
- autonomous-framework verifier tests;
- requirements-source verifier tests;
- autonomous-framework verification;
- requirements-source integrity verification;
- production build;
- Chromium installation;
- smoke E2E;
- PRD coverage verification.

## Skeptical review

Perspectives applied: PRD compliance, correctness/edge cases, architecture/YAGNI, test quality, security, accessibility/responsiveness, and hiring-AI safety.

Findings after fixes:

- Critical: 0 unresolved.
- Important: 0 unresolved.
- Minor: existing Vitest/Vite ESM-in-CommonJS config-loader warning; deferred because it does not affect current correctness and broadening M01.1 for module-convention maintenance would violate scope discipline.

Safety boundary verified in implemented copy/tests: AI supports job-relevant evidence review; humans make hiring decisions; no autonomous hire/reject or prohibited appearance/emotion/accent/personality/deception scoring is introduced.

## Remaining M01 work

M01.1 completion is not M01 completion. M01.2–M01.7 remain, including Supabase SSR/session infrastructure, core auth, recovery, protected app shell, own-user profile with RLS/cross-user denial tests, provider-backed E2E, and milestone-wide security/accessibility closeout.

## Next legitimate action

After exact-head CI confirms the durable reconciliation commit, begin M01.2 with the plan's failing environment-validation and safe-internal-redirect tests.
