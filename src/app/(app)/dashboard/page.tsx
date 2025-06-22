'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import { getDashboardPath } from '@/lib/auth-utils';
import Image from 'next/image';
import logoSrc from '@/app/image.png';

export default function DashboardPage() {
  const { userRole, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && userRole) {
      console.log('DashboardPage: Redirigiendo a dashboard específico:', userRole);
      const dashboardPath = getDashboardPath(userRole);
      if (dashboardPath !== '/dashboard') {
        router.replace(dashboardPath);
      }
    }
  }, [userRole, loading, router]);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-[#1a1a1a]">
      <div className="relative w-32 h-32 animate-pulse">
        <Image
          src={logoSrc}
          alt="Mar del Motos Logo"
          fill
          style={{ objectFit: 'contain' }}
          priority
        />
      </div>
      <p className="mt-4 text-white text-opacity-80">Redirigiendo al panel correspondiente...</p>
    </div>
  );
}
