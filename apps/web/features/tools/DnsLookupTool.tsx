"use client";

import { useState } from "react";
import { Clock, Globe, Search } from "lucide-react";
import { toast } from "sonner";
import { type DnsLookupResponse } from "@app/shared";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { apiFetch } from "@/lib/api-client";

export function DnsLookupTool() {
  const [domain, setDomain] = useState("google.com");
  const [recordType, setRecordType] = useState("ANY");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<DnsLookupResponse | null>(null);

  const handleLookup = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!domain.trim()) return;

    setLoading(true);
    try {
      const data = await apiFetch<DnsLookupResponse>("dnsLookup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ domain: domain.trim(), recordType }),
      });
      setResult(data);
      toast.success(`Ditemukan ${data.records.length} record DNS dalam ${data.responseTimeMs}ms`);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Gagal melakukan lookup DNS";
      toast.error(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-xl font-bold tracking-tight text-foreground flex items-center gap-2">
          <Globe className="size-5 text-primary" />
          DNS & Nameserver Lookup
        </h3>
        <p className="text-sm text-muted-foreground mt-1">
          Kueri record DNS domain secara instan via backend Bun.js dengan latensi rendah.
        </p>
      </div>

      <form onSubmit={handleLookup} className="flex flex-col sm:flex-row gap-3">
        <div className="flex-1 space-y-1">
          <Label htmlFor="domain" className="sr-only">
            Nama Domain
          </Label>
          <Input
            id="domain"
            placeholder="Masukkan domain (contoh: github.com atau google.com)"
            value={domain}
            onChange={(e) => setDomain(e.target.value)}
            required
          />
        </div>
        <div className="w-full sm:w-36">
          <select
            aria-label="Tipe Record DNS"
            className="w-full h-9 rounded-md border border-input bg-background px-3 text-sm shadow-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
            value={recordType}
            onChange={(e) => setRecordType(e.target.value)}
          >
            <option value="ANY">ANY (Semua)</option>
            <option value="A">A (IPv4)</option>
            <option value="AAAA">AAAA (IPv6)</option>
            <option value="MX">MX (Mail)</option>
            <option value="TXT">TXT (Text/SPF)</option>
            <option value="NS">NS (Nameserver)</option>
            <option value="CNAME">CNAME (Alias)</option>
          </select>
        </div>
        <Button type="submit" disabled={loading} className="gap-2">
          {loading ? (
            "Memeriksa..."
          ) : (
            <>
              <Search className="size-4" />
              Periksa DNS
            </>
          )}
        </Button>
      </form>

      {result && (
        <div className="rounded-xl border border-border bg-card p-5 space-y-4">
          <div className="flex flex-wrap items-center justify-between gap-2 border-b border-border pb-3">
            <div className="flex items-center gap-2">
              <span className="font-semibold text-foreground">{result.domain}</span>
              <span className="rounded bg-primary/10 px-2 py-0.5 text-xs font-semibold text-primary">
                Tipe: {result.recordType}
              </span>
            </div>
            <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
              <Clock className="size-3.5 text-primary" />
              <span>Response: {result.responseTimeMs} ms</span>
            </div>
          </div>

          {result.records.length === 0 ? (
            <p className="text-sm text-muted-foreground py-4 text-center">
              Tidak ditemukan record untuk domain ini atau tipe record yang dipilih.
            </p>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm">
                <thead>
                  <tr className="border-b border-border/80 text-xs uppercase text-muted-foreground">
                    <th className="py-2.5 px-3 font-semibold">Tipe</th>
                    <th className="py-2.5 px-3 font-semibold">Value / Target</th>
                    <th className="py-2.5 px-3 font-semibold text-right">TTL / Prioritas</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border/50 font-mono text-xs">
                  {result.records.map((rec, i) => (
                    <tr key={i} className="hover:bg-muted/30">
                      <td className="py-2.5 px-3 font-bold text-primary">{rec.type}</td>
                      <td className="py-2.5 px-3 text-foreground break-all">{rec.value}</td>
                      <td className="py-2.5 px-3 text-right text-muted-foreground">
                        {rec.priority !== undefined
                          ? `Prioritas: ${rec.priority}`
                          : rec.ttl
                          ? `${rec.ttl}s`
                          : "-"}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
