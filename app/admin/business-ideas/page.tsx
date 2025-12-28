import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { redirect } from 'next/navigation';
import BusinessIdeasClient from './_components/business-ideas-client';

export default async function BusinessIdeasPage() {
  const session = await getServerSession(authOptions);

  if (!session || session.user?.role !== 'admin') {
    redirect('/admin/login');
  }

  return <BusinessIdeasClient />;
}
