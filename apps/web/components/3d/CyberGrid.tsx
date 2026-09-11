"use client";

import { useEffect, useRef } from "react";
import { cn } from "cn";

export interface CyberGridProps {
  className?: string;
  gridColor?: string;
  horizonColor?: string;
  pulseColor?: string;
  speed?: number;
  interactive?: boolean;
}

/**
 * High-performance 3D perspective cyber grid / digital horizon on HTML5 Canvas.
 * - Converging perspective lines with continuous scrolling forward motion.
 * - Interactive neon spotlight following the cursor position.
 * - Data pulses traveling along perspective coordinate tracks.
 * - IntersectionObserver auto-pause for zero CPU/GPU overhead when off-screen.
 */
export function CyberGrid({
  className,
  gridColor,
  horizonColor,
  pulseColor,
  speed = 1.2,
  interactive = true,
}: CyberGridProps) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d", { alpha: true });
    if (!ctx) return;

    let animationFrameId: number;
    let isVisible = true;
    let offset = 0;
    let mouseX = -9999;
    let mouseY = -9999;
    let targetMouseX = -9999;
    let targetMouseY = -9999;

    // Theme color resolution
    const computed = getComputedStyle(document.documentElement);
    const primary = computed.getPropertyValue("--primary").trim();
    const resolvedGridColor = gridColor || (primary ? `var(--primary)` : "#3b82f6");
    const resolvedHorizon = horizonColor || (primary ? `var(--primary)` : "#60a5fa");
    const resolvedPulse = pulseColor || "#38bdf8";

    let width = (canvas.width = canvas.offsetWidth * Math.min(window.devicePixelRatio || 1, 2));
    let height = (canvas.height = canvas.offsetHeight * Math.min(window.devicePixelRatio || 1, 2));

    const handleResize = () => {
      if (!canvas) return;
      width = canvas.width = canvas.offsetWidth * Math.min(window.devicePixelRatio || 1, 2);
      height = canvas.height = canvas.offsetHeight * Math.min(window.devicePixelRatio || 1, 2);
    };

    const handleMouseMove = (e: MouseEvent) => {
      if (!interactive || !canvas) return;
      const rect = canvas.getBoundingClientRect();
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      targetMouseX = (e.clientX - rect.left) * dpr;
      targetMouseY = (e.clientY - rect.top) * dpr;
    };

    const handleMouseLeave = () => {
      targetMouseX = -9999;
      targetMouseY = -9999;
    };

    window.addEventListener("resize", handleResize);
    if (interactive) {
      canvas.addEventListener("mousemove", handleMouseMove);
      canvas.addEventListener("mouseleave", handleMouseLeave);
    }

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

    const numVerticals = 28;
    const numHorizontals = 18;

    // Random data pulses
    const pulses: Array<{ track: number; zProgress: number; speed: number; length: number }> = [];
    for (let i = 0; i < 8; i++) {
      pulses.push({
        track: Math.floor(Math.random() * numVerticals),
        zProgress: Math.random(),
        speed: 0.003 + Math.random() * 0.006,
        length: 0.08 + Math.random() * 0.12,
      });
    }

    const loop = () => {
      if (!isVisible) return;

      offset = (offset + speed) % 50;

      // Smooth mouse
      mouseX += (targetMouseX - mouseX) * 0.1;
      mouseY += (targetMouseY - mouseY) * 0.1;

      ctx.clearRect(0, 0, width, height);

      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      const horizonY = height * 0.42;
      const vanishingX = width / 2;

      // Glow behind the horizon
      const glowGrad = ctx.createRadialGradient(
        vanishingX,
        horizonY,
        10,
        vanishingX,
        horizonY,
        width * 0.6
      );
      glowGrad.addColorStop(0, "rgba(59, 130, 246, 0.28)");
      glowGrad.addColorStop(0.5, "rgba(59, 130, 246, 0.08)");
      glowGrad.addColorStop(1, "rgba(0, 0, 0, 0)");
      ctx.fillStyle = glowGrad;
      ctx.fillRect(0, 0, width, height);

      // Interactive mouse spotlight on grid
      if (interactive && mouseX > 0 && mouseY > horizonY) {
        const mouseGrad = ctx.createRadialGradient(
          mouseX,
          mouseY,
          20 * dpr,
          mouseX,
          mouseY,
          180 * dpr
        );
        mouseGrad.addColorStop(0, "rgba(56, 189, 248, 0.25)");
        mouseGrad.addColorStop(1, "rgba(56, 189, 248, 0)");
        ctx.fillStyle = mouseGrad;
        ctx.fillRect(0, horizonY, width, height - horizonY);
      }

      ctx.lineWidth = 1 * dpr;

      // 1. Perspective Vertical Lines (from vanishing point radiating outward)
      for (let i = 0; i <= numVerticals; i++) {
        const spreadNorm = (i / numVerticals - 0.5) * 2; // -1 to +1
        const bottomX = vanishingX + spreadNorm * (width * 0.95);

        ctx.beginPath();
        ctx.moveTo(vanishingX, horizonY);
        ctx.lineTo(bottomX, height);

        const alpha = Math.max(0.08, 0.4 - Math.abs(spreadNorm) * 0.15);
        ctx.strokeStyle = resolvedGridColor;
        ctx.globalAlpha = alpha;
        ctx.stroke();
      }

      // 2. Exponential Horizontal Lines (scrolling towards viewer)
      for (let i = 0; i < numHorizontals; i++) {
        // Logarithmic / exponential spacing for realistic depth
        const progress = (i + offset / 50) / numHorizontals;
        const normalizedZ = Math.pow(progress, 2.2); // Exp curve
        const y = horizonY + normalizedZ * (height - horizonY);

        if (y < horizonY || y > height) continue;

        ctx.beginPath();
        ctx.moveTo(0, y);
        ctx.lineTo(width, y);

        const lineAlpha = Math.max(0.05, Math.min(0.65, normalizedZ * 0.8));
        ctx.strokeStyle = resolvedHorizon;
        ctx.globalAlpha = lineAlpha;
        ctx.stroke();
      }

      // 3. Render animated data pulses along vertical tracks
      for (const p of pulses) {
        p.zProgress += p.speed;
        if (p.zProgress > 1.2) {
          p.zProgress = 0;
          p.track = Math.floor(Math.random() * numVerticals);
        }

        const spreadNorm = (p.track / numVerticals - 0.5) * 2;
        const bottomX = vanishingX + spreadNorm * (width * 0.95);

        const z1 = Math.max(0, Math.min(1, p.zProgress));
        const z2 = Math.max(0, Math.min(1, p.zProgress - p.length));

        const y1 = horizonY + Math.pow(z1, 2.2) * (height - horizonY);
        const y2 = horizonY + Math.pow(z2, 2.2) * (height - horizonY);

        const x1 = vanishingX + (bottomX - vanishingX) * Math.pow(z1, 2.2);
        const x2 = vanishingX + (bottomX - vanishingX) * Math.pow(z2, 2.2);

        if (y1 > horizonY && y2 < height) {
          ctx.beginPath();
          ctx.moveTo(x2, y2);
          ctx.lineTo(x1, y1);
          ctx.strokeStyle = resolvedPulse;
          ctx.lineWidth = 2.5 * dpr;
          ctx.globalAlpha = Math.min(0.9, z1 * 1.2);
          ctx.stroke();
          ctx.lineWidth = 1 * dpr;
        }
      }

      // 4. Horizon beam line
      ctx.beginPath();
      ctx.moveTo(0, horizonY);
      ctx.lineTo(width, horizonY);
      ctx.strokeStyle = resolvedHorizon;
      ctx.globalAlpha = 0.5;
      ctx.lineWidth = 1.5 * dpr;
      ctx.stroke();

      ctx.globalAlpha = 1;
      animationFrameId = requestAnimationFrame(loop);
    };

    loop();

    return () => {
      cancelAnimationFrame(animationFrameId);
      observer.disconnect();
      window.removeEventListener("resize", handleResize);
      if (interactive) {
        canvas.removeEventListener("mousemove", handleMouseMove);
        canvas.removeEventListener("mouseleave", handleMouseLeave);
      }
    };
  }, [gridColor, horizonColor, pulseColor, speed, interactive]);

  return (
    <canvas
      ref={canvasRef}
      aria-hidden="true"
      className={cn("pointer-events-auto block size-full", className)}
      style={{ touchAction: "none" }}
    />
  );
}
