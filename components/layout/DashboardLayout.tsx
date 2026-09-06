import type { CSSProperties, ReactNode } from "react";
import { cn } from "cn";

import { AppHeader } from "@/components/layout/AppHeader";
import { AppSidebar } from "@/components/layout/AppSidebar";
import { MobileNavigation } from "@/components/layout/MobileNavigation";
import { LAYOUT } from "@/config/layout";
import type { AppUser } from "@/types/layout";
import type { NavItem, NavSection } from "@/types/navigation";

export interface DashboardLayoutProps {
  children: ReactNode;
  /** Signed-in user, forwarded to the header account menu. */
  user?: AppUser;
  /** Sidebar navigation. Defaults to the shared application navigation. */
  navigation?: NavSection[];
  /** Destinations promoted to the mobile bottom bar. */
  mobileNavigationItems?: NavItem[];
  /** Rendered in the header, between the sidebar controls and the actions. */
  headerContent?: ReactNode;
  /** Rendered in the header utility area, before the account menu. */
  headerActions?: ReactNode;
  /** Rendered at the bottom of the sidebar, above the viewport edge. */
  sidebarFooter?: ReactNode;
  className?: string;
}

/**
 * Application shell: sidebar, header, scrollable content region and mobile
 * bottom navigation.
 *
 * Mount this from a route group's `layout.tsx` rather than from individual
 * pages, so the App Router keeps the shell mounted across navigations and the
 * sidebar state, scroll position and focus survive route changes.
 *
 * This is a server component; only the three chrome components that need
 * pathname or store access opt into the client bundle.
 */
export function DashboardLayout({
  children,
  user,
  navigation,
  mobileNavigationItems,
  headerContent,
  headerActions,
  sidebarFooter,
  className,
}: DashboardLayoutProps) {
  return (
    <div
      style={
        {
          "--app-header-height": LAYOUT.headerHeight,
          "--app-mobile-nav-height": LAYOUT.mobileNavHeight,
        } as CSSProperties
      }
      className={cn("flex min-h-svh bg-background text-foreground", className)}
    >
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:fixed focus:top-3 focus:left-3 focus:z-50 focus:rounded-md focus:bg-primary focus:px-3 focus:py-2 focus:text-sm focus:font-medium focus:text-primary-foreground focus:outline-none focus:ring-3 focus:ring-ring focus:ring-offset-2 focus:ring-offset-background"
      >
        Skip to main content
      </a>

      <AppSidebar sections={navigation} footer={sidebarFooter} />

      <div className="flex min-w-0 flex-1 flex-col">
        <AppHeader user={user} actions={headerActions}>
          {headerContent}
        </AppHeader>

        {/* `tabIndex={-1}` makes the skip link able to move focus here. The
            bottom padding clears the fixed mobile bar and the device safe area. */}
        <main
          id="main-content"
          tabIndex={-1}
          className="flex-1 pb-[calc(var(--app-mobile-nav-height)+env(safe-area-inset-bottom))] outline-none lg:pb-0"
        >
          {children}
        </main>

        <MobileNavigation items={mobileNavigationItems} />
      </div>
    </div>
  );
}
