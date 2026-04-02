import { createHmac, timingSafeEqual } from 'crypto';

const COOKIE_NAME = 'admin_session';

export { COOKIE_NAME };

function getSecret(): string {
  const s = process.env.ADMIN_SESSION_SECRET;
  if (!s || s.length < 16) {
    throw new Error('ADMIN_SESSION_SECRET must be set (min 16 characters)');
  }
  return s;
}

/** Creates a signed token: base64url(expiryMs.hmac) */
export function createAdminSessionToken(): string {
  const exp = Date.now() + 7 * 24 * 60 * 60 * 1000;
  const payload = String(exp);
  const sig = createHmac('sha256', getSecret()).update(payload).digest('hex');
  return Buffer.from(`${payload}.${sig}`, 'utf8').toString('base64url');
}

export function verifyAdminSessionToken(token: string | undefined): boolean {
  if (!token) return false;
  let secret: string;
  try {
    secret = getSecret();
  } catch {
    return false;
  }
  try {
    const decoded = Buffer.from(token, 'base64url').toString('utf8');
    const dot = decoded.indexOf('.');
    if (dot <= 0) return false;
    const payload = decoded.slice(0, dot);
    const sig = decoded.slice(dot + 1);
    const expected = createHmac('sha256', secret).update(payload).digest('hex');
    const a = Buffer.from(sig, 'utf8');
    const b = Buffer.from(expected, 'utf8');
    if (a.length !== b.length || !timingSafeEqual(a, b)) return false;
    if (Number(payload) < Date.now()) return false;
    return true;
  } catch {
    return false;
  }
}

export function verifyAdminPassword(password: string): boolean {
  const expected = process.env.ADMIN_PASSWORD;
  if (!expected || expected.length < 8) return false;
  const a = Buffer.from(password, 'utf8');
  const b = Buffer.from(expected, 'utf8');
  if (a.length !== b.length) return false;
  return timingSafeEqual(a, b);
}
