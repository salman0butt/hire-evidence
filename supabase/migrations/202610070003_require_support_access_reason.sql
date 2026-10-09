alter table public.support_access_grants
  add constraint support_access_grants_reason_check
  check (char_length(btrim(reason)) >= 1);
