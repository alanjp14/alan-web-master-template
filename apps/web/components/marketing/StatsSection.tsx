import { Clock, Cpu, Gauge, Globe2, ShieldCheck, Zap } from "lucide-react";

const stats = [
  {
    icon: Gauge,
    value: "99.99%",
    label: "SLA Uptime Commitment",
    desc: "Infrastruktur cloud dengan redundansi multi-region otomatis.",
  },
  {
    icon: Zap,
    value: "< 15ms",
    label: "Ultra-Low Latency",
    desc: "Dioptimalkan dengan Bun.js runtime & database query indexing.",
  },
  {
    icon: Globe2,
    value: "150+",
    label: "Enterprise Deployments",
    desc: "Projek web apps, cloud migration, dan API mission-critical.",
  },
  {
    icon: Clock,
    value: "24/7/365",
    label: "Active Monitoring & Support",
    desc: "Tim devops siaga penuh untuk memastikan kontinuitas sistem bisnis.",
  },
];

const techStacks = [
  { name: "Next.js 16", role: "Frontend App Router" },
  { name: "Bun.js", role: "High-Speed Runtime" },
  { name: "Hono", role: "Ultrafast Web API" },
  { name: "PostgreSQL", role: "Relational DB" },
  { name: "Drizzle ORM", role: "Type-Safe DB Layer" },
  { name: "Docker", role: "Containerization" },
  { name: "Kubernetes", role: "Cloud Orchestration" },
  { name: "TypeScript", role: "Strict Type Safety" },
];

export function StatsSection() {
  return (
    <section className="border-b border-border bg-background py-20">
      <div className="mx-auto w-full max-w-6xl px-4 sm:px-6 lg:px-8">
        {/* Metric Cards */}
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {stats.map((item) => (
            <div
              key={item.label}
              className="relative overflow-hidden rounded-xl border border-border bg-card p-6 shadow-sm"
            >
              <div className="flex items-center gap-3">
                <span className="grid size-10 place-items-center rounded-lg bg-primary/10 text-primary">
                  <item.icon className="size-5" />
                </span>
                <span className="text-3xl font-extrabold tracking-tight text-foreground">
                  {item.value}
                </span>
              </div>
              <h3 className="mt-4 font-semibold text-foreground">{item.label}</h3>
              <p className="mt-1 text-xs text-muted-foreground leading-relaxed">{item.desc}</p>
            </div>
          ))}
        </div>

        {/* Tech Stack Marquee / Bar */}
        <div className="mt-16 rounded-2xl border border-border bg-muted/30 p-8 sm:p-10">
          <div className="text-center max-w-2xl mx-auto">
            <h3 className="text-xl font-bold tracking-tight text-foreground">
              Modern Tech Stack Tanpa Kompromi
            </h3>
            <p className="mt-2 text-sm text-muted-foreground">
              Kami menggunakan teknologi generasi terbaru untuk memastikan skalabilitas, kecepatan eksekusi, dan keamanan aplikasi Anda.
            </p>
          </div>

          <div className="mt-8 grid grid-cols-2 gap-3 sm:grid-cols-4 lg:grid-cols-8">
            {techStacks.map((tech) => (
              <div
                key={tech.name}
                className="flex flex-col items-center justify-center rounded-lg border border-border/80 bg-background/80 p-3 text-center transition-colors hover:border-primary/50"
              >
                <span className="text-sm font-semibold text-foreground">{tech.name}</span>
                <span className="mt-0.5 text-[10px] text-muted-foreground">{tech.role}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
