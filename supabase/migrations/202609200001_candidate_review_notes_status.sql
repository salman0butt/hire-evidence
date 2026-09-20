create table public.candidate_reviews (
  organization_id uuid not null references public.organizations(id) on delete restrict,
  job_id uuid not null references public.jobs(id) on delete restrict,
  candidate_id uuid not null references public.candidates(id) on delete restrict,
  attempt_id uuid not null references public.interview_attempts(id) on delete restrict,
  assessment_generation_id uuid not null references public.assessment_generations(id) on delete restrict,
  status text not null check (status in ('awaiting_review', 'in_review', 'reviewed')),
  reviewer_notes text check (reviewer_notes is null or char_length(btrim(reviewer_notes)) <= 4000),
  reviewer_user_id uuid not null references auth.users(id) on delete restrict,
  updated_at timestamptz not null default now(),
  primary key (organization_id, job_id, candidate_id, attempt_id, assessment_generation_id)
);

alter table public.candidate_reviews enable row level security;

revoke all on table public.candidate_reviews from public;
revoke all on table public.candidate_reviews from anon;
revoke all on table public.candidate_reviews from authenticated;

create or replace function public.save_candidate_review(
  p_organization_id uuid,
  p_job_id uuid,
  p_candidate_id uuid,
  p_attempt_id uuid,
  p_assessment_generation_id uuid,
  p_status text,
  p_reviewer_notes text
)
returns public.candidate_reviews
language plpgsql
security definer
set search_path = ''
as $$
declare
  actor_id uuid := auth.uid();
  review_row public.candidate_reviews;
  existing_status text;
  normalized_notes text := nullif(btrim(p_reviewer_notes), '');
begin
  if actor_id is null then
    raise exception 'Authentication required.' using errcode = '42501';
  end if;

  if not private.is_organization_member(p_organization_id) then
    raise exception 'Not authorized to review candidate results.' using errcode = '42501';
  end if;

  if p_status not in ('awaiting_review', 'in_review', 'reviewed')
    or (normalized_notes is not null and char_length(normalized_notes) > 4000)
  then
    raise exception 'Invalid candidate review.' using errcode = '22023';
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
  ) then
    raise exception 'Candidate review scope unavailable.' using errcode = '42501';
  end if;

  select status
    into existing_status
    from public.candidate_reviews
   where organization_id = p_organization_id
     and job_id = p_job_id
     and candidate_id = p_candidate_id
     and attempt_id = p_attempt_id
     and assessment_generation_id = p_assessment_generation_id
   for update;

  if existing_status is null then
    if p_status <> 'awaiting_review' then
      raise exception 'Invalid candidate review transition.' using errcode = '22023';
    end if;
  elsif p_status <> existing_status
    and not (
      (existing_status = 'awaiting_review' and p_status = 'in_review')
      or (existing_status = 'in_review' and p_status = 'reviewed')
    )
  then
    raise exception 'Invalid candidate review transition.' using errcode = '22023';
  end if;

  insert into public.candidate_reviews (
    organization_id, job_id, candidate_id, attempt_id,
    assessment_generation_id, status, reviewer_notes, reviewer_user_id, updated_at
  ) values (
    p_organization_id, p_job_id, p_candidate_id, p_attempt_id,
    p_assessment_generation_id, p_status, normalized_notes, actor_id, now()
  )
  on conflict (organization_id, job_id, candidate_id, attempt_id, assessment_generation_id)
  do update set
    status = excluded.status,
    reviewer_notes = excluded.reviewer_notes,
    reviewer_user_id = actor_id,
    updated_at = now()
  returning * into review_row;

  return review_row;
end;
$$;

revoke all on function public.save_candidate_review(uuid, uuid, uuid, uuid, uuid, text, text) from public;
revoke all on function public.save_candidate_review(uuid, uuid, uuid, uuid, uuid, text, text) from anon;
grant execute on function public.save_candidate_review(uuid, uuid, uuid, uuid, uuid, text, text) to authenticated;
