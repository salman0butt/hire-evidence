create table public.candidate_review_score_overrides (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations(id) on delete restrict,
  job_id uuid not null references public.jobs(id) on delete restrict,
  candidate_id uuid not null references public.candidates(id) on delete restrict,
  attempt_id uuid not null references public.interview_attempts(id) on delete restrict,
  assessment_generation_id uuid not null references public.assessment_generations(id) on delete restrict,
  competency_id text not null check (char_length(btrim(competency_id)) between 1 and 200),
  human_score integer check (human_score is null or human_score between 1 and 5),
  reason text not null check (char_length(btrim(reason)) between 1 and 1000),
  reviewer_user_id uuid not null references auth.users(id) on delete restrict,
  created_at timestamptz not null default now()
);

create index candidate_review_score_overrides_scope_idx
  on public.candidate_review_score_overrides (
    organization_id,
    job_id,
    candidate_id,
    attempt_id,
    assessment_generation_id,
    competency_id,
    created_at desc
  );

alter table public.candidate_review_score_overrides enable row level security;

revoke all on table public.candidate_review_score_overrides from public;
revoke all on table public.candidate_review_score_overrides from anon;
revoke all on table public.candidate_review_score_overrides from authenticated;

create or replace function public.create_candidate_review_score_override(
  p_organization_id uuid,
  p_job_id uuid,
  p_candidate_id uuid,
  p_attempt_id uuid,
  p_assessment_generation_id uuid,
  p_competency_id text,
  p_human_score integer,
  p_reason text
)
returns public.candidate_review_score_overrides
language plpgsql
security definer
set search_path = ''
as $$
declare
  actor_id uuid := auth.uid();
  override_row public.candidate_review_score_overrides;
  normalized_competency_id text := btrim(p_competency_id);
  normalized_reason text := btrim(p_reason);
begin
  if actor_id is null then
    raise exception 'Authentication required.' using errcode = '42501';
  end if;

  if not private.is_organization_member(p_organization_id) then
    raise exception 'Not authorized to review candidate results.' using errcode = '42501';
  end if;

  if normalized_competency_id is null
    or char_length(normalized_competency_id) not between 1 and 200
    or normalized_reason is null
    or char_length(normalized_reason) not between 1 and 1000
    or (p_human_score is not null and p_human_score not between 1 and 5)
  then
    raise exception 'Invalid human score override.' using errcode = '22023';
  end if;

  if not exists (
    select 1
    from public.assessment_generations generation
    join public.interview_attempts attempt
      on attempt.id = generation.attempt_id
     and attempt.organization_id = generation.organization_id
    join public.candidates candidate
      on candidate.id = attempt.candidate_id
     and candidate.organization_id = attempt.organization_id
     and candidate.job_id = attempt.job_id
    where generation.id = p_assessment_generation_id
      and generation.organization_id = p_organization_id
      and generation.attempt_id = p_attempt_id
      and generation.status = 'completed'
      and generation.assessment is not null
      and generation.provenance is not null
      and attempt.organization_id = p_organization_id
      and attempt.job_id = p_job_id
      and attempt.candidate_id = p_candidate_id
      and attempt.state = 'completed'
      and candidate.id = p_candidate_id
      and exists (
        select 1
        from jsonb_array_elements(
          coalesce(generation.assessment -> 'competencies', '[]'::jsonb)
        ) competency
        where competency ->> 'competencyId' = normalized_competency_id
      )
  ) then
    raise exception 'Candidate review scope unavailable.' using errcode = '42501';
  end if;

  insert into public.candidate_review_score_overrides (
    organization_id,
    job_id,
    candidate_id,
    attempt_id,
    assessment_generation_id,
    competency_id,
    human_score,
    reason,
    reviewer_user_id
  )
  values (
    p_organization_id,
    p_job_id,
    p_candidate_id,
    p_attempt_id,
    p_assessment_generation_id,
    normalized_competency_id,
    p_human_score,
    normalized_reason,
    actor_id
  )
  returning * into override_row;

  return override_row;
end;
$$;

revoke all on function public.create_candidate_review_score_override(
  uuid, uuid, uuid, uuid, uuid, text, integer, text
) from public;
revoke all on function public.create_candidate_review_score_override(
  uuid, uuid, uuid, uuid, uuid, text, integer, text
) from anon;
grant execute on function public.create_candidate_review_score_override(
  uuid, uuid, uuid, uuid, uuid, text, integer, text
) to authenticated;
