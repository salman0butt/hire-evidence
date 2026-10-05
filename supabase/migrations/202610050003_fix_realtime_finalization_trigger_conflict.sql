create or replace function public.finalize_realtime_interview_session(
  p_token_hash text,
  p_attempt_id uuid
)
returns table (
  attempt_id uuid,
  attempt_state text,
  completed_at timestamptz,
  duration_seconds integer,
  assessment_trigger_id uuid
)
language plpgsql
security definer
set search_path = ''
as $$
declare
  authorized_attempt public.interview_attempts;
  assessment_trigger public.interview_assessment_triggers;
begin
  if p_token_hash is null
     or btrim(p_token_hash) = ''
     or p_attempt_id is null then
    raise exception 'realtime finalization unavailable';
  end if;

  select interview_attempt.*
    into authorized_attempt
  from public.interview_attempts interview_attempt
  join public.candidate_invitations candidate_invitation
    on candidate_invitation.id = interview_attempt.invitation_id
   and candidate_invitation.candidate_id = interview_attempt.candidate_id
   and candidate_invitation.job_id = interview_attempt.job_id
   and candidate_invitation.organization_id = interview_attempt.organization_id
   and candidate_invitation.interviewer_version_id = interview_attempt.interviewer_version_id
  where interview_attempt.id = p_attempt_id
    and interview_attempt.state in ('active', 'completed')
    and candidate_invitation.token_hash = p_token_hash
    and candidate_invitation.expires_at > now()
    and candidate_invitation.revoked_at is null
    and candidate_invitation.state = 'started'
  for update of interview_attempt;

  if authorized_attempt.id is null then
    raise exception 'realtime finalization unavailable';
  end if;

  update public.interview_attempts interview_attempt
  set state = 'completed',
      completed_at = coalesce(interview_attempt.completed_at, now()),
      duration_seconds = coalesce(
        interview_attempt.duration_seconds,
        greatest(
          0,
          floor(
            extract(
              epoch from (coalesce(interview_attempt.completed_at, now()) - interview_attempt.created_at)
            )
          )::integer
        )
      ),
      updated_at = now()
  where interview_attempt.id = authorized_attempt.id
  returning interview_attempt.* into authorized_attempt;

  insert into public.interview_assessment_triggers (attempt_id)
  values (authorized_attempt.id)
  on conflict on constraint interview_assessment_triggers_attempt_id_key do nothing;

  select trigger_record.*
    into assessment_trigger
  from public.interview_assessment_triggers trigger_record
  where trigger_record.attempt_id = authorized_attempt.id;

  if assessment_trigger.id is null then
    raise exception 'realtime finalization unavailable';
  end if;

  return query
  select
    authorized_attempt.id,
    authorized_attempt.state,
    authorized_attempt.completed_at,
    authorized_attempt.duration_seconds,
    assessment_trigger.id;
end;
$$;

revoke all on function public.finalize_realtime_interview_session(text, uuid) from public;
grant execute on function public.finalize_realtime_interview_session(text, uuid) to anon, authenticated;
