alter table public.competencies
  add constraint competencies_id_job_organization_key
  unique (id, job_id, organization_id);

create table public.competency_rubrics (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations(id) on delete cascade,
  job_id uuid not null,
  competency_id uuid not null,
  score_level smallint not null check (score_level between 1 and 5),
  definition text not null check (char_length(btrim(definition)) between 1 and 2000),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (competency_id, score_level),
  foreign key (competency_id, job_id, organization_id)
    references public.competencies(id, job_id, organization_id)
    on delete cascade
);

create index competency_rubrics_organization_job_competency_idx
  on public.competency_rubrics(organization_id, job_id, competency_id, score_level);

alter table public.competency_rubrics enable row level security;

grant select on table public.competency_rubrics to authenticated;

create policy competency_rubrics_select_member
on public.competency_rubrics
for select
to authenticated
using (private.is_organization_member(organization_id));

create or replace function public.save_competency_rubric(
  p_organization_id uuid,
  p_job_id uuid,
  p_competency_id uuid,
  p_level_1 text,
  p_level_2 text,
  p_level_3 text,
  p_level_4 text,
  p_level_5 text
)
returns void
language plpgsql
security definer
set search_path = ''
as $$
declare
  actor_id uuid := auth.uid();
  definitions text[] := array[p_level_1, p_level_2, p_level_3, p_level_4, p_level_5];
  definition text;
begin
  if actor_id is null then
    raise exception 'Authentication required.' using errcode = '42501';
  end if;

  if not private.has_organization_role(
    p_organization_id,
    array['owner', 'admin', 'recruiter', 'hiring_manager']::public.organization_role[]
  ) then
    raise exception 'Not authorized to manage competency rubrics.' using errcode = '42501';
  end if;

  if not exists (
    select 1
    from public.competencies
    where id = p_competency_id
      and job_id = p_job_id
      and organization_id = p_organization_id
  ) then
    raise exception 'Competency not found.' using errcode = 'P0002';
  end if;

  foreach definition in array definitions loop
    if definition is null
       or char_length(btrim(definition)) < 1
       or char_length(btrim(definition)) > 2000 then
      raise exception 'Every rubric level must have a definition between 1 and 2000 characters.'
        using errcode = '22023';
    end if;
  end loop;

  insert into public.competency_rubrics (
    organization_id,
    job_id,
    competency_id,
    score_level,
    definition
  )
  select
    p_organization_id,
    p_job_id,
    p_competency_id,
    levels.score_level,
    btrim(levels.definition)
  from (
    values
      (1::smallint, p_level_1),
      (2::smallint, p_level_2),
      (3::smallint, p_level_3),
      (4::smallint, p_level_4),
      (5::smallint, p_level_5)
  ) as levels(score_level, definition)
  on conflict (competency_id, score_level)
  do update
    set definition = excluded.definition,
        updated_at = now();
end;
$$;

revoke all on function public.save_competency_rubric(uuid, uuid, uuid, text, text, text, text, text) from public;
revoke all on function public.save_competency_rubric(uuid, uuid, uuid, text, text, text, text, text) from anon;
grant execute on function public.save_competency_rubric(uuid, uuid, uuid, text, text, text, text, text) to authenticated;
