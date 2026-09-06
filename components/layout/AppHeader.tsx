"use client";

import * as React from "react";
import Link from "next/link";
import { cn } from "cn";
import {
  LogOutIcon,
  MenuIcon,
  PanelLeftIcon,
  SettingsIcon,
  UserIcon,
} from "lucide-react";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Separator } from "@/components/ui/separator";
import { ThemeToggle } from "@/components/layout/ThemeToggle";
import { APP_CONFIG } from "@/config/app";
import { useUIStore } from "@/stores/ui-store";
import type { AppUser } from "@/types/layout";

function initialsOf(name: string): string {
  return name
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part.charAt(0).toUpperCase())
    .join("");
}

function UserMenu({ user }: { user: AppUser }) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger
        render={
          <Button
            variant="ghost"
            size="icon-sm"
            className="rounded-full"
            aria-label={`Account menu for ${user.name}`}
          />
        }
      >
        <Avatar size="sm">
          {user.avatarUrl && <AvatarImage src={user.avatarUrl} alt="" />}
          <AvatarFallback>{initialsOf(user.name)}</AvatarFallback>
        </Avatar>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="min-w-52">
        <div className="px-1.5 py-1">
          <p className="truncate text-sm font-medium">{user.name}</p>
          {user.email && (
            <p className="truncate text-xs text-muted-foreground">
              {user.email}
            </p>
          )}
        </div>
        <DropdownMenuSeparator />
        <DropdownMenuItem render={<Link href="/profile" />}>
          <UserIcon aria-hidden="true" />
          Profile
        </DropdownMenuItem>
        <DropdownMenuItem render={<Link href="/settings" />}>
          <SettingsIcon aria-hidden="true" />
          Settings
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem variant="destructive">
          <LogOutIcon aria-hidden="true" />
          Sign out
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

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
        "sticky top-0 z-30 flex h-(--app-header-height) shrink-0 items-center gap-2 border-b border-border bg-background/95 px-4 supports-backdrop-filter:bg-background/75 supports-backdrop-filter:backdrop-blur sm:px-6",
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
        <ThemeToggle />
        {user && (
          <>
            <Separator
              orientation="vertical"
              className="mx-1 h-5"
              aria-hidden="true"
            />
            <UserMenu user={user} />
          </>
        )}
      </div>
    </header>
  );
}
