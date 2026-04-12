'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'motion/react';
import { Trash2, Save, Upload, Plus } from 'lucide-react';
import { COMPANY } from '@/src/constants';

/** Matches Prisma defaults so the form never mounts with undefined fields after a failed/partial load. */
const DEFAULT_SITE_SETTINGS = {
  companyName: COMPANY.siteFullName,
  gstin: '27AVRPK3981G1Z1',
  contactName: 'Mr. Dinesh Khairnar',
  phone: '9423928362',
  phoneFormatted: '+91 94239 28362',
  email: 'mr.dinesheng@gmail.com',
  address: 'MIDC Ambad, Nashik, Maharashtra 422010.',
  indiaMartUrl: 'https://www.indiamart.com/dinesh-eng/',
  googleMapsUrl: 'https://www.google.com/maps/...',
};

async function safeJson<T>(res: Response, fallback: T): Promise<T> {
  const text = await res.text();
  if (!text.trim()) return fallback;
  try {
    return JSON.parse(text) as T;
  } catch {
    return fallback;
  }
}

export default function AdminHomeContent() {
  const router = useRouter();
  const [settings, setSettings] = useState<any>(null);
  const [heroImages, setHeroImages] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);
  const [addingHero, setAddingHero] = useState(false);

  useEffect(() => {
    async function load() {
      try {
        const [sRes, hRes] = await Promise.all([
          fetch('/api/admin/settings', { credentials: 'include' }),
          fetch('/api/admin/hero', { credentials: 'include' }),
        ]);

        if (sRes.status === 401 || hRes.status === 401) {
          router.replace('/admin/login');
          return;
        }

        const s = await safeJson<Record<string, unknown>>(sRes, {});
        const h = await safeJson<unknown>(hRes, []);

        const settingsOk =
          sRes.ok && s && typeof s === 'object' && !('error' in s);
        const heroOk = hRes.ok && Array.isArray(h);

        setSettings(
          settingsOk ? { ...DEFAULT_SITE_SETTINGS, ...s } : DEFAULT_SITE_SETTINGS,
        );
        setHeroImages(heroOk ? h : []);

        if (!settingsOk || !heroOk) {
          setMessage(
            'Could not load admin data. Check the database connection and refresh.',
          );
          setTimeout(() => setMessage(null), 5000);
        }
      } catch {
        setSettings(DEFAULT_SITE_SETTINGS);
        setHeroImages([]);
        setMessage('Could not load admin data. Try refreshing the page.');
        setTimeout(() => setMessage(null), 5000);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, [router]);

  async function saveSettings(e: React.FormEvent) {
    e.preventDefault();
    if (
      !window.confirm(
        'Save these company information changes? They will be published on the live website.',
      )
    ) {
      return;
    }
    setMessage('Saving changes...');
    const res = await fetch('/api/admin/settings', {
      method: 'PATCH',
      credentials: 'include',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(settings),
    });
    if (res.ok) {
      setMessage('Settings updated successfully!');
      setTimeout(() => setMessage(null), 3000);
    } else {
      setMessage('Error: Failed to save settings.');
    }
  }

  async function handleReplace(e: React.ChangeEvent<HTMLInputElement>, id: string) {
    const file = e.target.files?.[0];
    if (!file) return;
    
    setUploading(true);
    setMessage('Replacing image...');
    
    try {
      const fd = new FormData();
      fd.append('file', file);
      const res = await fetch('/api/admin/upload', {
        method: 'POST',
        credentials: 'include',
        body: fd,
      });
      const data = await res.json();
      
      if (res.ok && data.url) {
        const heroRes = await fetch(`/api/admin/hero?id=${encodeURIComponent(id)}`, {
          method: 'PATCH',
          credentials: 'include',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ url: data.url }),
        });
        
        if (heroRes.ok) {
          setHeroImages(heroImages.map(h => h.id === id ? { ...h, url: data.url } : h));
          setMessage('Photo replaced successfully!');
          setTimeout(() => setMessage(null), 3000);
        }
      } else {
        setMessage(data.error || 'Upload failed');
      }
    } catch {
      setMessage('Upload failed');
    } finally {
      setUploading(false);
    }
  }

  async function deleteHeroImage(id: string) {
    if (!confirm('Delete this hero image?')) return;
    const res = await fetch(`/api/admin/hero?id=${encodeURIComponent(id)}`, {
      method: 'DELETE',
      credentials: 'include',
    });
    if (res.ok) {
      setHeroImages(heroImages.filter(h => h.id !== id));
      setMessage('Photo removed.');
      setTimeout(() => setMessage(null), 3000);
    }
  }

  async function addHeroCard() {
    setAddingHero(true);
    try {
      const res = await fetch('/api/admin/hero', {
        method: 'POST',
        credentials: 'include',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({}),
      });
      if (res.status === 401) {
        router.replace('/admin/login');
        return;
      }
      const data = await res.json().catch(() => ({}));
      if (!res.ok) {
        setMessage((data as { error?: string }).error ?? 'Could not add hero card.');
        setTimeout(() => setMessage(null), 4000);
        return;
      }
      setHeroImages((prev) => [...prev, data].sort((a, b) => a.sortOrder - b.sortOrder));
      setMessage('New hero card added — upload a photo with Edit.');
      setTimeout(() => setMessage(null), 4000);
    } catch {
      setMessage('Could not add hero card.');
      setTimeout(() => setMessage(null), 4000);
    } finally {
      setAddingHero(false);
    }
  }

  async function saveHeroAlt(id: string, alt: string) {
    const normalized = alt.trim() || 'Hero slide';
    const res = await fetch(`/api/admin/hero?id=${encodeURIComponent(id)}`, {
      method: 'PATCH',
      credentials: 'include',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ alt: normalized }),
    });
    if (res.ok) {
      setHeroImages((prev) => prev.map((h) => (h.id === id ? { ...h, alt: normalized } : h)));
    }
  }

  if (loading) return <p className="p-8 text-center text-muted-grey">Loading settings...</p>;

  return (
    <motion.div
      className="relative space-y-12"
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.28, ease: [0.22, 1, 0.36, 1] }}
    >
      {/* Loading/Saving Overlay */}
      {(message === 'Saving changes...' || uploading || addingHero) && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-navy/20 backdrop-blur-[2px]">
          <div className="bg-white p-8 rounded-3xl shadow-2xl border border-border-grey flex flex-col items-center gap-4 animate-in zoom-in duration-300">
            <div className="w-12 h-12 border-4 border-machine-orange border-t-transparent rounded-full animate-spin" />
            <p className="text-navy font-bold text-lg">
              {addingHero ? 'Adding card...' : uploading ? 'Replacing photo...' : 'Saving your changes...'}
            </p>
          </div>
        </div>
      )}

      <section>
        <form onSubmit={saveSettings} className="grid grid-cols-1 md:grid-cols-2 gap-6 bg-white p-6 rounded-2xl border border-border-grey shadow-sm">
          <div className="space-y-4 md:col-span-2">
            <label className="block">
              <span className="text-xs font-bold uppercase tracking-wide text-muted-grey">Company Name</span>
              <input 
                className="mt-1 block w-full rounded-lg border border-border-grey px-3 py-2 text-navy"
                value={settings.companyName}
                onChange={e => setSettings({...settings, companyName: e.target.value})}
              />
            </label>
          </div>
          <div className="space-y-4">
            <label className="block">
              <span className="text-xs font-bold uppercase tracking-wide text-muted-grey">Phone (Raw)</span>
              <input 
                className="mt-1 block w-full rounded-lg border border-border-grey px-3 py-2 text-navy"
                value={settings.phone}
                onChange={e => setSettings({...settings, phone: e.target.value})}
              />
            </label>
            <label className="block">
              <span className="text-xs font-bold uppercase tracking-wide text-muted-grey">Phone (Display)</span>
              <input 
                className="mt-1 block w-full rounded-lg border border-border-grey px-3 py-2 text-navy"
                value={settings.phoneFormatted}
                onChange={e => setSettings({...settings, phoneFormatted: e.target.value})}
              />
            </label>
          </div>
          <div className="space-y-4">
            <label className="block">
              <span className="text-xs font-bold uppercase tracking-wide text-muted-grey">Email</span>
              <input 
                className="mt-1 block w-full rounded-lg border border-border-grey px-3 py-2 text-navy"
                value={settings.email}
                onChange={e => setSettings({...settings, email: e.target.value})}
              />
            </label>
            <label className="block">
              <span className="text-xs font-bold uppercase tracking-wide text-muted-grey">GSTIN</span>
              <input 
                className="mt-1 block w-full rounded-lg border border-border-grey px-3 py-2 text-navy"
                value={settings.gstin}
                onChange={e => setSettings({...settings, gstin: e.target.value})}
              />
            </label>
          </div>
          <div className="md:col-span-2">
            <label className="block">
              <span className="text-xs font-bold uppercase tracking-wide text-muted-grey">Address</span>
              <textarea 
                rows={2}
                className="mt-1 block w-full rounded-lg border border-border-grey px-3 py-2 text-navy"
                value={settings.address}
                onChange={e => setSettings({...settings, address: e.target.value})}
              />
            </label>
          </div>
          <div className="md:col-span-2 pt-2">
            <button type="submit" className="inline-flex items-center gap-2 rounded-xl bg-navy px-6 py-2.5 text-sm font-bold text-white shadow hover:opacity-95">
              <Save className="h-4 w-4" />
              Save Changes
            </button>
          </div>
        </form>
      </section>

      <section>
        <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:justify-end">
          <button
            type="button"
            onClick={addHeroCard}
            disabled={addingHero}
            className="inline-flex shrink-0 items-center justify-center gap-2 rounded-xl bg-machine-orange px-5 py-2.5 text-sm font-bold text-white shadow-sm transition-opacity hover:opacity-95 disabled:opacity-60"
          >
            <Plus className="h-4 w-4" />
            Add hero card
          </button>
        </div>
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {heroImages.map((img) => (
            <div
              key={img.id}
              className="overflow-hidden rounded-2xl border border-border-grey bg-white shadow-sm"
            >
              <div className="group relative aspect-video overflow-hidden">
                <img src={img.url} alt={img.alt} className="h-full w-full object-cover" />
                <div className="absolute inset-0 flex items-center justify-center gap-3 bg-navy/60 opacity-0 transition-opacity group-hover:opacity-100">
                  <input
                    type="file"
                    id={`replace-${img.id}`}
                    className="hidden"
                    accept="image/*"
                    onChange={(e) => handleReplace(e, img.id)}
                  />
                  <label
                    htmlFor={`replace-${img.id}`}
                    className="flex cursor-pointer items-center gap-2 rounded-xl bg-white px-4 py-2 text-sm font-bold text-navy transition-colors hover:bg-machine-orange hover:text-white"
                  >
                    <Upload className="h-4 w-4" />
                    Edit
                  </label>
                  <button
                    type="button"
                    onClick={() => deleteHeroImage(img.id)}
                    className="rounded-xl bg-white/10 p-2 text-white transition-colors hover:bg-red-500"
                  >
                    <Trash2 className="h-5 w-5" />
                  </button>
                </div>
              </div>
              <label className="block border-t border-border-grey p-3">
                <span className="text-[10px] font-bold uppercase tracking-wide text-muted-grey">Alt text</span>
                <input
                  className="mt-1 block w-full rounded-lg border border-border-grey px-2 py-1.5 text-sm text-navy"
                  value={img.alt}
                  onChange={(e) =>
                    setHeroImages((prev) =>
                      prev.map((h) => (h.id === img.id ? { ...h, alt: e.target.value } : h)),
                    )
                  }
                  onBlur={(e) => saveHeroAlt(img.id, e.target.value)}
                />
              </label>
            </div>
          ))}
        </div>
      </section>

      {message && message !== 'Saving changes...' && !uploading && !addingHero && (
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          className="fixed bottom-8 right-8 rounded-xl bg-navy px-6 py-3 text-white shadow-2xl"
        >
          {message}
        </motion.div>
      )}
    </motion.div>
  );
}
