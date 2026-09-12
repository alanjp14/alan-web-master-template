"use client";

import { useState } from "react";
import {
  CheckIcon,
  CheckCircleIcon,
  ChevronDownIcon,
  LaptopIcon,
  PaletteIcon,
  SmartphoneIcon,
  SparklesIcon,
  TabletIcon,
  ExternalLinkIcon,
} from "lucide-react";

import { DRAFT_PRESETS, type DraftPreset } from "@/config/draft-presets";
import { useAppearance } from "@/hooks/use-appearance";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { DraftSummaryModal } from "./DraftSummaryModal";
import { cn } from "cn";

export type ViewportMode = "desktop" | "tablet" | "mobile";

interface DraftSwitcherBarProps {
  activePreset: DraftPreset;
  onSelectPreset: (preset: DraftPreset) => void;
  viewportMode: ViewportMode;
  onViewportChange: (mode: ViewportMode) => void;
}

export function DraftSwitcherBar({
  activePreset,
  onSelectPreset,
  viewportMode,
  onViewportChange,
}: DraftSwitcherBarProps) {
  const { theme, setTheme, themes } = useAppearance();
  const [modalOpen, setModalOpen] = useState(false);

  return (
    <>
      <header className="sticky top-0 z-50 w-full border-b border-border bg-background/95 backdrop-blur-md supports-[backdrop-filter]:bg-background/80 shadow-xs">
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between gap-3 px-4 sm:px-6">
          {/* Left: Draft Preset Selector Dropdown */}
          <div className="flex items-center gap-3">
            <div className="hidden sm:flex items-center gap-2 pr-3 border-r border-border">
              <span className="flex size-7 items-center justify-center rounded-lg bg-primary/10 text-primary font-bold text-xs">
                DRAFT
              </span>
              <span className="font-heading font-semibold text-sm tracking-tight">
                Client Preview
              </span>
            </div>

            <DropdownMenu>
              <DropdownMenuTrigger
                render={
                  <Button
                    variant="outline"
                    className="gap-2 font-medium text-xs sm:text-sm bg-accent/30 border-primary/30"
                  />
                }
              >
                <span
                  className="size-2.5 rounded-full shrink-0"
                  style={{ backgroundColor: activePreset.colorHex }}
                />
                <span className="truncate max-w-[140px] sm:max-w-[240px]">
                  {activePreset.title.split(":")[0]} - {activePreset.badge}
                </span>
                <ChevronDownIcon className="size-3.5 text-muted-foreground shrink-0" />
              </DropdownMenuTrigger>
              <DropdownMenuContent align="start" className="w-80">
                <DropdownMenuLabel className="text-xs text-muted-foreground uppercase font-mono tracking-wider">
                  Pilih Preset Draft Web
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                {DRAFT_PRESETS.map((preset) => {
                  const isSelected = preset.id === activePreset.id;
                  return (
                    <DropdownMenuItem
                      key={preset.id}
                      onClick={() => {
                        onSelectPreset(preset);
                        setTheme(preset.recommendedTheme);
                      }}
                      className={cn(
                        "flex flex-col items-start gap-1 p-3 cursor-pointer",
                        isSelected && "bg-primary/10"
                      )}
                    >
                      <div className="flex items-center justify-between w-full">
                        <span className="font-medium text-sm flex items-center gap-2">
                          <span
                            className="size-2 rounded-full"
                            style={{ backgroundColor: preset.colorHex }}
                          />
                          {preset.title}
                        </span>
                        {isSelected && <CheckIcon className="size-4 text-primary" />}
                      </div>
                      <span className="text-xs text-muted-foreground line-clamp-2">
                        {preset.subtitle}
                      </span>
                      <Badge variant="secondary" className="text-[10px] mt-1">
                        Theme: {preset.recommendedTheme}
                      </Badge>
                    </DropdownMenuItem>
                  );
                })}
              </DropdownMenuContent>
            </DropdownMenu>
          </div>

          {/* Center: Viewport Controls (Desktop / Tablet / Mobile) */}
          <div className="hidden lg:flex items-center rounded-lg border border-border bg-muted/30 p-1 gap-1">
            <button
              type="button"
              onClick={() => onViewportChange("desktop")}
              className={cn(
                "flex items-center gap-1.5 rounded-md px-2.5 py-1 text-xs font-medium transition-colors",
                viewportMode === "desktop"
                  ? "bg-background text-foreground shadow-xs"
                  : "text-muted-foreground hover:text-foreground"
              )}
              title="Desktop View (100%)"
            >
              <LaptopIcon className="size-3.5" />
              <span>Desktop</span>
            </button>
            <button
              type="button"
              onClick={() => onViewportChange("tablet")}
              className={cn(
                "flex items-center gap-1.5 rounded-md px-2.5 py-1 text-xs font-medium transition-colors",
                viewportMode === "tablet"
                  ? "bg-background text-foreground shadow-xs"
                  : "text-muted-foreground hover:text-foreground"
              )}
              title="Tablet View (768px)"
            >
              <TabletIcon className="size-3.5" />
              <span>Tablet</span>
            </button>
            <button
              type="button"
              onClick={() => onViewportChange("mobile")}
              className={cn(
                "flex items-center gap-1.5 rounded-md px-2.5 py-1 text-xs font-medium transition-colors",
                viewportMode === "mobile"
                  ? "bg-background text-foreground shadow-xs"
                  : "text-muted-foreground hover:text-foreground"
              )}
              title="Mobile View (375px)"
            >
              <SmartphoneIcon className="size-3.5" />
              <span>Mobile</span>
            </button>
          </div>

          {/* Right: Theme Picker Dropdown & CTA Button */}
          <div className="flex items-center gap-2">
            <DropdownMenu>
              <DropdownMenuTrigger
                render={
                  <Button variant="ghost" size="sm" className="gap-1.5 hidden sm:flex" />
                }
              >
                <PaletteIcon className="size-4 text-muted-foreground" />
                <span className="capitalize text-xs font-medium">{theme}</span>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56">
                <DropdownMenuLabel className="text-xs text-muted-foreground uppercase font-mono tracking-wider">
                  Ubah Akses Warna (Theme)
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                {themes.map((t) => (
                  <DropdownMenuItem
                    key={t.id}
                    onClick={() => setTheme(t.id)}
                    className="flex items-center justify-between cursor-pointer"
                  >
                    <div className="flex items-center gap-2">
                      <span className="flex size-4 overflow-hidden rounded-full ring-1 ring-foreground/20">
                        <span className="h-full w-1/2" style={{ backgroundColor: t.swatch[0] }} />
                        <span className="h-full w-1/2" style={{ backgroundColor: t.swatch[1] }} />
                      </span>
                      <span className="text-sm font-medium">{t.label}</span>
                    </div>
                    {theme === t.id && <CheckCircleIcon className="size-4 text-primary" />}
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>

            <Button
              size="sm"
              onClick={() => setModalOpen(true)}
              className="gap-1.5 font-semibold text-xs sm:text-sm bg-primary text-primary-foreground shadow-xs"
            >
              <SparklesIcon className="size-4" />
              <span>Pilih Draft Ini</span>
            </Button>
          </div>
        </div>
      </header>

      <DraftSummaryModal
        open={modalOpen}
        onOpenChange={setModalOpen}
        preset={activePreset}
      />
    </>
  );
}
