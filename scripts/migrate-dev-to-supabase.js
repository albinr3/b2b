/* eslint-disable no-console */
const { PrismaClient } = require('@prisma/client');

function getRequiredEnv(name) {
  const value = process.env[name];
  if (!value) {
    throw new Error(`Missing required env var: ${name}`);
  }
  return value;
}

function pickTargetUrl() {
  return process.env.TARGET_DATABASE_URL || process.env.DIRECT_URL || getRequiredEnv('DATABASE_URL');
}

function parseForceFlag() {
  return process.argv.includes('--force');
}

function mapCategory(row) {
  return {
    id: row.id,
    name: row.name,
    slug: row.slug,
  };
}

function mapProduct(row) {
  return {
    id: row.id,
    slug: row.slug,
    sku: row.sku,
    descripcion: row.descripcion,
    referencia: row.referencia,
    imageUrl: row.imageUrl,
    textoDescripcion: row.textoDescripcion,
    categoryId: row.categoryId,
  };
}

function mapDistributor(row) {
  return {
    id: row.id,
    name: row.name,
    region: row.region,
    phone: row.phone,
    email: row.email,
    address: row.address,
  };
}

function mapAdminUser(row) {
  return {
    id: row.id,
    email: row.email,
    passwordHash: row.passwordHash,
    createdAt: row.createdAt,
    updatedAt: row.updatedAt,
  };
}

async function resetIdentitySequences(prisma) {
  await prisma.$executeRawUnsafe(
    `SELECT setval(pg_get_serial_sequence('"Category"', 'id'), COALESCE((SELECT MAX(id) FROM "Category"), 0) + 1, false);`
  );
  await prisma.$executeRawUnsafe(
    `SELECT setval(pg_get_serial_sequence('"Product"', 'id'), COALESCE((SELECT MAX(id) FROM "Product"), 0) + 1, false);`
  );
  await prisma.$executeRawUnsafe(
    `SELECT setval(pg_get_serial_sequence('"Distributor"', 'id'), COALESCE((SELECT MAX(id) FROM "Distributor"), 0) + 1, false);`
  );
  await prisma.$executeRawUnsafe(
    `SELECT setval(pg_get_serial_sequence('"AdminUser"', 'id'), COALESCE((SELECT MAX(id) FROM "AdminUser"), 0) + 1, false);`
  );
}

async function main() {
  const force = parseForceFlag();
  if (!force) {
    console.error('This script is destructive on target DB. Run with --force to continue.');
    process.exit(1);
  }

  const sourceUrl = getRequiredEnv('SOURCE_DATABASE_URL');
  const targetUrl = pickTargetUrl();

  if (sourceUrl === targetUrl) {
    throw new Error(
      'Source and target URLs are the same (DATABASE_URL/SOURCE_DATABASE_URL vs DIRECT_URL/TARGET_DATABASE_URL). Aborting.'
    );
  }

  const source = new PrismaClient({
    datasources: { db: { url: sourceUrl } },
    log: ['error'],
  });
  const target = new PrismaClient({
    datasources: { db: { url: targetUrl } },
    log: ['error'],
  });

  try {
    console.log('Reading source data...');
    const [categories, products, distributors, adminUsers] = await Promise.all([
      source.category.findMany({ orderBy: { id: 'asc' } }),
      source.product.findMany({ orderBy: { id: 'asc' } }),
      source.distributor.findMany({ orderBy: { id: 'asc' } }),
      source.adminUser.findMany({ orderBy: { id: 'asc' } }),
    ]);

    console.log(
      `Source rows => categories: ${categories.length}, products: ${products.length}, distributors: ${distributors.length}, adminUsers: ${adminUsers.length}`
    );

    console.log('Replacing target data...');
    await target.$transaction(async (tx) => {
      await tx.$executeRawUnsafe(
        `TRUNCATE TABLE "Product", "Category", "Distributor", "AdminUser" RESTART IDENTITY CASCADE;`
      );

      if (categories.length > 0) {
        await tx.category.createMany({ data: categories.map(mapCategory) });
      }
      if (products.length > 0) {
        await tx.product.createMany({ data: products.map(mapProduct) });
      }
      if (distributors.length > 0) {
        await tx.distributor.createMany({ data: distributors.map(mapDistributor) });
      }
      if (adminUsers.length > 0) {
        await tx.adminUser.createMany({ data: adminUsers.map(mapAdminUser) });
      }
    });

    await resetIdentitySequences(target);
    console.log('Migration completed successfully.');
  } finally {
    await Promise.all([source.$disconnect(), target.$disconnect()]);
  }
}

main().catch((error) => {
  console.error('Migration failed:', error.message);
  process.exit(1);
});
