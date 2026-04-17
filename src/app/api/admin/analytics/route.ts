import { NextResponse } from 'next/server';
import { prisma } from '@/src/lib/db';
import { verifyAdminSessionToken, COOKIE_NAME } from '@/src/lib/admin-auth';
import { cookies } from 'next/headers';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

const RANGE_DAYS = 30;

function utcDayKey(d: Date): string {
  return d.toISOString().slice(0, 10);
}

function buildDayRange(end: Date, days: number): string[] {
  const keys: string[] = [];
  const cursor = new Date(Date.UTC(end.getUTCFullYear(), end.getUTCMonth(), end.getUTCDate()));
  for (let i = days - 1; i >= 0; i--) {
    const t = new Date(cursor);
    t.setUTCDate(t.getUTCDate() - i);
    keys.push(utcDayKey(t));
  }
  return keys;
}

export async function GET() {
  const store = await cookies();
  if (!verifyAdminSessionToken(store.get(COOKIE_NAME)?.value)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const now = new Date();
  const rangeStart = new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate()));
  rangeStart.setUTCDate(rangeStart.getUTCDate() - (RANGE_DAYS - 1));
  rangeStart.setUTCHours(0, 0, 0, 0);

  try {
    const [enquiriesInRange, enquiryTotal, profileViewRow] = await Promise.all([
      prisma.enquiry.findMany({
        where: { createdAt: { gte: rangeStart } },
        select: { createdAt: true },
      }),
      prisma.enquiry.count(),
      prisma.profileViewStat.findUnique({
        where: { id: 'default' },
        select: { viewCount: true },
      }),
    ]);

    const dayKeys = buildDayRange(now, RANGE_DAYS);
    const enquiryByDay = new Map<string, number>();
    for (const k of dayKeys) {
      enquiryByDay.set(k, 0);
    }

    for (const e of enquiriesInRange) {
      const k = utcDayKey(e.createdAt);
      if (enquiryByDay.has(k)) enquiryByDay.set(k, (enquiryByDay.get(k) ?? 0) + 1);
    }

    const series = dayKeys.map((date) => ({
      date,
      enquiries: enquiryByDay.get(date) ?? 0,
    }));

    const totalsInRange = {
      enquiries: enquiriesInRange.length,
    };

    return NextResponse.json({
      rangeDays: RANGE_DAYS,
      series,
      totalsInRange,
      totalsAllTime: { enquiries: enquiryTotal },
      profileViewsTotal: profileViewRow?.viewCount ?? 0,
    });
  } catch (e) {
    console.error('[GET /api/admin/analytics]', e);
    return NextResponse.json({ error: 'Failed to load analytics' }, { status: 500 });
  }
}
