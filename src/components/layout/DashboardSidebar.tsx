'use client';

import { usePathname } from "next/navigation";
import Link from "next/link";
import { useAuth } from "@/contexts/AuthContext";
import { cn } from "@/lib/utils";
import AppLogo from "@/components/layout/AppLogo";
import type { UserRole } from "@/lib/types";
import { 
  Home,
  Package,
  Users, 
  Settings,
  LogOut,
  X,
  BarChart3,
  FileText,
  MapPin,
  Clock,
  DollarSign,
  Truck,
  CheckCircle,
  AlertCircle
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";

interface DashboardSidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

interface NavItem {
  href: string;
  label: string;
  icon: any;
  exact?: boolean;
}

export default function DashboardSidebar({ isOpen, onClose }: DashboardSidebarProps) {
  const { currentUser, logout } = useAuth();
  const pathname = usePathname();

  const isActive = (href: string, exact: boolean = false) => {
    if (exact) return pathname === href;
    return pathname.startsWith(href);
  };

  const handleLogout = async () => {
    try {
      await logout();
      onClose();
    } catch (error) {
      console.error("Error al cerrar sesión:", error);
    }
  };

  const getNavItems = (): NavItem[] => {
    const role = currentUser?.profile.role;

    switch (role) {
      case "admin":
        return [
          { href: "/dashboard/admin", label: "Panel Principal", icon: Home, exact: true },
          { href: "/dashboard/admin/usuarios", label: "Gestión de Usuarios", icon: Users },
          { href: "/dashboard/admin/usuarios/crear", label: "Crear Usuario", icon: Users },
          { href: "/dashboard/admin/reportes", label: "Reportes", icon: BarChart3 },
          { href: "/dashboard/admin/configuracion", label: "Configuración", icon: Settings },
        ];
      
      case "operator":
        return [
          { href: "/dashboard/operator", label: "Panel Principal", icon: Home, exact: true },
          { href: "/dashboard/operator/pedidos", label: "Gestión de Pedidos", icon: Package },
          { href: "/dashboard/operator/riders", label: "Repartidores", icon: Truck },
          { href: "/dashboard/operator/ai-payment-plan", label: "Plan de Pagos IA", icon: DollarSign },
        ];
      
      case "rider":
        return [
          { href: "/dashboard/rider", label: "Panel Principal", icon: Home, exact: true },
          { href: "/dashboard/rider/pedidos", label: "Mis Pedidos", icon: Package },
          { href: "/dashboard/rider/rutas", label: "Rutas", icon: MapPin },
          { href: "/dashboard/rider/historial", label: "Historial", icon: Clock },
          { href: "/dashboard/rider/deudas", label: "Mis Deudas", icon: DollarSign },
        ];
      
      case "local":
        return [
          { href: "/dashboard/local", label: "Panel Principal", icon: Home, exact: true },
          { href: "/dashboard/local/pedidos", label: "Mis Pedidos", icon: Package },
          { href: "/dashboard/local/productos", label: "Productos", icon: FileText },
          { href: "/dashboard/local/deudas", label: "Deudas", icon: DollarSign },
        ];
      
      default:
        return [
          { href: "/dashboard", label: "Panel Principal", icon: Home, exact: true },
        ];
    }
  };

  const navItems = getNavItems();

  const SidebarContent = () => (
    <div className="flex h-full flex-col bg-[#1a1a1a] border-r border-[#333333]">
      {/* Header */}
      <div className="flex h-16 items-center justify-between px-6 border-b border-[#333333]">
        <AppLogo />
                <Button
          variant="ghost"
          size="sm"
          onClick={onClose}
          className="lg:hidden text-gray-400 hover:text-white hover:bg-[#2d2d2d]"
        >
          <X className="h-5 w-5" />
                </Button>
      </div>

      {/* User Info */}
      <div className="p-6 border-b border-[#333333]">
        <div className="flex items-center space-x-3">
          <div className="h-10 w-10 rounded-full bg-[#ffd700] flex items-center justify-center">
            <span className="text-black font-semibold text-sm">
              {currentUser?.profile?.displayName?.charAt(0).toUpperCase() || 
               currentUser?.email?.charAt(0).toUpperCase() || 'U'}
            </span>
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium text-white truncate">
              {currentUser?.profile?.displayName || currentUser?.email}
            </p>
            <p className="text-xs text-gray-400 capitalize">
              {getRoleLabel(currentUser?.profile?.role || null)}
            </p>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <ScrollArea className="flex-1 px-3 py-4">
        <nav className="space-y-1">
          {navItems.map((item) => {
            const Icon = item.icon;
            const active = isActive(item.href, item.exact);
            
            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={onClose}
                className={cn(
                  "flex items-center px-3 py-2.5 text-sm font-medium rounded-lg transition-colors",
                  active
                    ? "bg-[#ffd700]/10 text-[#ffd700] border border-[#ffd700]/20"
                    : "text-gray-300 hover:text-white hover:bg-[#2d2d2d]"
                )}
              >
                <Icon className={cn("mr-3 h-5 w-5", active ? "text-[#ffd700]" : "text-gray-400")} />
                {item.label}
              </Link>
            );
          })}
        </nav>
    </ScrollArea>

      {/* Footer */}
      <div className="p-4 border-t border-[#333333]">
        <Button
          variant="ghost"
          onClick={handleLogout}
          className="w-full justify-start text-gray-300 hover:text-white hover:bg-[#2d2d2d]"
        >
          <LogOut className="mr-3 h-5 w-5" />
          Cerrar Sesión
        </Button>
      </div>
    </div>
  );

  return (
    <>
      {/* Desktop Sidebar */}
      <div className="hidden lg:fixed lg:inset-y-0 lg:z-50 lg:flex lg:w-64 lg:flex-col">
        <SidebarContent />
      </div>

      {/* Mobile Sidebar */}
      <div className={cn(
        "fixed inset-y-0 left-0 z-50 w-64 transform transition-transform duration-300 ease-in-out lg:hidden",
        isOpen ? "translate-x-0" : "-translate-x-full"
      )}>
        <SidebarContent />
      </div>
    </>
  );
}

const getRoleLabel = (role: UserRole) => {
  switch (role) {
    case "admin":
      return "Administrador";
    case "operator":
      return "Operador";
    case "rider":
      return "Repartidor";
    case "local":
      return "Local";
    default:
      return "Usuario";
  }
};

export { DashboardSidebar };
