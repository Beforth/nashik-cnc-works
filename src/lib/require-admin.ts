import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';
import { COOKIE_NAME, verifyAdminSessionToken } from '@/src/lib/admin-auth';

/** Returns a 401 NextResponse if not logged in; otherwise null. */
export async function requireAdminSession(): Promise<NextResponse | null> {
  const store = await cookies();
  const token = store.get(COOKIE_NAME)?.value;
  if (!verifyAdminSessionToken(token)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }
  return null;
}
