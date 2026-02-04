ALTER TABLE "Product" ADD COLUMN "slug" TEXT;
UPDATE "Product" SET "slug" = lower(regexp_replace(regexp_replace(coalesce("descripcion", "referencia", "sku"), '[^a-zA-Z0-9]+', '-', 'g'), '(^-|-$)', '', 'g')) WHERE "slug" IS NULL;
ALTER TABLE "Product" ALTER COLUMN "slug" SET NOT NULL;
CREATE UNIQUE INDEX "Product_slug_key" ON "Product"("slug");
