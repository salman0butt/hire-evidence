create type public.job_requirement_kind as enum (
  'must_have',
  'nice_to_have'
);

create table public.jobs (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations(id) on delete cascade,
  title text not null check (char_length(btrim(title)) between 1 and 160),
  department text null check (department is null or char_length(department) <= 120),
  description text null check (description is null or char_length(description) <= 10000),
  responsibilities text null check (responsibilities is null or char_length(responsibilities) <= 10000),
  seniority text null check (seniority is null or char_length(seniority) <= 80),
  employment_type text null check (employment_type is null or char_length(employment_type) <= 80),
  location text null check (location is null or char_length(location) <= 160),
  salary_range text null check (salary_range is null or char_length(salary_range) <= 160),
  interview_instructions text null check (interview_instructions is null or char_length(interview_instructions) <= 5000),
  created_by uuid not null references auth.users(id) on delete restrict,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (id, organization_id)
);

create index jobs_organization_id_idx on public.jobs(organization_id);

create table public.job_requirements (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations(id) on delete cascade,
  job_id uuid not null,
  kind public.job_requirement_kind not null,
  requirement text not null check (char_length(btrim(requirement)) between 1 and 500),
  position integer not null default 0 check (position >= 0),
  created_at timestamptz not null default now(),
  unique (job_id, kind, position),
  foreign key (job_id, organization_id)
    references public.jobs(id, organization_id)
    on delete cascade
);

create index job_requirements_organization_id_job_id_idx
  on public.job_requirements(organization_id, job_id);

alter table public.jobs enable row level security;
alter table public.job_requirements enable row level security;

grant select on table public.jobs to authenticated;
grant select on table public.job_requirements to authenticated;

create policy jobs_select_member
on public.jobs
for select
to authenticated
using (private.is_organization_member(organization_id));

create policy job_requirements_select_member
on public.job_requirements
for select
to authenticated
using (private.is_organization_member(organization_id));

create or replace function public.create_job(
  p_organization_id uuid,
  p_title text,
  p_department text default null,
  p_description text default null,
  p_responsibilities text default null,
  p_seniority text default null,
  p_employment_type text default null,
  p_location text default null,
  p_salary_range text default null,
  p_interview_instructions text default null,
  p_requirements jsonb default '[]'::jsonb
)
returns uuid
language plpgsql
security definer
set search_path = ''
as $$
declare
  actor_id uuid := auth.uid();
  normalized_title text := btrim(p_title);
  normalized_department text := nullif(btrim(p_department), '');
  normalized_description text := nullif(btrim(p_description), '');
  normalized_responsibilities text := nullif(btrim(p_responsibilities), '');
  normalized_seniority text := nullif(btrim(p_seniority), '');
  normalized_employment_type text := nullif(btrim(p_employment_type), '');
  normalized_location text := nullif(btrim(p_location), '');
  normalized_salary_range text := nullif(btrim(p_salary_range), '');
  normalized_interview_instructions text := nullif(btrim(p_interview_instructions), '');
  job_id uuid;
  requirement_item jsonb;
  requirement_position bigint;
  requirement_kind text;
  requirement_text text;
begin
  if actor_id is null then
    raise exception 'Authentication required.' using errcode = '42501';
  end if;

  if not private.has_organization_role(
    p_organization_id,
    array['owner', 'admin', 'recruiter']::public.organization_role[]
  ) then
    raise exception 'Not authorized to manage jobs.' using errcode = '42501';
  end if;

  if normalized_title is null
     or char_length(normalized_title) < 1
     or char_length(normalized_title) > 160 then
    raise exception 'Job title must be between 1 and 160 characters.' using errcode = '22023';
  end if;

  if normalized_department is not null and char_length(normalized_department) > 120 then
    raise exception 'Department must be 120 characters or fewer.' using errcode = '22023';
  end if;
  if normalized_description is not null and char_length(normalized_description) > 10000 then
    raise exception 'Description must be 10000 characters or fewer.' using errcode = '22023';
  end if;
  if normalized_responsibilities is not null and char_length(normalized_responsibilities) > 10000 then
    raise exception 'Responsibilities must be 10000 characters or fewer.' using errcode = '22023';
  end if;
  if normalized_seniority is not null and char_length(normalized_seniority) > 80 then
    raise exception 'Seniority must be 80 characters or fewer.' using errcode = '22023';
  end if;
  if normalized_employment_type is not null and char_length(normalized_employment_type) > 80 then
    raise exception 'Employment type must be 80 characters or fewer.' using errcode = '22023';
  end if;
  if normalized_location is not null and char_length(normalized_location) > 160 then
    raise exception 'Location must be 160 characters or fewer.' using errcode = '22023';
  end if;
  if normalized_salary_range is not null and char_length(normalized_salary_range) > 160 then
    raise exception 'Salary range must be 160 characters or fewer.' using errcode = '22023';
  end if;
  if normalized_interview_instructions is not null
     and char_length(normalized_interview_instructions) > 5000 then
    raise exception 'Interview instructions must be 5000 characters or fewer.' using errcode = '22023';
  end if;

  if p_requirements is null or jsonb_typeof(p_requirements) <> 'array' then
    raise exception 'Job requirements must be an array.' using errcode = '22023';
  end if;

  insert into public.jobs (
    organization_id,
    title,
    department,
    description,
    responsibilities,
    seniority,
    employment_type,
    location,
    salary_range,
    interview_instructions,
    created_by
  )
  values (
    p_organization_id,
    normalized_title,
    normalized_department,
    normalized_description,
    normalized_responsibilities,
    normalized_seniority,
    normalized_employment_type,
    normalized_location,
    normalized_salary_range,
    normalized_interview_instructions,
    actor_id
  )
  returning id into job_id;

  for requirement_item, requirement_position in
    select item.value, item.ordinality - 1
    from jsonb_array_elements(p_requirements) with ordinality as item(value, ordinality)
  loop
    if jsonb_typeof(requirement_item) <> 'object' then
      raise exception 'Each job requirement must be an object.' using errcode = '22023';
    end if;

    requirement_kind := requirement_item ->> 'kind';
    requirement_text := btrim(requirement_item ->> 'requirement');

    if requirement_kind not in ('must_have', 'nice_to_have') then
      raise exception 'Invalid job requirement kind.' using errcode = '22023';
    end if;

    if requirement_text is null
       or char_length(requirement_text) < 1
       or char_length(requirement_text) > 500 then
      raise exception 'Job requirement must be between 1 and 500 characters.' using errcode = '22023';
    end if;

    insert into public.job_requirements (
      organization_id,
      job_id,
      kind,
      requirement,
      position
    )
    values (
      p_organization_id,
      job_id,
      requirement_kind::public.job_requirement_kind,
      requirement_text,
      requirement_position::integer
    );
  end loop;

  return job_id;
end;
$$;

revoke all on function public.create_job(
  uuid,
  text,
  text,
  text,
  text,
  text,
  text,
  text,
  text,
  text,
  jsonb
) from public;
revoke all on function public.create_job(
  uuid,
  text,
  text,
  text,
  text,
  text,
  text,
  text,
  text,
  text,
  jsonb
) from anon;
grant execute on function public.create_job(
  uuid,
  text,
  text,
  text,
  text,
  text,
  text,
  text,
  text,
  text,
  jsonb
) to authenticated;

create or replace function public.update_job(
  p_organization_id uuid,
  p_job_id uuid,
  p_title text,
  p_department text default null,
  p_description text default null,
  p_responsibilities text default null,
  p_seniority text default null,
  p_employment_type text default null,
  p_location text default null,
  p_salary_range text default null,
  p_interview_instructions text default null,
  p_requirements jsonb default '[]'::jsonb
)
returns void
language plpgsql
security definer
set search_path = ''
as $$
declare
  actor_id uuid := auth.uid();
  normalized_title text := btrim(p_title);
  normalized_department text := nullif(btrim(p_department), '');
  normalized_description text := nullif(btrim(p_description), '');
  normalized_responsibilities text := nullif(btrim(p_responsibilities), '');
  normalized_seniority text := nullif(btrim(p_seniority), '');
  normalized_employment_type text := nullif(btrim(p_employment_type), '');
  normalized_location text := nullif(btrim(p_location), '');
  normalized_salary_range text := nullif(btrim(p_salary_range), '');
  normalized_interview_instructions text := nullif(btrim(p_interview_instructions), '');
  requirement_item jsonb;
  requirement_position bigint;
  requirement_kind text;
  requirement_text text;
  affected_rows integer;
begin
  if actor_id is null then
    raise exception 'Authentication required.' using errcode = '42501';
  end if;

  if not private.has_organization_role(
    p_organization_id,
    array['owner', 'admin', 'recruiter']::public.organization_role[]
  ) then
    raise exception 'Not authorized to manage jobs.' using errcode = '42501';
  end if;

  if normalized_title is null
     or char_length(normalized_title) < 1
     or char_length(normalized_title) > 160 then
    raise exception 'Job title must be between 1 and 160 characters.' using errcode = '22023';
  end if;

  if normalized_department is not null and char_length(normalized_department) > 120 then
    raise exception 'Department must be 120 characters or fewer.' using errcode = '22023';
  end if;
  if normalized_description is not null and char_length(normalized_description) > 10000 then
    raise exception 'Description must be 10000 characters or fewer.' using errcode = '22023';
  end if;
  if normalized_responsibilities is not null and char_length(normalized_responsibilities) > 10000 then
    raise exception 'Responsibilities must be 10000 characters or fewer.' using errcode = '22023';
  end if;
  if normalized_seniority is not null and char_length(normalized_seniority) > 80 then
    raise exception 'Seniority must be 80 characters or fewer.' using errcode = '22023';
  end if;
  if normalized_employment_type is not null and char_length(normalized_employment_type) > 80 then
    raise exception 'Employment type must be 80 characters or fewer.' using errcode = '22023';
  end if;
  if normalized_location is not null and char_length(normalized_location) > 160 then
    raise exception 'Location must be 160 characters or fewer.' using errcode = '22023';
  end if;
  if normalized_salary_range is not null and char_length(normalized_salary_range) > 160 then
    raise exception 'Salary range must be 160 characters or fewer.' using errcode = '22023';
  end if;
  if normalized_interview_instructions is not null
     and char_length(normalized_interview_instructions) > 5000 then
    raise exception 'Interview instructions must be 5000 characters or fewer.' using errcode = '22023';
  end if;

  if p_requirements is null or jsonb_typeof(p_requirements) <> 'array' then
    raise exception 'Job requirements must be an array.' using errcode = '22023';
  end if;

  update public.jobs
  set title = normalized_title,
      department = normalized_department,
      description = normalized_description,
      responsibilities = normalized_responsibilities,
      seniority = normalized_seniority,
      employment_type = normalized_employment_type,
      location = normalized_location,
      salary_range = normalized_salary_range,
      interview_instructions = normalized_interview_instructions,
      updated_at = now()
  where id = p_job_id
    and organization_id = p_organization_id;

  get diagnostics affected_rows = row_count;
  if affected_rows <> 1 then
    raise exception 'Job not found.' using errcode = 'P0002';
  end if;

  delete from public.job_requirements
  where organization_id = p_organization_id
    and job_id = p_job_id;

  for requirement_item, requirement_position in
    select item.value, item.ordinality - 1
    from jsonb_array_elements(p_requirements) with ordinality as item(value, ordinality)
  loop
    if jsonb_typeof(requirement_item) <> 'object' then
      raise exception 'Each job requirement must be an object.' using errcode = '22023';
    end if;

    requirement_kind := requirement_item ->> 'kind';
    requirement_text := btrim(requirement_item ->> 'requirement');

    if requirement_kind not in ('must_have', 'nice_to_have') then
      raise exception 'Invalid job requirement kind.' using errcode = '22023';
    end if;

    if requirement_text is null
       or char_length(requirement_text) < 1
       or char_length(requirement_text) > 500 then
      raise exception 'Job requirement must be between 1 and 500 characters.' using errcode = '22023';
    end if;

    insert into public.job_requirements (
      organization_id,
      job_id,
      kind,
      requirement,
      position
    )
    values (
      p_organization_id,
      p_job_id,
      requirement_kind::public.job_requirement_kind,
      requirement_text,
      requirement_position::integer
    );
  end loop;
end;
$$;

revoke all on function public.update_job(
  uuid,
  uuid,
  text,
  text,
  text,
  text,
  text,
  text,
  text,
  text,
  text,
  jsonb
) from public;
revoke all on function public.update_job(
  uuid,
  uuid,
  text,
  text,
  text,
  text,
  text,
  text,
  text,
  text,
  text,
  jsonb
) from anon;
grant execute on function public.update_job(
  uuid,
  uuid,
  text,
  text,
  text,
  text,
  text,
  text,
  text,
  text,
  text,
  jsonb
) to authenticated;

create or replace function public.delete_job(
  p_organization_id uuid,
  p_job_id uuid
)
returns void
language plpgsql
security definer
set search_path = ''
as $$
declare
  actor_id uuid := auth.uid();
  affected_rows integer;
begin
  if actor_id is null then
    raise exception 'Authentication required.' using errcode = '42501';
  end if;

  if not private.has_organization_role(
    p_organization_id,
    array['owner', 'admin', 'recruiter']::public.organization_role[]
  ) then
    raise exception 'Not authorized to manage jobs.' using errcode = '42501';
  end if;

  delete from public.jobs
  where id = p_job_id
    and organization_id = p_organization_id;

  get diagnostics affected_rows = row_count;
  if affected_rows <> 1 then
    raise exception 'Job not found.' using errcode = 'P0002';
  end if;
end;
$$;

revoke all on function public.delete_job(uuid, uuid) from public;
revoke all on function public.delete_job(uuid, uuid) from anon;
grant execute on function public.delete_job(uuid, uuid) to authenticated;
