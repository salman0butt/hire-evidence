create table public.assessment_generations (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations(id) on delete restrict,
  attempt_id uuid not null references public.interview_attempts(id) on delete restrict,
  generation_number integer not null check (generation_number > 0),
  status text not null default 'pending' check (status in ('pending', 'processing', 'completed', 'failed')),
  assessment jsonb,
  provenance jsonb,
  failure_reason text,
  created_at timestamptz not null default now(),
  started_at timestamptz,
  completed_at timestamptz,
  failed_at timestamptz,
  unique (attempt_id, generation_number)
);

create index assessment_generations_organization_attempt_idx
  on public.assessment_generations(organization_id, attempt_id, generation_number desc);

alter table public.assessment_generations enable row level security;

revoke all on table public.assessment_generations from anon;
revoke all on table public.assessment_generations from authenticated;

create or replace function public.claim_assessment_generation(
  p_organization_id uuid,
  p_attempt_id uuid,
  p_generation_number integer
)
returns public.assessment_generations
language plpgsql
security definer
set search_path = ''
as $$
declare
  interview_attempt public.interview_attempts;
  generation public.assessment_generations;
begin
  if p_organization_id is null or p_attempt_id is null or p_generation_number is null or p_generation_number < 1 then
    raise exception 'assessment generation unavailable';
  end if;

  select attempt.* into interview_attempt
  from public.interview_attempts attempt
  where attempt.id = p_attempt_id
    and attempt.organization_id = p_organization_id
    and attempt.state = 'completed'
  for share;

  if interview_attempt.id is null then
    raise exception 'assessment generation unavailable';
  end if;

  insert into public.assessment_generations (
    organization_id, attempt_id, generation_number, status
  ) values (
    p_organization_id, p_attempt_id, p_generation_number, 'pending'
  )
  on conflict (attempt_id, generation_number) do nothing;

  update public.assessment_generations candidate
  set status = 'processing', started_at = coalesce(candidate.started_at, now())
  where candidate.organization_id = p_organization_id
    and candidate.attempt_id = p_attempt_id
    and candidate.generation_number = p_generation_number
    and candidate.status = 'pending'
  returning candidate.* into generation;

  if generation.id is null then
    raise exception 'assessment generation unavailable';
  end if;

  return generation;
end;
$$;

create or replace function public.complete_assessment_generation(
  p_organization_id uuid,
  p_attempt_id uuid,
  p_generation_number integer,
  p_assessment jsonb,
  p_provenance jsonb,
  p_validated boolean
)
returns public.assessment_generations
language plpgsql
security definer
set search_path = ''
as $$
declare
  generation public.assessment_generations;
begin
  if p_validated is not true or p_assessment is null or p_provenance is null then
    raise exception 'validated assessment required';
  end if;

  update public.assessment_generations candidate
  set status = 'completed',
      assessment = p_assessment,
      provenance = p_provenance,
      completed_at = now()
  where candidate.organization_id = p_organization_id
    and candidate.attempt_id = p_attempt_id
    and candidate.generation_number = p_generation_number
    and candidate.status = 'processing'
  returning candidate.* into generation;

  if generation.id is null then
    raise exception 'assessment generation unavailable';
  end if;

  return generation;
end;
$$;

create or replace function public.fail_assessment_generation(
  p_organization_id uuid,
  p_attempt_id uuid,
  p_generation_number integer,
  p_failure_reason text
)
returns public.assessment_generations
language plpgsql
security definer
set search_path = ''
as $$
declare
  generation public.assessment_generations;
begin
  update public.assessment_generations candidate
  set status = 'failed', failure_reason = nullif(btrim(p_failure_reason), ''), failed_at = now()
  where candidate.organization_id = p_organization_id
    and candidate.attempt_id = p_attempt_id
    and candidate.generation_number = p_generation_number
    and candidate.status = 'processing'
  returning candidate.* into generation;

  if generation.id is null then
    raise exception 'assessment generation unavailable';
  end if;

  return generation;
end;
$$;

create or replace function public.get_assessment_generation(
  p_organization_id uuid,
  p_attempt_id uuid,
  p_generation_number integer
)
returns public.assessment_generations
language sql
stable
security definer
set search_path = ''
as $$
  select generation.*
  from public.assessment_generations generation
  where generation.organization_id = p_organization_id
    and generation.attempt_id = p_attempt_id
    and generation.generation_number = p_generation_number;
$$;

create or replace function public.list_assessment_generations(
  p_organization_id uuid,
  p_attempt_id uuid
)
returns setof public.assessment_generations
language sql
stable
security definer
set search_path = ''
as $$
  select generation.*
  from public.assessment_generations generation
  where generation.organization_id = p_organization_id
    and generation.attempt_id = p_attempt_id
  order by generation.generation_number asc;
$$;

create or replace function public.create_assessment_regeneration(
  p_organization_id uuid,
  p_attempt_id uuid
)
returns public.assessment_generations
language plpgsql
security definer
set search_path = ''
as $$
declare
  interview_attempt public.interview_attempts;
  generation public.assessment_generations;
  next_generation_number integer;
begin
  if p_organization_id is null or p_attempt_id is null then
    raise exception 'assessment generation unavailable';
  end if;

  select attempt.* into interview_attempt
  from public.interview_attempts attempt
  where attempt.id = p_attempt_id
    and attempt.organization_id = p_organization_id
    and attempt.state = 'completed'
  for update;

  if interview_attempt.id is null then
    raise exception 'assessment generation unavailable';
  end if;

  select coalesce(max(existing.generation_number), 0) + 1
    into next_generation_number
  from public.assessment_generations existing
  where existing.organization_id = p_organization_id
    and existing.attempt_id = p_attempt_id;

  insert into public.assessment_generations (
    organization_id, attempt_id, generation_number, status
  ) values (
    p_organization_id, p_attempt_id, next_generation_number, 'pending'
  )
  returning * into generation;

  return generation;
exception
  when unique_violation then
    raise exception 'assessment generation unavailable';
end;
$$;

revoke all on function public.claim_assessment_generation(uuid, uuid, integer) from public;
revoke all on function public.complete_assessment_generation(uuid, uuid, integer, jsonb, jsonb, boolean) from public;
revoke all on function public.fail_assessment_generation(uuid, uuid, integer, text) from public;
revoke all on function public.get_assessment_generation(uuid, uuid, integer) from public;
revoke all on function public.list_assessment_generations(uuid, uuid) from public;
revoke all on function public.create_assessment_regeneration(uuid, uuid) from public;
