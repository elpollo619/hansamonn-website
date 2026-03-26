-- Run this in Supabase Dashboard → SQL Editor
-- https://supabase.com/dashboard/project/teioztcidolgyqlwzlrb/sql

-- ── Mietanfragen status column (add if missing) ──────────────────────────────
alter table if exists mietanfragen
  add column if not exists status text default 'neu';

-- ── Casa Reto Anfragen ───────────────────────────────────────────────────────
create table if not exists casa_reto_anfragen (
  id           uuid primary key default gen_random_uuid(),
  created_at   timestamptz default now(),
  ankunft      date not null,
  abreise      date not null,
  gaeste       integer not null default 1,
  vorname      text not null,
  nachname     text not null,
  email        text not null,
  telefon      text,
  nachricht    text,
  status       text default 'neu'
);
alter table casa_reto_anfragen enable row level security;
create policy if not exists "Anon insert casa_reto" on casa_reto_anfragen for insert with check (true);
create policy if not exists "Anon select casa_reto" on casa_reto_anfragen for select using (true);
create policy if not exists "Anon update casa_reto" on casa_reto_anfragen for update using (true);
create policy if not exists "Anon delete casa_reto" on casa_reto_anfragen for delete using (true);

-- ── Blog Posts ───────────────────────────────────────────────────────────────
create table if not exists blog_posts (
  id           uuid primary key default gen_random_uuid(),
  created_at   timestamptz default now(),
  updated_at   timestamptz default now(),
  title        text not null,
  slug         text unique not null,
  excerpt      text,
  content      text,
  cover_image  text,
  category     text default 'Allgemein',
  published    boolean default false,
  author       text default 'Hans Amonn AG',
  published_at timestamptz default now()
);
alter table blog_posts enable row level security;
create policy if not exists "Public read published posts" on blog_posts for select using (published = true);
create policy if not exists "Anon insert posts" on blog_posts for insert with check (true);
create policy if not exists "Anon update posts" on blog_posts for update using (true);
create policy if not exists "Anon delete posts" on blog_posts for delete using (true);

-- ── Testimonials ─────────────────────────────────────────────────────────────
create table if not exists testimonials (
  id           uuid primary key default gen_random_uuid(),
  created_at   timestamptz default now(),
  name         text not null,
  role         text default 'Kunde',
  text         text not null,
  rating       integer default 5,
  property     text,
  visible      boolean default true,
  sort_order   integer default 0
);
alter table testimonials enable row level security;
create policy if not exists "Public read visible testimonials" on testimonials for select using (visible = true);
create policy if not exists "Anon all testimonials" on testimonials for all using (true) with check (true);

-- ── Property Documents ────────────────────────────────────────────────────────
create table if not exists property_documents (
  id           uuid primary key default gen_random_uuid(),
  created_at   timestamptz default now(),
  property_id  text not null,
  name         text not null,
  file_path    text not null,
  file_size    integer,
  file_type    text,
  sort_order   integer default 0
);
alter table property_documents enable row level security;
create policy if not exists "Public read docs" on property_documents for select using (true);
create policy if not exists "Anon insert docs" on property_documents for insert with check (true);
create policy if not exists "Anon delete docs" on property_documents for delete using (true);
