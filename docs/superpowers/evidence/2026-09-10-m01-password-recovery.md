# M01.4 Password Recovery — Engineering Evidence

Date: 2026-09-10

Branch: `feat/saas-shell-auth`

PR: #3 — draft/open, `Build SaaS shell and authentication`

Base: `main` at `64ebeb4f7b2a39fc0557685ef34035650211aad9`

## Scope

Task 4 of `docs/superpowers/plans/2026-09-10-saas-shell-auth.md`: forgot-password UI/action, generic account-enumeration-safe reset-request result, recovery token confirmation, reset-password UI/action, password validation, invalid/expired recovery handling, and bounded provider errors.

## Recovery / Existing TDD Evidence

This run recovered M01.4 work from the actual branch rather than reconstructing it from chat. Existing commits included recovery forms/actions and explicit test-first server-side recovery-confirmation work (`44d91c291eb58ee35b7e34bcfe615d969660a97b`), followed by the minimum recovery-session implementation (`472b06a0176db5cba50edad9ccfcae9209443eed`) and expired-link regression (`bb83e7eb213cd0e8a349c2be3b8fb9cacb9d16d9` → `8bb51c4cf84ff62e3e64e49e4f17c4058a60fcfa`). Exact-head CI #119 was green on recovered head `8bb51c4…` before this run's skeptical review.

## Skeptical Review Finding

Perspectives: PRD compliance, correctness/edge cases, architecture/YAGNI, testing quality, authentication/recovery security, redirect/token handling, accessibility, and hiring-AI safety.

**Important — resolved:** `/auth/confirm` used `requestUrl.origin` to build post-verification success and error redirects. That allowed the incoming request origin/host to choose the redirect origin even though the design declares `NEXT_PUBLIC_APP_URL` the canonical application origin and auth redirects must remain internal.

## RED → GREEN Security Regression

- RED test commit: `ee8fd9b4706c47530d3268542ee5495d8ea3796c`.
- RED assertions send a valid/expired recovery confirmation request from `https://attacker.example` and require redirects to remain on `https://hire-evidence.example` from configured application environment.
- CI `34507199272` / #120: frozen install, lint, and typecheck passed; unit/component tests failed as expected. Later gates were skipped because the test gate failed.
- Minimum fix commit: `b048782e0644213727f16fdf376d87f6bebb1d1e`.
- Fix: `/auth/confirm` parses the existing validated environment contract and derives every success/error redirect from `NEXT_PUBLIC_APP_URL` origin while continuing to read only token/type parameters from the incoming URL.
- GREEN CI `34507320033` / #121 passed every repository gate.

## Implementation / Safety Review

- Reset requests validate email before provider access and intentionally return the same generic success state for account-disclosure-sensitive provider results.
- Reset-password mutation validates the new password, updates only through the authenticated recovery session, maps invalid/expired sessions to a bounded retry path, and maps provider exceptions without exposing internals.
- Recovery token confirmation occurs server-side; token hashes are not logged or rendered.
- Recovery redirects are pinned to the configured application origin.
- Recovery forms provide associated labels, autocomplete semantics, password help text, pending state, and live-region role semantics.
- No autonomous hiring decisions, protected-trait inference, appearance/emotion/accent/personality/deception scoring, fabricated evidence, or tenant authorization changes are introduced.

Findings after fixes:

- Critical: 0 unresolved.
- Important: 0 unresolved.
- Minor: existing Vitest/Vite ESM-in-CommonJS warning remains deferred maintenance.
- Minor: logout SDK default scope remains unchanged absent a product requirement.

## Exact-Head Verification

Reviewed M01.4 head: `b048782e0644213727f16fdf376d87f6bebb1d1e`.

GitHub Actions CI `34507320033` / #121 — SUCCESS across:

- frozen dependency install;
- lint;
- typecheck;
- unit/component/integration tests;
- autonomous-framework verifier tests;
- requirements-source verifier tests;
- autonomous-framework verification;
- requirements-source integrity verification;
- production build;
- Chromium installation;
- smoke E2E;
- PRD sections 1–242 coverage verification.

Provider-backed reset-email delivery/recovery-session behavior is intentionally not claimed by this provider-independent run and remains required before final M01 completion.

## Next Legitimate Action

Begin M01.5 protected application shell with genuine failing navigation/protection tests from the active implementation plan. Keep PR #3 draft/open and unmerged.
