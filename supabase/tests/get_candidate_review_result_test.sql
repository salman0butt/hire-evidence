begin;

select plan(1);

select has_function(
  'public',
  'get_candidate_review_result',
  array['uuid', 'uuid', 'uuid'],
  'M08.1 exposes the tenant/job/candidate-scoped candidate result RPC'
);

select * from finish();

rollback;
