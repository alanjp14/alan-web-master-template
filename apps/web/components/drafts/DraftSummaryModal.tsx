"use client";

import { useState } from "react";
import { CheckIcon, CopyIcon, SparklesIcon, CheckCircle2Icon, BoxIcon } from "lucide-react";
import { toast } from "sonner";

import type { DraftPreset } from "@/config/draft-presets";
import type { Animation3DItem } from "@/components/3d/Animation3DGallery";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { useAppearance } from "@/hooks/use-appearance";

interface DraftSummaryModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  preset: DraftPreset;
  selectedAnimation?: Animation3DItem | null;
}

export function DraftSummaryModal({
  open,
  onOpenChange,
  preset,
  selectedAnimation,
}: DraftSummaryModalProps) {
  const { theme } = useAppearance();
  const [copied, setCopied] = useState(false);

  const formattedSummary = `===========================================
RINGKASAN PILIHAN DRAFT PRESET & ANIMASI 3D CLIENT
===========================================
Nama Preset       : ${preset.title}
Target Segmentasi : ${preset.targetAudience}
Tema Warna        : ${theme.toUpperCase()} (Rekomendasi: ${preset.recommendedTheme.toUpperCase()})
Layout Shell      : ${preset.layoutType.toUpperCase()}
Animasi 3D Pilihan: ${selectedAnimation ? `${selectedAnimation.name} (${selectedAnimation.badge})` : "3D Tech Globe / Sesuai Preset"}

Fitur Utama yang Dipilih:
${preset.keyFeatures.map((f) => ` - [x] ${f}`).join("\n")}
${selectedAnimation ? ` - [x] Visualisasi 3D: ${selectedAnimation.name} (${selectedAnimation.category})\n   Spesifikasi: ${selectedAnimation.technicalSpecs}` : ""}

Catatan Implementasi:
- Menggunakan arsitektur Next.js 16 + Bun.js API
- Engine 3D Canvas native tanpa dependensi Three.js berat (< 4KB, 60 FPS)
- Siap di-deploy & dikembangkan lebih lanjut.
===========================================`;

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(formattedSummary);
      setCopied(true);
      toast.success("Ringkasan Berhasil Disalin!", {
        description: "Anda dapat membagikan teks ringkasan ini kepada tim/developer.",
      });
      setTimeout(() => setCopied(false), 2500);
    } catch {
      toast.error("Gagal menyalin teks ke clipboard");
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-xl sm:max-w-2xl overflow-y-auto max-h-[90vh]">
        <DialogHeader>
          <div className="flex items-center gap-2 mb-1">
            <Badge variant="outline" className="gap-1 border-primary/40 text-primary">
              <SparklesIcon className="size-3" />
              {preset.badge}
            </Badge>
            <Badge variant="secondary" className="capitalize">
              Tema: {theme}
            </Badge>
            {selectedAnimation && (
              <Badge variant="outline" className="gap-1 border-emerald-500/40 text-emerald-500">
                <BoxIcon className="size-3" />
                {selectedAnimation.badge}
              </Badge>
            )}
          </div>
          <DialogTitle className="text-xl sm:text-2xl font-bold font-heading">
            {preset.title}
          </DialogTitle>
          <DialogDescription className="text-sm text-muted-foreground">
            {preset.subtitle}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-2 text-sm">
          <Card variant="outlined" className="bg-muted/40">
            <CardContent className="p-4 space-y-2">
              <p className="font-semibold text-foreground">Deskripsi Konsep:</p>
              <p className="text-muted-foreground leading-relaxed">{preset.description}</p>
            </CardContent>
          </Card>

          <div className="grid sm:grid-cols-2 gap-3">
            <div className="rounded-lg border border-border p-3 space-y-1 bg-background">
              <span className="text-xs text-muted-foreground font-medium uppercase tracking-wider">
                Target Segmentasi
              </span>
              <p className="font-medium text-foreground">{preset.targetAudience}</p>
            </div>
            <div className="rounded-lg border border-border p-3 space-y-1 bg-background">
              <span className="text-xs text-muted-foreground font-medium uppercase tracking-wider">
                Rekomendasi Tema
              </span>
              <p className="font-medium text-foreground capitalize">
                {preset.recommendedTheme} (Aktif: {theme})
              </p>
            </div>
          </div>

          {selectedAnimation && (
            <div className="rounded-lg border border-emerald-500/30 bg-emerald-500/5 p-3.5 space-y-1.5">
              <span className="text-xs text-emerald-500 font-bold uppercase tracking-wider flex items-center gap-1.5">
                <BoxIcon className="size-3.5" />
                Animasi 3D yang Terpilih:
              </span>
              <p className="font-semibold text-foreground text-sm">{selectedAnimation.name}</p>
              <p className="text-xs text-muted-foreground">{selectedAnimation.businessFunction}</p>
            </div>
          )}

          <div className="space-y-2">
            <span className="font-semibold text-foreground block">Fitur & Modul Utama:</span>
            <div className="grid sm:grid-cols-2 gap-2">
              {preset.keyFeatures.map((feature) => (
                <div
                  key={feature}
                  className="flex items-center gap-2 rounded-md bg-accent/40 px-3 py-2 text-xs font-medium text-foreground"
                >
                  <CheckCircle2Icon className="size-4 shrink-0 text-primary" />
                  <span>{feature}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="space-y-1.5 pt-2">
            <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
              Ringkasan Teks (Siap Disalin):
            </label>
            <pre className="p-3 text-xs bg-muted/80 font-mono rounded-lg border border-border overflow-x-auto whitespace-pre-wrap">
              {formattedSummary}
            </pre>
          </div>
        </div>

        <DialogFooter className="flex-col sm:flex-row gap-2 pt-2 border-t border-border">
          <Button
            type="button"
            variant="outline"
            onClick={handleCopy}
            className="gap-2 sm:mr-auto"
          >
            {copied ? (
              <>
                <CheckIcon className="size-4 text-emerald-500" />
                Tersalin!
              </>
            ) : (
              <>
                <CopyIcon className="size-4" />
                Salin Ringkasan
              </>
            )}
          </Button>

          <DialogClose render={<Button variant="ghost" />}>Batal</DialogClose>

          <Button
            type="button"
            onClick={() => {
              toast.success(`Draft "${preset.title}" Terpilih!`, {
                description: "Pilihan Anda telah dikonfirmasi untuk tahap pengembangan selanjutnya.",
              });
              onOpenChange(false);
            }}
            className="gap-2"
          >
            <CheckIcon className="size-4" />
            Konfirmasi Pilihan Client
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
