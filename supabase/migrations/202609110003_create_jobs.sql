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
