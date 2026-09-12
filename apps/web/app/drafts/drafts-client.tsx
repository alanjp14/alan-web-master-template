"use client";

import { useState } from "react";
import Link from "next/link";
import {
  ArrowRightIcon,
  CheckCircle2Icon,
  ChevronRightIcon,
  EyeIcon,
  LayersIcon,
  SparklesIcon,
  SparkleIcon,
  ShieldCheckIcon,
} from "lucide-react";

import { DRAFT_PRESETS, type DraftPreset } from "@/config/draft-presets";
import { DraftSwitcherBar, type ViewportMode } from "@/components/drafts/DraftSwitcherBar";
import {
  ConsultationForm,
  FaqSection,
  HeroSection,
  PortfolioSection,
  ServicesSection,
  StatsSection,
  ToolsTeaserSection,
  WorkflowSection,
} from "@/components/marketing";
import {
  BarList,
  DashboardCard,
  MetricCard,
  Sparkline,
  StatCard,
} from "@/components/dashboard";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { useAppearance } from "@/hooks/use-appearance";
import { cn } from "cn";

export function DraftsClientShowcase() {
  const [activePreset, setActivePreset] = useState<DraftPreset>(DRAFT_PRESETS[0]);
  const [viewportMode, setViewportMode] = useState<ViewportMode>("desktop");
  const { theme, setTheme } = useAppearance();

  const handleSelectPreset = (preset: DraftPreset) => {
    setActivePreset(preset);
    setTheme(preset.recommendedTheme);
  };

  const trendData = [12, 18, 15, 24, 22, 31, 28, 38, 42, 45];

  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col selection:bg-primary selection:text-primary-foreground">
      {/* Interactive Top Switcher Bar */}
      <DraftSwitcherBar
        activePreset={activePreset}
        onSelectPreset={handleSelectPreset}
        viewportMode={viewportMode}
        onViewportChange={setViewportMode}
      />

      {/* Hero Banner for Client Instructions */}
      <div className="bg-gradient-to-r from-primary/10 via-accent/20 to-primary/5 border-b border-border py-6 px-4">
        <div className="mx-auto max-w-7xl flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <Badge variant="outline" className="gap-1 border-primary/40 text-primary bg-background/80">
                <SparklesIcon className="size-3" />
                Katalog Draft Web Client
              </Badge>
              <Badge variant="secondary" className="capitalize">
                Tema Aktif: {theme}
              </Badge>
            </div>
            <h1 className="text-xl sm:text-2xl font-bold font-heading tracking-tight">
              {activePreset.title}
            </h1>
            <p className="text-sm text-muted-foreground max-w-3xl">
              {activePreset.description}
            </p>
          </div>

          {/* Quick Preset Selector Buttons */}
          <div className="flex flex-wrap items-center gap-2">
            {DRAFT_PRESETS.map((p) => {
              const active = p.id === activePreset.id;
              return (
                <button
                  key={p.id}
                  type="button"
                  onClick={() => handleSelectPreset(p)}
                  className={cn(
                    "px-3 py-1.5 rounded-lg text-xs font-semibold transition-all border outline-none",
                    active
                      ? "bg-primary text-primary-foreground border-primary shadow-xs"
                      : "bg-background/80 text-muted-foreground border-border hover:bg-accent hover:text-foreground"
                  )}
                >
                  {p.badge}
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Main Viewport Container */}
      <main className="flex-1 py-8 px-2 sm:px-4 lg:px-6">
        <div
          className={cn(
            "transition-all duration-300 rounded-xl border border-border bg-background shadow-lg overflow-hidden",
            viewportMode === "desktop" && "w-full max-w-7xl mx-auto",
            viewportMode === "tablet" && "w-full max-w-[768px] mx-auto ring-1 ring-border/50",
            viewportMode === "mobile" && "w-full max-w-[375px] mx-auto ring-1 ring-border/50"
          )}
        >
          {/* Mock Browser Topbar */}
          <div className="flex items-center justify-between px-4 py-2.5 bg-muted/60 border-b border-border text-xs text-muted-foreground select-none">
            <div className="flex items-center gap-1.5">
              <span className="size-2.5 rounded-full bg-red-400/80" />
              <span className="size-2.5 rounded-full bg-yellow-400/80" />
              <span className="size-2.5 rounded-full bg-green-400/80" />
            </div>
            <div className="flex items-center gap-2 px-3 py-1 rounded-md bg-background/80 border border-border/60 text-[11px] font-mono truncate max-w-[280px]">
              <ShieldCheckIcon className="size-3 text-emerald-500 shrink-0" />
              <span>https://preview.client-draft.com{activePreset.previewUrl}</span>
            </div>
            <div className="flex items-center gap-1.5 font-medium">
              <Badge variant="outline" className="text-[10px] uppercase py-0 px-1.5 font-mono">
                {viewportMode}
              </Badge>
            </div>
          </div>

          {/* Render Active Preset Content */}
          <div className="relative min-h-[600px] bg-background">
            {activePreset.layoutType === "marketing" && (
              <div className="space-y-0">
                <HeroSection />
                <ServicesSection />
                <StatsSection />
                <WorkflowSection />
                <PortfolioSection />
                <FaqSection />
                <ConsultationForm />
              </div>
            )}

            {activePreset.layoutType === "saas" && (
              <div className="space-y-0">
                <HeroSection />
                <ToolsTeaserSection />
                <ServicesSection />
                <StatsSection />
                <FaqSection />
                <ConsultationForm />
              </div>
            )}

            {activePreset.layoutType === "agency" && (
              <div className="space-y-0">
                <HeroSection />
                <PortfolioSection />
                <WorkflowSection />
                <StatsSection />
                <ToolsTeaserSection />
                <ConsultationForm />
              </div>
            )}

            {activePreset.layoutType === "dashboard" && (
              <div className="p-6 space-y-6">
                <div className="space-y-2">
                  <Badge variant="outline" className="text-primary border-primary/30">
                    Dashboard App Shell Preview
                  </Badge>
                  <h2 className="text-2xl font-bold font-heading">
                    Pusat Kendali Data & Admin Console
                  </h2>
                  <p className="text-sm text-muted-foreground max-w-2xl">
                    Tampilan dashboard interaktif dengan widget metrik realtime, visualisasi sparkline, dan sistem navigasi modular.
                  </p>
                </div>

                <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                  <StatCard
                    label="Pendapatan Bulanan"
                    value="Rp 148.500.000"
                    trend={{ value: 14.2, label: "vs bulan lalu" }}
                    chart={<Sparkline data={trendData} label="Trend Revenue" />}
                  />
                  <StatCard
                    label="Pengguna Aktif"
                    value="4.290 Tim"
                    trend={{ value: 8.7, label: "vs minggu lalu" }}
                  />
                  <MetricCard
                    label="Kapasitas Cloud Server"
                    value={68}
                    unit="%"
                    progress={{ value: 68, max: 100, label: "68 dari 100 GB" }}
                  />
                </div>

                <div className="grid gap-4 md:grid-cols-2">
                  <DashboardCard title="Kinerja Sumber Trafik" description="Peringkat kanal akuisisi pengguna">
                    <BarList
                      data={[
                        { label: "Pencarian Organik", value: 12400 },
                        { label: "Rujukan Enterprise", value: 8300 },
                        { label: "Direct Access", value: 6100 },
                        { label: "Kampanye Social", value: 3400 },
                      ]}
                    />
                  </DashboardCard>

                  <DashboardCard title="Status Modul Infrastruktur" description="Kondisi server & microservices">
                    <div className="space-y-3 pt-2">
                      {[
                        { name: "API Gateway (Bun.js)", status: "Operational (99.99%)", color: "bg-emerald-500" },
                        { name: "PostgreSQL Database", status: "Healthy (12ms latency)", color: "bg-emerald-500" },
                        { name: "Better Auth Service", status: "Active Session Proxy", color: "bg-emerald-500" },
                        { name: "Vercel Edge Network", status: "Global CDN Deployed", color: "bg-emerald-500" },
                      ].map((item) => (
                        <div key={item.name} className="flex items-center justify-between text-xs p-2.5 rounded-lg bg-muted/40 border border-border">
                          <span className="font-medium">{item.name}</span>
                          <span className="flex items-center gap-1.5 text-muted-foreground font-mono">
                            <span className={cn("size-2 rounded-full", item.color)} />
                            {item.status}
                          </span>
                        </div>
                      ))}
                    </div>
                  </DashboardCard>
                </div>
              </div>
            )}
          </div>
        </div>
      </main>

      {/* Bottom Sticky Bar for Client Selection Summary */}
      <footer className="border-t border-border bg-background/95 backdrop-blur-md py-4 px-4 sm:px-6 sticky bottom-0 z-40">
        <div className="mx-auto max-w-7xl flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <span
              className="size-3 rounded-full shrink-0"
              style={{ backgroundColor: activePreset.colorHex }}
            />
            <div>
              <p className="text-xs font-bold text-foreground">
                Preset Terpilih: {activePreset.title}
              </p>
              <p className="text-[11px] text-muted-foreground">
                Rekomendasi Tema: <span className="capitalize font-semibold">{activePreset.recommendedTheme}</span> | Tema Aktif: <span className="capitalize font-semibold">{theme}</span>
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              nativeButton={false}
              render={<Link href="/showcase" />}
              className="text-xs gap-1"
            >
              <EyeIcon className="size-3.5" />
              Lihat Komponen Full
            </Button>

            <Button
              size="sm"
              onClick={() => {
                const modalBtn = document.querySelector('button:has(svg.lucide-sparkles)') as HTMLButtonElement;
                if (modalBtn) modalBtn.click();
              }}
              className="gap-1.5 font-semibold text-xs bg-primary text-primary-foreground shadow-xs"
            >
              <SparklesIcon className="size-3.5" />
              Pilih Draft Ini
            </Button>
          </div>
        </div>
      </footer>
    </div>
  );
}
