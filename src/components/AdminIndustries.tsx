'use client';

import React, { useCallback, useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'motion/react';
import { Pencil, Plus, Save, Trash2 } from 'lucide-react';
import { mergeCatalogIntoDbIndustryAdminRows } from '@/src/lib/industry-display';
import { cn } from '@/src/lib/utils';

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
  const [editingKey, setEditingKey] = useState<string | null>(null);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/admin/industries', { credentials: 'include' });
      if (res.status === 401) {
        router.replace('/admin/login');
        return;
      }
      const text = await res.text();
      let parsed: unknown;
      try {
        parsed = text.trim() ? JSON.parse(text) : [];
      } catch {
        setMessage('Could not load industry items.');
        setItems([]);
        return;
      }
      if (!res.ok || !Array.isArray(parsed)) {
        setMessage('Could not load industry items.');
        setItems([]);
        return;
      }
      const normalized = (parsed as IndustryRow[])
        .sort(sortRows)
        .map((r) => ({ ...r, iconKey: r.iconKey || 'Factory' }));
      setItems(mergeCatalogIntoDbIndustryAdminRows(normalized).sort(sortRows));
    } catch {
      setMessage('Could not load industry items.');
    } finally {
      setLoading(false);
      setEditingKey(null);
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

  function isRowEditing(row: IndustryRow): boolean {
    if (row._isNew) return true;
    return editingKey === rowKey(row);
  }

  async function saveRow(row: IndustryRow) {
    const key = rowKey(row);
    setSavingId(key);
    setBusy(true);
    setMessage('Saving…');

    try {
      if (row._isNew) {
        if (!row.name.trim()) {
          setMessage('Name is required before saving a new row.');
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
        setMessage('Industry saved.');
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
      setEditingKey(null);
    } finally {
      setSavingId(null);
      setBusy(false);
    }
  }

  function handleSaveOrEdit(row: IndustryRow) {
    const key = rowKey(row);
    if (row._isNew) {
      void saveRow(row);
      return;
    }
    if (editingKey === key) void saveRow(row);
    else setEditingKey(key);
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
    const cid =
      typeof crypto !== 'undefined' && crypto.randomUUID
        ? crypto.randomUUID()
        : `tmp-${Date.now()}`;
    setItems((prev) => {
      const nextSortOrder =
        prev.length === 0 ? 0 : Math.min(...prev.map((r) => r.sortOrder)) - 1;
      const newRow: IndustryRow = {
        id: '',
        name: '',
        iconKey: 'Factory',
        sortOrder: nextSortOrder,
        _isNew: true,
        _clientId: cid,
      };
      return [newRow, ...prev].sort(sortRows);
    });
    setEditingKey(cid);
    window.alert(
      'New industry row added at the top of the table.\n\nEnter the name (and icon key if needed), then click Create row to save to the database.',
    );
  }

  if (loading) {
    return <p className="p-8 text-center text-muted-grey">Loading industries…</p>;
  }

  const sortedDisplay = [...items].sort(sortRows);

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
        <p className="mb-4 text-sm text-muted-grey">
          All sectors are listed in sort order. Rows from the site catalog that are not in the database yet show as{' '}
          <strong className="text-navy">Pending</strong> — use Create row to save them.
        </p>

        <div className="mb-4 flex flex-wrap justify-end gap-4">
          <button
            type="button"
            onClick={addIndustry}
            className="inline-flex items-center gap-2 rounded-xl bg-machine-orange px-4 py-2.5 text-sm font-bold text-white shadow hover:opacity-95"
          >
            <Plus className="h-4 w-4" />
            Add industry
          </button>
        </div>

        <div className="overflow-x-auto rounded-2xl border border-border-grey/60 bg-white shadow-sm">
          <table className="w-full min-w-[720px] border-collapse text-left text-sm">
            <thead>
              <tr className="border-b border-border-grey bg-bg-steel/50 text-[10px] font-black uppercase tracking-widest text-muted-grey">
                <th className="w-12 px-3 py-3 text-center" scope="col">
                  Sr.
                </th>
                <th className="min-w-[12rem] px-3 py-3" scope="col">
                  Name
                </th>
                <th className="min-w-[8rem] px-3 py-3" scope="col">
                  Icon key
                </th>
                <th className="w-28 px-3 py-3" scope="col">
                  Sort
                </th>
                <th className="min-w-[7rem] px-3 py-3" scope="col">
                  Source
                </th>
                <th className="min-w-[11rem] px-3 py-3 text-right" scope="col">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody>
              {sortedDisplay.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-4 py-12 text-center text-muted-grey">
                    No industries loaded.
                  </td>
                </tr>
              ) : (
                sortedDisplay.map((row, index) => {
                  const key = rowKey(row);
                  const canEdit = isRowEditing(row);
                  const serial = index + 1;

                  return (
                    <tr
                      key={key}
                      className={cn(
                        'border-b border-border-grey/80 transition-colors',
                        canEdit ? 'bg-orange-light/30' : 'hover:bg-bg-cloud/60',
                      )}
                    >
                      <td className="px-3 py-2 text-center tabular-nums">
                        <span className="inline-flex min-w-[1.75rem] justify-center rounded-md bg-bg-steel/80 px-1.5 py-1 text-xs font-black text-navy">
                          {serial}
                        </span>
                      </td>
                      <td className="px-3 py-2 align-middle">
                        <input
                          readOnly={!canEdit}
                          className="w-full min-w-0 rounded-lg border border-transparent bg-transparent px-1 py-1 text-sm font-bold text-navy read-only:border-transparent read-only:bg-transparent focus:border-machine-orange focus:bg-white focus:outline-none focus:ring-1 focus:ring-machine-orange/30"
                          value={row.name}
                          onChange={(e) => updateRow(key, { name: e.target.value })}
                          placeholder="Industry name"
                        />
                      </td>
                      <td className="px-3 py-2 align-middle">
                        <input
                          readOnly={!canEdit}
                          className="w-full max-w-[10rem] rounded-lg border border-transparent bg-transparent px-1 py-1 font-mono text-xs text-navy read-only:border-transparent read-only:bg-transparent focus:border-machine-orange focus:bg-white focus:outline-none focus:ring-1 focus:ring-machine-orange/30"
                          value={row.iconKey}
                          onChange={(e) => updateRow(key, { iconKey: e.target.value })}
                          placeholder="e.g. Factory"
                        />
                      </td>
                      <td className="px-3 py-2 align-middle">
                        <input
                          readOnly={!canEdit}
                          type="number"
                          className="w-full max-w-[6rem] rounded-lg border border-transparent bg-transparent px-1 py-1 text-sm tabular-nums text-navy read-only:border-transparent read-only:bg-transparent focus:border-machine-orange focus:bg-white focus:outline-none focus:ring-1 focus:ring-machine-orange/30"
                          value={row.sortOrder}
                          onChange={(e) => updateRow(key, { sortOrder: Number(e.target.value) })}
                        />
                      </td>
                      <td className="px-3 py-2 align-middle">
                        {row._isNew ? (
                          <span className="inline-flex rounded-full bg-machine-orange/15 px-2 py-0.5 text-[10px] font-black uppercase tracking-wide text-machine-orange">
                            Pending
                          </span>
                        ) : (
                          <span className="inline-flex rounded-full bg-machine-green/15 px-2 py-0.5 text-[10px] font-black uppercase tracking-wide text-machine-green">
                            Saved
                          </span>
                        )}
                        {!row._isNew ? (
                          <p className="mt-1 font-mono text-[9px] text-muted-grey">id: {row.id}</p>
                        ) : null}
                      </td>
                      <td className="px-3 py-2 align-middle">
                        <div className="flex flex-wrap items-center justify-end gap-2">
                          <button
                            type="button"
                            disabled={!!savingId}
                            onClick={() => handleSaveOrEdit(row)}
                            className="inline-flex items-center gap-1.5 rounded-lg bg-navy px-3 py-2 text-xs font-bold text-white hover:opacity-95 disabled:opacity-50"
                          >
                            {row._isNew || editingKey === key ? (
                              <Save className="h-3.5 w-3.5" />
                            ) : (
                              <Pencil className="h-3.5 w-3.5" />
                            )}
                            {row._isNew ? 'Create row' : editingKey === key ? 'Save' : 'Edit'}
                          </button>
                          <button
                            type="button"
                            onClick={() => deleteRow(row)}
                            className="inline-flex items-center justify-center rounded-lg border border-border-grey bg-white p-2 text-red-600 hover:bg-red-50"
                            title="Remove row"
                            aria-label={`Remove ${row.name || 'industry'}`}
                          >
                            <Trash2 className="h-4 w-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </section>

      {message &&
        message !== 'Saving…' &&
        message !== 'Deleting…' &&
        !savingId && (
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            className="fixed bottom-8 right-8 rounded-xl bg-navy px-6 py-3 text-sm font-semibold text-white shadow-2xl"
          >
            {message}
          </motion.div>
        )}
    </div>
  );
}
