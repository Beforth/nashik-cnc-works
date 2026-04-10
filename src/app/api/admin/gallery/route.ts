import { NextResponse } from 'next/server';
import { prisma } from '@/src/lib/db';
import { verifyAdminSessionToken, COOKIE_NAME } from '@/src/lib/admin-auth';
import { cookies } from 'next/headers';

export async function GET() {
  try {
    const items = await prisma.galleryItem.findMany({
      orderBy: { sortOrder: 'asc' },
    });
    return NextResponse.json(items);
  } catch (e) {
    console.error('[GET /api/admin/gallery]', e);
    return NextResponse.json(
      { error: 'Failed to load gallery items' },
      { status: 500 },
    );
  }
}

function parseCreateBody(raw: unknown) {
  const body = raw && typeof raw === 'object' ? (raw as Record<string, unknown>) : {};
  const title = typeof body.title === 'string' ? body.title.trim() : '';
  const imageUrl = typeof body.imageUrl === 'string' ? body.imageUrl.trim() : '';
  const category = typeof body.category === 'string' ? body.category.trim() : '';
  const linkUrl =
    typeof body.linkUrl === 'string' && body.linkUrl.trim().length > 0
      ? body.linkUrl.trim()
      : null;
  const sortOrder =
    typeof body.sortOrder === 'number' && Number.isFinite(body.sortOrder) ? body.sortOrder : 0;
  return { title, imageUrl, category, linkUrl, sortOrder };
}

function parsePatchBody(raw: unknown) {
  const body = raw && typeof raw === 'object' ? (raw as Record<string, unknown>) : {};
  const patch: {
    title?: string;
    imageUrl?: string;
    category?: string;
    linkUrl?: string | null;
    sortOrder?: number;
  } = {};
  if (typeof body.title === 'string') patch.title = body.title.trim();
  if (typeof body.imageUrl === 'string') patch.imageUrl = body.imageUrl.trim();
  if (typeof body.category === 'string') patch.category = body.category.trim();
  if (body.linkUrl === null) patch.linkUrl = null;
  else if (typeof body.linkUrl === 'string') patch.linkUrl = body.linkUrl.trim() || null;
  if (typeof body.sortOrder === 'number' && Number.isFinite(body.sortOrder))
    patch.sortOrder = body.sortOrder;
  return patch;
}

export async function POST(req: Request) {
  const store = await cookies();
  if (!verifyAdminSessionToken(store.get(COOKIE_NAME)?.value)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const { title, imageUrl, category, linkUrl, sortOrder } = parseCreateBody(await req.json());
    if (!title || !imageUrl || !category) {
      return NextResponse.json(
        { error: 'Title, image URL, and category are required.' },
        { status: 400 },
      );
    }
    const item = await prisma.galleryItem.create({
      data: { title, imageUrl, category, linkUrl, sortOrder },
    });
    return NextResponse.json(item, { status: 201 });
  } catch {
    return NextResponse.json({ error: 'Create failed' }, { status: 400 });
  }
}

export async function PATCH(req: Request) {
  const store = await cookies();
  if (!verifyAdminSessionToken(store.get(COOKIE_NAME)?.value)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const { searchParams } = new URL(req.url);
  const id = searchParams.get('id');
  if (!id) return NextResponse.json({ error: 'ID required' }, { status: 400 });

  const patch = parsePatchBody(await req.json());
  if (Object.keys(patch).length === 0) {
    return NextResponse.json({ error: 'No valid fields to update' }, { status: 400 });
  }

  try {
    const updated = await prisma.galleryItem.update({
      where: { id },
      data: patch,
    });
    return NextResponse.json(updated);
  } catch {
    return NextResponse.json({ error: 'Update failed' }, { status: 400 });
  }
}

export async function DELETE(req: Request) {
  const store = await cookies();
  if (!verifyAdminSessionToken(store.get(COOKIE_NAME)?.value)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const { searchParams } = new URL(req.url);
  const id = searchParams.get('id');
  if (!id) return NextResponse.json({ error: 'ID required' }, { status: 400 });

  await prisma.galleryItem.delete({ where: { id } });
  return NextResponse.json({ success: true });
}
