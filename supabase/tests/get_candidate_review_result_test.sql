begin;

select plan(9);

select has_function(
  'public',
  'get_candidate_review_result',
  array['uuid', 'uuid', 'uuid'],
  'M08 review exposes the tenant/job/candidate-scoped candidate result RPC'
);

select ok(
  has_function_privilege(
    'authenticated',
    'public.get_candidate_review_result(uuid,uuid,uuid)',
    'EXECUTE'
  ),
  'authenticated hiring users can execute the candidate result RPC'
);

select ok(
  not has_function_privilege(
    'anon',
    'public.get_candidate_review_result(uuid,uuid,uuid)',
    'EXECUTE'
  ),
  'anonymous users cannot execute the candidate result RPC'
);

set local role authenticated;

select throws_ok(
  $$
    select public.get_candidate_review_result(
      '00000000-0000-0000-0000-000000000010'::uuid,
      '00000000-0000-0000-0000-000000000020'::uuid,
      '00000000-0000-0000-0000-000000000030'::uuid
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

select throws_ok(
  $$
    select public.get_candidate_review_result(
      '00000000-0000-0000-0000-000000000011'::uuid,
      '00000000-0000-0000-0000-000000000022'::uuid,
      '00000000-0000-0000-0000-000000000032'::uuid
    )
  $$,
  '42501',
  'Not authorized to review candidate results.',
  'the RPC fails closed for a real cross-tenant candidate scope'
);

select is(
  public.get_candidate_review_result(
    '00000000-0000-0000-0000-000000000010'::uuid,
    '00000000-0000-0000-0000-000000000020'::uuid,
    '00000000-0000-0000-0000-000000000030'::uuid
  ),
  jsonb_build_object(
    'organization_id', '00000000-0000-0000-0000-000000000010'::uuid,
    'job_id', '00000000-0000-0000-0000-000000000020'::uuid,
    'candidate_id', '00000000-0000-0000-0000-000000000030'::uuid,
    'attempt_id', '00000000-0000-0000-0000-000000000080'::uuid,
    'assessment_generation_id', '00000000-0000-0000-0000-000000000099'::uuid,
    'candidate_name', 'Ada Candidate',
    'job_title', 'Senior Platform Engineer',
    'interview_status', 'completed',
    'review_status', 'awaiting_review',
    'generation_number', 2,
    'assessment_status', 'completed',
    'assessment', '{"summary":"Evidence-grounded assessment","competencies":[{"competencyId":"00000000-0000-0000-0000-000000000090","score":4,"rationale":"The candidate described explicit trade-offs.","evidence":[{"messageSequence":7,"excerpt":"I would partition by tenant and keep writes idempotent."}],"evidenceSufficiency":"sufficient"}],"strengths":[],"concerns":[],"unansweredAreas":[],"questionCoverage":[],"evidenceSufficiency":"high"}'::jsonb,
    'competency_catalog', '[{"id":"00000000-0000-0000-0000-000000000090","name":"Immutable System Design"}]'::jsonb
  ),
  'the RPC returns the latest completed assessment with competency identity from the immutable interviewer snapshot'
);

select ok(
  public.get_candidate_review_result(
    '00000000-0000-0000-0000-000000000010'::uuid,
    '00000000-0000-0000-0000-000000000021'::uuid,
    '00000000-0000-0000-0000-000000000030'::uuid
  ) is null,
  'the RPC returns no result when the candidate is paired with a different same-tenant job'
);

select ok(
  public.get_candidate_review_result(
    '00000000-0000-0000-0000-000000000010'::uuid,
    '00000000-0000-0000-0000-000000000020'::uuid,
    '00000000-0000-0000-0000-000000000031'::uuid
  ) is null,
  'the RPC returns no result when the candidate has no completed assessment generation'
);

select ok(
  public.get_candidate_review_result(
    '00000000-0000-0000-0000-000000000010'::uuid,
    '00000000-0000-0000-0000-000000000020'::uuid,
    '00000000-0000-0000-0000-000000000039'::uuid
  ) is null,
  'the RPC returns no result for a missing candidate in an authorized tenant/job scope'
);

reset role;

select * from finish();

rollback;
