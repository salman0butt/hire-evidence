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
