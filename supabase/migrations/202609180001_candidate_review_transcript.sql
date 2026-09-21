create or replace function public.get_candidate_review_transcript(
  p_organization_id uuid,
  p_job_id uuid,
  p_candidate_id uuid,
  p_attempt_id uuid
)
returns table (
  message_id uuid,
  event_id text,
  sequence integer,
  speaker text,
  text text,
  started_at timestamptz,
  ended_at timestamptz,
  finalized_at timestamptz
)
language plpgsql
stable
security definer
set search_path = ''
as $$
declare
  actor_id uuid := auth.uid();
  authorized_attempt public.interview_attempts;
begin
  if actor_id is null then
    raise exception 'Authentication required.' using errcode = '42501';
  end if;

  if not private.is_organization_member(p_organization_id) then
    raise exception 'Not authorized to review candidate transcript.' using errcode = '42501';
  end if;

  select attempt.*
    into authorized_attempt
  from public.interview_attempts attempt
  join public.candidates candidate
    on candidate.id = attempt.candidate_id
   and candidate.organization_id = attempt.organization_id
   and candidate.job_id = attempt.job_id
  where attempt.id = p_attempt_id
    and attempt.organization_id = p_organization_id
    and attempt.job_id = p_job_id
    and attempt.candidate_id = p_candidate_id
    and candidate.id = p_candidate_id;

  if authorized_attempt.id is null then
    raise exception 'Not authorized to review candidate transcript.' using errcode = '42501';
  end if;

  return query
  select
    message.id as message_id,
    message.event_id,
    message.sequence,
    message.speaker,
    message.text,
    message.started_at,
    message.ended_at,
    message.finalized_at
  from public.interview_transcript_messages message
  where message.attempt_id = p_attempt_id
    and message.finalized_at is not null
  order by message.sequence;
end;
$$;

revoke all on function public.get_candidate_review_transcript(uuid, uuid, uuid, uuid) from public;
revoke all on function public.get_candidate_review_transcript(uuid, uuid, uuid, uuid) from anon;
grant execute on function public.get_candidate_review_transcript(uuid, uuid, uuid, uuid) to authenticated;
