'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import { getDashboardPath } from '@/lib/auth-utils';
import Image from 'next/image';
import logoSrc from './image.png';

export default function HomePage() {
  const { currentUser, loading, userRole } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading) {
      if (currentUser && userRole) {
        // Si el usuario está autenticado y tiene un rol, redirigir al dashboard correspondiente
        console.log('HomePage: Usuario autenticado, redirigiendo a dashboard:', userRole);
        const dashboardPath = getDashboardPath(userRole);
        router.replace(dashboardPath);
      } else {
        // Si no hay usuario o no tiene rol, redirigir a login
        console.log('HomePage: No hay usuario o rol, redirigiendo a login');
        router.replace('/login');
      }
    }
  }, [currentUser, loading, userRole, router]);

  // Mostrar pantalla de carga mientras se verifica la autenticación
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-[#1a1a1a]">
      <div className="relative w-32 h-32 animate-pulse">
        <Image
          src={logoSrc}
          alt="Mar del Motos Logo"
          fill
          style={{ objectFit: 'contain' }}
          priority
        />
      </div>
      <p className="mt-4 text-white text-opacity-80">Cargando...</p>
    </div>
  );
}
