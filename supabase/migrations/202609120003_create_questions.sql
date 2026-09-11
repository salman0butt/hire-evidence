create table public.questions (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations(id) on delete cascade,
  job_id uuid not null,
  competency_id uuid not null,
  question_text text not null check (char_length(btrim(question_text)) between 1 and 4000),
  difficulty text not null check (difficulty in ('easy', 'medium', 'hard')),
  expected_areas text[] not null default '{}'::text[] check (cardinality(expected_areas) <= 20),
  follow_up_hints text[] not null default '{}'::text[] check (cardinality(follow_up_hints) <= 20),
  max_duration_seconds integer not null check (max_duration_seconds between 1 and 3600),
  is_required boolean not null default true,
  position integer not null default 0 check (position >= 0),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (job_id, position),
  unique (id, job_id, organization_id),
  foreign key (job_id, organization_id)
    references public.jobs(id, organization_id)
    on delete cascade,
  foreign key (competency_id, job_id, organization_id)
    references public.competencies(id, job_id, organization_id)
    on delete cascade
);

create index questions_organization_job_position_idx
  on public.questions(organization_id, job_id, position);

create index questions_competency_id_idx
  on public.questions(competency_id);

alter table public.questions enable row level security;

grant select on table public.questions to authenticated;

create policy questions_select_member
on public.questions
for select
to authenticated
using (private.is_organization_member(organization_id));

create or replace function public.create_question(
  p_organization_id uuid,
  p_job_id uuid,
  p_competency_id uuid,
  p_question_text text,
  p_difficulty text,
  p_expected_areas text[] default '{}'::text[],
  p_follow_up_hints text[] default '{}'::text[],
  p_max_duration_seconds integer default 300,
  p_is_required boolean default true,
  p_position integer default 0
)
returns uuid
language plpgsql
security definer
set search_path = ''
as $$
declare
  actor_id uuid := auth.uid();
  normalized_question text := btrim(p_question_text);
  normalized_difficulty text := lower(btrim(p_difficulty));
  normalized_expected_areas text[] := coalesce(p_expected_areas, '{}'::text[]);
  normalized_follow_up_hints text[] := coalesce(p_follow_up_hints, '{}'::text[]);
  item text;
  question_id uuid;
begin
  if actor_id is null then
    raise exception 'Authentication required.' using errcode = '42501';
  end if;

  if not private.has_organization_role(
    p_organization_id,
    array['owner', 'admin', 'recruiter', 'hiring_manager']::public.organization_role[]
  ) then
    raise exception 'Not authorized to manage questions.' using errcode = '42501';
  end if;

  if not exists (
    select 1
    from public.competencies
    where id = p_competency_id
      and job_id = p_job_id
      and organization_id = p_organization_id
  ) then
    raise exception 'Competency not found for this job.' using errcode = 'P0002';
  end if;

  if normalized_question is null
     or char_length(normalized_question) < 1
     or char_length(normalized_question) > 4000 then
    raise exception 'Question text must be between 1 and 4000 characters.' using errcode = '22023';
  end if;

  if normalized_difficulty not in ('easy', 'medium', 'hard') then
    raise exception 'Question difficulty must be easy, medium, or hard.' using errcode = '22023';
  end if;

  if cardinality(normalized_expected_areas) > 20 then
    raise exception 'Expected areas cannot contain more than 20 items.' using errcode = '22023';
  end if;

  foreach item in array normalized_expected_areas loop
    if item is null or char_length(btrim(item)) < 1 or char_length(btrim(item)) > 500 then
      raise exception 'Each expected area must be between 1 and 500 characters.' using errcode = '22023';
    end if;
  end loop;

  if cardinality(normalized_follow_up_hints) > 20 then
    raise exception 'Follow-up hints cannot contain more than 20 items.' using errcode = '22023';
  end if;

  foreach item in array normalized_follow_up_hints loop
    if item is null or char_length(btrim(item)) < 1 or char_length(btrim(item)) > 500 then
      raise exception 'Each follow-up hint must be between 1 and 500 characters.' using errcode = '22023';
    end if;
  end loop;

  if p_max_duration_seconds is null
     or p_max_duration_seconds < 1
     or p_max_duration_seconds > 3600 then
    raise exception 'Question duration must be between 1 and 3600 seconds.' using errcode = '22023';
  end if;

  if p_position is null or p_position < 0 then
    raise exception 'Question position must be zero or greater.' using errcode = '22023';
  end if;

  insert into public.questions (
    organization_id,
    job_id,
    competency_id,
    question_text,
    difficulty,
    expected_areas,
    follow_up_hints,
    max_duration_seconds,
    is_required,
    position
  )
  values (
    p_organization_id,
    p_job_id,
    p_competency_id,
    normalized_question,
    normalized_difficulty,
    normalized_expected_areas,
    normalized_follow_up_hints,
    p_max_duration_seconds,
    coalesce(p_is_required, true),
    p_position
  )
  returning id into question_id;

  return question_id;
end;
$$;

revoke all on function public.create_question(uuid, uuid, uuid, text, text, text[], text[], integer, boolean, integer) from public;
revoke all on function public.create_question(uuid, uuid, uuid, text, text, text[], text[], integer, boolean, integer) from anon;
grant execute on function public.create_question(uuid, uuid, uuid, text, text, text[], text[], integer, boolean, integer) to authenticated;
