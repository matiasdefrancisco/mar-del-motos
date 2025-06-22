'use client';

import { UserNav } from "@/components/layout/UserNav";
import { Button } from "@/components/ui/button";
import { Menu, Bell, Search } from "lucide-react";
import { cn } from "@/lib/utils";

interface DashboardHeaderProps {
  onMenuClick: () => void;
  className?: string;
}

export default function DashboardHeader({ onMenuClick, className }: DashboardHeaderProps) {
  return (
    <header className={cn(
      "sticky top-0 z-30 h-16 bg-[#1a1a1a] border-b border-[#333333] backdrop-blur supports-[backdrop-filter]:bg-[#1a1a1a]/95",
      className
    )}>
      <div className="flex h-full items-center justify-between px-4 sm:px-6">
        {/* Left side - Menu button for mobile */}
        <div className="flex items-center">
          <Button
            variant="ghost"
            size="sm"
            onClick={onMenuClick}
            className="lg:hidden text-gray-400 hover:text-white hover:bg-[#2d2d2d] mr-2"
          >
            <Menu className="h-5 w-5" />
          </Button>
          
          {/* Page title placeholder - can be dynamic */}
          <h1 className="hidden sm:block text-lg font-semibold text-white">
            Dashboard
          </h1>
        </div>

        {/* Right side - Actions and user nav */}
        <div className="flex items-center space-x-2">
          {/* Search button */}
          <Button
            variant="ghost"
            size="sm"
            className="text-gray-400 hover:text-white hover:bg-[#2d2d2d]"
          >
            <Search className="h-5 w-5" />
          </Button>

          {/* Notifications */}
          <Button
            variant="ghost"
            size="sm"
            className="relative text-gray-400 hover:text-white hover:bg-[#2d2d2d]"
          >
            <Bell className="h-5 w-5" />
            {/* Notification badge */}
            <span className="absolute -top-1 -right-1 h-3 w-3 bg-[#ffd700] rounded-full text-[10px] font-bold text-black flex items-center justify-center">
              2
            </span>
          </Button>

          {/* User navigation */}
          <UserNav />
        </div>
      </div>
    </header>
  );
}

export { DashboardHeader };
