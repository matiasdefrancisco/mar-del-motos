import type { ReactNode } from 'react';
import DashboardSidebar from '@/components/layout/DashboardSidebar';
// import DashboardHeader from '@/components/layout/DashboardHeader'; // Eliminado
import ProtectedRoute from '@/components/auth/ProtectedRoute';
import { SidebarProvider } from '@/components/ui/sidebar'; 

export default function AppLayout({ children }: { children: ReactNode }) {
  return (
    <ProtectedRoute>
      <SidebarProvider> 
        <div className="flex min-h-screen bg-secondary">
          <DashboardSidebar />
          <div className="flex flex-1 flex-col">
            {/* <DashboardHeader /> // Eliminado */}
            <main className="flex-1 p-4 sm:p-6 lg:p-8 bg-background">
              {children}
            </main>
          </div>
        </div>
      </SidebarProvider>
    </ProtectedRoute>
  );
}
