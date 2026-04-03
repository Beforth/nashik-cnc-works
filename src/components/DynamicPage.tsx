'use client';

import React, { useCallback, useEffect, useState } from 'react';
import type { PageLayoutApiResponse, PageSectionConfig } from '@/src/types/page-sections';
import {
  getRegisteredSectionComponent,
  UnknownSectionPlaceholder,
} from '@/src/components/dynamic-registry';

export type DynamicPageProps = {
  /** Full URL to your layout API (GET returns `PageLayoutApiResponse`). */
  apiUrl?: string;
  /** When set, skips fetch and renders this layout (e.g. SSR from your backend). Omit to load via `apiUrl` / env. */
  initialData?: PageLayoutApiResponse;
  /** Appended as `?slug=` when `apiUrl` is used (optional). */
  slug?: string;
  fetchOptions?: RequestInit;
};

function SectionRenderer({ section }: { section: PageSectionConfig }) {
  const Comp = getRegisteredSectionComponent(section.componentType);
  const props = section.componentProps ?? {};

  if (!Comp) {
    return <UnknownSectionPlaceholder componentType={section.componentType} />;
  }

  return <Comp {...props} />;
}

export default function DynamicPage({
  apiUrl,
  initialData,
  slug,
  fetchOptions,
}: DynamicPageProps) {
  const [data, setData] = useState<PageLayoutApiResponse | null>(
    initialData !== undefined ? initialData : null,
  );
  const shouldFetch = initialData === undefined;
  const [loading, setLoading] = useState(shouldFetch);
  const [error, setError] = useState<string | null>(null);

  const resolvedUrl =
    apiUrl ??
    (typeof process !== 'undefined' && process.env.NEXT_PUBLIC_PAGE_SECTIONS_API_URL) ??
    '';

  const load = useCallback(async () => {
    if (!resolvedUrl) {
      setError('No API URL: pass apiUrl or set NEXT_PUBLIC_PAGE_SECTIONS_API_URL.');
      setLoading(false);
      return;
    }
    setLoading(true);
    setError(null);
    try {
      const url = new URL(resolvedUrl, typeof window !== 'undefined' ? window.location.origin : 'http://localhost');
      if (slug) url.searchParams.set('slug', slug);
      const res = await fetch(url.toString(), {
        ...fetchOptions,
        headers: {
          Accept: 'application/json',
          ...fetchOptions?.headers,
        },
      });
      if (!res.ok) {
        throw new Error(`HTTP ${res.status}`);
      }
      const json: PageLayoutApiResponse = await res.json();
      if (!json?.sections || !Array.isArray(json.sections)) {
        throw new Error('Invalid response: expected { sections: [] }');
      }
      setData(json);
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Failed to load page layout');
      setData(null);
    } finally {
      setLoading(false);
    }
  }, [resolvedUrl, slug, fetchOptions]);

  useEffect(() => {
    if (initialData !== undefined) {
      setData(initialData);
      setLoading(false);
      setError(null);
      return;
    }
    load();
  }, [initialData, load]);

  if (loading) {
    return (
      <div className="flex min-h-[40vh] flex-col items-center justify-center gap-3 px-4">
        <div className="h-10 w-10 animate-spin rounded-full border-2 border-machine-orange border-t-transparent" />
        <p className="text-sm font-medium text-muted-grey">Loading page layout…</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="mx-auto max-w-lg rounded-2xl border border-red-200 bg-red-50 px-6 py-8 text-center">
        <p className="text-sm font-bold text-red-900">Could not load layout</p>
        <p className="mt-2 text-xs text-red-800/90">{error}</p>
        {resolvedUrl ? (
          <button
            type="button"
            onClick={() => load()}
            className="mt-4 rounded-xl bg-navy px-4 py-2 text-sm font-bold text-white hover:opacity-95"
          >
            Retry
          </button>
        ) : null}
      </div>
    );
  }

  if (!data?.sections?.length) {
    return (
      <div className="mx-auto max-w-lg rounded-2xl border border-border-grey bg-bg-cloud px-6 py-10 text-center">
        <p className="text-sm font-semibold text-navy">No sections configured</p>
        <p className="mt-2 text-xs text-muted-grey">The API returned an empty layout.</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      {data.sections.map((section, index) => (
        <SectionRenderer key={section.id ?? `${section.componentType}-${index}`} section={section} />
      ))}
    </div>
  );
}
