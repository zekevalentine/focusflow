-- Enable UUID
create extension if not exists "uuid-ossp";

-- Users: Supabase auth.users is the source of truth.
-- Optionally create a public profile table referencing auth.users.

create table if not exists public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  name text,
  country text,
  plan text default 'free',
  created_at timestamp with time zone default now()
);

-- Job applications
create table if not exists public.job_applications (
  id uuid primary key default uuid_generate_v4(),
  user_id uuid not null references auth.users(id) on delete cascade,
  company_name text not null,
  position_title text not null,
  status text not null check (status in ('wishlist','applied','interview','offer','rejected')),
  job_url text,
  resume_version text,
  cover_letter_text text,
  date_applied date,
  next_action_date date,
  notes text,
  ai_score int,
  created_at timestamp with time zone default now()
);

-- AI Logs
create table if not exists public.ai_logs (
  id uuid primary key default uuid_generate_v4(),
  user_id uuid not null references auth.users(id) on delete cascade,
  type text check (type in ('cover_letter','interview_prep','daily_focus')),
  input_data jsonb,
  output_text text,
  tokens_used int,
  created_at timestamp with time zone default now()
);

-- Planner
create table if not exists public.daily_plans (
  id uuid primary key default uuid_generate_v4(),
  user_id uuid not null references auth.users(id) on delete cascade,
  date date not null,
  tasks jsonb default '[]'::jsonb,
  ai_suggestion text,
  focus_score int,
  created_at timestamp with time zone default now(),
  unique (user_id, date)
);

-- Billing (simple mirror of Stripe state; adjust as needed)
create table if not exists public.subscriptions (
  id uuid primary key default uuid_generate_v4(),
  user_id uuid not null references auth.users(id) on delete cascade,
  stripe_customer_id text,
  stripe_subscription_id text,
  plan text default 'free',
  status text,
  renewal_date date,
  created_at timestamp with time zone default now()
);

-- Policies (RLS)
alter table public.profiles enable row level security;
alter table public.job_applications enable row level security;
alter table public.ai_logs enable row level security;
alter table public.daily_plans enable row level security;
alter table public.subscriptions enable row level security;

-- Authenticated users can CRUD their own rows
create policy "profiles_select_own" on public.profiles for select using (auth.uid() = id);
create policy "profiles_insert_own" on public.profiles for insert with check (auth.uid() = id);
create policy "profiles_update_own" on public.profiles for update using (auth.uid() = id);

create policy "jobs_rw_own" on public.job_applications
  for all using (auth.uid() = user_id) with check (auth.uid() = user_id);

create policy "logs_rw_own" on public.ai_logs
  for all using (auth.uid() = user_id) with check (auth.uid() = user_id);

create policy "plans_rw_own" on public.daily_plans
  for all using (auth.uid() = user_id) with check (auth.uid() = user_id);

create policy "subs_rw_own" on public.subscriptions
  for all using (auth.uid() = user_id) with check (auth.uid() = user_id);

-- Helpful index
create index if not exists idx_jobs_user_status on public.job_applications(user_id, status);
