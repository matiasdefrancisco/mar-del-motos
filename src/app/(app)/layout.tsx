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
          <div className="flex flex-1 flex-col">
            {/* Mobile Header */}
            <header className="sticky top-0 z-30 flex h-14 items-center justify-between border-b bg-background px-4 md:hidden">
              <div className="flex items-center gap-3">
                <SidebarTrigger />
                <AppLogo iconSize={32} textSize="text-lg" />
              </div>
              <UserNav />
            </header>
            <main className="flex-1 p-4 sm:p-6 lg:p-8 bg-background">
              {children}
            </main>
          </div>
        </div>
      </SidebarProvider>
    </ProtectedRoute>
  );
}
