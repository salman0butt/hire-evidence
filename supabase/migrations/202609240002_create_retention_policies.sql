create table public.organization_retention_policies (
  organization_id uuid primary key references public.organizations(id) on delete cascade,
  transcript_days integer not null check (transcript_days between 1 and 3650),
  assessment_days integer not null check (assessment_days between 1 and 3650),
  evidence_days integer not null check (evidence_days between 1 and 3650),
  ai_trace_days integer not null check (ai_trace_days between 1 and 3650),
  updated_by uuid not null references auth.users(id) on delete restrict,
  updated_at timestamptz not null default now()
);

alter table public.organization_retention_policies enable row level security;
grant select on table public.organization_retention_policies to authenticated;
revoke insert, update, delete on table public.organization_retention_policies from authenticated;

create policy retention_policies_select_member
on public.organization_retention_policies
for select
to authenticated
using (private.is_organization_member(organization_id));

create or replace function public.set_organization_retention_policy(
  p_organization_id uuid,
  p_transcript_days integer,
  p_assessment_days integer,
  p_evidence_days integer,
  p_ai_trace_days integer
)
returns void
language plpgsql
security definer
set search_path = ''
as $$
declare
  actor_id uuid := auth.uid();
  audit_provenance_id uuid := gen_random_uuid();
begin
  if actor_id is null then
    raise exception 'Authentication required.' using errcode = '42501';
  end if;

  if not private.has_organization_role(
    p_organization_id,
    array['owner', 'admin']::public.organization_role[]
  ) then
    raise exception 'Owner or admin role required.' using errcode = '42501';
  end if;

  if p_transcript_days not between 1 and 3650
     or p_assessment_days not between 1 and 3650
     or p_evidence_days not between 1 and 3650
     or p_ai_trace_days not between 1 and 3650 then
    raise exception 'Retention windows must be between 1 and 3650 days.' using errcode = '22023';
  end if;

  insert into public.organization_retention_policies (
    organization_id, transcript_days, assessment_days, evidence_days, ai_trace_days,
    updated_by, updated_at
  ) values (
    p_organization_id, p_transcript_days, p_assessment_days, p_evidence_days, p_ai_trace_days,
    actor_id, now()
  )
  on conflict (organization_id) do update set
    transcript_days = excluded.transcript_days,
    assessment_days = excluded.assessment_days,
    evidence_days = excluded.evidence_days,
    ai_trace_days = excluded.ai_trace_days,
    updated_by = excluded.updated_by,
    updated_at = excluded.updated_at;

  insert into public.audit_events (
    organization_id, actor_user_id, action, resource_type, resource_id,
    occurred_at, provenance_id, metadata
  ) values (
    p_organization_id,
    actor_id,
    'retention_policy.updated',
    'organization_retention_policy',
    p_organization_id,
    now(),
    audit_provenance_id,
    jsonb_build_object(
      'transcript_days', p_transcript_days,
      'assessment_days', p_assessment_days,
      'evidence_days', p_evidence_days,
      'ai_trace_days', p_ai_trace_days
    )
  );
end;
$$;

revoke all on function public.set_organization_retention_policy(uuid, integer, integer, integer, integer) from public;
revoke all on function public.set_organization_retention_policy(uuid, integer, integer, integer, integer) from anon;
grant execute on function public.set_organization_retention_policy(uuid, integer, integer, integer, integer) to authenticated;
