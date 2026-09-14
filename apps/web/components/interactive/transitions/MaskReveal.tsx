"use client";

import { motion, type Variants } from "motion/react";
import { cn } from "cn";

export type MaskRevealType = "circle" | "wipe-right" | "wipe-down" | "fade-slide";

export interface MaskRevealProps {
  children: React.ReactNode;
  type?: MaskRevealType;
  className?: string;
  duration?: number;
  delay?: number;
  inView?: boolean;
}

/**
 * Modern mask reveal and transition wrapper:
 * - circle: expanding circular iris wipe
 * - wipe-right: sleek horizontal curtain reveal
 * - wipe-down: vertical slide reveal
 * - fade-slide: smooth fade with subtle scale elevation
 */
export function MaskReveal({
  children,
  type = "circle",
  className,
  duration = 0.8,
  delay = 0,
  inView = true,
}: MaskRevealProps) {
  const maskVariants: Record<MaskRevealType, Variants> = {
    circle: {
      hidden: {
        clipPath: "circle(0% at 50% 50%)",
        opacity: 0.5,
      },
      visible: {
        clipPath: "circle(150% at 50% 50%)",
        opacity: 1,
        transition: { duration, delay, ease: [0.25, 1, 0.5, 1] },
      },
    },
    "wipe-right": {
      hidden: {
        clipPath: "polygon(0 0, 0 0, 0 100%, 0% 100%)",
      },
      visible: {
        clipPath: "polygon(0 0, 100% 0, 100% 100%, 0 100%)",
        transition: { duration, delay, ease: [0.16, 1, 0.3, 1] },
      },
    },
    "wipe-down": {
      hidden: {
        clipPath: "polygon(0 0, 100% 0, 100% 0, 0 0)",
      },
      visible: {
        clipPath: "polygon(0 0, 100% 0, 100% 100%, 0 100%)",
        transition: { duration, delay, ease: [0.16, 1, 0.3, 1] },
      },
    },
    "fade-slide": {
      hidden: {
        opacity: 0,
        y: 20,
        scale: 0.98,
      },
      visible: {
        opacity: 1,
        y: 0,
        scale: 1,
        transition: { duration, delay, ease: "easeOut" },
      },
    },
  };

  return (
    <motion.div
      initial="hidden"
      {...(inView
        ? { whileInView: "visible", viewport: { once: true, amount: 0.2 } }
        : { animate: "visible" })}
      variants={maskVariants[type]}
      className={cn("w-full", className)}
    >
      {children}
    </motion.div>
  );
}
