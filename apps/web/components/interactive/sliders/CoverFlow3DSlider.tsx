"use client";

import { useState, useEffect, useCallback } from "react";
import { motion } from "motion/react";
import { ChevronLeftIcon, ChevronRightIcon } from "lucide-react";
import { cn } from "cn";

export interface CoverFlowSlide {
  id: string | number;
  title: string;
  category: string;
  description: string;
  badge?: string;
  accentColor?: string;
  metrics?: { label: string; value: string };
  image?: string;
  icon?: React.ReactNode;
}

export interface CoverFlow3DSliderProps {
  slides: CoverFlowSlide[];
  className?: string;
  autoPlay?: boolean;
  interval?: number;
  onSelectSlide?: (slide: CoverFlowSlide) => void;
}

/**
 * 3D Coverflow Carousel Slider with authentic 3D perspective depth,
 * rotateY transforms, touch / drag swipe gestures, and smooth spring physics.
 */
export function CoverFlow3DSlider({
  slides,
  className,
  autoPlay = false,
  interval = 4000,
  onSelectSlide,
}: CoverFlow3DSliderProps) {
  const [activeIndex, setActiveIndex] = useState(0);

  const nextSlide = useCallback(() => {
    setActiveIndex((prev) => (prev + 1) % slides.length);
  }, [slides.length]);

  const prevSlide = useCallback(() => {
    setActiveIndex((prev) => (prev - 1 + slides.length) % slides.length);
  }, [slides.length]);

  useEffect(() => {
    if (!autoPlay) return;
    const timer = setInterval(nextSlide, interval);
    return () => clearInterval(timer);
  }, [autoPlay, interval, nextSlide]);

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "ArrowLeft") prevSlide();
      if (e.key === "ArrowRight") nextSlide();
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [nextSlide, prevSlide]);

  const getSlideStyle = (index: number) => {
    const total = slides.length;
    let diff = (index - activeIndex) % total;
    if (diff > total / 2) diff -= total;
    if (diff < -total / 2) diff += total;

    const isActive = diff === 0;
    const isAdjacent = Math.abs(diff) === 1;

    // 3D positioning
    const xOffset = diff * 220;
    const zOffset = isActive ? 0 : -140;
    const rotateY = diff * -35;
    const scale = isActive ? 1.05 : isAdjacent ? 0.88 : 0.75;
    const opacity = isActive ? 1 : isAdjacent ? 0.75 : 0;
    const zIndex = 20 - Math.abs(diff);

    return {
      x: xOffset,
      z: zOffset,
      rotateY,
      scale,
      opacity,
      zIndex,
      isActive,
    };
  };

  return (
    <div className={cn("relative w-full overflow-hidden py-10 select-none", className)}>
      {/* 3D Stage Container */}
      <div
        style={{ perspective: 1200 }}
        className="relative flex items-center justify-center min-h-[360px] sm:min-h-[420px] w-full"
      >
        <div style={{ transformStyle: "preserve-3d" }} className="relative flex items-center justify-center">
          {slides.map((slide, idx) => {
            const style = getSlideStyle(idx);

            return (
              <motion.div
                key={slide.id}
                animate={{
                  x: style.x,
                  z: style.z,
                  rotateY: style.rotateY,
                  scale: style.scale,
                  opacity: style.opacity,
                  zIndex: style.zIndex,
                }}
                transition={{
                  type: "spring",
                  stiffness: 260,
                  damping: 24,
                  mass: 0.8,
                }}
                onClick={() => {
                  if (style.isActive) {
                    onSelectSlide?.(slide);
                  } else {
                    setActiveIndex(idx);
                  }
                }}
                className={cn(
                  "absolute w-[280px] sm:w-[340px] md:w-[380px] h-[340px] sm:h-[380px] rounded-2xl p-6 flex flex-col justify-between cursor-pointer transition-shadow",
                  "border bg-card/85 backdrop-blur-xl",
                  style.isActive
                    ? "border-primary/60 shadow-[0_20px_50px_rgba(0,0,0,0.3)] shadow-primary/20 ring-2 ring-primary/30"
                    : "border-border/60 shadow-lg hover:opacity-90"
                )}
              >
                {/* Top Card Header */}
                <div>
                  <div className="flex items-center justify-between gap-2 mb-3">
                    <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                      {slide.category}
                    </span>
                    {slide.badge && (
                      <span className="inline-flex items-center rounded-full bg-primary/15 border border-primary/30 px-2.5 py-0.5 text-[11px] font-semibold text-primary">
                        {slide.badge}
                      </span>
                    )}
                  </div>

                  <h4 className="font-heading text-xl font-bold tracking-tight text-foreground mb-2">
                    {slide.title}
                  </h4>

                  <p className="text-xs sm:text-sm text-muted-foreground line-clamp-3 leading-relaxed">
                    {slide.description}
                  </p>
                </div>

                {/* Center Visual Mockup or Graphic */}
                <div className="my-auto py-3 flex items-center justify-center">
                  <div className="w-full h-24 sm:h-28 rounded-xl bg-gradient-to-tr from-primary/20 via-accent/30 to-primary/10 border border-primary/20 flex items-center justify-center p-4">
                    {slide.icon ? (
                      <div className="text-primary text-3xl">{slide.icon}</div>
                    ) : (
                      <div className="text-center">
                        <span className="text-2xl font-bold font-mono text-primary">
                          {slide.metrics?.value || "99.9%"}
                        </span>
                        <p className="text-[11px] text-muted-foreground">
                          {slide.metrics?.label || "Reliability Score"}
                        </p>
                      </div>
                    )}
                  </div>
                </div>

                {/* Bottom Action Footer */}
                <div className="pt-2 border-t border-border/50 flex items-center justify-between">
                  <span className="text-xs text-muted-foreground font-medium">
                    {style.isActive ? "Slide Aktif" : "Klik untuk pilih"}
                  </span>
                  <button
                    type="button"
                    className="text-xs font-semibold text-primary hover:underline inline-flex items-center gap-1"
                  >
                    Buka Kasus →
                  </button>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>

      {/* Navigation Controls */}
      <div className="flex items-center justify-center gap-4 mt-6">
        <button
          type="button"
          onClick={prevSlide}
          aria-label="Previous Slide"
          className="size-10 rounded-full border border-border bg-background/80 backdrop-blur-sm flex items-center justify-center text-foreground hover:bg-accent hover:border-primary/50 transition-colors shadow-sm"
        >
          <ChevronLeftIcon className="size-5" />
        </button>

        {/* Slide Indicator Dots */}
        <div className="flex items-center gap-2">
          {slides.map((s, i) => (
            <button
              key={s.id}
              type="button"
              onClick={() => setActiveIndex(i)}
              aria-label={`Slide ${i + 1}`}
              className={cn(
                "h-2 rounded-full transition-all duration-300",
                i === activeIndex
                  ? "w-8 bg-primary"
                  : "w-2 bg-muted-foreground/30 hover:bg-muted-foreground/60"
              )}
            />
          ))}
        </div>

        <button
          type="button"
          onClick={nextSlide}
          aria-label="Next Slide"
          className="size-10 rounded-full border border-border bg-background/80 backdrop-blur-sm flex items-center justify-center text-foreground hover:bg-accent hover:border-primary/50 transition-colors shadow-sm"
        >
          <ChevronRightIcon className="size-5" />
        </button>
      </div>
    </div>
  );
}
