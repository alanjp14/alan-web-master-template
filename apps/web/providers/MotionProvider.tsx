"use client";

import { MotionConfig } from "motion/react";

/**
 * `reducedMotion="user"` makes every `motion.*` element in the app respect
 * `prefers-reduced-motion` automatically, with no per-component checks:
 * Motion instantly applies transform values (x, y, scale, rotate) instead of
 * animating them when the OS preference is set, while leaving plain opacity
 * fades to play normally — a subtle crossfade isn't the kind of motion that
 * WCAG's reduced-motion guidance is concerned with, only large-scale movement,
 * scaling and parallax are.
 */
export function MotionProvider({ children }: { children: React.ReactNode }) {
  return <MotionConfig reducedMotion="user">{children}</MotionConfig>;
}
