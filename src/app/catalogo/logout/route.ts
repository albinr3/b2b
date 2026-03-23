import { NextResponse, type NextRequest } from 'next/server';
import { CATALOG_SESSION_COOKIE } from '@/lib/catalog-auth-constants';

export async function GET(request: NextRequest) {
  const url = new URL('/catalogo/login', request.url);
  const response = NextResponse.redirect(url);
  response.cookies.set(CATALOG_SESSION_COOKIE, '', {
    httpOnly: true,
    sameSite: 'lax',
    secure: process.env.NODE_ENV === 'production',
    path: '/',
    maxAge: 0,
  });
  return response;
}
