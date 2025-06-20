
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
          {/* min-w-0 es importante para que el flex child pueda encogerse. Se añade overflow-x-hidden aquí. */}
          <div className="flex flex-1 flex-col w-full min-w-0 overflow-x-hidden"> {/* Asegurado w-full y mantenido overflow-x-hidden */}
            {/* Mobile Header */}
            <header className="navbar sticky top-0 z-30 flex h-14 items-center justify-between border-b px-4 md:hidden">
              {/* bg-background class is removed as .navbar provides its own background */}
              {/* position: relative and overflow: hidden are implicitly handled by .navbar class or sticky positioning */}
              <div className="flex items-center gap-3">
                <SidebarTrigger />
                <AppLogo iconSize={32} textSize="text-lg" />
              </div>
              <UserNav />
            </header>
            {/* overflow-x-hidden también se mantiene en main por si acaso, pero el del div superior es más general */}
            <main className="flex-1 bg-background pt-20 px-4 pb-4 md:p-6 lg:p-8 overflow-x-hidden w-full"> {/* Asegurado w-full y mantenido overflow-x-hidden */}
              {children}
            </main>
          </div>
        </div>
      </SidebarProvider>
    </ProtectedRoute>
  );
}
