"use client";

import { useEffect, useRef, useState } from "react";
import { cn } from "cn";

export interface InteractiveCanvas3DProps {
  className?: string;
  shape?: "icosahedron" | "torus" | "nebula";
  primaryColor?: string;
  accentColor?: string;
  wireframe?: boolean;
  speed?: number;
  interactive?: boolean;
  particleCount?: number;
}

interface Point3D {
  x: number;
  y: number;
  z: number;
}

interface ProjectedPoint {
  x: number;
  y: number;
  scale: number;
  alpha: number;
}

/**
 * High-performance, lightweight interactive 3D Canvas element.
 * Supports 3D mathematical mesh projection (Icosahedron / Torus Knot / Particle Nebula)
 * with mouse click-and-drag rotation, auto-rotation, and dynamic theme reactivity.
 */
export function InteractiveCanvas3D({
  className,
  shape = "icosahedron",
  primaryColor,
  accentColor,
  wireframe = true,
  speed = 0.008,
  interactive = true,
  particleCount = 70,
}: InteractiveCanvas3DProps) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [isInteracting, setIsInteracting] = useState(false);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d", { alpha: true });
    if (!ctx) return;

    let animationFrameId: number;
    let isVisible = true;
    let rotX = 0.3;
    let rotY = 0.2;
    let isDragging = false;
    let lastMouseX = 0;
    let lastMouseY = 0;
    let velX = 0;
    let velY = speed;

    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    let width = (canvas.width = canvas.offsetWidth * dpr);
    let height = (canvas.height = canvas.offsetHeight * dpr);

    const handleResize = () => {
      if (!canvas) return;
      width = canvas.width = canvas.offsetWidth * dpr;
      height = canvas.height = canvas.offsetHeight * dpr;
    };

    window.addEventListener("resize", handleResize);

    // Dynamic color resolution from CSS variables
    const computed = getComputedStyle(document.documentElement);
    const computedPrimary = computed.getPropertyValue("--primary").trim();
    const resolvedPrimary =
      primaryColor || (computedPrimary ? "var(--primary)" : "#3b82f6");
    const resolvedAccent = accentColor || "#38bdf8";

    // Generate 3D Vertices and Edges based on Shape
    let vertices: Point3D[] = [];
    const edges: [number, number][] = [];

    if (shape === "icosahedron") {
      const phi = (1 + Math.sqrt(5)) / 2;
      const baseVertices: Point3D[] = [
        { x: -1, y: phi, z: 0 },
        { x: 1, y: phi, z: 0 },
        { x: -1, y: -phi, z: 0 },
        { x: 1, y: -phi, z: 0 },
        { x: 0, y: -1, z: phi },
        { x: 0, y: 1, z: phi },
        { x: 0, y: -1, z: -phi },
        { x: 0, y: 1, z: -phi },
        { x: phi, y: 0, z: -1 },
        { x: phi, y: 0, z: 1 },
        { x: -phi, y: 0, z: -1 },
        { x: -phi, y: 0, z: 1 },
      ];

      // Normalize vertices to sphere radius
      const scale = 110 * dpr;
      vertices = baseVertices.map((v) => {
        const len = Math.hypot(v.x, v.y, v.z);
        return {
          x: (v.x / len) * scale,
          y: (v.y / len) * scale,
          z: (v.z / len) * scale,
        };
      });

      // Construct edge connectivity based on golden ratio distance
      for (let i = 0; i < vertices.length; i++) {
        for (let j = i + 1; j < vertices.length; j++) {
          const dist = Math.hypot(
            vertices[i].x - vertices[j].x,
            vertices[i].y - vertices[j].y,
            vertices[i].z - vertices[j].z
          );
          if (dist < scale * 1.15) {
            edges.push([i, j]);
          }
        }
      }
    } else if (shape === "torus") {
      const R = 90 * dpr; // Major radius
      const r = 35 * dpr; // Minor radius
      const segmentsU = 16;
      const segmentsV = 10;

      for (let u = 0; u < segmentsU; u++) {
        const theta = (u / segmentsU) * Math.PI * 2;
        for (let v = 0; v < segmentsV; v++) {
          const phi = (v / segmentsV) * Math.PI * 2;
          vertices.push({
            x: (R + r * Math.cos(phi)) * Math.cos(theta),
            y: (R + r * Math.cos(phi)) * Math.sin(theta),
            z: r * Math.sin(phi),
          });

          const currentIdx = u * segmentsV + v;
          const nextV = u * segmentsV + ((v + 1) % segmentsV);
          const nextU = ((u + 1) % segmentsU) * segmentsV + v;
          edges.push([currentIdx, nextV]);
          edges.push([currentIdx, nextU]);
        }
      }
    }

    // Stellar Particle Nebula Cloud
    const particles: Point3D[] = [];
    for (let i = 0; i < particleCount; i++) {
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.acos(Math.random() * 2 - 1);
      const rad = (70 + Math.random() * 110) * dpr;
      particles.push({
        x: rad * Math.sin(phi) * Math.cos(theta),
        y: rad * Math.sin(phi) * Math.sin(theta),
        z: rad * Math.cos(phi),
      });
    }

    // Drag & Interactive Mouse Events
    const onMouseDown = (e: MouseEvent) => {
      if (!interactive) return;
      isDragging = true;
      lastMouseX = e.clientX;
      lastMouseY = e.clientY;
      velX = 0;
      velY = 0;
      setIsInteracting(true);
    };

    const onMouseMove = (e: MouseEvent) => {
      if (!isDragging || !interactive) return;
      const deltaX = e.clientX - lastMouseX;
      const deltaY = e.clientY - lastMouseY;
      lastMouseX = e.clientX;
      lastMouseY = e.clientY;

      velX = deltaY * 0.005;
      velY = deltaX * 0.005;
      rotX += velX;
      rotY += velY;
    };

    const onMouseUp = () => {
      isDragging = false;
      setIsInteracting(false);
    };

    canvas.addEventListener("mousedown", onMouseDown);
    window.addEventListener("mousemove", onMouseMove);
    window.addEventListener("mouseup", onMouseUp);

    // Touch events for mobile screens
    const onTouchStart = (e: TouchEvent) => {
      if (!interactive || e.touches.length === 0) return;
      isDragging = true;
      lastMouseX = e.touches[0].clientX;
      lastMouseY = e.touches[0].clientY;
      velX = 0;
      velY = 0;
    };

    const onTouchMove = (e: TouchEvent) => {
      if (!isDragging || !interactive || e.touches.length === 0) return;
      const deltaX = e.touches[0].clientX - lastMouseX;
      const deltaY = e.touches[0].clientY - lastMouseY;
      lastMouseX = e.touches[0].clientX;
      lastMouseY = e.touches[0].clientY;
      rotX += deltaY * 0.005;
      rotY += deltaX * 0.005;
    };

    canvas.addEventListener("touchstart", onTouchStart, { passive: true });
    window.addEventListener("touchmove", onTouchMove, { passive: true });
    window.addEventListener("touchend", onMouseUp);

    // IntersectionObserver to auto-pause when off-screen
    const observer = new IntersectionObserver(
      ([entry]) => {
        isVisible = entry.isIntersecting;
      },
      { threshold: 0.1 }
    );
    observer.observe(canvas);

    // 3D Projection Math Helper
    const fov = 400 * dpr;
    const project = (p: Point3D): ProjectedPoint => {
      // Rotation matrices
      // Y axis
      const cosY = Math.cos(rotY);
      const sinY = Math.sin(rotY);
      const x1 = p.x * cosY + p.z * sinY;
      const z1 = -p.x * sinY + p.z * cosY;

      // X axis
      const cosX = Math.cos(rotX);
      const sinX = Math.sin(rotX);
      const y2 = p.y * cosX - z1 * sinX;
      const z2 = p.y * sinX + z1 * cosX;

      // Perspective projection
      const distance = fov + z2;
      const scale = distance > 0 ? fov / distance : 0;
      const projX = width / 2 + x1 * scale;
      const projY = height / 2 + y2 * scale;
      const alpha = Math.max(0.15, Math.min(1, (z2 + 180 * dpr) / (360 * dpr)));

      return { x: projX, y: projY, scale, alpha };
    };

    // Render Loop
    const render = () => {
      if (!isVisible) {
        animationFrameId = requestAnimationFrame(render);
        return;
      }

      ctx.clearRect(0, 0, width, height);

      // Inertia & Auto Rotation
      if (!isDragging) {
        velY *= 0.95;
        velX *= 0.95;
        rotY += velY + speed;
        rotX += velX + speed * 0.2;
      }

      // 1. Render Ambient Particle Nebula
      for (let i = 0; i < particles.length; i++) {
        const pt = project(particles[i]);
        if (pt.scale <= 0) continue;

        ctx.fillStyle = resolvedAccent;
        ctx.globalAlpha = pt.alpha * 0.7;
        ctx.beginPath();
        ctx.arc(pt.x, pt.y, Math.max(1, 1.8 * pt.scale), 0, Math.PI * 2);
        ctx.fill();
      }

      // 2. Render Wireframe Edges
      if (wireframe && edges.length > 0) {
        ctx.lineWidth = 1 * dpr;
        for (let i = 0; i < edges.length; i++) {
          const [idxA, idxB] = edges[i];
          const pA = project(vertices[idxA]);
          const pB = project(vertices[idxB]);

          const avgAlpha = (pA.alpha + pB.alpha) / 2;
          ctx.strokeStyle = resolvedPrimary;
          ctx.globalAlpha = avgAlpha * 0.55;

          ctx.beginPath();
          ctx.moveTo(pA.x, pA.y);
          ctx.lineTo(pB.x, pB.y);
          ctx.stroke();
        }
      }

      // 3. Render Glowing Nodes / Vertices
      for (let i = 0; i < vertices.length; i++) {
        const pt = project(vertices[i]);
        if (pt.scale <= 0) continue;

        // Node halo
        ctx.fillStyle = resolvedAccent;
        ctx.globalAlpha = pt.alpha * 0.25;
        ctx.beginPath();
        ctx.arc(pt.x, pt.y, 6 * pt.scale, 0, Math.PI * 2);
        ctx.fill();

        // Node center
        ctx.fillStyle = "#ffffff";
        ctx.globalAlpha = pt.alpha;
        ctx.beginPath();
        ctx.arc(pt.x, pt.y, 2.5 * pt.scale, 0, Math.PI * 2);
        ctx.fill();
      }

      ctx.globalAlpha = 1;
      animationFrameId = requestAnimationFrame(render);
    };

    animationFrameId = requestAnimationFrame(render);

    return () => {
      cancelAnimationFrame(animationFrameId);
      observer.disconnect();
      window.removeEventListener("resize", handleResize);
      canvas.removeEventListener("mousedown", onMouseDown);
      window.removeEventListener("mousemove", onMouseMove);
      window.removeEventListener("mouseup", onMouseUp);
      canvas.removeEventListener("touchstart", onTouchStart);
      window.removeEventListener("touchmove", onTouchMove);
      window.removeEventListener("touchend", onMouseUp);
    };
  }, [shape, primaryColor, accentColor, wireframe, speed, interactive, particleCount]);

  return (
    <div className={cn("relative flex items-center justify-center overflow-hidden", className)}>
      <canvas
        ref={canvasRef}
        className={cn(
          "h-full w-full touch-none",
          interactive && "cursor-grab active:cursor-grabbing"
        )}
      />
      {interactive && (
        <div className="absolute bottom-2 right-2 pointer-events-none rounded-md bg-background/60 backdrop-blur-sm px-2 py-0.5 text-[10px] text-muted-foreground border border-border/60">
          {isInteracting ? "Rotating..." : "Drag to rotate 360°"}
        </div>
      )}
    </div>
  );
}
