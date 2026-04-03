import { NextResponse } from 'next/server';
import { prisma } from '@/src/lib/db';
import { verifyAdminSessionToken, COOKIE_NAME } from '@/src/lib/admin-auth';
import { cookies } from 'next/headers';

export async function GET() {
  const items = await prisma.infrastructureItem.findMany({
    orderBy: { sortOrder: 'asc' },
  });
  return NextResponse.json(items);
}

function parseCreateBody(raw: unknown) {
  const body = raw && typeof raw === 'object' ? (raw as Record<string, unknown>) : {};
  const name = typeof body.name === 'string' ? body.name.trim() : '';
  const specs = typeof body.specs === 'string' ? body.specs.trim() : '';
  const imageUrl =
    typeof body.imageUrl === 'string' && body.imageUrl.trim().length > 0
      ? body.imageUrl.trim()
      : null;
  const iconKey =
    typeof body.iconKey === 'string' && body.iconKey.trim().length > 0
      ? body.iconKey.trim()
      : 'Wrench';
  const sortOrder =
    typeof body.sortOrder === 'number' && Number.isFinite(body.sortOrder) ? body.sortOrder : 0;
  return { name, specs, imageUrl, iconKey, sortOrder };
}

function parsePatchBody(raw: unknown) {
  const body = raw && typeof raw === 'object' ? (raw as Record<string, unknown>) : {};
  const patch: {
    name?: string;
    specs?: string;
    imageUrl?: string | null;
    iconKey?: string;
    sortOrder?: number;
  } = {};
  if (typeof body.name === 'string') patch.name = body.name.trim();
  if (typeof body.specs === 'string') patch.specs = body.specs.trim();
  if (body.imageUrl === null) patch.imageUrl = null;
  else if (typeof body.imageUrl === 'string') patch.imageUrl = body.imageUrl.trim() || null;
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
    const { name, specs, imageUrl, iconKey, sortOrder } = parseCreateBody(await req.json());
    if (!name || !specs) {
      return NextResponse.json({ error: 'Name and specifications are required.' }, { status: 400 });
    }
    const item = await prisma.infrastructureItem.create({
      data: { name, specs, imageUrl, iconKey, sortOrder },
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
    const updated = await prisma.infrastructureItem.update({
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

  await prisma.infrastructureItem.delete({ where: { id } });
  return NextResponse.json({ success: true });
}
