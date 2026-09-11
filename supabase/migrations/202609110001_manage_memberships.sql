create or replace function public.update_organization_member_role(
  p_organization_id uuid,
  p_user_id uuid,
  p_role public.organization_role
)
returns void
language plpgsql
security definer
set search_path = ''
as $$
declare
  actor_id uuid := auth.uid();
  target_membership public.organization_memberships%rowtype;
begin
  if actor_id is null then
    raise exception 'Authentication required.' using errcode = '42501';
  end if;

  if not private.has_organization_role(
    p_organization_id,
    array['owner', 'admin']::public.organization_role[]
  ) then
    raise exception 'Not authorized to manage organization members.' using errcode = '42501';
  end if;

  if p_role = 'owner'::public.organization_role then
    raise exception 'Owner role cannot be assigned.' using errcode = '22023';
  end if;

  select membership.*
  into target_membership
  from public.organization_memberships as membership
  where membership.organization_id = p_organization_id
    and membership.user_id = p_user_id
  for update;

  if not found then
    raise exception 'Membership not found.' using errcode = 'P0002';
  end if;

  if target_membership.role = 'owner'::public.organization_role then
    raise exception 'Owner membership cannot be changed.' using errcode = '42501';
  end if;

  update public.organization_memberships as membership
  set role = p_role,
      updated_at = now()
  where membership.organization_id = p_organization_id
    and membership.user_id = p_user_id;
end;
$$;

create or replace function public.remove_organization_member(
  p_organization_id uuid,
  p_user_id uuid
)
returns void
language plpgsql
security definer
set search_path = ''
as $$
declare
  actor_id uuid := auth.uid();
  target_membership public.organization_memberships%rowtype;
begin
  if actor_id is null then
    raise exception 'Authentication required.' using errcode = '42501';
  end if;

  if not private.has_organization_role(
    p_organization_id,
    array['owner', 'admin']::public.organization_role[]
  ) then
    raise exception 'Not authorized to manage organization members.' using errcode = '42501';
  end if;

  select membership.*
  into target_membership
  from public.organization_memberships as membership
  where membership.organization_id = p_organization_id
    and membership.user_id = p_user_id
  for update;

  if not found then
    raise exception 'Membership not found.' using errcode = 'P0002';
  end if;

  if target_membership.role = 'owner'::public.organization_role then
    raise exception 'Owner membership cannot be removed.' using errcode = '42501';
  end if;

  delete from public.organization_memberships as membership
  where membership.organization_id = p_organization_id
    and membership.user_id = p_user_id;
end;
$$;

revoke all on function public.update_organization_member_role(uuid, uuid, public.organization_role) from public;
revoke all on function public.update_organization_member_role(uuid, uuid, public.organization_role) from anon;
grant execute on function public.update_organization_member_role(uuid, uuid, public.organization_role) to authenticated;

revoke all on function public.remove_organization_member(uuid, uuid) from public;
revoke all on function public.remove_organization_member(uuid, uuid) from anon;
grant execute on function public.remove_organization_member(uuid, uuid) to authenticated;
