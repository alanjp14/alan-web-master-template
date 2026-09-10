"use client";

import * as React from "react";
import { cn } from "cn";
import { MenuIcon, PanelLeftIcon } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { AccountMenu } from "@/components/layout/AccountMenu";
import { AppearanceMenu } from "@/components/layout/AppearanceMenu";
import { ThemeToggle } from "@/components/layout/ThemeToggle";
import { APP_CONFIG } from "@/config/app";
import { useUIStore } from "@/stores/ui-store";
import type { AppUser } from "@/types/layout";

export interface AppHeaderProps {
  /** Signed-in user. Omit to hide the account menu. */
  user?: AppUser;
  /** Slot between the navigation controls and the utility actions. */
  children?: React.ReactNode;
  /** Appended to the utility actions, before the account menu. */
  actions?: React.ReactNode;
  className?: string;
}

/**
 * Sticky application header.
 *
 * Owns both sidebar controls: a drawer trigger below `lg`, and the desktop rail
 * collapse toggle at and above it.
 */
export function AppHeader({
  user,
  children,
  actions,
  className,
}: AppHeaderProps) {
  const collapsed = useUIStore((state) => state.sidebarCollapsed);
  const toggleSidebar = useUIStore((state) => state.toggleSidebar);
  const setMobileNavOpen = useUIStore((state) => state.setMobileNavOpen);

  return (
    <header
      className={cn(
        "sticky top-0 z-30 flex h-[calc(var(--app-header-height)+env(safe-area-inset-top))] shrink-0 items-center gap-2 border-b border-border bg-background/95 px-4 pt-[env(safe-area-inset-top)] supports-backdrop-filter:bg-background/75 supports-backdrop-filter:backdrop-blur sm:px-6 lg:px-8",
        className
      )}
    >
      <Button
        variant="ghost"
        size="icon-sm"
        className="lg:hidden"
        aria-label="Open navigation menu"
        aria-controls="app-sidebar"
        onClick={() => setMobileNavOpen(true)}
      >
        <MenuIcon aria-hidden="true" />
      </Button>

      <Button
        variant="ghost"
        size="icon-sm"
        className="hidden lg:inline-flex"
        aria-label={collapsed ? "Expand sidebar" : "Collapse sidebar"}
        aria-expanded={!collapsed}
        aria-controls="app-sidebar"
        onClick={toggleSidebar}
      >
        <PanelLeftIcon aria-hidden="true" />
      </Button>

      <span className="truncate text-sm font-semibold tracking-tight lg:hidden">
        {APP_CONFIG.name}
      </span>

      {children && (
        <div className="hidden min-w-0 flex-1 items-center lg:flex">
          {children}
        </div>
      )}

      <div className="ml-auto flex items-center gap-1">
        {actions}
        <AppearanceMenu />
        <ThemeToggle />
        {user && (
          <>
            <Separator
              orientation="vertical"
              className="mx-1 h-5"
              aria-hidden="true"
            />
            <AccountMenu user={user} />
          </>
        )}
      </div>
    </header>
  );
}
