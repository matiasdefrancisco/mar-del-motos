
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
        <div className="flex min-h-screen bg-secondary">
          <DashboardSidebar />
          {/* Contenedor B: Columna Header Móvil + Main. overflow-hidden aquí es CLAVE. */}
          <div className="flex flex-1 flex-col w-full min-w-0 overflow-hidden">
            {/* Mobile Header */}
            <header className="navbar sticky top-0 z-30 flex h-14 items-center justify-between border-b px-4 md:hidden">
              {/* Left: Hamburger Menu */}
              <SidebarTrigger />
              
              {/* Right: App Logo (icon only) + UserNav */}
              <div className="flex items-center gap-3">
                <AppLogo iconSize={32} showText={false} />
                <UserNav />
              </div>
            </header>
            {/* Main ahora es relativo y flex-1 para tomar altura. No gestiona overflow ni padding directamente. */}
            <main className="relative flex-1 w-full bg-background">
              {/* Este div interno se encarga del scroll y el padding */}
              <div className="absolute inset-0 overflow-auto p-4 md:p-6 lg:p-8">
                {children}
              </div>
            </main>
          </div>
        </div>
      </SidebarProvider>
    </ProtectedRoute>
  );
}
