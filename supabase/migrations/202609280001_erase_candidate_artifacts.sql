-- Follow-on migration: tenant-authorized transactional candidate artifact erasure.
-- Does not claim removal of externally persisted audio or provider-side traces.
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

  -- The candidate row is locked above. Delete its dependent rows from the
  -- leaves inward, preserving restrictive foreign keys and transaction rollback.
  delete from public.candidate_review_score_overrides override_row
  where override_row.organization_id = p_organization_id
    and override_row.candidate_id = target_id;

  delete from public.candidate_reviews review_row
  where review_row.organization_id = p_organization_id
    and review_row.candidate_id = target_id;

  delete from public.assessment_generations generation
  using public.interview_attempts attempt
  where generation.attempt_id = attempt.id
    and generation.organization_id = p_organization_id
    and attempt.organization_id = p_organization_id
    and attempt.candidate_id = target_id;

  delete from public.interview_assessment_triggers trigger_row
  using public.interview_attempts attempt
  where trigger_row.attempt_id = attempt.id
    and attempt.organization_id = p_organization_id
    and attempt.candidate_id = target_id;

  delete from public.interview_transcript_messages message
  using public.interview_attempts attempt
  where message.attempt_id = attempt.id
    and attempt.organization_id = p_organization_id
    and attempt.candidate_id = target_id;

  delete from public.interview_technical_events event_row
  using public.interview_attempts attempt
  where event_row.attempt_id = attempt.id
    and attempt.organization_id = p_organization_id
    and attempt.candidate_id = target_id;

  delete from public.interview_attempts attempt
  where attempt.organization_id = p_organization_id
    and attempt.candidate_id = target_id;

  delete from public.candidate_consent_events consent
  using public.candidate_invitations invitation
  where consent.invitation_id = invitation.id
    and invitation.organization_id = p_organization_id
    and invitation.candidate_id = target_id;

  delete from public.candidate_invitations invitation
  where invitation.organization_id = p_organization_id
    and invitation.candidate_id = target_id;

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
