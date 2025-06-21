
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
        <div className="flex h-screen w-full overflow-hidden bg-background">
          <DashboardSidebar />
          
          {/* Contenedor de la columna de contenido principal */}
          <div className="flex flex-1 flex-col min-w-0">
            {/* Header para vista móvil */}
            <header className="flex h-14 flex-shrink-0 items-center justify-between border-b bg-card px-4 md:hidden">
              <SidebarTrigger />
              <div className="flex items-center gap-3">
                <AppLogo iconSize={32} showText={false} />
                <UserNav />
              </div>
            </header>

            {/* Área de contenido principal con scroll vertical */}
            <main className="flex-1 overflow-y-auto p-4 md:p-6 lg:p-8">
              {children}
            </main>
          </div>
        </div>
      </SidebarProvider>
    </ProtectedRoute>
  );
}
