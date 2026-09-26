begin;

select plan(8);

select has_function(
  'public', 'delete_candidate_data', array['uuid', 'uuid'],
  'candidate deletion is an explicit tenant-scoped database RPC'
);

insert into auth.users (id, email, aud, role) values
  ('00000000-0000-0000-0000-000000000501', 'deletion-owner@example.test', 'authenticated', 'authenticated'),
  ('00000000-0000-0000-0000-000000000502', 'deletion-reviewer@example.test', 'authenticated', 'authenticated');
insert into public.organizations (id, name, created_by) values
  ('00000000-0000-0000-0000-000000000510', 'Deletion Org A', '00000000-0000-0000-0000-000000000501'),
  ('00000000-0000-0000-0000-000000000520', 'Deletion Org B', '00000000-0000-0000-0000-000000000501');
insert into public.organization_memberships (organization_id, user_id, role) values
  ('00000000-0000-0000-0000-000000000510', '00000000-0000-0000-0000-000000000501', 'owner'::public.organization_role),
  ('00000000-0000-0000-0000-000000000510', '00000000-0000-0000-0000-000000000502', 'reviewer'::public.organization_role);
insert into public.jobs (id, organization_id, title, created_by) values
  ('00000000-0000-0000-0000-000000000530', '00000000-0000-0000-0000-000000000510', 'Deletion A role', '00000000-0000-0000-0000-000000000501'),
  ('00000000-0000-0000-0000-000000000540', '00000000-0000-0000-0000-000000000520', 'Deletion B role', '00000000-0000-0000-0000-000000000501');
insert into public.candidates (id, organization_id, job_id, full_name, email, created_by) values
  ('00000000-0000-0000-0000-000000000550', '00000000-0000-0000-0000-000000000510', '00000000-0000-0000-0000-000000000530', 'Deletion Candidate A', 'delete-a@example.test', '00000000-0000-0000-0000-000000000501'),
  ('00000000-0000-0000-0000-000000000560', '00000000-0000-0000-0000-000000000520', '00000000-0000-0000-0000-000000000540', 'Deletion Candidate B', 'delete-b@example.test', '00000000-0000-0000-0000-000000000501');

set local role authenticated;
select set_config('request.jwt.claim.sub', '00000000-0000-0000-0000-000000000502', true);
select throws_ok(
  $$select public.delete_candidate_data('00000000-0000-0000-0000-000000000510'::uuid, '00000000-0000-0000-0000-000000000550'::uuid)$$,
  '42501', 'Owner or admin role required.',
  'reviewers cannot erase candidate data'
);

select set_config('request.jwt.claim.sub', '00000000-0000-0000-0000-000000000501', true);
select throws_ok(
  $$select public.delete_candidate_data('00000000-0000-0000-0000-000000000520'::uuid, '00000000-0000-0000-0000-000000000560'::uuid)$$,
  '42501', 'Owner or admin role required.',
  'owner of another tenant cannot erase candidate data'
);
select lives_ok(
  $$select public.delete_candidate_data('00000000-0000-0000-0000-000000000510'::uuid, '00000000-0000-0000-0000-000000000550'::uuid)$$,
  'owner can request explicit tenant-scoped deletion'
);
reset role;

select is(
  (select count(*) from public.candidates where id = '00000000-0000-0000-0000-000000000550'::uuid),
  0::bigint,
  'successful deletion removes candidate identifying data'
);
select is(
  (select count(*) from public.candidates where id = '00000000-0000-0000-0000-000000000560'::uuid),
  1::bigint,
  'other tenant candidate is untouched'
);

set local role authenticated;
select set_config('request.jwt.claim.sub', '00000000-0000-0000-0000-000000000501', true);
select lives_ok(
  $$select public.delete_candidate_data('00000000-0000-0000-0000-000000000510'::uuid, '00000000-0000-0000-0000-000000000550'::uuid)$$,
  'retrying an already completed deletion is idempotent'
);
reset role;
select is(
  (select count(*) from public.audit_events where organization_id = '00000000-0000-0000-0000-000000000510'::uuid and action = 'candidate_data.deleted'),
  1::bigint,
  'retry never creates duplicate deletion audit evidence'
);

select * from finish();
rollback;
