alter table public.organizations
  add column candidate_support_email text null
    check (
      candidate_support_email is null
      or char_length(candidate_support_email) <= 254
    ),
  add column candidate_support_url text null
    check (
      candidate_support_url is null
      or char_length(candidate_support_url) <= 2048
    );

grant update (candidate_support_email, candidate_support_url)
  on table public.organizations to authenticated;

-- PostgreSQL does not permit CREATE OR REPLACE to change an existing
-- function's RETURNS TABLE shape, so drop the old narrow projection first
-- and recreate it with only the two additional candidate-support fields.
drop function if exists public.resolve_public_candidate_invitation(text);

create or replace function public.resolve_public_candidate_invitation(
  p_token_hash text
)
returns table (
  organization_name text,
  job_title text,
  duration_seconds integer,
  interview_type text,
  language text,
  candidate_instructions text,
  candidate_support_email text,
  candidate_support_url text
)
language sql
stable
security definer
set search_path = ''
as $$
  select
    organization_name.name as organization_name,
    job_title.title as job_title,
    nullif(interviewer_version.snapshot -> 'interviewer_config' ->> 'duration_seconds', '')::integer as duration_seconds,
    interviewer_version.snapshot -> 'interviewer_config' ->> 'interview_type' as interview_type,
    interviewer_version.snapshot -> 'interviewer_config' ->> 'language' as language,
    coalesce(
      interviewer_version.snapshot -> 'interviewer_config' ->> 'candidate_instructions',
      ''
    ) as candidate_instructions,
    organization_name.candidate_support_email,
    organization_name.candidate_support_url
  from public.candidate_invitations as invitation
  join public.organizations as organization_name
    on organization_name.id = invitation.organization_id
  join public.jobs as job_title
    on job_title.id = invitation.job_id
   and job_title.organization_id = invitation.organization_id
  join public.interviewer_versions as interviewer_version
    on interviewer_version.id = invitation.interviewer_version_id
   and interviewer_version.job_id = invitation.job_id
   and interviewer_version.organization_id = invitation.organization_id
  where invitation.token_hash = p_token_hash
    and invitation.expires_at > now()
    and invitation.revoked_at is null
    and invitation.state in ('sent', 'opened', 'started')
  limit 1;
$$;

revoke all on function public.resolve_public_candidate_invitation(text) from public;
grant execute on function public.resolve_public_candidate_invitation(text) to anon;
grant execute on function public.resolve_public_candidate_invitation(text) to authenticated;
