"use client";

import type { CSSProperties, ReactNode } from "react";

import { useUIStore } from "@/stores/ui-store";

export interface AppShellRootProps {
  children: ReactNode;
  className?: string;
  style?: CSSProperties;
}

/**
 * Thin client wrapper around the shell's outermost element. Its only job is
 * making everything here `inert` while the mobile navigation drawer is open.
 *
 * Base UI's Sheet already marks this content `aria-hidden` while the drawer
 * is open, so screen readers skip it — but that's all it does. It doesn't
 * also remove the content from the tab order (confirmed in
 * `FloatingFocusManager`, which calls `markOthers` with `ariaHidden` only,
 * never `inert`). Left alone, a sighted keyboard user can still Tab past the
 * drawer into the header, main content and bottom nav while they're
 * simultaneously invisible to a screen reader — exactly the combination
 * WAI-ARIA warns against. `inert` closes that gap: it drops focusability
 * *and* implies `aria-hidden` in one step, and it's a no-op whenever the
 * drawer is closed.
 *
 * Kept as its own component — rather than making `DashboardLayout` a Client
 * Component — so the shell's skip link, sidebar rail, header and main
 * content stay server-rendered; only this one boolean needs the store.
 */
export function AppShellRoot({ children, className, style }: AppShellRootProps) {
  const mobileNavOpen = useUIStore((state) => state.mobileNavOpen);

  return (
    <div inert={mobileNavOpen} style={style} className={className}>
      {children}
    </div>
  );
}
