begin;

select plan(1);

select has_table(
  'public',
  'support_access_grants',
  'privileged support access grants are persisted'
);

select * from finish();
rollback;
