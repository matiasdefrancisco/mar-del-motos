'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import { Skeleton } from '@/components/ui/skeleton';
import Image from 'next/image';
import logoSrc from './image.png'; // Importar el logo

export default function HomePage() {
  const { currentUser, loading, userRole } = useAuth(); // Agregado userRole
  const router = useRouter();

  useEffect(() => {
    if (!loading) {
      if (currentUser && userRole) { // Comprobar currentUser y userRole
        let targetPath = '/login'; // Fallback por si el rol no es reconocido
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
            // Si el rol es null o no reconocido pero currentUser existe,
            // podría ser un estado intermedio o un error.
            // Por seguridad, redirigir a login o a un dashboard general si existe.
            // O se podría esperar a que userRole se defina si es un problema de timing.
            // Por ahora, si hay usuario pero el rol no lleva a un dashboard específico,
            // se podría considerar redirigir a /dashboard para que DashboardRedirectPage maneje.
            // Pero para el flujo deseado, idealmente HomePage lo resuelve todo.
            // Si userRole es null pero currentUser existe, puede que el perfil aun no cargue.
            // En este caso, el AuthContext debería eventualmente proveer el userRole.
            // La dependencia en userRole en el useEffect asegura que se re-evalúe.
            targetPath = '/dashboard'; // Dejar que DashboardRedirectPage maneje si el rol no está claro aquí
            break;
        }
        router.replace(targetPath);
      } else {
        router.replace('/login');
      }
    }
  }, [currentUser, loading, userRole, router]);

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
          <p className="mt-2 text-muted-foreground">Cargando aplicación...</p>
        </div>
        <Skeleton className="h-10 w-full" />
        <Skeleton className="h-10 w-full" />
        <Skeleton className="h-10 w-1/2 mx-auto" />
      </div>
    </div>
  );
}
