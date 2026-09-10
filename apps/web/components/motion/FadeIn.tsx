"use client";

import { motion, type Variants } from "motion/react";

import { useRevealMotionProps, type RevealBaseProps } from "@/components/motion/shared";

const variants: Variants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1 },
};

export type FadeInProps = RevealBaseProps;

/**
 * Fades content in from transparent — the gentlest reveal here, and the
 * default choice. `SlideIn`/`ScaleIn` layer motion on top of the same fade,
 * so reach for those only when the extra emphasis earns its place.
 *
 * Nest inside `StaggerContainer` to reveal several as a staggered sequence
 * instead of all at once.
 */
export function FadeIn({ children, className, ...reveal }: FadeInProps) {
  const motionProps = useRevealMotionProps(reveal, variants);

  return (
    <motion.div className={className} {...motionProps}>
      {children}
    </motion.div>
  );
}
