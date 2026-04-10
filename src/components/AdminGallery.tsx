'use client';

import React, { useCallback, useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Plus, Save, Trash2, Upload } from 'lucide-react';

const PLACEHOLDER_IMAGE =
  'data:image/svg+xml,' +
  encodeURIComponent(
    `<svg xmlns="http://www.w3.org/2000/svg" width="800" height="800" viewBox="0 0 800 800"><rect fill="#EEF1F6" width="800" height="800"/><text x="50%" y="50%" dominant-baseline="middle" text-anchor="middle" fill="#5A6A7A" font-family="system-ui" font-size="24">Add photo</text></svg>`,
  );

type GalleryRow = {
  id: string;
  title: string;
  imageUrl: string;
  category: string;
  linkUrl: string | null;
  sortOrder: number;
  _isNew?: boolean;
  _clientId?: string;
};

function sortRows(a: GalleryRow, b: GalleryRow) {
  return a.sortOrder - b.sortOrder;
}

export default function AdminGallery() {
  const router = useRouter();
  const [items, setItems] = useState<GalleryRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState<string | null>(null);
  const [uploadingId, setUploadingId] = useState<string | null>(null);
  const [savingId, setSavingId] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/admin/gallery', { credentials: 'include' });
      const text = await res.text();
      if (res.status === 401) {
        router.replace('/admin/login');
        return;
      }
      let parsed: unknown;
      try {
        parsed = text.trim() ? JSON.parse(text) : [];
      } catch {
        setMessage('Could not load gallery items.');
        setItems([]);
        return;
      }
      if (!res.ok) {
        const err =
          typeof parsed === 'object' &&
          parsed !== null &&
          'error' in parsed &&
          typeof (parsed as { error?: string }).error === 'string'
            ? (parsed as { error: string }).error
            : 'Could not load gallery items.';
        setMessage(err);
        setItems([]);
        return;
      }
      if (!Array.isArray(parsed)) {
        setMessage('Could not load gallery items.');
        setItems([]);
        return;
      }
      const data = parsed as GalleryRow[];
      setItems(
        [...data].sort(sortRows).map((r) => ({
          ...r,
          linkUrl: r.linkUrl ?? null,
        })),
      );
    } catch {
      setMessage('Could not load gallery items.');
      setItems([]);
    } finally {
      setLoading(false);
    }
  }, [router]);

  useEffect(() => {
    load();
  }, [load]);

  function updateRow(key: string, patch: Partial<GalleryRow>) {
    setItems((prev) =>
      prev.map((r) => {
        const k = r._isNew ? r._clientId! : r.id;
        return k === key ? { ...r, ...patch } : r;
      }),
    );
  }

  function rowKey(r: GalleryRow) {
    return r._isNew ? r._clientId! : r.id;
  }

  async function handleReplaceImage(e: React.ChangeEvent<HTMLInputElement>, row: GalleryRow) {
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
        const patchRes = await fetch(`/api/admin/gallery?id=${encodeURIComponent(row.id)}`, {
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

  async function saveRow(row: GalleryRow) {
    const key = rowKey(row);
    setSavingId(key);
    setBusy(true);
    setMessage('Saving…');

    try {
      if (row._isNew) {
        if (!row.title.trim() || !row.category.trim()) {
          setMessage('Title and category are required before saving a new card.');
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
        const linkTrim = row.linkUrl?.trim() || '';
        const res = await fetch('/api/admin/gallery', {
          method: 'POST',
          credentials: 'include',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            title: row.title.trim(),
            imageUrl: row.imageUrl.trim(),
            category: row.category.trim(),
            linkUrl: linkTrim.length > 0 ? linkTrim : null,
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
        setMessage('Jobs Gallery item saved — it is ordered first on the website.');
      } else {
        const linkTrim = row.linkUrl?.trim() || '';
        const res = await fetch(`/api/admin/gallery?id=${encodeURIComponent(row.id)}`, {
          method: 'PATCH',
          credentials: 'include',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            title: row.title.trim(),
            imageUrl: row.imageUrl.trim(),
            category: row.category.trim(),
            linkUrl: linkTrim.length > 0 ? linkTrim : null,
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

  async function deleteRow(row: GalleryRow) {
    if (row._isNew) {
      setItems((prev) => prev.filter((r) => rowKey(r) !== rowKey(row)));
      return;
    }
    if (!confirm(`Delete “${row.title}”? This cannot be undone.`)) return;
    setBusy(true);
    setMessage('Deleting…');
    const res = await fetch(`/api/admin/gallery?id=${encodeURIComponent(row.id)}`, {
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

  function addPhoto() {
    setItems((prev) => {
      const nextSortOrder =
        prev.length === 0 ? 0 : Math.min(...prev.map((r) => r.sortOrder)) - 1;
      const newRow: GalleryRow = {
        id: '',
        title: '',
        imageUrl: PLACEHOLDER_IMAGE,
        category: '',
        linkUrl: null,
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
      'New Jobs Gallery card added.\n\nIt is placed first in the list and will appear first on the website after you click Create card.\n\nUpload a photo, add title and category (optional link URL), then save.',
    );
  }

  if (loading) {
    return <p className="p-8 text-center text-muted-grey">Loading Jobs Gallery…</p>;
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
        <div className="mb-4 flex flex-wrap items-end justify-between gap-4">
          <div>
            <h2 className="text-xl font-bold text-navy">Jobs Gallery</h2>
            <p className="text-sm text-muted-grey">
              Same layout as the homepage gallery. Hover a photo to replace it; edit title, category, and optional link on each card, then Save.
            </p>
          </div>
          <button
            type="button"
            onClick={addPhoto}
            className="inline-flex items-center gap-2 rounded-xl bg-machine-orange px-4 py-2.5 text-sm font-bold text-white shadow hover:opacity-95"
          >
            <Plus className="h-4 w-4" />
            Add gallery card
          </button>
        </div>

        <div className="rounded-2xl border border-border-grey/60 bg-bg-steel/30 px-4 py-8 sm:px-6">
          <div className="mx-auto grid max-w-7xl grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {items.map((row) => {
              const key = rowKey(row);
              const src = row.imageUrl?.trim() ? row.imageUrl : PLACEHOLDER_IMAGE;

              return (
                <div
                  key={key}
                  className="flex flex-col overflow-hidden rounded-3xl border border-white bg-white/80 shadow-sm backdrop-blur-md transition-all duration-300 hover:border-machine-orange/30 hover:shadow-xl"
                >
                  <div className="group relative aspect-square overflow-hidden rounded-t-3xl bg-bg-cloud">
                    <img src={src} alt="" className="h-full w-full object-cover" />
                    <div className="absolute inset-0 flex items-center justify-center gap-3 bg-navy/60 opacity-0 transition-opacity group-hover:opacity-100">
                      <input
                        type="file"
                        id={`gal-img-${key}`}
                        className="hidden"
                        accept="image/jpeg,image/png,image/webp,image/gif,image/avif"
                        onChange={(e) => handleReplaceImage(e, row)}
                      />
                      <label
                        htmlFor={`gal-img-${key}`}
                        className="flex cursor-pointer items-center gap-2 rounded-xl bg-white px-4 py-2 text-sm font-bold text-navy transition-colors hover:bg-machine-orange hover:text-white"
                      >
                        <Upload className="h-4 w-4" />
                        Edit photo
                      </label>
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
                      <p className="text-[10px] font-bold uppercase tracking-wide text-muted-grey">
                        New — ID is assigned when you create
                      </p>
                    ) : (
                      <p className="font-mono text-[10px] text-muted-grey">id: {row.id}</p>
                    )}

                    <label className="block">
                      <span className="text-[10px] font-bold uppercase tracking-wide text-muted-grey">
                        Title
                      </span>
                      <input
                        className="mt-1 w-full rounded-lg border border-border-grey px-2 py-2 text-sm font-extrabold text-navy"
                        value={row.title}
                        onChange={(e) => updateRow(key, { title: e.target.value })}
                      />
                    </label>

                    <label className="block">
                      <span className="text-[10px] font-bold uppercase tracking-wide text-muted-grey">
                        Category
                      </span>
                      <input
                        className="mt-1 w-full rounded-lg border border-border-grey px-2 py-2 text-sm text-navy"
                        value={row.category}
                        onChange={(e) => updateRow(key, { category: e.target.value })}
                        placeholder="e.g. Job work"
                      />
                    </label>

                    <label className="block">
                      <span className="text-[10px] font-bold uppercase tracking-wide text-muted-grey">
                        Link URL (optional)
                      </span>
                      <input
                        className="mt-1 w-full rounded-lg border border-border-grey px-2 py-2 text-xs text-navy"
                        value={row.linkUrl ?? ''}
                        onChange={(e) => updateRow(key, { linkUrl: e.target.value || null })}
                        placeholder="https://…"
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
                      disabled={!!uploadingId || !!savingId}
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
        message !== 'Replacing image…' &&
        message !== 'Deleting…' &&
        !uploadingId &&
        !savingId && (
          <div className="fixed bottom-8 right-8 animate-in fade-in slide-in-from-bottom-4 rounded-xl bg-navy px-6 py-3 text-sm font-semibold text-white shadow-2xl">
            {message}
          </div>
        )}
    </div>
  );
}
