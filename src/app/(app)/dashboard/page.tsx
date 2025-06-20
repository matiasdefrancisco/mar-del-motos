'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import { Skeleton } from '@/components/ui/skeleton';
import PageTitle from '@/components/shared/PageTitle';
import { LayoutDashboard } from 'lucide-react';

export default function DashboardRedirectPage() {
  const { userRole, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && userRole) {
      switch (userRole) {
        case 'admin':
          router.replace('/dashboard/admin');
          break;
        case 'operator':
          router.replace('/dashboard/operator');
          break;
        case 'rider':
          router.replace('/dashboard/rider');
          break;
        case 'local':
          router.replace('/dashboard/local');
          break;
        default:
          // Fallback or error page if role is unrecognized
          router.replace('/login'); 
      }
    } else if (!loading && !userRole) {
        router.replace('/login');
    }
  }, [userRole, loading, router]);

  if (loading) {
    return (
      <div>
        <PageTitle title="Cargando Dashboard..." icon={LayoutDashboard} />
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <Skeleton className="h-32 w-full rounded-lg" />
          <Skeleton className="h-32 w-full rounded-lg" />
          <Skeleton className="h-32 w-full rounded-lg" />
          <Skeleton className="h-32 w-full rounded-lg" />
        </div>
      </div>
    );
  }
  
  return (
     <div>
        <PageTitle title="Redirigiendo..." icon={LayoutDashboard} />
        <p className="text-muted-foreground">Serás redirigido a tu panel de control.</p>
      </div>
  );
}
