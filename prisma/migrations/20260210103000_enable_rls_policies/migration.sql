DO $$
DECLARE
  read_roles TEXT;
BEGIN
  IF EXISTS (SELECT 1 FROM pg_roles WHERE rolname = 'anon')
    AND EXISTS (SELECT 1 FROM pg_roles WHERE rolname = 'authenticated') THEN
    read_roles := 'anon, authenticated';
  ELSE
    read_roles := 'PUBLIC';
  END IF;

  IF to_regclass('public."Product"') IS NOT NULL THEN
    ALTER TABLE public."Product" ENABLE ROW LEVEL SECURITY;
    DROP POLICY IF EXISTS "product_public_read" ON public."Product";
    EXECUTE format(
      'CREATE POLICY "product_public_read"
         ON public."Product"
         FOR SELECT
         TO %s
         USING (true)',
      read_roles
    );
  END IF;

  IF to_regclass('public."Category"') IS NOT NULL THEN
    ALTER TABLE public."Category" ENABLE ROW LEVEL SECURITY;
    DROP POLICY IF EXISTS "category_public_read" ON public."Category";
    EXECUTE format(
      'CREATE POLICY "category_public_read"
         ON public."Category"
         FOR SELECT
         TO %s
         USING (true)',
      read_roles
    );
  END IF;

  IF to_regclass('public."Distributor"') IS NOT NULL THEN
    ALTER TABLE public."Distributor" ENABLE ROW LEVEL SECURITY;
    DROP POLICY IF EXISTS "distributor_public_read" ON public."Distributor";
    EXECUTE format(
      'CREATE POLICY "distributor_public_read"
         ON public."Distributor"
         FOR SELECT
         TO %s
         USING (true)',
      read_roles
    );
  END IF;

  IF to_regclass('public."AdminUser"') IS NOT NULL THEN
    ALTER TABLE public."AdminUser" ENABLE ROW LEVEL SECURITY;
  END IF;

  IF to_regclass('public._prisma_migrations') IS NOT NULL THEN
    ALTER TABLE public._prisma_migrations ENABLE ROW LEVEL SECURITY;
  END IF;
END $$;
