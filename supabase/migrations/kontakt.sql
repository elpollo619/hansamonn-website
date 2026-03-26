create table if not exists kontakt_anfragen (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz default now(),
  name text not null,
  email text not null,
  telefon text,
  betreff text,
  nachricht text not null,
  status text default 'neu'
);
alter table kontakt_anfragen enable row level security;
create policy "Anon insert kontakt" on kontakt_anfragen for insert with check (true);
create policy "Anon select kontakt" on kontakt_anfragen for select using (true);
