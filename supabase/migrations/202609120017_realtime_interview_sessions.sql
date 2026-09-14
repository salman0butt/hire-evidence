create table public.interview_attempts (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations(id) on delete restrict,
  job_id uuid not null references public.jobs(id) on delete restrict,
  invitation_id uuid not null references public.candidate_invitations(id) on delete restrict,
  candidate_id uuid not null references public.candidates(id) on delete restrict,
  interviewer_version_id uuid not null references public.interviewer_versions(id) on delete restrict,
  state text not null default 'active' check (state in ('active', 'completed', 'aborted')),
  resume_section_index integer not null default 0 check (resume_section_index >= 0),
  resume_question_index integer not null default 0 check (resume_question_index >= 0),
  resume_follow_ups_used jsonb not null default '{}'::jsonb check (jsonb_typeof(resume_follow_ups_used) = 'object'),
  processed_event_ids jsonb not null default '[]'::jsonb check (jsonb_typeof(processed_event_ids) = 'array'),
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

create or replace function public.resolve_realtime_candidate_session(
  p_token_hash text
)
returns table (
  invitation_id uuid,
  candidate_id uuid,
  interviewer_version_id uuid,
  duration_seconds integer,
  language text,
  lifecycle text,
  has_current_consent boolean,
  interview_plan jsonb
)
language sql
stable
security definer
set search_path = ''
as $$
  select
    invitation.id as invitation_id,
    invitation.candidate_id,
    invitation.interviewer_version_id,
    nullif(interviewer_version.snapshot -> 'interviewer_config' ->> 'duration_seconds', '')::integer as duration_seconds,
    interviewer_version.snapshot -> 'interviewer_config' ->> 'language' as language,
    invitation.state as lifecycle,
    exists (
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
    ) as has_current_consent,
    jsonb_build_object(
      'versionId', interviewer_version.id::text,
      'sections', coalesce(
        (
          select jsonb_agg(
            jsonb_build_object(
              'id', section_entry.value -> 'section' ->> 'id',
              'title', section_entry.value -> 'section' ->> 'purpose',
              'questions', coalesce(
                (
                  select jsonb_agg(
                    jsonb_build_object(
                      'id', matched_question.question ->> 'id',
                      'prompt', matched_question.question ->> 'question_text',
                      'required', coalesce((matched_question.question ->> 'is_required')::boolean, true),
                      'followUpLimit', coalesce(
                        nullif(interviewer_version.snapshot -> 'interviewer_config' ->> 'max_follow_ups_per_question', '')::integer,
                        0
                      )
                    )
                    order by question_ref.ordinality
                  )
                  from jsonb_array_elements_text(section_entry.value -> 'question_ids')
                    with ordinality question_ref(question_id, ordinality)
                  join lateral (
                    select question_record.value as question
                    from jsonb_array_elements(interviewer_version.snapshot -> 'questions') question_record(value)
                    where question_record.value ->> 'id' = question_ref.question_id
                    limit 1
                  ) matched_question on true
                ),
                '[]'::jsonb
              )
            )
            order by section_entry.ordinality
          )
          from jsonb_array_elements(interviewer_version.snapshot -> 'interview_plan' -> 'sections')
            with ordinality section_entry(value, ordinality)
        ),
        '[]'::jsonb
      )
    ) as interview_plan
  from public.candidate_invitations invitation
  join public.interviewer_versions interviewer_version
    on interviewer_version.id = invitation.interviewer_version_id
   and interviewer_version.job_id = invitation.job_id
   and interviewer_version.organization_id = invitation.organization_id
  where invitation.token_hash = p_token_hash
    and invitation.expires_at > now()
    and invitation.revoked_at is null
    and invitation.state in ('sent', 'opened', 'started')
  limit 1;
$$;

revoke all on function public.resolve_realtime_candidate_session(text) from public;
grant execute on function public.resolve_realtime_candidate_session(text) to anon, authenticated;

create or replace function public.authorize_realtime_interview_session(
  p_token_hash text
)
returns table (
  attempt_id uuid,
  interviewer_version_id uuid,
  resume_section_index integer,
  resume_question_index integer,
  resume_follow_ups_used jsonb,
  processed_event_ids jsonb
)
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

  return query
  select
    attempt.id,
    attempt.interviewer_version_id,
    attempt.resume_section_index,
    attempt.resume_question_index,
    attempt.resume_follow_ups_used,
    attempt.processed_event_ids;
end;
$$;

revoke all on function public.authorize_realtime_interview_session(text) from public;
grant execute on function public.authorize_realtime_interview_session(text) to anon, authenticated;

create or replace function public.advance_realtime_interview_session(
  p_token_hash text,
  p_attempt_id uuid,
  p_event_id text,
  p_question_id uuid
)
returns table (
  attempt_state text,
  interviewer_version_id uuid,
  resume_section_index integer,
  resume_question_index integer,
  resume_follow_ups_used jsonb,
  processed_event_ids jsonb
)
language plpgsql
security definer
set search_path = ''
as $$
declare
  attempt public.interview_attempts;
  interviewer_version public.interviewer_versions;
  sections jsonb;
  current_questions jsonb;
  next_questions jsonb;
  current_question_id uuid;
  next_section_index integer;
begin
  if p_token_hash is null
     or btrim(p_token_hash) = ''
     or p_attempt_id is null
     or p_event_id is null
     or btrim(p_event_id) = ''
     or p_question_id is null then
    raise exception 'realtime progress unavailable';
  end if;

  select interview_attempt.*
    into attempt
  from public.interview_attempts interview_attempt
  join public.candidate_invitations candidate_invitation
    on candidate_invitation.id = interview_attempt.invitation_id
   and candidate_invitation.candidate_id = interview_attempt.candidate_id
   and candidate_invitation.job_id = interview_attempt.job_id
   and candidate_invitation.organization_id = interview_attempt.organization_id
   and candidate_invitation.interviewer_version_id = interview_attempt.interviewer_version_id
  where interview_attempt.id = p_attempt_id
    and candidate_invitation.token_hash = p_token_hash
    and candidate_invitation.expires_at > now()
    and candidate_invitation.revoked_at is null
    and candidate_invitation.state = 'started'
  for update of interview_attempt;

  if attempt.id is null then
    raise exception 'realtime progress unavailable';
  end if;

  if attempt.processed_event_ids ? p_event_id then
    return query
    select
      attempt.state,
      attempt.interviewer_version_id,
      attempt.resume_section_index,
      attempt.resume_question_index,
      attempt.resume_follow_ups_used,
      attempt.processed_event_ids;
    return;
  end if;

  if not (attempt.state = 'active') then
    raise exception 'realtime progress unavailable';
  end if;

  select version.*
    into interviewer_version
  from public.interviewer_versions version
  where version.id = attempt.interviewer_version_id
    and version.job_id = attempt.job_id
    and version.organization_id = attempt.organization_id;

  if interviewer_version.id is null then
    raise exception 'realtime progress unavailable';
  end if;

  sections := interviewer_version.snapshot -> 'interview_plan' -> 'sections';
  if sections is null
     or jsonb_typeof(sections) <> 'array'
     or attempt.resume_section_index >= jsonb_array_length(sections) then
    raise exception 'realtime progress unavailable';
  end if;

  current_questions := sections -> attempt.resume_section_index -> 'question_ids';
  if current_questions is null
     or jsonb_typeof(current_questions) <> 'array'
     or attempt.resume_question_index >= jsonb_array_length(current_questions) then
    raise exception 'realtime progress unavailable';
  end if;

  begin
    current_question_id := (current_questions ->> attempt.resume_question_index)::uuid;
  exception when invalid_text_representation then
    raise exception 'realtime progress unavailable';
  end;

  if current_question_id is null or current_question_id <> p_question_id then
    raise exception 'realtime progress unavailable';
  end if;

  if attempt.resume_question_index + 1 < jsonb_array_length(current_questions) then
    update public.interview_attempts
    set resume_question_index = attempt.resume_question_index + 1,
        processed_event_ids = attempt.processed_event_ids || jsonb_build_array(p_event_id),
        updated_at = now()
    where id = attempt.id
    returning * into attempt;
  else
    next_section_index := attempt.resume_section_index + 1;

    while next_section_index < jsonb_array_length(sections) loop
      next_questions := sections -> next_section_index -> 'question_ids';

      if next_questions is not null
         and jsonb_typeof(next_questions) = 'array'
         and jsonb_array_length(next_questions) > 0 then
        update public.interview_attempts
        set resume_section_index = next_section_index,
            resume_question_index = 0,
            processed_event_ids = attempt.processed_event_ids || jsonb_build_array(p_event_id),
            updated_at = now()
        where id = attempt.id
        returning * into attempt;
        exit;
      end if;

      next_section_index := next_section_index + 1;
    end loop;

    if next_section_index >= jsonb_array_length(sections) then
      update public.interview_attempts
      set state = 'completed',
          processed_event_ids = attempt.processed_event_ids || jsonb_build_array(p_event_id),
          updated_at = now()
      where id = attempt.id
      returning * into attempt;
    end if;
  end if;

  return query
  select
    attempt.state,
    attempt.interviewer_version_id,
    attempt.resume_section_index,
    attempt.resume_question_index,
    attempt.resume_follow_ups_used,
    attempt.processed_event_ids;
end;
$$;

revoke all on function public.advance_realtime_interview_session(text, uuid, text, uuid) from public;
grant execute on function public.advance_realtime_interview_session(text, uuid, text, uuid) to anon, authenticated;