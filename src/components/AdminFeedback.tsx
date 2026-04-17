'use client';

import React, { useEffect, useMemo, useRef, useState } from 'react';
import { useRouter } from 'next/navigation';
import {
  Trash2,
  Calendar,
  ChevronRight,
  ChevronDown,
  ChevronLeft,
  Search,
  BarChart3,
} from 'lucide-react';
import { cn } from '@/src/lib/utils';
import { useAdminDialogs } from '@/src/components/admin/AdminDialogProvider';

type FeedbackRow = {
  id: string;
  rating: string;
  name: string;
  message: string;
  createdAt: string;
};

const RATING_ORDER = ['Excellent', 'Very Good', 'Average', 'Poor', 'Terrible'] as const;
const RATING_FILTER_OPTIONS = ['ALL', ...RATING_ORDER] as const;
type RatingFilter = (typeof RATING_FILTER_OPTIONS)[number];

const PAGE_SIZE_OPTIONS = [10, 20, 50] as const;

function formatWhen(iso: string) {
  try {
    return new Date(iso).toLocaleString('en-IN', {
      dateStyle: 'medium',
      timeStyle: 'short',
    });
  } catch {
    return iso;
  }
}

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

function ratingBadgeClass(rating: string) {
  switch (rating) {
    case 'Excellent':
      return 'bg-emerald-500/15 text-emerald-800 ring-1 ring-emerald-500/30';
    case 'Very Good':
      return 'bg-green-500/15 text-green-800 ring-1 ring-green-500/25';
    case 'Average':
      return 'bg-amber/20 text-amber-900 ring-1 ring-amber/35';
    case 'Poor':
      return 'bg-orange-500/15 text-orange-900 ring-1 ring-orange-500/30';
    case 'Terrible':
      return 'bg-red-500/15 text-red-800 ring-1 ring-red-500/30';
    default:
      return 'bg-border-grey/60 text-muted-grey';
  }
}

export default function AdminFeedback() {
  const { confirm } = useAdminDialogs();
  const router = useRouter();
  const [rows, setRows] = useState<FeedbackRow[]>([]);
  const [total, setTotal] = useState(0);
  const [grandTotal, setGrandTotal] = useState(0);
  const [ratingCounts, setRatingCounts] = useState<Record<string, number>>({});
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState<(typeof PAGE_SIZE_OPTIONS)[number]>(20);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState<string | null>(null);
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [debouncedQ, setDebouncedQ] = useState('');
  const [ratingFilter, setRatingFilter] = useState<RatingFilter>('ALL');
  const [listEpoch, setListEpoch] = useState(0);
  const [selectedIds, setSelectedIds] = useState<Set<string>>(() => new Set());
  const [bulkDeleting, setBulkDeleting] = useState(false);
  const prevDebouncedQ = useRef<string | null>(null);

  useEffect(() => {
    const t = window.setTimeout(() => setDebouncedQ(searchQuery.trim()), 300);
    return () => window.clearTimeout(t);
  }, [searchQuery]);

  useEffect(() => {
    let cancelled = false;

    const run = async () => {
      if (prevDebouncedQ.current !== debouncedQ) {
        prevDebouncedQ.current = debouncedQ;
        if (page !== 1) {
          setPage(1);
          return;
        }
      }

      setLoading(true);
      setMessage(null);
      try {
        const params = new URLSearchParams({
          page: String(page),
          pageSize: String(pageSize),
        });
        if (ratingFilter !== 'ALL') params.set('rating', ratingFilter);
        if (debouncedQ) params.set('q', debouncedQ);

        const res = await fetch(`/api/admin/feedback?${params}`, { credentials: 'include' });
        const text = await res.text();
        if (res.status === 401) {
          router.replace('/admin/login');
          return;
        }
        let parsed: unknown;
        try {
          parsed = text.trim() ? JSON.parse(text) : {};
        } catch {
          if (!cancelled) {
            setMessage('Could not load feedback.');
            setRows([]);
            setTotal(0);
          }
          return;
        }
        if (!res.ok) {
          const err =
            typeof parsed === 'object' &&
            parsed !== null &&
            'error' in parsed &&
            typeof (parsed as { error?: string }).error === 'string'
              ? (parsed as { error: string }).error
              : 'Could not load feedback.';
          if (!cancelled) {
            setMessage(err);
            setRows([]);
            setTotal(0);
          }
          return;
        }
        const data = parsed as {
          items?: unknown;
          total?: unknown;
          ratingCounts?: unknown;
          grandTotal?: unknown;
        };
        if (!Array.isArray(data.items) || typeof data.total !== 'number' || typeof data.grandTotal !== 'number') {
          if (!cancelled) {
            setMessage('Could not load feedback.');
            setRows([]);
            setTotal(0);
          }
          return;
        }
        if (cancelled) return;
        setRows(data.items as FeedbackRow[]);
        setTotal(data.total);
        setGrandTotal(data.grandTotal);
        setRatingCounts(
          data.ratingCounts && typeof data.ratingCounts === 'object' && data.ratingCounts !== null
            ? (data.ratingCounts as Record<string, number>)
            : {},
        );
        const maxPage = Math.max(1, Math.ceil(data.total / pageSize));
        if (page > maxPage) setPage(maxPage);
      } catch {
        if (!cancelled) {
          setMessage('Could not load feedback.');
          setRows([]);
          setTotal(0);
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    };

    void run();
    return () => {
      cancelled = true;
    };
  }, [router, page, pageSize, ratingFilter, debouncedQ, listEpoch]);

  useEffect(() => {
    setSelectedIds(new Set());
  }, [page, pageSize, ratingFilter, debouncedQ]);

  useEffect(() => {
    setSelectedIds((prev) => {
      const next = new Set<string>();
      for (const id of prev) {
        if (rows.some((r) => r.id === id)) next.add(id);
      }
      return next;
    });
  }, [rows]);

  useEffect(() => {
    if (expandedId && !rows.some((r) => r.id === expandedId)) {
      setExpandedId(null);
    }
  }, [expandedId, rows]);

  /** Counts every stored row (not affected by search / table filter). */
  const ratingDistribution = useMemo(() => {
    const counts: Record<string, number> = {};
    for (const label of RATING_ORDER) counts[label] = ratingCounts[label] ?? 0;
    let other = 0;
    for (const [k, v] of Object.entries(ratingCounts)) {
      if (!(RATING_ORDER as readonly string[]).includes(k)) other += v;
    }
    const bars: { label: string; count: number }[] = RATING_ORDER.map((label) => ({
      label,
      count: counts[label] ?? 0,
    }));
    if (other > 0) {
      bars.push({ label: 'Other', count: other });
    }
    const max = Math.max(1, ...bars.map((b) => b.count));
    return { bars, max };
  }, [ratingCounts]);

  function toggleRow(id: string) {
    setExpandedId((prev) => (prev === id ? null : id));
  }

  async function remove(id: string, name: string) {
    const ok = await confirm({
      title: 'Delete feedback?',
      message: `Delete feedback from “${name}”? This cannot be undone.`,
      confirmText: 'Delete',
    });
    if (!ok) return;
    setMessage(null);
    try {
      const res = await fetch(`/api/admin/feedback?id=${encodeURIComponent(id)}`, {
        method: 'DELETE',
        credentials: 'include',
      });
      if (!res.ok) {
        const data = (await res.json().catch(() => ({}))) as { error?: string };
        setMessage(data.error ?? 'Delete failed.');
        return;
      }
      setSelectedIds((prev) => {
        const n = new Set(prev);
        n.delete(id);
        return n;
      });
      setExpandedId((prev) => (prev === id ? null : prev));
      setListEpoch((n) => n + 1);
    } catch {
      setMessage('Delete failed.');
    }
  }

  async function bulkRemove() {
    const ids = [...selectedIds];
    if (ids.length === 0) return;
    const ok = await confirm({
      title: `Delete ${ids.length} feedback ${ids.length === 1 ? 'item' : 'items'}?`,
      message:
        'Permanently remove the selected feedback from the database. This cannot be undone.\n\nOnly the rows you checked on this page are included (up to 100 per action).',
      confirmText: 'Delete all',
    });
    if (!ok) return;
    setBulkDeleting(true);
    setMessage(null);
    try {
      const res = await fetch('/api/admin/feedback/bulk-delete', {
        method: 'POST',
        credentials: 'include',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ids }),
      });
      const data = (await res.json().catch(() => ({}))) as { error?: string; deleted?: number };
      if (!res.ok) {
        setMessage(data.error ?? 'Bulk delete failed.');
        return;
      }
      setSelectedIds(new Set());
      setExpandedId(null);
      setListEpoch((n) => n + 1);
      setMessage(`Deleted ${typeof data.deleted === 'number' ? data.deleted : ids.length} record(s).`);
      window.setTimeout(() => setMessage(null), 4000);
    } catch {
      setMessage('Bulk delete failed.');
    } finally {
      setBulkDeleting(false);
    }
  }

  function toggleSelect(id: string) {
    setSelectedIds((prev) => {
      const n = new Set(prev);
      if (n.has(id)) n.delete(id);
      else n.add(id);
      return n;
    });
  }

  function toggleSelectAllPage() {
    const onPage = rows.map((r) => r.id);
    const allOn = onPage.length > 0 && onPage.every((id) => selectedIds.has(id));
    if (allOn) {
      setSelectedIds((prev) => {
        const n = new Set(prev);
        onPage.forEach((id) => n.delete(id));
        return n;
      });
    } else {
      setSelectedIds((prev) => {
        const n = new Set(prev);
        onPage.forEach((id) => n.add(id));
        return n;
      });
    }
  }

  const hasActiveFilters = ratingFilter !== 'ALL' || debouncedQ.length > 0;
  const totalPages = Math.max(1, Math.ceil(total / pageSize));
  const rangeFrom = total === 0 ? 0 : (page - 1) * pageSize + 1;
  const rangeTo = Math.min(page * pageSize, total);

  if (loading && rows.length === 0 && grandTotal === 0) {
    return <p className="p-8 text-center text-muted-grey">Loading feedback…</p>;
  }

  return (
    <div className="relative space-y-6">
      <section>
        {message ? (
          <p
            className={cn(
              'mb-4 rounded-xl border px-4 py-3 text-sm font-semibold',
              message.startsWith('Deleted')
                ? 'border-emerald-200 bg-emerald-50 text-emerald-900'
                : 'border-red-200 bg-red-50 text-red-800',
            )}
            role="alert"
          >
            {message}
          </p>
        ) : null}

        {grandTotal === 0 && !loading ? (
          <div className="rounded-2xl border border-dashed border-border-grey bg-white/80 px-6 py-16 text-center">
            <p className="text-muted-grey">No feedback yet.</p>
            <p className="mt-2 text-sm text-muted-grey">
              Submissions from the website feedback form will appear here.
            </p>
          </div>
        ) : (
          <>
            <section
              className="mb-8 rounded-2xl border border-border-grey bg-white p-6 shadow-sm md:p-8"
              aria-labelledby="feedback-rating-analytics-heading"
            >
              <div className="mb-6 flex flex-wrap items-end justify-between gap-3">
                <div>
                  <h2
                    id="feedback-rating-analytics-heading"
                    className="flex items-center gap-2 text-base font-black text-navy md:text-lg"
                  >
                    <BarChart3 className="h-5 w-5 shrink-0 text-machine-orange" aria-hidden />
                    Rating analytics
                  </h2>
                  <p className="mt-1 text-xs text-muted-grey md:text-sm">
                    Excellent → Terrible: counts across <strong className="text-navy">all</strong> stored feedback
                    (not filtered by search).
                  </p>
                </div>
              </div>

              <div className="grid gap-10 lg:grid-cols-2 lg:gap-8">
                <div>
                  <h3 className="text-[10px] font-black uppercase tracking-widest text-muted-grey">
                    Bar graph
                  </h3>
                  <div className="mt-4 flex h-52 items-end justify-between gap-1.5 sm:gap-3">
                    {ratingDistribution.bars.map(({ label, count }) => {
                      const hPct =
                        ratingDistribution.max > 0
                          ? Math.round((count / ratingDistribution.max) * 100)
                          : 0;
                      return (
                        <div
                          key={label}
                          className="flex min-w-0 flex-1 flex-col items-center gap-2"
                          title={`${label}: ${count}`}
                        >
                          <div className="flex h-44 w-full max-w-[4.5rem] items-end justify-center rounded-t-xl border border-border-grey/60 bg-bg-steel/40 px-1 pt-1">
                            <div
                              className={cn(
                                'w-full min-h-[6px] max-w-[3rem] rounded-t-md shadow-sm transition-all',
                                ratingBarColor(label),
                              )}
                              style={{
                                height: `${Math.max(hPct, count > 0 ? 12 : 0)}%`,
                              }}
                            />
                          </div>
                          <span className="max-w-[4.5rem] text-center text-[9px] font-bold leading-tight text-navy sm:text-[10px]">
                            {label}
                          </span>
                          <span className="text-sm font-black tabular-nums text-machine-orange">{count}</span>
                        </div>
                      );
                    })}
                  </div>
                </div>

                <div>
                  <h3 className="text-[10px] font-black uppercase tracking-widest text-muted-grey">
                    Horizontal distribution
                  </h3>
                  <ul className="mt-4 space-y-3">
                    {ratingDistribution.bars.map(({ label, count }) => (
                      <li key={`h-${label}`}>
                        <div className="mb-1 flex justify-between text-xs font-bold text-navy">
                          <span>{label}</span>
                          <span className="tabular-nums text-muted-grey">{count}</span>
                        </div>
                        <div className="h-2.5 overflow-hidden rounded-full bg-bg-steel/80">
                          <div
                            className={cn('h-full rounded-full transition-all', ratingBarColor(label))}
                            style={{
                              width: `${ratingDistribution.max > 0 ? (count / ratingDistribution.max) * 100 : 0}%`,
                            }}
                          />
                        </div>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </section>

            <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:flex-wrap sm:items-center">
              <div className="relative min-w-0 flex-1 sm:min-w-[16rem] sm:max-w-md">
                <Search
                  className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-grey"
                  aria-hidden
                />
                <input
                  type="search"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search name, rating, message…"
                  className="w-full rounded-xl border border-border-grey bg-white py-2.5 pl-10 pr-3 text-sm text-navy placeholder:text-muted-grey focus:border-machine-orange focus:outline-none focus:ring-1 focus:ring-machine-orange/30"
                  aria-label="Search feedback"
                />
              </div>
              <div className="flex shrink-0 items-center gap-2">
                <label htmlFor="feedback-rating-filter" className="text-xs font-bold uppercase tracking-wide text-muted-grey">
                  Rating
                </label>
                <select
                  id="feedback-rating-filter"
                  value={ratingFilter}
                  onChange={(e) => {
                    setRatingFilter(e.target.value as RatingFilter);
                    setPage(1);
                  }}
                  className="rounded-xl border border-border-grey bg-white px-3 py-2 text-sm font-semibold text-navy focus:border-machine-orange focus:outline-none focus:ring-1 focus:ring-machine-orange/30"
                >
                  {RATING_FILTER_OPTIONS.map((s) => (
                    <option key={s} value={s}>
                      {s === 'ALL' ? 'All ratings' : s}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {total === 0 && hasActiveFilters && !loading ? (
              <div className="rounded-2xl border border-border-grey bg-bg-cloud/50 px-6 py-12 text-center">
                <p className="font-semibold text-navy">No feedback matches your search or filter.</p>
                <p className="mt-2 text-sm text-muted-grey">Try clearing the search or set rating to “All ratings”.</p>
              </div>
            ) : (
              <>
                <div className="mb-3 flex flex-col gap-2 rounded-xl border border-border-grey/80 bg-white px-4 py-3 sm:flex-row sm:items-center sm:justify-between">
                  <p className="text-sm text-muted-grey">
                    {selectedIds.size > 0 ? (
                      <>
                        <span className="font-black tabular-nums text-navy">{selectedIds.size}</span> selected on this
                        page
                      </>
                    ) : (
                      <>Use the checkboxes to select feedback rows, then delete in one step (max 100).</>
                    )}
                  </p>
                  <button
                    type="button"
                    disabled={selectedIds.size === 0 || bulkDeleting || loading}
                    onClick={() => void bulkRemove()}
                    className="inline-flex shrink-0 items-center justify-center gap-2 rounded-xl border border-red-200 bg-red-50 px-4 py-2 text-sm font-bold text-red-700 transition-colors hover:bg-red-100 disabled:cursor-not-allowed disabled:opacity-50"
                  >
                    <Trash2 className="h-4 w-4" aria-hidden />
                    {bulkDeleting ? 'Deleting…' : 'Delete selected'}
                  </button>
                </div>
              <div className="overflow-x-auto rounded-2xl border border-border-grey bg-white shadow-sm">
                <table className="w-full min-w-[860px] border-collapse text-left text-sm">
                  <thead>
                    <tr className="border-b border-border-grey bg-bg-steel/50 text-[10px] font-black uppercase tracking-widest text-muted-grey">
                      <th className="w-10 px-2 py-3 text-center" scope="col">
                        <input
                          type="checkbox"
                          disabled={loading || rows.length === 0 || bulkDeleting}
                          checked={rows.length > 0 && rows.every((r) => selectedIds.has(r.id))}
                          ref={(el) => {
                            if (!el) return;
                            const n = rows.filter((r) => selectedIds.has(r.id)).length;
                            el.indeterminate = n > 0 && n < rows.length;
                          }}
                          onChange={() => toggleSelectAllPage()}
                          className="h-4 w-4 rounded border-border-grey text-machine-orange focus:ring-machine-orange"
                          aria-label="Select all on this page"
                        />
                      </th>
                      <th className="w-12 whitespace-nowrap px-2 py-3 text-center" scope="col">
                        Sr.
                      </th>
                      <th className="w-10 px-2 py-3" scope="col">
                        <span className="sr-only">Expand</span>
                      </th>
                      <th className="whitespace-nowrap px-3 py-3" scope="col">
                        Received
                      </th>
                      <th className="min-w-[8rem] px-3 py-3" scope="col">
                        Name
                      </th>
                      <th className="min-w-[7rem] px-3 py-3" scope="col">
                        Rating
                      </th>
                      <th className="min-w-[12rem] px-3 py-3" scope="col">
                        Message
                      </th>
                      <th className="w-24 px-2 py-3 text-center" scope="col">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {rows.map((row, index) => {
                      const open = expandedId === row.id;
                      const serial = (page - 1) * pageSize + index + 1;
                      const preview =
                        row.message.trim().length > 80
                          ? `${row.message.trim().slice(0, 80)}…`
                          : row.message.trim() || '—';
                      return (
                        <React.Fragment key={row.id}>
                          <tr
                            className={cn(
                              'border-b border-border-grey/80 transition-colors',
                              open ? 'bg-orange-light/40' : 'hover:bg-bg-cloud/80',
                            )}
                          >
                            <td className="px-2 py-2 align-middle text-center">
                              <input
                                type="checkbox"
                                checked={selectedIds.has(row.id)}
                                disabled={bulkDeleting}
                                onChange={() => toggleSelect(row.id)}
                                onClick={(e) => e.stopPropagation()}
                                className="h-4 w-4 rounded border-border-grey text-machine-orange focus:ring-machine-orange"
                                aria-label={`Select feedback from ${row.name}`}
                              />
                            </td>
                            <td className="px-2 py-2 align-middle text-center tabular-nums">
                              <span className="inline-flex min-w-[1.75rem] justify-center rounded-md bg-bg-steel/80 px-1.5 py-1 text-xs font-black text-navy">
                                {serial}
                              </span>
                            </td>
                            <td className="px-2 py-2 align-middle">
                              <button
                                type="button"
                                onClick={() => toggleRow(row.id)}
                                className="flex h-9 w-9 items-center justify-center rounded-lg text-navy hover:bg-white hover:ring-1 hover:ring-border-grey"
                                aria-expanded={open}
                                aria-controls={`feedback-panel-${row.id}`}
                                id={`feedback-trigger-${row.id}`}
                              >
                                {open ? (
                                  <ChevronDown className="h-5 w-5 shrink-0" aria-hidden />
                                ) : (
                                  <ChevronRight className="h-5 w-5 shrink-0" aria-hidden />
                                )}
                              </button>
                            </td>
                            <td className="whitespace-nowrap px-3 py-2 align-middle text-xs text-muted-grey">
                              <span className="inline-flex items-center gap-1.5">
                                <Calendar className="h-3.5 w-3.5 shrink-0 text-machine-orange/80" aria-hidden />
                                {formatWhen(row.createdAt)}
                              </span>
                            </td>
                            <td className="max-w-[12rem] px-3 py-2 align-middle">
                              <button
                                type="button"
                                onClick={() => toggleRow(row.id)}
                                className="w-full truncate text-left font-bold text-navy hover:text-machine-orange hover:underline"
                              >
                                {row.name}
                              </button>
                            </td>
                            <td className="px-3 py-2 align-middle">
                              <span
                                className={cn(
                                  'inline-flex w-fit rounded-full px-2.5 py-1 text-[10px] font-black uppercase tracking-wide',
                                  ratingBadgeClass(row.rating),
                                )}
                              >
                                {row.rating}
                              </span>
                            </td>
                            <td className="max-w-[18rem] truncate px-3 py-2 align-middle text-muted-grey">{preview}</td>
                            <td className="px-2 py-2 align-middle text-center">
                              <button
                                type="button"
                                onClick={() => remove(row.id, row.name)}
                                className="inline-flex items-center justify-center rounded-lg border border-border-grey bg-white p-2 text-red-600 transition-colors hover:bg-red-50"
                                title="Delete feedback"
                                aria-label={`Delete feedback from ${row.name}`}
                              >
                                <Trash2 className="h-4 w-4" aria-hidden />
                              </button>
                            </td>
                          </tr>
                          {open ? (
                            <tr className="border-b border-border-grey bg-bg-cloud/50">
                              <td colSpan={8} className="p-0" id={`feedback-panel-${row.id}`}>
                                <div
                                  className="px-4 py-4 sm:px-6 sm:py-5"
                                  role="region"
                                  aria-labelledby={`feedback-trigger-${row.id}`}
                                >
                                  <pre className="max-h-72 overflow-auto whitespace-pre-wrap break-words rounded-xl border border-border-grey bg-white p-4 text-sm leading-relaxed text-navy">
                                    {row.message.trim() ? row.message : '—'}
                                  </pre>
                                </div>
                              </td>
                            </tr>
                          ) : null}
                        </React.Fragment>
                      );
                    })}
                  </tbody>
                </table>
              </div>
              </>
            )}

            {total > 0 ? (
              <div className="mt-4 flex flex-col gap-3 rounded-2xl border border-border-grey/80 bg-bg-steel/30 px-4 py-3 sm:flex-row sm:items-center sm:justify-between">
                <p className="text-sm text-muted-grey">
                  Showing{' '}
                  <span className="font-bold tabular-nums text-navy">
                    {rangeFrom}–{rangeTo}
                  </span>{' '}
                  of <span className="font-bold tabular-nums text-navy">{total}</span>
                </p>
                <div className="flex flex-wrap items-center gap-3">
                  <label className="flex items-center gap-2 text-xs font-bold uppercase tracking-wide text-muted-grey">
                    Per page
                    <select
                      value={pageSize}
                      onChange={(e) => {
                        const n = Number(e.target.value);
                        if (n === 10 || n === 20 || n === 50) {
                          setPageSize(n);
                          setPage(1);
                        }
                      }}
                      className="rounded-lg border border-border-grey bg-white px-2 py-1.5 text-sm font-semibold text-navy focus:border-machine-orange focus:outline-none focus:ring-1 focus:ring-machine-orange/30"
                    >
                      {PAGE_SIZE_OPTIONS.map((n) => (
                        <option key={n} value={n}>
                          {n}
                        </option>
                      ))}
                    </select>
                  </label>
                  <div className="flex items-center gap-1">
                    <button
                      type="button"
                      disabled={page <= 1 || loading}
                      onClick={() => setPage((p) => Math.max(1, p - 1))}
                      className="inline-flex h-9 w-9 items-center justify-center rounded-lg border border-border-grey bg-white text-navy hover:bg-bg-cloud disabled:cursor-not-allowed disabled:opacity-40"
                      aria-label="Previous page"
                    >
                      <ChevronLeft className="h-5 w-5" aria-hidden />
                    </button>
                    <span className="min-w-[7rem] px-2 text-center text-sm font-semibold tabular-nums text-navy">
                      Page {page} / {totalPages}
                    </span>
                    <button
                      type="button"
                      disabled={page >= totalPages || loading}
                      onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                      className="inline-flex h-9 w-9 items-center justify-center rounded-lg border border-border-grey bg-white text-navy hover:bg-bg-cloud disabled:cursor-not-allowed disabled:opacity-40"
                      aria-label="Next page"
                    >
                      <ChevronRight className="h-5 w-5" aria-hidden />
                    </button>
                  </div>
                </div>
              </div>
            ) : null}
          </>
        )}
      </section>
    </div>
  );
}
