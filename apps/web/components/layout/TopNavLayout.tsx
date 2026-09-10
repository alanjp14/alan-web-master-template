"use client";

import { useState, type ReactNode } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "cn";
import { MenuIcon, XIcon } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { AccountMenu } from "@/components/layout/AccountMenu";
import { AppearanceMenu } from "@/components/layout/AppearanceMenu";
import { BrandMark } from "@/components/layout/BrandMark";
import { ThemeToggle } from "@/components/layout/ThemeToggle";
import { mainNavigation } from "@/config/navigation";
import { isNavItemActive } from "@/lib/navigation";
import type { AppUser } from "@/types/layout";
import type { NavItem } from "@/types/navigation";

export interface TopNavLayoutProps {
  children: ReactNode;
  /** Flat list of destinations for the top bar. Defaults to the app navigation. */
  navigation?: NavItem[];
  /** Signed-in user, forwarded to the account menu. */
  user?: AppUser;
  /** Rendered in the utility area, before the appearance controls. */
  actions?: ReactNode;
  className?: string;
}

/**
 * Application shell with a horizontal top navigation instead of a sidebar —
 * the alternative to `DashboardLayout` for apps with a shallow section list or
 * a marketing-adjacent feel. Pages compose `PageContainer` inside it exactly
 * as they do under `DashboardLayout`.
 */
export function TopNavLayout({
  children,
  navigation = mainNavigation.flatMap((section) => section.items),
  user,
  actions,
  className,
}: TopNavLayoutProps) {
  const pathname = usePathname();
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <div
      className={cn(
        "flex min-h-svh flex-col bg-background text-foreground",
        className
      )}
    >
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:fixed focus:top-3 focus:left-3 focus:z-50 focus:rounded-md focus:bg-primary focus:px-3 focus:py-2 focus:text-sm focus:font-medium focus:text-primary-foreground focus:outline-none focus:ring-3 focus:ring-ring focus:ring-offset-2 focus:ring-offset-background"
      >
        Skip to main content
      </a>

      <header className="sticky top-0 z-30 border-b border-border bg-background/95 pt-[env(safe-area-inset-top)] supports-backdrop-filter:bg-background/75 supports-backdrop-filter:backdrop-blur">
        <div className="mx-auto flex h-16 w-full max-w-7xl items-center gap-3 px-4 sm:px-6 lg:px-8">
          <BrandMark href={navigation[0]?.href ?? "/"} />

          <nav
            aria-label="Main navigation"
            className="ml-4 hidden items-center gap-0.5 md:flex"
          >
            {navigation.map((item) => {
              const active = isNavItemActive(pathname, item);
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  aria-current={active ? "page" : undefined}
                  className={cn(
                    "flex items-center gap-2 rounded-md px-2.5 py-1.5 text-sm font-medium transition-colors outline-none focus-visible:ring-3 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background",
                    active
                      ? "bg-accent text-accent-foreground"
                      : "text-muted-foreground hover:bg-accent/60 hover:text-foreground"
                  )}
                >
                  <item.icon className="size-4 shrink-0" aria-hidden="true" />
                  {item.title}
                </Link>
              );
            })}
          </nav>

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
            <Button
              variant="ghost"
              size="icon-sm"
              className="md:hidden"
              aria-label={menuOpen ? "Close navigation menu" : "Open navigation menu"}
              aria-expanded={menuOpen}
              aria-controls="topnav-mobile-menu"
              onClick={() => setMenuOpen((open) => !open)}
            >
              {menuOpen ? (
                <XIcon aria-hidden="true" />
              ) : (
                <MenuIcon aria-hidden="true" />
              )}
            </Button>
          </div>
        </div>

        <nav
          id="topnav-mobile-menu"
          aria-label="Main navigation"
          hidden={!menuOpen}
          className="border-t border-border px-4 py-2 sm:px-6 md:hidden"
        >
          <ul className="flex flex-col gap-0.5">
            {navigation.map((item) => {
              const active = isNavItemActive(pathname, item);
              return (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    onClick={() => setMenuOpen(false)}
                    aria-current={active ? "page" : undefined}
                    className={cn(
                      "flex items-center gap-3 rounded-md px-2.5 py-2 text-sm font-medium transition-colors outline-none focus-visible:ring-3 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background",
                      active
                        ? "bg-accent text-accent-foreground"
                        : "text-muted-foreground hover:bg-accent/60 hover:text-foreground"
                    )}
                  >
                    <item.icon className="size-4 shrink-0" aria-hidden="true" />
                    {item.title}
                  </Link>
                </li>
              );
            })}
          </ul>
        </nav>
      </header>

      <main id="main-content" tabIndex={-1} className="flex-1 outline-none">
        {children}
      </main>
    </div>
  );
}
