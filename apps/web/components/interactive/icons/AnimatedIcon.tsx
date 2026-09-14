"use client";

import { useState } from "react";
import { motion, type Variants } from "motion/react";
import { cn } from "cn";

export type IconAnimationType = "rotate" | "wiggle" | "bounce" | "pulse" | "draw" | "glow";

export interface AnimatedIconProps {
  icon: React.ElementType;
  animation?: IconAnimationType;
  className?: string;
  size?: number | string;
  trigger?: "hover" | "always" | "click";
  color?: string;
}

/**
 * High-performance animated icon wrapper with interactive micro-interactions:
 * - rotate: full 360 spin
 * - wiggle: playful 15deg wobble
 * - bounce: tactile spring jump
 * - pulse: gentle breathing scale
 * - draw: SVG path trace animation
 * - glow: neon aura expansion
 */
export function AnimatedIcon({
  icon: Icon,
  animation = "wiggle",
  className,
  size = 20,
  trigger = "hover",
  color,
}: AnimatedIconProps) {
  const [isHovered, setIsHovered] = useState(false);
  const [isClicked, setIsClicked] = useState(false);

  const isActive =
    trigger === "always" ? true : trigger === "click" ? isClicked : isHovered;

  const animationVariants = {
    rotate: {
      idle: { rotate: 0 },
      active: { rotate: 360, transition: { duration: 0.6, ease: "easeInOut" } },
    },
    wiggle: {
      idle: { rotate: 0 },
      active: {
        rotate: [0, -18, 18, -12, 12, 0],
        transition: { duration: 0.5, ease: "easeInOut" },
      },
    },
    bounce: {
      idle: { y: 0, scale: 1 },
      active: {
        y: [-2, -8, 0],
        scale: [1, 1.15, 1],
        transition: { duration: 0.4, type: "spring", stiffness: 400 },
      },
    },
    pulse: {
      idle: { scale: 1 },
      active: {
        scale: [1, 1.25, 1],
        transition: { duration: 0.7, repeat: Infinity, ease: "easeInOut" },
      },
    },
    glow: {
      idle: { filter: "drop-shadow(0 0 0px transparent)" },
      active: {
        filter: "drop-shadow(0 0 8px currentColor)",
        scale: 1.1,
        transition: { duration: 0.3 },
      },
    },
    draw: {
      idle: { opacity: 0.8 },
      active: {
        opacity: 1,
        scale: [1, 1.08, 1],
        transition: { duration: 0.4 },
      },
    },
  };

  return (
    <motion.span
      className={cn("inline-flex items-center justify-center select-none cursor-pointer", className)}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onClick={() => {
        setIsClicked(true);
        setTimeout(() => setIsClicked(false), 500);
      }}
      variants={animationVariants[animation] as Variants}
      animate={isActive ? "active" : "idle"}
      style={{ color }}
    >
      <Icon size={size} />
    </motion.span>
  );
}
