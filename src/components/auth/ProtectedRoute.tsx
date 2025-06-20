'use client';

import type { ReactNode } from 'react';
import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import type { UserRole } from '@/lib/types';
import { Skeleton } from '@/components/ui/skeleton';

interface ProtectedRouteProps {
  children: ReactNode;
  allowedRoles?: UserRole[];
}

const ProtectedRoute = ({ children, allowedRoles }: ProtectedRouteProps): ReactNode => {
  const { currentUser, loading, userRole } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading) {
      if (!currentUser) {
        router.replace('/login');
      } else if (allowedRoles && userRole && !allowedRoles.includes(userRole)) {
        // Redirect to a generic dashboard or an unauthorized page
        // For now, redirect to their specific dashboard, or a general one if role doesn't match.
        // This logic might need refinement based on exact UX for unauthorized access to specific sections.
        router.replace(`/dashboard`); 
      }
    }
  }, [currentUser, loading, userRole, allowedRoles, router]);

  if (loading || (!currentUser && typeof window !== 'undefined')) {
    // Basic loading UI, consistent with AuthProvider's loading
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-background p-4">
        <div className="w-full max-w-md space-y-4">
          <Skeleton className="h-12 w-full" />
          <Skeleton className="h-32 w-full" />
          <Skeleton className="h-10 w-full" />
        </div>
      </div>
    );
  }

  if (!currentUser) {
    return null; // Or a redirect component, though useEffect handles it
  }
  
  if (allowedRoles && userRole && !allowedRoles.includes(userRole)) {
     // Show a message or redirect, though useEffect should handle redirect
    return (
        <div className="flex flex-col items-center justify-center min-h-screen">
            <p className="text-lg text-destructive">Acceso no autorizado.</p>
            <p className="text-sm text-muted-foreground">Serás redirigido en breve.</p>
        </div>
    );
  }

  return children;
};

export default ProtectedRoute;
