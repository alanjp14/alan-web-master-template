"use client";

import { useState } from "react";
import { CheckCircle2, Clock, Globe, Shield, XCircle, Zap } from "lucide-react";
import { toast } from "sonner";
import { type HttpStatusResponse } from "@app/shared";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { apiFetch } from "@/lib/api-client";

export function HttpStatusTool() {
  const [url, setUrl] = useState("https://google.com");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<HttpStatusResponse | null>(null);

  const handleInspect = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!url.trim()) return;

    setLoading(true);
    try {
      const data = await apiFetch<HttpStatusResponse>("httpStatus", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ url: url.trim() }),
      });
      setResult(data);
      toast.success(`Respon HTTP ${data.status} ${data.statusText} (${data.responseTimeMs}ms)`);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Gagal menginspeksi URL";
      toast.error(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-xl font-bold tracking-tight text-foreground flex items-center gap-2">
          <Zap className="size-5 text-primary" />
          HTTP Status & Security Header Inspector
        </h3>
        <p className="text-sm text-muted-foreground mt-1">
          Ukur latensi server (TTFB), status response code, dan audit security headers penting (HSTS, CSP, X-Frame-Options).
        </p>
      </div>

      <form onSubmit={handleInspect} className="flex flex-col sm:flex-row gap-3">
        <div className="flex-1 space-y-1">
          <Label htmlFor="http-url" className="sr-only">
            URL
          </Label>
          <Input
            id="http-url"
            placeholder="Masukkan URL (contoh: https://google.com)"
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            required
          />
        </div>
        <Button type="submit" disabled={loading} className="gap-2">
          {loading ? (
            "Memeriksa..."
          ) : (
            <>
              <Globe className="size-4" />
              Inspeksi URL
            </>
          )}
        </Button>
      </form>

      {result && (
        <div className="rounded-xl border border-border bg-card p-6 space-y-6">
          <div className="flex flex-wrap items-center justify-between gap-4 border-b border-border pb-4">
            <div className="flex items-center gap-3">
              <span
                className={`rounded-lg px-3 py-1.5 font-mono text-sm font-bold ${
                  result.status >= 200 && result.status < 300
                    ? "bg-emerald-500/15 text-emerald-600 dark:text-emerald-400"
                    : result.status >= 300 && result.status < 400
                    ? "bg-blue-500/15 text-blue-600 dark:text-blue-400"
                    : "bg-destructive/15 text-destructive"
                }`}
              >
                {result.status} {result.statusText}
              </span>
              <span className="text-sm text-foreground font-medium break-all">{result.url}</span>
            </div>

            <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
              <Clock className="size-3.5 text-primary" />
              <span>TTFB Latency: {result.responseTimeMs} ms</span>
            </div>
          </div>

          {/* Security Headers Checklist */}
          <div>
            <h4 className="text-sm font-semibold text-foreground flex items-center gap-2 mb-3">
              <Shield className="size-4 text-primary" />
              Audit Security Headers
            </h4>
            <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3 text-xs">
              <div className="flex items-center justify-between rounded-lg border border-border/60 bg-muted/20 p-3">
                <span className="font-mono">HSTS (Strict-Transport)</span>
                {result.securityAudit.hsts ? (
                  <CheckCircle2 className="size-4 text-emerald-500" />
                ) : (
                  <XCircle className="size-4 text-muted-foreground" />
                )}
              </div>

              <div className="flex items-center justify-between rounded-lg border border-border/60 bg-muted/20 p-3">
                <span className="font-mono">CSP (Content-Security)</span>
                {result.securityAudit.csp ? (
                  <CheckCircle2 className="size-4 text-emerald-500" />
                ) : (
                  <XCircle className="size-4 text-muted-foreground" />
                )}
              </div>

              <div className="flex items-center justify-between rounded-lg border border-border/60 bg-muted/20 p-3">
                <span className="font-mono">X-Frame-Options (Clickjack)</span>
                {result.securityAudit.xFrameOptions ? (
                  <CheckCircle2 className="size-4 text-emerald-500" />
                ) : (
                  <XCircle className="size-4 text-muted-foreground" />
                )}
              </div>

              <div className="flex items-center justify-between rounded-lg border border-border/60 bg-muted/20 p-3">
                <span className="font-mono">X-Content-Type-Options</span>
                {result.securityAudit.xContentTypeOptions ? (
                  <CheckCircle2 className="size-4 text-emerald-500" />
                ) : (
                  <XCircle className="size-4 text-muted-foreground" />
                )}
              </div>

              <div className="flex items-center justify-between rounded-lg border border-border/60 bg-muted/20 p-3">
                <span className="font-mono">Referrer-Policy</span>
                {result.securityAudit.referrerPolicy ? (
                  <CheckCircle2 className="size-4 text-emerald-500" />
                ) : (
                  <XCircle className="size-4 text-muted-foreground" />
                )}
              </div>
            </div>
          </div>

          {/* Raw Response Headers */}
          <div>
            <h4 className="text-xs font-semibold text-muted-foreground uppercase mb-2">
              Response Headers
            </h4>
            <div className="max-h-48 overflow-y-auto rounded-lg border border-border/60 bg-muted/30 p-3 font-mono text-xs">
              {Object.entries(result.headers).map(([k, v]) => (
                <div key={k} className="py-0.5 break-all">
                  <span className="font-semibold text-primary">{k}:</span>{" "}
                  <span className="text-foreground">{v}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
