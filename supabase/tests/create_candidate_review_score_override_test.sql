begin;

select plan(12);

select has_function(
  'public',
  'create_candidate_review_score_override',
  array['uuid', 'uuid', 'uuid', 'uuid', 'uuid', 'text', 'integer', 'text'],
  'M08 human review exposes an append-only score override RPC'
);

select ok(
  has_function_privilege(
    'authenticated',
    'public.create_candidate_review_score_override(uuid,uuid,uuid,uuid,uuid,text,integer,text)',
    'EXECUTE'
  ),
  'authenticated hiring users can execute the score override RPC'
);

select ok(
  not has_function_privilege(
    'anon',
    'public.create_candidate_review_score_override(uuid,uuid,uuid,uuid,uuid,text,integer,text)',
    'EXECUTE'
  ),
  'anonymous users cannot execute the score override RPC'
);

select ok(
  not has_table_privilege(
    'authenticated',
    'public.candidate_review_score_overrides',
    'INSERT'
  ),
  'authenticated clients cannot bypass the audited RPC with direct inserts'
);

set local role authenticated;

select throws_ok(
  $$
    select public.create_candidate_review_score_override(
      '00000000-0000-0000-0000-000000000010'::uuid,
      '00000000-0000-0000-0000-000000000020'::uuid,
      '00000000-0000-0000-0000-000000000030'::uuid,
      '00000000-0000-0000-0000-000000000080'::uuid,
      '00000000-0000-0000-0000-000000000099'::uuid,
      '00000000-0000-0000-0000-000000000090',
      4,
      'Independent review supports this score.'
    )
  $$,
  '42501',
  'Authentication required.',
  'the RPC fails closed without an authenticated actor'
);

reset role;

insert into auth.users (id, email, aud, role)
values (
  '00000000-0000-0000-0000-000000000001'::uuid,
  'reviewer@example.test',
  'authenticated',
  'authenticated'
);

insert into public.organizations (id, name, created_by)
values
  (
    '00000000-0000-0000-0000-000000000010'::uuid,
    'Review Org',
    '00000000-0000-0000-0000-000000000001'::uuid
  ),
  (
    '00000000-0000-0000-0000-000000000011'::uuid,
    'Other Org',
    '00000000-0000-0000-0000-000000000001'::uuid
  );

insert into public.organization_memberships (organization_id, user_id, role)
values (
  '00000000-0000-0000-0000-000000000010'::uuid,
  '00000000-0000-0000-0000-000000000001'::uuid,
  'reviewer'::public.organization_role
);

insert into public.jobs (id, organization_id, title, created_by)
values
  (
    '00000000-0000-0000-0000-000000000020'::uuid,
    '00000000-0000-0000-0000-000000000010'::uuid,
    'Senior Platform Engineer',
    '00000000-0000-0000-0000-000000000001'::uuid
  ),
  (
    '00000000-0000-0000-0000-000000000021'::uuid,
    '00000000-0000-0000-0000-000000000010'::uuid,
    'Staff Backend Engineer',
    '00000000-0000-0000-0000-000000000001'::uuid
  ),
  (
    '00000000-0000-0000-0000-000000000022'::uuid,
    '00000000-0000-0000-0000-000000000011'::uuid,
    'Other Org Engineer',
    '00000000-0000-0000-0000-000000000001'::uuid
  );

insert into public.candidates (id, organization_id, job_id, full_name, email, created_by)
values
  (
    '00000000-0000-0000-0000-000000000030'::uuid,
    '00000000-0000-0000-0000-000000000010'::uuid,
    '00000000-0000-0000-0000-000000000020'::uuid,
    'Ada Candidate',
    'ada@example.test',
    '00000000-0000-0000-0000-000000000001'::uuid
  ),
  (
    '00000000-0000-0000-0000-000000000031'::uuid,
    '00000000-0000-0000-0000-000000000010'::uuid,
    '00000000-0000-0000-0000-000000000020'::uuid,
    'Processing Candidate',
    'processing@example.test',
    '00000000-0000-0000-0000-000000000001'::uuid
  ),
  (
    '00000000-0000-0000-0000-000000000032'::uuid,
    '00000000-0000-0000-0000-000000000011'::uuid,
    '00000000-0000-0000-0000-000000000022'::uuid,
    'Other Candidate',
    'other@example.test',
    '00000000-0000-0000-0000-000000000001'::uuid
  );

insert into public.interview_plans (id, organization_id, job_id, total_duration_seconds)
values (
  '00000000-0000-0000-0000-000000000040'::uuid,
  '00000000-0000-0000-0000-000000000010'::uuid,
  '00000000-0000-0000-0000-000000000020'::uuid,
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
values (
  '00000000-0000-0000-0000-000000000050'::uuid,
  '00000000-0000-0000-0000-000000000010'::uuid,
  '00000000-0000-0000-0000-000000000020'::uuid,
  '00000000-0000-0000-0000-000000000040'::uuid,
  'Review Interviewer',
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
values (
  '00000000-0000-0000-0000-000000000060'::uuid,
  '00000000-0000-0000-0000-000000000010'::uuid,
  '00000000-0000-0000-0000-000000000020'::uuid,
  '00000000-0000-0000-0000-000000000050'::uuid,
  1,
  '{"competencies":[{"id":"00000000-0000-0000-0000-000000000090","name":"Immutable System Design"}]}'::jsonb,
  'test-platform-v1',
  'test-guardrail-v1',
  '00000000-0000-0000-0000-000000000001'::uuid
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
    '00000000-0000-0000-0000-000000000070'::uuid,
    '00000000-0000-0000-0000-000000000010'::uuid,
    '00000000-0000-0000-0000-000000000020'::uuid,
    '00000000-0000-0000-0000-000000000030'::uuid,
    '00000000-0000-0000-0000-000000000060'::uuid,
    repeat('a', 64),
    now() + interval '1 day',
    'completed',
    now()
  ),
  (
    '00000000-0000-0000-0000-000000000071'::uuid,
    '00000000-0000-0000-0000-000000000010'::uuid,
    '00000000-0000-0000-0000-000000000020'::uuid,
    '00000000-0000-0000-0000-000000000031'::uuid,
    '00000000-0000-0000-0000-000000000060'::uuid,
    repeat('b', 64),
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
    '00000000-0000-0000-0000-000000000080'::uuid,
    '00000000-0000-0000-0000-000000000010'::uuid,
    '00000000-0000-0000-0000-000000000020'::uuid,
    '00000000-0000-0000-0000-000000000070'::uuid,
    '00000000-0000-0000-0000-000000000030'::uuid,
    '00000000-0000-0000-0000-000000000060'::uuid,
    'completed'
  ),
  (
    '00000000-0000-0000-0000-000000000081'::uuid,
    '00000000-0000-0000-0000-000000000010'::uuid,
    '00000000-0000-0000-0000-000000000020'::uuid,
    '00000000-0000-0000-0000-000000000071'::uuid,
    '00000000-0000-0000-0000-000000000031'::uuid,
    '00000000-0000-0000-0000-000000000060'::uuid,
    'completed'
  );

insert into public.assessment_generations (
  organization_id,
  attempt_id,
  generation_number,
  status,
  assessment,
  provenance,
  completed_at
)
values
  (
    '00000000-0000-0000-0000-000000000010'::uuid,
    '00000000-0000-0000-0000-000000000080'::uuid,
    1,
    'completed',
    '{"summary":"Earlier assessment","competencies":[],"strengths":[],"concerns":[],"unansweredAreas":[],"questionCoverage":[],"evidenceSufficiency":"low"}'::jsonb,
    '{"source":"test-generation-1"}'::jsonb,
    now() - interval '1 minute'
  ),
  (
    '00000000-0000-0000-0000-000000000010'::uuid,
    '00000000-0000-0000-0000-000000000080'::uuid,
    2,
    'completed',
    '{"summary":"Evidence-grounded assessment","competencies":[{"competencyId":"00000000-0000-0000-0000-000000000090","score":4,"rationale":"The candidate described explicit trade-offs.","evidence":[{"messageSequence":7,"excerpt":"I would partition by tenant and keep writes idempotent."}],"evidenceSufficiency":"sufficient"}],"strengths":[],"concerns":[],"unansweredAreas":[],"questionCoverage":[],"evidenceSufficiency":"high"}'::jsonb,
    '{"source":"test-generation-2"}'::jsonb,
    now()
  );

insert into public.assessment_generations (
  organization_id,
  attempt_id,
  generation_number,
  status
)
values (
  '00000000-0000-0000-0000-000000000010'::uuid,
  '00000000-0000-0000-0000-000000000081'::uuid,
  1,
  'processing'
);


set local role authenticated;
select set_config(
  'request.jwt.claim.sub',
  '00000000-0000-0000-0000-000000000001',
  true
);

select lives_ok(
  format(
    $sql$
      select public.create_candidate_review_score_override(
        '00000000-0000-0000-0000-000000000010'::uuid,
        '00000000-0000-0000-0000-000000000020'::uuid,
        '00000000-0000-0000-0000-000000000030'::uuid,
        '00000000-0000-0000-0000-000000000080'::uuid,
        %L::uuid,
        '00000000-0000-0000-0000-000000000090',
        4,
        'Independent review supports this score.'
      )
    $sql$,
    (
      select id
      from public.assessment_generations
      where attempt_id = '00000000-0000-0000-0000-000000000080'::uuid
        and generation_number = 2
    )
  ),
  'an authorized reviewer can append a human score against the exact completed generation'
);

select is(
  (
    select reviewer_user_id
    from public.candidate_review_score_overrides
    where attempt_id = '00000000-0000-0000-0000-000000000080'::uuid
    order by created_at desc
    limit 1
  ),
  '00000000-0000-0000-0000-000000000001'::uuid,
  'the override records authenticated reviewer attribution'
);

select lives_ok(
  format(
    $sql$
      select public.create_candidate_review_score_override(
        '00000000-0000-0000-0000-000000000010'::uuid,
        '00000000-0000-0000-0000-000000000020'::uuid,
        '00000000-0000-0000-0000-000000000030'::uuid,
        '00000000-0000-0000-0000-000000000080'::uuid,
        %L::uuid,
        '00000000-0000-0000-0000-000000000090',
        null,
        'A later reviewer records insufficient evidence without erasing history.'
      )
    $sql$,
    (
      select id
      from public.assessment_generations
      where attempt_id = '00000000-0000-0000-0000-000000000080'::uuid
        and generation_number = 2
    )
  ),
  'a later null human score is appended rather than replacing the earlier override'
);

select is(
  (
    select count(*)::integer
    from public.candidate_review_score_overrides
    where attempt_id = '00000000-0000-0000-0000-000000000080'::uuid
      and competency_id = '00000000-0000-0000-0000-000000000090'
  ),
  2,
  'human override history remains append-only'
);

select throws_ok(
  format(
    $sql$
      select public.create_candidate_review_score_override(
        '00000000-0000-0000-0000-000000000010'::uuid,
        '00000000-0000-0000-0000-000000000021'::uuid,
        '00000000-0000-0000-0000-000000000030'::uuid,
        '00000000-0000-0000-0000-000000000080'::uuid,
        %L::uuid,
        '00000000-0000-0000-0000-000000000090',
        4,
        'Wrong job must not cross the boundary.'
      )
    $sql$,
    (
      select id
      from public.assessment_generations
      where attempt_id = '00000000-0000-0000-0000-000000000080'::uuid
        and generation_number = 2
    )
  ),
  '42501',
  'Candidate review scope unavailable.',
  'same-tenant wrong-job scope is rejected'
);

select throws_ok(
  format(
    $sql$
      select public.create_candidate_review_score_override(
        '00000000-0000-0000-0000-000000000010'::uuid,
        '00000000-0000-0000-0000-000000000020'::uuid,
        '00000000-0000-0000-0000-000000000030'::uuid,
        '00000000-0000-0000-0000-000000000080'::uuid,
        %L::uuid,
        '00000000-0000-0000-0000-000000000091',
        4,
        'Unknown competency must not be persisted.'
      )
    $sql$,
    (
      select id
      from public.assessment_generations
      where attempt_id = '00000000-0000-0000-0000-000000000080'::uuid
        and generation_number = 2
    )
  ),
  '42501',
  'Candidate review scope unavailable.',
  'a competency absent from the immutable completed assessment is rejected'
);

select throws_ok(
  format(
    $sql$
      select public.create_candidate_review_score_override(
        '00000000-0000-0000-0000-000000000010'::uuid,
        '00000000-0000-0000-0000-000000000020'::uuid,
        '00000000-0000-0000-0000-000000000030'::uuid,
        '00000000-0000-0000-0000-000000000080'::uuid,
        %L::uuid,
        '00000000-0000-0000-0000-000000000090',
        6,
        'Out of range.'
      )
    $sql$,
    (
      select id
      from public.assessment_generations
      where attempt_id = '00000000-0000-0000-0000-000000000080'::uuid
        and generation_number = 2
    )
  ),
  '22023',
  'Invalid human score override.',
  'scores outside 1..5 or null are rejected'
);

select throws_ok(
  format(
    $sql$
      select public.create_candidate_review_score_override(
        '00000000-0000-0000-0000-000000000010'::uuid,
        '00000000-0000-0000-0000-000000000020'::uuid,
        '00000000-0000-0000-0000-000000000030'::uuid,
        '00000000-0000-0000-0000-000000000080'::uuid,
        %L::uuid,
        '00000000-0000-0000-0000-000000000090',
        4,
        '   '
      )
    $sql$,
    (
      select id
      from public.assessment_generations
      where attempt_id = '00000000-0000-0000-0000-000000000080'::uuid
        and generation_number = 2
    )
  ),
  '22023',
  'Invalid human score override.',
  'blank reviewer reasons are rejected'
);

reset role;

select * from finish();

rollback;
