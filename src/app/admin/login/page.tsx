import { redirect } from 'next/navigation';
import { getAdminSession } from '@/lib/admin-auth';
import AdminLoginPanel from './AdminLoginPanel';

export default async function AdminLoginPage() {
  const session = await getAdminSession();
  if (session) {
    redirect('/admin');
  }

  return <AdminLoginPanel />;
}
