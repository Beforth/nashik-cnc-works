import { NextResponse } from 'next/server';
import { prisma } from '@/src/lib/db';
import { verifyAdminSessionToken, COOKIE_NAME } from '@/src/lib/admin-auth';
import { cookies } from 'next/headers';

const HERO_PLACEHOLDER_URL =
  'data:image/svg+xml,' +
  encodeURIComponent(
    `<svg xmlns="http://www.w3.org/2000/svg" width="800" height="450" viewBox="0 0 800 450"><rect fill="#EEF1F6" width="800" height="450"/><text x="50%" y="50%" dominant-baseline="middle" text-anchor="middle" fill="#5A6A7A" font-family="system-ui" font-size="20">Upload image</text></svg>`,
  );

export async function GET() {
  try {
    const items = await prisma.heroImage.findMany({
      orderBy: { sortOrder: 'asc' },
    });
    return NextResponse.json(items);
  } catch (e) {
    console.error('[GET /api/admin/hero]', e);
    return NextResponse.json(
      { error: 'Failed to load hero images' },
      { status: 500 },
    );
  }
}

export async function POST(req: Request) {
  const store = await cookies();
  if (!verifyAdminSessionToken(store.get(COOKIE_NAME)?.value)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const body = (await req.json().catch(() => ({}))) as { url?: string; alt?: string };
  const first = await prisma.heroImage.findFirst({
    orderBy: { sortOrder: 'asc' },
    select: { sortOrder: true },
  });
  /** New slides appear first in the carousel (lower sortOrder = earlier). */
  const sortOrder = (first?.sortOrder ?? 0) - 1;
  const url =
    typeof body.url === 'string' && body.url.trim().length > 0 ? body.url.trim() : HERO_PLACEHOLDER_URL;
  const alt =
    typeof body.alt === 'string' && body.alt.trim().length > 0 ? body.alt.trim() : 'Hero slide';

  const item = await prisma.heroImage.create({
    data: { url, alt, sortOrder },
  });
  return NextResponse.json(item);
}

export async function DELETE(req: Request) {
  const store = await cookies();
  if (!verifyAdminSessionToken(store.get(COOKIE_NAME)?.value)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const { searchParams } = new URL(req.url);
  const id = searchParams.get('id');
  if (!id) return NextResponse.json({ error: 'ID required' }, { status: 400 });

  await prisma.heroImage.delete({ where: { id } });
  return NextResponse.json({ success: true });
}

export async function PATCH(req: Request) {
  const store = await cookies();
  if (!verifyAdminSessionToken(store.get(COOKIE_NAME)?.value)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const { searchParams } = new URL(req.url);
  const id = searchParams.get('id');
  if (!id) return NextResponse.json({ error: 'ID required' }, { status: 400 });

  const data = (await req.json().catch(() => ({}))) as { url?: string; alt?: string };
  const patch: { url?: string; alt?: string } = {};
  if (typeof data.url === 'string') patch.url = data.url;
  if (typeof data.alt === 'string') patch.alt = data.alt;
  if (Object.keys(patch).length === 0) {
    return NextResponse.json({ error: 'Provide url and/or alt' }, { status: 400 });
  }

  const updated = await prisma.heroImage.update({
    where: { id },
    data: patch,
  });

  return NextResponse.json(updated);
}
