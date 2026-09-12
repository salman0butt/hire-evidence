create table public.competencies (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations(id) on delete cascade,
  job_id uuid not null,
  name text not null check (char_length(btrim(name)) between 1 and 160),
  description text null check (description is null or char_length(description) <= 2000),
  weight numeric(5, 2) not null check (weight > 0 and weight <= 100),
  position integer not null default 0 check (position >= 0),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (job_id, position),
  foreign key (job_id, organization_id)
    references public.jobs(id, organization_id)
    on delete cascade
);

create index competencies_organization_id_job_id_idx
  on public.competencies(organization_id, job_id);

alter table public.competencies enable row level security;

grant select on table public.competencies to authenticated;

create policy competencies_select_member
on public.competencies
for select
to authenticated
using (private.is_organization_member(organization_id));

create or replace function public.create_competency(
  p_organization_id uuid,
  p_job_id uuid,
  p_name text,
  p_description text default null,
  p_weight numeric default 1,
  p_position integer default 0
)
returns uuid
language plpgsql
security definer
set search_path = ''
as $$
declare
  actor_id uuid := auth.uid();
  normalized_name text := btrim(p_name);
  normalized_description text := nullif(btrim(p_description), '');
  competency_id uuid;
begin
  if actor_id is null then
    raise exception 'Authentication required.' using errcode = '42501';
  end if;

  if not private.has_organization_role(
    p_organization_id,
    array['owner', 'admin', 'recruiter', 'hiring_manager']::public.organization_role[]
  ) then
    raise exception 'Not authorized to manage competencies.' using errcode = '42501';
  end if;

  if not exists (
    select 1
    from public.jobs
    where id = p_job_id
      and organization_id = p_organization_id
  ) then
    raise exception 'Job not found.' using errcode = 'P0002';
  end if;

  if normalized_name is null
     or char_length(normalized_name) < 1
     or char_length(normalized_name) > 160 then
    raise exception 'Competency name must be between 1 and 160 characters.' using errcode = '22023';
  end if;

  if normalized_description is not null
     and char_length(normalized_description) > 2000 then
    raise exception 'Competency description must be 2000 characters or fewer.' using errcode = '22023';
  end if;

  if p_weight is null or p_weight <= 0 or p_weight > 100 then
    raise exception 'Competency weight must be greater than 0 and at most 100.' using errcode = '22023';
  end if;

  if p_position is null or p_position < 0 then
    raise exception 'Competency position must be zero or greater.' using errcode = '22023';
  end if;

  insert into public.competencies (
    organization_id,
    job_id,
    name,
    description,
    weight,
    position
  )
  values (
    p_organization_id,
    p_job_id,
    normalized_name,
    normalized_description,
    p_weight,
    p_position
  )
  returning id into competency_id;

  return competency_id;
end;
$$;

revoke all on function public.create_competency(uuid, uuid, text, text, numeric, integer) from public;
revoke all on function public.create_competency(uuid, uuid, text, text, numeric, integer) from anon;
grant execute on function public.create_competency(uuid, uuid, text, text, numeric, integer) to authenticated;
