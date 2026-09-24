create table public.audit_events (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations(id) on delete restrict,
  actor_user_id uuid not null references auth.users(id) on delete restrict,
  action text not null check (char_length(btrim(action)) between 1 and 120),
  resource_type text not null check (char_length(btrim(resource_type)) between 1 and 120),
  resource_id uuid not null,
  occurred_at timestamptz not null default now(),
  provenance_id uuid not null,
  metadata jsonb not null default '{}'::jsonb check (jsonb_typeof(metadata) = 'object'),
  created_at timestamptz not null default now()
);

create index audit_events_organization_occurred_at_idx
  on public.audit_events(organization_id, occurred_at desc);

alter table public.audit_events enable row level security;

grant select on table public.audit_events to authenticated;
revoke insert, update, delete on table public.audit_events from authenticated;

create policy audit_events_select_member
on public.audit_events
for select
to authenticated
using (private.is_organization_member(organization_id));
