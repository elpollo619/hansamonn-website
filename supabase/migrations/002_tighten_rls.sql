-- =============================================================================
-- Migration: 002_tighten_rls.sql
-- Purpose  : Tighten Row Level Security on public-facing form tables only.
--
-- Scope    : mietanfragen, kontakt_anfragen, termine
--            Anonymous users keep INSERT (form submission) but lose UPDATE/DELETE
--            (those are admin-only operations).
--
-- NOTE: blog_posts, testimonials, faqs are intentionally NOT restricted here
-- because the admin panel uses the anon key directly. Restricting writes on
-- those tables would break the admin panel. A service-role proxy would be
-- needed first before tightening those tables.
-- =============================================================================


-- ---------------------------------------------------------------------------
-- mietanfragen
-- Keep: anonymous INSERT (public rental application form)
-- Remove: anonymous UPDATE and DELETE (admin-only operations)
-- ---------------------------------------------------------------------------

DROP POLICY IF EXISTS "Allow anonymous update on mietanfragen"  ON mietanfragen;
DROP POLICY IF EXISTS "Allow anonymous delete on mietanfragen"  ON mietanfragen;
DROP POLICY IF EXISTS "anon update mietanfragen"                ON mietanfragen;
DROP POLICY IF EXISTS "anon delete mietanfragen"                ON mietanfragen;
DROP POLICY IF EXISTS "Enable update for anon"                  ON mietanfragen;
DROP POLICY IF EXISTS "Enable delete for anon"                  ON mietanfragen;

-- Ensure the INSERT policy exists (idempotent)
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies
    WHERE schemaname = 'public'
      AND tablename  = 'mietanfragen'
      AND cmd        = 'INSERT'
      AND roles::text LIKE '%anon%'
  ) THEN
    CREATE POLICY "anon_insert_mietanfragen"
      ON mietanfragen
      FOR INSERT
      TO anon
      WITH CHECK (true);
  END IF;
END $$;


-- ---------------------------------------------------------------------------
-- kontakt_anfragen
-- Keep: anonymous INSERT (public contact form)
-- Remove: anonymous UPDATE and DELETE
-- ---------------------------------------------------------------------------

DROP POLICY IF EXISTS "Allow anonymous update on kontakt_anfragen"  ON kontakt_anfragen;
DROP POLICY IF EXISTS "Allow anonymous delete on kontakt_anfragen"  ON kontakt_anfragen;
DROP POLICY IF EXISTS "anon update kontakt_anfragen"                ON kontakt_anfragen;
DROP POLICY IF EXISTS "anon delete kontakt_anfragen"                ON kontakt_anfragen;
DROP POLICY IF EXISTS "Enable update for anon"                      ON kontakt_anfragen;
DROP POLICY IF EXISTS "Enable delete for anon"                      ON kontakt_anfragen;

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies
    WHERE schemaname = 'public'
      AND tablename  = 'kontakt_anfragen'
      AND cmd        = 'INSERT'
      AND roles::text LIKE '%anon%'
  ) THEN
    CREATE POLICY "anon_insert_kontakt_anfragen"
      ON kontakt_anfragen
      FOR INSERT
      TO anon
      WITH CHECK (true);
  END IF;
END $$;


-- ---------------------------------------------------------------------------
-- termine
-- Keep: anonymous INSERT (public appointment booking form)
-- Remove: anonymous UPDATE and DELETE
-- ---------------------------------------------------------------------------

DROP POLICY IF EXISTS "Allow anonymous update on termine"  ON termine;
DROP POLICY IF EXISTS "Allow anonymous delete on termine"  ON termine;
DROP POLICY IF EXISTS "anon update termine"                ON termine;
DROP POLICY IF EXISTS "anon delete termine"                ON termine;
DROP POLICY IF EXISTS "Enable update for anon"             ON termine;
DROP POLICY IF EXISTS "Enable delete for anon"             ON termine;

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies
    WHERE schemaname = 'public'
      AND tablename  = 'termine'
      AND cmd        = 'INSERT'
      AND roles::text LIKE '%anon%'
  ) THEN
    CREATE POLICY "anon_insert_termine"
      ON termine
      FOR INSERT
      TO anon
      WITH CHECK (true);
  END IF;
END $$;
