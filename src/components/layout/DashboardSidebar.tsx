'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  Sidebar,
  SidebarHeader,
  SidebarContent,
  SidebarFooter,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarMenuBadge,
  SidebarMenuSub,
  SidebarMenuSubItem,
  SidebarMenuSubButton,
  SidebarSeparator,
} from '@/components/ui/sidebar';
import AppLogo from '@/components/layout/AppLogo';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/contexts/AuthContext';
import type { UserRole } from '@/lib/types';
import {
  LayoutDashboard,
  Users,
  ClipboardList,
  Bike,
  DollarSign,
  Settings,
  HelpCircle,
  Bot,
  LogOut,
  Building,
  MapPin,
  FileText,
  AreaChart,
  CreditCard,
  TestTube, // Importado TestTube
} from 'lucide-react';

interface NavItem {
  href: string;
  label: string;
  icon: React.ElementType;
  roles: UserRole[];
  subItems?: NavItem[];
  badge?: string;
}

const navItems: NavItem[] = [
  { href: '/dashboard', label: 'Dashboard', icon: LayoutDashboard, roles: ['admin', 'operator', 'rider', 'local'] },
  { 
    href: '/dashboard/orders', 
    label: 'Pedidos', 
    icon: ClipboardList, 
    roles: ['admin', 'operator', 'local'],
  },
  { href: '/dashboard/riders', label: 'Riders', icon: Bike, roles: ['admin', 'operator'] },
  { href: '/dashboard/locals', label: 'Locales', icon: Building, roles: ['admin', 'operator'] },
  { 
    href: '/dashboard/debts', 
    label: 'Deudas', 
    icon: CreditCard, 
    roles: ['admin', 'operator', 'rider'],
    badge: 'Nuevo'
  },
  { href: '/dashboard/operator/ai-payment-plan', label: 'Plan de Pago IA', icon: Bot, roles: ['operator'] },
  { href: '/dashboard/reports', label: 'Reportes', icon: AreaChart, roles: ['admin'] },
  { href: '/dashboard/user-management', label: 'Usuarios', icon: Users, roles: ['admin'] },
  { href: '/dashboard/settings', label: 'Configuración', icon: Settings, roles: ['admin', 'operator', 'rider', 'local'] },
  { href: '/dashboard/test', label: 'Dashboard Prueba', icon: TestTube, roles: ['admin', 'operator', 'rider', 'local'] }, // Nueva página de prueba
];


export default function DashboardSidebar() {
  const pathname = usePathname();
  const { userRole, logout, currentUser } = useAuth();

  const isActive = (href: string, exact: boolean = false) => {
    if (exact) return pathname === href;
    return pathname.startsWith(href);
  };

  const filteredNavItems = navItems.filter(item => userRole && item.roles.includes(userRole));

  return (
    <Sidebar collapsible="icon" variant="sidebar" side="left" className="border-r">
      <SidebarHeader className="p-4 border-b border-sidebar-border">
        <AppLogo />
      </SidebarHeader>
      <SidebarContent className="flex-1 p-2">
        <SidebarMenu>
          {filteredNavItems.map((item) => (
            <SidebarMenuItem key={item.href}>
              <SidebarMenuButton
                asChild
                isActive={isActive(item.href, item.href === '/dashboard')}
                tooltip={{ children: item.label, className: "bg-popover text-popover-foreground" }}
              >
                <Link href={item.href}>
                  <item.icon />
                  <span>{item.label}</span>
                  {item.badge && <SidebarMenuBadge>{item.badge}</SidebarMenuBadge>}
                </Link>
              </SidebarMenuButton>
              {item.subItems && isActive(item.href) && (
                <SidebarMenuSub>
                  {item.subItems.filter(sub => userRole && sub.roles.includes(userRole)).map(subItem => (
                     <SidebarMenuSubItem key={subItem.href}>
                       <SidebarMenuSubButton asChild isActive={isActive(subItem.href, true)}>
                         <Link href={subItem.href}>
                           <subItem.icon />
                           <span>{subItem.label}</span>
                         </Link>
                       </SidebarMenuSubButton>
                     </SidebarMenuSubItem>
                  ))}
                </SidebarMenuSub>
              )}
            </SidebarMenuItem>
          ))}
        </SidebarMenu>
      </SidebarContent>
      <SidebarFooter className="p-4 border-t border-sidebar-border">
        <Button variant="ghost" className="w-full justify-start gap-2 text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground" onClick={logout}>
          <LogOut size={16} /> Salir
        </Button>
      </SidebarFooter>
    </Sidebar>
  );
}
