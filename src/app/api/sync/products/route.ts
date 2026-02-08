import { NextRequest, NextResponse } from 'next/server';
import { revalidatePath } from 'next/cache';
import { prisma } from '@/lib/prisma';

type SyncProductInput = {
  sku: string;
  descripcion: string;
  referencia?: string | null;
  textoDescripcion?: string | null;
  imageUrl?: string | null;
  categoryName?: string | null;
  sourceUpdatedAt?: string | null;
  isActive?: boolean;
};

type SyncRequestBody = {
  products?: SyncProductInput[];
  deactivateSkus?: string[];
};

const DEFAULT_IMAGE_URL = '/no-photo.avif';

function createSlug(text: string) {
  return text
    .toString()
    .toLowerCase()
    .trim()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/\s+/g, '-')
    .replace(/[^\w\-]+/g, '')
    .replace(/\-\-+/g, '-');
}

function parseSourceUpdatedAt(value?: string | null) {
  if (!value) return null;
  const parsed = new Date(value);
  return Number.isNaN(parsed.getTime()) ? null : parsed;
}

function isAuthorized(request: NextRequest) {
  const token = process.env.SYNC_API_TOKEN;
  if (!token) {
    return { ok: false, status: 500, message: 'SYNC_API_TOKEN is not configured' };
  }

  const headerToken = request.headers.get('x-sync-token') || '';
  return headerToken === token
    ? { ok: true as const }
    : { ok: false as const, status: 401, message: 'Unauthorized' };
}

export async function POST(request: NextRequest) {
  const auth = isAuthorized(request);
  if (!auth.ok) {
    return NextResponse.json({ ok: false, message: auth.message }, { status: auth.status });
  }

  let payload: SyncRequestBody;
  try {
    payload = (await request.json()) as SyncRequestBody;
  } catch {
    return NextResponse.json({ ok: false, message: 'Invalid JSON payload' }, { status: 400 });
  }

  const products = Array.isArray(payload.products) ? payload.products : [];
  const deactivateSkus = Array.isArray(payload.deactivateSkus)
    ? payload.deactivateSkus.map((sku) => String(sku || '').trim()).filter(Boolean)
    : [];

  if (products.length === 0 && deactivateSkus.length === 0) {
    return NextResponse.json(
      { ok: false, message: 'At least one product or deactivate SKU is required' },
      { status: 400 },
    );
  }

  let created = 0;
  let updated = 0;
  let skipped = 0;
  let deactivated = 0;
  let errors = 0;

  for (const raw of products) {
    const sku = String(raw?.sku || '').trim();
    const descripcion = String(raw?.descripcion || '').trim();

    if (!sku || !descripcion) {
      errors += 1;
      continue;
    }

    const sourceUpdatedAt = parseSourceUpdatedAt(raw.sourceUpdatedAt);

    try {
      let categoryId: number | null = null;
      const categoryName = String(raw.categoryName || '').trim();
      if (categoryName) {
        const categorySlug = createSlug(categoryName);
        const category = await prisma.category.upsert({
          where: { slug: categorySlug },
          update: { name: categoryName },
          create: {
            name: categoryName,
            slug: categorySlug,
          },
        });
        categoryId = category.id;
      }

      const existing = await prisma.product.findUnique({
        where: { sku },
        select: { id: true, sourceUpdatedAt: true },
      });

      // Skip stale updates to avoid overwriting fresher data with delayed payloads.
      if (
        existing?.sourceUpdatedAt &&
        sourceUpdatedAt &&
        sourceUpdatedAt.getTime() < existing.sourceUpdatedAt.getTime()
      ) {
        skipped += 1;
        continue;
      }

      const baseData = {
        descripcion,
        referencia: String(raw.referencia || '').trim(),
        textoDescripcion: String(raw.textoDescripcion || '').trim(),
        imageUrl: String(raw.imageUrl || '').trim() || DEFAULT_IMAGE_URL,
        categoryId,
        sourceUpdatedAt,
        isActive: raw.isActive ?? true,
      };

      if (existing) {
        await prisma.product.update({
          where: { sku },
          data: baseData,
        });
        updated += 1;
        continue;
      }

      const slugBase = createSlug(descripcion || sku);
      const skuSlug = createSlug(sku);
      let slug = `${slugBase}-${skuSlug}`;
      let suffix = 1;

      while (true) {
        const slugExists = await prisma.product.findUnique({ where: { slug } });
        if (!slugExists) break;
        slug = `${slugBase}-${skuSlug}-${suffix}`;
        suffix += 1;
      }

      await prisma.product.create({
        data: {
          sku,
          slug,
          ...baseData,
        },
      });
      created += 1;
    } catch {
      errors += 1;
    }
  }

  if (deactivateSkus.length > 0) {
    const result = await prisma.product.updateMany({
      where: { sku: { in: deactivateSkus } },
      data: { isActive: false },
    });
    deactivated = result.count;
  }

  revalidatePath('/catalogo');
  revalidatePath('/');

  return NextResponse.json({
    ok: true,
    summary: {
      processed: products.length,
      created,
      updated,
      skipped,
      deactivated,
      errors,
    },
  });
}
