create table public.interviewer_configs (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations(id) on delete cascade,
  job_id uuid not null,
  plan_id uuid not null,
  name text not null check (char_length(btrim(name)) between 1 and 200),
  interview_type text not null check (
    interview_type in ('screening', 'behavioral', 'technical', 'role_specific', 'leadership', 'case_study', 'system_design', 'values', 'custom')
  ),
  persona text not null check (
    persona in ('professional', 'friendly', 'direct', 'technical', 'conversational')
  ),
  language text not null check (char_length(btrim(language)) between 1 and 35),
  duration_seconds integer not null check (duration_seconds between 900 and 3600),
  difficulty text not null check (difficulty in ('easy', 'medium', 'hard')),
  question_mode text not null check (question_mode in ('fixed', 'semi_adaptive', 'adaptive')),
  guidelines text not null default '' check (char_length(guidelines) <= 8000),
  candidate_instructions text not null default '' check (char_length(candidate_instructions) <= 4000),
  max_follow_ups_per_question integer not null check (max_follow_ups_per_question between 0 and 2),
  follow_up_reasons text[] not null default '{}'::text[] check (
    follow_up_reasons <@ array[
      'clarify_ambiguity',
      'request_example',
      'explore_reasoning',
      'missing_required_dimension'
    ]::text[]
  ),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (id, job_id, organization_id),
  foreign key (job_id, organization_id)
    references public.jobs(id, organization_id)
    on delete cascade,
  foreign key (plan_id, job_id, organization_id)
    references public.interview_plans(id, job_id, organization_id)
    on delete restrict
);

create index interviewer_configs_organization_job_idx
  on public.interviewer_configs(organization_id, job_id);

alter table public.interviewer_configs enable row level security;

revoke all on table public.interviewer_configs from anon;
revoke all on table public.interviewer_configs from authenticated;
grant select on table public.interviewer_configs to authenticated;

create policy interviewer_configs_select_member
on public.interviewer_configs
for select
to authenticated
using (private.is_organization_member(organization_id));

create or replace function public.save_interviewer_config(
  p_organization_id uuid,
  p_job_id uuid,
  p_plan_id uuid,
  p_name text,
  p_interview_type text,
  p_persona text,
  p_language text,
  p_duration_seconds integer,
  p_difficulty text,
  p_question_mode text,
  p_guidelines text,
  p_candidate_instructions text,
  p_max_follow_ups_per_question integer,
  p_follow_up_reasons text[],
  p_config_id uuid default null
)
returns uuid
language plpgsql
security definer
set search_path = ''
as $$
declare
  actor_id uuid := auth.uid();
  v_config_id uuid;
  v_name text := btrim(p_name);
  v_interview_type text := lower(btrim(p_interview_type));
  v_persona text := lower(btrim(p_persona));
  v_language text := btrim(p_language);
  v_difficulty text := lower(btrim(p_difficulty));
  v_question_mode text := lower(btrim(p_question_mode));
  v_guidelines text := btrim(coalesce(p_guidelines, ''));
  v_candidate_instructions text := btrim(coalesce(p_candidate_instructions, ''));
  v_follow_up_reasons text[] := coalesce(p_follow_up_reasons, '{}'::text[]);
begin
  if actor_id is null then
    raise exception 'Authentication required.' using errcode = '42501';
  end if;

  if not private.has_organization_role(
    p_organization_id,
    array['owner', 'admin', 'recruiter', 'hiring_manager']::public.organization_role[]
  ) then
    raise exception 'Not authorized to manage interviewer configuration.' using errcode = '42501';
  end if;

  if not exists (
    select 1
    from public.jobs job_record
    where job_record.id = p_job_id
      and job_record.organization_id = p_organization_id
  ) then
    raise exception 'Job not found for this organization.' using errcode = 'P0002';
  end if;

  if not exists (
    select 1
    from public.interview_plans plan_record
    where plan_record.id = p_plan_id
      and plan_record.job_id = p_job_id
      and plan_record.organization_id = p_organization_id
  ) then
    raise exception 'Interview plan not found for this job.' using errcode = 'P0002';
  end if;

  if v_name is null or char_length(v_name) not between 1 and 200 then
    raise exception 'Interviewer name is required and must be 200 characters or fewer.' using errcode = '22023';
  end if;

  if v_interview_type is null or v_interview_type not in (
    'screening', 'behavioral', 'technical', 'role_specific', 'leadership', 'case_study', 'system_design', 'values', 'custom'
  ) then
    raise exception 'Choose a supported interview type.' using errcode = '22023';
  end if;

  if v_persona is null or v_persona not in (
    'professional', 'friendly', 'direct', 'technical', 'conversational'
  ) then
    raise exception 'Choose a supported interviewer persona.' using errcode = '22023';
  end if;

  if v_language is null or char_length(v_language) not between 1 and 35 then
    raise exception 'Interview language must be between 1 and 35 characters.' using errcode = '22023';
  end if;

  if p_duration_seconds is null or p_duration_seconds not between 900 and 3600 then
    raise exception 'Interview duration must be between 900 and 3600 seconds.' using errcode = '22023';
  end if;

  if v_difficulty is null or v_difficulty not in ('easy', 'medium', 'hard') then
    raise exception 'Choose an interview difficulty of easy, medium, or hard.' using errcode = '22023';
  end if;

  if v_question_mode is null or v_question_mode not in ('fixed', 'semi_adaptive', 'adaptive') then
    raise exception 'Choose a supported question strategy.' using errcode = '22023';
  end if;

  if char_length(v_guidelines) > 8000 then
    raise exception 'Interview guidelines must be 8000 characters or fewer.' using errcode = '22023';
  end if;

  if char_length(v_candidate_instructions) > 4000 then
    raise exception 'Candidate instructions must be 4000 characters or fewer.' using errcode = '22023';
  end if;

  if p_max_follow_ups_per_question is null
     or p_max_follow_ups_per_question not between 0 and 2 then
    raise exception 'Follow-up policy allows at most 2 follow-ups per question.' using errcode = '22023';
  end if;

  if not v_follow_up_reasons <@ array[
    'clarify_ambiguity',
    'request_example',
    'explore_reasoning',
    'missing_required_dimension'
  ]::text[] then
    raise exception 'Follow-up policy contains an unsupported reason.' using errcode = '22023';
  end if;

  if p_config_id is null then
    insert into public.interviewer_configs (
      organization_id,
      job_id,
      plan_id,
      name,
      interview_type,
      persona,
      language,
      duration_seconds,
      difficulty,
      question_mode,
      guidelines,
      candidate_instructions,
      max_follow_ups_per_question,
      follow_up_reasons
    )
    values (
      p_organization_id,
      p_job_id,
      p_plan_id,
      v_name,
      v_interview_type,
      v_persona,
      v_language,
      p_duration_seconds,
      v_difficulty,
      v_question_mode,
      v_guidelines,
      v_candidate_instructions,
      p_max_follow_ups_per_question,
      v_follow_up_reasons
    )
    returning id into v_config_id;
  else
    update public.interviewer_configs config
    set plan_id = p_plan_id,
        name = v_name,
        interview_type = v_interview_type,
        persona = v_persona,
        language = v_language,
        duration_seconds = p_duration_seconds,
        difficulty = v_difficulty,
        question_mode = v_question_mode,
        guidelines = v_guidelines,
        candidate_instructions = v_candidate_instructions,
        max_follow_ups_per_question = p_max_follow_ups_per_question,
        follow_up_reasons = v_follow_up_reasons,
        updated_at = now()
    where config.id = p_config_id
      and config.job_id = p_job_id
      and config.organization_id = p_organization_id
    returning config.id into v_config_id;

    if v_config_id is null then
      raise exception 'Interviewer configuration not found for this job.' using errcode = 'P0002';
    end if;
  end if;

  return v_config_id;
end;
$$;

revoke all on function public.save_interviewer_config(
  uuid,
  uuid,
  uuid,
  text,
  text,
  text,
  text,
  integer,
  text,
  text,
  text,
  text,
  integer,
  text[],
  uuid
) from public;
revoke all on function public.save_interviewer_config(
  uuid,
  uuid,
  uuid,
  text,
  text,
  text,
  text,
  integer,
  text,
  text,
  text,
  text,
  integer,
  text[],
  uuid
) from anon;
grant execute on function public.save_interviewer_config(
  uuid,
  uuid,
  uuid,
  text,
  text,
  text,
  text,
  integer,
  text,
  text,
  text,
  text,
  integer,
  text[],
  uuid
) to authenticated;
