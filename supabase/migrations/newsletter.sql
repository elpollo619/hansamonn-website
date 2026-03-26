create table if not exists newsletter_subscribers (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz default now(),
  email text unique not null,
  confirmed boolean default false
);
alter table newsletter_subscribers enable row level security;
create policy "Anon insert newsletter" on newsletter_subscribers for insert with check (true);
