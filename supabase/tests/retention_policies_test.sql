begin;

select plan(7);

select has_table('public', 'organization_retention_policies', 'M11 retention policies are persisted per organization');
select has_function(
  'public',
  'set_organization_retention_policy',
  array['uuid','integer','integer','integer','integer'],
  'authorized retention policy mutation RPC exists'
);

insert into auth.users (id,email,aud,role) values
  ('00000000-0000-0000-0000-000000000401','retention-owner@example.test','authenticated','authenticated'),
  ('00000000-0000-0000-0000-000000000402','retention-reviewer@example.test','authenticated','authenticated');
insert into public.organizations (id,name,created_by) values
  ('00000000-0000-0000-0000-000000000410','Retention Org','00000000-0000-0000-0000-000000000401');
insert into public.organization_memberships (organization_id,user_id,role) values
  ('00000000-0000-0000-0000-000000000410','00000000-0000-0000-0000-000000000401','owner'::public.organization_role),
  ('00000000-0000-0000-0000-000000000410','00000000-0000-0000-0000-000000000402','reviewer'::public.organization_role);

set local role authenticated;
select set_config('request.jwt.claim.sub','00000000-0000-0000-0000-000000000402',true);
select throws_ok(
  $$select public.set_organization_retention_policy('00000000-0000-0000-0000-000000000410'::uuid,90,180,365,30)$$,
  '42501',
  null,
  'non-admin member cannot mutate organization retention policy'
);

select set_config('request.jwt.claim.sub','00000000-0000-0000-0000-000000000401',true);
select lives_ok(
  $$select public.set_organization_retention_policy('00000000-0000-0000-0000-000000000410'::uuid,90,180,365,30)$$,
  'owner can set explicit bounded retention policy'
);
select is(
  (select transcript_days from public.organization_retention_policies where organization_id='00000000-0000-0000-0000-000000000410'::uuid),
  90,
  'effective persisted policy uses the explicit organization value'
);
select is(
  (select count(*) from public.audit_events where organization_id='00000000-0000-0000-0000-000000000410'::uuid and action='retention_policy.updated'),
  1::bigint,
  'retention policy mutation emits immutable organization audit evidence'
);
select throws_ok(
  $$select public.set_organization_retention_policy('00000000-0000-0000-0000-000000000410'::uuid,0,180,365,30)$$,
  '22023',
  null,
  'database rejects retention windows outside the bounded policy contract'
);

select * from finish();
rollback;
