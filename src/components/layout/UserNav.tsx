'use client';

import { Avatar, AvatarFallback } from "../ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu";
import { useAuth } from "@/contexts/AuthContext";
import { LogOut, Settings, User } from "lucide-react";

export function UserNav() {
  const { currentUser, logout } = useAuth();

  const initials = currentUser?.displayName
    ?.split(" ")
    .map(n => n[0])
    .join("")
    .toUpperCase() || "U";

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Avatar className="h-8 w-8 cursor-pointer border border-[#333333] hover:border-[#ffd700]">
          <AvatarFallback className="bg-[#1a1a1a] text-sm text-white">
            {initials}
          </AvatarFallback>
        </Avatar>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-56 bg-[#1a1a1a] text-white">
        <DropdownMenuLabel>
          <div className="flex flex-col space-y-1">
            <p className="text-sm font-medium">{currentUser?.displayName}</p>
            <p className="text-xs text-gray-400">{currentUser?.email}</p>
          </div>
        </DropdownMenuLabel>
        <DropdownMenuSeparator className="bg-[#333333]" />
        <DropdownMenuItem className="flex cursor-pointer items-center gap-2 text-sm hover:bg-[#333333]">
          <User className="h-4 w-4" />
          Perfil
        </DropdownMenuItem>
        <DropdownMenuItem className="flex cursor-pointer items-center gap-2 text-sm hover:bg-[#333333]">
          <Settings className="h-4 w-4" />
          Configuración
        </DropdownMenuItem>
        <DropdownMenuSeparator className="bg-[#333333]" />
        <DropdownMenuItem 
          className="flex cursor-pointer items-center gap-2 text-sm text-red-500 hover:bg-[#333333] hover:text-red-400"
          onClick={() => logout()}
        >
          <LogOut className="h-4 w-4" />
          Cerrar Sesión
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
