begin;

select plan(7);

insert into auth.users (id, email, aud, role)
values (
  'aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaaa',
  'mint-owner@example.com',
  'authenticated',
  'authenticated'
);

insert into public.profiles (id, display_name)
values ('aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaaa', 'Mint Owner');

insert into public.organizations (id, name, created_by)
values ('11111111-1111-4111-8111-111111111111', 'Mint Org', 'aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaaa');

insert into public.organization_memberships (organization_id, user_id, role)
values (
  '11111111-1111-4111-8111-111111111111',
  'aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaaa',
  'owner'::public.organization_role
);

insert into public.jobs (id, organization_id, title, created_by)
values (
  '22222222-2222-4222-8222-222222222222',
  '11111111-1111-4111-8111-111111111111',
  'Realtime Engineer',
  'aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaaa'
);

insert into public.candidates (id, organization_id, job_id, full_name, email, created_by)
values (
  '33333333-3333-4333-8333-333333333333',
  '11111111-1111-4111-8111-111111111111',
  '22222222-2222-4222-8222-222222222222',
  'Mint Candidate',
  'mint-candidate@example.com',
  'aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaaa'
);

insert into public.interview_plans (id, organization_id, job_id, total_duration_seconds)
values (
  '77777777-7777-4777-8777-777777777771',
  '11111111-1111-4111-8111-111111111111',
  '22222222-2222-4222-8222-222222222222',
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
  '88888888-8888-4888-8888-888888888888',
  '11111111-1111-4111-8111-111111111111',
  '22222222-2222-4222-8222-222222222222',
  '77777777-7777-4777-8777-777777777771',
  'Mint Interviewer',
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
  '44444444-4444-4444-8444-444444444444',
  '11111111-1111-4111-8111-111111111111',
  '22222222-2222-4222-8222-222222222222',
  '88888888-8888-4888-8888-888888888888',
  1,
  '{"interviewer_config":{"duration_seconds":1800,"language":"en"},"interview_plan":{"sections":[]},"questions":[]}'::jsonb,
  'interviewer-runtime-v1',
  'hiring-guardrails-v1',
  'aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaaa'
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
  '55555555-5555-4555-8555-555555555555',
  '11111111-1111-4111-8111-111111111111',
  '22222222-2222-4222-8222-222222222222',
  '33333333-3333-4333-8333-333333333333',
  '44444444-4444-4444-8444-444444444444',
  repeat('a', 64),
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
  '66666666-6666-4666-8666-666666666666',
  '11111111-1111-4111-8111-111111111111',
  '22222222-2222-4222-8222-222222222222',
  '55555555-5555-4555-8555-555555555555',
  '33333333-3333-4333-8333-333333333333',
  '44444444-4444-4444-8444-444444444444'
);

select has_function(
  'public',
  'consume_realtime_credential_mint',
  array['text', 'uuid'],
  'credential mint limiting is a server-authoritative database RPC'
);

select ok(
  public.consume_realtime_credential_mint(repeat('a', 64), '66666666-6666-4666-8666-666666666666'),
  'first provider credential mint is allowed'
);

select ok(
  public.consume_realtime_credential_mint(repeat('a', 64), '66666666-6666-4666-8666-666666666666'),
  'second reconnect credential mint remains allowed'
);

select ok(
  not public.consume_realtime_credential_mint(repeat('a', 64), '66666666-6666-4666-8666-666666666666'),
  'third credential mint in the bounded window is denied'
);

select throws_ok(
  $$ select public.consume_realtime_credential_mint(repeat('b', 64), '66666666-6666-4666-8666-666666666666') $$,
  'realtime credential unavailable',
  'wrong capability cannot consume another attempt allowance'
);

select throws_ok(
  $$ select public.consume_realtime_credential_mint(repeat('a', 64), '77777777-7777-4777-8777-777777777777') $$,
  'realtime credential unavailable',
  'unknown attempt fails closed'
);

select is(
  (
    select count(*)::integer
    from public.realtime_credential_mints
    where attempt_id = '66666666-6666-4666-8666-666666666666'
  ),
  2,
  'only allowed mint consumptions are persisted'
);

select * from finish();
rollback;
