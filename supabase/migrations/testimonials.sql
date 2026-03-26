create table if not exists testimonials (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz default now(),
  name text not null,
  role text default 'Kunde',
  text text not null,
  rating integer default 5,
  property text,
  visible boolean default true,
  sort_order integer default 0
);
alter table testimonials enable row level security;
create policy "Public read visible" on testimonials for select using (visible = true);
create policy "Anon all" on testimonials for all using (true) with check (true);
