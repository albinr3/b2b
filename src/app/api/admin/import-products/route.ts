import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import * as xlsx from 'xlsx';
import { verifySessionToken } from '@/lib/admin-auth';
import { ADMIN_SESSION_COOKIE } from '@/lib/admin-auth-constants';

const prisma = new PrismaClient();

function createSlug(text: string) {
    return text
        .toString()
        .toLowerCase()
        .trim()
        .replace(/\s+/g, '-')
        .replace(/[^\w\-]+/g, '')
        .replace(/\-\-+/g, '-');
}

export async function POST(request: NextRequest) {
    try {
        const token = request.cookies.get(ADMIN_SESSION_COOKIE)?.value || '';
        if (!token || !verifySessionToken(token)) {
            return NextResponse.json({ ok: false, message: 'Unauthorized' }, { status: 401 });
        }

        const formData = await request.formData();
        const file = formData.get('file') as File;

        if (!file) {
            return NextResponse.json({ ok: false, message: 'No file uploaded' }, { status: 400 });
        }

        const buffer = Buffer.from(await file.arrayBuffer());
        const workbook = xlsx.read(buffer, { type: 'buffer' });
        const sheetName = workbook.SheetNames[0];
        const sheet = workbook.Sheets[sheetName];
        const data = xlsx.utils.sheet_to_json(sheet) as any[];

        let created = 0;
        let updated = 0;
        let errors = 0;

        for (const row of data) {
            try {
                const sku = row['sku'] ? String(row['sku']).trim() : null;
                const descripcion = row['descripcion corta'] || '';
                const referencia = row['referencia'] ? String(row['referencia']) : '';
                const categoryName = row['categoria'];
                const textoDescripcion = row['descripcion completa'] || '';
                const imageUrl = row['url de imagen'] || '';

                if (!sku) {
                    errors++;
                    continue;
                }

                // Handle category
                let categoryId = null;
                if (categoryName) {
                    const categorySlug = createSlug(categoryName);
                    const category = await prisma.category.upsert({
                        where: { slug: categorySlug },
                        update: {},
                        create: {
                            name: categoryName,
                            slug: categorySlug,
                        },
                    });
                    categoryId = category.id;
                }

                // Check if product exists
                const existingProduct = await prisma.product.findUnique({
                    where: { sku: sku },
                });

                const slugBase = descripcion || sku;
                const slug = createSlug(slugBase);

                if (existingProduct) {
                    await prisma.product.update({
                        where: { id: existingProduct.id },
                        data: {
                            descripcion,
                            referencia,
                            imageUrl: imageUrl || '/no-photo.avif',
                            textoDescripcion,
                            categoryId,
                            isActive: true,
                        },
                    });
                    updated++;
                } else {
                    let baseSlugWithSku = `${slug}-${createSlug(sku)}`;
                    let finalSlug = baseSlugWithSku;
                    let counter = 1;

                    // Ensure unique slug
                    while (true) {
                        const existingSlug = await prisma.product.findUnique({
                            where: { slug: finalSlug },
                        });
                        if (!existingSlug) break;

                        finalSlug = `${baseSlugWithSku}-${counter}`;
                        counter++;
                    }

                    await prisma.product.create({
                        data: {
                            sku,
                            slug: finalSlug,
                            descripcion,
                            referencia,
                            imageUrl: imageUrl || '/no-photo.avif',
                            textoDescripcion,
                            categoryId,
                            isActive: true,
                        },
                    });
                    created++;
                }
            } catch (err) {
                errors++;
                console.error('Error processing row:', err);
            }
        }

        await prisma.$disconnect();

        return NextResponse.json({
            ok: true,
            message: `Importación completada: ${created} creados, ${updated} actualizados, ${errors} errores`,
        });
    } catch (error) {
        console.error('Import error:', error);
        return NextResponse.json(
            { ok: false, message: 'Error procesando el archivo' },
            { status: 500 }
        );
    }
}
