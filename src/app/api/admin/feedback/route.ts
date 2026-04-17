import type { Prisma } from '@prisma/client';
import { NextResponse } from 'next/server';
import { prisma } from '@/src/lib/db';
import { verifyAdminSessionToken, COOKIE_NAME } from '@/src/lib/admin-auth';
import { cookies } from 'next/headers';

const RATING_LABELS = ['Excellent', 'Very Good', 'Average', 'Poor', 'Terrible'] as const;

function parsePage(raw: string | null): number {
  const n = parseInt(raw ?? '1', 10);
  return Number.isFinite(n) && n >= 1 ? n : 1;
}

function parsePageSize(raw: string | null): number {
  const n = parseInt(raw ?? '20', 10);
  if (!Number.isFinite(n)) return 20;
  return Math.min(100, Math.max(1, n));
}

/** Feedback contains PII — admin session required for all methods. */
export async function GET(req: Request) {
  const store = await cookies();
  if (!verifyAdminSessionToken(store.get(COOKIE_NAME)?.value)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const { searchParams } = new URL(req.url);
  const page = parsePage(searchParams.get('page'));
  const pageSize = parsePageSize(searchParams.get('pageSize'));
  const ratingParam = searchParams.get('rating');
  const rating =
    typeof ratingParam === 'string' &&
    ratingParam !== 'ALL' &&
    (RATING_LABELS as readonly string[]).includes(ratingParam)
      ? ratingParam
      : null;
  const q = searchParams.get('q')?.trim() ?? '';

  const where: Prisma.FeedbackWhereInput = {};
  if (rating) where.rating = rating;
  if (q.length > 0) {
    where.OR = [
      { name: { contains: q, mode: 'insensitive' } },
      { rating: { contains: q, mode: 'insensitive' } },
      { message: { contains: q, mode: 'insensitive' } },
    ];
  }

  try {
    const [total, items, ratingGroups, grandTotal] = await Promise.all([
      prisma.feedback.count({ where }),
      prisma.feedback.findMany({
        where,
        orderBy: { createdAt: 'desc' },
        skip: (page - 1) * pageSize,
        take: pageSize,
      }),
      prisma.feedback.groupBy({
        by: ['rating'],
        _count: { id: true },
      }),
      prisma.feedback.count(),
    ]);

    const ratingCounts: Record<string, number> = {};
    for (const g of ratingGroups) {
      ratingCounts[g.rating] = g._count.id;
    }

    return NextResponse.json({ items, total, page, pageSize, ratingCounts, grandTotal });
  } catch (e) {
    console.error('[GET /api/admin/feedback]', e);
    return NextResponse.json({ error: 'Failed to load feedback' }, { status: 500 });
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
    await prisma.feedback.delete({ where: { id } });
    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json({ error: 'Delete failed' }, { status: 400 });
  }
}
