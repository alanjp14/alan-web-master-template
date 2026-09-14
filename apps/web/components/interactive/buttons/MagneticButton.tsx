"use client";

import { useRef, useState } from "react";
import { motion, useMotionValue, useSpring } from "motion/react";
import { cn } from "cn";

export interface MagneticButtonProps extends React.ComponentProps<typeof motion.button> {
  children: React.ReactNode;
  className?: string;
  /** Strength of the magnetic attraction force. Range: 0.1 to 0.8. @default 0.35 */
  pullStrength?: number;
  /** Spring stiffness. @default 150 */
  stiffness?: number;
  /** Spring damping. @default 15 */
  damping?: number;
  /** Visual variant */
  variant?: "primary" | "secondary" | "outline" | "ghost" | "cyber";
}

/**
 * Magnetic Button component that smoothly pulls itself toward the user's cursor
 * when within proximity, creating an irresistible tactile interaction for key CTAs.
 */
export function MagneticButton({
  children,
  className,
  pullStrength = 0.35,
  stiffness = 150,
  damping = 15,
  variant = "primary",
  disabled,
  ...props
}: MagneticButtonProps) {
  const buttonRef = useRef<HTMLButtonElement | null>(null);
  const [isHovered, setIsHovered] = useState(false);

  const rawX = useMotionValue(0);
  const rawY = useMotionValue(0);

  const springConfig = { stiffness, damping, mass: 0.1 };
  const x = useSpring(rawX, springConfig);
  const y = useSpring(rawY, springConfig);

  const handleMouseMove = (e: React.MouseEvent<HTMLButtonElement>) => {
    if (disabled || !buttonRef.current) return;
    const rect = buttonRef.current.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;

    const deltaX = (e.clientX - centerX) * pullStrength;
    const deltaY = (e.clientY - centerY) * pullStrength;

    rawX.set(deltaX);
    rawY.set(deltaY);
  };

  const handleMouseLeave = () => {
    setIsHovered(false);
    rawX.set(0);
    rawY.set(0);
  };

  const variantStyles = {
    primary:
      "bg-primary text-primary-foreground shadow-md shadow-primary/25 hover:shadow-lg hover:shadow-primary/40 border border-primary/40",
    secondary:
      "bg-secondary text-secondary-foreground hover:bg-secondary/80 border border-border/70",
    outline:
      "bg-background/80 backdrop-blur-sm text-foreground border-2 border-primary/40 hover:border-primary hover:bg-primary/10 shadow-sm",
    ghost: "bg-transparent text-foreground hover:bg-accent hover:text-accent-foreground",
    cyber:
      "bg-background border border-cyan-400 text-cyan-400 shadow-[0_0_15px_rgba(6,182,212,0.3)] hover:shadow-[0_0_25px_rgba(6,182,212,0.6)] hover:bg-cyan-500/10",
  };

  return (
    <motion.button
      ref={buttonRef}
      style={{ x, y }}
      onMouseMove={handleMouseMove}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={handleMouseLeave}
      whileTap={{ scale: 0.94 }}
      disabled={disabled}
      className={cn(
        "relative inline-flex items-center justify-center gap-2 rounded-xl px-6 py-3 text-sm font-semibold tracking-wide transition-colors cursor-pointer select-none disabled:opacity-50 disabled:pointer-events-none focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
        variantStyles[variant],
        className
      )}
      {...props}
    >
      <span className="relative z-10 flex items-center gap-2 transition-transform duration-150">
        {children}
      </span>
      {/* Subtle cursor aura highlight */}
      {isHovered && (
        <motion.span
          layoutId="magnetic-aura"
          className="absolute inset-0 rounded-xl bg-white/10 dark:bg-white/5 pointer-events-none"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
        />
      )}
    </motion.button>
  );
}
