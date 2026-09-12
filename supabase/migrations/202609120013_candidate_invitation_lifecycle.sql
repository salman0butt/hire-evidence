create type public.candidate_invitation_state as enum (
  'draft',
  'sent',
  'opened',
  'started',
  'completed'
);

alter table public.candidate_invitations
  add column state public.candidate_invitation_state not null default 'draft',
  add column sent_at timestamptz,
  add column opened_at timestamptz,
  add column started_at timestamptz,
  add column completed_at timestamptz;

revoke update on public.candidate_invitations from authenticated;

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
