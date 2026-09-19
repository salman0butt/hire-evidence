create or replace function public.get_candidate_review_result(
  p_organization_id uuid,
  p_job_id uuid,
  p_candidate_id uuid
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
    raise exception 'Not authorized to review candidate results.' using errcode = '42501';
  end if;

  select jsonb_build_object(
    'organization_id', candidate.organization_id,
    'job_id', candidate.job_id,
    'candidate_id', candidate.id,
    'attempt_id', selected.attempt_id,
    'candidate_name', candidate.full_name,
    'job_title', job.title,
    'interview_status', selected.interview_status,
    'review_status', 'awaiting_review',
    'generation_number', selected.generation_number,
    'assessment_status', selected.assessment_status,
    'assessment', selected.assessment,
    'competency_catalog', selected.competency_catalog
  )
    into result
  from public.candidates candidate
  join public.jobs job
    on job.id = candidate.job_id
   and job.organization_id = candidate.organization_id
  join lateral (
    select
      attempt.id as attempt_id,
      attempt.state as interview_status,
      generation.generation_number,
      generation.status as assessment_status,
      generation.assessment,
      coalesce((
        select jsonb_agg(
          jsonb_build_object(
            'id', competency_entry.value ->> 'id',
            'name', competency_entry.value ->> 'name'
          )
          order by competency_entry.ordinality
        )
        from jsonb_array_elements(
          coalesce(interviewer_version.snapshot -> 'competencies', '[]'::jsonb)
        ) with ordinality as competency_entry(value, ordinality)
      ), '[]'::jsonb) as competency_catalog
    from public.interview_attempts attempt
    join public.interviewer_versions interviewer_version
      on interviewer_version.id = attempt.interviewer_version_id
     and interviewer_version.organization_id = attempt.organization_id
     and interviewer_version.job_id = attempt.job_id
    join lateral (
      select
        assessment_generation.generation_number,
        assessment_generation.status,
        assessment_generation.assessment
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
      and attempt.candidate_id = p_candidate_id
      and attempt.state = 'completed'
    order by attempt.updated_at desc, attempt.created_at desc, attempt.id desc
    limit 1
  ) selected on true
  where candidate.organization_id = p_organization_id
    and candidate.job_id = p_job_id
    and candidate.id = p_candidate_id;

  return result;
end;
$$;

revoke all on function public.get_candidate_review_result(uuid, uuid, uuid) from public;
revoke all on function public.get_candidate_review_result(uuid, uuid, uuid) from anon;
grant execute on function public.get_candidate_review_result(uuid, uuid, uuid) to authenticated;
