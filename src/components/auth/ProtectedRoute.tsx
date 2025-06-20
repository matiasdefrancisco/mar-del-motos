'use client';

import type { ReactNode } from 'react';
import { useEffect, useState } from 'react';
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
  const [clientSideLoaded, setClientSideLoaded] = useState(false);

  useEffect(() => {
    // Este efecto se ejecuta solo en el cliente, después del montaje inicial.
    setClientSideLoaded(true);
  }, []);

  useEffect(() => {
    // Esta lógica de redirección solo debe ejecutarse cuando:
    // 1. El contexto de autenticación haya terminado de cargar (`!loading`).
    // 2. El componente se haya montado en el cliente (`clientSideLoaded`).
    if (!loading && clientSideLoaded) {
      if (!currentUser) {
        router.replace('/login');
      } else if (allowedRoles && userRole && !allowedRoles.includes(userRole)) {
        // Si hay roles permitidos, y el rol del usuario no está entre ellos, redirigir.
        router.replace(`/dashboard`); // Redirige a un dashboard general o a una página de "no autorizado".
      }
    }
  }, [currentUser, loading, userRole, allowedRoles, router, clientSideLoaded]);

  if (loading || !clientSideLoaded) {
    // Muestra un esqueleto si el contexto de Auth está cargando O si el cliente aún no se ha hidratado.
    // Esto asegura que el renderizado inicial del servidor y del cliente sea consistente (mostrando un esqueleto).
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-background p-4">
        <div className="w-full max-w-md space-y-4">
          <Skeleton className="h-12 w-full rounded-lg" />
          <Skeleton className="h-32 w-full rounded-lg" />
          <Skeleton className="h-10 w-full rounded-lg" />
        </div>
      </div>
    );
  }

  // En este punto, `loading` es false y `clientSideLoaded` es true.
  // El useEffect anterior se encarga de las redirecciones.
  // Si la redirección aún no ha ocurrido pero las condiciones se cumplen (ej. !currentUser),
  // podemos mostrar un mensaje de "Redirigiendo..." o "Acceso no autorizado".

  if (!currentUser) {
    // Esto se mostrará brevemente si currentUser es null y la redirección de useEffect está en proceso.
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-background p-4">
        <p className="text-muted-foreground">Redirigiendo al inicio de sesión...</p>
      </div>
    );
  }

  if (allowedRoles && userRole && !allowedRoles.includes(userRole)) {
    // El usuario está autenticado pero no tiene el rol adecuado para esta ruta.
    // useEffect también intentará redirigir.
    return (
      <div className="flex flex-col items-center justify-center min-h-screen">
        <p className="text-lg text-destructive">Acceso no autorizado.</p>
        <p className="text-sm text-muted-foreground">Serás redirigido a tu panel.</p>
      </div>
    );
  }

  // Si todas las verificaciones pasan (usuario autenticado, rol coincide si es necesario), renderiza los hijos.
  return children;
};

export default ProtectedRoute;
