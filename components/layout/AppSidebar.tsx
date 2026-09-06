"use client";

import * as React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "cn";

import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { APP_CONFIG } from "@/config/app";
import { LAYOUT } from "@/config/layout";
import { mainNavigation } from "@/config/navigation";
import { useUIStoreHydration } from "@/hooks/use-ui-store-hydration";
import { isNavItemActive } from "@/lib/navigation";
import { useUIStore } from "@/stores/ui-store";
import type { NavItem, NavSection } from "@/types/navigation";

function SidebarBrand({ collapsed }: { collapsed: boolean }) {
  return (
    <div
      className={cn(
        "flex h-[calc(var(--app-header-height)+env(safe-area-inset-top))] shrink-0 items-center gap-2.5 border-b border-sidebar-border px-4 pt-[env(safe-area-inset-top)]",
        collapsed && "justify-center px-0"
      )}
    >
      <span
        aria-hidden="true"
        className="grid size-8 shrink-0 place-items-center rounded-lg bg-sidebar-primary text-sm font-semibold text-sidebar-primary-foreground"
      >
        {APP_CONFIG.name.charAt(0)}
      </span>
      <span
        className={cn(
          "truncate text-sm font-semibold tracking-tight",
          collapsed && "sr-only"
        )}
      >
        {APP_CONFIG.name}
      </span>
    </div>
  );
}

function SidebarNavLink({
  item,
  collapsed,
  active,
  onNavigate,
}: {
  item: NavItem;
  collapsed: boolean;
  active: boolean;
  onNavigate?: () => void;
}) {
  const link = (
    <Link
      href={item.href}
      onClick={onNavigate}
      aria-current={active ? "page" : undefined}
      aria-disabled={item.disabled || undefined}
      tabIndex={item.disabled ? -1 : undefined}
      className={cn(
        "flex h-9 items-center gap-3 rounded-md px-2.5 text-sm font-medium text-sidebar-foreground/70 transition-colors outline-none",
        "hover:bg-sidebar-accent hover:text-sidebar-accent-foreground",
        "focus-visible:ring-2 focus-visible:ring-sidebar-ring focus-visible:ring-offset-2 focus-visible:ring-offset-sidebar",
        active &&
          "bg-sidebar-accent font-semibold text-sidebar-accent-foreground",
        item.disabled && "pointer-events-none opacity-50",
        collapsed && "justify-center px-0"
      )}
    >
      <item.icon className="size-4 shrink-0" aria-hidden="true" />
      <span className={cn("truncate", collapsed && "sr-only")}>
        {item.title}
      </span>
      {item.badge !== undefined && !collapsed && (
        <span className="ml-auto shrink-0 rounded-full bg-sidebar-primary/10 px-1.5 py-0.5 text-xs font-medium tabular-nums text-sidebar-foreground">
          {item.badge}
        </span>
      )}
    </Link>
  );

  // In the icon rail the label is visually hidden, so surface it on hover and
  // keyboard focus instead.
  if (!collapsed) {
    return link;
  }

  return (
    <Tooltip>
      <TooltipTrigger render={link} />
      <TooltipContent side="right" sideOffset={8}>
        {item.title}
      </TooltipContent>
    </Tooltip>
  );
}

function SidebarNavSection({
  section,
  collapsed,
  pathname,
  onNavigate,
}: {
  section: NavSection;
  collapsed: boolean;
  pathname: string;
  onNavigate?: () => void;
}) {
  const labelId = React.useId();

  const list = (
    <ul className="flex flex-col gap-0.5">
      {section.items.map((item) => (
        <li key={item.href}>
          <SidebarNavLink
            item={item}
            collapsed={collapsed}
            active={isNavItemActive(pathname, item)}
            onNavigate={onNavigate}
          />
        </li>
      ))}
    </ul>
  );

  if (!section.label) {
    return list;
  }

  return (
    <div role="group" aria-labelledby={labelId}>
      <p
        id={labelId}
        className={cn(
          "px-2.5 pt-4 pb-1.5 text-xs font-medium uppercase tracking-wide text-sidebar-foreground/50",
          collapsed && "sr-only"
        )}
      >
        {section.label}
      </p>
      {list}
    </div>
  );
}

function SidebarNav({
  sections,
  collapsed,
  onNavigate,
}: {
  sections: NavSection[];
  collapsed: boolean;
  onNavigate?: () => void;
}) {
  const pathname = usePathname();

  return (
    <TooltipProvider delay={0}>
      <nav
        aria-label="Main"
        className="flex-1 overflow-y-auto overflow-x-hidden p-2"
      >
        <div className="flex flex-col gap-1">
          {sections.map((section, index) => (
            <SidebarNavSection
              key={section.label ?? `section-${index}`}
              section={section}
              collapsed={collapsed}
              pathname={pathname}
              onNavigate={onNavigate}
            />
          ))}
        </div>
      </nav>
    </TooltipProvider>
  );
}

export interface AppSidebarProps {
  /** Navigation to render. Defaults to the shared application navigation. */
  sections?: NavSection[];
  /** Rendered beneath the navigation, in both the desktop rail and the drawer. */
  footer?: React.ReactNode;
  className?: string;
}

/**
 * Application sidebar.
 *
 * Renders two presentations from a single navigation definition: a sticky
 * desktop rail that collapses from 256px to a 64px icon strip, and a drawer
 * that `AppHeader` and `MobileNavigation` open on small screens.
 */
export function AppSidebar({
  sections = mainNavigation,
  footer,
  className,
}: AppSidebarProps) {
  const pathname = usePathname();
  const collapsed = useUIStore((state) => state.sidebarCollapsed);
  const mobileNavOpen = useUIStore((state) => state.mobileNavOpen);
  const setMobileNavOpen = useUIStore((state) => state.setMobileNavOpen);
  const hydrated = useUIStoreHydration();

  // The server renders the expanded rail, so the persisted preference is only
  // applied once hydration has restored it. Enabling the width transition at
  // the same moment stops a restored collapse from animating on first paint.
  const desktopCollapsed = hydrated && collapsed;

  // The App Router keeps the shell mounted across navigations, so the drawer
  // has to be dismissed explicitly when the route changes.
  React.useEffect(() => {
    setMobileNavOpen(false);
  }, [pathname, setMobileNavOpen]);

  return (
    <>
      <aside
        id="app-sidebar"
        data-collapsed={desktopCollapsed}
        style={
          {
            "--app-sidebar-width": desktopCollapsed
              ? LAYOUT.sidebarCollapsedWidth
              : LAYOUT.sidebarWidth,
          } as React.CSSProperties
        }
        className={cn(
          "sticky top-0 hidden h-svh w-(--app-sidebar-width) shrink-0 flex-col border-r border-sidebar-border bg-sidebar text-sidebar-foreground lg:flex",
          hydrated && "transition-[width] duration-200 ease-out",
          className
        )}
      >
        <SidebarBrand collapsed={desktopCollapsed} />
        <SidebarNav sections={sections} collapsed={desktopCollapsed} />
        {footer && (
          <div className="shrink-0 border-t border-sidebar-border p-2">
            {footer}
          </div>
        )}
      </aside>

      <Sheet open={mobileNavOpen} onOpenChange={setMobileNavOpen}>
        <SheetContent
          side="left"
          // The popup stays mounted after closing so it can animate out, but it
          // keeps `opacity: 0` rather than leaving the layout. Without `inert`
          // its links stay in the tab order and expose a second "Main" landmark
          // that no one can see.
          inert={!mobileNavOpen}
          // The sheet is portaled to `document.body`, outside the layout div
          // that sets `--app-header-height` — redeclare it here so
          // `SidebarBrand`'s height reference resolves inside the drawer too.
          style={
            {
              "--app-mobile-sidebar-width": LAYOUT.mobileSidebarWidth,
              "--app-header-height": LAYOUT.headerHeight,
            } as React.CSSProperties
          }
          className="gap-0 bg-sidebar p-0 text-sidebar-foreground data-[side=left]:w-(--app-mobile-sidebar-width) data-[side=left]:max-w-[85vw] lg:hidden data-[side=left]:sm:max-w-xs"
        >
          <SheetHeader className="sr-only">
            <SheetTitle>Navigation</SheetTitle>
            <SheetDescription>
              Browse the main sections of {APP_CONFIG.name}.
            </SheetDescription>
          </SheetHeader>
          <SidebarBrand collapsed={false} />
          <SidebarNav
            sections={sections}
            collapsed={false}
            onNavigate={() => setMobileNavOpen(false)}
          />
          {footer && (
            <div className="shrink-0 border-t border-sidebar-border p-2">
              {footer}
            </div>
          )}
        </SheetContent>
      </Sheet>
    </>
  );
}
