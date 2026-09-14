create table public.interview_technical_events (
  id uuid primary key default gen_random_uuid(),
  attempt_id uuid not null references public.interview_attempts(id) on delete restrict,
  category text not null check (category in ('provider_disconnect', 'browser_disconnect', 'microphone_failure', 'reconnect_failure')),
  occurred_at timestamptz not null,
  created_at timestamptz not null default now()
);

create index interview_technical_events_attempt_occurred_idx
  on public.interview_technical_events(attempt_id, occurred_at);

alter table public.interview_technical_events enable row level security;

revoke all on table public.interview_technical_events from anon;
revoke all on table public.interview_technical_events from authenticated;

create or replace function public.record_realtime_interview_technical_event(
  p_token_hash text,
  p_attempt_id uuid,
  p_category text,
  p_occurred_at timestamptz
)
returns table (
  event_id uuid,
  category text,
  occurred_at timestamptz
)
language plpgsql
security definer
set search_path = ''
as $$
declare
  authorized_attempt public.interview_attempts;
  inserted_event public.interview_technical_events;
begin
  if p_token_hash is null
     or btrim(p_token_hash) = ''
     or p_attempt_id is null
     or p_category not in ('provider_disconnect', 'browser_disconnect', 'microphone_failure', 'reconnect_failure')
     or p_occurred_at is null then
    raise exception 'technical event unavailable';
  end if;

  select attempt.*
    into authorized_attempt
  from public.interview_attempts attempt
  join public.candidate_invitations candidate_invitation
    on candidate_invitation.id = attempt.invitation_id
   and candidate_invitation.candidate_id = attempt.candidate_id
   and candidate_invitation.job_id = attempt.job_id
   and candidate_invitation.organization_id = attempt.organization_id
   and candidate_invitation.interviewer_version_id = attempt.interviewer_version_id
  where attempt.id = p_attempt_id
    and attempt.state = 'active'
    and candidate_invitation.token_hash = p_token_hash
    and candidate_invitation.expires_at > now()
    and candidate_invitation.revoked_at is null
    and candidate_invitation.state = 'started';

  if authorized_attempt.id is null then
    raise exception 'technical event unavailable';
  end if;

  insert into public.interview_technical_events (
    attempt_id,
    category,
    occurred_at
  ) values (
    p_attempt_id,
    p_category,
    p_occurred_at
  )
  returning * into inserted_event;

  return query
  select
    inserted_event.id,
    inserted_event.category,
    inserted_event.occurred_at;
end;
$$;

revoke all on function public.record_realtime_interview_technical_event(text, uuid, text, timestamptz) from public;
grant execute on function public.record_realtime_interview_technical_event(text, uuid, text, timestamptz) to anon, authenticated;
