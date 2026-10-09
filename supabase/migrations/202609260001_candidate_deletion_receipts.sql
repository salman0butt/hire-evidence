-- A minimal, non-sensitive retry receipt; no candidate name, email, transcript,
-- assessment, or other hiring evidence is retained here.
create table public.candidate_deletion_receipts (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations(id) on delete restrict,
  subject_hash text not null check (subject_hash ~ '^[0-9a-f]{64}$'),
  requested_by uuid not null references auth.users(id) on delete restrict,
  completed_at timestamptz not null default now(),
  unique (organization_id, subject_hash)
);

alter table public.candidate_deletion_receipts enable row level security;
revoke all on table public.candidate_deletion_receipts from public, anon, authenticated;

-- This initial boundary deliberately fails closed for candidates with related
-- restrictive FK records. Coordinated artifact erasure is a separate M11.3 unit;
-- it must not be represented as complete before its own RED/GREEN evidence.
create or replace function public.delete_candidate_data(
  p_organization_id uuid,
  p_candidate_id uuid
)
returns void
language plpgsql
security definer
set search_path = ''
as $$
declare
  actor_id uuid := auth.uid();
  subject_digest text;
  receipt_id uuid;
  target_id uuid;
begin
  if actor_id is null then
    raise exception 'Authentication required.' using errcode = '42501';
  end if;

  if p_organization_id is null
     or p_candidate_id is null
     or not private.has_organization_role(
       p_organization_id,
       array['owner', 'admin']::public.organization_role[]
     ) then
    raise exception 'Owner or admin role required.' using errcode = '42501';
  end if;

  subject_digest := pg_catalog.encode(
    pg_catalog.sha256(
      pg_catalog.convert_to(p_organization_id::text || ':' || p_candidate_id::text, 'UTF8')
    ),
    'hex'
  );

  select receipt.id into receipt_id
  from public.candidate_deletion_receipts receipt
  where receipt.organization_id = p_organization_id
    and receipt.subject_hash = subject_digest;

  if receipt_id is not null then
    if exists (
      select 1 from public.candidates candidate
      where candidate.id = p_candidate_id
        and candidate.organization_id = p_organization_id
    ) then
      raise exception 'Deletion receipt conflicts with candidate state.' using errcode = '23514';
    end if;
    return;
  end if;

  select candidate.id into target_id
  from public.candidates candidate
  where candidate.id = p_candidate_id
    and candidate.organization_id = p_organization_id
  for update;

  if target_id is null then
    -- A concurrent first request can finish while this call waits on its row.
    select receipt.id into receipt_id
    from public.candidate_deletion_receipts receipt
    where receipt.organization_id = p_organization_id
      and receipt.subject_hash = subject_digest;
    if receipt_id is not null then
      return;
    end if;
    raise exception 'Candidate deletion scope unavailable.' using errcode = 'P0002';
  end if;

  -- A restrictive FK prevents partial erasure of an interview or its evidence.
  -- The deletion and its receipt/audit event commit in one database transaction.
  delete from public.candidates
  where id = target_id
    and organization_id = p_organization_id;

  insert into public.candidate_deletion_receipts (
    organization_id, subject_hash, requested_by
  ) values (
    p_organization_id, subject_digest, actor_id
  ) returning id into receipt_id;

  insert into public.audit_events (
    organization_id, actor_user_id, action, resource_type, resource_id,
    occurred_at, provenance_id, metadata
  ) values (
    p_organization_id, actor_id, 'candidate_data.deleted',
    'candidate_deletion_receipt', receipt_id,
    now(), gen_random_uuid(), '{}'::jsonb
  );
end;
$$;

revoke all on function public.delete_candidate_data(uuid, uuid) from public;
revoke all on function public.delete_candidate_data(uuid, uuid) from anon;
grant execute on function public.delete_candidate_data(uuid, uuid) to authenticated;
