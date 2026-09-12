create table public.interview_attempts (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations(id) on delete restrict,
  job_id uuid not null references public.jobs(id) on delete restrict,
  invitation_id uuid not null references public.candidate_invitations(id) on delete restrict,
  candidate_id uuid not null references public.candidates(id) on delete restrict,
  interviewer_version_id uuid not null references public.interviewer_versions(id) on delete restrict,
  state text not null default 'active' check (state in ('active', 'completed', 'aborted')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (invitation_id),
  foreign key (candidate_id, job_id, organization_id)
    references public.candidates(id, job_id, organization_id)
    on delete restrict,
  foreign key (interviewer_version_id, job_id, organization_id)
    references public.interviewer_versions(id, job_id, organization_id)
    on delete restrict
);

create index interview_attempts_organization_job_idx
  on public.interview_attempts(organization_id, job_id, created_at desc);

alter table public.interview_attempts enable row level security;

revoke all on table public.interview_attempts from anon;
revoke all on table public.interview_attempts from authenticated;

create or replace function public.authorize_realtime_interview_session(
  p_token_hash text
)
returns public.interview_attempts
language plpgsql
security definer
set search_path = ''
as $$
declare
  invitation public.candidate_invitations;
  attempt public.interview_attempts;
begin
  if p_token_hash is null or btrim(p_token_hash) = '' then
    raise exception 'invitation unavailable';
  end if;

  select candidate_invitation.*
    into invitation
  from public.candidate_invitations candidate_invitation
  join public.interviewer_versions interviewer_version
    on interviewer_version.id = candidate_invitation.interviewer_version_id
   and interviewer_version.job_id = candidate_invitation.job_id
   and interviewer_version.organization_id = candidate_invitation.organization_id
  where candidate_invitation.token_hash = p_token_hash
    and candidate_invitation.expires_at > now()
    and candidate_invitation.revoked_at is null
    and candidate_invitation.state in ('sent', 'opened', 'started')
    and exists (
      select 1
      from public.candidate_consent_events consent
      where consent.invitation_id = candidate_invitation.id
        and consent.disclosure_version = 'candidate-interview-v1'
        and consent.disclosure_categories @> array[
          'ai_assisted',
          'transcription',
          'data_processing',
          'retention'
        ]::text[]
    )
  for update of candidate_invitation;

  if invitation.id is null then
    raise exception 'invitation unavailable';
  end if;

  insert into public.interview_attempts (
    organization_id,
    job_id,
    invitation_id,
    candidate_id,
    interviewer_version_id
  ) values (
    invitation.organization_id,
    invitation.job_id,
    invitation.id,
    invitation.candidate_id,
    invitation.interviewer_version_id
  )
  on conflict (invitation_id) do update
    set updated_at = now()
  returning * into attempt;

  if attempt.state <> 'active' then
    raise exception 'invitation unavailable';
  end if;

  update public.candidate_invitations
  set state = 'started',
      started_at = coalesce(started_at, now()),
      updated_at = now()
  where id = invitation.id
    and state in ('sent', 'opened', 'started');

  if not found then
    raise exception 'invitation unavailable';
  end if;

  return attempt;
end;
$$;

revoke all on function public.authorize_realtime_interview_session(text) from public;
grant execute on function public.authorize_realtime_interview_session(text) to anon, authenticated;
