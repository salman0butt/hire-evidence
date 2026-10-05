-- M11.5: bound candidate technical-event ingestion by authoritative server time.
-- Client-supplied occurred_at remains diagnostic data and never controls quota accounting.
create or replace function public.record_realtime_interview_technical_event(
  p_token_hash text,
  p_attempt_id uuid,
  p_category public.interview_technical_event_category,
  p_occurred_at timestamptz
)
returns public.interview_technical_events
language plpgsql
security definer
set search_path = ''
as $$
declare
  v_attempt_id uuid;
  v_recent_event_count integer;
  v_event public.interview_technical_events;
begin
  if p_token_hash is null
     or btrim(p_token_hash) = ''
     or p_attempt_id is null
     or p_category is null
     or p_occurred_at is null then
    raise exception 'technical event unavailable';
  end if;

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
    raise exception 'technical event unavailable';
  end if;

  select count(*)::integer
    into v_recent_event_count
  from public.interview_technical_events event_row
  where event_row.attempt_id = v_attempt_id
    and event_row.created_at >= now() - interval '1 minute';

  if v_recent_event_count >= 12 then
    raise exception 'technical event rate limit exceeded';
  end if;

  insert into public.interview_technical_events (
    organization_id,
    job_id,
    invitation_id,
    candidate_id,
    interviewer_version_id,
    attempt_id,
    category,
    occurred_at
  )
  select
    attempt.organization_id,
    attempt.job_id,
    attempt.invitation_id,
    attempt.candidate_id,
    attempt.interviewer_version_id,
    attempt.id,
    p_category,
    p_occurred_at
  from public.interview_attempts attempt
  where attempt.id = v_attempt_id
  returning * into v_event;

  return v_event;
end;
$$;

revoke all on function public.record_realtime_interview_technical_event(
  text,
  uuid,
  public.interview_technical_event_category,
  timestamptz
) from public;
revoke all on function public.record_realtime_interview_technical_event(
  text,
  uuid,
  public.interview_technical_event_category,
  timestamptz
) from anon;
grant execute on function public.record_realtime_interview_technical_event(
  text,
  uuid,
  public.interview_technical_event_category,
  timestamptz
) to anon;
