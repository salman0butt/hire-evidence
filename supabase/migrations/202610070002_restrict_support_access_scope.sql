alter table public.support_access_grants
  add constraint support_access_grants_scope_check
  check (scope = 'read_incident_health');
