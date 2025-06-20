'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import { Skeleton } from '@/components/ui/skeleton';
import Image from 'next/image';
import logoSrc from '@/app/image.png'; // Asegúrate que la ruta sea correcta desde esta ubicación

export default function DashboardRedirectPage() {
  const { userRole, loading: authLoading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    // Esta página es ahora principalmente un fallback.
    // La lógica principal de redirección está en HomePage.
    if (!authLoading) {
      if (userRole) {
        let targetPath = '/login';
        switch (userRole) {
          case 'admin':
            targetPath = '/dashboard/admin';
            break;
          case 'operator':
            targetPath = '/dashboard/operator';
            break;
          case 'rider':
            targetPath = '/dashboard/rider';
            break;
          case 'local':
            targetPath = '/dashboard/local';
            break;
          default:
            // Si alguien llega a /dashboard y el rol no es claro, login es un fallback seguro.
            targetPath = '/login';
        }
        router.replace(targetPath);
      } else {
        router.replace('/login');
      }
    }
  }, [userRole, authLoading, router]);

  // Siempre muestra un cargador de página completa, similar a HomePage,
  // porque esta página no debería ser visible por mucho tiempo.
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-background">
      <div className="w-full max-w-md p-8 space-y-8">
        <div className="text-center">
           <Image
            src={logoSrc}
            alt="Mar del Motos Logo"
            width={48}
            height={48}
            priority
            className="mx-auto"
           />
          <h1 className="mt-6 text-3xl font-extrabold text-foreground">Mar del Motos</h1>
          <p className="mt-2 text-muted-foreground">Cargando panel...</p>
        </div>
        <Skeleton className="h-10 w-full" />
        <Skeleton className="h-10 w-full" />
        <Skeleton className="h-10 w-1/2 mx-auto" />
      </div>
    </div>
  );
}
