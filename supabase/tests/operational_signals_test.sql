begin;

select plan(8);

select has_table(
  'public',
  'operational_signals',
  'privacy-minimized operational signals are persisted'
);

select has_function(
  'public',
  'record_operational_signal',
  array['text','text','text','text','integer','text'],
  'server-only operational signal ingestion RPC exists'
);

select has_function(
  'public',
  'purge_expired_operational_signals',
  array[]::text[],
  'bounded-retention cleanup RPC exists'
);

select ok(
  not has_table_privilege('anon', 'public.operational_signals', 'SELECT'),
  'anonymous clients cannot read operational signals'
);

select ok(
  not has_table_privilege('authenticated', 'public.operational_signals', 'SELECT'),
  'organization members cannot read platform operational signals directly'
);

select ok(
  not has_table_privilege('authenticated', 'public.operational_signals', 'INSERT'),
  'authenticated clients cannot insert operational signals directly'
);

select ok(
  not has_function_privilege(
    'authenticated',
    'public.record_operational_signal(text,text,text,text,integer,text)',
    'EXECUTE'
  ),
  'authenticated clients cannot invoke platform operational ingestion'
);

select ok(
  not has_function_privilege(
    'anon',
    'public.record_operational_signal(text,text,text,text,integer,text)',
    'EXECUTE'
  ),
  'anonymous clients cannot invoke platform operational ingestion'
);

select * from finish();
rollback;
