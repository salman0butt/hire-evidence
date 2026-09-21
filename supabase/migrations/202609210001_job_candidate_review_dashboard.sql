create or replace function public.get_job_candidate_review_dashboard(
  p_organization_id uuid,
  p_job_id uuid
)
returns jsonb
language plpgsql
stable
security definer
set search_path = ''
as $$
declare
  actor_id uuid := auth.uid();
  result jsonb;
begin
  if actor_id is null then
    raise exception 'Authentication required.' using errcode = '42501';
  end if;

  if not private.is_organization_member(p_organization_id) then
    raise exception 'Not authorized to review candidates.' using errcode = '42501';
  end if;

  if not exists (
    select 1
    from public.jobs job
    where job.id = p_job_id
      and job.organization_id = p_organization_id
  ) then
    raise exception 'Job review scope unavailable.' using errcode = '42501';
  end if;

  select coalesce(
    jsonb_agg(
      jsonb_build_object(
        'candidate_id', candidate.id,
        'candidate_name', candidate.full_name,
        'attempt_id', selected.attempt_id,
        'interview_status', selected.interview_status,
        'assessment_generation_id', selected.assessment_generation_id,
        'generation_number', selected.generation_number,
        'review_status', coalesce(review.status, 'awaiting_review'),
        'review_updated_at', review.updated_at
      )
      order by candidate.full_name, candidate.id
    ),
    '[]'::jsonb
  )
    into result
  from public.candidates candidate
  join lateral (
    select
      attempt.id as attempt_id,
      attempt.state as interview_status,
      generation.id as assessment_generation_id,
      generation.generation_number
    from public.interview_attempts attempt
    join lateral (
      select
        assessment_generation.id,
        assessment_generation.generation_number
      from public.assessment_generations assessment_generation
      where assessment_generation.organization_id = p_organization_id
        and assessment_generation.attempt_id = attempt.id
        and assessment_generation.status = 'completed'
        and assessment_generation.assessment is not null
        and assessment_generation.provenance is not null
      order by assessment_generation.generation_number desc
      limit 1
    ) generation on true
    where attempt.organization_id = p_organization_id
      and attempt.job_id = p_job_id
      and attempt.candidate_id = candidate.id
      and attempt.state = 'completed'
    order by attempt.updated_at desc, attempt.created_at desc, attempt.id desc
    limit 1
  ) selected on true
  left join public.candidate_reviews review
    on review.organization_id = p_organization_id
   and review.job_id = p_job_id
   and review.candidate_id = candidate.id
   and review.attempt_id = selected.attempt_id
   and review.assessment_generation_id = selected.assessment_generation_id
  where candidate.organization_id = p_organization_id
    and candidate.job_id = p_job_id;

  return result;
end;
$$;

revoke all on function public.get_job_candidate_review_dashboard(uuid, uuid) from public;
revoke all on function public.get_job_candidate_review_dashboard(uuid, uuid) from anon;
grant execute on function public.get_job_candidate_review_dashboard(uuid, uuid) to authenticated;
