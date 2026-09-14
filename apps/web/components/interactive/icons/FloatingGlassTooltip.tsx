"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { cn } from "cn";

export interface FloatingGlassTooltipProps {
  content: React.ReactNode;
  children: React.ReactNode;
  side?: "top" | "bottom" | "left" | "right";
  className?: string;
  tooltipClassName?: string;
}

/**
 * Floating tooltip styled with glassmorphism, subtle neon border glow,
 * and smooth spring physics.
 */
export function FloatingGlassTooltip({
  content,
  children,
  side = "top",
  className,
  tooltipClassName,
}: FloatingGlassTooltipProps) {
  const [isOpen, setIsOpen] = useState(false);

  const sidePositions = {
    top: "bottom-full left-1/2 -translate-x-1/2 mb-2.5",
    bottom: "top-full left-1/2 -translate-x-1/2 mt-2.5",
    left: "right-full top-1/2 -translate-y-1/2 mr-2.5",
    right: "left-full top-1/2 -translate-y-1/2 ml-2.5",
  };

  const initialMotion = {
    top: { opacity: 0, y: 6, scale: 0.92 },
    bottom: { opacity: 0, y: -6, scale: 0.92 },
    left: { opacity: 0, x: 6, scale: 0.92 },
    right: { opacity: 0, x: -6, scale: 0.92 },
  };

  return (
    <div
      className={cn("relative inline-flex items-center justify-center", className)}
      onMouseEnter={() => setIsOpen(true)}
      onMouseLeave={() => setIsOpen(false)}
      onFocus={() => setIsOpen(true)}
      onBlur={() => setIsOpen(false)}
    >
      {children}

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={initialMotion[side]}
            animate={{ opacity: 1, x: 0, y: 0, scale: 1 }}
            exit={initialMotion[side]}
            transition={{ type: "spring", stiffness: 450, damping: 25 }}
            className={cn(
              "absolute z-50 pointer-events-none px-3.5 py-1.5 rounded-lg text-xs font-medium whitespace-nowrap",
              "bg-background/80 backdrop-blur-md text-foreground border border-border/80 shadow-lg shadow-black/10 dark:shadow-primary/10",
              sidePositions[side],
              tooltipClassName
            )}
          >
            {content}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
