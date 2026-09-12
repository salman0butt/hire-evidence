alter table public.candidates
  add constraint candidates_id_job_organization_key
  unique (id, job_id, organization_id);

alter table public.interviewer_versions
  add constraint interviewer_versions_id_job_organization_key
  unique (id, job_id, organization_id);

create table public.candidate_invitations (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations(id) on delete restrict,
  job_id uuid not null references public.jobs(id) on delete restrict,
  candidate_id uuid not null references public.candidates(id) on delete restrict,
  interviewer_version_id uuid not null references public.interviewer_versions(id) on delete restrict,
  token_hash text not null unique
    check (token_hash ~ '^[0-9a-f]{64}$'),
  expires_at timestamptz not null,
  revoked_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  foreign key (job_id, organization_id)
    references public.jobs(id, organization_id)
    on delete restrict,
  foreign key (candidate_id, job_id, organization_id)
    references public.candidates(id, job_id, organization_id)
    on delete restrict,
  foreign key (interviewer_version_id, job_id, organization_id)
    references public.interviewer_versions(id, job_id, organization_id)
    on delete restrict,
  check (expires_at > created_at),
  check (revoked_at is null or revoked_at >= created_at)
);

create index candidate_invitations_organization_job_idx
  on public.candidate_invitations(organization_id, job_id, created_at desc);

alter table public.candidate_invitations enable row level security;

revoke all on table public.candidate_invitations from anon;
revoke all on table public.candidate_invitations from authenticated;
grant select on table public.candidate_invitations to authenticated;

create policy candidate_invitations_select_manager
on public.candidate_invitations
for select
to authenticated
using (
  private.has_organization_role(
    organization_id,
    array['owner', 'admin', 'recruiter', 'hiring_manager']::public.organization_role[]
  )
);
