alter table public.interviewer_configs
  add column status text not null default 'draft'
    check (status in ('draft', 'published')),
  add column published_at timestamptz;

alter table public.interviewer_configs
  add constraint interviewer_configs_publication_state_check
  check (
    (status = 'draft' and published_at is null)
    or (status = 'published' and published_at is not null)
  );

alter function public.save_interviewer_config(
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
) rename to save_interviewer_config_draft_legacy;

revoke all on function public.save_interviewer_config_draft_legacy(
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
revoke all on function public.save_interviewer_config_draft_legacy(
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
revoke all on function public.save_interviewer_config_draft_legacy(
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
) from authenticated;

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
  v_editable_config_id uuid;
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

  if p_config_id is not null then
    select config.id
      into v_editable_config_id
    from public.interviewer_configs config
    where config.id = p_config_id
      and config.job_id = p_job_id
      and config.organization_id = p_organization_id
      and config.status = 'draft';

    if v_editable_config_id is null and exists (
      select 1
      from public.interviewer_configs config
      where config.id = p_config_id
        and config.job_id = p_job_id
        and config.organization_id = p_organization_id
        and config.status = 'published'
    ) then
      raise exception 'Published interviewer configuration cannot be edited.' using errcode = '22023';
    end if;
  end if;

  return public.save_interviewer_config_draft_legacy(
    p_organization_id,
    p_job_id,
    p_plan_id,
    p_name,
    p_interview_type,
    p_persona,
    p_language,
    p_duration_seconds,
    p_difficulty,
    p_question_mode,
    p_guidelines,
    p_candidate_instructions,
    p_max_follow_ups_per_question,
    p_follow_up_reasons,
    p_config_id
  );
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

create or replace function public.publish_interviewer_config(
  p_organization_id uuid,
  p_job_id uuid,
  p_config_id uuid
)
returns uuid
language plpgsql
security definer
set search_path = ''
as $$
declare
  actor_id uuid := auth.uid();
  v_status text;
  v_plan_id uuid;
  v_config_duration integer;
  v_plan_duration integer;
begin
  if actor_id is null then
    raise exception 'Authentication required.' using errcode = '42501';
  end if;

  if not private.has_organization_role(
    p_organization_id,
    array['owner', 'admin', 'recruiter', 'hiring_manager']::public.organization_role[]
  ) then
    raise exception 'Not authorized to publish interviewer configuration.' using errcode = '42501';
  end if;

  select config.status,
         config.plan_id,
         config.duration_seconds,
         plan.total_duration_seconds
    into v_status,
         v_plan_id,
         v_config_duration,
         v_plan_duration
  from public.interviewer_configs config
  join public.interview_plans plan
    on plan.id = config.plan_id
   and plan.job_id = config.job_id
   and plan.organization_id = config.organization_id
  where config.id = p_config_id
    and config.job_id = p_job_id
    and config.organization_id = p_organization_id
  for update of config;

  if v_status is null then
    raise exception 'Interviewer configuration not found for this job.' using errcode = 'P0002';
  end if;

  if v_status = 'published' then
    return p_config_id;
  end if;

  if v_config_duration <> v_plan_duration then
    raise exception 'Interviewer configuration cannot be published because its duration does not match the interview plan.' using errcode = '22023';
  end if;

  if not exists (
    select 1
    from public.interview_plan_sections section_record
    where section_record.plan_id = v_plan_id
      and section_record.job_id = p_job_id
      and section_record.organization_id = p_organization_id
  ) then
    raise exception 'Interviewer configuration cannot be published without an interview-plan section.' using errcode = '22023';
  end if;

  if not exists (
    select 1
    from public.interview_plan_section_questions planned_question
    where planned_question.plan_id = v_plan_id
      and planned_question.job_id = p_job_id
      and planned_question.organization_id = p_organization_id
  ) then
    raise exception 'Interviewer configuration cannot be published without planned questions.' using errcode = '22023';
  end if;

  if not exists (
    select 1
    from public.interview_plan_section_competencies planned_competency
    where planned_competency.plan_id = v_plan_id
      and planned_competency.job_id = p_job_id
      and planned_competency.organization_id = p_organization_id
  ) then
    raise exception 'Interviewer configuration cannot be published without planned competencies.' using errcode = '22023';
  end if;

  update public.interviewer_configs config
  set status = 'published',
      published_at = now(),
      updated_at = now()
  where config.id = p_config_id
    and config.job_id = p_job_id
    and config.organization_id = p_organization_id
    and config.status = 'draft';

  if not found then
    raise exception 'Interviewer configuration cannot be published from its current state.' using errcode = '22023';
  end if;

  return p_config_id;
end;
$$;

revoke all on function public.publish_interviewer_config(uuid, uuid, uuid) from public;
revoke all on function public.publish_interviewer_config(uuid, uuid, uuid) from anon;
grant execute on function public.publish_interviewer_config(uuid, uuid, uuid) to authenticated;
