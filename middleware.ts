import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { ADMIN_SESSION_COOKIE } from '@/lib/admin-auth-constants';
import { CATALOG_SESSION_COOKIE } from '@/lib/catalog-auth-constants';

const encoder = new TextEncoder();

function getSecret() {
  return (
    process.env.ADMIN_AUTH_SECRET ||
    process.env.NEXTAUTH_SECRET ||
    'dev-secret-change-me'
  );
}

function decodeBase64Url(value: string) {
  const padded = value.replace(/-/g, '+').replace(/_/g, '/').padEnd(Math.ceil(value.length / 4) * 4, '=');
  return atob(padded);
}

function encodeBase64Url(bytes: ArrayBuffer) {
  const binary = String.fromCharCode(...new Uint8Array(bytes));
  return btoa(binary).replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');
}

async function verifySessionToken(token: string) {
  const [body, sig] = token.split('.');
  if (!body || !sig) return null;
  const key = await crypto.subtle.importKey(
    'raw',
    encoder.encode(getSecret()),
    { name: 'HMAC', hash: 'SHA-256' },
    false,
    ['sign'],
  );
  const signature = await crypto.subtle.sign('HMAC', key, encoder.encode(body));
  const expected = encodeBase64Url(signature);
  if (expected !== sig) return null;
  try {
    const payload = JSON.parse(decodeBase64Url(body)) as { exp?: number };
    if (!payload?.exp || Date.now() > payload.exp) return null;
    return payload;
  } catch {
    return null;
  }
}

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
  const hasAdminSession = adminToken ? Boolean(await verifySessionToken(adminToken)) : false;
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
    const hasCatalogSession = catalogToken
      ? Boolean(await verifySessionToken(catalogToken))
      : false;
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
