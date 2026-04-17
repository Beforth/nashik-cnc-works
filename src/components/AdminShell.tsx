'use client';

import { useEffect, useState, type ReactNode } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import AdminDashboard from '@/src/components/AdminDashboard';
import AdminHomeContent from '@/src/components/AdminHomeContent';
import AdminGallery from '@/src/components/AdminGallery';
import AdminInfrastructure from '@/src/components/AdminInfrastructure';
import AdminIndustries from '@/src/components/AdminIndustries';
import AdminEnquiries from '@/src/components/AdminEnquiries';
import AdminFeedback from '@/src/components/AdminFeedback';
import { AdminDialogProvider } from '@/src/components/admin/AdminDialogProvider';
import {
  LogOut,
  LayoutDashboard,
  HardHat,
  Factory,
  Building2,
  Image as ImageIcon,
  MessageSquare,
  MessageSquareQuote,
  Menu,
  X,
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { cn } from '@/src/lib/utils';
import { COMPANY } from '@/src/constants';

const MENU_ITEMS = [
  { id: 'home', label: 'Home', icon: LayoutDashboard },
  { id: 'expertise', label: 'Expertise', icon: HardHat },
  { id: 'infrastructure', label: 'Infrastructure', icon: Building2 },
  { id: 'industries', label: 'Industries', icon: Factory },
  { id: 'gallery', label: 'Jobs Gallery', icon: ImageIcon },
  { id: 'feedback', label: 'Feedback', icon: MessageSquareQuote },
  { id: 'enquiry', label: 'Enquiry', icon: MessageSquare },
] as const;

const VALID_TAB_IDS = new Set<string>(MENU_ITEMS.map((m) => m.id));

/** Keeps each admin section mounted after first visit so switching tabs does not refetch from the API. */
function AdminTabPanel({
  tabId,
  activeTab,
  visited,
  children,
}: {
  tabId: string;
  activeTab: string;
  visited: Set<string>;
  children: ReactNode;
}) {
  if (!visited.has(tabId)) return null;
  const active = activeTab === tabId;
  return (
    <div
      id={`admin-tab-${tabId}`}
      role="tabpanel"
      hidden={!active}
      className={active ? 'block' : 'hidden'}
    >
      {children}
    </div>
  );
}

export default function AdminShell() {
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const router = useRouter();
  const tabParam = searchParams.get('tab');
  const activeTab =
    tabParam && VALID_TAB_IDS.has(tabParam) ? tabParam : 'home';

  const [mobileOpen, setMobileOpen] = useState(false);
  const [visitedTabs, setVisitedTabs] = useState(() => new Set<string>([activeTab]));

  useEffect(() => {
    setVisitedTabs((prev) => {
      if (prev.has(activeTab)) return prev;
      const next = new Set(prev);
      next.add(activeTab);
      return next;
    });
  }, [activeTab]);

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
    <AdminDialogProvider>
    <motion.div
      className="min-h-screen bg-bg-cloud"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.28, ease: [0.22, 1, 0.36, 1] }}
    >
      <header className="sticky top-0 z-30 border-b border-border-grey bg-white/90 shadow-sm backdrop-blur-md">
        <div className="mx-auto flex max-w-[1600px] flex-wrap items-center gap-3 px-4 py-3 md:flex-nowrap md:gap-4 md:px-6">
          <div className="flex min-w-0 flex-1 items-center gap-3 md:flex-none md:flex-initial">
            <Link
              href="/"
              className="flex min-w-0 items-center gap-2.5 rounded-xl outline-none ring-machine-orange/40 transition-opacity hover:opacity-90 focus-visible:ring-2"
              aria-label="Go to website homepage"
            >
              <Image
                src="/logo.png"
                alt=""
                width={120}
                height={40}
                className="h-8 w-auto shrink-0 object-contain object-left"
              />
              <div className="min-w-0">
                <p className="text-xs font-extrabold leading-snug text-navy sm:text-sm">
                  {COMPANY.siteFullName}
                </p>
                <p className="hidden text-xs font-medium text-muted-grey sm:block">Admin</p>
              </div>
            </Link>
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
                      'relative flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-bold transition-colors md:px-4',
                      isActive ? 'text-machine-orange' : 'text-navy hover:bg-white/70',
                    )}
                  >
                    {isActive ? (
                      <motion.span
                        layoutId="admin-desktop-tab-pill"
                        className="absolute inset-0 rounded-lg bg-white shadow-sm ring-1 ring-border-grey/40"
                        style={{ zIndex: 0 }}
                        transition={{ type: 'spring', stiffness: 460, damping: 32 }}
                      />
                    ) : null}
                    <Icon className="relative z-10 h-4 w-4 shrink-0 opacity-90" aria-hidden />
                    <span className="relative z-10 whitespace-nowrap">{item.label}</span>
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

        <AnimatePresence initial={false}>
          {mobileOpen ? (
            <motion.div
              key="admin-mobile-nav"
              id="admin-mobile-nav"
              initial={{ opacity: 0, y: -8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.2, ease: [0.22, 1, 0.36, 1] }}
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
                        'relative flex w-full items-center gap-3 overflow-hidden rounded-xl px-4 py-3 text-left text-sm font-bold transition-colors',
                        isActive ? 'text-white' : 'text-navy hover:bg-bg-steel/60',
                      )}
                    >
                      {isActive ? (
                        <motion.span
                          layoutId="admin-mobile-tab-pill"
                          className="absolute inset-0 rounded-xl bg-machine-orange"
                          style={{ zIndex: 0 }}
                          transition={{ type: 'spring', stiffness: 460, damping: 32 }}
                        />
                      ) : null}
                      <Icon className="relative z-10 h-4 w-4 shrink-0" aria-hidden />
                      <span className="relative z-10">{item.label}</span>
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
            </motion.div>
          ) : null}
        </AnimatePresence>
      </header>

      <main className="mx-auto max-w-[1600px] px-4 py-6 md:px-8 md:py-8">
        <div className="mb-6 md:mb-8">
          <motion.h1
            key={activeTab}
            className="text-xl font-bold text-navy md:text-2xl"
            initial={{ opacity: 0, y: -6 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.22, ease: [0.22, 1, 0.36, 1] }}
          >
            {activeLabel} management
          </motion.h1>
        </div>

        <AdminTabPanel tabId="home" activeTab={activeTab} visited={visitedTabs}>
          <AdminHomeContent />
        </AdminTabPanel>
        <AdminTabPanel tabId="expertise" activeTab={activeTab} visited={visitedTabs}>
          <AdminDashboard />
        </AdminTabPanel>
        <AdminTabPanel tabId="infrastructure" activeTab={activeTab} visited={visitedTabs}>
          <AdminInfrastructure />
        </AdminTabPanel>
        <AdminTabPanel tabId="industries" activeTab={activeTab} visited={visitedTabs}>
          <AdminIndustries />
        </AdminTabPanel>
        <AdminTabPanel tabId="gallery" activeTab={activeTab} visited={visitedTabs}>
          <AdminGallery />
        </AdminTabPanel>
        <AdminTabPanel tabId="feedback" activeTab={activeTab} visited={visitedTabs}>
          <AdminFeedback />
        </AdminTabPanel>
        <AdminTabPanel tabId="enquiry" activeTab={activeTab} visited={visitedTabs}>
          <AdminEnquiries />
        </AdminTabPanel>
      </main>
    </motion.div>
    </AdminDialogProvider>
  );
}
