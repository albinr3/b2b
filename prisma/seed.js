const { PrismaClient } = require('@prisma/client');
const crypto = require('crypto');

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

const ADMIN_EMAIL = 'albinmrodriguez@gmail.com';
const ADMIN_PASSWORD = 'Rodriguez151525';
const SCRYPT_KEYLEN = 64;
const SCRYPT_OPTS = { N: 16384, r: 8, p: 1 };

function hashPassword(password) {
  const salt = crypto.randomBytes(16).toString('hex');
  const hash = crypto.scryptSync(password, salt, SCRYPT_KEYLEN, SCRYPT_OPTS).toString('hex');
  return `${salt}:${hash}`;
}

async function main() {
  for (const category of categories) {
    await prisma.category.upsert({
      where: { slug: category.slug },
      update: { name: category.name },
      create: category,
    });
  }

  const admin = await prisma.adminUser.findUnique({
    where: { email: ADMIN_EMAIL },
  });
  if (!admin) {
    await prisma.adminUser.create({
      data: {
        email: ADMIN_EMAIL,
        passwordHash: hashPassword(ADMIN_PASSWORD),
      },
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
