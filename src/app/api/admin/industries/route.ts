import { NextResponse } from 'next/server';
import { prisma } from '@/src/lib/db';
import { revalidatePublicCmsCache } from '@/src/lib/cms-cache';
import { verifyAdminSessionToken, COOKIE_NAME } from '@/src/lib/admin-auth';
import { cookies } from 'next/headers';

export async function GET() {
  const store = await cookies();
  if (!verifyAdminSessionToken(store.get(COOKIE_NAME)?.value)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const items = await prisma.industryItem.findMany({
      orderBy: { sortOrder: 'asc' },
    });
    return NextResponse.json(items);
  } catch (e) {
    console.error('[GET /api/admin/industries]', e);
    return NextResponse.json({ error: 'Failed to load industries' }, { status: 500 });
  }
}

function parseCreateBody(raw: unknown) {
  const body = raw && typeof raw === 'object' ? (raw as Record<string, unknown>) : {};
  const name = typeof body.name === 'string' ? body.name.trim() : '';
  const iconKey =
    typeof body.iconKey === 'string' && body.iconKey.trim().length > 0
      ? body.iconKey.trim()
      : 'Factory';
  const sortOrder =
    typeof body.sortOrder === 'number' && Number.isFinite(body.sortOrder) ? body.sortOrder : 0;
  return { name, iconKey, sortOrder };
}

function parsePatchBody(raw: unknown) {
  const body = raw && typeof raw === 'object' ? (raw as Record<string, unknown>) : {};
  const patch: { name?: string; iconKey?: string; sortOrder?: number } = {};
  if (typeof body.name === 'string') patch.name = body.name.trim();
  if (typeof body.iconKey === 'string' && body.iconKey.trim()) patch.iconKey = body.iconKey.trim();
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
    const { name, iconKey, sortOrder } = parseCreateBody(await req.json());
    if (!name) {
      return NextResponse.json({ error: 'Name is required.' }, { status: 400 });
    }
    const item = await prisma.industryItem.create({
      data: { name, iconKey, sortOrder },
    });
    revalidatePublicCmsCache();
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
    const updated = await prisma.industryItem.update({
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
  const store = await cookies();
  if (!verifyAdminSessionToken(store.get(COOKIE_NAME)?.value)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const { searchParams } = new URL(req.url);
  const id = searchParams.get('id');
  if (!id) return NextResponse.json({ error: 'ID required' }, { status: 400 });

  await prisma.industryItem.delete({ where: { id } });
  revalidatePublicCmsCache();
  return NextResponse.json({ success: true });
}
