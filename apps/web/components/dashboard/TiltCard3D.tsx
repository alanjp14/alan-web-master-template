"use client";

import { useRef, useState, type ReactNode } from "react";
import { cn } from "cn";

export interface TiltCard3DProps {
  children: ReactNode;
  className?: string;
  maxTilt?: number; // Maximum tilt angle in degrees, default 10
  glare?: boolean;
  scale?: number;
}

/**
 * 3D Interactive Tilt Card for Dashboard KPIs & Highlights.
 * - Responds smoothly to cursor position with 3D perspective rotation (X & Y axes).
 * - Generates a dynamic specular glare reflection following cursor angle.
 * - Smooth CSS transition reset on mouse leave.
 */
export function TiltCard3D({
  children,
  className,
  maxTilt = 10,
  glare = true,
  scale = 1.02,
}: TiltCard3DProps) {
  const cardRef = useRef<HTMLDivElement | null>(null);
  const [rotateX, setRotateX] = useState(0);
  const [rotateY, setRotateY] = useState(0);
  const [glarePos, setGlarePos] = useState({ x: 50, y: 50, opacity: 0 });
  const [isHovered, setIsHovered] = useState(false);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    const centerX = rect.width / 2;
    const centerY = rect.height / 2;

    const rotX = ((y - centerY) / centerY) * -maxTilt;
    const rotY = ((x - centerX) / centerX) * maxTilt;

    setRotateX(rotX);
    setRotateY(rotY);

    if (glare) {
      const glareX = (x / rect.width) * 100;
      const glareY = (y / rect.height) * 100;
      setGlarePos({ x: glareX, y: glareY, opacity: 0.15 });
    }
  };

  const handleMouseEnter = () => {
    setIsHovered(true);
  };

  const handleMouseLeave = () => {
    setIsHovered(false);
    setRotateX(0);
    setRotateY(0);
    setGlarePos((prev) => ({ ...prev, opacity: 0 }));
  };

  return (
    <div
      ref={cardRef}
      onMouseMove={handleMouseMove}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      style={{
        perspective: "1000px",
      }}
      className={cn("relative transition-transform duration-200 ease-out select-none", className)}
    >
      <div
        style={{
          transform: isHovered
            ? `rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale3d(${scale}, ${scale}, ${scale})`
            : "rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)",
          transformStyle: "preserve-3d",
        }}
        className="relative size-full rounded-xl border border-border bg-card shadow-sm transition-transform duration-200 ease-out"
      >
        {/* Children content with slight 3D pop */}
        <div style={{ transform: "translateZ(18px)" }} className="relative z-10 size-full">
          {children}
        </div>

        {/* Dynamic Specular Glare Reflection */}
        {glare && (
          <div
            aria-hidden="true"
            className="pointer-events-none absolute inset-0 z-20 rounded-xl overflow-hidden transition-opacity duration-300"
            style={{
              opacity: glarePos.opacity,
              background: `radial-gradient(circle at ${glarePos.x}% ${glarePos.y}%, rgba(255, 255, 255, 0.45) 0%, transparent 65%)`,
            }}
          />
        )}
      </div>
    </div>
  );
}
