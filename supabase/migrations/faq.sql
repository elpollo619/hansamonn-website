create table if not exists faqs (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz default now(),
  question text not null,
  answer text not null,
  category text default 'Allgemein',
  sort_order integer default 0,
  visible boolean default true
);
alter table faqs enable row level security;
create policy "Public read faqs" on faqs for select using (visible = true);
create policy "Anon all faqs" on faqs for all using (true) with check (true);
