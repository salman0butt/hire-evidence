create table public.organization_subscriptions (
  organization_id uuid primary key references public.organizations(id) on delete cascade,
  plan_id text not null check (plan_id in ('starter', 'growth')),
  status text not null check (
    status in ('incomplete', 'trialing', 'active', 'past_due', 'canceled', 'unpaid')
  ),
  stripe_customer_id text unique,
  stripe_subscription_id text unique,
  current_period_start timestamptz not null,
  current_period_end timestamptz not null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  check (current_period_end > current_period_start)
);

alter table public.organization_subscriptions enable row level security;

grant select on table public.organization_subscriptions to authenticated;

create policy organization_subscriptions_select_member
on public.organization_subscriptions
for select
to authenticated
using (private.is_organization_member(organization_id));
