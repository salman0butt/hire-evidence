create table public.interview_plans (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations(id) on delete cascade,
  job_id uuid not null,
  total_duration_seconds integer not null check (total_duration_seconds > 0),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (id, job_id, organization_id),
  foreign key (job_id, organization_id)
    references public.jobs(id, organization_id)
    on delete cascade
);

create index interview_plans_organization_job_idx
  on public.interview_plans(organization_id, job_id);

create table public.interview_plan_sections (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations(id) on delete cascade,
  job_id uuid not null,
  plan_id uuid not null,
  purpose text not null check (char_length(btrim(purpose)) between 1 and 1000),
  duration_seconds integer not null check (duration_seconds > 0),
  position integer not null check (position >= 0),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (plan_id, position),
  unique (id, plan_id, job_id, organization_id),
  foreign key (plan_id, job_id, organization_id)
    references public.interview_plans(id, job_id, organization_id)
    on delete cascade
);

create index interview_plan_sections_plan_position_idx
  on public.interview_plan_sections(plan_id, position);

create table public.interview_plan_section_questions (
  organization_id uuid not null references public.organizations(id) on delete cascade,
  job_id uuid not null,
  plan_id uuid not null,
  section_id uuid not null,
  question_id uuid not null,
  question_position integer not null check (question_position >= 0),
  primary key (section_id, question_id),
  unique (section_id, question_position),
  foreign key (section_id, plan_id, job_id, organization_id)
    references public.interview_plan_sections(id, plan_id, job_id, organization_id)
    on delete cascade,
  foreign key (question_id, job_id, organization_id)
    references public.questions(id, job_id, organization_id)
    on delete cascade
);

create index interview_plan_section_questions_plan_idx
  on public.interview_plan_section_questions(plan_id, section_id, question_position);

create table public.interview_plan_section_competencies (
  organization_id uuid not null references public.organizations(id) on delete cascade,
  job_id uuid not null,
  plan_id uuid not null,
  section_id uuid not null,
  competency_id uuid not null,
  primary key (section_id, competency_id),
  foreign key (section_id, plan_id, job_id, organization_id)
    references public.interview_plan_sections(id, plan_id, job_id, organization_id)
    on delete cascade,
  foreign key (competency_id, job_id, organization_id)
    references public.competencies(id, job_id, organization_id)
    on delete cascade
);

create index interview_plan_section_competencies_plan_idx
  on public.interview_plan_section_competencies(plan_id, section_id);

alter table public.interview_plans enable row level security;
alter table public.interview_plan_sections enable row level security;
alter table public.interview_plan_section_questions enable row level security;
alter table public.interview_plan_section_competencies enable row level security;

grant select on table public.interview_plans to authenticated;
grant select on table public.interview_plan_sections to authenticated;
grant select on table public.interview_plan_section_questions to authenticated;
grant select on table public.interview_plan_section_competencies to authenticated;

create policy interview_plans_select_member
on public.interview_plans
for select
to authenticated
using (private.is_organization_member(organization_id));

create policy interview_plan_sections_select_member
on public.interview_plan_sections
for select
to authenticated
using (private.is_organization_member(organization_id));

create policy interview_plan_section_questions_select_member
on public.interview_plan_section_questions
for select
to authenticated
using (private.is_organization_member(organization_id));

create policy interview_plan_section_competencies_select_member
on public.interview_plan_section_competencies
for select
to authenticated
using (private.is_organization_member(organization_id));

create or replace function public.save_interview_plan(
  p_organization_id uuid,
  p_job_id uuid,
  p_total_duration_seconds integer,
  p_sections jsonb
)
returns uuid
language plpgsql
security definer
set search_path = ''
as $$
declare
  actor_id uuid := auth.uid();
  plan_id uuid;
  section_id uuid;
  section_value jsonb;
  section_ordinality bigint;
  section_purpose text;
  section_duration integer;
  duration_total integer := 0;
  question_value text;
  question_ordinality bigint;
  competency_value text;
begin
  if actor_id is null then
    raise exception 'Authentication required.' using errcode = '42501';
  end if;

  if not private.has_organization_role(
    p_organization_id,
    array['owner', 'admin', 'recruiter', 'hiring_manager']::public.organization_role[]
  ) then
    raise exception 'Not authorized to manage interview plans.' using errcode = '42501';
  end if;

  if not exists (
    select 1
    from public.jobs
    where id = p_job_id
      and organization_id = p_organization_id
  ) then
    raise exception 'Job not found for this organization.' using errcode = 'P0002';
  end if;

  if p_total_duration_seconds is null or p_total_duration_seconds < 1 then
    raise exception 'Interview duration must be a positive integer.' using errcode = '22023';
  end if;

  if p_sections is null
     or jsonb_typeof(p_sections) <> 'array'
     or jsonb_array_length(p_sections) = 0 then
    raise exception 'Interview plan must contain at least one section.' using errcode = '22023';
  end if;

  insert into public.interview_plans (
    organization_id,
    job_id,
    total_duration_seconds
  )
  values (
    p_organization_id,
    p_job_id,
    p_total_duration_seconds
  )
  returning id into plan_id;

  for section_value, section_ordinality in
    select value, ordinality
    from jsonb_array_elements(p_sections) with ordinality
  loop
    section_purpose := btrim(section_value ->> 'purpose');

    if section_purpose is null
       or char_length(section_purpose) < 1
       or char_length(section_purpose) > 1000 then
      raise exception 'Section purpose must be between 1 and 1000 characters.' using errcode = '22023';
    end if;

    begin
      section_duration := (section_value ->> 'durationSeconds')::integer;
    exception when others then
      raise exception 'Section duration must be a positive integer.' using errcode = '22023';
    end;

    if section_duration is null or section_duration < 1 then
      raise exception 'Section duration must be a positive integer.' using errcode = '22023';
    end if;

    if section_value ? 'position'
       and (section_value ->> 'position')::integer <> section_ordinality - 1 then
      raise exception 'Interview plan section positions must be contiguous from zero.' using errcode = '22023';
    end if;

    if jsonb_typeof(coalesce(section_value -> 'questionIds', '[]'::jsonb)) <> 'array'
       or jsonb_typeof(coalesce(section_value -> 'competencyIds', '[]'::jsonb)) <> 'array' then
      raise exception 'Interview plan section links must be arrays.' using errcode = '22023';
    end if;

    duration_total := duration_total + section_duration;

    insert into public.interview_plan_sections (
      organization_id,
      job_id,
      plan_id,
      purpose,
      duration_seconds,
      position
    )
    values (
      p_organization_id,
      p_job_id,
      plan_id,
      section_purpose,
      section_duration,
      section_ordinality - 1
    )
    returning id into section_id;

    for question_value, question_ordinality in
      select value, ordinality
      from jsonb_array_elements_text(
        coalesce(section_value -> 'questionIds', '[]'::jsonb)
      ) with ordinality
    loop
      insert into public.interview_plan_section_questions (
        organization_id,
        job_id,
        plan_id,
        section_id,
        question_id,
        question_position
      )
      values (
        p_organization_id,
        p_job_id,
        plan_id,
        section_id,
        question_value::uuid,
        question_ordinality - 1
      );
    end loop;

    for competency_value in
      select value
      from jsonb_array_elements_text(
        coalesce(section_value -> 'competencyIds', '[]'::jsonb)
      )
    loop
      insert into public.interview_plan_section_competencies (
        organization_id,
        job_id,
        plan_id,
        section_id,
        competency_id
      )
      values (
        p_organization_id,
        p_job_id,
        plan_id,
        section_id,
        competency_value::uuid
      );
    end loop;
  end loop;

  if duration_total <> p_total_duration_seconds then
    raise exception 'Interview plan duration must equal the sum of section durations.' using errcode = '22023';
  end if;

  if exists (
    select 1
    from public.questions q
    where q.organization_id = p_organization_id
      and q.job_id = p_job_id
      and q.is_required
      and not exists (
        select 1
        from public.interview_plan_section_questions planned_question
        where planned_question.plan_id = plan_id
          and planned_question.question_id = q.id
      )
  ) then
    raise exception 'Interview plan must cover every required question.' using errcode = '22023';
  end if;

  if exists (
    select 1
    from public.competencies competency
    where competency.organization_id = p_organization_id
      and competency.job_id = p_job_id
      and not exists (
        select 1
        from public.interview_plan_section_competencies planned_competency
        where planned_competency.plan_id = plan_id
          and planned_competency.competency_id = competency.id
      )
  ) then
    raise exception 'Interview plan must cover every required competency.' using errcode = '22023';
  end if;

  return plan_id;
end;
$$;

revoke all on function public.save_interview_plan(uuid, uuid, integer, jsonb) from public;
revoke all on function public.save_interview_plan(uuid, uuid, integer, jsonb) from anon;
grant execute on function public.save_interview_plan(uuid, uuid, integer, jsonb) to authenticated;
