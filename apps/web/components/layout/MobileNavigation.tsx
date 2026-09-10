"use client";

import type { CSSProperties } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "cn";
import { MoreHorizontalIcon } from "lucide-react";

import { mobileNavigation } from "@/config/navigation";
import { LAYOUT } from "@/config/layout";
import { isNavItemActive } from "@/lib/navigation";
import { useUIStore } from "@/stores/ui-store";
import type { NavItem } from "@/types/navigation";

const itemClasses =
  "flex h-full min-w-0 flex-1 flex-col items-center justify-center gap-1 px-1 text-xs font-medium text-muted-foreground transition-colors outline-none hover:text-foreground focus-visible:ring-3 focus-visible:ring-ring focus-visible:ring-inset";

export interface MobileNavigationProps {
  /** Destinations to promote. Keep to four or fewer; a "More" control is added. */
  items?: NavItem[];
  className?: string;
}

/**
 * Fixed bottom navigation for small screens.
 *
 * Carries the promoted destinations plus a "More" control that opens the full
 * sidebar drawer, so nothing is unreachable when the sidebar is hidden. Hidden
 * from `lg` upwards, where `AppSidebar` takes over.
 */
export function MobileNavigation({
  items = mobileNavigation,
  className,
}: MobileNavigationProps) {
  const pathname = usePathname();
  const mobileNavOpen = useUIStore((state) => state.mobileNavOpen);
  const setMobileNavOpen = useUIStore((state) => state.setMobileNavOpen);

  return (
    <nav
      aria-label="Main navigation"
      style={
        { "--app-mobile-nav-height": LAYOUT.mobileNavHeight } as CSSProperties
      }
      className={cn(
        "fixed inset-x-0 bottom-0 z-40 border-t border-border bg-background/95 pb-[env(safe-area-inset-bottom)] supports-backdrop-filter:bg-background/85 supports-backdrop-filter:backdrop-blur lg:hidden",
        className
      )}
    >
      <ul className="flex h-(--app-mobile-nav-height) items-stretch">
        {items.map((item) => {
          const active = isNavItemActive(pathname, item);

          return (
            <li key={item.href} className="flex min-w-0 flex-1">
              <Link
                href={item.href}
                aria-current={active ? "page" : undefined}
                aria-disabled={item.disabled || undefined}
                tabIndex={item.disabled ? -1 : undefined}
                className={cn(
                  itemClasses,
                  active && "text-foreground",
                  item.disabled && "pointer-events-none opacity-50"
                )}
              >
                <item.icon
                  className={cn("size-5 shrink-0", active && "text-primary")}
                  aria-hidden="true"
                />
                <span className="w-full truncate text-center">
                  {item.title}
                </span>
              </Link>
            </li>
          );
        })}

        <li className="flex min-w-0 flex-1">
          <button
            type="button"
            aria-label="Open navigation menu"
            aria-controls="app-sidebar"
            aria-expanded={mobileNavOpen}
            onClick={() => setMobileNavOpen(true)}
            className={itemClasses}
          >
            <MoreHorizontalIcon className="size-5 shrink-0" aria-hidden="true" />
            <span className="w-full truncate text-center">More</span>
          </button>
        </li>
      </ul>
    </nav>
  );
}
