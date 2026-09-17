begin;

select plan(5);

select has_function(
  'public',
  'get_candidate_review_result',
  array['uuid', 'uuid', 'uuid'],
  'M08.1 exposes the tenant/job/candidate-scoped candidate result RPC'
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

select set_config(
  'request.jwt.claim.sub',
  '00000000-0000-0000-0000-000000000001',
  true
);

select throws_ok(
  $$
    select public.get_candidate_review_result(
      '00000000-0000-0000-0000-000000000010'::uuid,
      '00000000-0000-0000-0000-000000000020'::uuid,
      '00000000-0000-0000-0000-000000000030'::uuid
    )
  $$,
  '42501',
  'Not authorized to review candidate results.',
  'the RPC fails closed when the actor is not a member of the requested tenant'
);

reset role;

select * from finish();

rollback;
