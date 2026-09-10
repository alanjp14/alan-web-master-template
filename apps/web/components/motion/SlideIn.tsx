"use client";

import { motion, type Variants } from "motion/react";

import { useRevealMotionProps, type RevealBaseProps } from "@/components/motion/shared";

export type SlideDirection = "up" | "down" | "left" | "right";

export interface SlideInProps extends RevealBaseProps {
  /** Direction the element travels as it settles into place. @default "up" */
  direction?: SlideDirection;
  /** Travel distance in pixels. Kept small on purpose — this isn't a hero entrance. @default 24 */
  distance?: number;
}

const AXIS: Record<SlideDirection, "x" | "y"> = {
  up: "y",
  down: "y",
  left: "x",
  right: "x",
};

// The sign of the starting offset, so e.g. "up" begins below (+y) and settles
// upward to 0.
const SIGN: Record<SlideDirection, 1 | -1> = {
  up: 1,
  down: -1,
  left: 1,
  right: -1,
};

/**
 * Fades content in while it slides a short distance into place.
 *
 * Nest inside `StaggerContainer` to reveal several as a staggered sequence
 * instead of all at once.
 */
export function SlideIn({
  children,
  className,
  direction = "up",
  distance = 24,
  ...reveal
}: SlideInProps) {
  const axis = AXIS[direction];
  const offset = SIGN[direction] * distance;

  const variants: Variants = {
    hidden: { opacity: 0, [axis]: offset },
    visible: { opacity: 1, [axis]: 0 },
  };

  const motionProps = useRevealMotionProps(reveal, variants);

  return (
    <motion.div className={className} {...motionProps}>
      {children}
    </motion.div>
  );
}
