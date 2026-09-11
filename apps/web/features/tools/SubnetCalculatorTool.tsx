"use client";

import { useState } from "react";
import { Calculator, Network } from "lucide-react";
import { toast } from "sonner";
import { type SubnetCalcResponse } from "@app/shared";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { apiFetch } from "@/lib/api-client";

export function SubnetCalculatorTool() {
  const [ip, setIp] = useState("192.168.1.50");
  const [prefix, setPrefix] = useState(24);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<SubnetCalcResponse | null>(null);

  const handleCalculate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!ip.trim()) return;

    setLoading(true);
    try {
      const data = await apiFetch<SubnetCalcResponse>("subnetCalc", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ip: ip.trim(), prefix: Number(prefix) }),
      });
      setResult(data);
      toast.success(`Kalkulasi subnet ${data.networkAddress}/${data.prefix} selesai!`);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Gagal menghitung subnet";
      toast.error(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-xl font-bold tracking-tight text-foreground flex items-center gap-2">
          <Network className="size-5 text-primary" />
          Subnet & IPv4 CIDR Calculator
        </h3>
        <p className="text-sm text-muted-foreground mt-1">
          Hitung netmask, broadcast, wildcard mask, dan rentang alamat host IPv4 secara akurat.
        </p>
      </div>

      <form onSubmit={handleCalculate} className="flex flex-col sm:flex-row gap-3">
        <div className="flex-1 space-y-1">
          <Label htmlFor="subnet-ip" className="sr-only">
            Alamat IP
          </Label>
          <Input
            id="subnet-ip"
            placeholder="Contoh: 192.168.1.1 atau 10.0.0.1"
            value={ip}
            onChange={(e) => setIp(e.target.value)}
            required
          />
        </div>
        <div className="w-full sm:w-32">
          <Label htmlFor="subnet-prefix" className="sr-only">
            CIDR Prefix
          </Label>
          <select
            id="subnet-prefix"
            className="w-full h-9 rounded-md border border-input bg-background px-3 text-sm shadow-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring font-mono"
            value={prefix}
            onChange={(e) => setPrefix(Number(e.target.value))}
          >
            {Array.from({ length: 33 }, (_, i) => 32 - i).map((p) => (
              <option key={p} value={p}>
                /{p}
              </option>
            ))}
          </select>
        </div>
        <Button type="submit" disabled={loading} className="gap-2">
          {loading ? (
            "Menghitung..."
          ) : (
            <>
              <Calculator className="size-4" />
              Hitung Subnet
            </>
          )}
        </Button>
      </form>

      {result && (
        <div className="rounded-xl border border-border bg-card p-6 space-y-6">
          <div className="flex flex-wrap items-center justify-between gap-4 border-b border-border pb-4">
            <div>
              <span className="text-xs text-muted-foreground uppercase font-semibold">
                Network Identifier
              </span>
              <h4 className="text-2xl font-bold font-mono text-primary">
                {result.networkAddress} / {result.prefix}
              </h4>
            </div>
            <div className="rounded-lg bg-primary/10 px-3 py-1.5 text-xs font-semibold text-primary">
              Kelas IP: {result.ipClass}
            </div>
          </div>

          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 text-sm">
            <div className="rounded-lg border border-border/60 bg-muted/20 p-4 space-y-1">
              <span className="text-xs text-muted-foreground uppercase font-semibold">
                Subnet Mask
              </span>
              <p className="font-mono font-medium text-foreground">{result.netmask}</p>
            </div>

            <div className="rounded-lg border border-border/60 bg-muted/20 p-4 space-y-1">
              <span className="text-xs text-muted-foreground uppercase font-semibold">
                Wildcard Mask
              </span>
              <p className="font-mono font-medium text-foreground">{result.wildcardMask}</p>
            </div>

            <div className="rounded-lg border border-border/60 bg-muted/20 p-4 space-y-1">
              <span className="text-xs text-muted-foreground uppercase font-semibold">
                Broadcast Address
              </span>
              <p className="font-mono font-medium text-foreground">{result.broadcastAddress}</p>
            </div>

            <div className="rounded-lg border border-border/60 bg-muted/20 p-4 space-y-1">
              <span className="text-xs text-muted-foreground uppercase font-semibold">
                Host Pertama (First Usable)
              </span>
              <p className="font-mono font-medium text-foreground">{result.firstUsableIp}</p>
            </div>

            <div className="rounded-lg border border-border/60 bg-muted/20 p-4 space-y-1">
              <span className="text-xs text-muted-foreground uppercase font-semibold">
                Host Terakhir (Last Usable)
              </span>
              <p className="font-mono font-medium text-foreground">{result.lastUsableIp}</p>
            </div>

            <div className="rounded-lg border border-border/60 bg-muted/20 p-4 space-y-1">
              <span className="text-xs text-muted-foreground uppercase font-semibold">
                Kapasitas Usable Hosts
              </span>
              <p className="font-mono font-bold text-foreground">
                {result.usableHosts.toLocaleString()} Host
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
