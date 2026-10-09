-- M11.5: bound candidate technical-event ingestion by authoritative server time.
-- Client-supplied occurred_at remains diagnostic data and never controls quota accounting.
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
  authorized_attempt_id uuid;
  recent_event_count integer;
  inserted_event public.interview_technical_events;
begin
  if p_token_hash is null
     or btrim(p_token_hash) = ''
     or p_attempt_id is null
     or p_category not in ('provider_disconnect', 'browser_disconnect', 'microphone_failure', 'reconnect_failure')
     or p_occurred_at is null then
    raise exception 'technical event unavailable';
  end if;

  -- Serialize quota consumption on the authoritative attempt so concurrent
  -- app instances cannot race the count-and-insert boundary.
  select attempt.id
    into authorized_attempt_id
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
    and candidate_invitation.state = 'started'
  for update of attempt;

  if authorized_attempt_id is null then
    raise exception 'technical event unavailable';
  end if;

  -- Use server-owned created_at for quota accounting. occurred_at is supplied
  -- by the browser for diagnostics and must not be able to evade the limit.
  select count(*)::integer
    into recent_event_count
  from public.interview_technical_events event_row
  where event_row.attempt_id = authorized_attempt_id
    and event_row.created_at >= now() - interval '1 minute';

  if recent_event_count >= 12 then
    raise exception 'technical event rate limit exceeded';
  end if;

  insert into public.interview_technical_events (
    attempt_id,
    category,
    occurred_at
  ) values (
    authorized_attempt_id,
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
