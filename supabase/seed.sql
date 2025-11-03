
-- FocusFlow Seed SQL
-- This script will attach demo data to the most recently created auth users in your project.
-- The latest auth user becomes USER1; if there is a second user available it becomes USER2.
-- Make sure you have created at least one auth user (e.g. sign up via your app) before running.

do $$
declare
  user1 uuid;
  user2 uuid;
begin
  select id into user1 from auth.users order by created_at desc limit 1;
  select id into user2 from auth.users order by created_at desc offset 1 limit 1;

  if user1 is null then
    raise exception 'No auth.users found. Create at least one user before running seed.sql.';
  end if;

  -- Profiles
  insert into public.profiles (id, name, country, plan, created_at)
  values
    (user1, 'Demo User One', 'NO', 'pro', now())
  on conflict (id) do update set plan = excluded.plan;

  if user2 is not null then
    insert into public.profiles (id, name, country, plan, created_at)
    values
      (user2, 'Demo User Two', 'NO', 'free', now())
    on conflict (id) do update set plan = excluded.plan;
  end if;

  -- Job applications for USER1
  insert into public.job_applications (user_id, company_name, position_title, status, job_url, date_applied, notes, ai_score)
  values
    (user1, 'Telenor', 'Frontend Developer', 'wishlist', 'https://careers.example/telenor-fe', null, 'Looks interesting', 72),
    (user1, 'Kahoot!', 'Product Designer', 'applied', 'https://jobs.example/kahoot-design', current_date - 7, 'Submitted tailored cover letter', 68),
    (user1, 'Vipps', 'Full-Stack Engineer', 'interview', 'https://vipps.example/fullstack', current_date - 10, 'Phone screen done; next step: tech interview', 74),
    (user1, 'FINN.no', 'React Engineer', 'rejected', 'https://finn.example/react', current_date - 20, 'Rejected after resume screen', 55),
    (user1, 'Oda', 'Mobile Engineer', 'offer', 'https://oda.example/mobile', current_date - 25, 'Offer pending discussion', 81);

  -- More scattered across dates
  insert into public.job_applications (user_id, company_name, position_title, status, job_url, date_applied, notes, ai_score)
  select user1, x.company, x.role, x.status, 'https://jobs.example/'||x.company, current_date - (5 + x.n), x.note, 60 + (x.n%20)
  from (values
    (1, 'Opera', 'Frontend Engineer', 'applied', 'Ref from meetup'),
    (2, 'Schibsted', 'UI Engineer', 'applied', 'Good culture fit'),
    (3, 'NRK', 'Web Developer', 'interview', 'Panel next week'),
    (4, 'Aize', 'Full-Stack', 'wishlist', 'Requires TypeScript'),
    (5, 'DNB', 'Platform Engineer', 'applied', 'Banking exp helpful')
  ) as x(n, company, role, status, note);

  -- Daily focus plan for today
  insert into public.daily_plans (user_id, date, tasks, ai_suggestion, focus_score)
  values
  (user1, current_date, '[{"title":"Apply to 2 roles","priority":1},{"title":"Reach out to 1 hiring manager","priority":2},{"title":"Practice 30m system design","priority":3}]'::jsonb,
  'Focus: 2 targeted applications, 1 warm intro, 30m interview prep.',
  null)
  on conflict (user_id, date) do nothing;

  -- AI logs
  insert into public.ai_logs (user_id, type, input_data, output_text, tokens_used)
  values
  (user1, 'cover_letter', '{"company":"Kahoot!","role":"Product Designer"}'::jsonb, 'Tailored cover letter draft...', 1200),
  (user1, 'interview_prep', '{"role":"Frontend Developer"}'::jsonb, '8 targeted questions + guidance...', 900);

  -- Subscription mirror
  insert into public.subscriptions (user_id, plan, status, renewal_date, created_at)
  values (user1, 'pro', 'active', current_date + 20, now())
  on conflict do nothing;
end;
$$ language plpgsql;

-- Done. The data now follows your most recent auth users automatically.
