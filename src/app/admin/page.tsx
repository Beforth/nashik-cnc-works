import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import { COOKIE_NAME, verifyAdminSessionToken } from '@/src/lib/admin-auth';
import AdminDashboard from '@/src/components/AdminDashboard';

export default async function AdminPage() {
  const store = await cookies();
  if (!verifyAdminSessionToken(store.get(COOKIE_NAME)?.value)) {
    redirect('/admin/login');
  }

  return (
    <>
      <header className="border-b border-border-grey bg-white px-4 py-3">
        <div className="mx-auto flex max-w-4xl items-center justify-between">
          <span className="font-bold text-navy">Karan Engineers — Admin</span>
          <a href="/" className="text-sm font-semibold text-machine-orange hover:underline">
            View website
          </a>
        </div>
      </header>
      <AdminDashboard />
    </>
  );
}
