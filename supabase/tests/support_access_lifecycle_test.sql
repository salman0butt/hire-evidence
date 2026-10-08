begin;

select plan(11);

select has_function(
  'public',
  'grant_support_access',
  array['uuid','uuid','text','timestamp with time zone'],
  'support access grants are created through an explicit server-authoritative RPC'
);

insert into auth.users (id,email,aud,role) values
  ('00000000-0000-0000-0000-000000000721','support-owner@example.test','authenticated','authenticated'),
  ('00000000-0000-0000-0000-000000000722','support-admin@example.test','authenticated','authenticated'),
  ('00000000-0000-0000-0000-000000000723','support-reviewer@example.test','authenticated','authenticated'),
  ('00000000-0000-0000-0000-000000000724','support-actor@example.test','authenticated','authenticated'),
  ('00000000-0000-0000-0000-000000000725','other-owner@example.test','authenticated','authenticated');

insert into public.organizations (id,name,created_by) values
  ('00000000-0000-0000-0000-000000000730','Support Lifecycle Org','00000000-0000-0000-0000-000000000721'),
  ('00000000-0000-0000-0000-000000000731','Other Support Org','00000000-0000-0000-0000-000000000725');

insert into public.organization_memberships (organization_id,user_id,role) values
  ('00000000-0000-0000-0000-000000000730','00000000-0000-0000-0000-000000000721','owner'::public.organization_role),
  ('00000000-0000-0000-0000-000000000730','00000000-0000-0000-0000-000000000722','admin'::public.organization_role),
  ('00000000-0000-0000-0000-000000000730','00000000-0000-0000-0000-000000000723','reviewer'::public.organization_role),
  ('00000000-0000-0000-0000-000000000731','00000000-0000-0000-0000-000000000725','owner'::public.organization_role);

set local role authenticated;

select set_config('request.jwt.claim.sub','00000000-0000-0000-0000-000000000723',true);
select throws_ok(
  $sql$select public.grant_support_access(
    '00000000-0000-0000-0000-000000000730'::uuid,
    '00000000-0000-0000-0000-000000000724'::uuid,
    'reviewer-must-not-grant-support-access',
    now() + interval '30 minutes'
  )$sql$,
  '42501',
  null,
  'reviewer cannot grant privileged support access'
);

select set_config('request.jwt.claim.sub','00000000-0000-0000-0000-000000000721',true);
select throws_ok(
  $sql$select public.grant_support_access(
    '00000000-0000-0000-0000-000000000731'::uuid,
    '00000000-0000-0000-0000-000000000724'::uuid,
    'cross-tenant-grant-must-fail',
    now() + interval '30 minutes'
  )$sql$,
  '42501',
  null,
  'owner cannot grant support access into another organization'
);

select lives_ok(
  $sql$select public.grant_support_access(
    '00000000-0000-0000-0000-000000000730'::uuid,
    '00000000-0000-0000-0000-000000000724'::uuid,
    'owner-approved-incident-investigation',
    now() + interval '30 minutes'
  )$sql$,
  'owner can grant bounded same-tenant support access'
);

select set_config('request.jwt.claim.sub','00000000-0000-0000-0000-000000000722',true);
select lives_ok(
  $sql$select public.grant_support_access(
    '00000000-0000-0000-0000-000000000730'::uuid,
    '00000000-0000-0000-0000-000000000724'::uuid,
    'admin-approved-incident-investigation',
    now() + interval '45 minutes'
  )$sql$,
  'admin can grant bounded same-tenant support access'
);

reset role;

select is(
  (
    select count(*)::integer
    from public.support_access_grants
    where organization_id = '00000000-0000-0000-0000-000000000730'::uuid
  ),
  2,
  'only the two authorized support grants are persisted'
);

select is(
  (
    select count(*)::integer
    from public.support_access_grants
    where organization_id = '00000000-0000-0000-0000-000000000730'::uuid
      and scope = 'read_incident_health'
      and granted_at = now()
      and expires_at > granted_at
      and expires_at <= granted_at + interval '1 hour'
  ),
  2,
  'successful grants use fixed least-privilege scope and server-authoritative bounded time'
);

select is(
  (
    select count(*)::integer
    from public.support_access_grants
    where organization_id = '00000000-0000-0000-0000-000000000730'::uuid
      and actor_user_id = '00000000-0000-0000-0000-000000000724'::uuid
      and reason in (
        'owner-approved-incident-investigation',
        'admin-approved-incident-investigation'
      )
  ),
  2,
  'successful grants preserve explicit support actor and reason attribution'
);

select is(
  (
    select count(*)::integer
    from public.audit_events
    where organization_id = '00000000-0000-0000-0000-000000000730'::uuid
      and action = 'support_access.granted'
      and resource_type = 'support_access_grant'
  ),
  2,
  'each authorized grant emits one immutable organization audit event'
);

select is(
  (
    select count(*)::integer
    from public.audit_events as audit_event
    where audit_event.organization_id = '00000000-0000-0000-0000-000000000730'::uuid
      and audit_event.action = 'support_access.granted'
      and audit_event.actor_user_id in (
        '00000000-0000-0000-0000-000000000721'::uuid,
        '00000000-0000-0000-0000-000000000722'::uuid
      )
      and audit_event.resource_id in (
        select support_grant.id
        from public.support_access_grants as support_grant
        where support_grant.organization_id = '00000000-0000-0000-0000-000000000730'::uuid
      )
  ),
  2,
  'grant audit events attribute the authorizing owner/admin and exact persisted grant'
);

select is(
  (
    select count(*)::integer
    from public.audit_events
    where organization_id = '00000000-0000-0000-0000-000000000730'::uuid
      and action = 'support_access.granted'
      and metadata ? 'support_actor_user_id'
      and metadata ? 'scope'
      and metadata ? 'expires_at'
      and metadata ->> 'scope' = 'read_incident_health'
      and not (metadata ? 'reason')
  ),
  2,
  'audit metadata records bounded support identity/scope/expiry without duplicating free-form reason'
);

select * from finish();
rollback;
