import Link from "next/link";
import { ArrowRight, Globe, Lock, Network, Server, Terminal, Zap } from "lucide-react";
import { Button } from "@/components/ui/button";

const toolsPreview = [
  {
    icon: Globe,
    title: "DNS & Nameserver Lookup",
    desc: "Kueri instan record A, AAAA, MX, TXT, NS, CNAME dengan pengukuran latensi milidetik.",
  },
  {
    icon: Lock,
    title: "SSL/TLS Certificate Checker",
    desc: "Cek masa berlaku sertifikat, algoritma cipher, issuer, dan peringatan kedaluwarsa.",
  },
  {
    icon: Zap,
    title: "HTTP & Security Header Inspector",
    desc: "Analisis audit HSTS, CSP, X-Frame-Options, dan waktu respon TTFB server.",
  },
  {
    icon: Network,
    title: "Subnet & IPv4 CIDR Calculator",
    desc: "Hitung netmask, broadcast, wildcard mask, dan rentang host yang dapat digunakan.",
  },
];

export function ToolsTeaserSection() {
  return (
    <section className="border-b border-border bg-gradient-to-b from-muted/30 to-background py-20">
      <div className="mx-auto w-full max-w-6xl px-4 sm:px-6 lg:px-8">
        <div className="relative overflow-hidden rounded-2xl border border-primary/30 bg-card p-8 sm:p-12 shadow-md">
          {/* Subtle glow circle */}
          <div className="pointer-events-none absolute -right-20 -top-20 size-72 rounded-full bg-primary/15 blur-3xl" />

          <div className="relative z-10 max-w-3xl">
            <div className="inline-flex items-center gap-2 rounded-full bg-primary/10 px-3 py-1 text-xs font-semibold text-primary">
              <Terminal className="size-3.5" />
              <span>Free Developer & DevOps Utility</span>
            </div>
            <h2 className="mt-4 text-2xl font-bold tracking-tight sm:text-3xl text-balance">
              Coba Suite Web Tools Diagnostik IT Kami Secara Gratis
            </h2>
            <p className="mt-3 text-muted-foreground text-pretty sm:text-base">
              Didukung langsung oleh backend Bun.js performa tinggi. Lakukan pengecekan DNS, validasi
              sertifikat SSL/TLS, kalkulator subnet, hingga audit HTTP security header secara instan.
            </p>

            <div className="mt-8 grid gap-4 sm:grid-cols-2">
              {toolsPreview.map((tool) => (
                <div
                  key={tool.title}
                  className="flex items-start gap-3 rounded-lg border border-border/80 bg-background/80 p-3.5"
                >
                  <span className="grid size-8 shrink-0 place-items-center rounded bg-primary/10 text-primary">
                    <tool.icon className="size-4" />
                  </span>
                  <div>
                    <h3 className="text-sm font-semibold text-foreground">{tool.title}</h3>
                    <p className="text-xs text-muted-foreground mt-0.5">{tool.desc}</p>
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-8 pt-6 border-t border-border/60 flex flex-wrap items-center gap-4">
              <Button nativeButton={false} render={<Link href="/tools" />} size="lg" className="gap-2">
                Buka Web Tools IT Sekarang
                <ArrowRight className="size-4" />
              </Button>
              <span className="text-xs text-muted-foreground">
                Tanpa registrasi · Berbasis Bun API · 100% Gratis
              </span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
