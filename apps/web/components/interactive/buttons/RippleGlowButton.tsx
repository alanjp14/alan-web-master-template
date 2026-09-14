"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { cn } from "cn";

export interface Ripple {
  id: number;
  x: number;
  y: number;
  size: number;
}

export interface RippleGlowButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  children: React.ReactNode;
  className?: string;
  /** Enables glowing breathing pulse around the button. @default true */
  pulseGlow?: boolean;
  /** Enables an animated rotating conic gradient border. @default true */
  animatedBorder?: boolean;
  /** Primary aura color: emerald, sapphire, amber, cyberpunk, violet */
  auraColor?: "emerald" | "sapphire" | "amber" | "cyberpunk" | "violet";
}

/**
 * Button featuring an expanding click ripple animation, ambient pulsing glow aura,
 * and an optional rotating multi-color gradient border.
 */
export function RippleGlowButton({
  children,
  className,
  pulseGlow = true,
  animatedBorder = true,
  auraColor = "emerald",
  onClick,
  disabled,
  ...props
}: RippleGlowButtonProps) {
  const [ripples, setRipples] = useState<Ripple[]>([]);

  const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    if (disabled) return;
    const button = e.currentTarget;
    const rect = button.getBoundingClientRect();
    const size = Math.max(rect.width, rect.height) * 2;
    const x = e.clientX - rect.left - size / 2;
    const y = e.clientY - rect.top - size / 2;

    const newRipple: Ripple = {
      id: Date.now() + Math.random(),
      x,
      y,
      size,
    };

    setRipples((prev) => [...prev, newRipple]);
    onClick?.(e);
  };

  const removeRipple = (id: number) => {
    setRipples((prev) => prev.filter((r) => r.id !== id));
  };

  const auraStyles = {
    emerald: "shadow-[0_0_25px_rgba(16,185,129,0.35)] hover:shadow-[0_0_35px_rgba(16,185,129,0.55)]",
    sapphire: "shadow-[0_0_25px_rgba(59,130,246,0.35)] hover:shadow-[0_0_35px_rgba(59,130,246,0.55)]",
    amber: "shadow-[0_0_25px_rgba(245,158,11,0.35)] hover:shadow-[0_0_35px_rgba(245,158,11,0.55)]",
    cyberpunk: "shadow-[0_0_30px_rgba(6,182,212,0.45)] hover:shadow-[0_0_40px_rgba(236,72,153,0.6)]",
    violet: "shadow-[0_0_25px_rgba(139,92,246,0.35)] hover:shadow-[0_0_35px_rgba(139,92,246,0.55)]",
  };

  const borderGradients = {
    emerald: "from-emerald-500 via-teal-400 to-green-600",
    sapphire: "from-blue-500 via-cyan-400 to-indigo-600",
    amber: "from-amber-500 via-yellow-400 to-orange-600",
    cyberpunk: "from-cyan-400 via-fuchsia-500 to-yellow-400",
    violet: "from-violet-500 via-fuchsia-400 to-indigo-600",
  };

  return (
    <div className="relative inline-block group">
      {/* Rotating Conic Gradient Border Wrapper */}
      {animatedBorder && (
        <span
          className={cn(
            "absolute -inset-[1.5px] rounded-xl bg-gradient-to-r opacity-70 blur-[1px] group-hover:opacity-100 transition-opacity duration-300 animate-[spin_5s_linear_infinite]",
            borderGradients[auraColor]
          )}
        />
      )}

      {/* Pulsing Aura Ambient Glow */}
      {pulseGlow && (
        <span
          className={cn(
            "absolute -inset-1 rounded-xl opacity-40 blur-md group-hover:opacity-80 transition-opacity duration-500 animate-pulse pointer-events-none",
            borderGradients[auraColor]
          )}
        />
      )}

      {/* Button Core */}
      <button
        onClick={handleClick}
        disabled={disabled}
        className={cn(
          "relative overflow-hidden z-10 flex items-center justify-center gap-2 rounded-xl px-6 py-3 text-sm font-semibold tracking-wide bg-background text-foreground transition-all duration-200 cursor-pointer select-none disabled:opacity-50 disabled:pointer-events-none focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
          pulseGlow && auraStyles[auraColor],
          className
        )}
        {...props}
      >
        <span className="relative z-10 flex items-center gap-2">{children}</span>

        {/* Dynamic Ripples */}
        <AnimatePresence>
          {ripples.map((ripple) => (
            <motion.span
              key={ripple.id}
              initial={{ scale: 0, opacity: 0.6 }}
              animate={{ scale: 1, opacity: 0 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.8, ease: "easeOut" }}
              onAnimationComplete={() => removeRipple(ripple.id)}
              style={{
                left: ripple.x,
                top: ripple.y,
                width: ripple.size,
                height: ripple.size,
              }}
              className="absolute pointer-events-none rounded-full bg-primary/30"
            />
          ))}
        </AnimatePresence>
      </button>
    </div>
  );
}
