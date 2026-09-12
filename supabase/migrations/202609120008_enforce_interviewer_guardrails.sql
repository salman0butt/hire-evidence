create or replace function private.assert_interviewer_guardrails(
  p_job_text text,
  p_guidelines text,
  p_candidate_instructions text
)
returns void
language plpgsql
set search_path = ''
as $$
declare
  v_text text := lower(concat_ws(
    E'\n',
    coalesce(p_job_text, ''),
    coalesce(p_guidelines, ''),
    coalesce(p_candidate_instructions, '')
  ));
begin
  if v_text ~ '(race|racial|religion|religious|gender|sex|sexual orientation|ethnicity|ethnic|nationality|national origin|age)' then
    raise exception 'Interviewer configuration conflicts with protected-class hiring rules.' using errcode = '22023';
  end if;

  if v_text ~ '(disability|disabled|medical condition|medical history|health condition|mental health|diagnosis)' then
    raise exception 'Interviewer configuration conflicts with disability or medical hiring rules.' using errcode = '22023';
  end if;

  if v_text ~ '(pregnant|pregnancy|marital status|married|children|childcare|family status|family plans)' then
    raise exception 'Interviewer configuration conflicts with pregnancy or family-status hiring rules.' using errcode = '22023';
  end if;

  if v_text ~ '(facial expression|face analysis|facial analysis|emotion detection|emotion recognition|biometric|appearance|looks attractive)' then
    raise exception 'Interviewer configuration conflicts with biometric or emotion-inference hiring rules.' using errcode = '22023';
  end if;

  if v_text ~ '(lie detection|lie detector|detect lies|deception detection|detect deception|judge honesty from)' then
    raise exception 'Interviewer configuration conflicts with deception-detection hiring rules.' using errcode = '22023';
  end if;

  if v_text ~ '(accent|native sounding|native-sounding|sounds native|sound native)' then
    raise exception 'Interviewer configuration conflicts with accent-bias hiring rules.' using errcode = '22023';
  end if;

  if v_text ~ '(introvert|introverts|extrovert|extroverts|personality|personality type|personality test|personality fit)' then
    raise exception 'Interviewer configuration conflicts with personality-proxy hiring rules.' using errcode = '22023';
  end if;

  if (
    v_text ~ '(automatically|autonomously|without human review).{0,40}(reject|hire|decline|disqualify)'
    or v_text ~ '(reject|hire|decline|disqualify).{0,40}(automatically|autonomously|without human review)'
  ) then
    raise exception 'Interviewer configuration cannot make autonomous hiring decisions without human review.' using errcode = '22023';
  end if;

  if (
    v_text ~ 'ignore.{0,40}(platform|safety|fairness).{0,20}(rule|rules|policy|policies|restriction|restrictions)'
    or v_text ~ '(override|bypass|disable).{0,30}(platform|safety|fairness).{0,20}(rule|rules|policy|policies|guardrail|guardrails)'
  ) then
    raise exception 'Interviewer configuration cannot override, bypass, or disable platform safety rules.' using errcode = '22023';
  end if;
end;
$$;

revoke all on function private.assert_interviewer_guardrails(text, text, text) from public;
revoke all on function private.assert_interviewer_guardrails(text, text, text) from anon;
revoke all on function private.assert_interviewer_guardrails(text, text, text) from authenticated;

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
) rename to save_interviewer_config_guardrail_legacy;

revoke all on function public.save_interviewer_config_guardrail_legacy(
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
revoke all on function public.save_interviewer_config_guardrail_legacy(
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
revoke all on function public.save_interviewer_config_guardrail_legacy(
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
  v_job_text text;
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

  select concat_ws(
           E'\n',
           job.title,
           job.description,
           job.responsibilities,
           job.interview_instructions
         )
    into v_job_text
  from public.jobs job
  where job.id = p_job_id
    and job.organization_id = p_organization_id;

  perform private.assert_interviewer_guardrails(
    v_job_text,
    p_guidelines,
    p_candidate_instructions
  );

  return public.save_interviewer_config_guardrail_legacy(
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

alter function public.publish_interviewer_config(uuid, uuid, uuid)
  rename to publish_interviewer_config_guardrail_legacy;

revoke all on function public.publish_interviewer_config_guardrail_legacy(uuid, uuid, uuid) from public;
revoke all on function public.publish_interviewer_config_guardrail_legacy(uuid, uuid, uuid) from anon;
revoke all on function public.publish_interviewer_config_guardrail_legacy(uuid, uuid, uuid) from authenticated;

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
  v_job_text text;
  v_guidelines text;
  v_candidate_instructions text;
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
         v_job_text,
         v_guidelines,
         v_candidate_instructions
  from public.interviewer_configs config
  join public.jobs job
    on job.id = config.job_id
   and job.organization_id = config.organization_id
  where config.id = p_config_id
    and config.job_id = p_job_id
    and config.organization_id = p_organization_id;

  if v_status = 'draft' then
    perform private.assert_interviewer_guardrails(
      v_job_text,
      v_guidelines,
      v_candidate_instructions
    );
  end if;

  return public.publish_interviewer_config_guardrail_legacy(
    p_organization_id,
    p_job_id,
    p_config_id
  );
end;
$$;

revoke all on function public.publish_interviewer_config(uuid, uuid, uuid) from public;
revoke all on function public.publish_interviewer_config(uuid, uuid, uuid) from anon;
grant execute on function public.publish_interviewer_config(uuid, uuid, uuid) to authenticated;
