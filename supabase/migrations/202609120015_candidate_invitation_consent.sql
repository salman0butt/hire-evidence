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
     or btrim(p_disclosure_version) = ''
     or p_disclosure_version <> 'candidate-interview-v1' then
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
    p_disclosure_version,
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

create or replace function public.transition_candidate_invitation(
  invitation_id uuid,
  target_state public.candidate_invitation_state
)
returns public.candidate_invitations
language plpgsql
security definer
set search_path = ''
as $$
declare
  invitation public.candidate_invitations;
  expected_state public.candidate_invitation_state;
begin
  select *
    into invitation
  from public.candidate_invitations
  where id = invitation_id
  for update;

  if invitation.id is null then
    raise exception 'invitation not found';
  end if;

  if not private.has_organization_role(
    invitation.organization_id,
    array['owner', 'admin', 'recruiter', 'hiring_manager']::public.organization_role[]
  ) then
    raise exception 'not authorized';
  end if;

  if invitation.expires_at <= now()
     or invitation.revoked_at is not null
     or invitation.state = 'completed' then
    raise exception 'invitation is no longer active';
  end if;

  expected_state := case invitation.state
    when 'draft' then 'sent'::public.candidate_invitation_state
    when 'sent' then 'opened'::public.candidate_invitation_state
    when 'opened' then 'started'::public.candidate_invitation_state
    when 'started' then 'completed'::public.candidate_invitation_state
    else null
  end;

  if target_state is distinct from expected_state then
    raise exception 'invalid invitation transition';
  end if;

  if target_state = 'started' and not exists (
    select 1
    from public.candidate_consent_events consent
    where consent.invitation_id = invitation.id
      and consent.disclosure_version = 'candidate-interview-v1'
      and consent.disclosure_categories @> array[
        'ai_assisted',
        'transcription',
        'data_processing',
        'retention'
      ]::text[]
  ) then
    raise exception 'current disclosure consent required';
  end if;

  update public.candidate_invitations
  set state = target_state,
      sent_at = case
        when target_state = 'sent' then coalesce(sent_at, now())
        else sent_at
      end,
      opened_at = case
        when target_state = 'opened' then coalesce(opened_at, now())
        else opened_at
      end,
      started_at = case
        when target_state = 'started' then coalesce(started_at, now())
        else started_at
      end,
      completed_at = case
        when target_state = 'completed' then coalesce(completed_at, now())
        else completed_at
      end,
      updated_at = now()
  where id = invitation.id
  returning * into invitation;

  return invitation;
end;
$$;

revoke all on function public.transition_candidate_invitation(uuid, public.candidate_invitation_state) from public;
grant execute on function public.transition_candidate_invitation(uuid, public.candidate_invitation_state) to authenticated;