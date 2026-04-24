'use client';

import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'motion/react';
import { Pencil, Plus, Save, Trash2, Upload } from 'lucide-react';
import { adminListContainer, adminListItem } from '@/src/lib/admin-motion-variants';
import { mergeCatalogIntoDbGalleryAdminRows } from '@/src/lib/gallery-display';
import { isGalleryVideoUrl } from '@/src/lib/gallery-media';
import { useAdminDialogs } from '@/src/components/admin/AdminDialogProvider';

const PLACEHOLDER_IMAGE =
  'data:image/svg+xml,' +
  encodeURIComponent(
    `<svg xmlns="http://www.w3.org/2000/svg" width="800" height="800" viewBox="0 0 800 800"><rect fill="#EEF1F6" width="800" height="800"/><text x="50%" y="50%" dominant-baseline="middle" text-anchor="middle" fill="#5A6A7A" font-family="system-ui" font-size="24">Add image or video</text></svg>`,
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
  const { alert, confirm } = useAdminDialogs();
  const router = useRouter();
  const authFetch = useMemo<RequestInit>(() => ({ credentials: 'include', cache: 'no-store' }), []);
  const redirectToLoginIf401 = useCallback(
    (res: Response) => {
      if (res.status !== 401) return false;
      router.replace('/admin/login');
      return true;
    },
    [router],
  );
  const [items, setItems] = useState<GalleryRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState<string | null>(null);
  const [uploadingId, setUploadingId] = useState<string | null>(null);
  const [savingId, setSavingId] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);
  const [editingKey, setEditingKey] = useState<string | null>(null);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/admin/gallery', authFetch);
      const text = await res.text();
      if (redirectToLoginIf401(res)) return;
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
      const normalized = [...data].sort(sortRows).map((r) => ({
        ...r,
        linkUrl: r.linkUrl ?? null,
      }));
      setItems(mergeCatalogIntoDbGalleryAdminRows(normalized));
    } catch {
      setMessage('Could not load gallery items.');
      setItems([]);
    } finally {
      setLoading(false);
      setEditingKey(null);
    }
  }, [authFetch, redirectToLoginIf401]);

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

  function isRowEditing(row: GalleryRow): boolean {
    if (row._isNew) return true;
    return editingKey === rowKey(row);
  }

function isLikelyVideo(file: File): boolean {
  if (file.type.startsWith('video/')) return true;
  const name = file.name.toLowerCase();
  return ['.mp4', '.webm', '.ogg', '.ogv', '.mov', '.m4v'].some((ext) => name.endsWith(ext));
}

async function isVideoLongerThan(file: File, maxSeconds: number): Promise<boolean> {
  if (!isLikelyVideo(file)) return false;
  return new Promise((resolve) => {
    const url = URL.createObjectURL(file);
    const video = document.createElement('video');
    const cleanup = () => URL.revokeObjectURL(url);
    video.preload = 'metadata';
    video.onloadedmetadata = () => {
      const dur = video.duration;
      cleanup();
      if (Number.isFinite(dur) && dur > maxSeconds) resolve(true);
      else resolve(false);
    };
    video.onerror = () => {
      cleanup();
      resolve(false);
    };
    video.src = url;
  });
}

  async function handleReplaceImage(e: React.ChangeEvent<HTMLInputElement>, row: GalleryRow) {
    const file = e.target.files?.[0];
    e.target.value = '';
    if (!file) return;

    const key = rowKey(row);
    setUploadingId(key);
    setBusy(true);
    setMessage('Replacing media…');
    try {
      if (await isVideoLongerThan(file, 60)) {
        setMessage('Media files are too large — maximum duration is 60 seconds.');
        setUploadingId(null);
        setBusy(false);
        return;
      }

      const fd = new FormData();
      fd.append('file', file);
      const res = await fetch('/api/admin/upload', { method: 'POST', body: fd, ...authFetch });
      const data = (await res.json().catch(() => ({}))) as { url?: string; error?: string };
      if (redirectToLoginIf401(res)) {
        setMessage('Session expired. Please sign in again and retry.');
        return;
      }
      if (!res.ok || !data.url) {
        setMessage(data.error ?? 'Upload failed');
        return;
      }

      if (row._isNew) {
        updateRow(key, { imageUrl: data.url });
        setMessage('File added — save the card when text is ready.');
      } else {
        const patchRes = await fetch(`/api/admin/gallery?id=${encodeURIComponent(row.id)}`, {
          method: 'PATCH',
          ...authFetch,
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ imageUrl: data.url }),
        });
        if (redirectToLoginIf401(patchRes)) {
          setMessage('Session expired. Please sign in again and retry.');
          return;
        }
        if (!patchRes.ok) {
          const pj = (await patchRes.json().catch(() => ({}))) as { error?: string };
          setMessage(pj.error ?? 'Could not save media URL');
          return;
        }
        updateRow(key, { imageUrl: data.url });
        setMessage('Media updated.');
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
          setMessage('Upload a photo or video (Add / change media) before creating a new card.');
          setSavingId(null);
          setBusy(false);
          return;
        }
        const linkTrim = row.linkUrl?.trim() || '';
        const res = await fetch('/api/admin/gallery', {
          method: 'POST',
          ...authFetch,
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
        if (redirectToLoginIf401(res)) {
          setMessage('Session expired. Please sign in again and retry.');
          return;
        }
        if (!res.ok) {
          setMessage((j as { error?: string }).error ?? 'Create failed');
          return;
        }
        setMessage('Jobs Gallery item saved — it is ordered first on the website.');
      } else {
        const linkTrim = row.linkUrl?.trim() || '';
        const res = await fetch(`/api/admin/gallery?id=${encodeURIComponent(row.id)}`, {
          method: 'PATCH',
          ...authFetch,
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
        if (redirectToLoginIf401(res)) {
          setMessage('Session expired. Please sign in again and retry.');
          return;
        }
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

  function handleSaveOrEdit(row: GalleryRow) {
    const key = rowKey(row);
    if (row._isNew) {
      void saveRow(row);
      return;
    }
    if (editingKey === key) void saveRow(row);
    else setEditingKey(key);
  }

  async function deleteRow(row: GalleryRow) {
    if (row._isNew) {
      const label = row.title.trim() || 'this unsaved card';
      const okRemove = await confirm({
        title: 'Remove unsaved card?',
        message: `Remove “${label}” from the list?\n\nNothing has been saved to the database yet.`,
        confirmText: 'Remove',
      });
      if (!okRemove) return;
      setItems((prev) => prev.filter((r) => rowKey(r) !== rowKey(row)));
      return;
    }
    const okDel = await confirm({
      title: 'Delete gallery item?',
      message: `Delete “${row.title}” from the website?\n\nThis cannot be undone.`,
      confirmText: 'Delete',
    });
    if (!okDel) return;
    setBusy(true);
    setMessage('Deleting…');
    const res = await fetch(`/api/admin/gallery?id=${encodeURIComponent(row.id)}`, {
      method: 'DELETE',
      ...authFetch,
    });
    if (redirectToLoginIf401(res)) {
      setMessage('Session expired. Please sign in again and retry.');
      setBusy(false);
      return;
    }
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

  async function addPhoto() {
    const cid =
      typeof crypto !== 'undefined' && crypto.randomUUID
        ? crypto.randomUUID()
        : `tmp-${Date.now()}`;
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
        _clientId: cid,
      };
      return [newRow, ...prev];
    });
    setEditingKey(cid);
    await alert(
      'New Jobs Gallery card added.\n\nIt is placed first in the list and will appear first on the website after you click Create card.\n\nUpload a photo or video, add title and category (optional link URL), then save.',
      'Card added',
    );
  }

  if (loading) {
    return <p className="p-8 text-center text-muted-grey">Loading Jobs Gallery…</p>;
  }

  return (
    <div className="relative space-y-8">
      {(busy ||
        message === 'Saving…' ||
        message === 'Replacing media…' ||
        message === 'Deleting…' ||
        uploadingId) && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-navy/20 backdrop-blur-[2px]">
          <div className="flex flex-col items-center gap-4 rounded-3xl border border-border-grey bg-white p-8 shadow-2xl">
            <div className="h-12 w-12 animate-spin rounded-full border-4 border-machine-orange border-t-transparent" />
            <p className="text-lg font-bold text-navy">
              {uploadingId ? 'Uploading file…' : savingId ? 'Saving…' : 'Working…'}
            </p>
          </div>
        </div>
      )}

      <section>
        <div className="mb-4 flex flex-wrap justify-start gap-4">
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
                  <div className="group relative aspect-square overflow-hidden rounded-t-3xl bg-bg-cloud">
                    {isGalleryVideoUrl(src) ? (
                      <video
                        className="h-full w-full object-cover"
                        src={src}
                        muted
                        loop
                        playsInline
                        autoPlay
                        preload="metadata"
                      />
                    ) : (
                      <img src={src} alt="" className="h-full w-full object-cover" />
                    )}
                    <div className="absolute inset-0 flex items-center justify-center gap-3 bg-navy/60 opacity-0 transition-opacity group-hover:opacity-100">
                      {canEditMedia ? (
                        <>
                          <input
                            type="file"
                            id={`gal-img-${key}`}
                            className="hidden"
                            accept="image/jpeg,image/png,image/webp,image/gif,image/avif,video/mp4,video/webm,video/ogg,video/quicktime"
                            onChange={(e) => handleReplaceImage(e, row)}
                          />
                          <label
                            htmlFor={`gal-img-${key}`}
                            className="flex cursor-pointer items-center gap-2 rounded-xl bg-white px-4 py-2 text-sm font-bold text-navy transition-colors hover:bg-machine-orange hover:text-white"
                          >
                            <Upload className="h-4 w-4" />
                            Add / change media
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
                        readOnly={!isRowEditing(row)}
                        className="mt-1 w-full rounded-lg border border-border-grey px-2 py-2 text-sm font-extrabold text-navy read-only:bg-bg-cloud/80"
                        value={row.title}
                        onChange={(e) => updateRow(key, { title: e.target.value })}
                      />
                    </label>

                    <label className="block">
                      <span className="text-[10px] font-bold uppercase tracking-wide text-muted-grey">
                        Category
                      </span>
                      <input
                        readOnly={!isRowEditing(row)}
                        className="mt-1 w-full rounded-lg border border-border-grey px-2 py-2 text-sm text-navy read-only:bg-bg-cloud/80"
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
                        readOnly={!isRowEditing(row)}
                        className="mt-1 w-full rounded-lg border border-border-grey px-2 py-2 text-xs text-navy read-only:bg-bg-cloud/80"
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
        message !== 'Replacing media…' &&
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
