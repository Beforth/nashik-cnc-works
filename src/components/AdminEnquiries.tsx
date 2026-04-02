'use client';

import React, { useCallback, useEffect, useState } from 'react';
import { Trash2, Mail, Phone, Clock, CheckCircle2 } from 'lucide-react';

export default function AdminEnquiries() {
  const [rows, setRows] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState<string | null>(null);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/admin/enquiries');
      const data = await res.json();
      setRows(data);
    } catch {
      setMessage('Could not load enquiries.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  async function handleStatusChange(id: string, newStatus: string) {
    setMessage('Updating status...');
    const res = await fetch(`/api/admin/enquiries?id=${encodeURIComponent(id)}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status: newStatus }),
    });
    if (!res.ok) {
      setMessage('Failed to update status');
      return;
    }
    setMessage('Status updated.');
    setTimeout(() => setMessage(null), 3000);
    load();
  }

  async function handleDelete(id: string) {
    if (!confirm('Delete this enquiry? This cannot be undone.')) return;
    setMessage('Deleting...');
    const res = await fetch(`/api/admin/enquiries?id=${encodeURIComponent(id)}`, {
      method: 'DELETE',
    });
    if (!res.ok) {
      setMessage('Delete failed');
      return;
    }
    setMessage('Enquiry deleted.');
    setTimeout(() => setMessage(null), 3000);
    load();
  }

  return (
    <div className="mx-auto max-w-5xl relative">
      {(message === 'Updating status...' || message === 'Deleting...') && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-navy/20 backdrop-blur-[2px]">
          <div className="bg-white p-8 rounded-3xl shadow-2xl border border-border-grey flex flex-col items-center gap-4 animate-in zoom-in duration-300">
            <div className="w-12 h-12 border-4 border-machine-orange border-t-transparent rounded-full animate-spin" />
            <p className="text-navy font-bold text-lg">Processing...</p>
          </div>
        </div>
      )}

      <div className="mb-8">
        <h1 className="text-2xl font-extrabold text-navy">Enquiries</h1>
        <p className="mt-1 text-sm text-muted-grey">View and manage messages from the website contact form.</p>
      </div>

      {loading ? (
        <p className="text-muted-grey">Loading…</p>
      ) : rows.length === 0 ? (
        <div className="bg-white rounded-2xl border border-border-grey p-12 text-center shadow-sm">
          <p className="text-muted-grey text-lg">No enquiries found.</p>
        </div>
      ) : (
        <div className="flex flex-col gap-4">
          {rows.map((row) => (
            <div key={row.id} className={`p-6 rounded-2xl border bg-white shadow-sm flex flex-col sm:flex-row gap-6 transition-colors ${row.status === 'NEW' ? 'border-machine-orange/50 shadow-machine-orange/5' : 'border-border-grey'}`}>
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-2">
                  <h3 className="font-extrabold text-lg text-navy">{row.name}</h3>
                  {row.status === 'NEW' && <span className="bg-machine-orange text-white text-[10px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider">New</span>}
                  {row.status === 'READ' && <span className="bg-bg-steel text-navy text-[10px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider">Read</span>}
                  {row.status === 'REPLIED' && <span className="bg-green-100 text-green-800 text-[10px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider">Replied</span>}
                </div>
                
                <div className="flex flex-wrap items-center gap-x-6 gap-y-2 mb-4 text-sm text-muted-grey">
                  <div className="flex items-center gap-1.5"><Clock size={14} className="text-machine-orange" /> {new Date(row.createdAt).toLocaleString()}</div>
                  <div className="flex items-center gap-1.5"><Phone size={14} className="text-machine-orange" /> <a href={`tel:${row.phone}`} className="hover:text-navy hover:underline">{row.phone}</a></div>
                  {row.email && <div className="flex items-center gap-1.5"><Mail size={14} className="text-machine-orange" /> <a href={`mailto:${row.email}`} className="hover:text-navy hover:underline">{row.email}</a></div>}
                </div>

                <div className="bg-bg-cloud/50 p-4 rounded-xl border border-border-grey">
                  {row.subject && <h4 className="font-bold text-navy mb-2 text-sm">Subject: {row.subject}</h4>}
                  <p className="text-navy text-sm whitespace-pre-wrap">{row.message}</p>
                </div>
              </div>

              <div className="flex sm:flex-col items-center gap-2 shrink-0 border-t sm:border-t-0 sm:border-l border-border-grey pt-4 sm:pt-0 sm:pl-6">
                <select 
                  value={row.status}
                  onChange={(e) => handleStatusChange(row.id, e.target.value)}
                  className="bg-bg-cloud border border-border-grey text-navy text-sm rounded-lg px-3 py-2 w-full sm:w-auto focus:border-machine-orange focus:ring-1 focus:ring-machine-orange outline-none"
                >
                  <option value="NEW">Mark as New</option>
                  <option value="READ">Mark as Read</option>
                  <option value="REPLIED">Mark as Replied</option>
                </select>
                <button
                  onClick={() => handleDelete(row.id)}
                  className="flex items-center justify-center gap-2 bg-white border border-red-200 hover:bg-red-50 text-red-600 px-4 py-2 rounded-lg text-sm font-semibold transition-colors w-full sm:w-auto"
                >
                  <Trash2 size={16} /> Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {message && message !== 'Updating status...' && message !== 'Deleting...' && (
        <div className="fixed bottom-8 right-8 bg-navy text-white px-6 py-3 rounded-xl shadow-2xl animate-in fade-in slide-in-from-bottom-4">
          {message}
        </div>
      )}
    </div>
  );
}
