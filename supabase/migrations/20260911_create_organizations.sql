create type public.organization_role as enum (
  'owner',
  'admin',
  'recruiter',
  'hiring_manager',
  'reviewer'
);

create table public.organizations (
  id uuid primary key default gen_random_uuid(),
  name text not null check (char_length(btrim(name)) between 1 and 120),
  company_size text null check (
    company_size is null or char_length(company_size) <= 80
  ),
  hiring_use_case text null check (
    hiring_use_case is null or char_length(hiring_use_case) <= 500
  ),
  created_by uuid null references auth.users(id) on delete set null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.organization_memberships (
  organization_id uuid not null references public.organizations(id) on delete cascade,
  user_id uuid not null references auth.users(id) on delete cascade,
  role public.organization_role not null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  primary key (organization_id, user_id)
);

create index organization_memberships_user_id_idx
  on public.organization_memberships(user_id);

create schema if not exists private;
revoke all on schema private from public;
grant usage on schema private to authenticated;

create or replace function private.is_organization_member(target_organization_id uuid)
returns boolean
language sql
stable
security definer
set search_path = ''
as $$
  select exists (
    select 1
    from public.organization_memberships as membership
    where membership.organization_id = target_organization_id
      and membership.user_id = (select auth.uid())
  );
$$;

create or replace function private.has_organization_role(
  target_organization_id uuid,
  allowed_roles public.organization_role[]
)
returns boolean
language sql
stable
security definer
set search_path = ''
as $$
  select exists (
    select 1
    from public.organization_memberships as membership
    where membership.organization_id = target_organization_id
      and membership.user_id = (select auth.uid())
      and membership.role = any(allowed_roles)
  );
$$;

revoke all on function private.is_organization_member(uuid) from public;
revoke all on function private.has_organization_role(uuid, public.organization_role[]) from public;
grant execute on function private.is_organization_member(uuid) to authenticated;
grant execute on function private.has_organization_role(uuid, public.organization_role[]) to authenticated;

alter table public.organizations enable row level security;
alter table public.organization_memberships enable row level security;

grant select on table public.organizations to authenticated;
grant update (name, company_size, hiring_use_case, updated_at)
  on table public.organizations to authenticated;
grant select on table public.organization_memberships to authenticated;

create policy organizations_select_member
on public.organizations
for select
to authenticated
using (private.is_organization_member(id));

create policy organizations_update_admin
on public.organizations
for update
to authenticated
using (
  private.has_organization_role(
    id,
    array['owner', 'admin']::public.organization_role[]
  )
)
with check (
  private.has_organization_role(
    id,
    array['owner', 'admin']::public.organization_role[]
  )
);

create policy memberships_select_member
on public.organization_memberships
for select
to authenticated
using (private.is_organization_member(organization_id));

create or replace function public.create_organization(
  p_name text,
  p_company_size text default null,
  p_hiring_use_case text default null
)
returns uuid
language plpgsql
security definer
set search_path = ''
as $$
declare
  actor_id uuid := auth.uid();
  normalized_name text := btrim(p_name);
  normalized_company_size text := nullif(btrim(p_company_size), '');
  normalized_hiring_use_case text := nullif(btrim(p_hiring_use_case), '');
  organization_id uuid;
begin
  if actor_id is null then
    raise exception 'Authentication required.' using errcode = '42501';
  end if;

  if normalized_name is null
     or char_length(normalized_name) < 1
     or char_length(normalized_name) > 120 then
    raise exception 'Organization name must be between 1 and 120 characters.'
      using errcode = '22023';
  end if;

  if normalized_company_size is not null
     and char_length(normalized_company_size) > 80 then
    raise exception 'Company size must be 80 characters or fewer.'
      using errcode = '22023';
  end if;

  if normalized_hiring_use_case is not null
     and char_length(normalized_hiring_use_case) > 500 then
    raise exception 'Hiring use case must be 500 characters or fewer.'
      using errcode = '22023';
  end if;

  insert into public.organizations (
    name,
    company_size,
    hiring_use_case,
    created_by
  )
  values (
    normalized_name,
    normalized_company_size,
    normalized_hiring_use_case,
    actor_id
  )
  returning id into organization_id;

  insert into public.organization_memberships (
    organization_id,
    user_id,
    role
  )
  values (
    organization_id,
    actor_id,
    'owner'::public.organization_role
  );

  return organization_id;
end;
$$;

revoke all on function public.create_organization(text, text, text) from public;
revoke all on function public.create_organization(text, text, text) from anon;
grant execute on function public.create_organization(text, text, text) to authenticated;