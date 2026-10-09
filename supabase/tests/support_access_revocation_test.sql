begin;

select plan(13);

select has_function(
  'public',
  'revoke_support_access',
  array['uuid','uuid'],
  'support access revocation requires an explicit authorized RPC'
);

insert into auth.users (id,email,aud,role) values
  ('00000000-0000-0000-0000-000000000781','revoke-owner@example.test','authenticated','authenticated'),
  ('00000000-0000-0000-0000-000000000782','revoke-admin@example.test','authenticated','authenticated'),
  ('00000000-0000-0000-0000-000000000783','revoke-reviewer@example.test','authenticated','authenticated'),
  ('00000000-0000-0000-0000-000000000784','revoke-support-actor@example.test','authenticated','authenticated'),
  ('00000000-0000-0000-0000-000000000785','revoke-other-owner@example.test','authenticated','authenticated');

insert into public.organizations (id,name,created_by) values
  ('00000000-0000-0000-0000-000000000790','Revocation Org','00000000-0000-0000-0000-000000000781'),
  ('00000000-0000-0000-0000-000000000791','Other Revocation Org','00000000-0000-0000-0000-000000000785');

insert into public.organization_memberships (organization_id,user_id,role) values
  ('00000000-0000-0000-0000-000000000790','00000000-0000-0000-0000-000000000781','owner'::public.organization_role),
  ('00000000-0000-0000-0000-000000000790','00000000-0000-0000-0000-000000000782','admin'::public.organization_role),
  ('00000000-0000-0000-0000-000000000790','00000000-0000-0000-0000-000000000783','reviewer'::public.organization_role),
  ('00000000-0000-0000-0000-000000000791','00000000-0000-0000-0000-000000000785','owner'::public.organization_role);

insert into public.support_access_grants (
  id,
  organization_id,
  actor_user_id,
  scope,
  reason,
  granted_at,
  expires_at
) values
  (
    '00000000-0000-0000-0000-000000000771',
    '00000000-0000-0000-0000-000000000790',
    '00000000-0000-0000-0000-000000000784',
    'read_incident_health',
    'owner-revocation-fixture',
    now(),
    now() + interval '30 minutes'
  ),
  (
    '00000000-0000-0000-0000-000000000772',
    '00000000-0000-0000-0000-000000000790',
    '00000000-0000-0000-0000-000000000784',
    'read_incident_health',
    'admin-revocation-fixture',
    now(),
    now() + interval '30 minutes'
  ),
  (
    '00000000-0000-0000-0000-000000000773',
    '00000000-0000-0000-0000-000000000791',
    '00000000-0000-0000-0000-000000000784',
    'read_incident_health',
    'other-tenant-fixture',
    now(),
    now() + interval '30 minutes'
  );

set local role authenticated;

select set_config('request.jwt.claim.sub','00000000-0000-0000-0000-000000000783',true);
select throws_ok(
  $sql$select public.revoke_support_access(
    '00000000-0000-0000-0000-000000000790'::uuid,
    '00000000-0000-0000-0000-000000000771'::uuid
  )$sql$,
  '42501',
  null,
  'reviewer cannot revoke a support grant'
);

select set_config('request.jwt.claim.sub','00000000-0000-0000-0000-000000000781',true);
select throws_ok(
  $sql$select public.revoke_support_access(
    '00000000-0000-0000-0000-000000000791'::uuid,
    '00000000-0000-0000-0000-000000000773'::uuid
  )$sql$,
  '42501',
  null,
  'owner cannot revoke another tenant grant'
);

select lives_ok(
  $sql$select public.revoke_support_access(
    '00000000-0000-0000-0000-000000000790'::uuid,
    '00000000-0000-0000-0000-000000000771'::uuid
  )$sql$,
  'owner can revoke an in-tenant support grant'
);

select set_config('request.jwt.claim.sub','00000000-0000-0000-0000-000000000782',true);
select lives_ok(
  $sql$select public.revoke_support_access(
    '00000000-0000-0000-0000-000000000790'::uuid,
    '00000000-0000-0000-0000-000000000772'::uuid
  )$sql$,
  'admin can revoke an in-tenant support grant'
);

select lives_ok(
  $sql$select public.revoke_support_access(
    '00000000-0000-0000-0000-000000000790'::uuid,
    '00000000-0000-0000-0000-000000000772'::uuid
  )$sql$,
  'repeated revocation is idempotent'
);

select throws_ok(
  $sql$update public.support_access_grants
       set revoked_at = null
     where id = '00000000-0000-0000-0000-000000000771'::uuid$sql$,
  '42501',
  null,
  'authenticated clients cannot directly undo revocation'
);

reset role;

select is(
  (
    select count(*)::integer
    from public.support_access_grants
    where organization_id = '00000000-0000-0000-0000-000000000790'::uuid
      and revoked_at is not null
  ),
  2,
  'both authorized revocations persist server-generated timestamps'
);

select is(
  (
    select count(*)::integer
    from public.audit_events
    where organization_id = '00000000-0000-0000-0000-000000000790'::uuid
      and action = 'support_access.revoked'
      and resource_type = 'support_access_grant'
  ),
  2,
  'idempotent revocation emits one audit event per actual transition'
);

select is(
  (
    select count(*)::integer
    from public.audit_events
    where action = 'support_access.revoked'
      and (
        (resource_id = '00000000-0000-0000-0000-000000000771'::uuid
          and actor_user_id = '00000000-0000-0000-0000-000000000781'::uuid)
        or
        (resource_id = '00000000-0000-0000-0000-000000000772'::uuid
          and actor_user_id = '00000000-0000-0000-0000-000000000782'::uuid)
      )
  ),
  2,
  'audit events identify the actual revoking owner/admin and grant'
);

select is(
  (
    select count(*)::integer
    from public.audit_events
    where action = 'support_access.revoked'
      and metadata ->> 'scope' = 'read_incident_health'
      and metadata ? 'revoked_at'
      and not (metadata ? 'reason')
  ),
  2,
  'revocation audit metadata retains only allow-listed operational scope and timestamp'
);

select is(
  (
    select count(*)::integer
    from public.support_access_grants
    where id = '00000000-0000-0000-0000-000000000773'::uuid
      and revoked_at is null
  ),
  1,
  'cross-tenant grant remains untouched'
);

select is(
  (
    select count(*)::integer
    from public.audit_events
    where organization_id = '00000000-0000-0000-0000-000000000791'::uuid
      and action = 'support_access.revoked'
  ),
  0,
  'unauthorized cross-tenant attempts emit no misleading audit transition'
);

select * from finish();
rollback;
