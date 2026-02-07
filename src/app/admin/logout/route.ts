import { NextResponse, type NextRequest } from 'next/server';
import { ADMIN_SESSION_COOKIE } from '@/lib/admin-auth-constants';

export async function GET(request: NextRequest) {
  const url = new URL('/admin/login', request.url);
  const response = NextResponse.redirect(url);
  response.cookies.set(ADMIN_SESSION_COOKIE, '', {
    httpOnly: true,
    sameSite: 'lax',
    secure: process.env.NODE_ENV === 'production',
    path: '/',
    maxAge: 0,
  });
  return response;
}
