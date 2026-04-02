'use client';

import React, { useCallback, useEffect, useRef, useState } from 'react';
import { Plus, Pencil, Trash2, Upload } from 'lucide-react';
import { SERVICE_ICON_OPTIONS } from '@/src/lib/service-icons';

const emptyForm = {
  id: '',
  name: '',
  specs: '',
  imageUrl: '',
  iconKey: 'Wrench',
  sortOrder: 0,
};

export default function AdminInfrastructure() {
  const [rows, setRows] = useState<any[]>([]);
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
      const res = await fetch('/api/admin/infrastructure');
      const data = await res.json();
      setRows(data.sort((a: any, b: any) => a.sortOrder - b.sortOrder));
    } catch {
      setMessage('Could not load infrastructure items.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  async function handleImageFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (e.target) e.target.value = '';
    if (!file) return;
    setUploading(true);
    setMessage('Uploading image...');
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
        setMessage('Image uploaded.');
        setTimeout(() => setMessage(null), 3000);
      }
    } catch {
      setMessage('Upload failed');
    } finally {
      setUploading(false);
    }
  }

  async function handleCreate(e: React.FormEvent) {
    e.preventDefault();
    setMessage('Creating...');
    const res = await fetch('/api/admin/infrastructure', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        name: form.name.trim(),
        specs: form.specs.trim(),
        imageUrl: form.imageUrl.trim(),
        iconKey: form.iconKey,
        sortOrder: Number(form.sortOrder) || 0,
      }),
    });
    if (!res.ok) {
      setMessage('Create failed');
      return;
    }
    setCreating(false);
    setForm(emptyForm);
    setMessage('Item created.');
    setTimeout(() => setMessage(null), 3000);
    load();
  }

  async function handleUpdate(e: React.FormEvent) {
    e.preventDefault();
    if (!editingId) return;
    setMessage('Updating...');
    const res = await fetch(`/api/admin/infrastructure?id=${encodeURIComponent(editingId)}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        name: form.name.trim(),
        specs: form.specs.trim(),
        imageUrl: form.imageUrl.trim(),
        iconKey: form.iconKey,
        sortOrder: Number(form.sortOrder) || 0,
      }),
    });
    if (!res.ok) {
      setMessage('Update failed');
      return;
    }
    setEditingId(null);
    setForm(emptyForm);
    setMessage('Item updated.');
    setTimeout(() => setMessage(null), 3000);
    load();
  }

  async function handleDelete(id: string) {
    if (!confirm('Delete this item? This cannot be undone.')) return;
    setMessage('Deleting...');
    const res = await fetch(`/api/admin/infrastructure?id=${encodeURIComponent(id)}`, {
      method: 'DELETE',
    });
    if (!res.ok) {
      setMessage('Delete failed');
      return;
    }
    setMessage('Item deleted.');
    setTimeout(() => setMessage(null), 3000);
    if (editingId === id) {
      setEditingId(null);
      setForm(emptyForm);
    }
    load();
  }

  function startEdit(row: any) {
    setCreating(false);
    setEditingId(row.id);
    setForm({
      id: row.id,
      name: row.name,
      specs: row.specs,
      imageUrl: row.imageUrl || '',
      iconKey: row.iconKey,
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

  return (
    <div className="mx-auto max-w-4xl relative">
      {(message === 'Creating...' || message === 'Updating...' || message === 'Deleting...' || uploading) && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-navy/20 backdrop-blur-[2px]">
          <div className="bg-white p-8 rounded-3xl shadow-2xl border border-border-grey flex flex-col items-center gap-4 animate-in zoom-in duration-300">
            <div className="w-12 h-12 border-4 border-machine-orange border-t-transparent rounded-full animate-spin" />
            <p className="text-navy font-bold text-lg">{uploading ? 'Uploading image...' : 'Processing changes...'}</p>
          </div>
        </div>
      )}

      <div className="mb-8 flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-navy">Infrastructure</h1>
          <p className="mt-1 text-sm text-muted-grey">Manage machines and equipment shown in the infrastructure section.</p>
        </div>
        <button
          type="button"
          onClick={startCreate}
          className="inline-flex items-center gap-2 rounded-xl bg-machine-orange px-4 py-2.5 text-sm font-bold text-white shadow hover:opacity-95"
        >
          <Plus className="h-4 w-4" />
          Add Machine
        </button>
      </div>

      {(creating || editingId) && (
        <div className="mb-10 rounded-2xl border border-border-grey bg-white p-6 shadow-sm">
          <h2 className="mb-4 text-lg font-bold text-navy">{editingId ? 'Edit Machine' : 'New Machine'}</h2>
          <form onSubmit={editingId ? handleUpdate : handleCreate} className="space-y-4">
            <div>
              <label className="mb-1 block text-xs font-bold uppercase tracking-wide text-muted-grey">Name</label>
              <input
                required
                className="w-full rounded-lg border border-border-grey px-3 py-2 text-navy"
                value={form.name}
                onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
                placeholder="e.g. CNC Machine"
              />
            </div>
            <div>
              <label className="mb-1 block text-xs font-bold uppercase tracking-wide text-muted-grey">Icon</label>
              <select
                className="w-full rounded-lg border border-border-grey px-3 py-2 text-navy"
                value={form.iconKey}
                onChange={(e) => setForm((f) => ({ ...f, iconKey: e.target.value }))}
              >
                {SERVICE_ICON_OPTIONS.map((k) => (
                  <option key={k} value={k}>{k}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="mb-1 block text-xs font-bold uppercase tracking-wide text-muted-grey">Image</label>
              <div className="flex flex-col gap-2 sm:flex-row sm:items-stretch">
                <input
                  type="url"
                  className="min-w-0 flex-1 rounded-lg border border-border-grey px-3 py-2 text-navy"
                  value={form.imageUrl}
                  onChange={(e) => setForm((f) => ({ ...f, imageUrl: e.target.value }))}
                  placeholder="https://… (Optional)"
                />
                <input
                  ref={imageFileRef}
                  type="file"
                  accept="image/*"
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
                  {uploading ? 'Uploading…' : 'Upload File'}
                </button>
              </div>
              {form.imageUrl && (
                 <div className="mt-2 w-32 h-32 rounded-lg border border-border-grey overflow-hidden">
                    <img src={form.imageUrl} alt="Preview" className="w-full h-full object-cover" />
                 </div>
              )}
            </div>
            <div>
              <label className="mb-1 block text-xs font-bold uppercase tracking-wide text-muted-grey">Specifications</label>
              <textarea
                required
                rows={3}
                className="w-full rounded-lg border border-border-grey px-3 py-2 text-navy"
                value={form.specs}
                onChange={(e) => setForm((f) => ({ ...f, specs: e.target.value }))}
                placeholder="e.g. Precision cylindrical and turned features."
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
              <button type="submit" className="rounded-xl bg-navy px-5 py-2.5 text-sm font-bold text-white hover:opacity-95">
                {editingId ? 'Save changes' : 'Add Machine'}
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
        <div className="flex flex-col gap-4">
          {rows.map((row) => (
            <div key={row.id} className="flex gap-4 p-4 rounded-2xl border border-border-grey bg-white shadow-sm items-center justify-between">
               <div className="flex items-center gap-4 flex-1">
                 {row.imageUrl && (
                   <div className="w-16 h-16 rounded-xl overflow-hidden shrink-0">
                     <img src={row.imageUrl} className="w-full h-full object-cover" />
                   </div>
                 )}
                 <div>
                   <h3 className="font-bold text-navy">{row.name}</h3>
                   <p className="text-sm text-muted-grey">{row.specs}</p>
                 </div>
               </div>
               <div className="flex gap-2">
                  <button
                    onClick={() => startEdit(row)}
                    className="bg-bg-steel/50 hover:bg-bg-steel p-2 rounded-lg text-navy transition-colors"
                  >
                    <Pencil className="h-4 w-4" />
                  </button>
                  <button
                    onClick={() => handleDelete(row.id)}
                    className="bg-red-50 hover:bg-red-100 p-2 rounded-lg text-red-600 transition-colors"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
               </div>
            </div>
          ))}
        </div>
      )}

      {message && message !== 'Creating...' && message !== 'Updating...' && message !== 'Deleting...' && !uploading && (
        <div className="fixed bottom-8 right-8 bg-navy text-white px-6 py-3 rounded-xl shadow-2xl animate-in fade-in slide-in-from-bottom-4">
          {message}
        </div>
      )}
    </div>
  );
}
