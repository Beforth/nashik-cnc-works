'use client';

import React, { useCallback, useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'motion/react';
import { Pencil, Plus, Save, Trash2, Upload } from 'lucide-react';
import { adminListContainer, adminListItem } from '@/src/lib/admin-motion-variants';
import type { PublicService } from '@/src/types/service';
import { AdminIconKeyField } from '@/src/components/admin/AdminIconKeyField';

const PLACEHOLDER_IMAGE =
  'data:image/svg+xml,' +
  encodeURIComponent(
    `<svg xmlns="http://www.w3.org/2000/svg" width="800" height="600" viewBox="0 0 800 600"><rect fill="#EEF1F6" width="800" height="600"/><text x="50%" y="50%" dominant-baseline="middle" text-anchor="middle" fill="#5A6A7A" font-family="system-ui" font-size="24">Add photo</text></svg>`,
  );

type Row = PublicService & { _isNew?: boolean; _clientId?: string };

function sortRows(a: Row, b: Row) {
  return a.sortOrder - b.sortOrder;
}

export default function AdminDashboard() {
  const router = useRouter();
  const [items, setItems] = useState<Row[]>([]);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState<string | null>(null);
  const [uploadingId, setUploadingId] = useState<string | null>(null);
  const [savingId, setSavingId] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);
  /** Existing cards are view-only until "Edit changes"; new cards are always editable. */
  const [editingKey, setEditingKey] = useState<string | null>(null);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/services', { credentials: 'include' });
      if (res.status === 401) {
        router.replace('/admin/login');
        return;
      }
      const data: PublicService[] = await res.json();
      setItems(
        data.sort(sortRows).map((r) => ({ ...r, iconKey: r.iconKey || 'Wrench' })),
      );
    } catch {
      setMessage('Could not load services.');
    } finally {
      setLoading(false);
      setEditingKey(null);
    }
  }, [router]);

  useEffect(() => {
    load();
  }, [load]);

  function updateRow(key: string, patch: Partial<Row>) {
    setItems((prev) =>
      prev.map((r) => {
        const k = r._isNew ? r._clientId! : r.id;
        return k === key ? { ...r, ...patch } : r;
      }),
    );
  }

  function rowKey(r: Row) {
    return r._isNew ? r._clientId! : r.id;
  }

  function isRowEditing(row: Row): boolean {
    if (row._isNew) return true;
    return editingKey === rowKey(row);
  }

  async function handleReplaceImage(e: React.ChangeEvent<HTMLInputElement>, row: Row) {
    const file = e.target.files?.[0];
    e.target.value = '';
    if (!file) return;

    const key = rowKey(row);
    setUploadingId(key);
    setBusy(true);
    setMessage('Replacing image…');
    try {
      const fd = new FormData();
      fd.append('file', file);
      const res = await fetch('/api/admin/upload', { method: 'POST', body: fd, credentials: 'include' });
      const data = (await res.json().catch(() => ({}))) as { url?: string; error?: string };
      if (!res.ok || !data.url) {
        setMessage(data.error ?? 'Upload failed');
        return;
      }

      if (row._isNew) {
        updateRow(key, { imageUrl: data.url });
        setMessage('Photo added — save the card when text is ready.');
      } else {
        const patchRes = await fetch(`/api/services/${encodeURIComponent(row.id)}`, {
          method: 'PATCH',
          credentials: 'include',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ imageUrl: data.url }),
        });
        if (!patchRes.ok) {
          setMessage('Could not save image URL');
          return;
        }
        updateRow(key, { imageUrl: data.url });
        setMessage('Photo updated.');
      }
      setTimeout(() => setMessage(null), 3000);
    } catch {
      setMessage('Upload failed');
    } finally {
      setUploadingId(null);
      setBusy(false);
    }
  }

  async function saveRow(row: Row) {
    const key = rowKey(row);
    setSavingId(key);
    setBusy(true);
    setMessage('Saving…');

    try {
      if (row._isNew) {
        const id = row.id.trim().toLowerCase().replace(/\s+/g, '-');
        if (!/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(id)) {
          setMessage('Set a valid ID: lowercase letters, numbers, hyphens only.');
          setSavingId(null);
          setBusy(false);
          return;
        }
        if (!row.name.trim() || !row.description.trim()) {
          setMessage('Name and description are required before saving a new card.');
          setSavingId(null);
          setBusy(false);
          return;
        }
        if (!row.imageUrl?.trim() || row.imageUrl.startsWith('data:')) {
          setMessage('Upload a photo (Edit photo) before creating a new card.');
          setSavingId(null);
          setBusy(false);
          return;
        }
        const res = await fetch('/api/services', {
          method: 'POST',
          credentials: 'include',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            id,
            iconKey: row.iconKey,
            name: row.name.trim(),
            imageUrl: row.imageUrl.trim(),
            description: row.description.trim(),
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
        setMessage('Expertise saved — it is ordered first on the website.');
      } else {
        const res = await fetch(`/api/services/${encodeURIComponent(row.id)}`, {
          method: 'PATCH',
          credentials: 'include',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            iconKey: row.iconKey,
            name: row.name.trim(),
            imageUrl: row.imageUrl.trim(),
            description: row.description.trim(),
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

  function handleSaveOrEdit(row: Row) {
    const key = rowKey(row);
    if (row._isNew) {
      void saveRow(row);
      return;
    }
    if (editingKey === key) void saveRow(row);
    else setEditingKey(key);
  }

  async function deleteRow(row: Row) {
    if (row._isNew) {
      setItems((prev) => prev.filter((r) => rowKey(r) !== rowKey(row)));
      return;
    }
    if (!confirm(`Delete “${row.name}”? This cannot be undone.`)) return;
    setBusy(true);
    setMessage('Deleting…');
    const res = await fetch(`/api/services/${encodeURIComponent(row.id)}`, {
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

  function addExpertise() {
    const cid =
      typeof crypto !== 'undefined' && crypto.randomUUID
        ? crypto.randomUUID()
        : `tmp-${Date.now()}`;
    setItems((prev) => {
      const nextSortOrder =
        prev.length === 0 ? 0 : Math.min(...prev.map((r) => r.sortOrder)) - 1;
      const newRow: Row = {
        id: '',
        iconKey: 'Wrench',
        name: '',
        imageUrl: PLACEHOLDER_IMAGE,
        description: '',
        sortOrder: nextSortOrder,
        _isNew: true,
        _clientId: cid,
      };
      return [newRow, ...prev];
    });
    setEditingKey(cid);
    window.alert(
      'New expertise card added.\n\nIt is placed first in the list and will appear first on the website after you click Create card.\n\nUpload a photo, add title and description, then save.',
    );
  }

  if (loading) {
    return <p className="p-8 text-center text-muted-grey">Loading expertise…</p>;
  }

  return (
    <div className="relative space-y-8">
      {(busy ||
        message === 'Saving…' ||
        message === 'Replacing image…' ||
        message === 'Deleting…' ||
        uploadingId) && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-navy/20 backdrop-blur-[2px]">
          <div className="flex flex-col items-center gap-4 rounded-3xl border border-border-grey bg-white p-8 shadow-2xl">
            <div className="h-12 w-12 animate-spin rounded-full border-4 border-machine-orange border-t-transparent" />
            <p className="text-lg font-bold text-navy">
              {uploadingId ? 'Uploading photo…' : savingId ? 'Saving…' : 'Working…'}
            </p>
          </div>
        </div>
      )}

      <section>
        <div className="mb-4 flex flex-wrap justify-start gap-4">
          <button
            type="button"
            onClick={addExpertise}
            className="inline-flex items-center gap-2 rounded-xl bg-machine-orange px-4 py-2.5 text-sm font-bold text-white shadow hover:opacity-95"
          >
            <Plus className="h-4 w-4" />
            Add expertise
          </button>
        </div>

        {/* Mirrors Services section: bg + grid */}
        <div className="rounded-2xl border border-border-grey/60 bg-bg-steel/30 px-4 py-8 sm:px-6">
          <motion.div
            className="mx-auto grid max-w-7xl grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4"
            variants={adminListContainer}
            initial="hidden"
            animate="show"
          >
            {items.map((row) => {
              const key = rowKey(row);
              const src = row.imageUrl?.trim() ? row.imageUrl : PLACEHOLDER_IMAGE;
              const canEditMedia = isRowEditing(row);

              return (
                <motion.div
                  key={key}
                  variants={adminListItem}
                  className="flex flex-col overflow-hidden rounded-3xl border border-white bg-white/80 shadow-sm backdrop-blur-md transition-all duration-300 hover:border-machine-orange/30 hover:shadow-xl"
                >
                  <div className="group relative aspect-[4/3] overflow-hidden rounded-t-3xl bg-bg-cloud">
                    <img src={src} alt="" className="h-full w-full object-cover" />
                    <div className="absolute inset-0 flex items-center justify-center gap-3 bg-navy/60 opacity-0 transition-opacity group-hover:opacity-100">
                      {canEditMedia ? (
                        <>
                          <input
                            type="file"
                            id={`ex-img-${key}`}
                            className="hidden"
                            accept="image/jpeg,image/png,image/webp,image/gif,image/avif"
                            onChange={(e) => handleReplaceImage(e, row)}
                          />
                          <label
                            htmlFor={`ex-img-${key}`}
                            className="flex cursor-pointer items-center gap-2 rounded-xl bg-white px-4 py-2 text-sm font-bold text-navy transition-colors hover:bg-machine-orange hover:text-white"
                          >
                            <Upload className="h-4 w-4" />
                            Edit photo
                          </label>
                        </>
                      ) : null}
                      <button
                        type="button"
                        onClick={() => deleteRow(row)}
                        className="rounded-xl bg-white/10 p-2 text-white transition-colors hover:bg-red-500"
                        aria-label="Delete card"
                      >
                        <Trash2 className="h-5 w-5" />
                      </button>
                    </div>
                  </div>

                  <div className="flex flex-1 flex-col gap-3 bg-white p-5">
                    {row._isNew ? (
                      <label className="block">
                        <span className="text-[10px] font-bold uppercase tracking-wide text-muted-grey">ID (slug)</span>
                        <input
                          readOnly={!isRowEditing(row)}
                          className="mt-1 w-full rounded-lg border border-border-grey px-2 py-1.5 font-mono text-xs text-navy read-only:bg-bg-cloud/80"
                          value={row.id}
                          onChange={(e) => updateRow(key, { id: e.target.value })}
                          placeholder="e.g. vmc-milling"
                        />
                      </label>
                    ) : (
                      <p className="font-mono text-[10px] text-muted-grey">id: {row.id}</p>
                    )}

                    <label className="block">
                      <span className="text-[10px] font-bold uppercase tracking-wide text-muted-grey">Title</span>
                      <input
                        readOnly={!isRowEditing(row)}
                        className="mt-1 w-full rounded-lg border border-border-grey px-2 py-2 text-sm font-extrabold text-navy read-only:bg-bg-cloud/80"
                        value={row.name}
                        onChange={(e) => updateRow(key, { name: e.target.value })}
                      />
                    </label>

                    <div className="block">
                      <span className="text-[10px] font-bold uppercase tracking-wide text-muted-grey">
                        Icon
                      </span>
                      <div className="mt-1">
                        <AdminIconKeyField
                          iconKey={row.iconKey}
                          onChange={(k) => updateRow(key, { iconKey: k })}
                          editable={isRowEditing(row)}
                          fallback="Wrench"
                        />
                      </div>
                    </div>

                    <label className="block flex-1">
                      <span className="text-[10px] font-bold uppercase tracking-wide text-muted-grey">Description</span>
                      <textarea
                        readOnly={!isRowEditing(row)}
                        rows={4}
                        className="mt-1 w-full resize-y rounded-lg border border-border-grey px-2 py-2 text-sm leading-relaxed text-muted-grey read-only:bg-bg-cloud/80"
                        value={row.description}
                        onChange={(e) => updateRow(key, { description: e.target.value })}
                      />
                    </label>

                    <label className="block">
                      <span className="text-[10px] font-bold uppercase tracking-wide text-muted-grey">Sort order</span>
                      <input
                        readOnly={!isRowEditing(row)}
                        type="number"
                        className="mt-1 w-full max-w-[8rem] rounded-lg border border-border-grey px-2 py-2 text-sm text-navy read-only:bg-bg-cloud/80"
                        value={row.sortOrder}
                        onChange={(e) => updateRow(key, { sortOrder: Number(e.target.value) })}
                      />
                    </label>

                    <button
                      type="button"
                      disabled={!!uploadingId || !!savingId}
                      onClick={() => handleSaveOrEdit(row)}
                      className="mt-1 inline-flex items-center justify-center gap-2 rounded-xl bg-navy px-4 py-2.5 text-sm font-bold text-white hover:opacity-95 disabled:opacity-50"
                    >
                      {row._isNew || editingKey === key ? (
                        <Save className="h-4 w-4" />
                      ) : (
                        <Pencil className="h-4 w-4" />
                      )}
                      {row._isNew ? 'Create card' : editingKey === key ? 'Save changes' : 'Edit changes'}
                    </button>
                  </div>
                </motion.div>
              );
            })}
          </motion.div>
        </div>
      </section>

      {message &&
        message !== 'Saving…' &&
        message !== 'Replacing image…' &&
        message !== 'Deleting…' &&
        !uploadingId &&
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
