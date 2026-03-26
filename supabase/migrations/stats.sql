create table if not exists property_views (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz default now(),
  property_id text not null,
  property_name text
);
alter table property_views enable row level security;
create policy "Anon insert views" on property_views for insert with check (true);
create policy "Anon select views" on property_views for select using (true);
