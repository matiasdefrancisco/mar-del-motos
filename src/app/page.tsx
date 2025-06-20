'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import { Skeleton } from '@/components/ui/skeleton';
import Image from 'next/image';
import logoSrc from './image.png'; // Importar el logo

export default function HomePage() {
  const { currentUser, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading) {
      if (currentUser) {
        router.replace('/dashboard');
      } else {
        router.replace('/login');
      }
    }
  }, [currentUser, loading, router]);

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
