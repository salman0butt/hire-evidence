begin;

select plan(3);

insert into auth.users (id, email, aud, role)
values (
  'baaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaaa',
  'event-owner@example.com',
  'authenticated',
  'authenticated'
);

insert into public.profiles (id, display_name)
values ('baaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaaa', 'Event Owner');

insert into public.organizations (id, name, created_by)
values (
  'b1111111-1111-4111-8111-111111111111',
  'Event Org',
  'baaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaaa'
);

insert into public.organization_memberships (organization_id, user_id, role)
values (
  'b1111111-1111-4111-8111-111111111111',
  'baaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaaa',
  'owner'::public.organization_role
);

insert into public.jobs (id, organization_id, title, created_by)
values (
  'b2222222-2222-4222-8222-222222222222',
  'b1111111-1111-4111-8111-111111111111',
  'Realtime Event Engineer',
  'baaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaaa'
);

insert into public.candidates (id, organization_id, job_id, full_name, email, created_by)
values (
  'b3333333-3333-4333-8333-333333333333',
  'b1111111-1111-4111-8111-111111111111',
  'b2222222-2222-4222-8222-222222222222',
  'Event Candidate',
  'event-candidate@example.com',
  'baaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaaa'
);

insert into public.interview_plans (id, organization_id, job_id, total_duration_seconds)
values (
  'b7777777-7777-4777-8777-777777777771',
  'b1111111-1111-4111-8111-111111111111',
  'b2222222-2222-4222-8222-222222222222',
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
  'b8888888-8888-4888-8888-888888888888',
  'b1111111-1111-4111-8111-111111111111',
  'b2222222-2222-4222-8222-222222222222',
  'b7777777-7777-4777-8777-777777777771',
  'Event Interviewer',
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
  'b4444444-4444-4444-8444-444444444444',
  'b1111111-1111-4111-8111-111111111111',
  'b2222222-2222-4222-8222-222222222222',
  'b8888888-8888-4888-8888-888888888888',
  1,
  '{"interviewer_config":{"duration_seconds":1800,"language":"en"},"interview_plan":{"sections":[]},"questions":[]}'::jsonb,
  'interviewer-runtime-v1',
  'hiring-guardrails-v1',
  'baaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaaa'
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
  'b5555555-5555-4555-8555-555555555555',
  'b1111111-1111-4111-8111-111111111111',
  'b2222222-2222-4222-8222-222222222222',
  'b3333333-3333-4333-8333-333333333333',
  'b4444444-4444-4444-8444-444444444444',
  repeat('c', 64),
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
  'b6666666-6666-4666-8666-666666666666',
  'b1111111-1111-4111-8111-111111111111',
  'b2222222-2222-4222-8222-222222222222',
  'b5555555-5555-4555-8555-555555555555',
  'b3333333-3333-4333-8333-333333333333',
  'b4444444-4444-4444-8444-444444444444'
);

-- A real reconnect loop can report several operational failures in a short burst.
-- The first twelve are deliberately generous. Client occurredAt values are spread
-- far apart so the eventual quota can only pass by using authoritative server time.
do $$
begin
  for event_number in 1..12 loop
    perform *
    from public.record_realtime_interview_technical_event(
      repeat('c', 64),
      'b6666666-6666-4666-8666-666666666666',
      'provider_disconnect',
      now() + (event_number * interval '1 day')
    );
  end loop;
end;
$$;

select is(
  (
    select count(*)::integer
    from public.interview_technical_events
    where attempt_id = 'b6666666-6666-4666-8666-666666666666'
  ),
  12,
  'a bounded reconnect burst can record twelve operational events'
);

select throws_ok(
  $$
    select *
    from public.record_realtime_interview_technical_event(
      repeat('c', 64),
      'b6666666-6666-4666-8666-666666666666',
      'reconnect_failure',
      now() + interval '10 years'
    )
  $$,
  'technical event rate limit exceeded',
  'the thirteenth event is rejected by a server-time attempt quota despite manipulated occurredAt'
);

select is(
  (
    select count(*)::integer
    from public.interview_technical_events
    where attempt_id = 'b6666666-6666-4666-8666-666666666666'
  ),
  12,
  'rate-limited technical events are not persisted'
);

select * from finish();
rollback;
