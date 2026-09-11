"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
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
import { authClient } from "@/lib/auth-client";
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
 * Shared by every shell (`AppHeader`, `TopNavLayout`). "Sign out" calls
 * `authClient.signOut()` (Better Auth, proxied through this app's own
 * origin — see `lib/auth-client.ts`) directly rather than taking a prop,
 * since every route that renders this menu is behind the same session.
 */
export function AccountMenu({ user, className }: AccountMenuProps) {
  const router = useRouter();
  const [signingOut, setSigningOut] = useState(false);

  async function handleSignOut() {
    setSigningOut(true);
    await authClient.signOut();
    router.push("/sign-in");
    router.refresh();
  }

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
        <DropdownMenuItem
          variant="destructive"
          disabled={signingOut}
          onClick={() => void handleSignOut()}
        >
          <LogOutIcon aria-hidden="true" />
          {signingOut ? "Signing out…" : "Sign out"}
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
