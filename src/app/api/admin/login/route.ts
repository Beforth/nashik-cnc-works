import { NextResponse } from 'next/server';
import { COOKIE_NAME, createAdminSessionToken, verifyAdminPassword } from '@/src/lib/admin-auth';

export async function POST(request: Request) {
  try {
    const { password } = (await request.json()) as { password?: string };
    if (!password || !verifyAdminPassword(password)) {
      return NextResponse.json({ error: 'Invalid credentials' }, { status: 401 });
    }

    const token = createAdminSessionToken();
    const res = NextResponse.json({ ok: true });
    res.cookies.set(COOKIE_NAME, token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      path: '/',
      maxAge: 60 * 60 * 24 * 7,
    });
    return res;
  } catch (e) {
    const message = e instanceof Error ? e.message : 'Login failed';
    if (message.includes('ADMIN_SESSION_SECRET')) {
      return NextResponse.json({ error: 'Server misconfiguration' }, { status: 500 });
    }
    return NextResponse.json({ error: 'Login failed' }, { status: 500 });
  }
}
