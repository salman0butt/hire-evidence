create or replace function public.resolve_public_candidate_invitation(
  p_token_hash text
)
returns table (
  organization_name text,
  job_title text
)
language sql
stable
security definer
set search_path = ''
as $$
  select
    organization_name.name as organization_name,
    job_title.title as job_title
  from public.candidate_invitations as invitation
  join public.organizations as organization_name
    on organization_name.id = invitation.organization_id
  join public.jobs as job_title
    on job_title.id = invitation.job_id
   and job_title.organization_id = invitation.organization_id
  where invitation.token_hash = p_token_hash
    and invitation.expires_at > now()
    and invitation.revoked_at is null
    and invitation.state in ('sent', 'opened', 'started')
  limit 1;
$$;

revoke all on function public.resolve_public_candidate_invitation(text) from public;
grant execute on function public.resolve_public_candidate_invitation(text) to anon;
grant execute on function public.resolve_public_candidate_invitation(text) to authenticated;
