begin;

select plan(3);

insert into auth.users (id, email, aud, role)
values (
  'caaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaaa',
  'finalize-owner@example.com',
  'authenticated',
  'authenticated'
);

insert into public.profiles (id, display_name)
values ('caaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaaa', 'Finalize Owner');

insert into public.organizations (id, name, created_by)
values (
  'c1111111-1111-4111-8111-111111111111',
  'Finalize Org',
  'caaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaaa'
);

insert into public.organization_memberships (organization_id, user_id, role)
values (
  'c1111111-1111-4111-8111-111111111111',
  'caaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaaa',
  'owner'::public.organization_role
);

insert into public.jobs (id, organization_id, title, created_by)
values (
  'c2222222-2222-4222-8222-222222222222',
  'c1111111-1111-4111-8111-111111111111',
  'Realtime Finalize Engineer',
  'caaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaaa'
);

insert into public.candidates (id, organization_id, job_id, full_name, email, created_by)
values (
  'c3333333-3333-4333-8333-333333333333',
  'c1111111-1111-4111-8111-111111111111',
  'c2222222-2222-4222-8222-222222222222',
  'Finalize Candidate',
  'finalize-candidate@example.com',
  'caaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaaa'
);

insert into public.interview_plans (id, organization_id, job_id, total_duration_seconds)
values (
  'c7777777-7777-4777-8777-777777777771',
  'c1111111-1111-4111-8111-111111111111',
  'c2222222-2222-4222-8222-222222222222',
  1800
);

insert into public.interviewer_configs (
  id,
  organization_id,
  job_id,
  plan_id,
  name,
  interview_type,
  persona,
  language,
  duration_seconds,
  difficulty,
  question_mode,
  guidelines,
  candidate_instructions,
  max_follow_ups_per_question,
  follow_up_reasons
) values (
  'c8888888-8888-4888-8888-888888888888',
  'c1111111-1111-4111-8111-111111111111',
  'c2222222-2222-4222-8222-222222222222',
  'c7777777-7777-4777-8777-777777777771',
  'Finalize Interviewer',
  'technical',
  'professional',
  'en',
  1800,
  'medium',
  'fixed',
  '',
  '',
  1,
  array['clarify_ambiguity']::text[]
);

insert into public.interviewer_versions (
  id,
  organization_id,
  job_id,
  interviewer_config_id,
  version_number,
  snapshot,
  platform_prompt_version,
  guardrail_version,
  created_by
) values (
  'c4444444-4444-4444-8444-444444444444',
  'c1111111-1111-4111-8111-111111111111',
  'c2222222-2222-4222-8222-222222222222',
  'c8888888-8888-4888-8888-888888888888',
  1,
  '{"interviewer_config":{"duration_seconds":1800,"language":"en"},"interview_plan":{"sections":[]},"questions":[]}'::jsonb,
  'interviewer-runtime-v1',
  'hiring-guardrails-v1',
  'caaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaaa'
);

insert into public.candidate_invitations (
  id,
  organization_id,
  job_id,
  candidate_id,
  interviewer_version_id,
  token_hash,
  expires_at,
  state
) values (
  'c5555555-5555-4555-8555-555555555555',
  'c1111111-1111-4111-8111-111111111111',
  'c2222222-2222-4222-8222-222222222222',
  'c3333333-3333-4333-8333-333333333333',
  'c4444444-4444-4444-8444-444444444444',
  repeat('d', 64),
  now() + interval '1 hour',
  'started'
);

insert into public.interview_attempts (
  id,
  organization_id,
  job_id,
  invitation_id,
  candidate_id,
  interviewer_version_id
) values (
  'c6666666-6666-4666-8666-666666666666',
  'c1111111-1111-4111-8111-111111111111',
  'c2222222-2222-4222-8222-222222222222',
  'c5555555-5555-4555-8555-555555555555',
  'c3333333-3333-4333-8333-333333333333',
  'c4444444-4444-4444-8444-444444444444'
);

select lives_ok(
  $$
    select *
    from public.finalize_realtime_interview_session(
      repeat('d', 64),
      'c6666666-6666-4666-8666-666666666666'
    )
  $$,
  'the first valid finalization completes the attempt'
);

select is(
  (
    select count(*)::integer
    from public.interview_assessment_triggers
    where attempt_id = 'c6666666-6666-4666-8666-666666666666'
  ),
  1,
  'finalization creates exactly one assessment trigger'
);

-- Simulate a completed attempt that has not otherwise changed since finalization.
-- A retry must be read-only: repeatedly POSTing finalize must not keep generating
-- database writes just because the capability remains valid.
update public.interview_attempts
set updated_at = '2000-01-01 00:00:00+00'::timestamptz
where id = 'c6666666-6666-4666-8666-666666666666';

select *
from public.finalize_realtime_interview_session(
  repeat('d', 64),
  'c6666666-6666-4666-8666-666666666666'
);

select is(
  (
    select updated_at
    from public.interview_attempts
    where id = 'c6666666-6666-4666-8666-666666666666'
  ),
  '2000-01-01 00:00:00+00'::timestamptz,
  'retrying a completed finalization does not rewrite the attempt row'
);

select * from finish();
rollback;
