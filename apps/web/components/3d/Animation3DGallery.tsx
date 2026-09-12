"use client";

import { useState } from "react";
import {
  ActivityIcon,
  CheckCircle2Icon,
  CpuIcon,
  GlobeIcon,
  LayersIcon,
  PlayIcon,
  RotateCwIcon,
  ServerIcon,
  ShieldAlertIcon,
  SlidersIcon,
  SparklesIcon,
  ZapIcon,
  CopyIcon,
  CheckIcon,
} from "lucide-react";
import { toast } from "sonner";

import {
  CyberGrid,
  ParticleWave,
  ServerRack3D,
  TechGlobe,
} from "@/components/3d";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { useAppearance } from "@/hooks/use-appearance";
import { cn } from "cn";

export interface Animation3DItem {
  id: string;
  name: string;
  category: string;
  badge: string;
  icon: React.ElementType;
  tagline: string;
  businessFunction: string;
  industryFit: readonly string[];
  keyPerks: readonly string[];
  technicalSpecs: string;
  component: "globe" | "rack" | "wave" | "grid";
}

export const ANIMATION_3D_CATALOG: readonly Animation3DItem[] = [
  {
    id: "3d-tech-globe",
    name: "3D Tech Globe & Global Network",
    category: "Cloud Infrastructure & Connectivity",
    badge: "Interactive 3D Sphere",
    icon: GlobeIcon,
    tagline: "Bola dunia 3D interaktif dengan simpul node jaringan & busur transmisi data bercahaya.",
    businessFunction:
      "Membangun impresi berskala internasional dan global. Sangat efektif di Hero Section untuk membuktikan kapasitas jaringan, multi-region cloud, atau jangkauan layanan global.",
    industryFit: [
      "Perusahaan Cloud & DevOps",
      "Provider Telekomunikasi & ISP",
      "FinTech Global & Payment Gateway",
      "Logistik & Supply Chain Internasional",
    ],
    keyPerks: [
      "Dapat diputar bebas dengan klik & drag mouse (360°)",
      "Node jaringan memancarkan efek denyut sinyal (pulse)",
      "Otomatis berhenti saat keluar layar (hemat daya)",
      "Ukuran ultra-ringan (< 3KB bundle, tanpa Three.js berat)",
    ],
    technicalSpecs: "Canvas 2D Spherical Projection, 60 FPS, Auto-pause IntersectionObserver",
    component: "globe",
  },
  {
    id: "3d-server-rack",
    name: "3D Isometric Server Rack & Datacenter",
    category: "Hardware & IT Monitoring",
    badge: "Realtime Cluster Visualizer",
    icon: ServerIcon,
    tagline: "Visualisasi rak server 3D dengan lampu indikator LED I/O, HDD, dan beban server realtime.",
    businessFunction:
      "Memberikan bukti visual nyata atas kapabilitas komputasi dan reliabilitas sistem. Cocok untuk dashboard monitoring IT, halaman hosting/datacenter, atau presentasi SLA uptime 99.99%.",
    industryFit: [
      "Penyedia Hosting / VPS & Data Center",
      "Jasa Managed IT Services & SysAdmin",
      "Perusahaan Enterprise Software & ERP",
      "Sistem Monitoring Server & NOC (Network Operation Center)",
    ],
    keyPerks: [
      "Tilt perspektif 3D merespons arah pergerakan kursor mouse",
      "Simulasi lampu LED SSD read/write dan traffic paket data",
      "Bar beban kapasitas komputasi dinamis tiap unit server",
      "Desain blade rack industrialis modern & futuristik",
    ],
    technicalSpecs: "Canvas 2D Isometric Projection, Gyro/Mouse Tilt Lerp, Realtime Blink Logic",
    component: "rack",
  },
  {
    id: "3d-particle-wave",
    name: "3D Dynamic Particle Wave",
    category: "Modern SaaS & AI Data Stream",
    badge: "Fluid Particle Physics",
    icon: ActivityIcon,
    tagline: "Gelombang partikel 3D berkedalaman tinggi dengan efek ripple saat diarahkan kursor.",
    businessFunction:
      "Memberikan nuansa modern, elegan, dan dinamis pada latar belakang website. Menggambarkan aliran data cerdas, kecerdasan buatan (AI), atau analitik data berskala besar.",
    industryFit: [
      "Startup AI & Machine Learning",
      "Platform SaaS & Cloud Productivity",
      "FinTech Analytics & Robo Advisor",
      "Digital Agency & Desain Eksklusif",
    ],
    keyPerks: [
      "Gelombang menolak/terdistorsi saat didekati kursor (interactive ripple)",
      "Kerapatan 1.200+ partikel dengan depth scaling dan transparansi dinamis",
      "Otomatis menyesuaikan aksen warna tema aktif (Emerald, Sapphire, Amber, Slate)",
      "Performa mulus 60 FPS di desktop maupun perangkat mobile",
    ],
    technicalSpecs: "Canvas 2D 3D Perspective Matrix, Harmonic Wave Mathematics, Zero Latency",
    component: "wave",
  },
  {
    id: "3d-cyber-grid",
    name: "3D Perspective Cyber Grid & Horizon",
    category: "Cybersecurity & High-Tech Horizon",
    badge: "Infinite Scrolling Matrix",
    icon: ZapIcon,
    tagline: "Grid perspektif 3D yang bergerak tanpa batas dengan pulsa laser data dan spotlight neon.",
    businessFunction:
      "Memberikan atmosfer teknologi tinggi, keamanan siber, dan kecepatan performa. Sangat pas untuk brand yang ingin tampil berani, futuristik, dan berorientasi masa depan.",
    industryFit: [
      "Keamanan Siber (Cybersecurity) & SOC",
      "Developer Tools & Terminal Utilities",
      "Platform Blockchain, Web3 & Crypto",
      "Game Studio & Software Engineering Studio",
    ],
    keyPerks: [
      "Animasi scrolling tak berujung (infinite perspective grid)",
      "Spotlight neon interaktif mengikuti posisi kursor pengunjung",
      "Pulsa transmisi paket data berkecepatan tinggi di sepanjang garis koordinat",
      "Glow cakrawala (horizon glow) atmosferik berestetika cyberpunk modern",
    ],
    technicalSpecs: "Logarithmic Perspective Grid Projection, Dynamic Spotlight Radial Gradient",
    component: "grid",
  },
] as const;

interface Animation3DGalleryProps {
  onSelectAnimation?: (item: Animation3DItem) => void;
  selectedAnimationId?: string;
}

export function Animation3DGallery({
  onSelectAnimation,
  selectedAnimationId,
}: Animation3DGalleryProps) {
  const [activeItem, setActiveItem] = useState<Animation3DItem>(ANIMATION_3D_CATALOG[0]);
  const [interactive, setInteractive] = useState(true);
  const [speedMultiplier, setSpeedMultiplier] = useState<"normal" | "fast" | "slow">("normal");
  const [copiedSpecs, setCopiedSpecs] = useState(false);
  const { theme } = useAppearance();

  const handleCopySpecs = async (item: Animation3DItem) => {
    const text = `===========================================
REKOMENDASI ANIMASI 3D: ${item.name.toUpperCase()}
===========================================
Kategori          : ${item.category}
Fungsi Bisnis     : ${item.businessFunction}
Cocok Untuk       : ${item.industryFit.join(", ")}
Fitur Utama       :
${item.keyPerks.map((p) => ` - ${p}`).join("\n")}
Spesifikasi Teknis: ${item.technicalSpecs}
Keunggulan        : Tanpa library berat (No Three.js overhead), 60 FPS Canvas native.
===========================================`;

    try {
      await navigator.clipboard.writeText(text);
      setCopiedSpecs(true);
      toast.success(`Spesifikasi "${item.name}" Disalin!`, {
        description: "Teks rincian animasi 3D siap dilampirkan ke proposal atau brief client.",
      });
      setTimeout(() => setCopiedSpecs(false), 2500);
    } catch {
      toast.error("Gagal menyalin spesifikasi");
    }
  };

  const getSpeedValue = (base: number) => {
    if (speedMultiplier === "slow") return base * 0.5;
    if (speedMultiplier === "fast") return base * 1.8;
    return base;
  };

  return (
    <div className="space-y-8">
      {/* Header Info */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 border-b border-border pb-6">
        <div>
          <div className="flex items-center gap-2 mb-1.5">
            <Badge variant="outline" className="gap-1 border-primary/40 text-primary bg-primary/5">
              <SparklesIcon className="size-3.5" />
              Engine Visual 3D Ringan
            </Badge>
            <Badge variant="secondary" className="text-xs">
              60 FPS Native Canvas (Zero Dependencies)
            </Badge>
          </div>
          <h2 className="text-2xl sm:text-3xl font-bold font-heading tracking-tight">
            Katalog & Pilihan Animasi 3D Interaktif
          </h2>
          <p className="text-sm text-muted-foreground mt-1 max-w-3xl">
            Tunjukkan kepada client beragam opsi visualisasi 3D yang dapat disematkan ke dalam web mereka.
            Seluruh animasi dibangun dengan Canvas native yang ultra-ringan (&lt; 4KB) tanpa memberatkan kecepatan loading halaman.
          </p>
        </div>

        {/* Action Controls */}
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setInteractive(!interactive)}
            className="text-xs gap-1.5"
          >
            <SlidersIcon className="size-3.5" />
            Interaksi Mouse: {interactive ? "ON" : "OFF"}
          </Button>

          <Button
            variant="outline"
            size="sm"
            onClick={() => {
              setSpeedMultiplier((prev) =>
                prev === "normal" ? "fast" : prev === "fast" ? "slow" : "normal"
              );
            }}
            className="text-xs gap-1.5 capitalize"
          >
            <RotateCwIcon className="size-3.5" />
            Kecepatan: {speedMultiplier}
          </Button>
        </div>
      </div>

      {/* Grid of 4 Animation Cards with Selectors */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        {ANIMATION_3D_CATALOG.map((item) => {
          const isSelected = activeItem.id === item.id;
          const IconComp = item.icon;
          return (
            <button
              key={item.id}
              type="button"
              onClick={() => setActiveItem(item)}
              className={cn(
                "flex flex-col items-start gap-2.5 rounded-xl border p-4 text-left transition-all outline-none",
                isSelected
                  ? "border-primary bg-primary/10 shadow-sm ring-1 ring-primary"
                  : "border-border bg-card/60 hover:bg-muted/50 hover:border-primary/40"
              )}
            >
              <div className="flex items-center justify-between w-full">
                <div
                  className={cn(
                    "flex size-9 items-center justify-center rounded-lg transition-colors",
                    isSelected ? "bg-primary text-primary-foreground" : "bg-muted text-foreground"
                  )}
                >
                  <IconComp className="size-5" />
                </div>
                {isSelected && <CheckCircle2Icon className="size-4 text-primary" />}
              </div>

              <div className="space-y-0.5">
                <span className="font-heading font-semibold text-sm line-clamp-1">
                  {item.name.split("&")[0]}
                </span>
                <span className="text-xs text-muted-foreground line-clamp-1">{item.badge}</span>
              </div>
            </button>
          );
        })}
      </div>

      {/* Active 3D Visualizer Stage & Business Breakdown */}
      <div className="grid lg:grid-cols-12 gap-6 items-start">
        {/* Left / Center: Interactive Live 3D Canvas Stage */}
        <div className="lg:col-span-7 flex flex-col gap-3">
          <div className="relative h-[380px] sm:h-[450px] w-full rounded-2xl border border-border bg-black/90 overflow-hidden shadow-2xl flex flex-col justify-between p-4">
            {/* Ambient Background Glow */}
            <div className="absolute inset-0 bg-gradient-to-b from-primary/10 via-transparent to-primary/5 pointer-events-none" />

            {/* Stage Info Header Overlay */}
            <div className="relative z-10 flex items-center justify-between pointer-events-none">
              <div className="flex items-center gap-2">
                <span className="size-2 rounded-full bg-emerald-400 animate-pulse" />
                <span className="text-xs font-mono text-emerald-400 font-semibold uppercase tracking-wider">
                  Live Preview: {activeItem.badge}
                </span>
              </div>
              <Badge variant="outline" className="bg-black/60 text-[11px] font-mono border-white/20 text-white/80">
                Tema: {theme}
              </Badge>
            </div>

            {/* Render Selected 3D Component */}
            <div className="absolute inset-0 flex items-center justify-center">
              {activeItem.component === "globe" && (
                <TechGlobe
                  radius={160}
                  speed={getSpeedValue(0.006)}
                  interactive={interactive}
                  className="size-full"
                />
              )}

              {activeItem.component === "rack" && (
                <ServerRack3D
                  serversCount={6}
                  interactive={interactive}
                  className="size-full"
                />
              )}

              {activeItem.component === "wave" && (
                <ParticleWave
                  rows={32}
                  cols={32}
                  speed={getSpeedValue(0.02)}
                  interactive={interactive}
                  amplitude={30}
                  className="size-full"
                />
              )}

              {activeItem.component === "grid" && (
                <CyberGrid
                  speed={getSpeedValue(1.3)}
                  interactive={interactive}
                  className="size-full"
                />
              )}
            </div>

            {/* Bottom Interaction Tip Overlay */}
            <div className="relative z-10 flex items-center justify-between text-[11px] text-white/70 bg-black/60 backdrop-blur-sm rounded-lg px-3 py-1.5 border border-white/10 pointer-events-none">
              <span>
                💡 Arahkan kursor / drag mouse di atas kanvas untuk menguji interaktivitas 3D
              </span>
              <span className="font-mono text-[10px] text-primary hidden sm:inline">
                FPS: 60 | GPU Accel
              </span>
            </div>
          </div>

          <div className="flex flex-wrap items-center justify-between gap-2 px-1">
            <span className="text-xs text-muted-foreground">
              Komponen: <code className="font-mono text-foreground font-semibold">@/components/3d/{activeItem.component === "globe" ? "TechGlobe" : activeItem.component === "rack" ? "ServerRack3D" : activeItem.component === "wave" ? "ParticleWave" : "CyberGrid"}</code>
            </span>

            <Button
              variant="outline"
              size="sm"
              onClick={() => handleCopySpecs(activeItem)}
              className="text-xs gap-1.5"
            >
              {copiedSpecs ? (
                <>
                  <CheckIcon className="size-3.5 text-emerald-500" />
                  Spesifikasi Tersalin!
                </>
              ) : (
                <>
                  <CopyIcon className="size-3.5" />
                  Salin Deskripsi untuk Client
                </>
              )}
            </Button>
          </div>
        </div>

        {/* Right: Detailed Function, Use Case & Business Value for Client */}
        <div className="lg:col-span-5 space-y-4">
          <Card className="border-border shadow-xs">
            <CardContent className="p-5 space-y-4">
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <Badge variant="outline" className="border-primary/40 text-primary">
                    {activeItem.category}
                  </Badge>
                </div>
                <h3 className="text-xl font-bold font-heading">{activeItem.name}</h3>
                <p className="text-xs text-muted-foreground mt-0.5">{activeItem.tagline}</p>
              </div>

              <div className="space-y-1.5 rounded-lg bg-accent/40 p-3.5 border border-border/80">
                <span className="text-xs font-bold text-foreground flex items-center gap-1.5">
                  <ZapIcon className="size-3.5 text-primary" />
                  Fungsi & Nilai Tambah untuk Client:
                </span>
                <p className="text-xs leading-relaxed text-muted-foreground">
                  {activeItem.businessFunction}
                </p>
              </div>

              <div className="space-y-2">
                <span className="text-xs font-semibold text-foreground block">
                  Cocok untuk Industri & Kategori Proyek:
                </span>
                <div className="flex flex-wrap gap-1.5">
                  {activeItem.industryFit.map((ind) => (
                    <span
                      key={ind}
                      className="inline-flex items-center rounded-md bg-muted px-2.5 py-1 text-[11px] font-medium text-foreground border border-border/60"
                    >
                      {ind}
                    </span>
                  ))}
                </div>
              </div>

              <div className="space-y-2">
                <span className="text-xs font-semibold text-foreground block">
                  Keunggulan Teknis & Visual:
                </span>
                <div className="space-y-1.5">
                  {activeItem.keyPerks.map((perk) => (
                    <div key={perk} className="flex items-start gap-2 text-xs text-muted-foreground">
                      <CheckCircle2Icon className="size-3.5 text-emerald-500 shrink-0 mt-0.5" />
                      <span>{perk}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="pt-2 border-t border-border flex flex-col gap-2">
                <div className="text-[11px] text-muted-foreground">
                  <span className="font-semibold text-foreground">Spesifikasi: </span>
                  {activeItem.technicalSpecs}
                </div>

                <Button
                  onClick={() => {
                    if (onSelectAnimation) {
                      onSelectAnimation(activeItem);
                    }
                    toast.success(`Animasi "${activeItem.name}" Dipilih!`, {
                      description: "Animasi 3D ini telah dicatat sebagai visual preferensi untuk proyek.",
                    });
                  }}
                  className="w-full gap-2 font-semibold text-xs mt-1 bg-primary text-primary-foreground"
                >
                  <SparklesIcon className="size-3.5" />
                  Pilih Animasi 3D Ini untuk Proyek
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
