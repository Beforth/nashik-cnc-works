import dynamic from 'next/dynamic';
import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import { COOKIE_NAME, verifyAdminSessionToken } from '@/src/lib/admin-auth';

function AdminLoading() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-bg-cloud text-sm font-medium text-muted-grey">
      Loading admin…
    </div>
  );
}

/** Separate chunk so `/admin` page.js stays small — avoids ChunkLoadError timeouts on heavy admin UI. */
const AdminShell = dynamic(() => import('@/src/components/AdminShell'), {
  loading: () => <AdminLoading />,
});

export default async function AdminPage() {
  const store = await cookies();
  const token = store.get(COOKIE_NAME)?.value;

  if (!verifyAdminSessionToken(token)) {
    redirect('/admin/login');
  }

  return <AdminShell />;
}
