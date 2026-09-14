create table public.interview_transcript_messages (
  id uuid primary key default gen_random_uuid(),
  attempt_id uuid not null references public.interview_attempts(id) on delete restrict,
  event_id text not null check (btrim(event_id) <> ''),
  sequence integer not null check (sequence > 0),
  speaker text not null check (speaker in ('candidate', 'interviewer')),
  text text not null check (btrim(text) <> ''),
  started_at timestamptz,
  ended_at timestamptz,
  finalized_at timestamptz not null default now(),
  unique (attempt_id, sequence),
  unique (attempt_id, event_id),
  check (started_at is null or ended_at is null or ended_at >= started_at)
);

create index interview_transcript_messages_attempt_finalized_idx
  on public.interview_transcript_messages(attempt_id, finalized_at);

alter table public.interview_transcript_messages enable row level security;

revoke all on table public.interview_transcript_messages from anon;
revoke all on table public.interview_transcript_messages from authenticated;

create or replace function public.append_realtime_interview_transcript_turn(
  p_token_hash text,
  p_attempt_id uuid,
  p_event_id text,
  p_speaker text,
  p_text text,
  p_started_at timestamptz,
  p_ended_at timestamptz
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
security definer
set search_path = ''
as $$
declare
  authorized_attempt public.interview_attempts;
  message_record public.interview_transcript_messages;
  next_sequence integer;
begin
  if p_token_hash is null
     or btrim(p_token_hash) = ''
     or p_attempt_id is null
     or p_event_id is null
     or btrim(p_event_id) = ''
     or p_speaker not in ('candidate', 'interviewer')
     or p_text is null
     or btrim(p_text) = ''
     or (p_started_at is not null and p_ended_at is not null and p_ended_at < p_started_at) then
    raise exception 'transcript unavailable';
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
    and candidate_invitation.state = 'started'
  for update of attempt;

  if authorized_attempt.id is null then
    raise exception 'transcript unavailable';
  end if;

  select existing.*
    into message_record
  from public.interview_transcript_messages existing
  where existing.attempt_id = p_attempt_id
    and existing.event_id = btrim(p_event_id);

  if message_record.id is not null then
    if message_record.speaker <> p_speaker
       or message_record.text <> btrim(p_text)
       or message_record.started_at is distinct from p_started_at
       or message_record.ended_at is distinct from p_ended_at then
      raise exception 'transcript unavailable';
    end if;

    return query
    select
      message_record.id,
      message_record.event_id,
      message_record.sequence,
      message_record.speaker,
      message_record.text,
      message_record.started_at,
      message_record.ended_at,
      message_record.finalized_at;
    return;
  end if;

  select coalesce(max(message.sequence), 0) + 1
    into next_sequence
  from public.interview_transcript_messages message
  where message.attempt_id = p_attempt_id;

  insert into public.interview_transcript_messages (
    attempt_id,
    event_id,
    sequence,
    speaker,
    text,
    started_at,
    ended_at
  ) values (
    p_attempt_id,
    btrim(p_event_id),
    next_sequence,
    p_speaker,
    btrim(p_text),
    p_started_at,
    p_ended_at
  )
  on conflict (attempt_id, event_id) do nothing
  returning * into message_record;

  if message_record.id is null then
    select existing.*
      into message_record
    from public.interview_transcript_messages existing
    where existing.attempt_id = p_attempt_id
      and existing.event_id = btrim(p_event_id);
  end if;

  if message_record.id is null
     or message_record.speaker <> p_speaker
     or message_record.text <> btrim(p_text)
     or message_record.started_at is distinct from p_started_at
     or message_record.ended_at is distinct from p_ended_at then
    raise exception 'transcript unavailable';
  end if;

  return query
  select
    message_record.id,
    message_record.event_id,
    message_record.sequence,
    message_record.speaker,
    message_record.text,
    message_record.started_at,
    message_record.ended_at,
    message_record.finalized_at;
end;
$$;

revoke all on function public.append_realtime_interview_transcript_turn(text, uuid, text, text, text, timestamptz, timestamptz) from public;
grant execute on function public.append_realtime_interview_transcript_turn(text, uuid, text, text, text, timestamptz, timestamptz) to anon, authenticated;

create or replace function public.list_realtime_interview_transcript(
  p_token_hash text,
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
  authorized_attempt public.interview_attempts;
begin
  if p_token_hash is null or btrim(p_token_hash) = '' or p_attempt_id is null then
    raise exception 'transcript unavailable';
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
    and candidate_invitation.token_hash = p_token_hash
    and candidate_invitation.expires_at > now()
    and candidate_invitation.revoked_at is null;

  if authorized_attempt.id is null then
    raise exception 'transcript unavailable';
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
  order by message.sequence;
end;
$$;

revoke all on function public.list_realtime_interview_transcript(text, uuid) from public;
grant execute on function public.list_realtime_interview_transcript(text, uuid) to anon, authenticated;
