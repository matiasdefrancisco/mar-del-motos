'use client';

import { useState } from 'react';
import DashboardHeader from "@/components/layout/DashboardHeader";
import DashboardSidebar from "@/components/layout/DashboardSidebar";
import ProtectedRoute from "@/components/auth/ProtectedRoute";
import { useAuth } from "@/contexts/AuthContext";
import { usePathname } from "next/navigation";
import { getAllowedRolesForPath } from "@/lib/auth-utils";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const { userRole } = useAuth();
  const pathname = usePathname();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  // Determinar los roles permitidos basados en la ruta actual usando utilidades centralizadas
  const allowedRoles = getAllowedRolesForPath(pathname);

  return (
    <ProtectedRoute allowedRoles={allowedRoles}>
      <div className="min-h-screen bg-[#1a1a1a]">
        {/* Overlay para móvil cuando el sidebar está abierto */}
        {sidebarOpen && (
          <div 
            className="fixed inset-0 z-40 bg-black/50 lg:hidden"
            onClick={() => setSidebarOpen(false)}
          />
        )}
        
        {/* Sidebar */}
        <DashboardSidebar 
          isOpen={sidebarOpen} 
          onClose={() => setSidebarOpen(false)} 
        />
        
        {/* Contenido principal */}
        <div className="lg:pl-64">
          {/* Header */}
          <DashboardHeader 
            onMenuClick={() => setSidebarOpen(true)} 
          />
          
          {/* Main content */}
          <main className="min-h-[calc(100vh-4rem)] p-4 sm:p-6 lg:p-8">
            <div className="mx-auto max-w-7xl">
              {children}
            </div>
          </main>
        </div>
      </div>
    </ProtectedRoute>
  );
}
