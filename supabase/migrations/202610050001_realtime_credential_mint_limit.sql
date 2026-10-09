-- M11.5: server-authoritative, per-attempt provider credential mint limiting.
-- Only hashed invitation capabilities reach this boundary; raw tokens are never stored.
create table public.realtime_credential_mints (
  id bigint generated always as identity primary key,
  attempt_id uuid not null references public.interview_attempts(id) on delete cascade,
  minted_at timestamptz not null default now()
);

create index realtime_credential_mints_attempt_window_idx
  on public.realtime_credential_mints(attempt_id, minted_at desc);

alter table public.realtime_credential_mints enable row level security;

revoke all on table public.realtime_credential_mints from anon;
revoke all on table public.realtime_credential_mints from authenticated;

create or replace function public.consume_realtime_credential_mint(
  p_token_hash text,
  p_attempt_id uuid
)
returns boolean
language plpgsql
security definer
set search_path = ''
as $$
declare
  v_attempt_id uuid;
  v_window_start timestamptz := now() - interval '1 minute';
  v_recent_mints integer;
begin
  if p_token_hash is null
     or btrim(p_token_hash) = ''
     or p_attempt_id is null then
    raise exception 'realtime credential unavailable';
  end if;

  -- Serialize consumption on the authoritative attempt row so concurrent
  -- application instances cannot race the count-and-insert boundary.
  select attempt.id
    into v_attempt_id
  from public.interview_attempts attempt
  join public.candidate_invitations invitation
    on invitation.id = attempt.invitation_id
   and invitation.candidate_id = attempt.candidate_id
   and invitation.job_id = attempt.job_id
   and invitation.organization_id = attempt.organization_id
   and invitation.interviewer_version_id = attempt.interviewer_version_id
  where attempt.id = p_attempt_id
    and attempt.state = 'active'
    and invitation.token_hash = p_token_hash
    and invitation.expires_at > now()
    and invitation.revoked_at is null
    and invitation.state = 'started'
  for update of attempt;

  if v_attempt_id is null then
    raise exception 'realtime credential unavailable';
  end if;

  -- Keep only the active abuse-control window for this attempt. This avoids
  -- creating an unbounded operational history or a shadow candidate-evidence store.
  delete from public.realtime_credential_mints mint
  where mint.attempt_id = v_attempt_id
    and mint.minted_at < v_window_start;

  select count(*)::integer
    into v_recent_mints
  from public.realtime_credential_mints mint
  where mint.attempt_id = v_attempt_id
    and mint.minted_at >= v_window_start;

  -- Two mints per minute permits one immediate reconnect while bounding
  -- repeated provider-credential issuance across all application instances.
  if v_recent_mints >= 2 then
    return false;
  end if;

  insert into public.realtime_credential_mints (attempt_id)
  values (v_attempt_id);

  return true;
end;
$$;

revoke all on function public.consume_realtime_credential_mint(text, uuid) from public;
grant execute on function public.consume_realtime_credential_mint(text, uuid) to anon, authenticated;
