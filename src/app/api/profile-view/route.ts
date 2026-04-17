import { NextResponse } from 'next/server';
import { prisma } from '@/src/lib/db';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

const SINGLETON_ID = 'default';

/**
 * POST: increment profile page view count (call once per `/profile` load from the vCard).
 * Returns `{ count }` using en-IN style grouping is left to the client; here `count` is a number.
 */
export async function POST() {
  try {
    const row = await prisma.profileViewStat.upsert({
      where: { id: SINGLETON_ID },
      create: { id: SINGLETON_ID, viewCount: 1 },
      update: { viewCount: { increment: 1 } },
    });
    return NextResponse.json({ count: row.viewCount }, { status: 200 });
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
