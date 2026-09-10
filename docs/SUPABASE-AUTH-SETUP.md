# Supabase Auth and Profile Setup

This repository uses cookie-backed Supabase SSR authentication. Application code alone is not sufficient for provider-backed verification: the Supabase project must be configured for auth flows and the profile migration must run in a safe test/deployment environment.

## Required project settings

1. Set the Supabase Auth **Site URL** to the deployed application origin represented by `NEXT_PUBLIC_APP_URL`.
2. Add the deployed `/auth/confirm` and recovery URLs to the Supabase Auth redirect allow list for each verification environment.
3. In **Auth → Email Templates → Confirm signup**, use a server-side confirmation link that sends the token hash to this application:

```html
<a href="{{ .SiteURL }}/auth/confirm?token_hash={{ .TokenHash }}&type=email">
  Confirm email address
</a>
```

The application confirmation route validates expected token parameters, calls `supabase.auth.verifyOtp`, stores the resulting session through the SSR cookie adapter, and redirects without reflecting the token into UI output.

## Profile database setup

Apply `supabase/migrations/20260910_create_profiles.sql` through the normal Supabase migration workflow for the target environment. The migration creates `public.profiles`, enables RLS, and grants authenticated users select/insert/update only through policies constrained to `auth.uid() = id`.

Do not call profile isolation verified from SQL inspection alone. Before M01 completion, create/use two safe test identities and prove through authenticated clients that:

- User A can insert/read/update User A's own profile;
- User B can insert/read/update User B's own profile;
- User A cannot select or update User B's row;
- User B cannot select or update User A's row;
- forged owner identifiers supplied by application form data cannot change the authenticated user's row ownership.

## Security constraints

- Never place a Supabase secret/service-role key in `NEXT_PUBLIC_*` variables or browser code.
- Treat `token_hash` values as secrets. Do not log them, persist them, or include them in application error messages.
- Keep redirect URLs constrained to owned application origins.
- Perform RLS verification through normal authenticated user clients; a service-role client bypasses RLS and is not valid isolation evidence.
- Placeholder CI credentials do not prove provider or database behavior.

## Provider-backed verification checklist

- signup sends a confirmation email and verification reaches the authenticated app;
- malformed, expired, or reused verification links reach the bounded error state;
- forgot/reset password works without account enumeration;
- logout removes the intended session;
- authenticated `/app` and `/app/profile` access succeeds;
- own profile updates persist;
- cross-user profile reads/updates are denied by RLS;
- no token or secret appears in logs or rendered error text.