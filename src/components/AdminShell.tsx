'use client';

import { useState } from 'react';
import Image from 'next/image';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import AdminDashboard from '@/src/components/AdminDashboard';
import AdminHomeContent from '@/src/components/AdminHomeContent';
import AdminGallery from '@/src/components/AdminGallery';
import AdminInfrastructure from '@/src/components/AdminInfrastructure';
import AdminIndustries from '@/src/components/AdminIndustries';
import { LogOut, LayoutDashboard, HardHat, Factory, Building2, Image as ImageIcon, Menu, X } from 'lucide-react';
import { cn } from '@/src/lib/utils';

const MENU_ITEMS = [
  { id: 'home', label: 'Home', icon: LayoutDashboard },
  { id: 'expertise', label: 'Expertise', icon: HardHat },
  { id: 'infrastructure', label: 'Infrastructure', icon: Building2 },
  { id: 'industries', label: 'Industries', icon: Factory },
  { id: 'gallery', label: 'Jobs Gallery', icon: ImageIcon },
] as const;

const VALID_TAB_IDS = new Set<string>(MENU_ITEMS.map((m) => m.id));

export default function AdminShell() {
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const router = useRouter();
  const tabParam = searchParams.get('tab');
  const activeTab =
    tabParam && VALID_TAB_IDS.has(tabParam) ? tabParam : 'home';

  const [mobileOpen, setMobileOpen] = useState(false);

  async function logout() {
    await fetch('/api/admin/logout', { method: 'POST', credentials: 'include' });
    router.replace('/admin/login');
    router.refresh();
  }

  function selectTab(id: string) {
    const params = new URLSearchParams(searchParams.toString());
    if (id === 'home') {
      params.delete('tab');
    } else {
      params.set('tab', id);
    }
    const qs = params.toString();
    router.replace(qs ? `${pathname}?${qs}` : pathname, { scroll: false });
    setMobileOpen(false);
  }

  const activeLabel = MENU_ITEMS.find((m) => m.id === activeTab)?.label ?? 'Admin';

  return (
    <div className="min-h-screen bg-bg-cloud">
      <header className="sticky top-0 z-30 border-b border-border-grey bg-white/90 shadow-sm backdrop-blur-md">
        <div className="mx-auto flex max-w-[1600px] flex-wrap items-center gap-3 px-4 py-3 md:flex-nowrap md:gap-4 md:px-6">
          <div className="flex min-w-0 flex-1 items-center gap-3 md:flex-none md:flex-initial">
            <div className="flex min-w-0 items-center gap-2.5">
              <Image
                src="/logo.png"
                alt=""
                width={120}
                height={40}
                className="h-8 w-auto shrink-0 object-contain object-left"
              />
              <div className="min-w-0">
                <p className="truncate text-sm font-extrabold text-navy">Karan Engineers</p>
                <p className="hidden text-xs font-medium text-muted-grey sm:block">Admin</p>
              </div>
            </div>
          </div>

          {/* Desktop navbar — same “pill rail” idea as the public site */}
          <nav
            className="order-last hidden w-full md:order-none md:flex md:flex-1 md:justify-center md:px-2"
            aria-label="Admin sections"
          >
            <div className="flex flex-wrap items-center justify-center gap-1 rounded-xl border border-border-grey/60 bg-bg-steel/50 p-1 md:flex-nowrap">
              {MENU_ITEMS.map((item) => {
                const Icon = item.icon;
                const isActive = activeTab === item.id;
                return (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => selectTab(item.id)}
                    className={cn(
                      'flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-bold transition-all md:px-4',
                      isActive
                        ? 'bg-white text-machine-orange shadow-sm ring-1 ring-border-grey/40'
                        : 'text-navy hover:bg-white/70',
                    )}
                  >
                    <Icon className="h-4 w-4 shrink-0 opacity-90" aria-hidden />
                    <span className="whitespace-nowrap">{item.label}</span>
                  </button>
                );
              })}
            </div>
          </nav>

          <div className="flex shrink-0 items-center gap-2">
            <a
              href="/"
              target="_blank"
              rel="noopener noreferrer"
              className="hidden text-sm font-semibold text-machine-orange hover:underline sm:inline"
            >
              View website
            </a>
            <button
              type="button"
              onClick={logout}
              className="hidden items-center gap-2 rounded-xl border border-border-grey bg-white px-3 py-2 text-sm font-semibold text-muted-grey transition-colors hover:border-red-200 hover:bg-red-50 hover:text-red-600 md:inline-flex"
            >
              <LogOut className="h-4 w-4" />
              Log out
            </button>
            <button
              type="button"
              onClick={() => setMobileOpen((o) => !o)}
              className="inline-flex h-10 w-10 items-center justify-center rounded-xl border border-border-grey bg-white text-navy md:hidden"
              aria-expanded={mobileOpen}
              aria-controls="admin-mobile-nav"
              aria-label={mobileOpen ? 'Close menu' : 'Open menu'}
            >
              {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </button>
          </div>
        </div>

        {/* Mobile navbar panel */}
        {mobileOpen ? (
          <div
            id="admin-mobile-nav"
            className="border-t border-border-grey bg-white px-4 py-3 md:hidden"
          >
            <nav className="flex flex-col gap-1" aria-label="Admin sections">
              {MENU_ITEMS.map((item) => {
                const Icon = item.icon;
                const isActive = activeTab === item.id;
                return (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => selectTab(item.id)}
                    className={cn(
                      'flex w-full items-center gap-3 rounded-xl px-4 py-3 text-left text-sm font-bold transition-colors',
                      isActive ? 'bg-machine-orange text-white' : 'text-navy hover:bg-bg-steel/60',
                    )}
                  >
                    <Icon className="h-4 w-4 shrink-0" aria-hidden />
                    {item.label}
                  </button>
                );
              })}
            </nav>
            <div className="mt-3 flex flex-col gap-2 border-t border-border-grey pt-3">
              <a
                href="/"
                target="_blank"
                rel="noopener noreferrer"
                className="text-center text-sm font-semibold text-machine-orange"
              >
                View website
              </a>
              <button
                type="button"
                onClick={logout}
                className="flex w-full items-center justify-center gap-2 rounded-xl py-3 text-sm font-semibold text-red-600 hover:bg-red-50"
              >
                <LogOut className="h-4 w-4" />
                Log out
              </button>
            </div>
          </div>
        ) : null}
      </header>

      <main className="mx-auto max-w-[1600px] px-4 py-6 md:px-8 md:py-8">
        <div className="mb-6 md:mb-8">
          <h1 className="text-xl font-bold text-navy md:text-2xl">{activeLabel} management</h1>
        </div>

        {activeTab === 'home' ? (
          <AdminHomeContent />
        ) : activeTab === 'expertise' ? (
          <AdminDashboard />
        ) : activeTab === 'infrastructure' ? (
          <AdminInfrastructure />
        ) : activeTab === 'industries' ? (
          <AdminIndustries />
        ) : activeTab === 'gallery' ? (
          <AdminGallery />
        ) : (
          <div className="rounded-2xl border-2 border-dashed border-border-grey bg-white/50 p-20 text-center">
            <p className="text-muted-grey">
              {MENU_ITEMS.find((m) => m.id === activeTab)?.label} management interface coming soon.
            </p>
          </div>
        )}
      </main>
    </div>
  );
}
