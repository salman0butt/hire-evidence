begin;

select plan(11);

select has_column('public', 'organizations', 'logo_url', 'organization branding stores a bounded logo URL');
select has_column('public', 'organizations', 'accent_color', 'organization branding stores a validated accent color');
select has_column('public', 'organizations', 'welcome_text', 'organization branding stores bounded welcome text');

insert into auth.users (id,email,aud,role) values
  ('00000000-0000-0000-0000-000000000701','branding-owner@example.test','authenticated','authenticated'),
  ('00000000-0000-0000-0000-000000000702','branding-reviewer@example.test','authenticated','authenticated');
insert into public.organizations (id,name,created_by) values
  ('00000000-0000-0000-0000-000000000710','Branding Org A','00000000-0000-0000-0000-000000000701'),
  ('00000000-0000-0000-0000-000000000720','Branding Org B','00000000-0000-0000-0000-000000000701');
insert into public.organization_memberships (organization_id,user_id,role) values
  ('00000000-0000-0000-0000-000000000710','00000000-0000-0000-0000-000000000701','owner'::public.organization_role),
  ('00000000-0000-0000-0000-000000000710','00000000-0000-0000-0000-000000000702','reviewer'::public.organization_role);

set local role authenticated;
select set_config('request.jwt.claim.sub','00000000-0000-0000-0000-000000000702',true);
update public.organizations
set logo_url='https://cdn.example.test/reviewer.svg'
where id='00000000-0000-0000-0000-000000000710'::uuid;
reset role;
select is(
  (select logo_url from public.organizations where id='00000000-0000-0000-0000-000000000710'::uuid),
  null::text,
  'reviewer cannot mutate organization branding'
);

set local role authenticated;
select set_config('request.jwt.claim.sub','00000000-0000-0000-0000-000000000701',true);
update public.organizations
set logo_url='https://cdn.example.test/logo.svg',
    accent_color='#1A2B3C',
    welcome_text='Welcome to your interview.'
where id='00000000-0000-0000-0000-000000000710'::uuid;
reset role;
select is(
  (select logo_url from public.organizations where id='00000000-0000-0000-0000-000000000710'::uuid),
  'https://cdn.example.test/logo.svg',
  'owner can persist a secure logo URL'
);
select is(
  (select accent_color from public.organizations where id='00000000-0000-0000-0000-000000000710'::uuid),
  '#1A2B3C',
  'owner can persist a validated accent color'
);
select is(
  (select welcome_text from public.organizations where id='00000000-0000-0000-0000-000000000710'::uuid),
  'Welcome to your interview.',
  'owner can persist bounded welcome text'
);

set local role authenticated;
select set_config('request.jwt.claim.sub','00000000-0000-0000-0000-000000000701',true);
update public.organizations
set accent_color='#FFFFFF'
where id='00000000-0000-0000-0000-000000000720'::uuid;
reset role;
select is(
  (select accent_color from public.organizations where id='00000000-0000-0000-0000-000000000720'::uuid),
  null::text,
  'owner cannot mutate branding in another tenant'
);

select throws_ok(
  $$update public.organizations set logo_url='http://cdn.example.test/logo.svg' where id='00000000-0000-0000-0000-000000000710'::uuid$$,
  '23514',
  null,
  'database rejects non-https organization logos'
);
select throws_ok(
  $$update public.organizations set accent_color='red' where id='00000000-0000-0000-0000-000000000710'::uuid$$,
  '23514',
  null,
  'database rejects executable or arbitrary accent styling'
);
select throws_ok(
  $$update public.organizations set welcome_text=repeat('x',501) where id='00000000-0000-0000-0000-000000000710'::uuid$$,
  '23514',
  null,
  'database rejects unbounded welcome text'
);

select * from finish();
rollback;
