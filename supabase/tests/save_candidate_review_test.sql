begin;

select plan(9);

select has_function('public','save_candidate_review',array['uuid','uuid','uuid','uuid','uuid','text','text'],'M08 reviewer notes/status exposes an audited RPC');
select ok(has_function_privilege('authenticated','public.save_candidate_review(uuid,uuid,uuid,uuid,uuid,text,text)','EXECUTE'),'authenticated reviewers can execute the review RPC');
select ok(not has_table_privilege('authenticated','public.candidate_reviews','INSERT'),'authenticated clients cannot bypass the RPC');

insert into auth.users (id,email,aud,role) values ('00000000-0000-0000-0000-000000000001','reviewer@example.test','authenticated','authenticated');
insert into public.organizations (id,name,created_by) values ('00000000-0000-0000-0000-000000000010','Review Org','00000000-0000-0000-0000-000000000001');
insert into public.organization_memberships (organization_id,user_id,role) values ('00000000-0000-0000-0000-000000000010','00000000-0000-0000-0000-000000000001','reviewer'::public.organization_role);
insert into public.jobs (id,organization_id,title,created_by) values ('00000000-0000-0000-0000-000000000020','00000000-0000-0000-0000-000000000010','Senior Platform Engineer','00000000-0000-0000-0000-000000000001');
insert into public.candidates (id,organization_id,job_id,full_name,email,created_by) values ('00000000-0000-0000-0000-000000000030','00000000-0000-0000-0000-000000000010','00000000-0000-0000-0000-000000000020','Ada Candidate','ada@example.test','00000000-0000-0000-0000-000000000001');
insert into public.interview_plans (id,organization_id,job_id,total_duration_seconds) values ('00000000-0000-0000-0000-000000000040','00000000-0000-0000-0000-000000000010','00000000-0000-0000-0000-000000000020',900);
insert into public.interviewer_configs (id,organization_id,job_id,plan_id,name,interview_type,persona,language,duration_seconds,difficulty,question_mode,max_follow_ups_per_question,status,published_at) values ('00000000-0000-0000-0000-000000000050','00000000-0000-0000-0000-000000000010','00000000-0000-0000-0000-000000000020','00000000-0000-0000-0000-000000000040','Review Interviewer','technical','professional','en',900,'medium','fixed',0,'published',now());
insert into public.interviewer_versions (id,organization_id,job_id,interviewer_config_id,version_number,snapshot,platform_prompt_version,guardrail_version,created_by) values ('00000000-0000-0000-0000-000000000060','00000000-0000-0000-0000-000000000010','00000000-0000-0000-0000-000000000020','00000000-0000-0000-0000-000000000050',1,'{}'::jsonb,'test-platform-v1','test-guardrail-v1','00000000-0000-0000-0000-000000000001');
insert into public.candidate_invitations (id,organization_id,job_id,candidate_id,interviewer_version_id,token_hash,expires_at,state,completed_at) values ('00000000-0000-0000-0000-000000000070','00000000-0000-0000-0000-000000000010','00000000-0000-0000-0000-000000000020','00000000-0000-0000-0000-000000000030','00000000-0000-0000-0000-000000000060',repeat('b',64),now()+interval '1 day','completed',now());
insert into public.interview_attempts (id,organization_id,job_id,invitation_id,candidate_id,interviewer_version_id,state) values ('00000000-0000-0000-0000-000000000080','00000000-0000-0000-0000-000000000010','00000000-0000-0000-0000-000000000020','00000000-0000-0000-0000-000000000070','00000000-0000-0000-0000-000000000030','00000000-0000-0000-0000-000000000060','completed');
insert into public.assessment_generations (id,organization_id,attempt_id,generation_number,status,assessment,provenance,completed_at) values ('00000000-0000-0000-0000-000000000099','00000000-0000-0000-0000-000000000010','00000000-0000-0000-0000-000000000080',1,'completed','{"summary":"Assessment","competencies":[],"strengths":[],"concerns":[],"unansweredAreas":[],"questionCoverage":[],"evidenceSufficiency":"low"}'::jsonb,'{"source":"test"}'::jsonb,now());

set local role authenticated;
select set_config('request.jwt.claim.sub','00000000-0000-0000-0000-000000000001',true);
select lives_ok($$select public.save_candidate_review('00000000-0000-0000-0000-000000000010','00000000-0000-0000-0000-000000000020','00000000-0000-0000-0000-000000000030','00000000-0000-0000-0000-000000000080','00000000-0000-0000-0000-000000000099','awaiting_review',null)$$,'review begins in awaiting_review');
select throws_ok($$select public.save_candidate_review('00000000-0000-0000-0000-000000000010','00000000-0000-0000-0000-000000000020','00000000-0000-0000-0000-000000000030','00000000-0000-0000-0000-000000000080','00000000-0000-0000-0000-000000000099','reviewed','Skipped lifecycle')$$,'22023','Invalid candidate review transition.','review cannot skip directly from awaiting_review to reviewed');
select lives_ok($$select public.save_candidate_review('00000000-0000-0000-0000-000000000010','00000000-0000-0000-0000-000000000020','00000000-0000-0000-0000-000000000030','00000000-0000-0000-0000-000000000080','00000000-0000-0000-0000-000000000099','in_review','Independent review in progress')$$,'review can advance to in_review');
select lives_ok($$select public.save_candidate_review('00000000-0000-0000-0000-000000000010','00000000-0000-0000-0000-000000000020','00000000-0000-0000-0000-000000000030','00000000-0000-0000-0000-000000000080','00000000-0000-0000-0000-000000000099','reviewed','Independent review complete')$$,'review can advance to reviewed');
select throws_ok($$select public.save_candidate_review('00000000-0000-0000-0000-000000000010','00000000-0000-0000-0000-000000000020','00000000-0000-0000-0000-000000000030','00000000-0000-0000-0000-000000000080','00000000-0000-0000-0000-000000000099','in_review','Do not reopen silently')$$,'22023','Invalid candidate review transition.','reviewed state cannot move backwards');
reset role;
select is((select reviewer_user_id from public.candidate_reviews where assessment_generation_id='00000000-0000-0000-0000-000000000099'),'00000000-0000-0000-0000-000000000001'::uuid,'review keeps authenticated attribution');

select * from finish();
rollback;
