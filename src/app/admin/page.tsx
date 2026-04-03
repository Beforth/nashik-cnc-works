import { Suspense } from 'react';
import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import { COOKIE_NAME, verifyAdminSessionToken } from '@/src/lib/admin-auth';
import AdminShell from '@/src/components/AdminShell';

function AdminLoading() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-bg-cloud text-sm font-medium text-muted-grey">
      Loading admin…
    </div>
  );
}

export default async function AdminPage() {
  const store = await cookies();
  const token = store.get(COOKIE_NAME)?.value;

  if (!verifyAdminSessionToken(token)) {
    redirect('/admin/login');
  }

  return (
    <Suspense fallback={<AdminLoading />}>
      <AdminShell />
    </Suspense>
  );
}
