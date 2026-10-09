create table public.support_access_grants (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations(id) on delete restrict,
  actor_user_id uuid not null references auth.users(id) on delete restrict,
  scope text not null,
  reason text not null,
  granted_at timestamptz not null,
  expires_at timestamptz not null,
  revoked_at timestamptz,
  created_at timestamptz not null default now()
);

alter table public.support_access_grants enable row level security;

revoke all on table public.support_access_grants from anon;
revoke all on table public.support_access_grants from authenticated;
