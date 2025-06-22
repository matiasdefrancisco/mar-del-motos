'use client';

import * as React from "react"
import { cn } from '@/lib/utils';

// Sidebar principal
export function Sidebar({
      className,
      children,
      ...props
}: React.HTMLAttributes<HTMLElement>) {
  return (
    <aside
      className={cn(
        "fixed top-0 left-0 z-30 h-screen w-72 border-r bg-background",
        className
      )}
      {...props}
    >
      {children}
    </aside>
  );
}

// Contenido del Sidebar
export function SidebarContent({
  className,
  children,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn(
        "flex h-full w-full flex-col overflow-y-auto sidebar-metallic-effect",
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
}

// Header del Sidebar
export function SidebarHeader({
  className,
  children,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn("flex h-14 items-center border-b px-4", className)}
      {...props}
    >
      {children}
    </div>
  );
}

// Menú del Sidebar
export function SidebarMenu({
  className,
  children,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <nav className={cn("flex-1 space-y-1 p-2", className)} {...props}>
      {children}
    </nav>
  );
}

// Botón del menú del Sidebar
interface SidebarMenuButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  active?: boolean;
  icon?: React.ElementType;
  badge?: string;
}

export function SidebarMenuButton({
  className,
  children,
  active,
  icon: Icon,
  badge,
  ...props
}: SidebarMenuButtonProps) {
  return (
    <button
      className={cn(
        "group flex w-full items-center rounded-md px-3 py-2 text-sm font-medium hover:bg-accent hover:text-accent-foreground",
        active && "bg-accent text-accent-foreground",
        className
      )}
      {...props}
    >
      {Icon && (
        <Icon
          className={cn(
            "mr-2 h-4 w-4",
            active
              ? "text-accent-foreground"
              : "text-muted-foreground group-hover:text-accent-foreground"
          )}
        />
      )}
      <span className="flex-1 truncate">{children}</span>
      {badge && (
        <span
          className={cn(
            "ml-2 rounded-full bg-primary/10 px-2 py-0.5 text-xs font-normal text-primary",
            active && "bg-background/20 text-accent-foreground"
          )}
        >
          {badge}
        </span>
      )}
    </button>
  );
}

// Grupo de botones del menú del Sidebar
export function SidebarMenuButtonGroup({
  className,
  children,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn("space-y-1", className)}
      role="group"
      {...props}
    >
      {children}
    </div>
  );
}

// Botón de submenú del Sidebar
interface SidebarMenuSubButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  expanded?: boolean;
  icon?: React.ElementType;
}

export function SidebarMenuSubButton({
  className,
  children,
  expanded,
  icon: Icon,
  ...props
}: SidebarMenuSubButtonProps) {
  return (
    <button
      className={cn(
        "group flex w-full items-center rounded-md px-3 py-2 text-sm font-medium hover:bg-accent hover:text-accent-foreground",
        className
      )}
      {...props}
    >
      {Icon && (
        <Icon
          className="mr-2 h-4 w-4 text-muted-foreground group-hover:text-accent-foreground"
        />
      )}
      <span className="flex-1 truncate">{children}</span>
      <svg
        className={cn(
          "ml-2 h-4 w-4 transition-transform text-muted-foreground",
          expanded && "rotate-180"
        )}
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M19 9l-7 7-7-7"
        />
      </svg>
    </button>
  );
}

// Footer del Sidebar
export function SidebarFooter({
  className,
  children,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn("mt-auto border-t p-4", className)}
      {...props}
    >
      {children}
    </div>
  );
}

// Grupo de elementos del sidebar
export const SidebarGroup = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, children, ...props }, ref) => {
    return (
  <div
    ref={ref}
        className={cn("space-y-3 pt-4", className)}
    {...props}
      >
        {children}
      </div>
    );
  }
);
SidebarGroup.displayName = "SidebarGroup";

// Etiqueta del grupo
export const SidebarGroupLabel = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, children, ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={cn(
          "px-3 text-xs font-medium text-muted-foreground",
          className
        )}
        {...props}
      >
        {children}
      </div>
    );
  }
);
SidebarGroupLabel.displayName = "SidebarGroupLabel";

// Contenido del grupo
export const SidebarGroupContent = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, children, ...props }, ref) => {
    return (
      <div ref={ref} className={cn("space-y-1", className)} {...props}>
        {children}
      </div>
    );
  }
);
SidebarGroupContent.displayName = "SidebarGroupContent";

// Item del menú
export const SidebarMenuItem = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, children, ...props }, ref) => {
  return (
  <div
    ref={ref}
    className={cn(
          "flex items-center rounded-lg px-3 py-2 text-sm font-medium hover:bg-accent hover:text-accent-foreground",
      className
    )}
    {...props}
      >
        {children}
      </div>
    );
  }
);
SidebarMenuItem.displayName = "SidebarMenuItem";

// Submenú
export const SidebarMenuSub = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, children, ...props }, ref) => {
  return (
      <div ref={ref} className={cn("space-y-1", className)} {...props}>
        {children}
    </div>
    );
  }
);
SidebarMenuSub.displayName = "SidebarMenuSub";

export function SidebarMenuSubItem({
  className,
  children,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn(
        "flex w-full items-center rounded-md p-2 hover:bg-accent",
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
}

