-- M11.7: bounded same-tenant owner/admin support access review projection.
create or replace function public.list_support_access_reviews(
  p_organization_id uuid,
  p_limit integer,
  p_offset integer
)
returns table (
  grant_id uuid,
  support_actor_user_id uuid,
  scope text,
  reason text,
  granted_at timestamptz,
  expires_at timestamptz,
  revoked_at timestamptz,
  status text
)
language plpgsql
security definer
set search_path = ''
as $$
declare
  reviewer_user_id uuid := auth.uid();
begin
  if reviewer_user_id is null then
    raise exception 'Authentication required.' using errcode = '42501';
  end if;

  if coalesce(private.has_organization_role(
    p_organization_id,
    array['owner', 'admin']::public.organization_role[]
  ), false) is not true then
    raise exception 'Owner or admin role required.' using errcode = '42501';
  end if;

  if p_limit is null or p_limit < 1 or p_limit > 100 then
    raise exception 'Limit must be between 1 and 100.' using errcode = '22023';
  end if;

  if p_offset is null or p_offset < 0 then
    raise exception 'Offset must be non-negative.' using errcode = '22023';
  end if;

  return query
  select
    sag.id,
    sag.actor_user_id,
    sag.scope,
    sag.reason,
    sag.granted_at,
    sag.expires_at,
    sag.revoked_at,
    case
      when sag.revoked_at is not null then 'revoked'
      when sag.expires_at <= now() then 'expired'
      else 'active'
    end::text
  from public.support_access_grants sag
  where sag.organization_id = p_organization_id
  order by sag.granted_at desc, sag.id desc
  limit p_limit
  offset p_offset;
end;
$$;

revoke all on function public.list_support_access_reviews(uuid, integer, integer) from public;
revoke all on function public.list_support_access_reviews(uuid, integer, integer) from anon;
grant execute on function public.list_support_access_reviews(uuid, integer, integer) to authenticated;
