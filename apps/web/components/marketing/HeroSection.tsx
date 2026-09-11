"use client";

import Link from "next/link";
import { ArrowRight, CheckCircle2, ShieldCheck, Sparkles, Terminal } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ParticleWave } from "@/components/3d/ParticleWave";

export function HeroSection() {
  return (
    <section className="relative overflow-hidden border-b border-border bg-background">
      {/* 3D Particle Wave Background */}
      <div className="absolute inset-0 z-0 opacity-40 dark:opacity-50">
        <ParticleWave rows={34} cols={34} speed={0.018} amplitude={28} />
      </div>

      {/* Radial Gradient overlay to ensure text readability */}
      <div className="pointer-events-none absolute inset-0 z-1 bg-radial-[circle_at_center_rgba(var(--background),0)_0%,var(--background)_80%] dark:bg-radial-[circle_at_center_rgba(0,0,0,0)_0%,var(--background)_80%]" />
      <div className="pointer-events-none absolute inset-x-0 bottom-0 z-1 h-32 bg-gradient-to-t from-background to-transparent" />

      <div className="relative z-10 mx-auto w-full max-w-6xl px-4 py-16 sm:px-6 sm:py-24 lg:px-8 lg:py-32">
        <div className="max-w-3xl">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/10 px-3.5 py-1.5 text-xs font-semibold text-primary backdrop-blur-sm">
            <Sparkles className="size-3.5" aria-hidden="true" />
            <span>Enterprise IT Engineering & Digital Transformation</span>
          </div>

          {/* Heading */}
          <h1 className="mt-6 text-4xl font-extrabold tracking-tight text-balance sm:text-5xl lg:text-6xl">
            Solusi Rekayasa Software, Cloud, & Transformasi Digital Skala Enterprise.
          </h1>

          {/* Description */}
          <p className="mt-6 text-lg text-muted-foreground text-pretty sm:text-xl">
            Mitra teknologi terpercaya untuk modernisasi sistem IT, arsitektur cloud berkinerja tinggi,
            keamanan siber, dan web apps mission-critical dengan standar performa dan keandalan terbaik.
          </p>

          {/* CTAs */}
          <div className="mt-8 flex flex-wrap items-center gap-3.5">
            <Button
              nativeButton={false}
              render={<Link href="#consultation" />}
              size="lg"
              className="gap-2 shadow-lg shadow-primary/20"
            >
              Konsultasi Kebutuhan IT
              <ArrowRight className="size-4" aria-hidden="true" />
            </Button>
            <Button
              nativeButton={false}
              render={<Link href="/tools" />}
              variant="outline"
              size="lg"
              className="gap-2 backdrop-blur-sm"
            >
              <Terminal className="size-4" aria-hidden="true" />
              Eksplorasi Web Tools IT
            </Button>
          </div>

          {/* Value Props Pills */}
          <div className="mt-10 flex flex-wrap items-center gap-x-6 gap-y-3 pt-6 border-t border-border/60 text-xs sm:text-sm text-muted-foreground">
            <div className="flex items-center gap-2">
              <CheckCircle2 className="size-4 text-primary shrink-0" />
              <span>99.99% SLA Uptime Guarantee</span>
            </div>
            <div className="flex items-center gap-2">
              <ShieldCheck className="size-4 text-primary shrink-0" />
              <span>Security Hardening & Best Practices</span>
            </div>
            <div className="flex items-center gap-2">
              <Sparkles className="size-4 text-primary shrink-0" />
              <span>Next.js 16 + Bun.js High Performance</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
