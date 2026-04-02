'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function AdminLoginPage() {
  const router = useRouter();
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [pending, setPending] = useState(false);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setPending(true);
    try {
      const res = await fetch('/api/admin/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ password }),
        credentials: 'include',
      });
      if (!res.ok) {
        const j = (await res.json().catch(() => ({}))) as { error?: string };
        setError(j.error ?? 'Login failed');
        setPending(false);
        return;
      }
      router.replace('/admin');
      router.refresh();
    } catch {
      setError('Network error');
      setPending(false);
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center px-4">
      <div className="w-full max-w-md rounded-2xl border border-border-grey bg-white p-8 shadow-lg">
        <h1 className="text-xl font-extrabold text-navy">Admin sign in</h1>
        <p className="mt-1 text-sm text-muted-grey">Manage services on the website.</p>
        <form onSubmit={onSubmit} className="mt-6 space-y-4">
          <div>
            <label htmlFor="admin-password" className="mb-1 block text-xs font-bold uppercase tracking-wide text-muted-grey">
              Password
            </label>
            <input
              id="admin-password"
              type="password"
              autoComplete="current-password"
              required
              className="w-full rounded-lg border border-border-grey px-3 py-2 text-navy"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>
          {error ? (
            <p className="text-sm font-medium text-red-600" role="alert">
              {error}
            </p>
          ) : null}
          <button
            type="submit"
            disabled={pending}
            className="w-full rounded-xl bg-navy py-2.5 text-sm font-bold text-white hover:opacity-95 disabled:opacity-60"
          >
            {pending ? 'Signing in…' : 'Sign in'}
          </button>
        </form>
        <p className="mt-6 text-center text-sm text-muted-grey">
          <a href="/" className="font-semibold text-machine-orange hover:underline">
            ← Back to site
          </a>
        </p>
      </div>
    </div>
  );
}
