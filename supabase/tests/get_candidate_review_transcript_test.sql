begin;

select plan(1);

select has_function(
  'public',
  'get_candidate_review_transcript',
  array['uuid', 'uuid', 'uuid', 'uuid'],
  'M08.3 exposes a dedicated authenticated tenant/job/candidate/attempt-scoped transcript review RPC'
);

select * from finish();

rollback;
