import { cookies } from 'next/headers';
import { createHmac, randomBytes, scryptSync, timingSafeEqual } from 'crypto';
import { ADMIN_SESSION_COOKIE } from './admin-auth-constants';

const SESSION_COOKIE = ADMIN_SESSION_COOKIE;
const SESSION_TTL_DAYS = 7;
const SCRYPT_KEYLEN = 64;
const SCRYPT_OPTS = { N: 16384, r: 8, p: 1 };

type SessionPayload = {
  id: number;
  email: string;
  exp: number;
};

function getSecret() {
  return (
    process.env.ADMIN_AUTH_SECRET ||
    process.env.NEXTAUTH_SECRET ||
    'dev-secret-change-me'
  );
}

function getCookieDomain() {
  const fromEnv = process.env.SESSION_COOKIE_DOMAIN?.trim();
  if (!fromEnv) return undefined;
  return fromEnv;
}

export function hashPassword(password: string) {
  const salt = randomBytes(16).toString('hex');
  const hash = scryptSync(password, salt, SCRYPT_KEYLEN, SCRYPT_OPTS).toString('hex');
  return `${salt}:${hash}`;
}

export function verifyPassword(password: string, stored: string) {
  const [salt, hash] = stored.split(':');
  if (!salt || !hash) return false;
  const derived = scryptSync(password, salt, SCRYPT_KEYLEN, SCRYPT_OPTS);
  return timingSafeEqual(Buffer.from(hash, 'hex'), derived);
}

function sign(payload: string) {
  return createHmac('sha256', getSecret()).update(payload).digest('base64url');
}

export function createSessionToken(payload: SessionPayload) {
  const body = Buffer.from(JSON.stringify(payload)).toString('base64url');
  const sig = sign(body);
  return `${body}.${sig}`;
}

export function verifySessionToken(token: string): SessionPayload | null {
  const [body, sig] = token.split('.');
  if (!body || !sig) return null;
  const expected = sign(body);
  const a = Buffer.from(sig);
  const b = Buffer.from(expected);
  if (a.length !== b.length || !timingSafeEqual(a, b)) return null;
  try {
    const payload = JSON.parse(Buffer.from(body, 'base64url').toString('utf8')) as SessionPayload;
    if (!payload?.exp || Date.now() > payload.exp) return null;
    return payload;
  } catch {
    return null;
  }
}

export async function setAdminSession(payload: Omit<SessionPayload, 'exp'>) {
  const exp = Date.now() + SESSION_TTL_DAYS * 24 * 60 * 60 * 1000;
  const token = createSessionToken({ ...payload, exp });
  const cookieStore = await cookies();
  cookieStore.set(SESSION_COOKIE, token, {
    httpOnly: true,
    sameSite: 'lax',
    secure: process.env.NODE_ENV === 'production',
    domain: getCookieDomain(),
    path: '/',
    maxAge: SESSION_TTL_DAYS * 24 * 60 * 60,
  });
}

export async function clearAdminSession() {
  const cookieStore = await cookies();
  cookieStore.set(SESSION_COOKIE, '', {
    httpOnly: true,
    sameSite: 'lax',
    secure: process.env.NODE_ENV === 'production',
    domain: getCookieDomain(),
    path: '/',
    maxAge: 0,
  });
}

export async function getAdminSession() {
  const cookieStore = await cookies();
  const token = cookieStore.get(SESSION_COOKIE)?.value;
  if (!token) return null;
  return verifySessionToken(token);
}
