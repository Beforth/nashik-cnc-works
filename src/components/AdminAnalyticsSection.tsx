'use client';

import React, { useCallback, useEffect, useMemo, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { BarChart3, Eye, MessageSquare } from 'lucide-react';

type SeriesRow = { date: string; enquiries: number };

type AnalyticsPayload = {
  rangeDays: number;
  series: SeriesRow[];
  totalsInRange: { enquiries: number };
  totalsAllTime: { enquiries: number };
  profileViewsTotal: number;
};

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
      m = Math.max(m, d.enquiries);
    }
    return m;
  }, [data]);

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

  const { rangeDays, series, totalsInRange, totalsAllTime, profileViewsTotal } = data;
  const viewsDisplay =
    typeof profileViewsTotal === 'number'
      ? profileViewsTotal.toLocaleString('en-IN')
      : String(profileViewsTotal ?? 0);

  return (
    <section className="space-y-8">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h2 className="flex items-center gap-2 text-lg font-black text-navy md:text-xl">
            <BarChart3 className="h-6 w-6 text-machine-orange" aria-hidden />
            Analytics
          </h2>
          <p className="mt-1 text-sm text-muted-grey">
            Last {rangeDays} days (UTC) — enquiry volume and all-time digital profile (/profile) views on the official
            site.
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

      <div className="grid gap-4 sm:grid-cols-2">
        <div className="rounded-2xl border border-border-grey bg-white p-5 shadow-sm">
          <div className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-muted-grey">
            <MessageSquare className="h-4 w-4 text-navy" aria-hidden />
            Enquiries ({rangeDays}d)
          </div>
          <p className="mt-2 text-3xl font-black tabular-nums text-navy">{totalsInRange.enquiries}</p>
          <p className="mt-1 text-xs text-muted-grey">All time: {totalsAllTime.enquiries.toLocaleString('en-IN')}</p>
        </div>
        <div className="rounded-2xl border border-border-grey bg-white p-5 shadow-sm">
          <div className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-muted-grey">
            <Eye className="h-4 w-4 text-machine-orange" aria-hidden />
            Profile views (all time)
          </div>
          <p className="mt-2 text-3xl font-black tabular-nums text-machine-orange">{viewsDisplay}</p>
          <p className="mt-1 text-xs text-muted-grey">Counted only when /profile loads on your official domain.</p>
        </div>
      </div>

      <div className="grid gap-8 lg:grid-cols-2">
        <div className="rounded-2xl border border-border-grey bg-white p-6 shadow-sm">
          <h3 className="text-sm font-black uppercase tracking-widest text-navy">Daily enquiries</h3>
          <p className="mt-1 text-xs text-muted-grey">
            <span className="inline-flex items-center gap-1">
              <span className="h-2 w-2 rounded-sm bg-navy" /> Enquiries per UTC day
            </span>
          </p>
          <div className="mt-6 flex h-44 items-end gap-px sm:gap-0.5">
            {series.map((d) => {
              const hE = maxBar > 0 ? Math.round((d.enquiries / maxBar) * 100) : 0;
              const label = d.date.slice(5);
              return (
                <div
                  key={d.date}
                  className="flex min-w-0 flex-1 flex-col items-center justify-end gap-1"
                  title={`${d.date}: ${d.enquiries} enquiries`}
                >
                  <div className="flex h-[7.5rem] w-full max-w-[18px] items-end justify-center">
                    <div
                      className="w-[70%] min-h-0 rounded-t bg-navy/90 transition-all"
                      style={{ height: `${Math.max(hE, d.enquiries > 0 ? 8 : 0)}%` }}
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
          <h3 className="text-sm font-black uppercase tracking-widest text-navy">Digital profile views</h3>
          <p className="mt-1 text-xs text-muted-grey">
            Total opens of the public <code className="rounded bg-bg-cloud px-1 py-0.5 text-[11px]">/profile</code>{' '}
            page. Increments are applied on the server using your{' '}
            <code className="rounded bg-bg-cloud px-1 py-0.5 text-[11px]">OFFICIAL_SITE_HOSTS</code> / production rules
            so previews and localhost do not inflate the count.
          </p>
          <p className="mt-8 text-center text-5xl font-black tabular-nums text-machine-orange">{viewsDisplay}</p>
          <p className="mt-2 text-center text-xs text-muted-grey">All-time total</p>
          <p className="mt-8 text-center">
            <Link
              href="/profile"
              target="_blank"
              rel="noopener noreferrer"
              className="text-sm font-bold text-machine-orange hover:underline"
            >
              Open live profile →
            </Link>
          </p>
        </div>
      </div>
    </section>
  );
}
