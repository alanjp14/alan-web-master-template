"use client";

import { useState } from "react";
import Link from "next/link";
import {
  SparklesIcon,
  BoxIcon,
  LayersIcon,
  ActivityIcon,
  CpuIcon,
  ZapIcon,
  ShieldCheckIcon,
  CopyIcon,
  MonitorIcon,
  TabletIcon,
  SmartphoneIcon,
  Share2Icon,
  Code2Icon,
  ArrowRightIcon,
  GlobeIcon,
  ServerIcon,
  FlameIcon,
} from "lucide-react";
import { toast } from "sonner";
import { cn } from "cn";

import {
  MagneticButton,
  Tilt3DButton,
  RippleGlowButton,
  InteractiveStateButton,
  type ButtonActionState,
  AnimatedIcon,
  FloatingGlassTooltip,
  BentoGrid,
  BentoCard,
  HolographicCard,
  InteractiveCanvas3D,
  CoverFlow3DSlider,
  type CoverFlowSlide,
  InfiniteMarquee,
  MaskReveal,
  ThemeSwitcherStudio,
} from "@/components/interactive";

import { Badge } from "@/components/ui/badge";
import { useAppearance } from "@/hooks/use-appearance";

type ViewportSize = "desktop" | "tablet" | "mobile";

export function PreviewClient() {
  const { theme } = useAppearance();
  const [viewport, setViewport] = useState<ViewportSize>("desktop");
  const [buttonState, setButtonState] = useState<ButtonActionState>("idle");
  const [canvasShape, setCanvasShape] = useState<"icosahedron" | "torus" | "nebula">("icosahedron");
  const [activeCodeTab, setActiveCodeTab] = useState<"buttons" | "cards" | "canvas">("buttons");

  const copyPresentationLink = () => {
    if (typeof window !== "undefined") {
      navigator.clipboard.writeText(window.location.href);
      toast.success("Tautan presentasi showcase disalin ke clipboard!");
    }
  };

  const handleTestStateCycle = () => {
    if (buttonState === "idle") {
      setButtonState("loading");
      setTimeout(() => {
        setButtonState("success");
        setTimeout(() => setButtonState("idle"), 2500);
      }, 1500);
    } else {
      setButtonState("idle");
    }
  };

  // Sample portfolio slides for Coverflow 3D Carousel
  const sampleSlides: CoverFlowSlide[] = [
    {
      id: "slide-1",
      title: "Global FinTech Payment Engine",
      category: "High-Volume Architecture",
      badge: "Financial Grade",
      description:
        "Arsitektur pembayaran digital multi-region dengan pemrosesan 50.000 transaksi/detik & jaminan zero-latency.",
      metrics: { label: "Peak TPS Capacity", value: "50,000+" },
      icon: <ZapIcon className="size-8" />,
    },
    {
      id: "slide-2",
      title: "Autonomous AI Workflow Hub",
      category: "Modern SaaS Platform",
      badge: "AI Powered",
      description:
        "Platform orkestrasi model AI generatif untuk enterprise dengan dashboard analitik performa realtime.",
      metrics: { label: "Model Latency", value: "14ms" },
      icon: <CpuIcon className="size-8" />,
    },
    {
      id: "slide-3",
      title: "Zero-Trust Cybersecurity Grid",
      category: "Enterprise Security",
      badge: "SOC-2 Certified",
      description:
        "Sistem proteksi identitas dan pemantauan ancaman siber realtime berbasis machine learning dengan SLA 99.99%.",
      metrics: { label: "Uptime SLA", value: "99.99%" },
      icon: <ShieldCheckIcon className="size-8" />,
    },
    {
      id: "slide-4",
      title: "Edge Cloud CDN & Storage",
      category: "Cloud Infrastructure",
      badge: "Global Edge",
      description:
        "Jaringan distribusi konten multi-benua yang mempercepat loading aset web hingga 300% lebih kencang.",
      metrics: { label: "Global PoP Nodes", value: "180+" },
      icon: <GlobeIcon className="size-8" />,
    },
  ];

  const techPartners = [
    { name: "Next.js 16", tag: "App Router", icon: GlobeIcon },
    { name: "TypeScript 5", tag: "Strict Types", icon: Code2Icon },
    { name: "Framer Motion", tag: "Physics Animations", icon: SparklesIcon },
    { name: "Three.js / WebGL", tag: "Hardware 3D", icon: BoxIcon },
    { name: "Tailwind CSS v4", tag: "Modern Styles", icon: LayersIcon },
    { name: "Bun.js Runtime", tag: "Ultra Fast API", icon: CpuIcon },
    { name: "Better Auth", tag: "Enterprise Security", icon: ShieldCheckIcon },
    { name: "Vercel Edge", tag: "Global Deployment", icon: ServerIcon },
  ];

  const codeSnippets = {
    buttons: `import { 
  MagneticButton, 
  Tilt3DButton, 
  RippleGlowButton, 
  InteractiveStateButton 
} from "@/components/interactive";

export function HeroCta() {
  return (
    <div className="flex gap-4">
      {/* Physics-based cursor attraction */}
      <MagneticButton variant="primary">
        Mulai Konsultasi
      </MagneticButton>

      {/* 3D tilt with specular glare sheen */}
      <Tilt3DButton variant="gradient">
        Buka Demo 3D
      </Tilt3DButton>

      {/* Click ripple & rotating gradient border */}
      <RippleGlowButton auraColor="cyberpunk">
        Jelajahi Fitur
      </RippleGlowButton>
    </div>
  );
}`,
    cards: `import { BentoGrid, BentoCard, HolographicCard } from "@/components/interactive";

export function FeaturesSection() {
  return (
    <BentoGrid>
      <BentoCard
        span="2"
        badge="Enterprise"
        title="High-Scale Cloud Infrastructure"
        description="Skalabilitas tanpa batas dengan proteksi data tingkat perbankan."
        tilt={true}
      />
      <HolographicCard>
        <h4>VIP Iridescent Pass</h4>
        <p>Kartu dengan kilau gradasi pelangi responsif kursor.</p>
      </HolographicCard>
    </BentoGrid>
  );
}`,
    canvas: `import { InteractiveCanvas3D } from "@/components/interactive";

export function HeroBackground() {
  return (
    <InteractiveCanvas3D
      shape="icosahedron"
      speed={0.008}
      interactive={true}
      wireframe={true}
      particleCount={75}
      className="w-full h-96"
    />
  );
}`,
  };

  const viewportWidths = {
    desktop: "w-full",
    tablet: "max-w-[768px] mx-auto border-x border-border shadow-2xl",
    mobile: "max-w-[375px] mx-auto border-x border-border shadow-2xl",
  };

  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col selection:bg-primary selection:text-primary-foreground">
      {/* 1. TOP PRESENTATION CONTROL BAR */}
      <header className="sticky top-0 z-50 border-b border-border/80 bg-background/85 backdrop-blur-xl px-4 py-3">
        <div className="mx-auto max-w-7xl flex flex-wrap items-center justify-between gap-3">
          {/* Brand & Badge */}
          <div className="flex items-center gap-3">
            <Link
              href="/"
              className="flex items-center gap-2 font-heading font-bold text-base tracking-tight hover:opacity-80 transition-opacity"
            >
              <span className="size-8 rounded-xl bg-primary flex items-center justify-center text-primary-foreground font-extrabold shadow-md shadow-primary/20">
                A
              </span>
              <span className="hidden sm:inline font-bold">ALAN MASTER TEMPLATE</span>
            </Link>

            <Badge variant="outline" className="border-primary/40 text-primary bg-primary/5 gap-1.5 py-1">
              <SparklesIcon className="size-3.5 animate-pulse" />
              <span>Client Presentation Mode</span>
            </Badge>

            <Badge variant="secondary" className="hidden md:inline-flex capitalize">
              Theme: {theme}
            </Badge>
          </div>

          {/* Viewport Simulation & Navigation Actions */}
          <div className="flex items-center gap-2">
            {/* Viewport Toggles */}
            <div className="hidden sm:flex items-center rounded-xl border border-border/80 bg-card/60 p-1">
              <button
                type="button"
                onClick={() => setViewport("desktop")}
                aria-label="Desktop View"
                className={cn(
                  "p-1.5 rounded-lg transition-colors",
                  viewport === "desktop"
                    ? "bg-primary text-primary-foreground shadow-xs"
                    : "text-muted-foreground hover:text-foreground"
                )}
              >
                <MonitorIcon className="size-4" />
              </button>
              <button
                type="button"
                onClick={() => setViewport("tablet")}
                aria-label="Tablet View"
                className={cn(
                  "p-1.5 rounded-lg transition-colors",
                  viewport === "tablet"
                    ? "bg-primary text-primary-foreground shadow-xs"
                    : "text-muted-foreground hover:text-foreground"
                )}
              >
                <TabletIcon className="size-4" />
              </button>
              <button
                type="button"
                onClick={() => setViewport("mobile")}
                aria-label="Mobile View"
                className={cn(
                  "p-1.5 rounded-lg transition-colors",
                  viewport === "mobile"
                    ? "bg-primary text-primary-foreground shadow-xs"
                    : "text-muted-foreground hover:text-foreground"
                )}
              >
                <SmartphoneIcon className="size-4" />
              </button>
            </div>

            {/* Quick Link to Drafts */}
            <Link
              href="/drafts"
              className="hidden lg:inline-flex items-center gap-1.5 rounded-xl border border-border/80 bg-background/80 px-3 py-1.5 text-xs font-semibold hover:bg-accent transition-colors"
            >
              <LayersIcon className="size-3.5 text-primary" />
              <span>Draft Selector</span>
            </Link>

            {/* Copy Share Link */}
            <button
              type="button"
              onClick={copyPresentationLink}
              className="inline-flex items-center gap-1.5 rounded-xl bg-primary px-3.5 py-1.5 text-xs font-semibold text-primary-foreground shadow-md shadow-primary/20 hover:bg-primary/90 transition-all cursor-pointer"
            >
              <Share2Icon className="size-3.5" />
              <span className="hidden sm:inline">Bagikan Link Klien</span>
            </button>
          </div>
        </div>
      </header>

      {/* 2. MAIN CONTENT WRAPPER (Respects Viewport Simulator) */}
      <main className={cn("flex-1 transition-all duration-300", viewportWidths[viewport])}>
        {/* HERO SECTION WITH 3D CANVAS */}
        <section className="relative overflow-hidden py-16 sm:py-24 px-4 border-b border-border/60 bg-radial from-primary/10 via-background to-background">
          <div className="mx-auto max-w-6xl relative z-10 text-center space-y-6">
            <MaskReveal type="fade-slide">
              <div className="inline-flex items-center gap-2 rounded-full border border-primary/40 bg-background/80 backdrop-blur-md px-4 py-1.5 text-xs font-semibold text-primary shadow-sm mb-4">
                <SparklesIcon className="size-3.5 animate-spin" />
                <span>Modern Interaction & 3D Component System</span>
              </div>
            </MaskReveal>

            <MaskReveal type="wipe-down" delay={0.1}>
              <h1 className="font-heading text-4xl sm:text-6xl font-extrabold tracking-tight text-foreground max-w-4xl mx-auto leading-tight">
                Komponen Frontend Kelas Dunia dengan <span className="text-primary">Visual 3D & Mikro-Animasi</span>
              </h1>
            </MaskReveal>

            <MaskReveal type="fade-slide" delay={0.2}>
              <p className="text-base sm:text-lg text-muted-foreground max-w-2xl mx-auto leading-relaxed">
                Koleksi komponen interaktif siap pakai untuk memukau calon klien: tombol magnetik, kartu bento 3D tilt, canvas geometris realtime, dan studio tema dinamis.
              </p>
            </MaskReveal>

            {/* Interactive Hero Buttons Preview */}
            <MaskReveal type="fade-slide" delay={0.3}>
              <div className="flex flex-wrap items-center justify-center gap-4 pt-4">
                <MagneticButton variant="primary">
                  <FlameIcon className="size-4 text-primary-foreground" />
                  <span>Magnetic Button (Coba Arahkan Mouse)</span>
                </MagneticButton>

                <Tilt3DButton variant="gradient">
                  <BoxIcon className="size-4" />
                  <span>3D Tilt Glare Button</span>
                </Tilt3DButton>

                <RippleGlowButton auraColor="cyberpunk">
                  <ZapIcon className="size-4 text-cyan-400" />
                  <span>Ripple Glow Button</span>
                </RippleGlowButton>
              </div>
            </MaskReveal>
          </div>

          {/* Interactive 3D Sphere in Hero Background */}
          <div className="mx-auto max-w-xl h-64 sm:h-80 my-4 relative">
            <InteractiveCanvas3D
              shape={canvasShape}
              speed={0.007}
              interactive={true}
              wireframe={true}
              className="w-full h-full"
            />
          </div>
        </section>

        {/* 3. DYNAMIC THEME STUDIO SECTION */}
        <section className="py-16 px-4 border-b border-border/60 bg-muted/20">
          <div className="mx-auto max-w-6xl space-y-6">
            <div className="text-center space-y-2 max-w-2xl mx-auto">
              <Badge variant="outline" className="border-primary/40 text-primary">
                Design System Switcher
              </Badge>
              <h2 className="font-heading text-2xl sm:text-3xl font-bold tracking-tight text-foreground">
                Uji Coba Tema Bisnis & Suasana Desain
              </h2>
              <p className="text-sm text-muted-foreground">
                Klien dapat melihat bagaimana keseluruhan aplikasi beradaptasi dalam sekejap sesuai identitas merek mereka.
              </p>
            </div>

            <ThemeSwitcherStudio />
          </div>
        </section>

        {/* 4. INTERACTIVE BUTTONS TESTBENCH */}
        <section className="py-16 px-4 border-b border-border/60">
          <div className="mx-auto max-w-6xl space-y-10">
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
              <div className="space-y-2">
                <Badge variant="outline" className="border-primary/40 text-primary">
                  Interactive Buttons Suite
                </Badge>
                <h2 className="font-heading text-2xl sm:text-3xl font-bold tracking-tight text-foreground">
                  Tombol Interaktif dengan Physics & Feedback Nyata
                </h2>
                <p className="text-sm text-muted-foreground max-w-2xl">
                  Setiap tombol dirancang untuk meningkatkan konversi (*conversion rate*) melalui interaksi mikro yang memuaskan.
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {/* Card 1: Magnetic Button */}
              <div className="rounded-2xl border border-border/80 bg-card/60 p-6 flex flex-col justify-between items-center text-center space-y-4">
                <div>
                  <h4 className="font-heading font-bold text-base text-foreground">Magnetic Button</h4>
                  <p className="text-xs text-muted-foreground mt-1">
                    Tombol ditarik secara elastis mengikuti kursor mouse saat didekati.
                  </p>
                </div>
                <div className="py-4">
                  <MagneticButton variant="primary">
                    <span>Magnetic CTA</span>
                    <ArrowRightIcon className="size-4" />
                  </MagneticButton>
                </div>
                <span className="text-[11px] text-muted-foreground font-mono">Framer Motion Spring</span>
              </div>

              {/* Card 2: 3D Tilt Glare */}
              <div className="rounded-2xl border border-border/80 bg-card/60 p-6 flex flex-col justify-between items-center text-center space-y-4">
                <div>
                  <h4 className="font-heading font-bold text-base text-foreground">3D Tilt & Specular Glare</h4>
                  <p className="text-xs text-muted-foreground mt-1">
                    Efek pantulan cahaya mengkilap (*specular sheen*) dengan kemiringan 3D.
                  </p>
                </div>
                <div className="py-4">
                  <Tilt3DButton variant="gradient">
                    <SparklesIcon className="size-4" />
                    <span>Tilt Glare Button</span>
                  </Tilt3DButton>
                </div>
                <span className="text-[11px] text-muted-foreground font-mono">Preserve-3D Transform</span>
              </div>

              {/* Card 3: Ripple Glow */}
              <div className="rounded-2xl border border-border/80 bg-card/60 p-6 flex flex-col justify-between items-center text-center space-y-4">
                <div>
                  <h4 className="font-heading font-bold text-base text-foreground">Ripple & Rotating Border</h4>
                  <p className="text-xs text-muted-foreground mt-1">
                    Gelombang klik radial yang menyebar dengan garis batas berputar dinamis.
                  </p>
                </div>
                <div className="py-4">
                  <RippleGlowButton auraColor="cyberpunk">
                    <ZapIcon className="size-4 text-cyan-400" />
                    <span>Klik Untuk Ripple</span>
                  </RippleGlowButton>
                </div>
                <span className="text-[11px] text-muted-foreground font-mono">Conic-Gradient & Wave</span>
              </div>

              {/* Card 4: Morphing State Button */}
              <div className="rounded-2xl border border-border/80 bg-card/60 p-6 flex flex-col justify-between items-center text-center space-y-4">
                <div>
                  <h4 className="font-heading font-bold text-base text-foreground">Interactive State Morph</h4>
                  <p className="text-xs text-muted-foreground mt-1">
                    Transisi status mulus antara idle, loading spinner, dan animasi sukses.
                  </p>
                </div>
                <div className="py-4">
                  <InteractiveStateButton
                    state={buttonState}
                    onClick={handleTestStateCycle}
                    idleText="Kirim (Klik Saya)"
                    loadingText="Menghubungkan..."
                    successText="Sukses Terkirim!"
                  />
                </div>
                <button
                  type="button"
                  onClick={handleTestStateCycle}
                  className="text-[11px] text-primary hover:underline font-medium"
                >
                  Uji Transisi Status Otomatis →
                </button>
              </div>
            </div>
          </div>
        </section>

        {/* 5. MICRO-INTERACTIONS & ANIMATED ICONS LAB */}
        <section className="py-16 px-4 border-b border-border/60 bg-muted/20">
          <div className="mx-auto max-w-6xl space-y-8">
            <div className="text-center space-y-2 max-w-2xl mx-auto">
              <Badge variant="outline" className="border-primary/40 text-primary">
                Micro-Interactions Lab
              </Badge>
              <h2 className="font-heading text-2xl sm:text-3xl font-bold tracking-tight text-foreground">
                Ikon Dinamis & Tooltip Glassmorphism
              </h2>
              <p className="text-sm text-muted-foreground">
                Sentuh atau hover ikon di bawah ini untuk melihat mikro-animasi halus (bounce, rotate, wiggle, pulse, dan glass tooltip).
              </p>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-4">
              {[
                { name: "360° Rotate", type: "rotate" as const, icon: CpuIcon, desc: "Rotasi halus 360°" },
                { name: "Playful Wiggle", type: "wiggle" as const, icon: SparklesIcon, desc: "Goyangan elastis ceria" },
                { name: "Spring Bounce", type: "bounce" as const, icon: ZapIcon, desc: "Lompatan pegas taktil" },
                { name: "Breathing Pulse", type: "pulse" as const, icon: ActivityIcon, desc: "Denyut bernapas konstan" },
                { name: "Neon Glow", type: "glow" as const, icon: FlameIcon, desc: "Aura cahaya neon berpendar" },
                { name: "Draw Trace", type: "draw" as const, icon: ShieldCheckIcon, desc: "Garis SVG tracing" },
              ].map((item, i) => (
                <FloatingGlassTooltip
                  key={i}
                  side="top"
                  content={<span className="text-xs">{item.desc}</span>}
                  className="w-full"
                >
                  <div className="w-full flex flex-col items-center justify-center p-5 rounded-xl border border-border/80 bg-card/70 hover:border-primary/50 transition-all duration-200 cursor-pointer group">
                    <div className="size-12 rounded-xl bg-primary/10 text-primary flex items-center justify-center mb-3 group-hover:bg-primary/20 transition-colors">
                      <AnimatedIcon icon={item.icon} animation={item.type} size={24} />
                    </div>
                    <span className="text-xs font-semibold text-foreground text-center">
                      {item.name}
                    </span>
                  </div>
                </FloatingGlassTooltip>
              ))}
            </div>
          </div>
        </section>

        {/* 6. 3D BENTO GRID & HOLOGRAPHIC CARDS */}
        <section className="py-16 px-4 border-b border-border/60">
          <div className="mx-auto max-w-6xl space-y-10">
            <div className="space-y-2">
              <Badge variant="outline" className="border-primary/40 text-primary">
                3D Bento & Holographic Cards
              </Badge>
              <h2 className="font-heading text-2xl sm:text-3xl font-bold tracking-tight text-foreground">
                Bento Grid dengan Parallax Tilt & Sorot Sinar (Spotlight)
              </h2>
              <p className="text-sm text-muted-foreground max-w-2xl">
                Setiap kartu merespons posisi mouse dengan kemiringan 3D dan sinar sorot dinamis yang menerangi permukaan kartu.
              </p>
            </div>

            <BentoGrid>
              {/* Bento Card 1 (Span 2) */}
              <BentoCard
                span="2"
                badge="High Performance"
                title="Arsitektur Cloud Global Berkinerja Tinggi"
                description="Infrastruktur komputasi terdistribusi yang dirancang untuk ketersediaan tinggi (99.99% SLA) dengan proteksi data tingkat perbankan."
                icon={<ServerIcon className="size-6" />}
                ctaText="Pelajari Kapasitas"
                header={
                  <div className="h-32 w-full bg-gradient-to-r from-primary/20 via-primary/5 to-accent/30 rounded-xl flex items-center justify-center p-4 border border-primary/20">
                    <div className="flex items-center gap-6">
                      <div className="text-center">
                        <span className="text-2xl font-bold font-mono text-primary">99.99%</span>
                        <p className="text-[11px] text-muted-foreground">SLA Guaranteed</p>
                      </div>
                      <div className="h-8 w-px bg-border" />
                      <div className="text-center">
                        <span className="text-2xl font-bold font-mono text-primary">&lt; 15ms</span>
                        <p className="text-[11px] text-muted-foreground">Global Latency</p>
                      </div>
                    </div>
                  </div>
                }
              />

              {/* Bento Card 2: Holographic VIP Card */}
              <div className="md:col-span-1 h-full">
                <HolographicCard className="h-full flex flex-col justify-between">
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <Badge variant="outline" className="border-cyan-400 text-cyan-400 bg-cyan-400/10 text-[10px]">
                        Holographic Sheen
                      </Badge>
                      <SparklesIcon className="size-4 text-cyan-400" />
                    </div>
                    <h4 className="font-heading text-lg font-bold text-foreground">
                      Iridescent Holographic Card
                    </h4>
                    <p className="text-xs text-muted-foreground leading-relaxed">
                      Gerakkan kursor untuk mengamati efek kilau pelangi iridescent yang berubah warna sesuai sudut pandang.
                    </p>
                  </div>
                  <div className="pt-6 mt-auto">
                    <div className="p-3 rounded-lg bg-white/5 border border-white/10 text-xs font-mono text-muted-foreground">
                      glare: dynamic angle-based CSS gradient
                    </div>
                  </div>
                </HolographicCard>
              </div>

              {/* Bento Card 3 */}
              <BentoCard
                span="1"
                badge="Cybersecurity"
                title="Keamanan Siber & Enkripsi Data"
                description="Standar enkripsi AES-256 dan kepatuhan regulasi keamanan internasional."
                icon={<ShieldCheckIcon className="size-6" />}
                ctaText="Lihat Sertifikasi"
              />

              {/* Bento Card 4 (Span 2) */}
              <BentoCard
                span="2"
                badge="Automasi & API"
                title="Integrasi Modul & Ekosistem Developer Cepat"
                description="Hubungkan ribuan endpoint API dengan SDK siap pakai untuk TypeScript, Python, dan ekosistem Next.js 16 modern."
                icon={<CpuIcon className="size-6" />}
                ctaText="Baca Dokumentasi API"
              />
            </BentoGrid>
          </div>
        </section>

        {/* 7. 3D COVERFLOW CAROUSEL SLIDER */}
        <section className="py-16 px-4 border-b border-border/60 bg-muted/20">
          <div className="mx-auto max-w-6xl space-y-6">
            <div className="text-center space-y-2 max-w-2xl mx-auto">
              <Badge variant="outline" className="border-primary/40 text-primary">
                3D Coverflow Slider
              </Badge>
              <h2 className="font-heading text-2xl sm:text-3xl font-bold tracking-tight text-foreground">
                3D Coverflow Carousel Showcase
              </h2>
              <p className="text-sm text-muted-foreground">
                Presentasikan portofolio, studi kasus, atau modul layanan secara interaktif dengan rotasi 3D dan navigasi drag / klik.
              </p>
            </div>

            <CoverFlow3DSlider slides={sampleSlides} autoPlay={false} />
          </div>
        </section>

        {/* 8. INTERACTIVE 3D CANVAS PLAYGROUND */}
        <section className="py-16 px-4 border-b border-border/60">
          <div className="mx-auto max-w-6xl space-y-8">
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
              <div className="space-y-2">
                <Badge variant="outline" className="border-primary/40 text-primary">
                  Native Canvas 3D (60 FPS)
                </Badge>
                <h2 className="font-heading text-2xl sm:text-3xl font-bold tracking-tight text-foreground">
                  Interactive 3D Geometric Mesh Playground
                </h2>
                <p className="text-sm text-muted-foreground max-w-2xl">
                  Animasi 3D matematika yang sangat ringan (&lt; 4KB), tanpa bloat library berat, dan dapat dirotasi bebas dengan mouse drag.
                </p>
              </div>

              {/* Shape Switcher Controls */}
              <div className="flex items-center gap-2 rounded-xl border border-border/80 bg-card p-1 shrink-0">
                {(["icosahedron", "torus", "nebula"] as const).map((s) => (
                  <button
                    key={s}
                    type="button"
                    onClick={() => setCanvasShape(s)}
                    className={cn(
                      "px-3 py-1.5 rounded-lg text-xs font-semibold capitalize transition-colors cursor-pointer",
                      canvasShape === s
                        ? "bg-primary text-primary-foreground shadow-xs"
                        : "text-muted-foreground hover:text-foreground"
                    )}
                  >
                    {s}
                  </button>
                ))}
              </div>
            </div>

            <div className="rounded-2xl border border-border/80 bg-card/60 backdrop-blur-xl p-6 relative overflow-hidden h-96 sm:h-[420px] flex items-center justify-center">
              <InteractiveCanvas3D
                shape={canvasShape}
                speed={0.009}
                interactive={true}
                wireframe={true}
                particleCount={80}
                className="w-full h-full"
              />
            </div>
          </div>
        </section>

        {/* 9. INFINITE PARTNER & TECH MARQUEE */}
        <section className="py-12 px-4 border-b border-border/60 bg-muted/20">
          <div className="mx-auto max-w-6xl space-y-4">
            <div className="text-center">
              <span className="text-xs uppercase font-semibold tracking-wider text-muted-foreground">
                Didukung oleh Teknologi Modern & Standar Industri
              </span>
            </div>

            <InfiniteMarquee speed="normal" pauseOnHover={true}>
              {techPartners.map((tech, i) => {
                const Icon = tech.icon;
                return (
                  <div
                    key={i}
                    className="flex items-center gap-3 rounded-xl border border-border/80 bg-card/80 px-5 py-3 shadow-xs hover:border-primary/40 transition-colors"
                  >
                    <Icon className="size-5 text-primary" />
                    <div>
                      <p className="text-sm font-bold text-foreground whitespace-nowrap">{tech.name}</p>
                      <p className="text-[10px] text-muted-foreground whitespace-nowrap">{tech.tag}</p>
                    </div>
                  </div>
                );
              })}
            </InfiniteMarquee>
          </div>
        </section>

        {/* 10. DEVELOPER INTEGRATION & CODE SNIPPETS */}
        <section className="py-16 px-4">
          <div className="mx-auto max-w-5xl space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <Badge variant="outline" className="border-primary/40 text-primary">
                  Ready for Production
                </Badge>
                <h3 className="font-heading text-xl sm:text-2xl font-bold text-foreground mt-1">
                  Arsitektur Bersih & Integrasi Mudah
                </h3>
                <p className="text-xs sm:text-sm text-muted-foreground mt-1">
                  Komponen dapat diimpor langsung tanpa mengubah komponen dasar yang sudah ada.
                </p>
              </div>

              {/* Code Tab Switcher */}
              <div className="flex items-center gap-1 rounded-xl border border-border bg-card p-1">
                {(["buttons", "cards", "canvas"] as const).map((tab) => (
                  <button
                    key={tab}
                    type="button"
                    onClick={() => setActiveCodeTab(tab)}
                    className={cn(
                      "px-3 py-1 text-xs font-semibold capitalize rounded-lg transition-colors cursor-pointer",
                      activeCodeTab === tab
                        ? "bg-primary text-primary-foreground"
                        : "text-muted-foreground hover:text-foreground"
                    )}
                  >
                    {tab}
                  </button>
                ))}
              </div>
            </div>

            {/* Code Display Card */}
            <div className="rounded-2xl border border-border bg-slate-950 p-5 overflow-x-auto text-xs font-mono text-slate-200 leading-relaxed shadow-xl relative group">
              <button
                type="button"
                onClick={() => {
                  navigator.clipboard.writeText(codeSnippets[activeCodeTab]);
                  toast.success("Snippet kode disalin!");
                }}
                className="absolute top-4 right-4 flex items-center gap-1 rounded-lg bg-slate-800/80 border border-slate-700 px-2.5 py-1 text-[11px] font-sans font-medium text-slate-300 hover:text-white hover:bg-slate-700 transition-colors"
              >
                <CopyIcon className="size-3" />
                <span>Salin Kode</span>
              </button>
              <pre>
                <code>{codeSnippets[activeCodeTab]}</code>
              </pre>
            </div>
          </div>
        </section>
      </main>

      {/* 11. PRESENTATION FOOTER */}
      <footer className="border-t border-border/80 bg-card/40 py-8 px-4 text-center text-xs text-muted-foreground">
        <div className="mx-auto max-w-7xl flex flex-col sm:flex-row items-center justify-between gap-4">
          <p>© {new Date().getFullYear()} Alan Web Master Template. Master UI/UX Component Library.</p>
          <div className="flex items-center gap-4">
            <Link href="/" className="hover:text-foreground transition-colors">
              Company Profile
            </Link>
            <Link href="/drafts" className="hover:text-foreground transition-colors">
              Draft Presets
            </Link>
            <Link href="/dashboard" className="hover:text-foreground transition-colors">
              App Console
            </Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
