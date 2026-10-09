begin;

select plan(17);

select has_function(
  'public',
  'list_support_access_reviews',
  array['uuid','integer','integer'],
  'support access review requires an explicit bounded projection RPC'
);

insert into auth.users (id,email,aud,role) values
  ('00000000-0000-0000-0000-000000000811','review-owner@example.test','authenticated','authenticated'),
  ('00000000-0000-0000-0000-000000000812','review-admin@example.test','authenticated','authenticated'),
  ('00000000-0000-0000-0000-000000000813','review-reviewer@example.test','authenticated','authenticated'),
  ('00000000-0000-0000-0000-000000000814','review-support@example.test','authenticated','authenticated'),
  ('00000000-0000-0000-0000-000000000815','review-other-owner@example.test','authenticated','authenticated');

insert into public.organizations (id,name,created_by) values
  ('00000000-0000-0000-0000-000000000820','Support Review Org','00000000-0000-0000-0000-000000000811'),
  ('00000000-0000-0000-0000-000000000821','Other Support Review Org','00000000-0000-0000-0000-000000000815');

insert into public.organization_memberships (organization_id,user_id,role) values
  ('00000000-0000-0000-0000-000000000820','00000000-0000-0000-0000-000000000811','owner'::public.organization_role),
  ('00000000-0000-0000-0000-000000000820','00000000-0000-0000-0000-000000000812','admin'::public.organization_role),
  ('00000000-0000-0000-0000-000000000820','00000000-0000-0000-0000-000000000813','reviewer'::public.organization_role),
  ('00000000-0000-0000-0000-000000000821','00000000-0000-0000-0000-000000000815','owner'::public.organization_role);

insert into public.support_access_grants (
  id, organization_id, actor_user_id, scope, reason, granted_at, expires_at, revoked_at
) values
  (
    '00000000-0000-0000-0000-000000000801',
    '00000000-0000-0000-0000-000000000820',
    '00000000-0000-0000-0000-000000000814',
    'read_incident_health',
    'active incident investigation',
    now() - interval '10 minutes',
    now() + interval '20 minutes',
    null
  ),
  (
    '00000000-0000-0000-0000-000000000802',
    '00000000-0000-0000-0000-000000000820',
    '00000000-0000-0000-0000-000000000814',
    'read_incident_health',
    'expired incident investigation',
    now() - interval '2 hours',
    now() - interval '90 minutes',
    null
  ),
  (
    '00000000-0000-0000-0000-000000000803',
    '00000000-0000-0000-0000-000000000820',
    '00000000-0000-0000-0000-000000000814',
    'read_incident_health',
    'revoked incident investigation',
    now() - interval '20 minutes',
    now() + interval '10 minutes',
    now() - interval '5 minutes'
  ),
  (
    '00000000-0000-0000-0000-000000000804',
    '00000000-0000-0000-0000-000000000821',
    '00000000-0000-0000-0000-000000000814',
    'read_incident_health',
    'other tenant investigation',
    now() - interval '10 minutes',
    now() + interval '20 minutes',
    null
  );

create temporary table support_review_projection (
  grant_id uuid,
  support_actor_user_id uuid,
  scope text,
  reason text,
  granted_at timestamptz,
  expires_at timestamptz,
  revoked_at timestamptz,
  status text
) on commit drop;

grant select, insert, truncate on table support_review_projection to authenticated;

set local role authenticated;

select set_config('request.jwt.claim.sub','00000000-0000-0000-0000-000000000813',true);
select throws_ok(
  $sql$select * from public.list_support_access_reviews(
    '00000000-0000-0000-0000-000000000820'::uuid, 50, 0
  )$sql$,
  '42501',
  null,
  'reviewer cannot inspect privileged support access reviews'
);

select set_config('request.jwt.claim.sub','00000000-0000-0000-0000-000000000815',true);
select throws_ok(
  $sql$select * from public.list_support_access_reviews(
    '00000000-0000-0000-0000-000000000820'::uuid, 50, 0
  )$sql$,
  '42501',
  null,
  'owner cannot inspect another tenant support access reviews'
);

select set_config('request.jwt.claim.sub','00000000-0000-0000-0000-000000000811',true);
select throws_ok(
  $sql$select * from public.list_support_access_reviews(
    '00000000-0000-0000-0000-000000000820'::uuid, 0, 0
  )$sql$,
  '22023',
  null,
  'review projection rejects a zero page size'
);
select throws_ok(
  $sql$select * from public.list_support_access_reviews(
    '00000000-0000-0000-0000-000000000820'::uuid, 101, 0
  )$sql$,
  '22023',
  null,
  'review projection rejects an oversized page'
);
select throws_ok(
  $sql$select * from public.list_support_access_reviews(
    '00000000-0000-0000-0000-000000000820'::uuid, 50, -1
  )$sql$,
  '22023',
  null,
  'review projection rejects a negative offset'
);

select lives_ok(
  $sql$insert into support_review_projection
    select * from public.list_support_access_reviews(
      '00000000-0000-0000-0000-000000000820'::uuid, 50, 0
    )$sql$,
  'owner can read the bounded same-tenant support lifecycle projection'
);

select is((select count(*)::integer from support_review_projection), 3,
  'owner sees only the three same-tenant support grants');
select is((select count(*)::integer from support_review_projection where scope = 'read_incident_health'), 3,
  'projection exposes only the fixed operational support scope');
select is((select count(*)::integer from support_review_projection where status = 'active'), 1,
  'projection identifies active support access');
select is((select count(*)::integer from support_review_projection where status = 'expired'), 1,
  'projection identifies expired support access');
select is((select count(*)::integer from support_review_projection where status = 'revoked'), 1,
  'projection identifies revoked support access');

truncate support_review_projection;
select lives_ok(
  $sql$insert into support_review_projection
    select * from public.list_support_access_reviews(
      '00000000-0000-0000-0000-000000000820'::uuid, 2, 0
    )$sql$,
  'owner can request a bounded review page'
);
select is((select count(*)::integer from support_review_projection), 2,
  'bounded review page enforces the requested limit');

truncate support_review_projection;
select set_config('request.jwt.claim.sub','00000000-0000-0000-0000-000000000812',true);
select lives_ok(
  $sql$insert into support_review_projection
    select * from public.list_support_access_reviews(
      '00000000-0000-0000-0000-000000000820'::uuid, 50, 0
    )$sql$,
  'admin can read the same-tenant support lifecycle projection'
);
select is((select count(*)::integer from support_review_projection), 3,
  'admin sees the same safe tenant-scoped lifecycle records');

select throws_ok(
  $sql$select count(*) from public.support_access_grants$sql$,
  '42501',
  null,
  'authorized reviewers still cannot bypass the projection with direct table access'
);

select * from finish();
rollback;
