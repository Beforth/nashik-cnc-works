'use client';

import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { useRouter } from 'next/navigation';
import { BarChart3, MessageSquare, Star } from 'lucide-react';
import { cn } from '@/src/lib/utils';

type SeriesRow = { date: string; enquiries: number; feedback: number };

type AnalyticsPayload = {
  rangeDays: number;
  series: SeriesRow[];
  feedbackByRating: Record<string, number>;
  totalsInRange: { enquiries: number; feedback: number };
  totalsAllTime: { enquiries: number; feedback: number };
  averageSatisfactionInRange: number | null;
};

const RATING_ORDER = ['Excellent', 'Very Good', 'Average', 'Poor', 'Terrible'] as const;

function ratingBarColor(label: string): string {
  switch (label) {
    case 'Excellent':
      return 'bg-emerald-500';
    case 'Very Good':
      return 'bg-green-500';
    case 'Average':
      return 'bg-amber-500';
    case 'Poor':
      return 'bg-orange-500';
    case 'Terrible':
      return 'bg-red-500';
    default:
      return 'bg-muted-grey';
  }
}

export default function AdminAnalyticsSection() {
  const router = useRouter();
  const [data, setData] = useState<AnalyticsPayload | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const load = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch('/api/admin/analytics', { credentials: 'include' });
      if (res.status === 401) {
        router.replace('/admin/login');
        return;
      }
      const json = (await res.json().catch(() => null)) as AnalyticsPayload & { error?: string };
      if (!res.ok || !json || typeof json !== 'object' || !Array.isArray(json.series)) {
        setError(typeof json?.error === 'string' ? json.error : 'Could not load analytics.');
        setData(null);
        return;
      }
      setData(json as AnalyticsPayload);
    } catch {
      setError('Could not load analytics.');
      setData(null);
    } finally {
      setLoading(false);
    }
  }, [router]);

  useEffect(() => {
    void load();
  }, [load]);

  const maxBar = useMemo(() => {
    if (!data?.series.length) return 1;
    let m = 1;
    for (const d of data.series) {
      m = Math.max(m, d.enquiries + d.feedback, d.enquiries, d.feedback);
    }
    return m;
  }, [data]);

  const ratingBars = useMemo(() => {
    if (!data) return [];
    const raw = data.feedbackByRating;
    const ordered = RATING_ORDER.map((label) => ({
      label,
      count: raw[label] ?? 0,
    }));
    const extra = Object.entries(raw).filter(([k]) => !RATING_ORDER.includes(k as (typeof RATING_ORDER)[number]));
    const extras = extra.map(([label, count]) => ({ label, count }));
    return [...ordered, ...extras];
  }, [data]);

  const maxRating = useMemo(() => Math.max(1, ...ratingBars.map((b) => b.count)), [ratingBars]);

  if (loading) {
    return (
      <section className="rounded-2xl border border-border-grey bg-white p-8 shadow-sm">
        <p className="text-center text-sm font-semibold text-muted-grey">Loading analytics…</p>
      </section>
    );
  }

  if (error || !data) {
    return (
      <section className="rounded-2xl border border-red-200 bg-red-50/80 p-6 shadow-sm">
        <p className="text-center text-sm font-semibold text-red-800">{error ?? 'Analytics unavailable.'}</p>
      </section>
    );
  }

  const { rangeDays, series, totalsInRange, totalsAllTime, averageSatisfactionInRange } = data;

  return (
    <section className="space-y-8">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h2 className="flex items-center gap-2 text-lg font-black text-navy md:text-xl">
            <BarChart3 className="h-6 w-6 text-machine-orange" aria-hidden />
            Analytics
          </h2>
          <p className="mt-1 text-sm text-muted-grey">
            Last {rangeDays} days (UTC days) — enquiries vs feedback volume, and rating mix from feedback.
          </p>
        </div>
        <button
          type="button"
          onClick={() => void load()}
          className="rounded-xl border border-border-grey bg-white px-4 py-2 text-xs font-bold text-navy hover:bg-bg-cloud"
        >
          Refresh
        </button>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <div className="rounded-2xl border border-border-grey bg-white p-5 shadow-sm">
          <div className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-muted-grey">
            <MessageSquare className="h-4 w-4 text-navy" aria-hidden />
            Enquiries ({rangeDays}d)
          </div>
          <p className="mt-2 text-3xl font-black tabular-nums text-navy">{totalsInRange.enquiries}</p>
          <p className="mt-1 text-xs text-muted-grey">All time: {totalsAllTime.enquiries}</p>
        </div>
        <div className="rounded-2xl border border-border-grey bg-white p-5 shadow-sm">
          <div className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-muted-grey">
            <Star className="h-4 w-4 text-machine-orange" aria-hidden />
            Feedback ({rangeDays}d)
          </div>
          <p className="mt-2 text-3xl font-black tabular-nums text-machine-orange">{totalsInRange.feedback}</p>
          <p className="mt-1 text-xs text-muted-grey">All time: {totalsAllTime.feedback}</p>
        </div>
        <div className="rounded-2xl border border-border-grey bg-white p-5 shadow-sm sm:col-span-2 lg:col-span-2">
          <div className="text-[10px] font-black uppercase tracking-widest text-muted-grey">Avg. satisfaction</div>
          <p className="mt-2 text-3xl font-black tabular-nums text-navy">
            {averageSatisfactionInRange != null ? `${averageSatisfactionInRange} / 5` : '—'}
          </p>
          <p className="mt-1 text-xs text-muted-grey">
            From feedback ratings in the last {rangeDays} days (Excellent=5 … Terrible=1).
          </p>
        </div>
      </div>

      <div className="grid gap-8 lg:grid-cols-2">
        <div className="rounded-2xl border border-border-grey bg-white p-6 shadow-sm">
          <h3 className="text-sm font-black uppercase tracking-widest text-navy">Daily volume</h3>
          <p className="mt-1 text-xs text-muted-grey">
            <span className="inline-flex items-center gap-1"><span className="h-2 w-2 rounded-sm bg-navy" /> Enquiries</span>
            {' · '}
            <span className="inline-flex items-center gap-1"><span className="h-2 w-2 rounded-sm bg-machine-orange" /> Feedback</span>
          </p>
          <div className="mt-6 flex h-44 items-end gap-px sm:gap-0.5">
            {series.map((d) => {
              const hE = maxBar > 0 ? Math.round((d.enquiries / maxBar) * 100) : 0;
              const hF = maxBar > 0 ? Math.round((d.feedback / maxBar) * 100) : 0;
              const label = d.date.slice(5);
              return (
                <div
                  key={d.date}
                  className="flex min-w-0 flex-1 flex-col items-center justify-end gap-1"
                  title={`${d.date}: ${d.enquiries} enquiries, ${d.feedback} feedback`}
                >
                  <div className="flex h-[7.5rem] w-full max-w-[14px] items-end justify-center gap-[2px] sm:max-w-[18px]">
                    <div
                      className="w-[42%] min-h-0 rounded-t bg-navy/90 transition-all"
                      style={{ height: `${Math.max(hE, d.enquiries > 0 ? 8 : 0)}%` }}
                    />
                    <div
                      className="w-[42%] min-h-0 rounded-t bg-machine-orange transition-all"
                      style={{ height: `${Math.max(hF, d.feedback > 0 ? 8 : 0)}%` }}
                    />
                  </div>
                  <span className="max-w-full truncate text-[8px] font-bold text-muted-grey sm:text-[9px]" title={d.date}>
                    {label}
                  </span>
                </div>
              );
            })}
          </div>
        </div>

        <div className="rounded-2xl border border-border-grey bg-white p-6 shadow-sm">
          <h3 className="text-sm font-black uppercase tracking-widest text-navy">Feedback by rating</h3>
          <p className="mt-1 text-xs text-muted-grey">Count of submissions in the last {rangeDays} days.</p>
          <ul className="mt-6 space-y-3">
            {ratingBars.map(({ label, count }) => (
              <li key={label}>
                <div className="mb-1 flex justify-between text-xs font-bold text-navy">
                  <span>{label}</span>
                  <span className="tabular-nums text-muted-grey">{count}</span>
                </div>
                <div className="h-2.5 overflow-hidden rounded-full bg-bg-steel/80">
                  <div
                    className={cn('h-full rounded-full transition-all', ratingBarColor(label))}
                    style={{ width: `${maxRating > 0 ? (count / maxRating) * 100 : 0}%` }}
                  />
                </div>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}
