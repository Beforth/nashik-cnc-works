import { NextResponse } from 'next/server';
import { prisma } from '@/src/lib/db';
import {
  normalizedRequestHostname,
  shouldIncrementOfficialProfileView,
} from '@/src/lib/profile-view-official';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

const SINGLETON_ID = 'default';

async function currentViewCount(): Promise<number> {
  const row = await prisma.profileViewStat.findUnique({
    where: { id: SINGLETON_ID },
  });
  return row?.viewCount ?? 0;
}

/**
 * POST: increment profile view count only on the official site (see `shouldIncrementOfficialProfileView`).
 * Always returns `{ count }` for display; increments only when `counted` is true.
 */
export async function POST(req: Request) {
  try {
    const host = normalizedRequestHostname(req.headers.get('host'));
    const counted = shouldIncrementOfficialProfileView(host);

    if (!counted) {
      const count = await currentViewCount();
      return NextResponse.json({ count, counted: false }, { status: 200 });
    }

    const row = await prisma.profileViewStat.upsert({
      where: { id: SINGLETON_ID },
      create: { id: SINGLETON_ID, viewCount: 1 },
      update: { viewCount: { increment: 1 } },
    });
    return NextResponse.json({ count: row.viewCount, counted: true }, { status: 200 });
  } catch (e) {
    console.error('[POST /api/profile-view]', e);
    return NextResponse.json(
      { error: 'Could not update view count.', count: null },
      { status: 500 },
    );
  }
}

/** GET: current count without incrementing (optional diagnostics). */
export async function GET() {
  try {
    const row = await prisma.profileViewStat.findUnique({
      where: { id: SINGLETON_ID },
    });
    return NextResponse.json({ count: row?.viewCount ?? 0 }, { status: 200 });
  } catch (e) {
    console.error('[GET /api/profile-view]', e);
    return NextResponse.json({ error: 'Could not read view count.', count: null }, { status: 500 });
  }
}
