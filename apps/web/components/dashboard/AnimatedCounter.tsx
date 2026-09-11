"use client";

import { useEffect, useRef, useState } from "react";
import { cn } from "cn";

export interface AnimatedCounterProps {
  value: number;
  duration?: number; // Duration in seconds, default 1.2
  decimals?: number;
  prefix?: string;
  suffix?: string;
  className?: string;
}

/**
 * Smooth Animated Counter for Dashboard KPI Metrics.
 * - Interpolates numeric values smoothly with easeOutExpo curve.
 * - Triggers automatically once element enters viewport.
 * - Supports custom prefix, suffix, and decimal precision.
 */
export function AnimatedCounter({
  value,
  duration = 1.2,
  decimals = 0,
  prefix = "",
  suffix = "",
  className,
}: AnimatedCounterProps) {
  const [displayValue, setDisplayValue] = useState(0);
  const elementRef = useRef<HTMLSpanElement | null>(null);
  const hasAnimated = useRef(false);

  useEffect(() => {
    const el = elementRef.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !hasAnimated.current) {
          hasAnimated.current = true;
          animate();
        }
      },
      { threshold: 0.2 }
    );

    observer.observe(el);

    const animate = () => {
      const startTime = performance.now();
      const durationMs = duration * 1000;

      const step = (now: number) => {
        const elapsed = now - startTime;
        const progress = Math.min(elapsed / durationMs, 1);
        // easeOutExpo
        const ease = progress === 1 ? 1 : 1 - Math.pow(2, -10 * progress);
        const current = ease * value;

        setDisplayValue(current);

        if (progress < 1) {
          requestAnimationFrame(step);
        } else {
          setDisplayValue(value);
        }
      };

      requestAnimationFrame(step);
    };

    return () => observer.disconnect();
  }, [value, duration]);

  const formatted = displayValue.toLocaleString(undefined, {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  });

  return (
    <span ref={elementRef} className={cn("font-mono font-bold tracking-tight", className)}>
      {prefix}
      {formatted}
      {suffix}
    </span>
  );
}
