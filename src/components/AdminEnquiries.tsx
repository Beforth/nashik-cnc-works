'use client';

import React, { useCallback, useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Mail, Phone, Trash2, User, Calendar, Tag } from 'lucide-react';
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

const STATUS_OPTIONS = ['NEW', 'READ', 'REPLIED', 'ARCHIVED'] as const;

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

export default function AdminEnquiries() {
  const router = useRouter();
  const [rows, setRows] = useState<EnquiryRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState<string | null>(null);
  const [updatingId, setUpdatingId] = useState<string | null>(null);

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

  async function setStatus(id: string, status: string) {
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
        return;
      }
      setRows((prev) => prev.map((r) => (r.id === id ? { ...r, status } : r)));
    } catch {
      setMessage('Could not update status.');
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
        <div className="mb-4">
          <h2 className="text-xl font-bold text-navy">Website enquiries</h2>
          <p className="text-sm text-muted-grey">
            Submissions from the public enquiry form on the site. Newest first.
          </p>
        </div>

        {message ? (
          <p
            className="mb-4 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm font-semibold text-red-800"
            role="alert"
          >
            {message}
          </p>
        ) : null}

        {rows.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-border-grey bg-white/80 px-6 py-16 text-center">
            <p className="text-muted-grey">No enquiries yet.</p>
            <p className="mt-2 text-sm text-muted-grey">
              They appear here when visitors submit the form on the website.
            </p>
          </div>
        ) : (
          <ul className="space-y-4">
            {rows.map((row) => (
              <li
                key={row.id}
                className="overflow-hidden rounded-2xl border border-border-grey bg-white shadow-sm"
              >
                <div className="flex flex-col gap-4 border-b border-border-grey/80 bg-bg-steel/40 px-4 py-3 sm:flex-row sm:items-center sm:justify-between">
                  <div className="flex flex-wrap items-center gap-2">
                    <span
                      className={cn(
                        'rounded-full px-2.5 py-0.5 text-[10px] font-black uppercase tracking-wide',
                        row.status === 'NEW'
                          ? 'bg-machine-orange/15 text-machine-orange'
                          : row.status === 'READ'
                            ? 'bg-navy/10 text-navy'
                            : 'bg-muted-grey/15 text-muted-grey',
                      )}
                    >
                      {row.status}
                    </span>
                    <span className="flex items-center gap-1 text-xs text-muted-grey">
                      <Calendar className="h-3.5 w-3.5 shrink-0" aria-hidden />
                      {formatWhen(row.createdAt)}
                    </span>
                  </div>
                  <div className="flex flex-wrap items-center gap-2">
                    <label className="flex items-center gap-2 text-xs font-bold text-muted-grey">
                      Status
                      <select
                        value={row.status}
                        disabled={updatingId === row.id}
                        onChange={(e) => setStatus(row.id, e.target.value)}
                        className="rounded-lg border border-border-grey bg-white px-2 py-1.5 text-sm font-semibold text-navy disabled:opacity-50"
                      >
                        {STATUS_OPTIONS.map((s) => (
                          <option key={s} value={s}>
                            {s}
                          </option>
                        ))}
                      </select>
                    </label>
                    <button
                      type="button"
                      onClick={() => remove(row.id, row.name)}
                      className="inline-flex items-center gap-1 rounded-lg border border-border-grey bg-white px-3 py-1.5 text-xs font-bold text-red-600 transition-colors hover:bg-red-50"
                    >
                      <Trash2 className="h-3.5 w-3.5" aria-hidden />
                      Delete
                    </button>
                  </div>
                </div>

                <div className="space-y-3 p-4 sm:p-5">
                  <div className="flex flex-wrap gap-x-6 gap-y-2">
                    <span className="flex items-center gap-2 text-sm font-bold text-navy">
                      <User className="h-4 w-4 shrink-0 text-machine-orange" aria-hidden />
                      {row.name}
                    </span>
                    <a
                      href={`tel:${row.phone.replace(/\s/g, '')}`}
                      className="flex items-center gap-2 text-sm font-semibold text-navy hover:text-machine-orange hover:underline"
                    >
                      <Phone className="h-4 w-4 shrink-0 text-machine-orange" aria-hidden />
                      {row.phone}
                    </a>
                    {row.email ? (
                      <a
                        href={`mailto:${row.email}`}
                        className="flex min-w-0 items-center gap-2 text-sm font-semibold text-navy hover:text-machine-orange hover:underline"
                      >
                        <Mail className="h-4 w-4 shrink-0 text-machine-orange" aria-hidden />
                        <span className="truncate">{row.email}</span>
                      </a>
                    ) : null}
                  </div>

                  {row.subject ? (
                    <div className="flex items-start gap-2 text-sm">
                      <Tag className="mt-0.5 h-4 w-4 shrink-0 text-muted-grey" aria-hidden />
                      <span className="font-bold text-navy">{row.subject}</span>
                    </div>
                  ) : null}

                  <div>
                    <p className="text-[10px] font-bold uppercase tracking-wide text-muted-grey">
                      Message
                    </p>
                    <pre className="mt-1 whitespace-pre-wrap break-words rounded-xl bg-bg-cloud/80 p-4 text-sm leading-relaxed text-navy">
                      {row.message}
                    </pre>
                  </div>
                </div>
              </li>
            ))}
          </ul>
        )}
      </section>
    </div>
  );
}
