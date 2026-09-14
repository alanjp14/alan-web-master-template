"use client";

import { useRef, useState } from "react";
import { motion, useMotionValue, useSpring, useTransform } from "motion/react";
import { cn } from "cn";

export interface BentoGridProps {
  children: React.ReactNode;
  className?: string;
}

/**
 * Modern responsive Bento Grid container designed for high-impact feature presentations.
 */
export function BentoGrid({ children, className }: BentoGridProps) {
  return (
    <div
      className={cn(
        "grid grid-cols-1 md:grid-cols-3 auto-rows-[22rem] gap-4 max-w-7xl mx-auto w-full",
        className
      )}
    >
      {children}
    </div>
  );
}

export interface BentoCardProps {
  title: string;
  description: string;
  header?: React.ReactNode;
  icon?: React.ReactNode;
  badge?: string;
  className?: string;
  span?: "1" | "2" | "3" | "col-span-1" | "col-span-2" | "col-span-3";
  rowSpan?: "1" | "2";
  onClick?: () => void;
  ctaText?: string;
  /** Enables dynamic 3D tilt tracking cursor. @default true */
  tilt?: boolean;
}

/**
 * Bento Grid Card featuring:
 * - Parallax 3D tilt response
 * - Dynamic spotlight beam following cursor
 * - 3D depth pop for badges & icons (translateZ)
 */
export function BentoCard({
  title,
  description,
  header,
  icon,
  badge,
  className,
  span = "1",
  rowSpan = "1",
  onClick,
  ctaText,
  tilt = true,
}: BentoCardProps) {
  const cardRef = useRef<HTMLDivElement | null>(null);
  const [isHovered, setIsHovered] = useState(false);

  // Mouse coords normalized (-0.5 to 0.5)
  const normX = useMotionValue(0);
  const normY = useMotionValue(0);

  // Smooth springs for tilt
  const springConfig = { stiffness: 260, damping: 22 };
  const smoothX = useSpring(normX, springConfig);
  const smoothY = useSpring(normY, springConfig);

  const rotateX = useTransform(smoothY, [-0.5, 0.5], [tilt ? 10 : 0, tilt ? -10 : 0]);
  const rotateY = useTransform(smoothX, [-0.5, 0.5], [tilt ? -10 : 0, tilt ? 10 : 0]);

  // Spotlight coordinates in percentages
  const spotlightX = useTransform(smoothX, [-0.5, 0.5], ["0%", "100%"]);
  const spotlightY = useTransform(smoothY, [-0.5, 0.5], ["0%", "100%"]);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!tilt || !cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
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

  const spanClasses = {
    "1": "md:col-span-1",
    "2": "md:col-span-2",
    "3": "md:col-span-3",
    "col-span-1": "md:col-span-1",
    "col-span-2": "md:col-span-2",
    "col-span-3": "md:col-span-3",
  };

  const rowSpanClasses = {
    "1": "row-span-1",
    "2": "row-span-2",
  };

  return (
    <div
      style={{ perspective: 1000 }}
      className={cn("h-full w-full", spanClasses[span], rowSpanClasses[rowSpan])}
    >
      <motion.div
        ref={cardRef}
        style={{
          rotateX,
          rotateY,
          transformStyle: "preserve-3d",
        }}
        onMouseMove={handleMouseMove}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={handleMouseLeave}
        onClick={onClick}
        className={cn(
          "group relative flex flex-col justify-between overflow-hidden rounded-2xl border border-border/80 bg-card/60 backdrop-blur-md p-6 transition-all duration-300 hover:border-primary/50 hover:shadow-2xl hover:shadow-primary/10",
          onClick && "cursor-pointer",
          className
        )}
      >
        {/* Dynamic Cursor Spotlight Beam */}
        {isHovered && (
          <motion.div
            style={{
              left: spotlightX,
              top: spotlightY,
              transform: "translate(-50%, -50%)",
            }}
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.18 }}
            exit={{ opacity: 0 }}
            className="absolute size-72 pointer-events-none rounded-full bg-radial from-primary via-primary/30 to-transparent blur-2xl"
          />
        )}

        {/* Ambient Top Subtle Gradient Sheen */}
        <div className="absolute inset-0 bg-gradient-to-b from-white/5 via-transparent to-transparent pointer-events-none" />

        {/* Card Header Media / Graphic Canvas */}
        {header && (
          <div
            style={{ transform: "translateZ(15px)" }}
            className="relative z-10 w-full overflow-hidden rounded-xl mb-4"
          >
            {header}
          </div>
        )}

        {/* Card Content & Floating Badges */}
        <div
          style={{ transform: "translateZ(25px)" }}
          className="relative z-10 flex flex-col justify-end space-y-2 mt-auto"
        >
          <div className="flex items-center justify-between gap-2">
            {badge && (
              <span className="inline-flex items-center rounded-md bg-primary/15 border border-primary/30 px-2.5 py-0.5 text-xs font-semibold text-primary">
                {badge}
              </span>
            )}
            {icon && (
              <div className="text-muted-foreground group-hover:text-primary transition-colors duration-200">
                {icon}
              </div>
            )}
          </div>

          <h3 className="font-heading text-lg sm:text-xl font-bold tracking-tight text-foreground group-hover:text-primary transition-colors">
            {title}
          </h3>

          <p className="text-sm text-muted-foreground line-clamp-3 leading-relaxed">
            {description}
          </p>

          {ctaText && (
            <div className="pt-2">
              <span className="text-xs font-semibold text-primary inline-flex items-center gap-1 group-hover:translate-x-1 transition-transform">
                {ctaText} →
              </span>
            </div>
          )}
        </div>
      </motion.div>
    </div>
  );
}
