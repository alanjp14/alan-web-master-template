"use client";

import { useEffect, useRef } from "react";
import { cn } from "cn";

export interface ParticleWaveProps {
  className?: string;
  rows?: number;
  cols?: number;
  color?: string;
  speed?: number;
  amplitude?: number;
  interactive?: boolean;
}

/**
 * High-performance 3D interactive particle wave rendered on HTML5 Canvas.
 * - Zero external dependencies (< 3KB bundle impact).
 * - True 3D perspective projection with depth-scaled alpha and size.
 * - Dynamic ripple & height deflection on cursor hover / movement.
 * - Automatically pauses rendering when off-screen via IntersectionObserver.
 * - Adapts to current theme color tokens automatically.
 */
export function ParticleWave({
  className,
  rows = 36,
  cols = 36,
  color,
  speed = 0.02,
  amplitude = 32,
  interactive = true,
}: ParticleWaveProps) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d", { alpha: true });
    if (!ctx) return;

    let animationFrameId: number;
    let isVisible = true;
    let time = 0;
    let mouseX = -9999;
    let mouseY = -9999;
    let targetMouseX = -9999;
    let targetMouseY = -9999;

    // Detect theme primary color if not explicitly provided
    let parsedColor = color;
    if (!parsedColor) {
      const computed = getComputedStyle(document.documentElement);
      const primary = computed.getPropertyValue("--primary").trim();
      parsedColor = primary ? `var(--primary)` : "#3b82f6";
    }

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

    // Auto-pause when not visible in viewport to conserve GPU/battery
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

    // 3D Perspective Projection Settings
    const fov = 450;
    const spacingX = 42;
    const spacingZ = 42;
    const gridOriginX = ((cols - 1) * spacingX) / 2;
    const gridOriginZ = ((rows - 1) * spacingZ) / 2;
    const pitch = 0.42; // Camera tilt down angle
    const cosP = Math.cos(pitch);
    const sinP = Math.sin(pitch);

    const loop = () => {
      if (!isVisible) return;

      time += speed;

      // Smooth mouse interpolation
      mouseX += (targetMouseX - mouseX) * 0.1;
      mouseY += (targetMouseY - mouseY) * 0.1;

      ctx.clearRect(0, 0, width, height);

      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      const centerX = width / 2;
      const centerY = height * 0.58;

      ctx.fillStyle = parsedColor || "#3b82f6";

      // Render particles back to front (Painter's algorithm along z-axis)
      for (let r = 0; r < rows; r++) {
        for (let c = 0; c < cols; c++) {
          const worldX = (c * spacingX - gridOriginX) * (dpr * 0.85);
          const worldZ = (r * spacingZ - gridOriginZ) * (dpr * 0.85) + 350;

          // Wave equation
          const waveFreqX = 0.12;
          const waveFreqZ = 0.14;
          let waveY =
            Math.sin(c * waveFreqX + time) * amplitude * dpr +
            Math.cos(r * waveFreqZ + time * 1.2) * (amplitude * 0.6) * dpr;

          // Mouse deflection
          if (interactive && mouseX > 0 && mouseY > 0) {
            // Rough screen distance
            const approxScreenX = centerX + (worldX * fov) / (worldZ + fov);
            const approxScreenY = centerY + (worldZ * sinP * fov) / (worldZ + fov);
            const dx = mouseX - approxScreenX;
            const dy = mouseY - approxScreenY;
            const dist = Math.sqrt(dx * dx + dy * dy);
            const maxDist = 180 * dpr;
            if (dist < maxDist) {
              const repel = (1 - dist / maxDist) * 45 * dpr;
              waveY -= repel * Math.sin(dist * 0.05 - time * 3);
            }
          }

          // Camera rotation around X (pitch)
          const rotY = waveY * cosP - worldZ * sinP;
          const rotZ = waveY * sinP + worldZ * cosP;

          // Perspective projection
          const zDepth = rotZ + 450;
          if (zDepth <= 10) continue;

          const scale = fov / zDepth;
          const screenX = centerX + worldX * scale;
          const screenY = centerY + rotY * scale;

          if (screenX < -10 || screenX > width + 10 || screenY < -10 || screenY > height + 10) {
            continue;
          }

          // Depth-based size & opacity
          const size = Math.max(1, Math.min(4.5 * dpr, 2.8 * scale * dpr));
          const alpha = Math.max(0.12, Math.min(0.9, (scale - 0.25) * 1.4));

          ctx.globalAlpha = alpha;
          ctx.beginPath();
          ctx.arc(screenX, screenY, size, 0, Math.PI * 2);
          ctx.fill();
        }
      }

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
  }, [rows, cols, color, speed, amplitude, interactive]);

  return (
    <canvas
      ref={canvasRef}
      aria-hidden="true"
      className={cn("pointer-events-auto block size-full", className)}
      style={{ touchAction: "none" }}
    />
  );
}
