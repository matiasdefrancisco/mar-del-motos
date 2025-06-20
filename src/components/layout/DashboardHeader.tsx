'use client';

import { UserNav } from "@/components/layout/UserNav";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { cn } from "@/lib/utils";

interface DashboardHeaderProps {
  className?: string;
}

export default function DashboardHeader({ className }: DashboardHeaderProps) {
  return (
    <header
      className={cn(
        "sticky top-0 z-40 flex h-16 items-center justify-between gap-4 border-b bg-background px-4 sm:px-6",
        className
      )}
    >
      <div className="flex items-center">
        {/* Mobile sidebar trigger - uses shadcn's sidebar context if available */}
        <SidebarTrigger className="md:hidden" /> 
        {/* Can add breadcrumbs or page title here */}
      </div>
      <div className="flex items-center gap-4">
        {/* <ModeToggle /> Add dark mode toggle if needed */}
        <UserNav />
      </div>
    </header>
  );
}
