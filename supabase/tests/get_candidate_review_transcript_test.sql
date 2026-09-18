begin;

select plan(9);

select has_function(
  'public',
  'get_candidate_review_transcript',
  array['uuid', 'uuid', 'uuid', 'uuid'],
  'M08.3 exposes a dedicated authenticated tenant/job/candidate/attempt-scoped transcript review RPC'
);

select ok(
  has_function_privilege(
    'authenticated',
    'public.get_candidate_review_transcript(uuid,uuid,uuid,uuid)',
    'EXECUTE'
  ),
  'authenticated hiring users can execute the transcript review RPC'
);

select ok(
  not has_function_privilege(
    'anon',
    'public.get_candidate_review_transcript(uuid,uuid,uuid,uuid)',
    'EXECUTE'
  ),
  'anonymous users cannot execute the transcript review RPC'
);

set local role authenticated;

select throws_ok(
  $$
    select * from public.get_candidate_review_transcript(
      '00000000-0000-0000-0000-000000000110'::uuid,
      '00000000-0000-0000-0000-000000000120'::uuid,
      '00000000-0000-0000-0000-000000000130'::uuid,
      '00000000-0000-0000-0000-000000000180'::uuid
    )
  $$,
  '42501',
  'Authentication required.',
  'the RPC fails closed without an authenticated actor'
);

reset role;

insert into auth.users (id, email, aud, role)
values (
  '00000000-0000-0000-0000-000000000101'::uuid,
  'transcript-reviewer@example.test',
  'authenticated',
  'authenticated'
);

insert into public.organizations (id, name, created_by)
values
  (
    '00000000-0000-0000-0000-000000000110'::uuid,
    'Transcript Review Org',
    '00000000-0000-0000-0000-000000000101'::uuid
  ),
  (
    '00000000-0000-0000-0000-000000000111'::uuid,
    'Other Transcript Org',
    '00000000-0000-0000-0000-000000000101'::uuid
  );

insert into public.organization_memberships (organization_id, user_id, role)
values (
  '00000000-0000-0000-0000-000000000110'::uuid,
  '00000000-0000-0000-0000-000000000101'::uuid,
  'reviewer'::public.organization_role
);

insert into public.jobs (id, organization_id, title, created_by)
values
  (
    '00000000-0000-0000-0000-000000000120'::uuid,
    '00000000-0000-0000-0000-000000000110'::uuid,
    'Transcript Review Engineer',
    '00000000-0000-0000-0000-000000000101'::uuid
  ),
  (
    '00000000-0000-0000-0000-000000000121'::uuid,
    '00000000-0000-0000-0000-000000000110'::uuid,
    'Wrong Job',
    '00000000-0000-0000-0000-000000000101'::uuid
  ),
  (
    '00000000-0000-0000-0000-000000000122'::uuid,
    '00000000-0000-0000-0000-000000000111'::uuid,
    'Other Org Job',
    '00000000-0000-0000-0000-000000000101'::uuid
  );

insert into public.candidates (id, organization_id, job_id, full_name, email, created_by)
values
  (
    '00000000-0000-0000-0000-000000000130'::uuid,
    '00000000-0000-0000-0000-000000000110'::uuid,
    '00000000-0000-0000-0000-000000000120'::uuid,
    'Transcript Candidate',
    'transcript-candidate@example.test',
    '00000000-0000-0000-0000-000000000101'::uuid
  ),
  (
    '00000000-0000-0000-0000-000000000131'::uuid,
    '00000000-0000-0000-0000-000000000111'::uuid,
    '00000000-0000-0000-0000-000000000122'::uuid,
    'Other Candidate',
    'other-transcript-candidate@example.test',
    '00000000-0000-0000-0000-000000000101'::uuid
  );

insert into public.interview_plans (id, organization_id, job_id, total_duration_seconds)
values
  (
    '00000000-0000-0000-0000-000000000140'::uuid,
    '00000000-0000-0000-0000-000000000110'::uuid,
    '00000000-0000-0000-0000-000000000120'::uuid,
    900
  ),
  (
    '00000000-0000-0000-0000-000000000141'::uuid,
    '00000000-0000-0000-0000-000000000111'::uuid,
    '00000000-0000-0000-0000-000000000122'::uuid,
    900
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
  max_follow_ups_per_question,
  status,
  published_at
)
values
  (
    '00000000-0000-0000-0000-000000000150'::uuid,
    '00000000-0000-0000-0000-000000000110'::uuid,
    '00000000-0000-0000-0000-000000000120'::uuid,
    '00000000-0000-0000-0000-000000000140'::uuid,
    'Transcript Reviewer',
    'technical',
    'professional',
    'en',
    900,
    'medium',
    'fixed',
    0,
    'published',
    now()
  ),
  (
    '00000000-0000-0000-0000-000000000151'::uuid,
    '00000000-0000-0000-0000-000000000111'::uuid,
    '00000000-0000-0000-0000-000000000122'::uuid,
    '00000000-0000-0000-0000-000000000141'::uuid,
    'Other Transcript Reviewer',
    'technical',
    'professional',
    'en',
    900,
    'medium',
    'fixed',
    0,
    'published',
    now()
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
)
values
  (
    '00000000-0000-0000-0000-000000000160'::uuid,
    '00000000-0000-0000-0000-000000000110'::uuid,
    '00000000-0000-0000-0000-000000000120'::uuid,
    '00000000-0000-0000-0000-000000000150'::uuid,
    1,
    '{}'::jsonb,
    'test-platform-v1',
    'test-guardrail-v1',
    '00000000-0000-0000-0000-000000000101'::uuid
  ),
  (
    '00000000-0000-0000-0000-000000000161'::uuid,
    '00000000-0000-0000-0000-000000000111'::uuid,
    '00000000-0000-0000-0000-000000000122'::uuid,
    '00000000-0000-0000-0000-000000000151'::uuid,
    1,
    '{}'::jsonb,
    'test-platform-v1',
    'test-guardrail-v1',
    '00000000-0000-0000-0000-000000000101'::uuid
  );

insert into public.candidate_invitations (
  id,
  organization_id,
  job_id,
  candidate_id,
  interviewer_version_id,
  token_hash,
  expires_at,
  state,
  completed_at
)
values
  (
    '00000000-0000-0000-0000-000000000170'::uuid,
    '00000000-0000-0000-0000-000000000110'::uuid,
    '00000000-0000-0000-0000-000000000120'::uuid,
    '00000000-0000-0000-0000-000000000130'::uuid,
    '00000000-0000-0000-0000-000000000160'::uuid,
    repeat('c', 64),
    now() + interval '1 day',
    'completed',
    now()
  ),
  (
    '00000000-0000-0000-0000-000000000171'::uuid,
    '00000000-0000-0000-0000-000000000111'::uuid,
    '00000000-0000-0000-0000-000000000122'::uuid,
    '00000000-0000-0000-0000-000000000131'::uuid,
    '00000000-0000-0000-0000-000000000161'::uuid,
    repeat('d', 64),
    now() + interval '1 day',
    'completed',
    now()
  );

insert into public.interview_attempts (
  id,
  organization_id,
  job_id,
  invitation_id,
  candidate_id,
  interviewer_version_id,
  state
)
values
  (
    '00000000-0000-0000-0000-000000000180'::uuid,
    '00000000-0000-0000-0000-000000000110'::uuid,
    '00000000-0000-0000-0000-000000000120'::uuid,
    '00000000-0000-0000-0000-000000000170'::uuid,
    '00000000-0000-0000-0000-000000000130'::uuid,
    '00000000-0000-0000-0000-000000000160'::uuid,
    'completed'
  ),
  (
    '00000000-0000-0000-0000-000000000181'::uuid,
    '00000000-0000-0000-0000-000000000111'::uuid,
    '00000000-0000-0000-0000-000000000122'::uuid,
    '00000000-0000-0000-0000-000000000171'::uuid,
    '00000000-0000-0000-0000-000000000131'::uuid,
    '00000000-0000-0000-0000-000000000161'::uuid,
    'completed'
  );

insert into public.interview_transcript_messages (
  id,
  attempt_id,
  event_id,
  sequence,
  speaker,
  text,
  started_at,
  ended_at,
  finalized_at
)
values
  (
    '00000000-0000-0000-0000-000000000190'::uuid,
    '00000000-0000-0000-0000-000000000180'::uuid,
    'event-1',
    1,
    'interviewer',
    'Describe a difficult scaling problem.',
    null,
    null,
    '2026-09-18T08:00:00Z'::timestamptz
  ),
  (
    '00000000-0000-0000-0000-000000000191'::uuid,
    '00000000-0000-0000-0000-000000000180'::uuid,
    'event-2',
    2,
    'candidate',
    'I partitioned writes by tenant and made retries idempotent.',
    null,
    null,
    '2026-09-18T08:00:05Z'::timestamptz
  );

insert into public.interview_technical_events (
  id,
  attempt_id,
  category,
  occurred_at
)
values (
  '00000000-0000-0000-0000-000000000199'::uuid,
  '00000000-0000-0000-0000-000000000180'::uuid,
  'provider_disconnect',
  '2026-09-18T08:00:03Z'::timestamptz
);

set local role authenticated;
select set_config(
  'request.jwt.claim.sub',
  '00000000-0000-0000-0000-000000000101',
  true
);

select throws_ok(
  $$
    select * from public.get_candidate_review_transcript(
      '00000000-0000-0000-0000-000000000111'::uuid,
      '00000000-0000-0000-0000-000000000122'::uuid,
      '00000000-0000-0000-0000-000000000131'::uuid,
      '00000000-0000-0000-0000-000000000181'::uuid
    )
  $$,
  '42501',
  'Not authorized to review candidate transcript.',
  'the RPC fails closed for a real cross-tenant attempt'
);

select throws_ok(
  $$
    select * from public.get_candidate_review_transcript(
      '00000000-0000-0000-0000-000000000110'::uuid,
      '00000000-0000-0000-0000-000000000121'::uuid,
      '00000000-0000-0000-0000-000000000130'::uuid,
      '00000000-0000-0000-0000-000000000180'::uuid
    )
  $$,
  '42501',
  'Not authorized to review candidate transcript.',
  'the RPC rejects a mismatched same-tenant job'
);

select throws_ok(
  $$
    select * from public.get_candidate_review_transcript(
      '00000000-0000-0000-0000-000000000110'::uuid,
      '00000000-0000-0000-0000-000000000120'::uuid,
      '00000000-0000-0000-0000-000000000131'::uuid,
      '00000000-0000-0000-0000-000000000180'::uuid
    )
  $$,
  '42501',
  'Not authorized to review candidate transcript.',
  'the RPC rejects a mismatched candidate'
);

select results_eq(
  $$
    select sequence, speaker, text
    from public.get_candidate_review_transcript(
      '00000000-0000-0000-0000-000000000110'::uuid,
      '00000000-0000-0000-0000-000000000120'::uuid,
      '00000000-0000-0000-0000-000000000130'::uuid,
      '00000000-0000-0000-0000-000000000180'::uuid
    )
  $$,
  $$
    values
      (1, 'interviewer'::text, 'Describe a difficult scaling problem.'::text),
      (2, 'candidate'::text, 'I partitioned writes by tenant and made retries idempotent.'::text)
  $$,
  'the RPC returns only ordered durable transcript turns for the exact authorized attempt'
);

select is(
  (
    select count(*)::integer
    from public.get_candidate_review_transcript(
      '00000000-0000-0000-0000-000000000110'::uuid,
      '00000000-0000-0000-0000-000000000120'::uuid,
      '00000000-0000-0000-0000-000000000130'::uuid,
      '00000000-0000-0000-0000-000000000180'::uuid
    )
    where text = 'provider_disconnect'
  ),
  0,
  'technical interruption events are not surfaced as transcript evidence'
);

reset role;

select * from finish();

rollback;
