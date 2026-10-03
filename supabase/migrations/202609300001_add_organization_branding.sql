-- M11.4 safe organization branding.
-- Branding remains inert data: no arbitrary CSS, HTML, or script is stored here.
alter table public.organizations
  add column logo_url text null
    check (
      logo_url is null
      or (
        char_length(logo_url) <= 2048
        and logo_url ~* '^https://[^[:space:]]+$'
      )
    ),
  add column accent_color text null
    check (
      accent_color is null
      or accent_color ~ '^#[0-9A-Fa-f]{6}$'
    ),
  add column welcome_text text null
    check (
      welcome_text is null
      or char_length(welcome_text) <= 500
    );

-- Reuse the existing organizations_update_admin RLS policy; extending the
-- column grant does not broaden which organization rows may be updated.
grant update (logo_url, accent_color, welcome_text)
  on table public.organizations to authenticated;
