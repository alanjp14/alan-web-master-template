"use client";

import { createContext, useContext } from "react";
import type { Easing, Transition, Variants } from "motion/react";

/**
 * Set by `StaggerContainer` so its `FadeIn` / `SlideIn` / `ScaleIn` descendants
 * skip their own `initial`/`animate` and instead inherit "hidden" -> "visible"
 * from the container through Motion's built-in variant propagation — that
 * inheritance is what makes the stagger apply per child. Works through any
 * depth of plain (non-motion) wrapper elements in between, since propagation
 * is context-based, not tied to direct DOM nesting.
 */
export const StaggerItemContext = createContext(false);

/** A calm, non-bouncy deceleration — the default for every component here. */
export const DEFAULT_EASE: Easing = "easeOut";

export interface RevealBaseProps {
  children: React.ReactNode;
  className?: string;
  /** Animation length in seconds. @default 0.5 */
  duration?: number;
  /** Delay before the animation starts, in seconds. @default 0 */
  delay?: number;
  /** Easing curve. Keep this a plain deceleration — avoid springs/bounce here. @default "easeOut" */
  ease?: Easing;
  /** Animate when scrolled into view instead of immediately on mount. @default false */
  inView?: boolean;
  /** With `inView`, only play the animation the first time it enters. @default true */
  once?: boolean;
  /** With `inView`, fraction of the element that must be visible to trigger it. @default 0.3 */
  amount?: number;
}

interface StaggerItemMotionProps {
  variants: Variants;
  transition: Transition;
}

interface StandaloneMotionProps extends StaggerItemMotionProps {
  initial: "hidden";
  animate?: "visible";
  whileInView?: "visible";
  viewport?: { once: boolean; amount: number };
}

/**
 * Resolves the `variants`/`initial`/`animate` (or `whileInView`) props a reveal
 * component should spread onto its `motion.div`, given its own settings and
 * whether it's nested inside a `StaggerContainer`.
 *
 * Kept as a hook (not a plain function) because it reads `StaggerItemContext`.
 */
export function useRevealMotionProps(
  {
    duration = 0.5,
    delay = 0,
    ease = DEFAULT_EASE,
    inView = false,
    once = true,
    amount = 0.3,
  }: Omit<RevealBaseProps, "children" | "className">,
  variants: Variants
): StaggerItemMotionProps | StandaloneMotionProps {
  const isStaggerItem = useContext(StaggerItemContext);
  const transition: Transition = { duration, delay, ease };

  if (isStaggerItem) {
    // The container drives *when* "visible" activates via staggerChildren;
    // this item only supplies its own animation curve, not its start time.
    return { variants, transition };
  }

  if (inView) {
    return {
      variants,
      initial: "hidden",
      whileInView: "visible",
      viewport: { once, amount },
      transition,
    };
  }

  return { variants, initial: "hidden", animate: "visible", transition };
}
