import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import { COOKIE_NAME, verifyAdminSessionToken } from '@/src/lib/admin-auth';
import AdminShell from '@/src/components/AdminShell';

export default async function AdminPage() {
  const store = await cookies();
  const token = store.get(COOKIE_NAME)?.value;
  
  if (!verifyAdminSessionToken(token)) {
    redirect('/admin/login');
  }

  return <AdminShell />;
}
