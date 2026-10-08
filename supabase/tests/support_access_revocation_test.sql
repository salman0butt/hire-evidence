begin;
select plan(1);
select has_function('public','revoke_support_access',array['uuid','uuid'],'support access revocation must use an explicit authorized RPC');
select * from finish();
rollback;
