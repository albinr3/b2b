DO $$
BEGIN
  IF to_regclass('public."Product"') IS NULL THEN
    RETURN;
  END IF;

  IF NOT EXISTS (
    SELECT 1
    FROM information_schema.columns
    WHERE table_schema = 'public'
      AND table_name = 'Product'
      AND column_name = 'slug'
  ) THEN
    ALTER TABLE "Product" ADD COLUMN "slug" TEXT;
  END IF;

  UPDATE "Product"
  SET "slug" = lower(
    regexp_replace(
      regexp_replace(coalesce("descripcion", "referencia", "sku"), '[^a-zA-Z0-9]+', '-', 'g'),
      '(^-|-$)',
      '',
      'g'
    )
  )
  WHERE "slug" IS NULL;

  IF EXISTS (
    SELECT 1
    FROM information_schema.columns
    WHERE table_schema = 'public'
      AND table_name = 'Product'
      AND column_name = 'slug'
      AND is_nullable = 'YES'
  ) THEN
    ALTER TABLE "Product" ALTER COLUMN "slug" SET NOT NULL;
  END IF;

  IF NOT EXISTS (
    SELECT 1
    FROM pg_indexes
    WHERE schemaname = 'public'
      AND tablename = 'Product'
      AND indexname = 'Product_slug_key'
  ) THEN
    CREATE UNIQUE INDEX "Product_slug_key" ON "Product"("slug");
  END IF;

  IF NOT EXISTS (
    SELECT 1
    FROM pg_indexes
    WHERE schemaname = 'public'
      AND tablename = 'Product'
      AND indexname = 'Product_categoryId_idx'
  ) THEN
    CREATE INDEX "Product_categoryId_idx" ON "Product"("categoryId");
  END IF;
END $$;
