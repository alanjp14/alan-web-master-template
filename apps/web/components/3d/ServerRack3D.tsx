"use client";

import { useEffect, useRef } from "react";
import { cn } from "cn";

export interface ServerRack3DProps {
  className?: string;
  serversCount?: number;
  interactive?: boolean;
}

/**
 * 3D Isometric Server Rack / Cluster visualizer for IT Dashboards.
 * - Renders stacked 3D rack-mounted server units with perspective depth.
 * - Realistic blinking LED activity indicators (HDD/SSD read-write and network packets).
 * - Interactive 3D tilt on cursor movement.
 * - Zero external dependencies (< 4KB).
 * - Auto-pauses off-screen via IntersectionObserver.
 */
export function ServerRack3D({
  className,
  serversCount = 6,
  interactive = true,
}: ServerRack3DProps) {
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
    let targetTiltX = 0;
    let targetTiltY = 0;
    let currentTiltX = 0;
    let currentTiltY = 0;

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
      const normX = (e.clientX - rect.left) / rect.width - 0.5;
      const normY = (e.clientY - rect.top) / rect.height - 0.5;
      targetTiltY = normX * 0.25; // Yaw
      targetTiltX = normY * -0.15; // Pitch
    };

    const handleMouseLeave = () => {
      targetTiltX = 0;
      targetTiltY = 0;
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

    // Activity state for each server unit
    const serverStates = Array.from({ length: serversCount }, (_, i) => ({
      id: `Node-0${i + 1}`,
      load: 0.3 + Math.random() * 0.5,
      blinkPhase: Math.random() * Math.PI * 2,
      netBlink: Math.random() * Math.PI * 2,
    }));

    const loop = () => {
      if (!isVisible) return;
      time += 0.03;

      currentTiltX += (targetTiltX - currentTiltX) * 0.08;
      currentTiltY += (targetTiltY - currentTiltY) * 0.08;

      ctx.clearRect(0, 0, width, height);

      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      const centerX = width / 2;
      const centerY = height * 0.52;

      // Base dimensions of the server rack
      const rackWidth = 220 * dpr;
      const rackDepth = 140 * dpr;
      const unitHeight = 26 * dpr;
      const unitGap = 6 * dpr;
      const totalRackHeight = serversCount * (unitHeight + unitGap) + 20 * dpr;

      // Draw top-to-bottom or isometric projection
      const isoX = Math.cos(0.45 + currentTiltY);
      const isoY = Math.sin(0.45 + currentTiltX);

      // Render Each Server Blade Unit
      for (let i = 0; i < serversCount; i++) {
        const s = serverStates[i];
        const unitY = centerY - totalRackHeight / 2 + i * (unitHeight + unitGap);

        // Perspective slight tilt
        const offsetX = currentTiltY * 40 * dpr;
        const offsetY = currentTiltX * 25 * dpr;

        const x0 = centerX - rackWidth / 2 + offsetX;
        const y0 = unitY + offsetY;

        // 1. Front Face of Server Blade
        const isOnline = true;
        const bladeGrad = ctx.createLinearGradient(x0, y0, x0 + rackWidth, y0);
        bladeGrad.addColorStop(0, "#18181b");
        bladeGrad.addColorStop(0.5, "#27272a");
        bladeGrad.addColorStop(1, "#18181b");

        ctx.fillStyle = bladeGrad;
        ctx.strokeStyle = "#3f3f46";
        ctx.lineWidth = 1 * dpr;
        ctx.beginPath();
        ctx.roundRect(x0, y0, rackWidth, unitHeight, 4 * dpr);
        ctx.fill();
        ctx.stroke();

        // 2. Drive Bays Grill (Horizontal slots)
        ctx.strokeStyle = "#27272a";
        ctx.lineWidth = 2 * dpr;
        for (let b = 0; b < 6; b++) {
          const bx = x0 + 12 * dpr + b * 20 * dpr;
          ctx.beginPath();
          ctx.moveTo(bx, y0 + 6 * dpr);
          ctx.lineTo(bx, y0 + unitHeight - 6 * dpr);
          ctx.stroke();
        }

        // 3. Status Power LED (Solid Emerald)
        const powerLedX = x0 + rackWidth - 55 * dpr;
        const powerLedY = y0 + unitHeight / 2;
        ctx.beginPath();
        ctx.arc(powerLedX, powerLedY, 2.5 * dpr, 0, Math.PI * 2);
        ctx.fillStyle = "#10b981";
        ctx.fill();

        // 4. SSD / I/O Activity LED (Blinking Blue/Cyan)
        const activityLedX = x0 + rackWidth - 40 * dpr;
        const isActivityBlink = Math.sin(time * 8 + s.blinkPhase) > 0.1;
        ctx.beginPath();
        ctx.arc(activityLedX, powerLedY, 2.5 * dpr, 0, Math.PI * 2);
        ctx.fillStyle = isActivityBlink ? "#38bdf8" : "#0c4a6e";
        ctx.fill();
        if (isActivityBlink) {
          ctx.beginPath();
          ctx.arc(activityLedX, powerLedY, 5 * dpr, 0, Math.PI * 2);
          ctx.fillStyle = "rgba(56, 189, 248, 0.35)";
          ctx.fill();
        }

        // 5. Network Traffic LED (Blinking Amber/Orange)
        const netLedX = x0 + rackWidth - 25 * dpr;
        const isNetBlink = Math.sin(time * 12 + s.netBlink) > 0.3;
        ctx.beginPath();
        ctx.arc(netLedX, powerLedY, 2.5 * dpr, 0, Math.PI * 2);
        ctx.fillStyle = isNetBlink ? "#f59e0b" : "#78350f";
        ctx.fill();

        // 6. Node Label
        ctx.fillStyle = "#a1a1aa";
        ctx.font = `${10 * dpr}px monospace`;
        ctx.fillText(s.id, x0 + 140 * dpr, y0 + 16 * dpr);

        // 7. Load Bar indicator
        const loadBarWidth = 45 * dpr;
        const currentLoad = (s.load + Math.sin(time + i) * 0.1) * loadBarWidth;
        ctx.fillStyle = "#3f3f46";
        ctx.fillRect(x0 + 135 * dpr + 45 * dpr, y0 + 9 * dpr, loadBarWidth, 4 * dpr);
        ctx.fillStyle = currentLoad > loadBarWidth * 0.8 ? "#ef4444" : "#10b981";
        ctx.fillRect(x0 + 135 * dpr + 45 * dpr, y0 + 9 * dpr, Math.max(2, currentLoad), 4 * dpr);
      }

      // Outer Rack Side Frame (3D Edge Depth)
      ctx.strokeStyle = "rgba(63, 63, 70, 0.4)";
      ctx.lineWidth = 2 * dpr;
      ctx.strokeRect(
        centerX - rackWidth / 2 - 6 * dpr + currentTiltY * 40 * dpr,
        centerY - totalRackHeight / 2 - 8 * dpr + currentTiltX * 25 * dpr,
        rackWidth + 12 * dpr,
        totalRackHeight + 16 * dpr
      );

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
  }, [serversCount, interactive]);

  return (
    <canvas
      ref={canvasRef}
      aria-hidden="true"
      className={cn("pointer-events-auto block size-full", className)}
      style={{ touchAction: "none" }}
    />
  );
}
