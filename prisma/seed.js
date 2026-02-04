const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

const categories = [
  { name: 'Frenos', slug: 'frenos' },
  { name: 'Suspensión y dirección', slug: 'suspension-direccion' },
  { name: 'Motor', slug: 'motor' },
  { name: 'Transmisión', slug: 'transmision' },
  { name: 'Sistema eléctrico', slug: 'sistema-electrico' },
  { name: 'Filtros', slug: 'filtros' },
  { name: 'Rodamientos', slug: 'rodamientos' },
  { name: 'Refrigeración', slug: 'refrigeracion' },
  { name: 'Luces', slug: 'luces' },
  { name: 'Accesorios', slug: 'accesorios' },
];

async function main() {
  for (const category of categories) {
    await prisma.category.upsert({
      where: { slug: category.slug },
      update: { name: category.name },
      create: category,
    });
  }
}

main()
  .catch((error) => {
    console.error(error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
