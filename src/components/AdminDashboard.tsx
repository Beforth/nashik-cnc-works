'use client';

import React, { useCallback, useEffect, useRef, useState } from 'react';
import { useRouter } from 'next/navigation';
import { LogOut, Plus, Pencil, Trash2, Upload } from 'lucide-react';
import { SERVICE_ICON_OPTIONS } from '@/src/lib/service-icons';
import type { PublicService } from '@/src/types/service';

const emptyForm = {
  id: '',
  iconKey: 'Wrench',
  name: '',
  imageUrl: '',
  description: '',
  sortOrder: 0,
};

export default function AdminDashboard() {
  const router = useRouter();
  const [rows, setRows] = useState<PublicService[]>([]);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState<string | null>(null);
  const [creating, setCreating] = useState(false);
  const [form, setForm] = useState(emptyForm);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);
  const imageFileRef = useRef<HTMLInputElement>(null);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/services', { credentials: 'include' });
      if (res.status === 401) {
        router.replace('/admin/login');
        return;
      }
      const data: PublicService[] = await res.json();
      setRows(data.sort((a, b) => a.sortOrder - b.sortOrder));
    } catch {
      setMessage('Could not load services.');
    } finally {
      setLoading(false);
    }
  }, [router]);

  useEffect(() => {
    load();
  }, [load]);

  async function handleImageFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    e.target.value = '';
    if (!file) return;
    setUploading(true);
    setMessage(null);
    try {
      const fd = new FormData();
      fd.append('file', file);
      const res = await fetch('/api/admin/upload', {
        method: 'POST',
        body: fd,
        credentials: 'include',
      });
      const j = (await res.json().catch(() => ({}))) as { url?: string; error?: string };
      if (!res.ok) {
        setMessage(j.error ?? 'Upload failed');
        return;
      }
      if (j.url) {
        setForm((f) => ({ ...f, imageUrl: j.url! }));
        setMessage('Image uploaded — URL filled below.');
      }
    } catch {
      setMessage('Upload failed');
    } finally {
      setUploading(false);
    }
  }

  async function logout() {
    await fetch('/api/admin/logout', { method: 'POST', credentials: 'include' });
    router.replace('/admin/login');
    router.refresh();
  }

  async function handleCreate(e: React.FormEvent) {
    e.preventDefault();
    setMessage(null);
    const res = await fetch('/api/services', {
      method: 'POST',
      credentials: 'include',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        id: form.id.trim().toLowerCase().replace(/\s+/g, '-'),
        iconKey: form.iconKey,
        name: form.name.trim(),
        imageUrl: form.imageUrl.trim(),
        description: form.description.trim(),
        sortOrder: Number(form.sortOrder) || 0,
      }),
    });
    const j = await res.json().catch(() => ({}));
    if (!res.ok) {
      setMessage((j as { error?: string }).error ?? 'Create failed');
      return;
    }
    setCreating(false);
    setForm(emptyForm);
    setMessage('Service created.');
    load();
  }

  async function handleUpdate(e: React.FormEvent) {
    e.preventDefault();
    if (!editingId) return;
    setMessage(null);
    const res = await fetch(`/api/services/${encodeURIComponent(editingId)}`, {
      method: 'PATCH',
      credentials: 'include',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        iconKey: form.iconKey,
        name: form.name.trim(),
        imageUrl: form.imageUrl.trim(),
        description: form.description.trim(),
        sortOrder: Number(form.sortOrder) || 0,
      }),
    });
    const j = await res.json().catch(() => ({}));
    if (!res.ok) {
      setMessage((j as { error?: string }).error ?? 'Update failed');
      return;
    }
    setEditingId(null);
    setForm(emptyForm);
    setMessage('Service updated.');
    load();
  }

  async function handleDelete(id: string) {
    if (!confirm(`Delete service “${id}”? This cannot be undone.`)) return;
    setMessage(null);
    const res = await fetch(`/api/services/${encodeURIComponent(id)}`, {
      method: 'DELETE',
      credentials: 'include',
    });
    if (!res.ok) {
      setMessage('Delete failed');
      return;
    }
    setMessage('Service deleted.');
    if (editingId === id) {
      setEditingId(null);
      setForm(emptyForm);
    }
    load();
  }

  function startEdit(row: PublicService) {
    setCreating(false);
    setEditingId(row.id);
    setForm({
      id: row.id,
      iconKey: row.iconKey,
      name: row.name,
      imageUrl: row.imageUrl,
      description: row.description,
      sortOrder: row.sortOrder,
    });
    setMessage(null);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  function startCreate() {
    setEditingId(null);
    setCreating(true);
    setForm({ ...emptyForm, sortOrder: rows.length });
    setMessage(null);
  }

  function cancelForm() {
    setCreating(false);
    setEditingId(null);
    setForm(emptyForm);
    setMessage(null);
  }

  const formTitle = editingId ? `Edit: ${editingId}` : creating ? 'New service' : null;

  return (
    <div className="mx-auto max-w-4xl px-4 py-8">
      <div className="mb-8 flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-navy">Services</h1>
          <p className="mt-1 text-sm text-muted-grey">Create, update, or remove offerings shown on the homepage.</p>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <button
            type="button"
            onClick={startCreate}
            className="inline-flex items-center gap-2 rounded-xl bg-machine-orange px-4 py-2.5 text-sm font-bold text-white shadow hover:opacity-95"
          >
            <Plus className="h-4 w-4" />
            Add service
          </button>
          <button
            type="button"
            onClick={logout}
            className="inline-flex items-center gap-2 rounded-xl border border-border-grey bg-white px-4 py-2.5 text-sm font-semibold text-navy hover:bg-bg-steel/40"
          >
            <LogOut className="h-4 w-4" />
            Log out
          </button>
        </div>
      </div>

      {message ? (
        <p className="mb-4 rounded-lg border border-border-grey bg-white/80 px-4 py-2 text-sm text-navy" role="status">
          {message}
        </p>
      ) : null}

      {(creating || editingId) && (
        <div className="mb-10 rounded-2xl border border-border-grey bg-white p-6 shadow-sm">
          <h2 className="mb-4 text-lg font-bold text-navy">{formTitle}</h2>
          <form onSubmit={editingId ? handleUpdate : handleCreate} className="space-y-4">
            {!editingId && (
              <div>
                <label className="mb-1 block text-xs font-bold uppercase tracking-wide text-muted-grey">
                  Id (slug)
                </label>
                <input
                  required
                  pattern="[a-z0-9]+(?:-[a-z0-9]+)*"
                  className="w-full rounded-lg border border-border-grey px-3 py-2 text-navy"
                  value={form.id}
                  onChange={(e) => setForm((f) => ({ ...f, id: e.target.value }))}
                  placeholder="e.g. vmc-job-work"
                />
                <p className="mt-1 text-xs text-muted-grey">Lowercase letters, numbers, hyphens only.</p>
              </div>
            )}
            <div>
              <label className="mb-1 block text-xs font-bold uppercase tracking-wide text-muted-grey">Icon</label>
              <select
                className="w-full rounded-lg border border-border-grey px-3 py-2 text-navy"
                value={form.iconKey}
                onChange={(e) => setForm((f) => ({ ...f, iconKey: e.target.value }))}
              >
                {SERVICE_ICON_OPTIONS.map((k) => (
                  <option key={k} value={k}>
                    {k}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="mb-1 block text-xs font-bold uppercase tracking-wide text-muted-grey">Name</label>
              <input
                required
                className="w-full rounded-lg border border-border-grey px-3 py-2 text-navy"
                value={form.name}
                onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
              />
            </div>
            <div>
              <label className="mb-1 block text-xs font-bold uppercase tracking-wide text-muted-grey">Image URL</label>
              <div className="flex flex-col gap-2 sm:flex-row sm:items-stretch">
                <input
                  required
                  type="url"
                  className="min-w-0 flex-1 rounded-lg border border-border-grey px-3 py-2 text-navy"
                  value={form.imageUrl}
                  onChange={(e) => setForm((f) => ({ ...f, imageUrl: e.target.value }))}
                  placeholder="https://…"
                />
                <input
                  ref={imageFileRef}
                  type="file"
                  accept="image/jpeg,image/png,image/webp,image/gif,image/avif"
                  className="hidden"
                  onChange={handleImageFileChange}
                />
                <button
                  type="button"
                  disabled={uploading}
                  onClick={() => imageFileRef.current?.click()}
                  className="inline-flex shrink-0 items-center justify-center gap-2 rounded-lg border border-border-grey bg-white px-4 py-2 text-sm font-semibold text-navy hover:bg-bg-steel/50 disabled:opacity-50"
                >
                  <Upload className="h-4 w-4" />
                  {uploading ? 'Uploading…' : 'Cloudinary'}
                </button>
              </div>
              <p className="mt-1 text-xs text-muted-grey">Paste an image URL or upload (stored in Cloudinary folder karan-engineers/services).</p>
            </div>
            <div>
              <label className="mb-1 block text-xs font-bold uppercase tracking-wide text-muted-grey">Description</label>
              <textarea
                required
                rows={4}
                className="w-full rounded-lg border border-border-grey px-3 py-2 text-navy"
                value={form.description}
                onChange={(e) => setForm((f) => ({ ...f, description: e.target.value }))}
              />
            </div>
            <div>
              <label className="mb-1 block text-xs font-bold uppercase tracking-wide text-muted-grey">Sort order</label>
              <input
                type="number"
                className="w-full max-w-xs rounded-lg border border-border-grey px-3 py-2 text-navy"
                value={form.sortOrder}
                onChange={(e) => setForm((f) => ({ ...f, sortOrder: Number(e.target.value) }))}
              />
            </div>
            <div className="flex flex-wrap gap-2 pt-2">
              <button
                type="submit"
                className="rounded-xl bg-navy px-5 py-2.5 text-sm font-bold text-white hover:opacity-95"
              >
                {editingId ? 'Save changes' : 'Create service'}
              </button>
              <button type="button" onClick={cancelForm} className="rounded-xl border border-border-grey px-5 py-2.5 text-sm font-semibold text-navy">
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}

      {loading ? (
        <p className="text-muted-grey">Loading…</p>
      ) : (
        <ul className="space-y-3">
          {rows.map((row) => (
            <li
              key={row.id}
              className="flex flex-col gap-3 rounded-2xl border border-border-grey bg-white p-4 shadow-sm sm:flex-row sm:items-center sm:justify-between"
            >
              <div className="min-w-0 flex-1">
                <p className="font-extrabold text-navy">{row.name}</p>
                <p className="truncate text-xs font-mono text-muted-grey">{row.id}</p>
                <p className="mt-1 line-clamp-2 text-sm text-muted-grey">{row.description}</p>
              </div>
              <div className="flex shrink-0 gap-2">
                <button
                  type="button"
                  onClick={() => startEdit(row)}
                  className="inline-flex items-center gap-1 rounded-lg border border-border-grey px-3 py-2 text-sm font-semibold text-navy hover:bg-bg-steel/50"
                >
                  <Pencil className="h-4 w-4" />
                  Edit
                </button>
                <button
                  type="button"
                  onClick={() => handleDelete(row.id)}
                  className="inline-flex items-center gap-1 rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-sm font-semibold text-red-800 hover:bg-red-100"
                >
                  <Trash2 className="h-4 w-4" />
                  Delete
                </button>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
