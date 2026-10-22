-- 003_close_public_access.sql
--
-- Closes read/write access that the public anon key still has. 002_tighten_rls.sql
-- tried to drop these policies but used names that do not match the ones actually
-- created in kontakt.sql, termine.sql and 001_tables.sql.
--
-- Run in the Supabase SQL editor. Forms keep working (anon INSERT stays).
--
-- PART A: urgent, personal data. After this the admin panel can no longer list
-- contact requests, appointments and Casa Reto requests with the anon key; the
-- notification e-mails still arrive. Part C gives the admin access back once it
-- signs in with Supabase Auth.

DROP POLICY IF EXISTS "Anon select kontakt"      ON kontakt_anfragen;
DROP POLICY IF EXISTS "Anon select termine"      ON termine;
DROP POLICY IF EXISTS "Anon update termine"      ON termine;
DROP POLICY IF EXISTS "Anon select casa_reto"    ON casa_reto_anfragen;
DROP POLICY IF EXISTS "Anon update casa_reto"    ON casa_reto_anfragen;
DROP POLICY IF EXISTS "Anon delete casa_reto"    ON casa_reto_anfragen;

-- PART B: public content that anyone can currently change or delete.
-- Run together with Part C (otherwise the admin can no longer edit these).

-- DROP POLICY IF EXISTS "Anon insert posts"      ON blog_posts;
-- DROP POLICY IF EXISTS "Anon update posts"      ON blog_posts;
-- DROP POLICY IF EXISTS "Anon delete posts"      ON blog_posts;
-- DROP POLICY IF EXISTS "Anon insert"            ON blog_posts;
-- DROP POLICY IF EXISTS "Anon update"            ON blog_posts;
-- DROP POLICY IF EXISTS "Anon delete"            ON blog_posts;
-- DROP POLICY IF EXISTS "Anon all testimonials"  ON testimonials;
-- DROP POLICY IF EXISTS "Anon all"               ON testimonials;
-- DROP POLICY IF EXISTS "Anon all faqs"          ON faqs;
-- DROP POLICY IF EXISTS "Anon insert docs"       ON property_documents;
-- DROP POLICY IF EXISTS "Anon delete docs"       ON property_documents;
-- DROP POLICY IF EXISTS "Anon select log"        ON activity_log;

-- PART C: staff access for signed-in admin users (Supabase Auth). Create the admin
-- accounts under Authentication > Users first; the site's admin login has to be
-- switched to supabase.auth.signInWithPassword before this is useful.

-- CREATE POLICY "staff all kontakt"    ON kontakt_anfragen   FOR ALL TO authenticated USING (true) WITH CHECK (true);
-- CREATE POLICY "staff all termine"    ON termine            FOR ALL TO authenticated USING (true) WITH CHECK (true);
-- CREATE POLICY "staff all casa_reto"  ON casa_reto_anfragen FOR ALL TO authenticated USING (true) WITH CHECK (true);
-- CREATE POLICY "staff all miet"       ON mietanfragen       FOR ALL TO authenticated USING (true) WITH CHECK (true);
-- CREATE POLICY "staff all posts"      ON blog_posts         FOR ALL TO authenticated USING (true) WITH CHECK (true);
-- CREATE POLICY "staff all testim"     ON testimonials       FOR ALL TO authenticated USING (true) WITH CHECK (true);
-- CREATE POLICY "staff all faqs"       ON faqs               FOR ALL TO authenticated USING (true) WITH CHECK (true);
-- CREATE POLICY "staff all docs"       ON property_documents FOR ALL TO authenticated USING (true) WITH CHECK (true);
-- CREATE POLICY "staff read log"       ON activity_log       FOR SELECT TO authenticated USING (true);

-- Newsletter table (the site gets 404 today, so every sign-up fails):
-- CREATE TABLE IF NOT EXISTS newsletter_subscribers (
--   id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
--   email text UNIQUE NOT NULL,
--   consent_at timestamptz NOT NULL DEFAULT now(),
--   consent_text_version int NOT NULL DEFAULT 1,
--   confirmed boolean NOT NULL DEFAULT false,
--   created_at timestamptz NOT NULL DEFAULT now()
-- );
-- ALTER TABLE newsletter_subscribers ENABLE ROW LEVEL SECURITY;
-- CREATE POLICY "Anon insert newsletter" ON newsletter_subscribers FOR INSERT WITH CHECK (true);
