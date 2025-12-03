-- Enable UUID extension
create extension if not exists "uuid-ossp";

-- USERS (Managed by Supabase Auth usually, but we'll create a public profiles table that references it)
-- We assume Supabase Auth handles the 'auth.users' table. We'll create a 'public.users' or just 'public.profiles' to extend it.
-- The spec asks for a 'users' table, but in Supabase 'auth.users' is separate. 
-- Best practice: Use 'profiles' linked to 'auth.users'.
-- However, to match the spec's "users" table request for custom fields like role, we can put that in profiles or a wrapper.
-- Let's stick to the spec's table names where possible but mapped to Supabase patterns.

-- PROFILES (extends auth.users)
create table public.profiles (
  id uuid references auth.users on delete cascade not null primary key,
  email text, -- optional, can be synced from auth
  name text,
  role text default 'user' check (role in ('user', 'admin', 'org_admin')),
  skills jsonb default '[]'::jsonb, -- [{name, level}]
  resume_url text,
  location text,
  preferred_job_categories text[],
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- JOB POSTS
create table public.job_posts (
  id uuid default uuid_generate_v4() primary key,
  user_id uuid references public.profiles(id) on delete set null, -- optional uploader
  raw_text text not null,
  parsed_data jsonb, -- structured data if needed immediately
  category text, -- IT, Marketing, etc.
  status text default 'pending' check (status in ('pending', 'processing', 'complete', 'failed')),
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- ANALYSES
create table public.analyses (
  id uuid default uuid_generate_v4() primary key,
  job_post_id uuid references public.job_posts(id) on delete cascade not null,
  user_id uuid references public.profiles(id) on delete cascade not null, -- requested_by
  result jsonb, -- {skills, gaps, roadmap, cv_highlight}
  model_version text,
  cost_usd numeric(10, 5), -- e.g. 0.00123
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- MODULES (Configuration for job categories)
create table public.modules (
  id uuid default uuid_generate_v4() primary key,
  category_key text unique not null,
  prompt_snippets jsonb,
  skill_keywords jsonb,
  cv_templates jsonb,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- CV VERSIONS
create table public.cv_versions (
  id uuid default uuid_generate_v4() primary key,
  user_id uuid references public.profiles(id) on delete cascade not null,
  job_post_id uuid references public.job_posts(id) on delete set null,
  cv_text text, -- or JSON if structured
  generated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- PLANS
create table public.plans (
  id uuid default uuid_generate_v4() primary key,
  name text not null,
  price_cents integer not null,
  features jsonb
);

-- SUBSCRIPTIONS
create table public.subscriptions (
  id uuid default uuid_generate_v4() primary key,
  user_id uuid references public.profiles(id) on delete cascade not null,
  stripe_subscription_id text,
  status text,
  current_period_end timestamp with time zone
);

-- RLS POLICIES (Stubs)
alter table public.profiles enable row level security;
alter table public.job_posts enable row level security;
alter table public.analyses enable row level security;
alter table public.cv_versions enable row level security;

-- Profiles: Users can view/edit their own profile
create policy "Users can view own profile" on public.profiles for select using (auth.uid() = id);
create policy "Users can update own profile" on public.profiles for update using (auth.uid() = id);

-- Job Posts: Users can view their own posts
create policy "Users can view own job posts" on public.job_posts for select using (auth.uid() = user_id);
create policy "Users can insert job posts" on public.job_posts for insert with check (auth.uid() = user_id);

-- Analyses: Users can view their own analyses
create policy "Users can view own analyses" on public.analyses for select using (auth.uid() = user_id);

-- CV Versions: Users can view their own CVs
create policy "Users can view own cv versions" on public.cv_versions for select using (auth.uid() = user_id);

-- Functions to handle new user signup (trigger)
create or replace function public.handle_new_user() 
returns trigger as $$
begin
  insert into public.profiles (id, email, name)
  values (new.id, new.email, new.raw_user_meta_data->>'full_name');
  return new;
end;
$$ language plpgsql security definer;

-- Trigger for new user
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();
