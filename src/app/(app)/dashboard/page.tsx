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
    // Only attempt to redirect once the authentication state is resolved
    if (!loading) {
      if (userRole) {
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
            // Fallback for unrecognized role or if role is null but user is somehow considered authenticated
            router.replace('/login'); 
        }
      } else {
        // If not loading and no userRole (implies not logged in or role not yet determined)
        router.replace('/login');
      }
    }
  }, [userRole, loading, router]);

  // If AuthContext is still loading, ProtectedRoute is likely showing a full-page skeleton.
  // This UI might be shown briefly or be superseded.
  if (loading) {
    return (
      <div>
        <PageTitle title="Cargando Dashboard..." icon={LayoutDashboard} subtitle="Preparando tu espacio de trabajo." />
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          <Skeleton className="h-36 w-full rounded-lg" />
          <Skeleton className="h-36 w-full rounded-lg" />
          <Skeleton className="h-36 w-full rounded-lg hidden md:block" />
          <Skeleton className="h-36 w-full rounded-lg hidden xl:block" />
        </div>
        <div className="mt-6">
          <Skeleton className="h-64 w-full rounded-lg" />
        </div>
      </div>
    );
  }

  // If AuthContext is loaded (!loading), ProtectedRoute has passed.
  // We are now waiting for the useEffect above to redirect.
  // Show a more minimal skeleton within the AppLayout's content area.
  // No PageTitle here to avoid the "otra pantalla" feeling.
  return (
    <div className="space-y-6 p-4 md:p-6 lg:p-8"> {/* Added padding here to match content pages */}
      <Skeleton className="h-10 w-1/3 rounded-lg" /> {/* Placeholder for a title-like element */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        <Skeleton className="h-32 w-full rounded-lg" />
        <Skeleton className="h-32 w-full rounded-lg" />
        <Skeleton className="h-32 w-full rounded-lg hidden md:block" />
      </div>
      <Skeleton className="h-48 w-full rounded-lg" />
    </div>
  );
}
