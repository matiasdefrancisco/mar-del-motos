
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
        {/* Contenedor A: Flex principal para sidebar y contenido */}
        <div className="flex min-h-screen bg-secondary"> 
          <DashboardSidebar />
          {/* Contenedor B: Columna Header Móvil + Main. Crítico para el control de overflow y flex. */}
          <div className="flex flex-1 flex-col w-full min-w-0 overflow-hidden"> {/* min-w-0 es crucial para que los hijos flex se encojan. overflow-hidden para cortar cualquier desbordamiento de sus hijos directos. */}
            {/* Mobile Header */}
            <header className="navbar sticky top-0 z-30 flex h-14 items-center justify-between border-b px-4 md:hidden">
              <SidebarTrigger />
              <div className="flex items-center gap-3">
                <AppLogo iconSize={32} showText={false} />
                <UserNav />
              </div>
            </header>
            {/* Main es ahora un contenedor flex que delega el scroll a un hijo */}
            <main className="flex-1 flex flex-col w-full bg-background"> {/* flex-1 para ocupar espacio, flex-col para estructura interna */}
              {/* Este div interno maneja el scroll y el padding del contenido de la página */}
              <div className="flex-1 w-full overflow-auto p-4 md:p-6 lg:p-8"> {/* overflow-auto es para el scroll VERTICAL del contenido de la página. El scroll horizontal global ya está prevenido. */}
                {children}
              </div>
            </main>
          </div>
        </div>
      </SidebarProvider>
    </ProtectedRoute>
  );
}

