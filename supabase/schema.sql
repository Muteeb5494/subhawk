-- SubHawk — subscriptions table + Row Level Security
-- Safe to re-run (idempotent). Paste into Supabase → SQL Editor → Run.

create extension if not exists "pgcrypto";

create table if not exists public.subscriptions (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users (id) on delete cascade,
  name text not null check (char_length(name) between 1 and 100),
  cost numeric(10, 2) not null check (cost >= 0),
  billing_cycle text not null check (billing_cycle in ('monthly', 'yearly', 'weekly')),
  next_billing_date date not null,
  type text not null check (type in ('paid', 'trial')),
  trial_end_date date,
  notes text check (notes is null or char_length(notes) <= 1000),
  -- Reminder de-duplication: the due date we last reminded about, and the
  -- highest reminder stage sent for it (0 none, 1 heads-up, 2 final).
  reminded_for date,
  reminder_stage smallint not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  -- A free trial must have a trial end date.
  constraint trial_requires_end_date check (
    type <> 'trial' or trial_end_date is not null
  )
);

-- For existing databases created before reminder de-duplication was added.
alter table public.subscriptions
  add column if not exists reminded_for date;
alter table public.subscriptions
  add column if not exists reminder_stage smallint not null default 0;

create index if not exists subscriptions_user_id_idx
  on public.subscriptions (user_id);

-- Keep updated_at current on every update.
create or replace function public.set_updated_at()
returns trigger language plpgsql as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists subscriptions_set_updated_at on public.subscriptions;
create trigger subscriptions_set_updated_at
  before update on public.subscriptions
  for each row execute function public.set_updated_at();

-- Row Level Security: a user can only ever see or change their own rows.
alter table public.subscriptions enable row level security;

drop policy if exists "Users can view their own subscriptions" on public.subscriptions;
create policy "Users can view their own subscriptions"
  on public.subscriptions for select
  using (auth.uid() = user_id);

drop policy if exists "Users can insert their own subscriptions" on public.subscriptions;
create policy "Users can insert their own subscriptions"
  on public.subscriptions for insert
  with check (auth.uid() = user_id);

drop policy if exists "Users can update their own subscriptions" on public.subscriptions;
create policy "Users can update their own subscriptions"
  on public.subscriptions for update
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

drop policy if exists "Users can delete their own subscriptions" on public.subscriptions;
create policy "Users can delete their own subscriptions"
  on public.subscriptions for delete
  using (auth.uid() = user_id);
