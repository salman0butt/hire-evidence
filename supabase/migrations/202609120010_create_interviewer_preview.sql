create or replace function private.compose_interviewer_snapshot(
  p_organization_id uuid,
  p_job_id uuid,
  p_config_id uuid,
  p_plan_id uuid
)
returns jsonb
language sql
stable
set search_path = ''
as $$
  select jsonb_build_object(
    'job', (
      select to_jsonb(job_record)
      from public.jobs job_record
      where job_record.id = p_job_id
        and job_record.organization_id = p_organization_id
    ),
    'requirements', coalesce((
      select jsonb_agg(to_jsonb(requirement_record) order by requirement_record.position)
      from public.job_requirements requirement_record
      where requirement_record.job_id = p_job_id
        and requirement_record.organization_id = p_organization_id
    ), '[]'::jsonb),
    'competencies', coalesce((
      select jsonb_agg(to_jsonb(competency_record) order by competency_record.position)
      from public.competencies competency_record
      where competency_record.job_id = p_job_id
        and competency_record.organization_id = p_organization_id
    ), '[]'::jsonb),
    'rubrics', coalesce((
      select jsonb_agg(to_jsonb(rubric_record) order by rubric_record.competency_id, rubric_record.score_level)
      from public.competency_rubrics rubric_record
      where rubric_record.job_id = p_job_id
        and rubric_record.organization_id = p_organization_id
    ), '[]'::jsonb),
    'questions', coalesce((
      select jsonb_agg(to_jsonb(question_record) order by question_record.position)
      from public.questions question_record
      where question_record.job_id = p_job_id
        and question_record.organization_id = p_organization_id
    ), '[]'::jsonb),
    'interview_plan', jsonb_build_object(
      'plan', (
        select to_jsonb(plan_record)
        from public.interview_plans plan_record
        where plan_record.id = p_plan_id
          and plan_record.job_id = p_job_id
          and plan_record.organization_id = p_organization_id
      ),
      'sections', coalesce((
        select jsonb_agg(
          jsonb_build_object(
            'section', to_jsonb(section_record),
            'question_ids', coalesce((
              select jsonb_agg(question_link.question_id order by question_link.question_position)
              from public.interview_plan_section_questions question_link
              where question_link.section_id = section_record.id
                and question_link.plan_id = p_plan_id
                and question_link.job_id = p_job_id
                and question_link.organization_id = p_organization_id
            ), '[]'::jsonb),
            'competency_ids', coalesce((
              select jsonb_agg(competency_link.competency_id order by competency_link.competency_id)
              from public.interview_plan_section_competencies competency_link
              where competency_link.section_id = section_record.id
                and competency_link.plan_id = p_plan_id
                and competency_link.job_id = p_job_id
                and competency_link.organization_id = p_organization_id
            ), '[]'::jsonb)
          )
          order by section_record.position
        )
        from public.interview_plan_sections section_record
        where section_record.plan_id = p_plan_id
          and section_record.job_id = p_job_id
          and section_record.organization_id = p_organization_id
      ), '[]'::jsonb)
    ),
    'interviewer_config', (
      select to_jsonb(config_record)
      from public.interviewer_configs config_record
      where config_record.id = p_config_id
        and config_record.job_id = p_job_id
        and config_record.organization_id = p_organization_id
    )
  );
$$;

revoke all on function private.compose_interviewer_snapshot(uuid, uuid, uuid, uuid) from public;
revoke all on function private.compose_interviewer_snapshot(uuid, uuid, uuid, uuid) from anon;
revoke all on function private.compose_interviewer_snapshot(uuid, uuid, uuid, uuid) from authenticated;

create or replace function public.publish_interviewer_config_guardrail_legacy(
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
  v_version_number integer;
  v_version_id uuid;
  v_snapshot jsonb;
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
    select version.id
      into v_version_id
    from public.interviewer_versions version
    where version.interviewer_config_id = p_config_id
      and version.job_id = p_job_id
      and version.organization_id = p_organization_id
    order by version.version_number desc
    limit 1;

    if v_version_id is null then
      raise exception 'Published interviewer configuration is missing its immutable version.' using errcode = 'P0002';
    end if;

    return v_version_id;
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

  select coalesce(max(version.version_number), 0) + 1
    into v_version_number
  from public.interviewer_versions version
  where version.interviewer_config_id = p_config_id;

  v_snapshot := private.compose_interviewer_snapshot(
    p_organization_id,
    p_job_id,
    p_config_id,
    v_plan_id
  );

  insert into public.interviewer_versions (
    organization_id,
    job_id,
    interviewer_config_id,
    version_number,
    snapshot,
    platform_prompt_version,
    guardrail_version,
    created_by
  )
  values (
    p_organization_id,
    p_job_id,
    p_config_id,
    v_version_number,
    v_snapshot,
    'interviewer-runtime-v1',
    'hiring-guardrails-v1',
    actor_id
  )
  returning id into v_version_id;

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

  return v_version_id;
end;
$$;

revoke all on function public.publish_interviewer_config_guardrail_legacy(uuid, uuid, uuid) from public;
revoke all on function public.publish_interviewer_config_guardrail_legacy(uuid, uuid, uuid) from anon;
revoke all on function public.publish_interviewer_config_guardrail_legacy(uuid, uuid, uuid) from authenticated;

create or replace function public.preview_interviewer_config(
  p_organization_id uuid,
  p_job_id uuid,
  p_config_id uuid
)
returns jsonb
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
  v_job_text text;
  v_guidelines text;
  v_candidate_instructions text;
  v_snapshot jsonb;
begin
  if actor_id is null then
    raise exception 'Authentication required.' using errcode = '42501';
  end if;

  if not private.has_organization_role(
    p_organization_id,
    array['owner', 'admin', 'recruiter', 'hiring_manager']::public.organization_role[]
  ) then
    raise exception 'Not authorized to preview interviewer configuration.' using errcode = '42501';
  end if;

  select config.status,
         config.plan_id,
         config.duration_seconds,
         plan.total_duration_seconds,
         concat_ws(
           E'\n',
           job.title,
           job.description,
           job.responsibilities,
           job.interview_instructions
         ),
         config.guidelines,
         config.candidate_instructions
    into v_status,
         v_plan_id,
         v_config_duration,
         v_plan_duration,
         v_job_text,
         v_guidelines,
         v_candidate_instructions
  from public.interviewer_configs config
  join public.interview_plans plan
    on plan.id = config.plan_id
   and plan.job_id = config.job_id
   and plan.organization_id = config.organization_id
  join public.jobs job
    on job.id = config.job_id
   and job.organization_id = config.organization_id
  where config.id = p_config_id
    and config.job_id = p_job_id
    and config.organization_id = p_organization_id;

  if v_status is null then
    raise exception 'Interviewer configuration not found for this job.' using errcode = 'P0002';
  end if;

  perform private.assert_interviewer_guardrails(
    v_job_text,
    v_guidelines,
    v_candidate_instructions
  );

  if v_config_duration <> v_plan_duration then
    raise exception 'Interviewer configuration cannot be previewed because its duration does not match the interview plan.' using errcode = '22023';
  end if;

  if not exists (
    select 1
    from public.interview_plan_sections section_record
    where section_record.plan_id = v_plan_id
      and section_record.job_id = p_job_id
      and section_record.organization_id = p_organization_id
  ) then
    raise exception 'Interviewer configuration cannot be previewed without an interview-plan section.' using errcode = '22023';
  end if;

  if not exists (
    select 1
    from public.interview_plan_section_questions planned_question
    where planned_question.plan_id = v_plan_id
      and planned_question.job_id = p_job_id
      and planned_question.organization_id = p_organization_id
  ) then
    raise exception 'Interviewer configuration cannot be previewed without planned questions.' using errcode = '22023';
  end if;

  if not exists (
    select 1
    from public.interview_plan_section_competencies planned_competency
    where planned_competency.plan_id = v_plan_id
      and planned_competency.job_id = p_job_id
      and planned_competency.organization_id = p_organization_id
  ) then
    raise exception 'Interviewer configuration cannot be previewed without planned competencies.' using errcode = '22023';
  end if;

  v_snapshot := private.compose_interviewer_snapshot(
    p_organization_id,
    p_job_id,
    p_config_id,
    v_plan_id
  );

  return jsonb_build_object(
    'mode', 'preview',
    'billable', false,
    'persisted', false,
    'platform_prompt_version', 'interviewer-runtime-v1',
    'guardrail_version', 'hiring-guardrails-v1',
    'snapshot', v_snapshot
  );
end;
$$;

revoke all on function public.preview_interviewer_config(uuid, uuid, uuid) from public;
revoke all on function public.preview_interviewer_config(uuid, uuid, uuid) from anon;
grant execute on function public.preview_interviewer_config(uuid, uuid, uuid) to authenticated;
