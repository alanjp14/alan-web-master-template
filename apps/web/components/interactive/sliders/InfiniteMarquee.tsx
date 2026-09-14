"use client";

import { useState } from "react";
import { cn } from "cn";

export interface InfiniteMarqueeProps {
  children: React.ReactNode;
  className?: string;
  direction?: "left" | "right";
  speed?: "slow" | "normal" | "fast";
  pauseOnHover?: boolean;
}

/**
 * Infinite Marquee Ticker component for displaying client logos, partner brands,
 * or tech stacks with seamless continuous glide and pause-on-hover interaction.
 */
export function InfiniteMarquee({
  children,
  className,
  direction = "left",
  speed = "normal",
  pauseOnHover = true,
}: InfiniteMarqueeProps) {
  const [isPaused, setIsPaused] = useState(false);

  const speedDuration = {
    slow: "45s",
    normal: "28s",
    fast: "16s",
  };

  const animDirection = direction === "left" ? "normal" : "reverse";

  return (
    <div
      className={cn(
        "relative w-full overflow-hidden [mask-image:linear-gradient(to_right,transparent,white_10%,white_90%,transparent)]",
        className
      )}
      onMouseEnter={() => pauseOnHover && setIsPaused(true)}
      onMouseLeave={() => pauseOnHover && setIsPaused(false)}
    >
      <div
        className="flex w-max items-center gap-8 py-4"
        style={{
          animation: `marquee ${speedDuration[speed]} linear infinite ${animDirection}`,
          animationPlayState: isPaused ? "paused" : "running",
        }}
      >
        {/* Render primary list and duplicate copy for continuous seamless looping */}
        <div className="flex items-center gap-8 shrink-0">{children}</div>
        <div className="flex items-center gap-8 shrink-0" aria-hidden="true">
          {children}
        </div>
      </div>

      <style jsx>{`
        @keyframes marquee {
          from {
            transform: translateX(0%);
          }
          to {
            transform: translateX(-50%);
          }
        }
      `}</style>
    </div>
  );
}
