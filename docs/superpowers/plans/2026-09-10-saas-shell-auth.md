# SaaS Shell and Authentication Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Deliver a premium public Hire Evidence experience and secure Supabase email/password authentication so a validated user can enter the protected SaaS shell and manage a minimal profile.

**Architecture:** Keep the existing single Next.js App Router application. Add public marketing/auth routes and a protected `/app` boundary; use Supabase SSR cookie-backed clients and a Next.js proxy for session refresh, server actions for auth mutations, and RLS-protected user profile persistence.

**Tech Stack:** Next.js 16 App Router, React 19, TypeScript, Tailwind CSS, Supabase Auth/Postgres, `@supabase/ssr`, `@supabase/supabase-js`, Vitest/Testing Library, Playwright, GitHub Actions.

**Spec:** `docs/superpowers/specs/2026-09-10-saas-shell-auth-design.md`

## Global Constraints

- Preserve PRD sections 15–17 and milestone section 196; do not start organization/RBAC scope from M02.
- AI assists evidence review; humans make hiring decisions.
- Use server-side identity validation for protected routes; do not trust client-supplied session/user data for authorization.
- Browser code may use only the Supabase publishable key; never expose service-role credentials.
- Auth redirects must remain internal to this application.
- User profile rows must be protected by RLS and scoped to `auth.uid()`.
- Meaningful behavior changes require genuine RED → GREEN → refactor evidence.
- Do not mark M01 complete without provider-backed auth E2E, security/accessibility review, 0 Critical/Important findings, and exact-head CI.

---

### Task 1: Premium Marketing Shell, Pricing Placeholder, and SEO

**Files:**
- Modify: `src/app/page.test.tsx`
- Modify: `src/app/page.tsx`
- Modify: `src/app/layout.tsx`
- Modify: `src/app/globals.css`
- Create: `src/config/pricing.ts`
- Create: `src/config/pricing.test.ts`
- Modify: `e2e/smoke.spec.ts`

**Interfaces:**
- Consumes: existing Next.js root route and Tailwind setup.
- Produces: `pricingPlans: readonly PricingPlan[]` and a semantic, responsive homepage with `/auth/signup` and `/auth/login` links.

- [ ] **Step 1: Write failing homepage and pricing tests**

Update `src/app/page.test.tsx` so it requires the positioning copy, primary signup link, login link, “How it works”, “Security & fairness”, pricing and FAQ headings, while retaining the human-decision boundary assertion. Create `src/config/pricing.test.ts` requiring exactly one placeholder starter plan with a non-empty CTA and explicit “placeholder” status.

- [ ] **Step 2: Verify RED**

Run `pnpm test -- src/app/page.test.tsx src/config/pricing.test.ts`.

Expected: FAIL because pricing config and the required marketing sections/links do not exist.

- [ ] **Step 3: Implement the minimum production marketing shell**

Create:

```ts
export type PricingPlan = Readonly<{
  name: string;
  description: string;
  priceLabel: string;
  ctaLabel: string;
  ctaHref: string;
  status: "placeholder";
}>;

export const pricingPlans: readonly PricingPlan[] = [
  {
    name: "Starter",
    description: "A simple starting point for structured interview workflows.",
    priceLabel: "Pricing coming soon",
    ctaLabel: "Create your first interviewer",
    ctaHref: "/auth/signup",
    status: "placeholder",
  },
];
```

Replace the foundation-only homepage with semantic header/main/footer markup and sections for hero, how it works, structured evidence, security/fairness, pricing, FAQ, and final CTA. Do not invent customers, outcomes, compliance certifications, or production features beyond PRD positioning. Update root metadata with a descriptive title template and canonical product description. Add global focus-visible and reduced-motion-safe styling.

- [ ] **Step 4: Verify GREEN**

Run `pnpm test -- src/app/page.test.tsx src/config/pricing.test.ts`, then `pnpm lint && pnpm typecheck`.

Expected: all pass.

- [ ] **Step 5: Extend smoke E2E**

Require `/` to render the primary positioning text and a visible signup link whose `href` is `/auth/signup`. Keep this test provider-independent.

- [ ] **Step 6: Commit**

```bash
git add src/app src/config/pricing.ts src/config/pricing.test.ts e2e/smoke.spec.ts
git commit -m "feat: add premium marketing shell"
```

---

### Task 2: Supabase SSR Infrastructure and Environment Boundary

**Files:**
- Modify: `package.json`
- Modify: `pnpm-lock.yaml`
- Modify: `.env.example`
- Modify: `src/config/env.ts`
- Modify: `src/config/env.test.ts`
- Create: `src/lib/supabase/client.ts`
- Create: `src/lib/supabase/server.ts`
- Create: `src/lib/supabase/proxy.ts`
- Create: `src/proxy.ts`
- Create: `src/lib/auth/safe-redirect.ts`
- Create: `src/lib/auth/safe-redirect.test.ts`

**Interfaces:**
- Consumes: `NEXT_PUBLIC_APP_URL`, `NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY`.
- Produces: request-scoped browser/server Supabase factories, proxy session refresh, `safeInternalPath(value, fallback): string`.

- [ ] **Step 1: Add failing environment and redirect tests**

Require valid absolute HTTPS/HTTP Supabase URL parsing, non-empty publishable key parsing, and redirect behavior that accepts `/app` and `/app/profile` but rejects `//evil.example`, `https://evil.example`, empty values, and non-slash paths.

- [ ] **Step 2: Verify RED**

Run focused Vitest tests. Expected: FAIL because Supabase environment fields and redirect helper are absent.

- [ ] **Step 3: Install supported Supabase SSR dependencies**

Run:

```bash
pnpm add @supabase/supabase-js @supabase/ssr
```

Commit the generated lockfile; never hand-edit package resolutions.

- [ ] **Step 4: Implement environment/client/proxy boundaries**

`parseEnvironment` validates required Supabase values for auth-dependent runtime use. `client.ts` uses `createBrowserClient`; `server.ts` uses `createServerClient` with Next.js `cookies()` get/set adapters. `src/lib/supabase/proxy.ts` refreshes identity via `auth.getClaims()` and propagates cookies to the response. Root `src/proxy.ts` delegates to that helper and excludes static assets through its matcher.

- [ ] **Step 5: Verify GREEN**

Run focused tests, lint, typecheck, and build.

- [ ] **Step 6: Commit**

```bash
git add package.json pnpm-lock.yaml .env.example src/config src/lib src/proxy.ts
git commit -m "feat: add secure Supabase session infrastructure"
```

---

### Task 3: Signup, Login, Logout, and Email Verification

**Files:**
- Create: `src/lib/auth/validation.ts`
- Create: `src/lib/auth/validation.test.ts`
- Create: `src/app/(auth)/auth/actions.ts`
- Create: `src/app/(auth)/auth/login/page.tsx`
- Create: `src/app/(auth)/auth/signup/page.tsx`
- Create: `src/app/(auth)/auth/confirm/route.ts`
- Create: `src/components/auth/auth-form.tsx`
- Create: `src/components/auth/auth-form.test.tsx`

**Interfaces:**
- Consumes: server Supabase factory and safe internal redirect helper.
- Produces: `loginAction`, `signupAction`, `logoutAction`, confirmation route, reusable labeled auth form UI.

- [ ] **Step 1: Write failing validation/form tests**

Require trimmed valid emails, passwords of at least 8 characters, labeled email/password controls, links between signup/login, and accessible error rendering.

- [ ] **Step 2: Verify RED**

Run focused tests. Expected: FAIL because auth validation/forms are absent.

- [ ] **Step 3: Implement validation and server actions**

Use explicit result shapes:

```ts
type AuthActionState = Readonly<{
  status: "idle" | "error" | "verification-required";
  message?: string;
}>;
```

Provider errors are mapped to stable user-safe messages. Signup supplies `${appUrl.origin}/auth/confirm` as the email redirect. Login redirects only to `safeInternalPath(formData.get("next"), "/app")` after successful authentication. Logout signs out server-side and redirects to `/auth/login`.

- [ ] **Step 4: Implement confirmation route**

Validate `token_hash` and `type`; call the Supabase token verification/exchange API supported by the installed SDK, then redirect to `/app` on success or `/auth/login?error=verification` on failure. Never log query tokens.

- [ ] **Step 5: Verify GREEN**

Run focused tests, lint, typecheck, build.

- [ ] **Step 6: Commit**

```bash
git add src/app/'(auth)' src/components/auth src/lib/auth
git commit -m "feat: add core email authentication flows"
```

---

### Task 4: Password Recovery

**Files:**
- Modify: `src/app/(auth)/auth/actions.ts`
- Create: `src/app/(auth)/auth/forgot-password/page.tsx`
- Create: `src/app/(auth)/auth/reset-password/page.tsx`
- Create: `src/components/auth/recovery-form.test.tsx`

**Interfaces:**
- Consumes: auth validation, application origin, server Supabase client.
- Produces: `requestPasswordResetAction` and `resetPasswordAction`.

- [ ] **Step 1: Write failing recovery tests** requiring labeled email/new-password forms, generic forgot-password success copy, and password validation.
- [ ] **Step 2: Verify RED** with focused Vitest execution.
- [ ] **Step 3: Implement reset request** with `resetPasswordForEmail(email, { redirectTo: `${appUrl.origin}/auth/reset-password` })` and a generic success response regardless of account-disclosure-sensitive provider detail.
- [ ] **Step 4: Implement password update** through the authenticated recovery session with `updateUser({ password })`; map invalid/expired session failures to a safe retry path.
- [ ] **Step 5: Verify GREEN**, then lint/typecheck/build.
- [ ] **Step 6: Commit** with `feat: add password recovery flows`.

---

### Task 5: Protected Application Shell

**Files:**
- Create: `src/lib/auth/require-user.ts`
- Create: `src/app/(app)/app/layout.tsx`
- Create: `src/app/(app)/app/page.tsx`
- Create: `src/components/app/app-navigation.tsx`
- Create: `src/components/app/app-navigation.test.tsx`
- Modify: `src/proxy.ts`

**Interfaces:**
- Consumes: server Supabase client and `safeInternalPath`.
- Produces: `requireUser()` trusted server helper plus authenticated `/app` layout.

- [ ] **Step 1: Write failing navigation/protection tests** requiring product identity, profile link, logout control, and unauthenticated redirect contract.
- [ ] **Step 2: Verify RED**.
- [ ] **Step 3: Implement `requireUser()`** using server-validated Supabase identity/claims; redirect unauthenticated users to `/auth/login?next=/app` without accepting caller-selected external destinations.
- [ ] **Step 4: Implement app layout/dashboard placeholder** that shows authenticated identity and clearly marks later organization/interview functionality as not yet available rather than faking it.
- [ ] **Step 5: Verify GREEN**, lint/typecheck/build/E2E protected-route behavior.
- [ ] **Step 6: Commit** with `feat: add protected SaaS application shell`.

---

### Task 6: Basic Profile Persistence and RLS

**Files:**
- Create: `supabase/migrations/20260910_create_profiles.sql`
- Create: `src/lib/profile/validation.ts`
- Create: `src/lib/profile/validation.test.ts`
- Create: `src/lib/profile/repository.ts`
- Create: `src/app/(app)/app/profile/actions.ts`
- Create: `src/app/(app)/app/profile/page.tsx`
- Create: `src/components/profile/profile-form.tsx`
- Create: `src/components/profile/profile-form.test.tsx`

**Interfaces:**
- Consumes: trusted authenticated user ID.
- Produces: own-profile read/upsert with `display_name` max 120 characters.

- [ ] **Step 1: Write failing validation/component tests** for blank/null display name, trimmed name, 120-character maximum, labels and errors.
- [ ] **Step 2: Verify RED**.
- [ ] **Step 3: Add migration** creating `public.profiles`, enabling RLS, and policies for authenticated users to select/insert/update only rows where `auth.uid() = id`.
- [ ] **Step 4: Implement repository/actions** so row ID always comes from trusted auth context; never accept profile owner ID from form data.
- [ ] **Step 5: Verify GREEN** with unit/component tests plus database/RLS verification against a configured Supabase test environment. Explicitly test User A cannot read/update User B.
- [ ] **Step 6: Commit** with `feat: add isolated user profile settings`.

---

### Task 7: Accessibility, Provider-Backed E2E, Review, and Closeout

**Files:**
- Modify: `e2e/smoke.spec.ts`
- Create: `e2e/auth.spec.ts`
- Modify: `docs/milestones/M01-saas-shell-auth.md`
- Modify: `docs/progress/STATUS.md`
- Modify: `docs/progress/KNOWN-ISSUES.md`
- Modify: `docs/FEATURE-MATRIX.md`
- Modify: `docs/requirements/TRACEABILITY.md`

**Interfaces:**
- Consumes: completed M01 routes/actions/profile schema and configured test Supabase credentials.
- Produces: end-to-end milestone evidence and durable recovery state.

- [ ] **Step 1: Add E2E scenarios** for desktop/mobile homepage, keyboard navigation, signup verification path, login/logout, forgot/reset password, unauthenticated `/app` redirect, authenticated `/app` entry, own-profile update, and cross-user profile denial.
- [ ] **Step 2: Run E2E and fix only root causes**; never bypass provider-backed scenarios with fake success states when claiming milestone completion.
- [ ] **Step 3: Perform security/accessibility/performance review** covering cookies/session authority, redirect injection, account enumeration, token leakage, RLS, keyboard/focus/labels/statuses, responsive overflow, and unnecessary client JavaScript.
- [ ] **Step 4: Perform independent skeptical code review** across PRD compliance, correctness, architecture/YAGNI, tests, security, and hiring-AI safety. Classify Critical/Important/Minor; fix all Critical/Important and re-review.
- [ ] **Step 5: Run full verification**:

```bash
pnpm install --frozen-lockfile
pnpm lint
pnpm typecheck
pnpm test
pnpm build
pnpm e2e
python3 -m unittest tests/python/test_verify_autonomous_framework.py
python3 -m unittest tests/python/test_verify_requirements_source.py
python3 scripts/verify_autonomous_framework.py
python3 scripts/verify_requirements_source.py
python3 scripts/verify_prd_coverage.py
```

- [ ] **Step 6: Update durable ledgers** with exact branch, PR, SHA, CI, tests, review findings, blockers, and exactly one `Exact next work:` item.
- [ ] **Step 7: Verify exact final PR-head CI**, ensuring no newer unverified commit exists.
- [ ] **Step 8: Do not merge without fresh explicit owner authorization for the M01 PR.**

## Plan Self-Review

- Spec coverage: all M01.1–M01.7 iterations and milestone deliverables are mapped to Tasks 1–7.
- Scope: organizations/RBAC, job/interviewer builder, candidate execution, assessment and billing remain outside M01.
- Security: cookie authority, safe redirects, token secrecy and profile RLS are explicit gates.
- Dependency order: marketing is independent; auth infrastructure precedes flows; flows precede protected shell/profile; provider-backed E2E closes the milestone.
- No implementation step permits replacing required Supabase verification with fabricated mocks when claiming completion.