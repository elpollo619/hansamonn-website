create table if not exists termine (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz default now(),
  property_id text,
  property_name text,
  name text not null,
  email text not null,
  telefon text,
  wunschtermin date not null,
  uhrzeit text,
  art text default 'Besichtigung',
  nachricht text,
  status text default 'neu'
);
alter table termine enable row level security;
create policy "Anon insert termine" on termine for insert with check (true);
create policy "Anon select termine" on termine for select using (true);
create policy "Anon update termine" on termine for update using (true);
