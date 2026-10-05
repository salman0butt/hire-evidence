-- M11.6: privacy-minimized platform operational signals with bounded retention.
create table public.operational_signals (
  id bigint generated always as identity primary key,
  request_id text not null check (request_id ~ '^[A-Za-z0-9._:-]{1,128}$'),
  correlation_id text not null check (correlation_id ~ '^[A-Za-z0-9._:-]{1,128}$'),
  service text not null check (service ~ '^[a-z0-9._-]{1,64}$'),
  status text not null check (status in ('ok', 'degraded', 'error')),
  latency_ms integer not null check (latency_ms >= 0 and latency_ms <= 300000),
  error_code text check (error_code is null or error_code ~ '^[A-Z0-9_]{1,64}$'),
  recorded_at timestamptz not null default now(),
  expires_at timestamptz not null default (now() + interval '30 days'),
  check ((status = 'error' and error_code is not null) or (status <> 'error' and error_code is null))
);

create index operational_signals_expires_at_idx
  on public.operational_signals(expires_at);

alter table public.operational_signals enable row level security;

revoke all on table public.operational_signals from anon;
revoke all on table public.operational_signals from authenticated;

create or replace function public.record_operational_signal(
  p_request_id text,
  p_correlation_id text,
  p_service text,
  p_status text,
  p_latency_ms integer,
  p_error_code text
)
returns bigint
language plpgsql
security definer
set search_path = ''
as $$
declare
  v_id bigint;
begin
  insert into public.operational_signals (
    request_id,
    correlation_id,
    service,
    status,
    latency_ms,
    error_code
  )
  values (
    p_request_id,
    p_correlation_id,
    p_service,
    p_status,
    p_latency_ms,
    p_error_code
  )
  returning id into v_id;

  return v_id;
end;
$$;

revoke all on function public.record_operational_signal(text, text, text, text, integer, text) from public;
grant execute on function public.record_operational_signal(text, text, text, text, integer, text) to service_role;

create or replace function public.purge_expired_operational_signals()
returns integer
language plpgsql
security definer
set search_path = ''
as $$
declare
  v_deleted integer;
begin
  delete from public.operational_signals
  where expires_at <= now();

  get diagnostics v_deleted = row_count;
  return v_deleted;
end;
$$;

revoke all on function public.purge_expired_operational_signals() from public;
grant execute on function public.purge_expired_operational_signals() to service_role;
