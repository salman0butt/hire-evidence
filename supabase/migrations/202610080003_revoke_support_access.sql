-- M11.7: owner/admin-only, tenant-bound, idempotent and audited revocation.
create or replace function public.revoke_support_access(
  p_organization_id uuid,
  p_grant_id uuid
)
returns boolean
language plpgsql
security definer
set search_path = ''
as $$
declare
  revoker_user_id uuid := auth.uid();
  revoked_scope text;
  effective_revoked_at timestamptz := now();
begin
  if revoker_user_id is null then
    raise exception 'Authentication required.' using errcode = '42501';
  end if;

  if coalesce(private.has_organization_role(
    p_organization_id,
    array['owner', 'admin']::public.organization_role[]
  ), false) is not true then
    raise exception 'Owner or admin role required.' using errcode = '42501';
  end if;

  update public.support_access_grants
     set revoked_at = effective_revoked_at
   where id = p_grant_id
     and organization_id = p_organization_id
     and revoked_at is null
   returning scope into revoked_scope;

  if not found then
    -- Includes already-revoked, missing, and other-tenant grant IDs. Keep the
    -- response identical so callers cannot use revocation as an existence oracle.
    return false;
  end if;

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
    revoker_user_id,
    'support_access.revoked',
    'support_access_grant',
    p_grant_id,
    effective_revoked_at,
    gen_random_uuid(),
    jsonb_build_object(
      'scope', revoked_scope,
      'revoked_at', effective_revoked_at
    )
  );

  return true;
end;
$$;

revoke all on function public.revoke_support_access(uuid, uuid) from public;
revoke all on function public.revoke_support_access(uuid, uuid) from anon;
grant execute on function public.revoke_support_access(uuid, uuid) to authenticated;
