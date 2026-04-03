'use client';

import React, { useCallback, useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Plus, Save, Trash2 } from 'lucide-react';

type IndustryRow = {
  id: string;
  name: string;
  iconKey: string;
  sortOrder: number;
  _isNew?: boolean;
  _clientId?: string;
};

function sortRows(a: IndustryRow, b: IndustryRow) {
  return a.sortOrder - b.sortOrder;
}

export default function AdminIndustries() {
  const router = useRouter();
  const [items, setItems] = useState<IndustryRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState<string | null>(null);
  const [savingId, setSavingId] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/admin/industries', { credentials: 'include' });
      if (res.status === 401) {
        router.replace('/admin/login');
        return;
      }
      const data: IndustryRow[] = await res.json();
      setItems(data.sort(sortRows).map((r) => ({ ...r })));
    } catch {
      setMessage('Could not load industry items.');
    } finally {
      setLoading(false);
    }
  }, [router]);

  useEffect(() => {
    load();
  }, [load]);

  function updateRow(key: string, patch: Partial<IndustryRow>) {
    setItems((prev) =>
      prev.map((r) => {
        const k = r._isNew ? r._clientId! : r.id;
        return k === key ? { ...r, ...patch } : r;
      }),
    );
  }

  function rowKey(r: IndustryRow) {
    return r._isNew ? r._clientId! : r.id;
  }

  async function saveRow(row: IndustryRow) {
    const key = rowKey(row);
    setSavingId(key);
    setBusy(true);
    setMessage('Saving…');

    try {
      if (row._isNew) {
        if (!row.name.trim()) {
          setMessage('Name is required before saving a new card.');
          setSavingId(null);
          setBusy(false);
          return;
        }
        const res = await fetch('/api/admin/industries', {
          method: 'POST',
          credentials: 'include',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            name: row.name.trim(),
            iconKey: row.iconKey || 'Factory',
            sortOrder:
              typeof row.sortOrder === 'number' && Number.isFinite(row.sortOrder)
                ? row.sortOrder
                : 0,
          }),
        });
        const j = await res.json().catch(() => ({}));
        if (!res.ok) {
          setMessage((j as { error?: string }).error ?? 'Create failed');
          return;
        }
        setMessage('Industry saved — it is ordered first on the website.');
      } else {
        const res = await fetch(`/api/admin/industries?id=${encodeURIComponent(row.id)}`, {
          method: 'PATCH',
          credentials: 'include',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            name: row.name.trim(),
            iconKey: row.iconKey || 'Factory',
            sortOrder:
              typeof row.sortOrder === 'number' && Number.isFinite(row.sortOrder)
                ? row.sortOrder
                : 0,
          }),
        });
        const j = await res.json().catch(() => ({}));
        if (!res.ok) {
          setMessage((j as { error?: string }).error ?? 'Update failed');
          return;
        }
        setMessage('Saved.');
      }
      setTimeout(() => setMessage(null), 3000);
      await load();
    } finally {
      setSavingId(null);
      setBusy(false);
    }
  }

  async function deleteRow(row: IndustryRow) {
    if (row._isNew) {
      setItems((prev) => prev.filter((r) => rowKey(r) !== rowKey(row)));
      return;
    }
    if (!confirm(`Delete “${row.name}”? This cannot be undone.`)) return;
    setBusy(true);
    setMessage('Deleting…');
    const res = await fetch(`/api/admin/industries?id=${encodeURIComponent(row.id)}`, {
      method: 'DELETE',
      credentials: 'include',
    });
    if (!res.ok) {
      setMessage('Delete failed');
      setBusy(false);
      return;
    }
    setMessage('Removed.');
    setTimeout(() => setMessage(null), 3000);
    setBusy(false);
    await load();
  }

  function addIndustry() {
    setItems((prev) => {
      const nextSortOrder =
        prev.length === 0 ? 0 : Math.min(...prev.map((r) => r.sortOrder)) - 1;
      const newRow: IndustryRow = {
        id: '',
        name: '',
        iconKey: 'Factory',
        sortOrder: nextSortOrder,
        _isNew: true,
        _clientId:
          typeof crypto !== 'undefined' && crypto.randomUUID
            ? crypto.randomUUID()
            : `tmp-${Date.now()}`,
      };
      return [newRow, ...prev];
    });
    window.alert(
      'New industry card added.\n\nIt is placed first in the list and will appear first on the website after you click Create card.\n\nEnter the industry name and save.',
    );
  }

  if (loading) {
    return <p className="p-8 text-center text-muted-grey">Loading industries…</p>;
  }

  return (
    <div className="relative space-y-8">
      {(busy || message === 'Saving…' || message === 'Deleting…' || savingId) && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-navy/20 backdrop-blur-[2px]">
          <div className="flex flex-col items-center gap-4 rounded-3xl border border-border-grey bg-white p-8 shadow-2xl">
            <div className="h-12 w-12 animate-spin rounded-full border-4 border-machine-orange border-t-transparent" />
            <p className="text-lg font-bold text-navy">
              {savingId ? 'Saving…' : 'Working…'}
            </p>
          </div>
        </div>
      )}

      <section>
        <div className="mb-4 flex flex-wrap items-end justify-between gap-4">
          <div>
            <h2 className="text-xl font-bold text-navy">Industries</h2>
            <p className="text-sm text-muted-grey">
              Same workflow as Expertise: edit each card inline, then Save. New cards use the default icon on the site.
            </p>
          </div>
          <button
            type="button"
            onClick={addIndustry}
            className="inline-flex items-center gap-2 rounded-xl bg-machine-orange px-4 py-2.5 text-sm font-bold text-white shadow hover:opacity-95"
          >
            <Plus className="h-4 w-4" />
            Add industry
          </button>
        </div>

        <div className="rounded-2xl border border-border-grey/60 bg-bg-steel/30 px-4 py-8 sm:px-6">
          <div className="mx-auto grid max-w-7xl grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {items.map((row) => {
              const key = rowKey(row);
              const initial = row.name.trim().slice(0, 1).toUpperCase() || '?';

              return (
                <div
                  key={key}
                  className="flex flex-col overflow-hidden rounded-3xl border border-white bg-white/80 shadow-sm backdrop-blur-md transition-all duration-300 hover:border-machine-orange/30 hover:shadow-xl"
                >
                  <div className="relative flex aspect-[4/3] items-center justify-center rounded-t-3xl bg-gradient-to-br from-navy/90 to-steel/80">
                    <span className="text-5xl font-black text-white/25">{initial}</span>
                    <div className="absolute bottom-3 right-3">
                      <button
                        type="button"
                        onClick={() => deleteRow(row)}
                        className="rounded-xl bg-white/15 p-2 text-white transition-colors hover:bg-red-500"
                        aria-label="Delete card"
                      >
                        <Trash2 className="h-5 w-5" />
                      </button>
                    </div>
                  </div>

                  <div className="flex flex-1 flex-col gap-3 bg-white p-5">
                    {row._isNew ? (
                      <p className="text-[10px] font-bold uppercase tracking-wide text-muted-grey">
                        New — ID is assigned when you create
                      </p>
                    ) : (
                      <p className="font-mono text-[10px] text-muted-grey">id: {row.id}</p>
                    )}

                    <label className="block">
                      <span className="text-[10px] font-bold uppercase tracking-wide text-muted-grey">
                        Name
                      </span>
                      <input
                        className="mt-1 w-full rounded-lg border border-border-grey px-2 py-2 text-sm font-extrabold text-navy"
                        value={row.name}
                        onChange={(e) => updateRow(key, { name: e.target.value })}
                        placeholder="e.g. Power sector"
                      />
                    </label>

                    <label className="block">
                      <span className="text-[10px] font-bold uppercase tracking-wide text-muted-grey">
                        Sort order
                      </span>
                      <input
                        type="number"
                        className="mt-1 w-full max-w-[8rem] rounded-lg border border-border-grey px-2 py-2 text-sm text-navy"
                        value={row.sortOrder}
                        onChange={(e) => updateRow(key, { sortOrder: Number(e.target.value) })}
                      />
                    </label>

                    <button
                      type="button"
                      disabled={!!savingId}
                      onClick={() => saveRow(row)}
                      className="mt-1 inline-flex items-center justify-center gap-2 rounded-xl bg-navy px-4 py-2.5 text-sm font-bold text-white hover:opacity-95 disabled:opacity-50"
                    >
                      <Save className="h-4 w-4" />
                      {row._isNew ? 'Create card' : 'Save changes'}
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {message &&
        message !== 'Saving…' &&
        message !== 'Deleting…' &&
        !savingId && (
          <div className="fixed bottom-8 right-8 animate-in fade-in slide-in-from-bottom-4 rounded-xl bg-navy px-6 py-3 text-sm font-semibold text-white shadow-2xl">
            {message}
          </div>
        )}
    </div>
  );
}
