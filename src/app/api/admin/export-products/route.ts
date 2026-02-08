import { NextRequest, NextResponse } from 'next/server';
import * as xlsx from 'xlsx';
import { prisma } from '@/lib/prisma';
import { verifySessionToken } from '@/lib/admin-auth';
import { ADMIN_SESSION_COOKIE } from '@/lib/admin-auth-constants';

function formatDateForFile(date: Date) {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, '0');
  const d = String(date.getDate()).padStart(2, '0');
  const h = String(date.getHours()).padStart(2, '0');
  const min = String(date.getMinutes()).padStart(2, '0');
  return `${y}${m}${d}-${h}${min}`;
}

export async function GET(request: NextRequest) {
  const token = request.cookies.get(ADMIN_SESSION_COOKIE)?.value || '';
  if (!token || !verifySessionToken(token)) {
    return NextResponse.json({ ok: false, message: 'Unauthorized' }, { status: 401 });
  }

  const products = await prisma.product.findMany({
    orderBy: { id: 'asc' },
    include: { category: true },
  });

  const rows = products.map((product) => ({
    sku: product.sku,
    'descripcion corta': product.descripcion,
    referencia: product.referencia,
    categoria: product.category?.name ?? '',
    'descripcion completa': product.textoDescripcion,
    'url de imagen': product.imageUrl,
    activo: product.isActive ? 'si' : 'no',
    'actualizado origen': product.sourceUpdatedAt
      ? product.sourceUpdatedAt.toISOString()
      : '',
    'actualizado sistema': product.updatedAt.toISOString(),
  }));

  const ws = xlsx.utils.json_to_sheet(rows);
  const wb = xlsx.utils.book_new();
  xlsx.utils.book_append_sheet(wb, ws, 'Productos');

  const buffer = xlsx.write(wb, { type: 'buffer', bookType: 'xlsx' });
  const filename = `productos-${formatDateForFile(new Date())}.xlsx`;

  return new NextResponse(buffer, {
    status: 200,
    headers: {
      'Content-Type':
        'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
      'Content-Disposition': `attachment; filename="${filename}"`,
      'Cache-Control': 'no-store',
    },
  });
}
