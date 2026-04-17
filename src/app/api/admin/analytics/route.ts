import { NextResponse } from 'next/server';
import { prisma } from '@/src/lib/db';
import { verifyAdminSessionToken, COOKIE_NAME } from '@/src/lib/admin-auth';
import { cookies } from 'next/headers';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

const RANGE_DAYS = 30;

/** Maps UI rating labels to a 1–5 score for averages. */
const RATING_SCORE: Record<string, number> = {
  Excellent: 5,
  'Very Good': 4,
  Average: 3,
  Poor: 2,
  Terrible: 1,
};

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
    const [enquiriesInRange, feedbackInRange, enquiryTotal, feedbackTotal] = await Promise.all([
      prisma.enquiry.findMany({
        where: { createdAt: { gte: rangeStart } },
        select: { createdAt: true },
      }),
      prisma.feedback.findMany({
        where: { createdAt: { gte: rangeStart } },
        select: { createdAt: true, rating: true },
      }),
      prisma.enquiry.count(),
      prisma.feedback.count(),
    ]);

    const dayKeys = buildDayRange(now, RANGE_DAYS);
    const enquiryByDay = new Map<string, number>();
    const feedbackByDay = new Map<string, number>();
    for (const k of dayKeys) {
      enquiryByDay.set(k, 0);
      feedbackByDay.set(k, 0);
    }

    for (const e of enquiriesInRange) {
      const k = utcDayKey(e.createdAt);
      if (enquiryByDay.has(k)) enquiryByDay.set(k, (enquiryByDay.get(k) ?? 0) + 1);
    }
    for (const f of feedbackInRange) {
      const k = utcDayKey(f.createdAt);
      if (feedbackByDay.has(k)) feedbackByDay.set(k, (feedbackByDay.get(k) ?? 0) + 1);
    }

    const series = dayKeys.map((date) => ({
      date,
      enquiries: enquiryByDay.get(date) ?? 0,
      feedback: feedbackByDay.get(date) ?? 0,
    }));

    const feedbackByRating: Record<string, number> = {};
    let scoreSum = 0;
    let scoreCount = 0;
    for (const f of feedbackInRange) {
      const r = f.rating.trim();
      feedbackByRating[r] = (feedbackByRating[r] ?? 0) + 1;
      const s = RATING_SCORE[r];
      if (typeof s === 'number') {
        scoreSum += s;
        scoreCount += 1;
      }
    }

    const totalsInRange = {
      enquiries: enquiriesInRange.length,
      feedback: feedbackInRange.length,
    };

    return NextResponse.json({
      rangeDays: RANGE_DAYS,
      series,
      feedbackByRating,
      totalsInRange,
      totalsAllTime: { enquiries: enquiryTotal, feedback: feedbackTotal },
      averageSatisfactionInRange: scoreCount > 0 ? Math.round((scoreSum / scoreCount) * 10) / 10 : null,
    });
  } catch (e) {
    console.error('[GET /api/admin/analytics]', e);
    return NextResponse.json({ error: 'Failed to load analytics' }, { status: 500 });
  }
}
