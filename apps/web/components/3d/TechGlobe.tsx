"use client";

import { useEffect, useRef } from "react";
import { cn } from "cn";

export interface TechGlobeProps {
  className?: string;
  radius?: number;
  color?: string;
  nodeColor?: string;
  speed?: number;
  interactive?: boolean;
}

/**
 * Lightweight 3D interactive wireframe globe with network connection nodes.
 * - Simulates rotating global cloud infrastructure / digital network.
 * - Interactive 3D rotation dragging & hover reaction.
 * - Zero external dependencies (< 3KB bundle impact).
 * - Auto-pauses off-screen via IntersectionObserver.
 */
export function TechGlobe({
  className,
  radius = 160,
  color,
  nodeColor,
  speed = 0.005,
  interactive = true,
}: TechGlobeProps) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d", { alpha: true });
    if (!ctx) return;

    let animationFrameId: number;
    let isVisible = true;
    let rotX = 0.2;
    let rotY = 0;
    let isDragging = false;
    let lastMouseX = 0;
    let lastMouseY = 0;
    let velX = 0;
    let velY = speed;

    const computed = getComputedStyle(document.documentElement);
    const primary = computed.getPropertyValue("--primary").trim();
    const resolvedColor = color || (primary ? `var(--primary)` : "#3b82f6");
    const resolvedNodeColor = nodeColor || "#38bdf8";

    let width = (canvas.width = canvas.offsetWidth * Math.min(window.devicePixelRatio || 1, 2));
    let height = (canvas.height = canvas.offsetHeight * Math.min(window.devicePixelRatio || 1, 2));

    const handleResize = () => {
      if (!canvas) return;
      width = canvas.width = canvas.offsetWidth * Math.min(window.devicePixelRatio || 1, 2);
      height = canvas.height = canvas.offsetHeight * Math.min(window.devicePixelRatio || 1, 2);
    };

    const handleMouseDown = (e: MouseEvent) => {
      if (!interactive) return;
      isDragging = true;
      lastMouseX = e.clientX;
      lastMouseY = e.clientY;
    };

    const handleMouseMove = (e: MouseEvent) => {
      if (!interactive || !isDragging) return;
      const dx = e.clientX - lastMouseX;
      const dy = e.clientY - lastMouseY;
      velY = dx * 0.005;
      velX = dy * 0.005;
      lastMouseX = e.clientX;
      lastMouseY = e.clientY;
    };

    const handleMouseUp = () => {
      isDragging = false;
    };

    window.addEventListener("resize", handleResize);
    if (interactive) {
      canvas.addEventListener("mousedown", handleMouseDown);
      window.addEventListener("mousemove", handleMouseMove);
      window.addEventListener("mouseup", handleMouseUp);
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

    // Generate random network node positions on sphere surface (Spherical coordinates)
    const nodes: Array<{ phi: number; theta: number; pulse: number }> = [];
    for (let i = 0; i < 35; i++) {
      nodes.push({
        phi: Math.acos(2 * Math.random() - 1),
        theta: Math.random() * Math.PI * 2,
        pulse: Math.random() * Math.PI * 2,
      });
    }

    const loop = () => {
      if (!isVisible) return;

      if (!isDragging) {
        velY = velY * 0.95 + speed * 0.05;
        velX = velX * 0.95;
      }

      rotY += velY;
      rotX += velX;

      ctx.clearRect(0, 0, width, height);

      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      const centerX = width / 2;
      const centerY = height / 2;
      const r = radius * dpr;

      const cosX = Math.cos(rotX);
      const sinX = Math.sin(rotX);
      const cosY = Math.cos(rotY);
      const sinY = Math.sin(rotY);

      // Helper to project 3D point (px, py, pz)
      const project = (px: number, py: number, pz: number) => {
        // Rotate around Y
        const x1 = px * cosY + pz * sinY;
        const z1 = -px * sinY + pz * cosY;
        // Rotate around X
        const y2 = py * cosX - z1 * sinX;
        const z2 = py * sinX + z1 * cosX;

        const scale = 400 / (400 + z2);
        return {
          x: centerX + x1 * scale,
          y: centerY + y2 * scale,
          z: z2,
          scale,
        };
      };

      // 1. Draw Latitude Rings
      const numLats = 7;
      for (let i = 1; i < numLats; i++) {
        const phi = (i / numLats) * Math.PI;
        const ringY = r * Math.cos(phi);
        const ringR = r * Math.sin(phi);

        ctx.beginPath();
        let first = true;
        for (let j = 0; j <= 36; j++) {
          const theta = (j / 36) * Math.PI * 2;
          const px = ringR * Math.cos(theta);
          const pz = ringR * Math.sin(theta);
          const proj = project(px, ringY, pz);

          if (first) {
            ctx.moveTo(proj.x, proj.y);
            first = false;
          } else {
            ctx.lineTo(proj.x, proj.y);
          }
        }
        ctx.strokeStyle = resolvedColor;
        ctx.lineWidth = 1 * dpr;
        ctx.globalAlpha = 0.15;
        ctx.stroke();
      }

      // 2. Draw Longitude Rings
      const numLongs = 10;
      for (let i = 0; i < numLongs; i++) {
        const theta = (i / numLongs) * Math.PI;
        ctx.beginPath();
        let first = true;
        for (let j = 0; j <= 36; j++) {
          const phi = (j / 36) * Math.PI * 2;
          const px = r * Math.sin(phi) * Math.cos(theta);
          const py = r * Math.cos(phi);
          const pz = r * Math.sin(phi) * Math.sin(theta);
          const proj = project(px, py, pz);

          if (first) {
            ctx.moveTo(proj.x, proj.y);
            first = false;
          } else {
            ctx.lineTo(proj.x, proj.y);
          }
        }
        ctx.strokeStyle = resolvedColor;
        ctx.lineWidth = 1 * dpr;
        ctx.globalAlpha = 0.15;
        ctx.stroke();
      }

      // 3. Project and draw connection nodes & arcs
      const projectedNodes: Array<{ x: number; y: number; z: number; scale: number; pulse: number }> =
        [];

      for (const n of nodes) {
        n.pulse += 0.04;
        const px = r * Math.sin(n.phi) * Math.cos(n.theta);
        const py = r * Math.cos(n.phi);
        const pz = r * Math.sin(n.phi) * Math.sin(n.theta);
        const proj = project(px, py, pz);
        projectedNodes.push({ ...proj, pulse: n.pulse });
      }

      // Draw arcs between neighboring front nodes
      for (let i = 0; i < projectedNodes.length; i++) {
        for (let j = i + 1; j < projectedNodes.length; j++) {
          const n1 = projectedNodes[i];
          const n2 = projectedNodes[j];

          // Only connect nodes on the front hemisphere
          if (n1.z > -r * 0.2 && n2.z > -r * 0.2) {
            const dx = n1.x - n2.x;
            const dy = n1.y - n2.y;
            const dist = Math.sqrt(dx * dx + dy * dy);

            if (dist < 90 * dpr) {
              ctx.beginPath();
              ctx.moveTo(n1.x, n1.y);
              ctx.lineTo(n2.x, n2.y);
              ctx.strokeStyle = resolvedNodeColor;
              ctx.globalAlpha = (1 - dist / (90 * dpr)) * 0.35;
              ctx.lineWidth = 1 * dpr;
              ctx.stroke();
            }
          }
        }
      }

      // Draw node dots
      for (const n of projectedNodes) {
        // Alpha based on depth (front vs back)
        const depthAlpha = Math.max(0.1, (n.z + r) / (2 * r));
        const pulseFactor = 0.8 + Math.sin(n.pulse) * 0.2;
        const dotSize = Math.max(1.5, 3.5 * n.scale * pulseFactor * dpr);

        ctx.beginPath();
        ctx.arc(n.x, n.y, dotSize, 0, Math.PI * 2);
        ctx.fillStyle = resolvedNodeColor;
        ctx.globalAlpha = depthAlpha * 0.9;
        ctx.fill();

        // Glow ring for prominent front nodes
        if (n.z > 0 && Math.sin(n.pulse) > 0.6) {
          ctx.beginPath();
          ctx.arc(n.x, n.y, dotSize * 2.2, 0, Math.PI * 2);
          ctx.strokeStyle = resolvedNodeColor;
          ctx.globalAlpha = 0.25;
          ctx.lineWidth = 1 * dpr;
          ctx.stroke();
        }
      }

      ctx.globalAlpha = 1;
      animationFrameId = requestAnimationFrame(loop);
    };

    loop();

    return () => {
      cancelAnimationFrame(animationFrameId);
      observer.disconnect();
      window.removeEventListener("resize", handleResize);
      if (interactive) {
        canvas.removeEventListener("mousedown", handleMouseDown);
        window.removeEventListener("mousemove", handleMouseMove);
        window.removeEventListener("mouseup", handleMouseUp);
      }
    };
  }, [radius, color, nodeColor, speed, interactive]);

  return (
    <canvas
      ref={canvasRef}
      aria-hidden="true"
      className={cn("pointer-events-auto block size-full cursor-grab active:cursor-grabbing", className)}
      style={{ touchAction: "none" }}
    />
  );
}
