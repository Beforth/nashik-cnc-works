import { NextResponse } from 'next/server';
import { prisma } from '@/src/lib/db';
import { revalidatePublicCmsCache } from '@/src/lib/cms-cache';
import { requireAdminSession } from '@/src/lib/require-admin';

export async function GET() {
  try {
    const list = await prisma.service.findMany({ orderBy: { sortOrder: 'asc' } });
    return NextResponse.json(list);
  } catch {
    return NextResponse.json({ error: 'Database unavailable' }, { status: 503 });
  }
}

const ID_RE = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;

export async function POST(request: Request) {
  const unauthorized = await requireAdminSession();
  if (unauthorized) return unauthorized;

  try {
    const body = (await request.json()) as {
      id?: string;
      iconKey?: string;
      name?: string;
      imageUrl?: string;
      description?: string;
      sortOrder?: number;
    };

    const { id, iconKey, name, imageUrl, description, sortOrder } = body;
    if (!id || !ID_RE.test(id)) {
      return NextResponse.json(
        { error: 'Invalid id: use lowercase letters, numbers, and hyphens only (e.g. cnc-milling).' },
        { status: 400 },
      );
    }
    if (!iconKey || !name || !imageUrl || !description) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    const created = await prisma.service.create({
      data: {
        id,
        iconKey,
        name,
        imageUrl,
        description,
        sortOrder: typeof sortOrder === 'number' ? sortOrder : 0,
      },
    });
    revalidatePublicCmsCache();
    return NextResponse.json(created, { status: 201 });
  } catch (e: unknown) {
    const msg = e && typeof e === 'object' && 'code' in e && e.code === 'P2002' ? 'Service id already exists' : 'Create failed';
    return NextResponse.json({ error: msg }, { status: 400 });
  }
}
