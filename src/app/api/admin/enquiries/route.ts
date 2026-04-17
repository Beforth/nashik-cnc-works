import type { Prisma } from '@prisma/client';
import { NextResponse } from 'next/server';
import { prisma } from '@/src/lib/db';
import { verifyAdminSessionToken, COOKIE_NAME } from '@/src/lib/admin-auth';
import { cookies } from 'next/headers';

const STATUSES = ['NEW', 'READ'] as const;

function parsePage(raw: string | null): number {
  const n = parseInt(raw ?? '1', 10);
  return Number.isFinite(n) && n >= 1 ? n : 1;
}

function parsePageSize(raw: string | null): number {
  const n = parseInt(raw ?? '20', 10);
  if (!Number.isFinite(n)) return 20;
  return Math.min(100, Math.max(1, n));
}

/** Enquiries contain PII — admin session required for all methods. */
export async function GET(req: Request) {
  const store = await cookies();
  if (!verifyAdminSessionToken(store.get(COOKIE_NAME)?.value)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const { searchParams } = new URL(req.url);
  const page = parsePage(searchParams.get('page'));
  const pageSize = parsePageSize(searchParams.get('pageSize'));
  const statusParam = searchParams.get('status');
  const status =
    typeof statusParam === 'string' &&
    statusParam !== 'ALL' &&
    (STATUSES as readonly string[]).includes(statusParam)
      ? statusParam
      : null;
  const q = searchParams.get('q')?.trim() ?? '';

  const where: Prisma.EnquiryWhereInput = {};
  if (status) where.status = status;
  if (q.length > 0) {
    where.OR = [
      { name: { contains: q, mode: 'insensitive' } },
      { phone: { contains: q, mode: 'insensitive' } },
      { email: { contains: q, mode: 'insensitive' } },
      { subject: { contains: q, mode: 'insensitive' } },
      { message: { contains: q, mode: 'insensitive' } },
    ];
  }

  try {
    const [total, items] = await Promise.all([
      prisma.enquiry.count({ where }),
      prisma.enquiry.findMany({
        where,
        orderBy: { createdAt: 'desc' },
        skip: (page - 1) * pageSize,
        take: pageSize,
      }),
    ]);
    return NextResponse.json({ items, total, page, pageSize });
  } catch (e) {
    console.error('[GET /api/admin/enquiries]', e);
    return NextResponse.json({ error: 'Failed to load enquiries' }, { status: 500 });
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

  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: 'Invalid JSON' }, { status: 400 });
  }

  const o = body && typeof body === 'object' ? (body as Record<string, unknown>) : {};
  const status =
    typeof o.status === 'string' && (STATUSES as readonly string[]).includes(o.status)
      ? o.status
      : null;

  if (!status) {
    return NextResponse.json(
      { error: `Valid status required: ${STATUSES.join(', ')}` },
      { status: 400 },
    );
  }

  try {
    const updated = await prisma.enquiry.update({
      where: { id },
      data: { status },
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

  try {
    await prisma.enquiry.delete({ where: { id } });
    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json({ error: 'Delete failed' }, { status: 400 });
  }
}
