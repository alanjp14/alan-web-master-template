"use client";

import { motion, type Variants } from "motion/react";

import { StaggerItemContext } from "@/components/motion/shared";

export interface StaggerContainerProps {
  /** `FadeIn` / `SlideIn` / `ScaleIn` elements — any nesting depth of plain wrappers is fine. */
  children: React.ReactNode;
  className?: string;
  /** Seconds between each child's reveal starting. @default 0.08 — snappy, not sluggish. */
  staggerDelay?: number;
  /** Delay before the first child starts, in seconds. @default 0 */
  delay?: number;
  /** Animate when scrolled into view instead of immediately on mount. @default false */
  inView?: boolean;
  /** With `inView`, only play the animation the first time it enters. @default true */
  once?: boolean;
  /** With `inView`, fraction of the container that must be visible to trigger it. @default 0.2 */
  amount?: number;
}

/**
 * Reveals its children one after another instead of all at once.
 *
 * Wrap a row of `StatCard`s, a list, or any group of `FadeIn`/`SlideIn`/`ScaleIn`
 * elements — each one already knows to hand timing control to its nearest
 * `StaggerContainer` ancestor, so no per-child wiring is needed.
 */
export function StaggerContainer({
  children,
  className,
  staggerDelay = 0.08,
  delay = 0,
  inView = false,
  once = true,
  amount = 0.2,
}: StaggerContainerProps) {
  const variants: Variants = {
    hidden: {},
    visible: {
      transition: { staggerChildren: staggerDelay, delayChildren: delay },
    },
  };

  const triggerProps = inView
    ? { whileInView: "visible" as const, viewport: { once, amount } }
    : { animate: "visible" as const };

  return (
    <StaggerItemContext.Provider value={true}>
      <motion.div
        className={className}
        variants={variants}
        initial="hidden"
        {...triggerProps}
      >
        {children}
      </motion.div>
    </StaggerItemContext.Provider>
  );
}
