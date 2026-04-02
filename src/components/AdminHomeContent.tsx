'use client';

import React, { useEffect, useRef, useState } from 'react';
import { Trash2, Save, Upload } from 'lucide-react';

export default function AdminHomeContent() {
  const [settings, setSettings] = useState<any>(null);
  const [heroImages, setHeroImages] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);

  useEffect(() => {
    async function load() {
      const [sRes, hRes] = await Promise.all([
        fetch('/api/admin/settings'),
        fetch('/api/admin/hero')
      ]);
      const s = await sRes.json();
      const h = await hRes.json();
      setSettings(s);
      setHeroImages(h);
      setLoading(false);
    }
    load();
  }, []);

  async function saveSettings(e: React.FormEvent) {
    e.preventDefault();
    setMessage('Saving changes...');
    const res = await fetch('/api/admin/settings', {
      method: 'PATCH',
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
        body: fd,
      });
      const data = await res.json();
      
      if (res.ok && data.url) {
        const heroRes = await fetch(`/api/admin/hero?id=${id}`, {
          method: 'PATCH',
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
    const res = await fetch(`/api/admin/hero?id=${id}`, { method: 'DELETE' });
    if (res.ok) {
      setHeroImages(heroImages.filter(h => h.id !== id));
      setMessage('Photo removed.');
      setTimeout(() => setMessage(null), 3000);
    }
  }

  if (loading) return <p className="p-8 text-center text-muted-grey">Loading settings...</p>;

  return (
    <div className="space-y-12 relative">
      {/* Loading/Saving Overlay */}
      {(message === 'Saving changes...' || uploading) && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-navy/20 backdrop-blur-[2px]">
          <div className="bg-white p-8 rounded-3xl shadow-2xl border border-border-grey flex flex-col items-center gap-4 animate-in zoom-in duration-300">
            <div className="w-12 h-12 border-4 border-machine-orange border-t-transparent rounded-full animate-spin" />
            <p className="text-navy font-bold text-lg">{uploading ? 'Replacing photo...' : 'Saving your changes...'}</p>
          </div>
        </div>
      )}

      <section>
        <div className="mb-4">
          <h2 className="text-xl font-bold text-navy">Company Information</h2>
          <p className="text-sm text-muted-grey">Manage company name, contact details and address shown across the site.</p>
        </div>
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
        <div className="mb-4">
          <h2 className="text-xl font-bold text-navy">Hero Photos</h2>
          <p className="text-sm text-muted-grey">Click Edit to replace any of the existing banner images.</p>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {heroImages.map(img => (
            <div key={img.id} className="group relative aspect-video rounded-2xl overflow-hidden border border-border-grey bg-white shadow-sm">
              <img src={img.url} alt={img.alt} className="w-full h-full object-cover" />
              <div className="absolute inset-0 bg-navy/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-3">
                <input 
                  type="file" 
                  id={`replace-${img.id}`}
                  className="hidden" 
                  accept="image/*"
                  onChange={(e) => handleReplace(e, img.id)}
                />
                <label 
                  htmlFor={`replace-${img.id}`}
                  className="bg-white hover:bg-machine-orange px-4 py-2 rounded-xl text-navy hover:text-white font-bold text-sm transition-colors cursor-pointer flex items-center gap-2"
                >
                  <Upload className="h-4 w-4" />
                  Edit
                </label>
                <button 
                  onClick={() => deleteHeroImage(img.id)} 
                  className="bg-white/10 hover:bg-red-500 p-2 rounded-xl text-white transition-colors"
                >
                  <Trash2 className="h-5 w-5" />
                </button>
              </div>
            </div>
          ))}
        </div>
      </section>

      {message && message !== 'Saving changes...' && !uploading && (
        <div className="fixed bottom-8 right-8 bg-navy text-white px-6 py-3 rounded-xl shadow-2xl animate-in fade-in slide-in-from-bottom-4">
          {message}
        </div>
      )}
    </div>
  );
}
