"use client";

import Link from "next/link";
import { LogOutIcon, SettingsIcon, UserIcon } from "lucide-react";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import type { AppUser } from "@/types/layout";

function initialsOf(name: string): string {
  return name
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part.charAt(0).toUpperCase())
    .join("");
}

export interface AccountMenuProps {
  user: AppUser;
  className?: string;
}

/**
 * Avatar-triggered account dropdown — name, email, profile / settings links,
 * and a sign-out item.
 *
 * Shared by every shell (`AppHeader`, `TopNavLayout`). Auth-agnostic: the
 * "Sign out" item has no handler by design — wire it where you mount the
 * layout, once a session provider exists.
 */
export function AccountMenu({ user, className }: AccountMenuProps) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger
        render={
          <Button
            variant="ghost"
            size="icon-sm"
            className={className ?? "rounded-full"}
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
        {/* Both land on /settings — its first tab is the profile. Split them
            once a consuming app has a dedicated profile route. */}
        <DropdownMenuItem render={<Link href="/settings" />}>
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
