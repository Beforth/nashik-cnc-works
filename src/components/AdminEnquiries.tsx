'use client';

import React, { useCallback, useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Trash2, Calendar, ChevronRight, ChevronDown } from 'lucide-react';
import { cn } from '@/src/lib/utils';

type EnquiryRow = {
  id: string;
  name: string;
  email: string | null;
  phone: string;
  subject: string | null;
  message: string;
  status: string;
  createdAt: string;
};

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

function statusBadgeClass(status: string) {
  switch (status) {
    case 'NEW':
      return 'bg-machine-orange/15 text-machine-orange ring-1 ring-machine-orange/25';
    case 'READ':
      return 'bg-amber/15 text-amber ring-1 ring-amber/30';
    case 'REPLIED':
      return 'bg-machine-green/15 text-machine-green ring-1 ring-machine-green/25';
    case 'ARCHIVED':
      return 'bg-muted-grey/20 text-muted-grey ring-1 ring-border-grey';
    default:
      return 'bg-border-grey/60 text-muted-grey';
  }
}

function statusLabel(status: string) {
  if (status === 'NEW') return 'New';
  if (status === 'READ') return 'Read';
  if (status === 'REPLIED') return 'Replied';
  if (status === 'ARCHIVED') return 'Archived';
  return status;
}

export default function AdminEnquiries() {
  const router = useRouter();
  const [rows, setRows] = useState<EnquiryRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState<string | null>(null);
  const [updatingId, setUpdatingId] = useState<string | null>(null);
  const [expandedId, setExpandedId] = useState<string | null>(null);

  const load = useCallback(async () => {
    setLoading(true);
    setMessage(null);
    try {
      const res = await fetch('/api/admin/enquiries', { credentials: 'include' });
      const text = await res.text();
      if (res.status === 401) {
        router.replace('/admin/login');
        return;
      }
      let parsed: unknown;
      try {
        parsed = text.trim() ? JSON.parse(text) : [];
      } catch {
        setMessage('Could not load enquiries.');
        setRows([]);
        return;
      }
      if (!res.ok) {
        const err =
          typeof parsed === 'object' &&
          parsed !== null &&
          'error' in parsed &&
          typeof (parsed as { error?: string }).error === 'string'
            ? (parsed as { error: string }).error
            : 'Could not load enquiries.';
        setMessage(err);
        setRows([]);
        return;
      }
      if (!Array.isArray(parsed)) {
        setMessage('Could not load enquiries.');
        setRows([]);
        return;
      }
      setRows(parsed as EnquiryRow[]);
    } catch {
      setMessage('Could not load enquiries.');
      setRows([]);
    } finally {
      setLoading(false);
    }
  }, [router]);

  useEffect(() => {
    load();
  }, [load]);

  function toggleRow(id: string) {
    if (expandedId === id) {
      setExpandedId(null);
      return;
    }
    const target = rows.find((r) => r.id === id);
    setExpandedId(id);
    if (target?.status === 'NEW') {
      void setStatus(id, 'READ');
    }
  }

  async function setStatus(id: string, status: string): Promise<boolean> {
    setUpdatingId(id);
    setMessage(null);
    try {
      const res = await fetch(`/api/admin/enquiries?id=${encodeURIComponent(id)}`, {
        method: 'PATCH',
        credentials: 'include',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status }),
      });
      const data = (await res.json().catch(() => ({}))) as { error?: string };
      if (!res.ok) {
        setMessage(data.error ?? 'Could not update status.');
        return false;
      }
      setRows((prev) => prev.map((r) => (r.id === id ? { ...r, status } : r)));
      return true;
    } catch {
      setMessage('Could not update status.');
      return false;
    } finally {
      setUpdatingId(null);
    }
  }

  async function remove(id: string, name: string) {
    if (!confirm(`Delete enquiry from “${name}”? This cannot be undone.`)) return;
    setMessage(null);
    try {
      const res = await fetch(`/api/admin/enquiries?id=${encodeURIComponent(id)}`, {
        method: 'DELETE',
        credentials: 'include',
      });
      if (!res.ok) {
        const data = (await res.json().catch(() => ({}))) as { error?: string };
        setMessage(data.error ?? 'Delete failed.');
        return;
      }
      setRows((prev) => prev.filter((r) => r.id !== id));
      setExpandedId((prev) => (prev === id ? null : prev));
    } catch {
      setMessage('Delete failed.');
    }
  }

  if (loading) {
    return <p className="p-8 text-center text-muted-grey">Loading enquiries…</p>;
  }

  return (
    <div className="relative space-y-6">
      <section>
        {message ? (
          <p
            className="mb-4 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm font-semibold text-red-800"
            role="alert"
          >
            {message}
          </p>
        ) : null}

        <p className="mb-4 text-sm text-muted-grey">
          Sr. is the row order in this table (1 = newest). Status stays <strong className="text-navy">New</strong> until you
          expand the row to view the message; then it becomes <strong className="text-navy">Read</strong> automatically.
        </p>

        {rows.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-border-grey bg-white/80 px-6 py-16 text-center">
            <p className="text-muted-grey">No enquiries yet.</p>
            <p className="mt-2 text-sm text-muted-grey">
              They appear here when visitors submit the form on the website.
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto rounded-2xl border border-border-grey bg-white shadow-sm">
            <table className="w-full min-w-[880px] border-collapse text-left text-sm">
              <thead>
                <tr className="border-b border-border-grey bg-bg-steel/50 text-[10px] font-black uppercase tracking-widest text-muted-grey">
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
                    Phone
                  </th>
                  <th className="min-w-[10rem] px-3 py-3" scope="col">
                    Subject
                  </th>
                  <th className="min-w-[9.5rem] px-3 py-3" scope="col">
                    Status
                  </th>
                  <th className="w-24 px-2 py-3 text-center" scope="col">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody>
                {rows.map((row, index) => {
                  const open = expandedId === row.id;
                  const serial = index + 1;
                  return (
                    <React.Fragment key={row.id}>
                      <tr
                        className={cn(
                          'border-b border-border-grey/80 transition-colors',
                          open ? 'bg-orange-light/40' : 'hover:bg-bg-cloud/80',
                        )}
                      >
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
                            aria-controls={`enquiry-panel-${row.id}`}
                            id={`enquiry-trigger-${row.id}`}
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
                        <td className="max-w-[9rem] truncate px-3 py-2 align-middle font-medium text-navy">
                          <a
                            href={`tel:${row.phone.replace(/\s/g, '')}`}
                            className="hover:text-machine-orange hover:underline"
                            onClick={(e) => e.stopPropagation()}
                          >
                            {row.phone}
                          </a>
                        </td>
                        <td className="max-w-[14rem] truncate px-3 py-2 align-middle text-muted-grey">
                          {row.subject ?? '—'}
                        </td>
                        <td className="min-w-[6rem] px-3 py-2 align-middle">
                          <span
                            className={cn(
                              'inline-flex w-fit rounded-full px-2.5 py-1 text-[10px] font-black uppercase tracking-wide',
                              statusBadgeClass(row.status),
                            )}
                          >
                            {statusLabel(row.status)}
                          </span>
                        </td>
                        <td className="px-2 py-2 align-middle text-center">
                          <button
                            type="button"
                            onClick={() => remove(row.id, row.name)}
                            className="inline-flex items-center justify-center rounded-lg border border-border-grey bg-white p-2 text-red-600 transition-colors hover:bg-red-50"
                            title="Delete enquiry"
                            aria-label={`Delete enquiry from ${row.name}`}
                          >
                            <Trash2 className="h-4 w-4" aria-hidden />
                          </button>
                        </td>
                      </tr>
                      {open ? (
                        <tr className="border-b border-border-grey bg-bg-cloud/50">
                          <td colSpan={8} className="p-0" id={`enquiry-panel-${row.id}`}>
                            <div
                              className="px-4 py-4 sm:px-6 sm:py-5"
                              role="region"
                              aria-labelledby={`enquiry-trigger-${row.id}`}
                            >
                              <pre className="max-h-72 overflow-auto whitespace-pre-wrap break-words rounded-xl border border-border-grey bg-white p-4 text-sm leading-relaxed text-navy">
                                {row.message}
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
        )}
      </section>
    </div>
  );
}
