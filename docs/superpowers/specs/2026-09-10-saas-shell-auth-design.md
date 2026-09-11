# SaaS Shell and Authentication Design

## Purpose

Deliver Product Foundation's next dependent capability: a premium public SaaS experience plus secure Supabase email/password authentication, protected application entry, and a minimal user profile. This design implements PRD sections 15–17 and milestone section 196 while preserving the later organization/RBAC boundary for M02.

## Classification

Architectural. This milestone introduces public/authenticated route boundaries, an external identity provider, cookie-backed sessions, protected server rendering, and user-owned persistence.

Routine design decisions are pre-authorized by the repository owner under `AGENTS.md` and `docs/AUTONOMOUS-DEVELOPMENT.md`; evidence gates are not waived.

## Requirements

Authoritative milestone deliverables:

- premium homepage;
- pricing placeholder/config;
- signup;
- login;
- email verification;
- logout;
- forgot/reset password;
- authenticated shell;
- secure sessions;
- basic profile;
- SEO;
- responsive design;
- accessibility;
- authenticated user can enter the SaaS app.

PRD positioning requirements:

- clearly communicate “Create structured AI interviews once. Interview candidates anytime.”;
- emphasize structured interviewing and evidence-linked review rather than generic HR software;
- preserve the boundary that AI assists evidence review while humans make hiring decisions;
- use Supabase Auth for the required email/password flows;
- defer Google Workspace, Microsoft, and enterprise SSO/SAML.

## Approaches Considered

### 1. Next.js App Router + Supabase SSR — selected

Keep the existing single Next.js application. Use `@supabase/ssr` and `@supabase/supabase-js` with separate browser/server clients, cookie-backed auth, a Next.js proxy for token refresh, server actions for mutations, and server-side identity checks before protected rendering.

Benefits: directly matches the PRD, current Supabase SSR guidance, existing App Router architecture, and KISS/YAGNI. It keeps authorization server-owned and avoids a custom session layer.

### 2. Client-only Supabase Auth

Rejected. It would make protected-route behavior and session authority depend too heavily on browser state and would weaken the server-first security boundary required by the repository.

### 3. Custom credentials/session service

Rejected. It duplicates Supabase Auth, increases security surface area, and has no PRD justification.

## Architecture

### Route boundaries

```text
/
  public marketing homepage

/auth/login
/auth/signup
/auth/forgot-password
/auth/reset-password
/auth/confirm
  public authentication and recovery boundary

/app
/app/profile
  authenticated application boundary
```

Use App Router route groups only for organization of code; URLs stay stable and explicit.

### Marketing boundary

The homepage is server-rendered, dependency-free, and usable without JavaScript. It contains:

- accessible header/navigation;
- hero with primary signup CTA and secondary “Watch demo” anchor;
- concise “how it works” flow;
- structured-interview/evidence/fairness capability sections;
- pricing placeholder driven by a typed local configuration object rather than hard-coded scattered copy;
- FAQ;
- closing CTA and footer.

Avoid unsupported customer logos, metrics, claims, testimonials, or product screenshots. Copy describes required/planned product capabilities without inventing adoption evidence.

### SEO

Root metadata provides a title template, description, Open Graph basics, and robots defaults. The homepage has one semantic H1, descriptive section headings, crawlable links, and no client-only critical content.

### Authentication boundary

Use current Supabase SSR cookie-based authentication:

- `src/lib/supabase/client.ts` creates the browser client;
- `src/lib/supabase/server.ts` creates a request-scoped server client from Next.js cookies;
- root `src/proxy.ts` refreshes/validates auth state for relevant requests and propagates changed cookies;
- protected server components validate identity with Supabase claims/user validation rather than trusting a client-provided session object;
- auth mutations run in server actions and return bounded, user-safe errors;
- no service-role key is exposed to the browser.

Required environment variables:

```text
NEXT_PUBLIC_SUPABASE_URL
NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY
```

Existing `NEXT_PUBLIC_APP_URL` remains the canonical application origin for redirect construction.

### Core auth flows

Signup:

1. validate email/password input server-side;
2. call Supabase `signUp` with an email redirect to `/auth/confirm`;
3. show a generic verification instruction state without leaking whether unrelated accounts exist.

Verification:

1. `/auth/confirm` accepts Supabase's token hash/type query parameters;
2. server exchanges/verifies the token;
3. redirect to `/app` on success or the login page with a bounded error state.

Login:

1. validate input;
2. call `signInWithPassword`;
3. redirect to `/app` after a validated session is established.

Logout:

1. server action calls `signOut`;
2. redirect to `/auth/login`.

Password recovery:

1. forgot-password action validates email and requests reset mail with `/auth/reset-password` redirect;
2. response remains generic;
3. reset-password action validates new-password rules and calls `updateUser` only in a valid recovery session;
4. successful reset returns to the authenticated app or login boundary according to Supabase session state.

### Protected app shell

`/app` and child routes are server-authoritative. Unauthenticated requests redirect to `/auth/login?next=/app`. Do not accept arbitrary external redirect targets; a helper allows only internal paths beginning with a single `/` and rejects protocol-relative or absolute URLs.

Authenticated shell includes product identity, user email, profile navigation, and logout. Organization switching/navigation is intentionally absent until M02.

### Basic profile

Create `public.profiles` with:

```sql
id uuid primary key references auth.users(id) on delete cascade
display_name text null check (char_length(display_name) <= 120)
created_at timestamptz not null default now()
updated_at timestamptz not null default now()
```

RLS is enabled. Authenticated users may select, insert, and update only their own row (`auth.uid() = id`). No cross-user read is required. Profile creation is lazy/upserted by the profile settings flow; no trigger is necessary for M01.

### Pricing configuration

Use a typed local configuration module for the placeholder tier and CTA. This is display configuration only; billing/entitlements remain M09 and must not be inferred from this placeholder.

## Error Handling

- Validate all form payloads before provider calls.
- Return stable form-level errors, not raw Supabase/internal exceptions.
- Treat verification/recovery tokens as secrets: never log them or reflect them into UI copy.
- Redirect helpers accept internal destinations only.
- Missing Supabase configuration fails fast through environment validation for auth-dependent code while the marketing page remains testable with explicit test inputs.
- Provider/network failures produce retry-safe errors and never alter hiring evidence or candidate state.

## Security

- Browser receives only Supabase publishable credentials.
- Session authority is server-side for protected routes.
- Never use `getSession()` user data as an authorization decision source.
- Cookie refresh occurs through the framework proxy pattern.
- RLS protects profile rows even if application-layer checks regress.
- Passwords/tokens are never logged or persisted by application code.
- Auth redirect destinations are allowlisted to internal application paths.
- Organization membership/tenant authorization is deferred to M02 rather than simulated here.

## Accessibility and Responsive Design

- semantic landmarks and heading order;
- visible keyboard focus states;
- labeled inputs with associated error/help text;
- status messages use appropriate live-region semantics where dynamic;
- controls have at least descriptive text, not icon-only ambiguity;
- layouts work from narrow mobile widths through desktop without horizontal scrolling;
- no hover-only information;
- respect reduced-motion preferences for any decorative motion.

## Testing Strategy

### Unit/component

- homepage identity, primary CTA, human-decision boundary, pricing config rendering, semantic navigation;
- metadata/config helpers;
- auth input validation and safe redirect helper;
- auth forms render labels/errors and pending/disabled states;
- app shell does not render protected content without validated identity in server-boundary tests where practical;
- profile validation.

### Integration

- server actions translate provider errors into stable application errors;
- confirm route validates token parameters;
- profile repository uses user ID from trusted auth context and never caller-selected arbitrary IDs.

### E2E

Without real provider credentials, deterministic browser coverage proves marketing/auth route rendering and protected-route redirect behavior using test seams where possible. Full provider-backed signup/verification/reset/profile E2E is required before M01 completion in an environment with configured Supabase credentials.

## Milestone Execution Order

1. marketing shell + SEO + typed pricing placeholder;
2. Supabase SSR infrastructure/environment boundary;
3. signup/login/logout/verification;
4. forgot/reset password;
5. protected application shell;
6. profile migration/RLS/settings;
7. accessibility and full E2E closeout.

Each step is independently reviewable and uses RED → GREEN → refactor for meaningful behavior.

## Non-Goals

- organizations, memberships, invitations, or RBAC;
- jobs/interviewer builder;
- candidate interview execution;
- AI assessment;
- billing enforcement;
- enterprise social login/SSO;
- speculative design-system package or component library.

## Success Criteria

M01 is complete only when all milestone deliverables are implemented, an authenticated user can enter `/app`, profile access is user-isolated, required accessibility/responsive scenarios pass, no Critical/Important review findings remain, and the exact final PR head passes all applicable CI/E2E/security gates.