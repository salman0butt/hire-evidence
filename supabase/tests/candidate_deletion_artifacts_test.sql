begin;

select plan(14);

-- A full candidate chain, including sensitive transcript, nested assessment
-- evidence, human notes and consent. The separate organization is a sentinel.
insert into auth.users (id, email, aud, role) values
  ('00000000-0000-0000-0000-000000000601', 'deletion-chain-owner@example.test', 'authenticated', 'authenticated');
insert into public.organizations (id, name, created_by) values
  ('00000000-0000-0000-0000-000000000610', 'Deletion Chain A', '00000000-0000-0000-0000-000000000601'),
  ('00000000-0000-0000-0000-000000000620', 'Deletion Chain B', '00000000-0000-0000-0000-000000000601');
insert into public.organization_memberships (organization_id, user_id, role) values
  ('00000000-0000-0000-0000-000000000610', '00000000-0000-0000-0000-000000000601', 'owner'::public.organization_role);
insert into public.jobs (id, organization_id, title, created_by) values
  ('00000000-0000-0000-0000-000000000630', '00000000-0000-0000-0000-000000000610', 'Evidence Role A', '00000000-0000-0000-0000-000000000601'),
  ('00000000-0000-0000-0000-000000000640', '00000000-0000-0000-0000-000000000620', 'Evidence Role B', '00000000-0000-0000-0000-000000000601');
insert into public.candidates (id, organization_id, job_id, full_name, email, created_by) values
  ('00000000-0000-0000-0000-000000000650', '00000000-0000-0000-0000-000000000610', '00000000-0000-0000-0000-000000000630', 'Sensitive Candidate', 'erase-this@example.test', '00000000-0000-0000-0000-000000000601'),
  ('00000000-0000-0000-0000-000000000660', '00000000-0000-0000-0000-000000000620', '00000000-0000-0000-0000-000000000640', 'Other Tenant Candidate', 'keep-this@example.test', '00000000-0000-0000-0000-000000000601');
insert into public.interview_plans (id, organization_id, job_id, total_duration_seconds) values
  ('00000000-0000-0000-0000-000000000670', '00000000-0000-0000-0000-000000000610', '00000000-0000-0000-0000-000000000630', 900);
insert into public.interviewer_configs (
  id, organization_id, job_id, plan_id, name, interview_type, persona,
  language, duration_seconds, difficulty, question_mode, max_follow_ups_per_question,
  status, published_at
) values (
  '00000000-0000-0000-0000-000000000671', '00000000-0000-0000-0000-000000000610',
  '00000000-0000-0000-0000-000000000630', '00000000-0000-0000-0000-000000000670',
  'Deletion Interviewer', 'technical', 'professional', 'en', 900, 'medium',
  'fixed', 0, 'published', now()
);
insert into public.interviewer_versions (
  id, organization_id, job_id, interviewer_config_id, version_number, snapshot,
  platform_prompt_version, guardrail_version, created_by
) values (
  '00000000-0000-0000-0000-000000000672', '00000000-0000-0000-0000-000000000610',
  '00000000-0000-0000-0000-000000000630', '00000000-0000-0000-0000-000000000671',
  1, '{}'::jsonb, 'test-platform-v1', 'test-guardrail-v1',
  '00000000-0000-0000-0000-000000000601'
);
insert into public.candidate_invitations (
  id, organization_id, job_id, candidate_id, interviewer_version_id,
  token_hash, expires_at, state, completed_at
) values (
  '00000000-0000-0000-0000-000000000673', '00000000-0000-0000-0000-000000000610',
  '00000000-0000-0000-0000-000000000630', '00000000-0000-0000-0000-000000000650',
  '00000000-0000-0000-0000-000000000672', repeat('e', 64),
  now() + interval '1 day', 'completed', now()
);
insert into public.candidate_consent_events (
  id, invitation_id, disclosure_version, disclosure_categories
) values (
  '00000000-0000-0000-0000-000000000679',
  '00000000-0000-0000-0000-000000000673', 'candidate-interview-v1',
  array['ai_assisted', 'transcription', 'data_processing', 'retention']::text[]
);
insert into public.interview_attempts (
  id, organization_id, job_id, invitation_id, candidate_id,
  interviewer_version_id, state
) values (
  '00000000-0000-0000-0000-000000000674', '00000000-0000-0000-0000-000000000610',
  '00000000-0000-0000-0000-000000000630', '00000000-0000-0000-0000-000000000673',
  '00000000-0000-0000-0000-000000000650', '00000000-0000-0000-0000-000000000672', 'completed'
);
insert into public.interview_transcript_messages (
  id, attempt_id, event_id, sequence, speaker, text
) values (
  '00000000-0000-0000-0000-000000000676',
  '00000000-0000-0000-0000-000000000674',
  'sensitive-turn', 1, 'candidate', 'Private response that must be erased'
);
insert into public.interview_technical_events (id, attempt_id, category, occurred_at) values (
  '00000000-0000-0000-0000-000000000677',
  '00000000-0000-0000-0000-000000000674', 'provider_disconnect', now()
);
insert into public.assessment_generations (
  id, organization_id, attempt_id, generation_number, status, assessment, provenance, completed_at
) values (
  '00000000-0000-0000-0000-000000000675', '00000000-0000-0000-0000-000000000610',
  '00000000-0000-0000-0000-000000000674', 1, 'completed',
  '{"summary":"Private assessment","competencies":[{"evidence":[{"messageSequence":1,"excerpt":"Private response that must be erased"}]}]}'::jsonb,
  '{"source":"private-assessment-provenance"}'::jsonb, now()
);
insert into public.candidate_review_score_overrides (
  id, organization_id, job_id, candidate_id, attempt_id,
  assessment_generation_id, competency_id, human_score, reason, reviewer_user_id
) values (
  '00000000-0000-0000-0000-000000000678', '00000000-0000-0000-0000-000000000610',
  '00000000-0000-0000-0000-000000000630', '00000000-0000-0000-0000-000000000650',
  '00000000-0000-0000-0000-000000000674', '00000000-0000-0000-0000-000000000675',
  'evidence-use', 3, 'Private human feedback', '00000000-0000-0000-0000-000000000601'
);
insert into public.candidate_reviews (
  organization_id, job_id, candidate_id, attempt_id, assessment_generation_id,
  status, reviewer_notes, reviewer_user_id
) values (
  '00000000-0000-0000-0000-000000000610', '00000000-0000-0000-0000-000000000630',
  '00000000-0000-0000-0000-000000000650', '00000000-0000-0000-0000-000000000674',
  '00000000-0000-0000-0000-000000000675', 'awaiting_review', 'Private reviewer notes',
  '00000000-0000-0000-0000-000000000601'
);

set local role authenticated;
select set_config('request.jwt.claim.sub', '00000000-0000-0000-0000-000000000601', true);
select lives_ok(
  $$select public.delete_candidate_data('00000000-0000-0000-0000-000000000610'::uuid, '00000000-0000-0000-0000-000000000650'::uuid)$$,
  'authorized deletion removes all linked candidate artifacts transactionally'
);
reset role;

select is((select count(*) from public.candidates where id='00000000-0000-0000-0000-000000000650'::uuid), 0::bigint, 'candidate PII is erased');
select is((select count(*) from public.candidate_invitations where id='00000000-0000-0000-0000-000000000673'::uuid), 0::bigint, 'invitation token hash is erased');
select is((select count(*) from public.candidate_consent_events where id='00000000-0000-0000-0000-000000000679'::uuid), 0::bigint, 'consent artifact is erased');
select is((select count(*) from public.interview_attempts where id='00000000-0000-0000-0000-000000000674'::uuid), 0::bigint, 'candidate attempt is erased');
select is((select count(*) from public.interview_transcript_messages where id='00000000-0000-0000-0000-000000000676'::uuid), 0::bigint, 'durable transcript is erased');
select is((select count(*) from public.interview_technical_events where id='00000000-0000-0000-0000-000000000677'::uuid), 0::bigint, 'attempt technical event is erased');
select is((select count(*) from public.assessment_generations where id='00000000-0000-0000-0000-000000000675'::uuid), 0::bigint, 'assessment and embedded evidence/provenance are erased');
select is((select count(*) from public.candidate_review_score_overrides where id='00000000-0000-0000-0000-000000000678'::uuid), 0::bigint, 'human override reason is erased');
select is((select count(*) from public.candidate_reviews where candidate_id='00000000-0000-0000-0000-000000000650'::uuid), 0::bigint, 'reviewer notes/status are erased');
select is((select count(*) from public.candidates where id='00000000-0000-0000-0000-000000000660'::uuid), 1::bigint, 'other tenant candidate survives unchanged');
select is((select count(*) from public.candidate_deletion_receipts where organization_id='00000000-0000-0000-0000-000000000610'::uuid), 1::bigint, 'one private non-sensitive completion receipt remains');
select is((select count(*) from public.audit_events where organization_id='00000000-0000-0000-0000-000000000610'::uuid and action='candidate_data.deleted'), 1::bigint, 'one minimal immutable deletion audit event remains');

set local role authenticated;
select set_config('request.jwt.claim.sub', '00000000-0000-0000-0000-000000000601', true);
select lives_ok(
  $$select public.delete_candidate_data('00000000-0000-0000-0000-000000000610'::uuid, '00000000-0000-0000-0000-000000000650'::uuid)$$,
  'retry after full erasure is idempotent'
);
reset role;

select * from finish();
rollback;
