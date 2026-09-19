begin;

select plan(13);

select has_function(
  'public',
  'create_candidate_review_score_override',
  array['uuid', 'uuid', 'uuid', 'uuid', 'uuid', 'text', 'integer', 'text'],
  'M08 human review exposes an append-only score override RPC'
);
select ok(has_function_privilege('authenticated', 'public.create_candidate_review_score_override(uuid,uuid,uuid,uuid,uuid,text,integer,text)', 'EXECUTE'), 'authenticated hiring users can execute the score override RPC');
select ok(not has_function_privilege('anon', 'public.create_candidate_review_score_override(uuid,uuid,uuid,uuid,uuid,text,integer,text)', 'EXECUTE'), 'anonymous users cannot execute the score override RPC');
select ok(not has_table_privilege('authenticated', 'public.candidate_review_score_overrides', 'INSERT'), 'authenticated clients cannot bypass the audited RPC with direct inserts');

set local role authenticated;
select throws_ok(
  $$select public.create_candidate_review_score_override('00000000-0000-0000-0000-000000000010','00000000-0000-0000-0000-000000000020','00000000-0000-0000-0000-000000000030','00000000-0000-0000-0000-000000000080','00000000-0000-0000-0000-000000000099','00000000-0000-0000-0000-000000000090',4,'Independent review supports this score.')$$,
  '42501', 'Authentication required.', 'the RPC fails closed without an authenticated actor'
);
reset role;

insert into auth.users (id, email, aud, role) values ('00000000-0000-0000-0000-000000000001','reviewer@example.test','authenticated','authenticated');
insert into public.organizations (id,name,created_by) values
('00000000-0000-0000-0000-000000000010','Review Org','00000000-0000-0000-0000-000000000001'),
('00000000-0000-0000-0000-000000000011','Other Org','00000000-0000-0000-0000-000000000001');
insert into public.organization_memberships (organization_id,user_id,role) values ('00000000-0000-0000-0000-000000000010','00000000-0000-0000-0000-000000000001','reviewer'::public.organization_role);
insert into public.jobs (id,organization_id,title,created_by) values
('00000000-0000-0000-0000-000000000020','00000000-0000-0000-0000-000000000010','Senior Platform Engineer','00000000-0000-0000-0000-000000000001'),
('00000000-0000-0000-0000-000000000021','00000000-0000-0000-0000-000000000010','Staff Backend Engineer','00000000-0000-0000-0000-000000000001');
insert into public.candidates (id,organization_id,job_id,full_name,email,created_by) values
('00000000-0000-0000-0000-000000000030','00000000-0000-0000-0000-000000000010','00000000-0000-0000-0000-000000000020','Ada Candidate','ada@example.test','00000000-0000-0000-0000-000000000001');
insert into public.interview_plans (id,organization_id,job_id,total_duration_seconds) values ('00000000-0000-0000-0000-000000000040','00000000-0000-0000-0000-000000000010','00000000-0000-0000-0000-000000000020',900);
insert into public.interviewer_configs (id,organization_id,job_id,plan_id,name,interview_type,persona,language,duration_seconds,difficulty,question_mode,max_follow_ups_per_question,status,published_at) values
('00000000-0000-0000-0000-000000000050','00000000-0000-0000-0000-000000000010','00000000-0000-0000-0000-000000000020','00000000-0000-0000-0000-000000000040','Review Interviewer','technical','professional','en',900,'medium','fixed',0,'published',now());
insert into public.interviewer_versions (id,organization_id,job_id,interviewer_config_id,version_number,snapshot,platform_prompt_version,guardrail_version,created_by) values
('00000000-0000-0000-0000-000000000060','00000000-0000-0000-0000-000000000010','00000000-0000-0000-0000-000000000020','00000000-0000-0000-0000-000000000050',1,'{"competencies":[{"id":"00000000-0000-0000-0000-000000000090","name":"Immutable System Design"}]}'::jsonb,'test-platform-v1','test-guardrail-v1','00000000-0000-0000-0000-000000000001');
insert into public.candidate_invitations (id,organization_id,job_id,candidate_id,interviewer_version_id,token_hash,expires_at,state,completed_at) values
('00000000-0000-0000-0000-000000000070','00000000-0000-0000-0000-000000000010','00000000-0000-0000-0000-000000000020','00000000-0000-0000-0000-000000000030','00000000-0000-0000-0000-000000000060',repeat('a',64),now()+interval '1 day','completed',now());
insert into public.interview_attempts (id,organization_id,job_id,invitation_id,candidate_id,interviewer_version_id,state) values
('00000000-0000-0000-0000-000000000080','00000000-0000-0000-0000-000000000010','00000000-0000-0000-0000-000000000020','00000000-0000-0000-0000-000000000070','00000000-0000-0000-0000-000000000030','00000000-0000-0000-0000-000000000060','completed');
insert into public.assessment_generations (id,organization_id,attempt_id,generation_number,status,assessment,provenance,completed_at) values
('00000000-0000-0000-0000-000000000098','00000000-0000-0000-0000-000000000010','00000000-0000-0000-0000-000000000080',1,'completed','{"summary":"Earlier assessment","competencies":[],"strengths":[],"concerns":[],"unansweredAreas":[],"questionCoverage":[],"evidenceSufficiency":"low"}'::jsonb,'{"source":"test-generation-1"}'::jsonb,now()-interval '1 minute'),
('00000000-0000-0000-0000-000000000099','00000000-0000-0000-0000-000000000010','00000000-0000-0000-0000-000000000080',2,'completed','{"summary":"Evidence-grounded assessment","competencies":[{"competencyId":"00000000-0000-0000-0000-000000000090","score":4,"rationale":"Explicit trade-offs.","evidence":[],"evidenceSufficiency":"sufficient"}],"strengths":[],"concerns":[],"unansweredAreas":[],"questionCoverage":[],"evidenceSufficiency":"high"}'::jsonb,'{"source":"test-generation-2"}'::jsonb,now());

set local role authenticated;
select set_config('request.jwt.claim.sub','00000000-0000-0000-0000-000000000001',true);
select lives_ok($$select public.create_candidate_review_score_override('00000000-0000-0000-0000-000000000010','00000000-0000-0000-0000-000000000020','00000000-0000-0000-0000-000000000030','00000000-0000-0000-0000-000000000080','00000000-0000-0000-0000-000000000099','00000000-0000-0000-0000-000000000090',4,'Independent review supports this score.')$$, 'an authorized reviewer can append a human score against the exact completed generation');
reset role;
select is((select reviewer_user_id from public.candidate_review_score_overrides where attempt_id='00000000-0000-0000-0000-000000000080' order by created_at desc limit 1),'00000000-0000-0000-0000-000000000001'::uuid,'the override records authenticated reviewer attribution');

set local role authenticated;
select set_config('request.jwt.claim.sub','00000000-0000-0000-0000-000000000001',true);
select lives_ok($$select public.create_candidate_review_score_override('00000000-0000-0000-0000-000000000010','00000000-0000-0000-0000-000000000020','00000000-0000-0000-0000-000000000030','00000000-0000-0000-0000-000000000080','00000000-0000-0000-0000-000000000099','00000000-0000-0000-0000-000000000090',null,'A later reviewer records insufficient evidence without erasing history.')$$, 'a later null human score is appended rather than replacing the earlier override');
reset role;
select is((select count(*)::integer from public.candidate_review_score_overrides where attempt_id='00000000-0000-0000-0000-000000000080' and competency_id='00000000-0000-0000-0000-000000000090'),2,'human override history remains append-only');

set local role authenticated;
select set_config('request.jwt.claim.sub','00000000-0000-0000-0000-000000000001',true);
select throws_ok($$select public.create_candidate_review_score_override('00000000-0000-0000-0000-000000000010','00000000-0000-0000-0000-000000000021','00000000-0000-0000-0000-000000000030','00000000-0000-0000-0000-000000000080','00000000-0000-0000-0000-000000000099','00000000-0000-0000-0000-000000000090',4,'Wrong job must not cross the boundary.')$$,'42501','Candidate review scope unavailable.','same-tenant wrong-job scope is rejected');
select throws_ok($$select public.create_candidate_review_score_override('00000000-0000-0000-0000-000000000010','00000000-0000-0000-0000-000000000020','00000000-0000-0000-0000-000000000030','00000000-0000-0000-0000-000000000080','00000000-0000-0000-0000-000000000099','00000000-0000-0000-0000-000000000091',4,'Unknown competency must not be persisted.')$$,'42501','Candidate review scope unavailable.','a competency absent from the immutable completed assessment is rejected');
select throws_ok($$select public.create_candidate_review_score_override('00000000-0000-0000-0000-000000000010','00000000-0000-0000-0000-000000000020','00000000-0000-0000-0000-000000000030','00000000-0000-0000-0000-000000000080','00000000-0000-0000-0000-000000000099','00000000-0000-0000-0000-000000000090',6,'Out of range.')$$,'22023','Invalid human score override.','scores outside 1..5 or null are rejected');
select throws_ok($$select public.create_candidate_review_score_override('00000000-0000-0000-0000-000000000010','00000000-0000-0000-0000-000000000020','00000000-0000-0000-0000-000000000030','00000000-0000-0000-0000-000000000080','00000000-0000-0000-0000-000000000099','00000000-0000-0000-0000-000000000090',4,'   ')$$,'22023','Invalid human score override.','blank reviewer reasons are rejected');
reset role;

select * from finish();
rollback;
