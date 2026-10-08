begin;

select plan(6);

select has_table(
  'public',
  'support_access_grants',
  'privileged support access grants are persisted'
);

insert into auth.users (id,email,aud,role) values
  ('00000000-0000-0000-0000-000000000701','support-actor@example.test','authenticated','authenticated');
insert into public.organizations (id,name,created_by) values
  ('00000000-0000-0000-0000-000000000710','Support Access Org','00000000-0000-0000-0000-000000000701');

select throws_ok(
  $$insert into public.support_access_grants (
    organization_id,
    actor_user_id,
    scope,
    reason,
    granted_at,
    expires_at
  ) values (
    '00000000-0000-0000-0000-000000000710'::uuid,
    '00000000-0000-0000-0000-000000000701'::uuid,
    'write_candidate_score',
    'customer-requested-investigation',
    '2026-10-07T12:00:00Z'::timestamptz,
    '2026-10-07T13:00:00Z'::timestamptz
  )$$,
  '23514',
  null,
  'database rejects support access outside the least-privilege incident-health scope'
);

select throws_ok(
  $$insert into public.support_access_grants (
    organization_id,
    actor_user_id,
    scope,
    reason,
    granted_at,
    expires_at
  ) values (
    '00000000-0000-0000-0000-000000000710'::uuid,
    '00000000-0000-0000-0000-000000000701'::uuid,
    'read_incident_health',
    '   ',
    '2026-10-07T12:00:00Z'::timestamptz,
    '2026-10-07T13:00:00Z'::timestamptz
  )$$,
  '23514',
  null,
  'database rejects blank support access reasons'
);

select lives_ok(
  $sql$insert into public.support_access_grants (
    organization_id,
    actor_user_id,
    scope,
    reason,
    granted_at,
    expires_at
  ) values (
    '00000000-0000-0000-0000-000000000710'::uuid,
    '00000000-0000-0000-0000-000000000701'::uuid,
    'read_incident_health',
    'one-hour-investigation',
    '2026-10-07T12:00:00Z'::timestamptz,
    '2026-10-07T13:00:00Z'::timestamptz
  )$sql$,
  'database permits the one-hour least-privilege lifetime boundary'
);

select throws_ok(
  $sql$insert into public.support_access_grants (
    organization_id,
    actor_user_id,
    scope,
    reason,
    granted_at,
    expires_at
  ) values (
    '00000000-0000-0000-0000-000000000710'::uuid,
    '00000000-0000-0000-0000-000000000701'::uuid,
    'read_incident_health',
    'zero-duration-investigation',
    '2026-10-07T12:00:00Z'::timestamptz,
    '2026-10-07T12:00:00Z'::timestamptz
  )$sql$,
  '23514',
  null,
  'database rejects support access with a non-positive lifetime'
);

select throws_ok(
  $sql$insert into public.support_access_grants (
    organization_id,
    actor_user_id,
    scope,
    reason,
    granted_at,
    expires_at
  ) values (
    '00000000-0000-0000-0000-000000000710'::uuid,
    '00000000-0000-0000-0000-000000000701'::uuid,
    'read_incident_health',
    'overlong-investigation',
    '2026-10-07T12:00:00Z'::timestamptz,
    '2026-10-07T13:00:00.001Z'::timestamptz
  )$sql$,
  '23514',
  null,
  'database rejects support access lasting longer than one hour'
);

select * from finish();
rollback;
