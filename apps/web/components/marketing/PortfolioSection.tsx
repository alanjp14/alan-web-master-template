import { ArrowUpRight, CheckCircle, Database, Lock, Server, Zap } from "lucide-react";
import { Badge } from "@/components/ui/badge";

const caseStudies = [
  {
    title: "Migrasi Cloud & Modernisasi ERP Enterprise",
    client: "Fintech & Multifinance Group",
    category: "Cloud & DevOps",
    challenge: "Infrastruktur on-premise lama lambat, biaya server bengkak, dan sering mengalami downtime saat akhir bulan.",
    solution: "Migrasi penuh ke Kubernetes multi-region AWS dengan containerization Docker dan PostgreSQL cluster terkelola.",
    impact: [
      "Penurunan biaya infrastruktur sebesar 45%",
      "Uptime meningkat dari 99.1% menjadi 99.99%",
      "Pencadangan data otomatis dengan RPO < 5 menit",
    ],
    tech: ["AWS EKS", "Terraform", "PostgreSQL", "Docker", "CI/CD"],
  },
  {
    title: "Engine Pembayaran & API Transaksi Berkecepatan Tinggi",
    client: "Digital Payment Gateway Provider",
    category: "Software Engineering",
    challenge: "API gateway lama berbasis Node.js sering mengalami bottleneck throughput saat flash sale (5,000+ request/detik).",
    solution: "Rekayasa ulang core API menggunakan runtime Bun.js + Hono, Redis caching layer, dan asynchronous worker.",
    impact: [
      "Throughput melonjak hingga 12,500+ TPS stabil",
      "Latensi response terpangkas dari 180ms ke 12ms",
      "Zero failed transactions akibat memory leak",
    ],
    tech: ["Bun.js", "Hono", "Redis", "TypeScript", "PostgreSQL"],
  },
  {
    title: "Sistem Informasi Manajemen Rumah Sakit (SIMRS)",
    client: "Healthcare Network Indonesia",
    category: "Enterprise Web Apps",
    challenge: "Sistem rekam medis terfragmentasi, pencatatan resep manual, dan tidak adanya audit kepatuhan enkripsi data pasien.",
    solution: "Pengembangan portal web terintegrasi Next.js 16 dengan role-based access control, audit trail, dan standar kepatuhan HIPAA.",
    impact: [
      "Efisiensi administrasi pasien meningkat 60%",
      "Enkripsi data end-to-end at-rest & in-transit",
      "Pemberitahuan resep & jadwal dokter real-time",
    ],
    tech: ["Next.js 16", "Better Auth", "Drizzle ORM", "Tailwind v4"],
  },
];

export function PortfolioSection() {
  return (
    <section id="portfolio" className="border-b border-border bg-background py-20">
      <div className="mx-auto w-full max-w-6xl px-4 sm:px-6 lg:px-8">
        <div className="max-w-2xl">
          <Badge variant="outline" className="text-primary border-primary/30">
            Studi Kasus & Portofolio
          </Badge>
          <h2 className="mt-3 text-3xl font-bold tracking-tight sm:text-4xl text-balance">
            Hasil Nyata yang Kami Hadirkan untuk Mitra Bisnis Kami
          </h2>
          <p className="mt-3 text-muted-foreground text-pretty">
            Pelajari bagaimana rekayasa arsitektur modern dan teknologi mutakhir mentransformasi efisiensi dan performa bisnis klien kami.
          </p>
        </div>

        <div className="mt-12 grid gap-8 lg:grid-cols-3">
          {caseStudies.map((study) => (
            <div
              key={study.title}
              className="flex flex-col justify-between rounded-xl border border-border bg-card p-6 shadow-sm transition-all hover:border-primary/50 hover:shadow-md"
            >
              <div>
                <div className="flex items-center justify-between">
                  <span className="text-xs font-semibold text-primary uppercase tracking-wide">
                    {study.category}
                  </span>
                  <Badge variant="secondary" className="text-[10px]">
                    {study.client}
                  </Badge>
                </div>
                <h3 className="mt-4 text-lg font-bold tracking-tight text-foreground">
                  {study.title}
                </h3>
                <div className="mt-4 space-y-3 text-xs text-muted-foreground">
                  <div>
                    <strong className="text-foreground font-medium">Tantangan: </strong>
                    {study.challenge}
                  </div>
                  <div>
                    <strong className="text-foreground font-medium">Solusi: </strong>
                    {study.solution}
                  </div>
                </div>

                {/* Impact List */}
                <div className="mt-5 pt-4 border-t border-border/60">
                  <h4 className="text-xs font-semibold text-foreground uppercase tracking-wide">
                    Dampak Terukur:
                  </h4>
                  <ul className="mt-2 space-y-1.5">
                    {study.impact.map((item) => (
                      <li key={item} className="flex items-start gap-2 text-xs text-muted-foreground">
                        <CheckCircle className="size-3.5 text-primary shrink-0 mt-0.5" />
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              {/* Tech Tags */}
              <div className="mt-6 pt-4 border-t border-border/50 flex flex-wrap gap-1.5">
                {study.tech.map((t) => (
                  <span
                    key={t}
                    className="rounded bg-muted px-2 py-0.5 text-[10px] font-medium text-muted-foreground"
                  >
                    {t}
                  </span>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
