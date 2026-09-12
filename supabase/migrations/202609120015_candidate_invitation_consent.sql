create table public.candidate_consent_events (
  id uuid primary key default gen_random_uuid(),
  invitation_id uuid not null references public.candidate_invitations(id) on delete restrict,
  disclosure_version text not null check (btrim(disclosure_version) <> ''),
  disclosure_categories text[] not null check (
    disclosure_categories @> array[
      'ai_assisted',
      'transcription',
      'data_processing',
      'retention'
    ]::text[]
  ),
  consented_at timestamptz not null default now()
);

alter table public.candidate_consent_events enable row level security;

revoke all on public.candidate_consent_events from anon, authenticated;
revoke update, delete on public.candidate_consent_events from authenticated;

create or replace function public.record_candidate_invitation_consent(
  p_token_hash text,
  p_disclosure_version text
)
returns boolean
language plpgsql
security definer
set search_path = ''
as $$
declare
  invitation public.candidate_invitations;
begin
  if p_token_hash is null
     or btrim(p_token_hash) = ''
     or p_disclosure_version is null
     or btrim(p_disclosure_version) = '' then
    raise exception 'invitation unavailable';
  end if;

  select *
    into invitation
  from public.candidate_invitations
  where token_hash = p_token_hash
    and expires_at > now()
    and revoked_at is null
    and state in ('sent', 'opened')
  for update;

  if invitation.id is null then
    raise exception 'invitation unavailable';
  end if;

  insert into public.candidate_consent_events (
    invitation_id,
    disclosure_version,
    disclosure_categories
  ) values (
    invitation.id,
    btrim(p_disclosure_version),
    array[
      'ai_assisted',
      'transcription',
      'data_processing',
      'retention'
    ]::text[]
  );

  return true;
end;
$$;

revoke all on function public.record_candidate_invitation_consent(text, text) from public;
grant execute on function public.record_candidate_invitation_consent(text, text) to anon, authenticated;