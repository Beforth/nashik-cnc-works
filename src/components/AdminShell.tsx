'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import AdminDashboard from '@/src/components/AdminDashboard';
import AdminHomeContent from '@/src/components/AdminHomeContent';
import AdminGallery from '@/src/components/AdminGallery';
import AdminInfrastructure from '@/src/components/AdminInfrastructure';
import AdminIndustries from '@/src/components/AdminIndustries';
import AdminEnquiries from '@/src/components/AdminEnquiries';
import { LogOut, LayoutDashboard, HardHat, Factory, Building2, Image as ImageIcon, MessageSquare } from 'lucide-react';

const MENU_ITEMS = [
  { id: 'home', label: 'Home', icon: LayoutDashboard },
  { id: 'expertise', label: 'Expertise', icon: HardHat },
  { id: 'infrastructure', label: 'Infrastructure', icon: Building2 },
  { id: 'industries', label: 'Industries', icon: Factory },
  { id: 'gallery', label: 'Jobs Gallery', icon: ImageIcon },
  { id: 'enquiry', label: 'Enquiry', icon: MessageSquare },
];

export default function AdminShell() {
  const [activeTab, setActiveTab] = useState('home');
  const router = useRouter();

  async function logout() {
    await fetch('/api/admin/logout', { method: 'POST', credentials: 'include' });
    router.replace('/admin/login');
    router.refresh();
  }

  return (
    <div className="flex min-h-screen bg-bg-cloud">
      {/* Sidebar */}
      <aside className="w-64 border-r border-border-grey bg-white fixed h-full">
        <div className="flex h-16 items-center border-b border-border-grey px-6">
          <span className="font-bold text-navy">Karan Engineers</span>
        </div>
        <nav className="space-y-1 p-4">
          {MENU_ITEMS.map((item) => {
            const Icon = item.icon;
            return (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                className={`flex w-full items-center gap-3 rounded-xl px-4 py-3 text-sm font-semibold transition-colors ${
                  activeTab === item.id
                    ? 'bg-machine-orange text-white shadow-sm'
                    : 'text-muted-grey hover:bg-bg-steel/40 hover:text-navy'
                }`}
              >
                <Icon className="h-4 w-4" />
                {item.label}
              </button>
            );
          })}
        </nav>
        <div className="absolute bottom-0 w-full border-t border-border-grey p-4">
          <button
            onClick={logout}
            className="flex w-full items-center gap-3 rounded-xl px-4 py-3 text-sm font-semibold text-muted-grey hover:bg-red-50 hover:text-red-600 transition-colors"
          >
            <LogOut className="h-4 w-4" />
            Log out
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 ml-64 overflow-auto min-h-screen">
        <header className="sticky top-0 z-10 border-b border-border-grey bg-white/80 backdrop-blur-md px-8 py-4">
          <div className="flex items-center justify-between">
            <h1 className="text-xl font-bold text-navy capitalize">
              {MENU_ITEMS.find(m => m.id === activeTab)?.label} Management
            </h1>
            <a href="/" target="_blank" className="text-sm font-semibold text-machine-orange hover:underline">
              View website
            </a>
          </div>
        </header>

        <div className="p-8">
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
          ) : activeTab === 'enquiry' ? (
            <AdminEnquiries />
          ) : (
            <div className="rounded-2xl border-2 border-dashed border-border-grey bg-white/50 p-20 text-center">
              <p className="text-muted-grey">
                {MENU_ITEMS.find(m => m.id === activeTab)?.label} management interface coming soon.
              </p>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
