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
      AND column_name = 'isActive'
  ) THEN
    ALTER TABLE "Product" ADD COLUMN "isActive" BOOLEAN NOT NULL DEFAULT true;
  END IF;

  IF NOT EXISTS (
    SELECT 1
    FROM information_schema.columns
    WHERE table_schema = 'public'
      AND table_name = 'Product'
      AND column_name = 'sourceUpdatedAt'
  ) THEN
    ALTER TABLE "Product" ADD COLUMN "sourceUpdatedAt" TIMESTAMP(3);
  END IF;

  IF NOT EXISTS (
    SELECT 1
    FROM information_schema.columns
    WHERE table_schema = 'public'
      AND table_name = 'Product'
      AND column_name = 'updatedAt'
  ) THEN
    ALTER TABLE "Product" ADD COLUMN "updatedAt" TIMESTAMP(3);
    UPDATE "Product" SET "updatedAt" = NOW() WHERE "updatedAt" IS NULL;
    ALTER TABLE "Product" ALTER COLUMN "updatedAt" SET NOT NULL;
  END IF;

  -- Keep newest row per SKU so a unique index can be enforced safely.
  DELETE FROM "Product" p
  USING (
    SELECT id
    FROM (
      SELECT id, ROW_NUMBER() OVER (PARTITION BY sku ORDER BY id DESC) AS rn
      FROM "Product"
      WHERE sku IS NOT NULL
    ) t
    WHERE t.rn > 1
  ) duplicates
  WHERE p.id = duplicates.id;

  IF NOT EXISTS (
    SELECT 1
    FROM pg_indexes
    WHERE schemaname = 'public'
      AND tablename = 'Product'
      AND indexname = 'Product_sku_key'
  ) THEN
    CREATE UNIQUE INDEX "Product_sku_key" ON "Product"("sku");
  END IF;

  IF NOT EXISTS (
    SELECT 1
    FROM pg_indexes
    WHERE schemaname = 'public'
      AND tablename = 'Product'
      AND indexname = 'Product_isActive_idx'
  ) THEN
    CREATE INDEX "Product_isActive_idx" ON "Product"("isActive");
  END IF;
END $$;
