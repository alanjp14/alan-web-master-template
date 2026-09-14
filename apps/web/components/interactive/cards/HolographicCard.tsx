"use client";

import { useRef, useState } from "react";
import { motion, useMotionValue, useSpring, useTransform } from "motion/react";
import { cn } from "cn";

export interface HolographicCardProps {
  children: React.ReactNode;
  className?: string;
  maxTilt?: number;
  iridescent?: boolean;
}

/**
 * Holographic Card with rainbow iridescent reflection sheen that morphs
 * based on the user's cursor angle, creating an ultra-premium VIP / Web3 / Fintech aesthetic.
 */
export function HolographicCard({
  children,
  className,
  maxTilt = 15,
  iridescent = true,
}: HolographicCardProps) {
  const cardRef = useRef<HTMLDivElement | null>(null);
  const [isHovered, setIsHovered] = useState(false);

  const normX = useMotionValue(0);
  const normY = useMotionValue(0);

  const springConfig = { stiffness: 280, damping: 22 };
  const smoothX = useSpring(normX, springConfig);
  const smoothY = useSpring(normY, springConfig);

  const rotateX = useTransform(smoothY, [-0.5, 0.5], [maxTilt, -maxTilt]);
  const rotateY = useTransform(smoothX, [-0.5, 0.5], [-maxTilt, maxTilt]);

  // Angle in degrees for iridescent gradient
  const angle = useTransform(smoothX, [-0.5, 0.5], [45, 225]);
  const bgGradient = useTransform(
    angle,
    (deg) =>
      `linear-gradient(${deg}deg, rgba(255, 0, 128, 0.15), rgba(0, 240, 255, 0.2), rgba(255, 230, 0, 0.15), rgba(0, 255, 128, 0.15))`
  );

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!cardRef.current) return;
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

  return (
    <div style={{ perspective: 1000 }} className="inline-block w-full">
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
        className={cn(
          "relative overflow-hidden rounded-2xl border border-white/20 bg-card/70 backdrop-blur-xl p-6 shadow-xl transition-shadow duration-300 hover:shadow-2xl hover:shadow-primary/20",
          className
        )}
      >
        {/* Iridescent Rainbow Sheen Overlay */}
        {iridescent && isHovered && (
          <motion.div
            style={{ background: bgGradient }}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 pointer-events-none mix-blend-overlay transition-opacity duration-300"
          />
        )}

        {/* Specular Diagonal Reflection Beam */}
        <div className="absolute -inset-full top-0 block h-full w-1/2 -skew-x-12 bg-gradient-to-r from-transparent via-white/10 to-transparent opacity-0 transition-opacity duration-500 hover:opacity-100 pointer-events-none" />

        {/* Card Body Raised in 3D Space */}
        <div style={{ transform: "translateZ(20px)" }} className="relative z-10">
          {children}
        </div>
      </motion.div>
    </div>
  );
}
