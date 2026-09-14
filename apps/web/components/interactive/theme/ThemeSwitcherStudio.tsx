"use client";

import { useTheme } from "next-themes";
import { CheckIcon, MoonIcon, SunIcon, PaletteIcon, SlidersHorizontalIcon } from "lucide-react";
import { useAppearance } from "@/hooks/use-appearance";
import { type ThemeId } from "@/config/theme";
import { cn } from "cn";

export interface ThemePresetCard {
  id: ThemeId;
  name: string;
  category: string;
  tagline: string;
  colorPreview: string[];
  recommendedMode: "dark" | "light" | "both";
}

export const BUSINESS_THEME_PRESETS: ThemePresetCard[] = [
  {
    id: "sapphire",
    name: "Corporate Clean",
    category: "Enterprise & FinTech",
    tagline: "Wibawa korporat biru klasik, radii presisi tinggi, dan tipografi tajam.",
    colorPreview: ["#1d4ed8", "#3b82f6", "#93c5fd"],
    recommendedMode: "both",
  },
  {
    id: "minimalist",
    name: "Minimalist SaaS",
    category: "Modern AI & Subscription",
    tagline: "Monokromatik modern dengan sentuhan fokus electric indigo yang elegan.",
    colorPreview: ["#4f46e5", "#818cf8", "#e0e7ff"],
    recommendedMode: "both",
  },
  {
    id: "cyberpunk",
    name: "Cyberpunk / Neon",
    category: "Web3, Tech & Gaming",
    tagline: "Aura futuristik dengan kontras neon cyan & magenta berkilau.",
    colorPreview: ["#00f0ff", "#ff007f", "#ffe600"],
    recommendedMode: "dark",
  },
  {
    id: "slate",
    name: "Dark Modern",
    category: "Developer Tools & Cloud",
    tagline: "Kontras tinggi mendekati hitam-putih mutlak dengan sudut arsitektural tegas.",
    colorPreview: ["#0f172a", "#334155", "#94a3b8"],
    recommendedMode: "dark",
  },
  {
    id: "emerald",
    name: "Friendly SaaS",
    category: "Green Tech & Growth",
    tagline: "Sistem hijau seimbang yang bersahabat, nyaman di mata untuk aplikasi harian.",
    colorPreview: ["#15803d", "#4ade80", "#bbf7d0"],
    recommendedMode: "both",
  },
  {
    id: "amber",
    name: "Warm Editorial",
    category: "Creative Agency & Content",
    tagline: "Sentuhan serif hangat dan ramah untuk brand gaya hidup dan agensi kreatif.",
    colorPreview: ["#b45309", "#fbbf24", "#fef3c7"],
    recommendedMode: "both",
  },
];

export function ThemeSwitcherStudio({ className }: { className?: string }) {
  const { theme: brandTheme, setTheme: setBrandTheme, density, setDensity } = useAppearance();
  const { resolvedTheme: colorMode, setTheme: setColorMode } = useTheme();

  return (
    <div
      className={cn(
        "rounded-2xl border border-border/80 bg-card/60 backdrop-blur-xl p-6 shadow-xl",
        className
      )}
    >
      {/* Top Header Controls */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-border/60">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <PaletteIcon className="size-5 text-primary" />
            <h3 className="font-heading text-lg font-bold text-foreground">
              Dynamic Theme & Design System Studio
            </h3>
          </div>
          <p className="text-xs sm:text-sm text-muted-foreground">
            Uji responsivitas palet warna, tipografi, dan mode tampilan secara live untuk presentasi ke klien.
          </p>
        </div>

        {/* Global Mode & Density Toggles */}
        <div className="flex items-center gap-2 shrink-0">
          {/* Light / Dark Toggle */}
          <button
            type="button"
            onClick={() => setColorMode(colorMode === "dark" ? "light" : "dark")}
            className="flex items-center gap-2 rounded-xl border border-border/80 bg-background/80 px-3.5 py-2 text-xs font-semibold text-foreground hover:bg-accent transition-colors cursor-pointer shadow-sm"
          >
            {colorMode === "dark" ? (
              <>
                <SunIcon className="size-4 text-amber-400" />
                <span>Light Mode</span>
              </>
            ) : (
              <>
                <MoonIcon className="size-4 text-indigo-400" />
                <span>Dark Mode</span>
              </>
            )}
          </button>

          {/* Density Toggle */}
          <button
            type="button"
            onClick={() => setDensity(density === "compact" ? "comfortable" : "compact")}
            className="flex items-center gap-2 rounded-xl border border-border/80 bg-background/80 px-3.5 py-2 text-xs font-semibold text-foreground hover:bg-accent transition-colors cursor-pointer shadow-sm"
          >
            <SlidersHorizontalIcon className="size-4 text-primary" />
            <span className="capitalize">{density} Spacing</span>
          </button>
        </div>
      </div>

      {/* Preset Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3.5 pt-6">
        {BUSINESS_THEME_PRESETS.map((preset) => {
          const isActive = brandTheme === preset.id;

          return (
            <div
              key={preset.id}
              onClick={() => {
                setBrandTheme(preset.id);
                if (preset.recommendedMode === "dark" && colorMode !== "dark") {
                  setColorMode("dark");
                }
              }}
              className={cn(
                "group relative flex flex-col justify-between rounded-xl border p-4 cursor-pointer transition-all duration-200 select-none",
                isActive
                  ? "border-primary bg-primary/10 shadow-md shadow-primary/10 ring-2 ring-primary/40"
                  : "border-border/70 bg-card/40 hover:border-border hover:bg-card/80"
              )}
            >
              <div>
                <div className="flex items-center justify-between gap-2 mb-1.5">
                  <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                    {preset.category}
                  </span>
                  {isActive && (
                    <span className="flex items-center gap-1 text-[11px] font-bold text-primary">
                      <CheckIcon className="size-3.5" /> Aktif
                    </span>
                  )}
                </div>

                <h4 className="font-heading text-base font-bold text-foreground group-hover:text-primary transition-colors">
                  {preset.name}
                </h4>

                <p className="text-xs text-muted-foreground mt-1 leading-relaxed line-clamp-2">
                  {preset.tagline}
                </p>
              </div>

              {/* Color Swatches */}
              <div className="flex items-center justify-between pt-4 mt-2 border-t border-border/40">
                <div className="flex items-center gap-1.5">
                  {preset.colorPreview.map((hex, i) => (
                    <span
                      key={i}
                      style={{ backgroundColor: hex }}
                      className="size-4 rounded-full border border-black/20 shadow-xs"
                    />
                  ))}
                </div>
                <span className="text-[11px] font-medium text-muted-foreground group-hover:text-foreground">
                  Gunakan Tema →
                </span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
