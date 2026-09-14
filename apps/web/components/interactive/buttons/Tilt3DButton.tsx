"use client";

import { useRef, useState } from "react";
import { motion, useMotionValue, useSpring, useTransform } from "motion/react";
import { cn } from "cn";

export interface Tilt3DButtonProps extends React.ComponentProps<typeof motion.button> {
  children: React.ReactNode;
  className?: string;
  /** Maximum tilt angle in degrees. @default 18 */
  maxTilt?: number;
  /** Glare opacity intensity. Range: 0 to 1. @default 0.35 */
  glareOpacity?: number;
  /** Color theme variant */
  variant?: "gradient" | "glass" | "neon" | "solid";
}

/**
 * 3D Tilt Button with dynamic specular glare sheen tracking cursor coordinates.
 * Gives elements an authentic physical depth and tactile feeling.
 */
export function Tilt3DButton({
  children,
  className,
  maxTilt = 18,
  glareOpacity = 0.35,
  variant = "gradient",
  disabled,
  ...props
}: Tilt3DButtonProps) {
  const buttonRef = useRef<HTMLButtonElement | null>(null);
  const [isHovered, setIsHovered] = useState(false);

  // Normalized mouse coords (-0.5 to 0.5)
  const normX = useMotionValue(0);
  const normY = useMotionValue(0);

  // Spring physics for buttery smooth tilt response
  const springConfig = { stiffness: 300, damping: 20 };
  const smoothX = useSpring(normX, springConfig);
  const smoothY = useSpring(normY, springConfig);

  // Map to 3D rotation angles
  const rotateX = useTransform(smoothY, [-0.5, 0.5], [maxTilt, -maxTilt]);
  const rotateY = useTransform(smoothX, [-0.5, 0.5], [-maxTilt, maxTilt]);

  // Spotlight glare coordinates in percentages
  const glareX = useTransform(smoothX, [-0.5, 0.5], ["0%", "100%"]);
  const glareY = useTransform(smoothY, [-0.5, 0.5], ["0%", "100%"]);

  const handleMouseMove = (e: React.MouseEvent<HTMLButtonElement>) => {
    if (disabled || !buttonRef.current) return;
    const rect = buttonRef.current.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width - 0.5;
    const y = (e.clientY - rect.top) / rect.height - 0.5;

    normX.set(x);
    normY.set(y);
  };

  const handleMouseLeave = () => {
    setIsHovered(false);
    normX.set(0);
    normY.set(0);
  };

  const variantStyles = {
    gradient:
      "bg-gradient-to-r from-primary via-emerald-500 to-teal-500 text-white shadow-lg shadow-primary/30 border border-white/20",
    glass:
      "bg-card/70 backdrop-blur-md text-foreground border border-border/80 shadow-md hover:border-primary/50",
    neon: "bg-slate-950 text-cyan-400 border border-cyan-500/80 shadow-[0_0_20px_rgba(6,182,212,0.35)] hover:shadow-[0_0_30px_rgba(6,182,212,0.6)]",
    solid:
      "bg-primary text-primary-foreground shadow-md shadow-primary/30 border border-primary/50",
  };

  return (
    <div style={{ perspective: 1000 }} className="inline-block">
      <motion.button
        ref={buttonRef}
        style={{
          rotateX,
          rotateY,
          transformStyle: "preserve-3d",
        }}
        onMouseMove={handleMouseMove}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={handleMouseLeave}
        whileTap={{ scale: 0.95 }}
        disabled={disabled}
        className={cn(
          "relative overflow-hidden rounded-xl px-6 py-3 text-sm font-semibold tracking-wide cursor-pointer select-none transition-shadow duration-300 disabled:opacity-50 disabled:pointer-events-none focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
          variantStyles[variant],
          className
        )}
        {...props}
      >
        {/* Raised content layer for 3D depth pop */}
        <span
          style={{ transform: "translateZ(20px)" }}
          className="relative z-10 flex items-center justify-center gap-2"
        >
          {children}
        </span>

        {/* Dynamic Specular Glare Sheen */}
        {isHovered && (
          <motion.div
            style={{
              left: glareX,
              top: glareY,
              transform: "translate(-50%, -50%)",
            }}
            initial={{ opacity: 0 }}
            animate={{ opacity: glareOpacity }}
            exit={{ opacity: 0 }}
            className="absolute size-40 pointer-events-none rounded-full bg-radial from-white/60 via-white/10 to-transparent blur-md"
          />
        )}
      </motion.button>
    </div>
  );
}
