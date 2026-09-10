/**
 * Layout dimensions, exposed as CSS custom properties by the layout components
 * and consumed through Tailwind's `w-(--var)` / `h-(--var)` syntax.
 *
 * Keeping them here means a consuming app can retheme the shell without
 * touching component internals.
 */
export const LAYOUT = {
  /** Expanded desktop sidebar. 16rem = 256px. */
  sidebarWidth: "16rem",
  /** Collapsed desktop sidebar (icon rail). 4rem = 64px. */
  sidebarCollapsedWidth: "4rem",
  /** Sticky application header. */
  headerHeight: "4rem",
  /** Fixed mobile bottom navigation bar. */
  mobileNavHeight: "4rem",
  /** Width of the sidebar when presented as a mobile drawer. */
  mobileSidebarWidth: "18rem",
} as const;

/**
 * Breakpoint at which the desktop sidebar replaces the mobile bottom
 * navigation. Mirrors Tailwind's `lg` breakpoint; change both together.
 */
export const DESKTOP_BREAKPOINT = 1024;
