const { PrismaClient } = require('@prisma/client');
const xlsx = require('xlsx');
const fs = require('fs');
const path = require('path');

const prisma = new PrismaClient();

// Helper to create a slug
function createSlug(text) {
    return text
        .toString()
        .toLowerCase()
        .trim()
        .replace(/\s+/g, '-')     // Replace spaces with -
        .replace(/[^\w\-]+/g, '') // Remove all non-word chars
        .replace(/\-\-+/g, '-');  // Replace multiple - with single -
}

async function importProducts(filePath) {
    try {
        if (!fs.existsSync(filePath)) {
            console.error(`File not found: ${filePath}`);
            process.exit(1);
        }

        console.log(`Reading file: ${filePath}`);
        const workbook = xlsx.readFile(filePath);
        const sheetName = workbook.SheetNames[0];
        const sheet = workbook.Sheets[sheetName];

        // Convert to JSON
        const data = xlsx.utils.sheet_to_json(sheet);
        console.log(`Found ${data.length} rows.`);

        for (const [index, row] of data.entries()) {
            // Map columns - verify these names match your Excel headers exactly!
            const sku = row['sku'] ? String(row['sku']).trim() : null;
            const descripcion = row['descripcion corta'] || '';
            const referencia = row['referencia'] ? String(row['referencia']) : '';
            const categoryName = row['categoria'];
            const textoDescripcion = row['descripcion completa'] || '';
            const imageUrl = row['url de imagen'] || '';

            if (!sku) {
                console.warn(`Row ${index + 1}: SKU missing, skipping.`);
                continue;
            }

            // 1. Handle Category
            let categoryId = null;
            if (categoryName) {
                const categorySlug = createSlug(categoryName);
                const category = await prisma.category.upsert({
                    where: { slug: categorySlug }, // Assuming slug is unique
                    update: {},
                    create: {
                        name: categoryName,
                        slug: categorySlug,
                    },
                });
                categoryId = category.id;
            }

            // 2. Prepare Product Data
            // Use Description or SKU for slug if not provided, ensure uniqueness approach later if needed
            // For now, slug = sku-slugified to ensure 1-1 mostly
            // Or use description if available. Let's use name-like slug if possible, else SKU.
            // User didn't provide a 'name' column in the description, just 'descripcion corta'.
            // I'll use 'descripcion corta' for the slug base, or SKU if empty.
            const slugBase = descripcion || sku;
            let slug = createSlug(slugBase);

            // Ensure unique slug (simple append if exists? upsert handles uniqueness on SKU mostly)
            // Prisma schema says slug is unique. 
            // Ideally we check if slug exists for a DIFFERENT sku, but for bulk import simple logic first.

            console.log(`Processing SKU: ${sku}`);

            // Check if product exists by SKU (since SKU is not @unique in schema)
            const existingProduct = await prisma.product.findFirst({
                where: { sku: sku },
            });

            if (existingProduct) {
                console.log(`Updating existing product for SKU: ${sku}`);
                await prisma.product.update({
                    where: { id: existingProduct.id },
                    data: {
                        descripcion,
                        referencia,
                        imageUrl,
                        textoDescripcion,
                        categoryId,
                    },
                });
            } else {
                console.log(`Creating new product for SKU: ${sku}`);

                let baseSlugWithSku = `${slug}-${createSlug(sku)}`;
                let finalSlug = baseSlugWithSku;
                let counter = 1;

                // Ensure slug is unique
                while (true) {
                    const existingSlug = await prisma.product.findUnique({
                        where: { slug: finalSlug },
                    });
                    if (!existingSlug) break; // Unique!

                    finalSlug = `${baseSlugWithSku}-${counter}`;
                    counter++;
                }

                await prisma.product.create({
                    data: {
                        sku,
                        slug: finalSlug,
                        descripcion,
                        referencia,
                        imageUrl: imageUrl || '/sin-imagen.webp',
                        textoDescripcion,
                        categoryId,
                    },
                });
            }
        }

        console.log('Import completed successfully.');

    } catch (error) {
        console.error('Error importing products:', error);
    } finally {
        await prisma.$disconnect();
    }
}

// Get file path from command line arg
const excelFile = process.argv[2];
if (!excelFile) {
    console.log('Usage: node scripts/import-products.js <path-to-excel-file>');
    // Check for a default file in data folder for convenience
    const defaultFile = path.join(__dirname, '../data/productos.xlsx');
    if (fs.existsSync(defaultFile)) {
        console.log(`No arguments provided. Using default file: ${defaultFile}`);
        importProducts(defaultFile);
    } else {
        process.exit(1);
    }
} else {
    importProducts(excelFile);
}
