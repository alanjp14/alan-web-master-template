"use client";

import { useState } from "react";
import { AlertTriangle, CheckCircle2, Lock, ShieldCheck, XCircle } from "lucide-react";
import { toast } from "sonner";
import { type SslCheckResponse } from "@app/shared";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { apiFetch } from "@/lib/api-client";

export function SslCheckerTool() {
  const [domain, setDomain] = useState("github.com");
  const [port, setPort] = useState(443);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<SslCheckResponse | null>(null);

  const handleCheck = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!domain.trim()) return;

    setLoading(true);
    try {
      const data = await apiFetch<SslCheckResponse>("sslCheck", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ domain: domain.trim(), port }),
      });
      setResult(data);
      if (data.valid) {
        toast.success(`Sertifikat SSL ${data.domain} aktif dan valid (${data.daysRemaining} hari tersisa).`);
      } else {
        toast.warning(`Sertifikat SSL untuk ${data.domain} tidak valid atau kedaluwarsa.`);
      }
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Gagal memeriksa sertifikat SSL";
      toast.error(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-xl font-bold tracking-tight text-foreground flex items-center gap-2">
          <Lock className="size-5 text-primary" />
          SSL / TLS Certificate Checker
        </h3>
        <p className="text-sm text-muted-foreground mt-1">
          Periksa masa berlaku, penerbit (CA), protokol enkripsi, dan keabsahan sertifikat SSL/TLS domain.
        </p>
      </div>

      <form onSubmit={handleCheck} className="flex flex-col sm:flex-row gap-3">
        <div className="flex-1 space-y-1">
          <Label htmlFor="ssl-domain" className="sr-only">
            Domain
          </Label>
          <Input
            id="ssl-domain"
            placeholder="Masukkan domain (contoh: github.com atau google.com)"
            value={domain}
            onChange={(e) => setDomain(e.target.value)}
            required
          />
        </div>
        <div className="w-full sm:w-28">
          <Label htmlFor="ssl-port" className="sr-only">
            Port
          </Label>
          <Input
            id="ssl-port"
            type="number"
            value={port}
            onChange={(e) => setPort(Number(e.target.value))}
            placeholder="443"
          />
        </div>
        <Button type="submit" disabled={loading} className="gap-2">
          {loading ? (
            "Memeriksa..."
          ) : (
            <>
              <ShieldCheck className="size-4" />
              Periksa SSL
            </>
          )}
        </Button>
      </form>

      {result && (
        <div className="rounded-xl border border-border bg-card p-6 space-y-6">
          {/* Status Header */}
          <div className="flex flex-wrap items-center justify-between gap-4 border-b border-border pb-4">
            <div className="flex items-center gap-3">
              {result.valid ? (
                <div className="grid size-10 place-items-center rounded-full bg-emerald-500/15 text-emerald-600 dark:text-emerald-400">
                  <CheckCircle2 className="size-6" />
                </div>
              ) : (
                <div className="grid size-10 place-items-center rounded-full bg-destructive/15 text-destructive">
                  <XCircle className="size-6" />
                </div>
              )}
              <div>
                <h4 className="text-lg font-bold text-foreground">{result.domain}</h4>
                <p className="text-xs text-muted-foreground">
                  Protokol: {result.protocol} · Cipher: {result.cipher || "Standard"}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <span
                className={`rounded-full px-3 py-1 text-xs font-bold ${
                  result.daysRemaining > 30
                    ? "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400"
                    : result.daysRemaining > 7
                    ? "bg-amber-500/10 text-amber-600 dark:text-amber-400"
                    : "bg-destructive/10 text-destructive"
                }`}
              >
                {result.daysRemaining} Hari Tersisa
              </span>
            </div>
          </div>

          {/* Details Grid */}
          <div className="grid gap-4 sm:grid-cols-2 text-sm">
            <div className="rounded-lg border border-border/60 bg-muted/20 p-4 space-y-1">
              <span className="text-xs text-muted-foreground uppercase font-semibold">
                Penerbit Sertifikat (Issuer CA)
              </span>
              <p className="font-medium text-foreground break-words">{result.issuer}</p>
            </div>

            <div className="rounded-lg border border-border/60 bg-muted/20 p-4 space-y-1">
              <span className="text-xs text-muted-foreground uppercase font-semibold">
                Subjek / Common Name
              </span>
              <p className="font-medium text-foreground break-words">{result.subject}</p>
            </div>

            <div className="rounded-lg border border-border/60 bg-muted/20 p-4 space-y-1">
              <span className="text-xs text-muted-foreground uppercase font-semibold">
                Masa Berlaku Dari (Valid From)
              </span>
              <p className="font-medium text-foreground font-mono text-xs">
                {new Date(result.validFrom).toLocaleDateString("id-ID", {
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                })}
              </p>
            </div>

            <div className="rounded-lg border border-border/60 bg-muted/20 p-4 space-y-1">
              <span className="text-xs text-muted-foreground uppercase font-semibold">
                Kedaluwarsa Pada (Valid To)
              </span>
              <p className="font-medium text-foreground font-mono text-xs">
                {new Date(result.validTo).toLocaleDateString("id-ID", {
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                })}
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
