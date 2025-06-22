'use client';

import type { ReactNode } from 'react';
import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import type { UserRole } from '@/lib/types';
import { validateRouteAccess } from '@/lib/auth-utils';
import { Skeleton } from '@/components/ui/skeleton';
import Image from 'next/image';
import logoSrc from '@/app/image.png';

interface ProtectedRouteProps {
  children: ReactNode;
  allowedRoles?: UserRole[];
}

const ProtectedRoute = ({ children, allowedRoles }: ProtectedRouteProps): ReactNode => {
  const { currentUser, loading, userRole } = useAuth();
  const router = useRouter();

  useEffect(() => {
    // Solo realizar redirecciones cuando no estamos cargando
    if (!loading) {
      if (!currentUser) {
        // Si no hay usuario, redirigir a login
        console.log('ProtectedRoute: No hay usuario, redirigiendo a login');
        router.replace('/login');
        return;
      }

      // Si se especificaron roles permitidos, verificar acceso
      if (allowedRoles && allowedRoles.length > 0) {
        if (!userRole || !allowedRoles.includes(userRole)) {
          console.log('ProtectedRoute: Usuario sin permisos, redirigiendo a su dashboard');
          const { redirectTo } = validateRouteAccess(userRole, window.location.pathname);
          if (redirectTo) {
            router.replace(redirectTo);
          }
        }
      }
    }
  }, [currentUser, loading, router, allowedRoles, userRole]);

  // Mostrar un loader mientras se verifica la autenticación
  if (loading) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center bg-background">
        <div className="relative h-20 w-20 animate-pulse">
          <Image
            src={logoSrc}
            alt="Logo"
            fill
            style={{ objectFit: 'contain' }}
            priority
          />
        </div>
        <div className="mt-8 space-y-2">
          <Skeleton className="h-4 w-[200px]" />
          <Skeleton className="h-4 w-[160px]" />
        </div>
      </div>
    );
  }

  // Si no hay usuario, no mostrar contenido (se está redirigiendo)
  if (!currentUser) {
    return null;
  }

  // Si no hay roles permitidos o el usuario tiene el rol correcto, mostrar el contenido
  if (!allowedRoles || (userRole && allowedRoles.includes(userRole))) {
    return children;
  }

  // No mostrar nada mientras se realiza la redirección
  return null;
};

export default ProtectedRoute;