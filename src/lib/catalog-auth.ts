import { cookies } from 'next/headers';
import { createHmac } from 'crypto';
import { CATALOG_SESSION_COOKIE } from './catalog-auth-constants';

const SESSION_TTL_DAYS = 30;

type CatalogSessionPayload = {
  code: string;
  exp: number;
};

function getSecret() {
  return (
    process.env.CATALOG_AUTH_SECRET ||
    process.env.NEXTAUTH_SECRET ||
    'dev-secret-change-me'
  );
}

function sign(payload: string) {
  return createHmac('sha256', getSecret()).update(payload).digest('base64url');
}

export function createCatalogToken(payload: CatalogSessionPayload) {
  const body = Buffer.from(JSON.stringify(payload)).toString('base64url');
  const sig = sign(body);
  return `${body}.${sig}`;
}

export function normalizeCode(code: string) {
  const digits = code.replace(/\D/g, '');
  return digits.padStart(4, '0').slice(-4);
}

export function computePassword(code: string) {
  const normalized = normalizeCode(code);
  const reversed = normalized.split('').reverse();
  const transformed = reversed.map((digit) => (Number(digit) + 8) % 10);
  return transformed.join('');
}

export function isValidCatalogLogin(code: string, password: string) {
  if (!/^\d{1,4}$/.test(code)) return false;
  if (!/^\d{4}$/.test(password)) return false;
  return computePassword(code) === password;
}

export async function setCatalogSession(code: string) {
  const exp = Date.now() + SESSION_TTL_DAYS * 24 * 60 * 60 * 1000;
  const token = createCatalogToken({ code: normalizeCode(code), exp });
  const cookieStore = await cookies();
  cookieStore.set(CATALOG_SESSION_COOKIE, token, {
    httpOnly: true,
    sameSite: 'lax',
    secure: process.env.NODE_ENV === 'production',
    path: '/',
    maxAge: SESSION_TTL_DAYS * 24 * 60 * 60,
  });
}

export async function clearCatalogSession() {
  const cookieStore = await cookies();
  cookieStore.set(CATALOG_SESSION_COOKIE, '', {
    httpOnly: true,
    sameSite: 'lax',
    secure: process.env.NODE_ENV === 'production',
    path: '/',
    maxAge: 0,
  });
}

export async function getCatalogSession() {
  const cookieStore = await cookies();
  const token = cookieStore.get(CATALOG_SESSION_COOKIE)?.value;
  if (!token) return null;
  const [body, sig] = token.split('.');
  if (!body || !sig) return null;
  const expected = sign(body);
  if (expected !== sig) return null;
  try {
    const payload = JSON.parse(Buffer.from(body, 'base64url').toString('utf8')) as CatalogSessionPayload;
    if (!payload?.exp || Date.now() > payload.exp) return null;
    return payload;
  } catch {
    return null;
  }
}
