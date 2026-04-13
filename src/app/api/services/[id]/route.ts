import { NextResponse } from 'next/server';
import { prisma } from '@/src/lib/db';
import { revalidatePublicCmsCache } from '@/src/lib/cms-cache';
import { requireAdminSession } from '@/src/lib/require-admin';

export async function PATCH(
  request: Request,
  context: { params: Promise<{ id: string }> },
) {
  const unauthorized = await requireAdminSession();
  if (unauthorized) return unauthorized;

  const { id } = await context.params;
  try {
    const body = (await request.json()) as {
      iconKey?: string;
      name?: string;
      imageUrl?: string;
      description?: string;
      sortOrder?: number;
    };

    const data: Record<string, unknown> = {};
    if (typeof body.iconKey === 'string') data.iconKey = body.iconKey;
    if (typeof body.name === 'string') data.name = body.name;
    if (typeof body.imageUrl === 'string') data.imageUrl = body.imageUrl;
    if (typeof body.description === 'string') data.description = body.description;
    if (typeof body.sortOrder === 'number') data.sortOrder = body.sortOrder;

    if (Object.keys(data).length === 0) {
      return NextResponse.json({ error: 'No fields to update' }, { status: 400 });
    }

    const updated = await prisma.service.update({
      where: { id },
      data,
    });
    revalidatePublicCmsCache();
    return NextResponse.json(updated);
  } catch {
    return NextResponse.json({ error: 'Update failed' }, { status: 400 });
  }
}

export async function DELETE(
  _request: Request,
  context: { params: Promise<{ id: string }> },
) {
  const unauthorized = await requireAdminSession();
  if (unauthorized) return unauthorized;

  const { id } = await context.params;
  try {
    await prisma.service.delete({ where: { id } });
    revalidatePublicCmsCache();
    return new NextResponse(null, { status: 204 });
  } catch {
    return NextResponse.json({ error: 'Delete failed' }, { status: 400 });
  }
}
