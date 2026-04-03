'use client';

import React, { useCallback, useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Trash2, Mail, Phone, Clock } from 'lucide-react';

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

export default function AdminEnquiries() {
  const router = useRouter();
  const [rows, setRows] = useState<EnquiryRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/admin/enquiries', { credentials: 'include' });
      if (res.status === 401) {
        router.replace('/admin/login');
        return;
      }
      const data: EnquiryRow[] = await res.json();
      setRows(data);
    } catch {
      setMessage('Could not load enquiries.');
    } finally {
      setLoading(false);
    }
  }, [router]);

  useEffect(() => {
    load();
  }, [load]);

  async function handleStatusChange(id: string, newStatus: string) {
    setBusy(true);
    setMessage('Updating status…');
    const res = await fetch(`/api/admin/enquiries?id=${encodeURIComponent(id)}`, {
      method: 'PATCH',
      credentials: 'include',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status: newStatus }),
    });
    if (!res.ok) {
      const j = await res.json().catch(() => ({}));
      setMessage((j as { error?: string }).error ?? 'Failed to update status');
      setBusy(false);
      setTimeout(() => setMessage(null), 4000);
      return;
    }
    setMessage('Status updated.');
    setTimeout(() => setMessage(null), 3000);
    setBusy(false);
    await load();
  }

  async function handleDelete(id: string) {
    if (!confirm('Delete this enquiry? This cannot be undone.')) return;
    setBusy(true);
    setMessage('Deleting…');
    const res = await fetch(`/api/admin/enquiries?id=${encodeURIComponent(id)}`, {
      method: 'DELETE',
      credentials: 'include',
    });
    if (!res.ok) {
      setMessage('Delete failed');
      setBusy(false);
      return;
    }
    setMessage('Enquiry deleted.');
    setTimeout(() => setMessage(null), 3000);
    setBusy(false);
    await load();
  }

  if (loading) {
    return <p className="p-8 text-center text-muted-grey">Loading enquiries…</p>;
  }

  return (
    <div className="relative space-y-8">
      {(busy || message === 'Updating status…' || message === 'Deleting…') && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-navy/20 backdrop-blur-[2px]">
          <div className="flex flex-col items-center gap-4 rounded-3xl border border-border-grey bg-white p-8 shadow-2xl">
            <div className="h-12 w-12 animate-spin rounded-full border-4 border-machine-orange border-t-transparent" />
            <p className="text-lg font-bold text-navy">Working…</p>
          </div>
        </div>
      )}

      <section>
        <div className="mb-4">
          <h2 className="text-xl font-bold text-navy">Enquiries</h2>
          <p className="text-sm text-muted-grey">
            Form submissions from the site. Same card layout as other admin sections — update status or delete per card.
          </p>
        </div>

        <div className="rounded-2xl border border-border-grey/60 bg-bg-steel/30 px-4 py-8 sm:px-6">
          {rows.length === 0 ? (
            <div className="mx-auto max-w-2xl rounded-3xl border border-white bg-white/80 py-16 text-center shadow-sm">
              <p className="text-muted-grey">No enquiries yet.</p>
            </div>
          ) : (
            <div className="mx-auto grid max-w-7xl grid-cols-1 gap-6 lg:grid-cols-2">
              {rows.map((row) => (
                <div
                  key={row.id}
                  className={`flex flex-col overflow-hidden rounded-3xl border bg-white/80 shadow-sm backdrop-blur-md transition-all sm:min-h-[280px] ${
                    row.status === 'NEW'
                      ? 'border-machine-orange/40 shadow-machine-orange/10'
                      : 'border-white hover:border-machine-orange/20'
                  }`}
                >
                  <div className="flex flex-1 flex-col gap-4 p-6">
                    <div className="flex flex-wrap items-center gap-2">
                      <h3 className="text-lg font-extrabold text-navy">{row.name}</h3>
                      {row.status === 'NEW' && (
                        <span className="rounded-full bg-machine-orange px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider text-white">
                          New
                        </span>
                      )}
                      {row.status === 'READ' && (
                        <span className="rounded-full bg-bg-steel px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider text-navy">
                          Read
                        </span>
                      )}
                      {row.status === 'REPLIED' && (
                        <span className="rounded-full bg-green-100 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider text-green-800">
                          Replied
                        </span>
                      )}
                      {row.status === 'ARCHIVED' && (
                        <span className="rounded-full bg-border-grey px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider text-muted-grey">
                          Archived
                        </span>
                      )}
                    </div>

                    <div className="flex flex-wrap gap-x-6 gap-y-2 text-sm text-muted-grey">
                      <div className="flex items-center gap-1.5">
                        <Clock size={14} className="shrink-0 text-machine-orange" />
                        {new Date(row.createdAt).toLocaleString()}
                      </div>
                      <div className="flex items-center gap-1.5">
                        <Phone size={14} className="shrink-0 text-machine-orange" />
                        <a href={`tel:${row.phone}`} className="hover:text-navy hover:underline">
                          {row.phone}
                        </a>
                      </div>
                      {row.email ? (
                        <div className="flex min-w-0 items-center gap-1.5">
                          <Mail size={14} className="shrink-0 text-machine-orange" />
                          <a
                            href={`mailto:${row.email}`}
                            className="truncate hover:text-navy hover:underline"
                          >
                            {row.email}
                          </a>
                        </div>
                      ) : null}
                    </div>

                    <div className="flex-1 rounded-xl border border-border-grey bg-bg-cloud/50 p-4">
                      {row.subject ? (
                        <h4 className="mb-2 text-sm font-bold text-navy">Subject: {row.subject}</h4>
                      ) : null}
                      <p className="whitespace-pre-wrap text-sm text-navy">{row.message}</p>
                    </div>

                    <div className="flex flex-col gap-2 border-t border-border-grey pt-4 sm:flex-row sm:items-center">
                      <select
                        value={row.status}
                        onChange={(e) => handleStatusChange(row.id, e.target.value)}
                        className="w-full rounded-xl border border-border-grey bg-bg-cloud px-3 py-2.5 text-sm font-semibold text-navy outline-none focus:border-machine-orange focus:ring-1 focus:ring-machine-orange sm:max-w-xs"
                      >
                        <option value="NEW">Mark as New</option>
                        <option value="READ">Mark as Read</option>
                        <option value="REPLIED">Mark as Replied</option>
                        <option value="ARCHIVED">Archive</option>
                      </select>
                      <button
                        type="button"
                        onClick={() => handleDelete(row.id)}
                        className="inline-flex items-center justify-center gap-2 rounded-xl border border-red-200 bg-white px-4 py-2.5 text-sm font-semibold text-red-600 transition-colors hover:bg-red-50 sm:ml-auto"
                      >
                        <Trash2 size={16} /> Delete
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

      {message &&
        message !== 'Updating status…' &&
        message !== 'Deleting…' &&
        !busy && (
          <div className="fixed bottom-8 right-8 animate-in fade-in slide-in-from-bottom-4 rounded-xl bg-navy px-6 py-3 text-sm font-semibold text-white shadow-2xl">
            {message}
          </div>
        )}
    </div>
  );
}
