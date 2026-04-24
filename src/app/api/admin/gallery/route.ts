import { NextResponse } from 'next/server';
import { prisma } from '@/src/lib/db';
import { nextSortOrderForPrepend } from '@/src/lib/admin-sort-order';
import { revalidatePublicCmsCache } from '@/src/lib/cms-cache';
import { requireAdminSession } from '@/src/lib/require-admin';

export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';

export async function GET() {
  const unauth = await requireAdminSession();
  if (unauth) return unauth;
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
  return { title, imageUrl, category, linkUrl };
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
  const unauth = await requireAdminSession();
  if (unauth) return unauth;

  try {
    const { title, imageUrl, category, linkUrl } = parseCreateBody(await req.json());
    if (!title || !imageUrl || !category) {
      return NextResponse.json(
        { error: 'Title, image URL, and category are required.' },
        { status: 400 },
      );
    }
    const sortOrder = await nextSortOrderForPrepend(() =>
      prisma.galleryItem.findFirst({
        orderBy: { sortOrder: 'asc' },
        select: { sortOrder: true },
      }),
    );
    const item = await prisma.galleryItem.create({
      data: { title, imageUrl, category, linkUrl, sortOrder },
    });
    revalidatePublicCmsCache();
    return NextResponse.json(item, { status: 201 });
  } catch {
    return NextResponse.json({ error: 'Create failed' }, { status: 400 });
  }
}

export async function PATCH(req: Request) {
  const unauth = await requireAdminSession();
  if (unauth) return unauth;

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
    revalidatePublicCmsCache();
    return NextResponse.json(updated);
  } catch {
    return NextResponse.json({ error: 'Update failed' }, { status: 400 });
  }
}

export async function DELETE(req: Request) {
  const unauth = await requireAdminSession();
  if (unauth) return unauth;

  const { searchParams } = new URL(req.url);
  const id = searchParams.get('id');
  if (!id) return NextResponse.json({ error: 'ID required' }, { status: 400 });

  await prisma.galleryItem.delete({ where: { id } });
  revalidatePublicCmsCache();
  return NextResponse.json({ success: true });
}
