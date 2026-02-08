import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { ADMIN_SESSION_COOKIE } from '@/lib/admin-auth-constants';
import { CATALOG_SESSION_COOKIE } from '@/lib/catalog-auth-constants';

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const isAdminPath = pathname.startsWith('/admin');
  const isAdminApi = pathname.startsWith('/api/admin');
  const isCatalogPath = pathname.startsWith('/catalogo');
  if (!isAdminPath && !isAdminApi && !isCatalogPath) {
    return NextResponse.next();
  }

  const requestHeaders = new Headers(request.headers);
  requestHeaders.set('x-pathname', pathname);

  const adminToken = request.cookies.get(ADMIN_SESSION_COOKIE)?.value;
  // Middleware runs on Edge. Keep a lightweight check here and let server code
  // validate signature/expiry to avoid runtime mismatches that force logouts.
  const hasAdminSession = Boolean(adminToken);
  const isLogin = pathname.startsWith('/admin/login');

  if (!hasAdminSession && !isLogin && isAdminPath) {
    const url = request.nextUrl.clone();
    url.pathname = '/admin/login';
    const response = NextResponse.redirect(url);
    if (adminToken) {
      response.cookies.set(ADMIN_SESSION_COOKIE, '', { path: '/', maxAge: 0 });
    }
    return response;
  }

  if (!hasAdminSession && isAdminApi) {
    return NextResponse.json({ ok: false, message: 'Unauthorized' }, { status: 401 });
  }

  if (isCatalogPath) {
    const isCatalogLogin = pathname.startsWith('/catalogo/login');
    const catalogToken = request.cookies.get(CATALOG_SESSION_COOKIE)?.value;
    const hasCatalogSession = Boolean(catalogToken);
    if (!hasCatalogSession && !isCatalogLogin) {
      const url = request.nextUrl.clone();
      url.pathname = '/catalogo/login';
      const response = NextResponse.redirect(url);
      if (catalogToken) {
        response.cookies.set(CATALOG_SESSION_COOKIE, '', { path: '/', maxAge: 0 });
      }
      return response;
    }
  }

  return NextResponse.next({
    request: {
      headers: requestHeaders,
    },
  });
}

export const config = {
  matcher: ['/admin/:path*', '/api/admin/:path*', '/catalogo/:path*'],
};
