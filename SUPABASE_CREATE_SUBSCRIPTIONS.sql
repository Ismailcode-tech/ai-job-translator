-- It seems the table didn't exist yet!
-- Run this entire block to create it with the new column included.

create table public.subscriptions (
  id uuid default uuid_generate_v4() primary key,
  user_id uuid references auth.users on delete cascade not null,
  stripe_subscription_id text,
  status text,
  current_period_end timestamp with time zone,
  plan_id text -- This is the new column tracking 'starter' vs 'pro'
);

-- Quick policy to let users read their own subscription status
alter table public.subscriptions enable row level security;
create policy "Users can view own subscription" 
  on public.subscriptions 
  for select 
  using (auth.uid() = user_id);
