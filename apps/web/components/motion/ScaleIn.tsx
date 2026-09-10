"use client";

import { motion, type Variants } from "motion/react";

import { useRevealMotionProps, type RevealBaseProps } from "@/components/motion/shared";

export interface ScaleInProps extends RevealBaseProps {
  /** Starting scale before it grows to full size. Kept subtle on purpose. @default 0.95 */
  initialScale?: number;
}

/**
 * Fades content in while it grows from a slightly smaller scale.
 *
 * Nest inside `StaggerContainer` to reveal several as a staggered sequence
 * instead of all at once.
 */
export function ScaleIn({
  children,
  className,
  initialScale = 0.95,
  ...reveal
}: ScaleInProps) {
  const variants: Variants = {
    hidden: { opacity: 0, scale: initialScale },
    visible: { opacity: 1, scale: 1 },
  };

  const motionProps = useRevealMotionProps(reveal, variants);

  return (
    <motion.div className={className} {...motionProps}>
      {children}
    </motion.div>
  );
}
