create table if not exists activity_log (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz default now(),
  user_name text,
  action text not null,
  entity_type text,
  entity_name text,
  details text
);
alter table activity_log enable row level security;
create policy "Anon insert log" on activity_log for insert with check (true);
create policy "Anon select log" on activity_log for select using (true);
