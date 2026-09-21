begin;

select plan(3);

select has_function(
  'public',
  'get_job_candidate_review_dashboard',
  array['uuid', 'uuid'],
  'M08 dashboard exposes a tenant/job-scoped candidate review workflow RPC'
);

select ok(
  has_function_privilege(
    'authenticated',
    'public.get_job_candidate_review_dashboard(uuid,uuid)',
    'EXECUTE'
  ),
  'authenticated hiring users can execute the job candidate review dashboard RPC'
);

select ok(
  not has_function_privilege(
    'anon',
    'public.get_job_candidate_review_dashboard(uuid,uuid)',
    'EXECUTE'
  ),
  'anonymous users cannot execute the job candidate review dashboard RPC'
);

select * from finish();
rollback;
