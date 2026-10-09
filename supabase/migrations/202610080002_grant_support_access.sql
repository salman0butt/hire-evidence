create or replace function public.grant_support_access(
  p_organization_id uuid,
  p_actor_user_id uuid,
  p_reason text,
  p_expires_at timestamptz
)
returns uuid
language plpgsql
security definer
set search_path = ''
as $$
declare
  grantor_user_id uuid := auth.uid();
  support_grant_id uuid;
  audit_provenance_id uuid := gen_random_uuid();
begin
  if grantor_user_id is null then
    raise exception 'Authentication required.' using errcode = '42501';
  end if;

  if not private.has_organization_role(
    p_organization_id,
    array['owner', 'admin']::public.organization_role[]
  ) then
    raise exception 'Owner or admin role required.' using errcode = '42501';
  end if;

  insert into public.support_access_grants (
    organization_id,
    actor_user_id,
    scope,
    reason,
    granted_at,
    expires_at
  ) values (
    p_organization_id,
    p_actor_user_id,
    'read_incident_health',
    p_reason,
    now(),
    p_expires_at
  )
  returning id into support_grant_id;

  insert into public.audit_events (
    organization_id,
    actor_user_id,
    action,
    resource_type,
    resource_id,
    occurred_at,
    provenance_id,
    metadata
  ) values (
    p_organization_id,
    grantor_user_id,
    'support_access.granted',
    'support_access_grant',
    support_grant_id,
    now(),
    audit_provenance_id,
    jsonb_build_object(
      'support_actor_user_id', p_actor_user_id,
      'scope', 'read_incident_health',
      'expires_at', p_expires_at
    )
  );

  return support_grant_id;
end;
$$;

revoke all on function public.grant_support_access(uuid, uuid, text, timestamptz) from public;
revoke all on function public.grant_support_access(uuid, uuid, text, timestamptz) from anon;
grant execute on function public.grant_support_access(uuid, uuid, text, timestamptz) to authenticated;
