create table public.candidates (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations(id) on delete cascade,
  job_id uuid not null,
  full_name text not null check (
    full_name = btrim(full_name)
    and char_length(full_name) between 1 and 200
  ),
  email text not null check (
    email = lower(btrim(email))
    and char_length(email) between 3 and 320
  ),
  created_by uuid not null references auth.users(id) on delete restrict,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (organization_id, job_id, email),
  foreign key (job_id, organization_id)
    references public.jobs(id, organization_id)
    on delete cascade
);

create index candidates_organization_id_job_id_idx
  on public.candidates(organization_id, job_id);

alter table public.candidates enable row level security;

grant select on table public.candidates to authenticated;

create policy candidates_select_member
on public.candidates
for select
to authenticated
using (private.is_organization_member(organization_id));

create or replace function public.create_candidate(
  p_organization_id uuid,
  p_job_id uuid,
  p_full_name text,
  p_email text
)
returns uuid
language plpgsql
security definer
set search_path = ''
as $$
declare
  actor_id uuid := auth.uid();
  normalized_full_name text := btrim(p_full_name);
  normalized_email text := lower(btrim(p_email));
  candidate_id uuid;
begin
  if actor_id is null then
    raise exception 'Authentication required.' using errcode = '42501';
  end if;

  if not private.has_organization_role(
    p_organization_id,
    array['owner', 'admin', 'recruiter', 'hiring_manager']::public.organization_role[]
  ) then
    raise exception 'Not authorized to manage candidates.' using errcode = '42501';
  end if;

  if normalized_full_name is null
     or char_length(normalized_full_name) < 1
     or char_length(normalized_full_name) > 200 then
    raise exception 'Candidate name must be between 1 and 200 characters.' using errcode = '22023';
  end if;

  if normalized_email is null
     or char_length(normalized_email) < 3
     or char_length(normalized_email) > 320 then
    raise exception 'Candidate email must be between 3 and 320 characters.' using errcode = '22023';
  end if;

  if not exists (
    select 1
    from public.jobs
    where id = p_job_id
      and organization_id = p_organization_id
  ) then
    raise exception 'Job not found.' using errcode = 'P0002';
  end if;

  insert into public.candidates (
    organization_id,
    job_id,
    full_name,
    email,
    created_by
  )
  values (
    p_organization_id,
    p_job_id,
    normalized_full_name,
    normalized_email,
    actor_id
  )
  returning id into candidate_id;

  return candidate_id;
end;
$$;

revoke all on function public.create_candidate(
  uuid,
  uuid,
  text,
  text
) from public;
revoke all on function public.create_candidate(
  uuid,
  uuid,
  text,
  text
) from anon;
grant execute on function public.create_candidate(
  uuid,
  uuid,
  text,
  text
) to authenticated;
