create table if not exists blog_posts (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz default now(),
  updated_at timestamptz default now(),
  title text not null,
  slug text unique not null,
  excerpt text,
  content text,
  cover_image text,
  category text default 'Allgemein',
  published boolean default false,
  author text default 'Hans Amonn AG',
  published_at timestamptz default now()
);
alter table blog_posts enable row level security;
create policy "Public read published" on blog_posts for select using (published = true);
create policy "Anon insert" on blog_posts for insert with check (true);
create policy "Anon update" on blog_posts for update using (true);
create policy "Anon delete" on blog_posts for delete using (true);
