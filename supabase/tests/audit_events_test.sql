begin;

select plan(8);

select has_table('public', 'audit_events', 'M11 audit events are persisted');
select ok(has_table_privilege('authenticated', 'public.audit_events', 'SELECT'), 'authenticated members can read tenant audit events through RLS');
select ok(not has_table_privilege('authenticated', 'public.audit_events', 'INSERT'), 'authenticated clients cannot insert audit events directly');
select ok(not has_table_privilege('authenticated', 'public.audit_events', 'UPDATE'), 'audit events are append-only to authenticated clients');
select ok(not has_table_privilege('authenticated', 'public.audit_events', 'DELETE'), 'audit events cannot be deleted by authenticated clients');

insert into auth.users (id,email,aud,role) values
  ('00000000-0000-0000-0000-000000000001','audit-a@example.test','authenticated','authenticated'),
  ('00000000-0000-0000-0000-000000000002','audit-b@example.test','authenticated','authenticated');
insert into public.organizations (id,name,created_by) values
  ('00000000-0000-0000-0000-000000000010','Audit Org A','00000000-0000-0000-0000-000000000001'),
  ('00000000-0000-0000-0000-000000000020','Audit Org B','00000000-0000-0000-0000-000000000002');
insert into public.organization_memberships (organization_id,user_id,role) values
  ('00000000-0000-0000-0000-000000000010','00000000-0000-0000-0000-000000000001','reviewer'::public.organization_role),
  ('00000000-0000-0000-0000-000000000020','00000000-0000-0000-0000-000000000002','reviewer'::public.organization_role);

insert into public.audit_events
  (id, organization_id, actor_user_id, action, resource_type, resource_id, occurred_at, provenance_id, metadata)
values
  ('00000000-0000-0000-0000-000000000101','00000000-0000-0000-0000-000000000010','00000000-0000-0000-0000-000000000001','review.viewed','candidate_review','00000000-0000-0000-0000-000000000201',now(),'00000000-0000-0000-0000-000000000301','{}'::jsonb),
  ('00000000-0000-0000-0000-000000000102','00000000-0000-0000-0000-000000000020','00000000-0000-0000-0000-000000000002','review.viewed','candidate_review','00000000-0000-0000-0000-000000000202',now(),'00000000-0000-0000-0000-000000000302','{}'::jsonb);

set local role authenticated;
select set_config('request.jwt.claim.sub','00000000-0000-0000-0000-000000000001',true);
select is((select count(*) from public.audit_events), 1::bigint, 'RLS exposes only the current member organization audit events');
select is((select organization_id from public.audit_events limit 1), '00000000-0000-0000-0000-000000000010'::uuid, 'visible audit event belongs to the current organization');
select throws_ok($$update public.audit_events set action='tampered'$$, '42501', null, 'authenticated member cannot mutate immutable audit events');

select * from finish();
rollback;
