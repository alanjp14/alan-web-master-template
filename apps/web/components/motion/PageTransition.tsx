"use client";

import { usePathname } from "next/navigation";
import { AnimatePresence, motion, type Easing } from "motion/react";

export interface PageTransitionProps {
  children: React.ReactNode;
  className?: string;
  /** Animation length in seconds. @default 0.25 — quick, since this runs on every navigation. */
  duration?: number;
  /** Easing curve for both the outgoing and incoming page. @default "easeInOut" */
  ease?: Easing;
  /** Vertical travel distance in pixels. Set `0` for a plain crossfade. @default 8 */
  distance?: number;
}

/**
 * Crossfades route content on navigation.
 *
 * Mount once from a layout, wrapping `{children}` — `app/(dashboard)/layout.tsx`
 * already does. Keys off the pathname, so it reacts to App Router navigations
 * with no per-page wiring.
 *
 * `initial={false}` on `AnimatePresence` skips animating the very first paint,
 * so a hard refresh doesn't fade in — only client-side navigations transition.
 */
export function PageTransition({
  children,
  className,
  duration = 0.25,
  ease = "easeInOut",
  distance = 8,
}: PageTransitionProps) {
  const pathname = usePathname();

  return (
    <AnimatePresence mode="wait" initial={false}>
      <motion.div
        key={pathname}
        className={className}
        initial={{ opacity: 0, y: distance }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -distance }}
        transition={{ duration, ease }}
      >
        {children}
      </motion.div>
    </AnimatePresence>
  );
}
