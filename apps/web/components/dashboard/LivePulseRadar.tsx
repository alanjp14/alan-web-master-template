"use client";

import { useEffect, useRef } from "react";
import { cn } from "cn";

export interface LivePulseRadarProps {
  className?: string;
  speed?: number;
}

/**
 * 360-degree Live Pulse Radar for IT Security & Network Monitoring Dashboards.
 * - Rotating radar sweep beam with trailing fade.
 * - Dynamic blips representing detected cluster nodes / network activity.
 * - Auto-pauses off-screen via IntersectionObserver.
 */
export function LivePulseRadar({ className, speed = 0.035 }: LivePulseRadarProps) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d", { alpha: true });
    if (!ctx) return;

    let animationFrameId: number;
    let isVisible = true;
    let angle = 0;

    let width = (canvas.width = canvas.offsetWidth * Math.min(window.devicePixelRatio || 1, 2));
    let height = (canvas.height = canvas.offsetHeight * Math.min(window.devicePixelRatio || 1, 2));

    const handleResize = () => {
      if (!canvas) return;
      width = canvas.width = canvas.offsetWidth * Math.min(window.devicePixelRatio || 1, 2);
      height = canvas.height = canvas.offsetHeight * Math.min(window.devicePixelRatio || 1, 2);
    };

    window.addEventListener("resize", handleResize);

    const observer = new IntersectionObserver(
      ([entry]) => {
        isVisible = entry.isIntersecting;
        if (isVisible && !animationFrameId) {
          loop();
        }
      },
      { threshold: 0.05 }
    );
    observer.observe(canvas);

    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    const numBlips = 6;
    const blips = Array.from({ length: numBlips }, () => ({
      dist: (30 + Math.random() * 80) * dpr,
      angle: Math.random() * Math.PI * 2,
      lastLit: 0,
    }));

    const loop = () => {
      if (!isVisible) return;
      angle = (angle + speed) % (Math.PI * 2);

      ctx.clearRect(0, 0, width, height);

      const cx = width / 2;
      const cy = height / 2;
      const maxR = Math.min(cx, cy) - 10 * dpr;

      // 1. Concentric Circles
      ctx.strokeStyle = "rgba(16, 185, 129, 0.22)";
      ctx.lineWidth = 1 * dpr;
      for (let r = 0.25; r <= 1; r += 0.25) {
        ctx.beginPath();
        ctx.arc(cx, cy, maxR * r, 0, Math.PI * 2);
        ctx.stroke();
      }

      // 2. Crosshair Axis Lines
      ctx.beginPath();
      ctx.moveTo(cx - maxR, cy);
      ctx.lineTo(cx + maxR, cy);
      ctx.moveTo(cx, cy - maxR);
      ctx.lineTo(cx, cy + maxR);
      ctx.stroke();

      // 3. Rotating Sweep Sector
      const sweepLength = 0.7; // Radians
      const sweepGrad = ctx.createRadialGradient(cx, cy, 0, cx, cy, maxR);
      sweepGrad.addColorStop(0, "rgba(16, 185, 129, 0.4)");
      sweepGrad.addColorStop(1, "rgba(16, 185, 129, 0.0)");

      ctx.save();
      ctx.beginPath();
      ctx.moveTo(cx, cy);
      ctx.arc(cx, cy, maxR, angle - sweepLength, angle);
      ctx.closePath();
      ctx.fillStyle = sweepGrad;
      ctx.fill();
      ctx.restore();

      // Leading Sweep Beam
      ctx.beginPath();
      ctx.moveTo(cx, cy);
      ctx.lineTo(cx + Math.cos(angle) * maxR, cy + Math.sin(angle) * maxR);
      ctx.strokeStyle = "#10b981";
      ctx.lineWidth = 1.5 * dpr;
      ctx.stroke();

      // 4. Detected Blips
      for (const b of blips) {
        const bx = cx + Math.cos(b.angle) * b.dist;
        const by = cy + Math.sin(b.angle) * b.dist;

        // Check if sweep beam just passed the blip
        let diff = angle - b.angle;
        while (diff < 0) diff += Math.PI * 2;
        while (diff >= Math.PI * 2) diff -= Math.PI * 2;

        let alpha = 0.15;
        if (diff < sweepLength) {
          alpha = 1 - diff / sweepLength;
        }

        ctx.beginPath();
        ctx.arc(bx, by, 3 * dpr, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(16, 185, 129, ${Math.max(0.15, alpha)})`;
        ctx.fill();

        if (alpha > 0.6) {
          ctx.beginPath();
          ctx.arc(bx, by, 6 * dpr, 0, Math.PI * 2);
          ctx.strokeStyle = `rgba(16, 185, 129, ${alpha * 0.5})`;
          ctx.stroke();
        }
      }

      animationFrameId = requestAnimationFrame(loop);
    };

    loop();

    return () => {
      cancelAnimationFrame(animationFrameId);
      observer.disconnect();
      window.removeEventListener("resize", handleResize);
    };
  }, [speed]);

  return (
    <canvas
      ref={canvasRef}
      aria-hidden="true"
      className={cn("pointer-events-none block size-full", className)}
    />
  );
}
