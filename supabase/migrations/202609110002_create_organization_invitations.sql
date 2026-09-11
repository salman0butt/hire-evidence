create table public.organization_invitations (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations(id) on delete cascade,
  email text not null check (char_length(btrim(email)) between 3 and 254),
  role public.organization_role not null check (role <> 'owner'::public.organization_role),
  invited_by uuid not null references auth.users(id) on delete restrict,
  token_hash text not null unique check (char_length(token_hash) = 64),
  expires_at timestamptz not null,
  accepted_at timestamptz null,
  revoked_at timestamptz null,
  created_at timestamptz not null default now()
);

create index organization_invitations_organization_id_idx
  on public.organization_invitations(organization_id);

alter table public.organization_invitations enable row level security;
grant select on table public.organization_invitations to authenticated;

create policy organization_invitations_select_admin
on public.organization_invitations
for select
to authenticated
using (
  private.has_organization_role(
    organization_id,
    array['owner', 'admin']::public.organization_role[]
  )
);

create or replace function public.create_organization_invitation(
  p_organization_id uuid,
  p_email text,
  p_role public.organization_role,
  p_token_hash text,
  p_expires_at timestamptz
)
returns uuid
language plpgsql
security definer
set search_path = ''
as $$
declare
  actor_id uuid := auth.uid();
  normalized_email text := lower(btrim(p_email));
  invitation_id uuid;
begin
  if actor_id is null then
    raise exception 'Authentication required.' using errcode = '42501';
  end if;

  if not private.has_organization_role(
    p_organization_id,
    array['owner', 'admin']::public.organization_role[]
  ) then
    raise exception 'Not authorized to invite organization members.' using errcode = '42501';
  end if;

  if p_role = 'owner'::public.organization_role then
    raise exception 'Owner role cannot be invited.' using errcode = '22023';
  end if;

  if normalized_email = ''
     or char_length(normalized_email) > 254
     or position('@' in normalized_email) <= 1 then
    raise exception 'A valid invitation email is required.' using errcode = '22023';
  end if;

  if p_token_hash is null or char_length(p_token_hash) <> 64 then
    raise exception 'Invalid invitation token hash.' using errcode = '22023';
  end if;

  if p_expires_at <= now() or p_expires_at > now() + interval '7 days' then
    raise exception 'Invitation expiry is invalid.' using errcode = '22023';
  end if;

  insert into public.organization_invitations (
    organization_id,
    email,
    role,
    invited_by,
    token_hash,
    expires_at
  )
  values (
    p_organization_id,
    normalized_email,
    p_role,
    actor_id,
    p_token_hash,
    p_expires_at
  )
  returning id into invitation_id;

  return invitation_id;
end;
$$;

create or replace function public.revoke_organization_invitation(
  p_organization_id uuid,
  p_invitation_id uuid
)
returns void
language plpgsql
security definer
set search_path = ''
as $$
declare
  actor_id uuid := auth.uid();
  invitation public.organization_invitations%rowtype;
begin
  if actor_id is null then
    raise exception 'Authentication required.' using errcode = '42501';
  end if;

  if not private.has_organization_role(
    p_organization_id,
    array['owner', 'admin']::public.organization_role[]
  ) then
    raise exception 'Not authorized to revoke organization invitations.' using errcode = '42501';
  end if;

  select candidate.*
  into invitation
  from public.organization_invitations as candidate
  where candidate.id = p_invitation_id
    and candidate.organization_id = p_organization_id
  for update;

  if not found
     or invitation.accepted_at is not null
     or invitation.revoked_at is not null
     or invitation.expires_at <= now() then
    raise exception 'Invitation is invalid or no longer available.' using errcode = 'P0002';
  end if;

  update public.organization_invitations as candidate
  set revoked_at = now()
  where candidate.id = p_invitation_id
    and candidate.organization_id = p_organization_id;
end;
$$;

create or replace function public.accept_organization_invitation(
  p_token_hash text
)
returns uuid
language plpgsql
security definer
set search_path = ''
as $$
declare
  actor_id uuid := auth.uid();
  actor_email text;
  invitation public.organization_invitations%rowtype;
begin
  if actor_id is null then
    raise exception 'Authentication required.' using errcode = '42501';
  end if;

  select lower(users.email)
  into actor_email
  from auth.users as users
  where users.id = actor_id
    and users.email_confirmed_at is not null;

  if actor_email is null then
    raise exception 'A verified email is required.' using errcode = '42501';
  end if;

  select candidate.*
  into invitation
  from public.organization_invitations as candidate
  where candidate.token_hash = p_token_hash
  for update;

  if not found
     or invitation.accepted_at is not null
     or invitation.revoked_at is not null
     or invitation.expires_at <= now() then
    raise exception 'Invitation is invalid or no longer available.' using errcode = 'P0002';
  end if;

  if lower(invitation.email) <> actor_email then
    raise exception 'Invitation is invalid or no longer available.' using errcode = '42501';
  end if;

  insert into public.organization_memberships (
    organization_id,
    user_id,
    role
  )
  values (
    invitation.organization_id,
    actor_id,
    invitation.role
  )
  on conflict (organization_id, user_id) do nothing;

  update public.organization_invitations as candidate
  set accepted_at = now()
  where candidate.id = invitation.id;

  return invitation.organization_id;
end;
$$;

revoke all on function public.create_organization_invitation(uuid, text, public.organization_role, text, timestamptz) from public;
revoke all on function public.create_organization_invitation(uuid, text, public.organization_role, text, timestamptz) from anon;
grant execute on function public.create_organization_invitation(uuid, text, public.organization_role, text, timestamptz) to authenticated;

revoke all on function public.revoke_organization_invitation(uuid, uuid) from public;
revoke all on function public.revoke_organization_invitation(uuid, uuid) from anon;
grant execute on function public.revoke_organization_invitation(uuid, uuid) to authenticated;

revoke all on function public.accept_organization_invitation(text) from public;
revoke all on function public.accept_organization_invitation(text) from anon;
grant execute on function public.accept_organization_invitation(text) to authenticated;
