import { NextResponse } from 'next/server';
import { prisma } from '@/src/lib/db';
import { verifyAdminSessionToken, COOKIE_NAME } from '@/src/lib/admin-auth';
import { cookies } from 'next/headers';

export async function GET() {
  const settings = await prisma.siteSettings.findUnique({
    where: { id: 'site-settings' },
  });
  return NextResponse.json(settings || {});
}

export async function PATCH(req: Request) {
  const store = await cookies();
  if (!verifyAdminSessionToken(store.get(COOKIE_NAME)?.value)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const data = await req.json();
  const updated = await prisma.siteSettings.upsert({
    where: { id: 'site-settings' },
    create: data,
    update: data,
  });

  return NextResponse.json(updated);
}
