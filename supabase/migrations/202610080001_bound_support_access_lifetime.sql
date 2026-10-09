alter table public.support_access_grants
  add constraint support_access_grants_lifetime_check
  check (
    expires_at > granted_at
    and expires_at <= granted_at + interval '1 hour'
  );
