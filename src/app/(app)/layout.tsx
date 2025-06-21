
import type { ReactNode } from 'react';
import DashboardSidebar from '@/components/layout/DashboardSidebar';
import ProtectedRoute from '@/components/auth/ProtectedRoute';
import { SidebarProvider, SidebarTrigger } from '@/components/ui/sidebar';
import AppLogo from '@/components/layout/AppLogo';
import { UserNav } from '@/components/layout/UserNav';

export default function AppLayout({ children }: { children: ReactNode }) {
  return (
    <ProtectedRoute>
      <SidebarProvider>
        {/* Contenedor Flex principal para sidebar y contenido */}
        <div className="flex min-h-screen bg-secondary"> 
          <DashboardSidebar />
          {/* Contenedor para la columna de contenido principal */}
          <div className="flex-1 flex flex-col min-w-0">
            {/* Header para vista móvil, se mantiene sticky */}
            <header className="navbar sticky top-0 z-30 flex h-14 items-center justify-between border-b px-4 md:hidden">
              <SidebarTrigger />
              <div className="flex items-center gap-3">
                <AppLogo iconSize={32} showText={false} />
                <UserNav />
              </div>
            </header>
            {/* El <main> ahora es el contenedor principal que se expande y permite scroll vertical */}
            <main className="flex-1 overflow-y-auto bg-background">
              {/* Contenedor interno solo para el padding del contenido */}
              <div className="p-4 md:p-6 lg:p-8">
                {children}
              </div>
            </main>
          </div>
        </div>
      </SidebarProvider>
    </ProtectedRoute>
  );
}
