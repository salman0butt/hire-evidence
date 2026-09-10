# Supabase Auth Setup

This repository uses cookie-backed Supabase SSR authentication. Application code alone is not sufficient for provider-backed email verification: the Supabase project must send the confirmation token hash to the server confirmation route.

## Required project settings

1. Set the Supabase Auth **Site URL** to the deployed application origin represented by `NEXT_PUBLIC_APP_URL`.
2. Add the deployed `/auth/confirm` URL to the Supabase Auth redirect allow list for each environment that will run signup verification.
3. In **Auth → Email Templates → Confirm signup**, use a server-side confirmation link that sends the token hash to this application:

```html
<a href="{{ .SiteURL }}/auth/confirm?token_hash={{ .TokenHash }}&type=email">
  Confirm email address
</a>
```

The application route `src/app/(auth)/auth/confirm/route.ts` validates the expected token parameters, calls `supabase.auth.verifyOtp`, stores the resulting session through the SSR cookie adapter, and redirects without reflecting the token into UI output.

## Security constraints

- Never place a Supabase secret/service-role key in `NEXT_PUBLIC_*` variables or browser code.
- Treat `token_hash` values as secrets. Do not log them, persist them, or include them in application error messages.
- Keep redirect URLs constrained to owned application origins.
- Provider-backed signup/verification testing is still required before M01 is complete; placeholder CI credentials do not prove provider behavior.

## Provider-backed verification checklist

- signup sends a confirmation email;
- the email link targets `/auth/confirm` with `token_hash` and `type=email`;
- a valid link creates the cookie-backed session and reaches the authenticated application boundary once that boundary is implemented;
- malformed, expired, or reused links return to the bounded verification-error state;
- no token appears in logs or rendered error text.

Reference: Supabase's current Next.js server-side Auth tutorial documents the same token-hash email-template requirement and `verifyOtp` confirmation endpoint pattern.
